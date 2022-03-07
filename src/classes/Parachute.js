import input from "@/classes/Input.js";
import Ticker from "@/classes/Ticker.js";
import AudioPlayer from "@/classes/AudioPlayer.js";
import SequenceController from "@/classes/SequenceController.js";
import EventNames from "@/events/EventNames.js";
class Parachute {
  constructor() {
    //sequence controller helping to group all sequences together
    // but for use in here , I assign the properties to local variables
    //to make the code neater.
    this.sc = new SequenceController();
    this.boat = this.sc.getSequence(this.sc.BOAT);
    this.squad0 = this.sc.getSequence(this.sc.SQUAD0);
    this.squad0b = this.sc.getSequence(this.sc.SQUAD0B);
    this.squad1 = this.sc.getSequence(this.sc.SQUAD1);
    this.squad2 = this.sc.getSequence(this.sc.SQUAD2);
    this.death = this.sc.getSequence(this.sc.DEATH);
    this.lives = this.sc.getSequence(this.sc.LIVES);
    this.alarm = this.sc.getSequence(this.sc.ALARM);
    this.chopper = this.sc.getSequence(this.sc.CHOPPER);
    this.scoreclock = this.sc.getSequence(this.sc.SCORECLOCK);
    this.shark = this.sc.getSequence(this.sc.SHARK);

    //used to check if no paratroopers are on screen for any of the squads
    this.noTroopers = false;
    //used in conjuction with above to force a spawn
    this.mustSpawnTrooper = false;
    this.mustSpawnTrooperIndex = 0;

    //ticker for the clock
    this.tickerTime = new Ticker(1000, 1);
    this.tickerTime.addEventListener(
      EventNames.ON_TICKER,
      this.onTickerTime.bind(this)
    );

    //audio class uses howler library
    this.audioPlayer = new AudioPlayer();
    //when moving the boat left and right , the boat assigns itself to a paratrooper squad
    //this class then also caches which squad that is
    this.paraTrooperSquadWithBoatCurrent;
    //ticker for paratroopers
    this.tickerParaTroopers = new Ticker(700, 3);
    this.onTickerParaTroopersCache = this.onTickerParaTroopers.bind(this);
    this.tickerParaTroopers.addEventListener(
      EventNames.ON_TICKER,
      this.onTickerParaTroopersCache
    );
    //ticker for death sequence
    this.tickerDeath = new Ticker(500, 1);
    this.onTickerDeathCache = this.onTickerDeath.bind(this);
    this.tickerDeath.addEventListener(
      EventNames.ON_TICKER,
      this.onTickerDeathCache
    );

    //ticker for shark sequence
    this.tickerShark = new Ticker(500, 1);
    this.onTickerSharkCache = this.onTickerShark.bind(this);
    this.tickerShark.addEventListener(
      EventNames.ON_TICKER,
      this.onTickerSharkCache
    );

    this.paused = false;
    this.allowPlayerMovement = false;
  }
  set viewer(value) {
    //viewer can be any class created to display the game in the browser
    //currently I use a 3d display using babylon engine.
    // the viewer interface is two functions ,
    // 1 lookAt(index) // index being the boat position
    // 2 updateSprites // I pass sequence classes to this function,

    this._viewer = value;
  }
  initiate() {
    //called only once when game loads
    //set up the input class listeners
    //left,right,pause,newgame,debug
    input.active = true;
    input.removeAllEventListeners();
    input.addEventListener(EventNames.MOVE_LEFT, this.moveLeft.bind(this));
    input.addEventListener(EventNames.MOVE_RIGHT, this.moveRight.bind(this));
    input.addEventListener(EventNames.PAUSE, () => {
      this.paused = !this.paused;
    });
    input.addEventListener(EventNames.NEW_GAME, this.gameStart.bind(this));
    input.addEventListener(EventNames.DEBUG, () => {
      this._viewer.toggleDebug();
    });
    //start the clock ticker
    this.tickerTime.start();
  }
  onTickerTime() {
    //ticker listener for updating the clock  , only used during game initilize view just for fun
    // once the game starts the digital display is used to display the score and this ticker is stopped
    this.scoreclock.onTickerTime();
    this.updateDisplaySequence(this.scoreclock);
  }
  moveLeft() {
    if (this.paused) return;
    if (!this.allowPlayerMovement) return;
    //function call returns a boolean of true if the boat actual changed position due to key press
    //or returns false if already at the min or max position and cant move.
    if (this.boat.moveLeft()) {
      //call to viewer to know the boat position ( curently used to tilt the device)
      this._viewer.lookAt(this.boat.index);
      //see functions for comments on functionality
      this.updateParaTrooperSquadWithBoat(this.boat.index);
      this.updateDisplaySequence(this.boat);
      //play sound
      this.audioPlayer.play("SFXMove");
    }
  }
  moveRight() {
    if (this.paused) return;
    if (!this.allowPlayerMovement) return;
    //function call returns a boolean of true if the boat actual changed position due to key press
    //or returns false if already at the min or max position and cant move.
    if (this.boat.moveRight()) {
      //call to viewer to know the boat position ( curently used to tilt the device)
      this._viewer.lookAt(this.boat.index);
      //see functions for comments on functionality
      this.updateParaTrooperSquadWithBoat(this.boat.index);
      this.updateDisplaySequence(this.boat);
      //play sound
      this.audioPlayer.play("SFXMove");
    }
  }
  updateParaTrooperSquadWithBoat(index) {
    //when the boat moves we must do two things
    //first work on the current refernced paratrooper squad
    //then set the next paratrooper squad

    //handle the squad the player moved away from
    if (this.paraTrooperSquadWithBoatCurrent) {
      //if a paratrooper was saved the display has a slight delay
      //since the boat is moving away we cant have the character still there
      //so check for pending save clear and process directly directly
      if (this.paraTrooperSquadWithBoatCurrent.clearSavedParatrooperPending) {
        this.paraTrooperSquadWithBoatCurrent.clearSavedParatrooper();
        this.updateDisplaySequence(this.paraTrooperSquadWithBoatCurrent);
      }
      this.paraTrooperSquadWithBoatCurrent.setBoatAvailable(false);
    }
    //set and handle the squad the player is now active on
    this.paraTrooperSquadWithBoatCurrent = this["squad" + this.boat.index];
    this.paraTrooperSquadWithBoatCurrent.setBoatAvailable(true);
    //validate a saved paratrooper , check function for comment on functionality
    this.validateParatrooperSave(this.paraTrooperSquadWithBoatCurrent);
  }
  updateDisplaySequence(sequence) {
    // pass sequence to viewer, internally the viewer expects to find two possible arrays sequenceData and manditoryData
    // in those arrays are objects with two properties , "sprite" and "mask"   - to target a sprite and sets it display to true or false
    this._viewer.updateSprites(sequence);
  }

  gameStart() {
    //i have no game b , just a hack to manage the game a/b sprites
    this.updateDisplaySequence({
      sequenceData: [{ sprite: "game_b", mask: false }],
    });
    //reset the game
    this.resetGame();
    //start the paratroopers ticker.
    this.tickerParaTroopers.start();
    //start the shark ticker
    this.startSharkTickerViaDelay();
  }
  gameEnd() {
    //stop the paratroopers ticker.
    this.tickerParaTroopers.stop();
    this.tickerShark.stop();
    clearTimeout(this.sharkTickerStartDelay);
  }
  executeDeathSequence(squad, index) {
    //when a paratrooper reaches the final position in the sequence , death is pending and there is a small delay to allow saves just after this position is reached,
    //this function is called once the delay has completed
    //if the player has saved the paratrooper within the delay time
    // then there is no longer a pending death , so check this now
    if (squad.pendingDeath) {
      //these lines of code start the ticker for the death sequence,
      //as part of the sequence the paratrooper is removed from the last position because he will now be displayed in the water
      squad.death();
      this.updateDisplaySequence(squad);
      //flag to prevent player left/right input during the death sequence
      this.allowPlayerMovement = false;
      //stop the paratrooper ticker while the death sequence is playing
      this.tickerParaTroopers.stop();
      //the index of the boat/squad is passed to the death sequence to offset at what position the sequence starts
      this.death.index = index;
      //stop the shark ticker and settimeout delay for starting the ticker
      //also call reset to clear any masks and update display
      //or else this will interfer with the death sequence
      clearTimeout(this.sharkTickerStartDelay);
      this.tickerShark.stop();
      this.shark.reset();
      this.updateDisplaySequence(this.shark);

      //start death ticker
      this.tickerDeath.start();
    }
  }
  startSharkTickerViaDelay() {
    this.sharkTickerStartDelay = setTimeout(() => {
      console.log(this.tickerShark);
      this.tickerShark.start();
    }, 10000);
  }

  onTickerShark() {
    if (!this.shark.process()) {
      this.tickerShark.stop();
      this.startSharkTickerViaDelay();
    }
    //update the viewer with the ammended data from the death sequence step
    this.updateDisplaySequence(this.shark);
  }
  onTickerDeath() {
    //calling the death sequence process function , advances the index of the sequence
    //and updates the data mask values to hide/show sprites
    //if it is still busy it returns true , when complete it returns false
    if (!this.death.process()) {
      //death sequence complete , stop the ticker
      this.tickerDeath.stop();
      //calling the lives sequence process function ,
      //updates the data mask values to hide/show sprites
      //if the player still have lives to play it returns true , else it is game over and returns false
      if (this.lives.process()) {
        //still have lives so call post death on paratroopers
        //allow movement and start trooper ticker again to continue playing
        //see postDeathprocess function for comment on functionality
        this.lives.displayManditorySprites(true);
        this.squad0.postDeathprocess();
        this.squad1.postDeathprocess();
        this.squad2.postDeathprocess();
        this.updateDisplaySequence(this.squad0);
        this.updateDisplaySequence(this.squad1);
        this.updateDisplaySequence(this.squad2);
        this.allowPlayerMovement = true;
        this.tickerParaTroopers.start();
        this.startSharkTickerViaDelay();
      }
      //update the viewer with the ammended data from the lives sequence step
      this.updateDisplaySequence(this.lives);
    }
    //update the viewer with the ammended data from the death sequence step
    this.updateDisplaySequence(this.death);
    //play audio
    this.audioPlayer.play("SFXMiss");
  }
  validateParatrooperSave(squad) {
    //calling didSaveParatrooper on a squad
    //returns the pendingSave flag , and if true , it sets the flag to false again
    //since if true it is going to be process right now as a successful save
    if (squad.didSaveParatrooper()) {
      //increment score
      this.scoreclock.incrementBy(1);
      this.updateDisplaySequence(this.scoreclock);
      this.audioPlayer.play("SFXSuccess_1");
      //this flag is set because there is a small time delay to set the saved paratroopers sprite to false , so it does not dissapear instantly,
      //code execution is fast enough to not even see the character in position if you dont do this
      //the flag is used when the boat is moved during this delay. which will then process the save immediately in the same manner as the delay callback below
      squad.clearSavedParatrooperPending = true;
      setTimeout(() => {
        //set clearSavedParatrooperPending to false , updates mask to hide sprite now nad reevaluates if the squad has any active sprites
        squad.clearSavedParatrooper();
        this.updateDisplaySequence(squad);
      }, 500);
    }
  }
  onTickerParaTroopers(index) {
    //when game is paused just ignore processing the ticker , the ticker is not actually stopped
    if (this.paused) return;

    //the chopper sequence does not need its own ticker , it just piggy backs of the paratroopers ticker here
    this.chopper.process();
    this.updateDisplaySequence(this.chopper);

    //reset no troopers count
    if (index === 0) {
      this.noTroopers = 0;
    }
    //get reference to a squad
    let pts = this["squad" + index];

    // if no troopers were on screen in previous tick
    //then a force sawn is used, this just sets up some flags
    //so can call process as normal , inside the process function
    //it will use these flags as needed and then remove them
    if (this.mustSpawnTrooper) {
      if (index === this.mustSpawnTrooperIndex) {
        pts.mustSpawnTrooper = true;
      } else {
        pts.ignoreSpawnTrooper = true;
      }
    }
    // call process
    //if it returns false it means there is a pending death
    //if true just check for a possible save and active troopers
    if (!pts.process()) {
      setTimeout(() => {
        this.executeDeathSequence(pts, index);
      }, 300);
    } else {
      //validate a saved paratrooper
      this.validateParatrooperSave(pts);
      if (pts.hasActiveTroopers) {
        this.noTroopers++;
        this.audioPlayer.play("SFXTick");
      }
      //incase there are no more troopers on screen ( when this.noTroopers === 0) , you dont want
      //to continue to have none so force a spawn on one of the three squads
      //and on the other two skip, this is processed on the next tick
      if (index === 2) {
        if (this.noTroopers === 0) {
          this.mustSpawnTrooper = true;
          this.mustSpawnTrooperIndex = Math.ceil(Math.random() * 3) - 1;
        } else {
          this.mustSpawnTrooper = false;
        }
      }
    }
    //process display of sprites
    this.updateDisplaySequence(pts);
  }
  resetGame() {
    //hey its a reset function .. just gets states all sorted out to start another game
    //it is possible to start a new game at any time
    this.tickerTime.stop();
    this.paused = false;
    //clear shark ticker timout
    clearTimeout(this.sharkTickerStartDelay);
    //calling reset on sequence controller will call reset functions on all sequences
    this.sc.reset();
    //reset paratroopers ticker
    this.tickerParaTroopers.reset();
    //the boat sequence is reset so adjust the view with the reset index
    this._viewer.lookAt(this.boat.index);
    //the boat position/index is reset so perform the needed logic
    //on reset it really only is about setting the relevant squad to know the boat is available
    this.updateParaTrooperSquadWithBoat(this.boat.index);
    // the sequence controller does not have a reference to the viewer
    // so call to update the displays of all sequences
    //can use the local properties assigned to point to each sequence
    this.updateDisplaySequence(this.boat);
    this.updateDisplaySequence(this.squad0);
    this.updateDisplaySequence(this.squad0b);
    this.updateDisplaySequence(this.squad1);
    this.updateDisplaySequence(this.squad2);
    this.updateDisplaySequence(this.death);
    this.updateDisplaySequence(this.lives);
    this.updateDisplaySequence(this.alarm);
    this.updateDisplaySequence(this.chopper);
    this.updateDisplaySequence(this.scoreclock);
    this.updateDisplaySequence(this.shark);
    this.allowPlayerMovement = true;
  }
}
let singlton = new Parachute();
export default singlton;
