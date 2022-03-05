import input from "@/classes/Input.js";
import Ticker from "@/classes/Ticker.js";
import AudioPlayer from "@/classes/AudioPlayer.js";
import SequenceController from "@/classes/SequenceController.js";
import EventNames from "@/events/EventNames.js";
class Parachute {
  constructor() {
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
    this.audioPlayer = new AudioPlayer();
    this.paraTrooperSquadWithBoatCurrent;
    this.tickerParaTroopers = new Ticker(1000, 3);
    this.tickerDeath = new Ticker(500, 1);
    this.onTickerParaTroopersCache = this.onTickerParaTroopers.bind(this);
    this.tickerParaTroopers.addEventListener(
      EventNames.ON_TICKER,
      this.onTickerParaTroopersCache
    );
    this.onTickerDeathCache = this.onTickerDeath.bind(this);
    this.tickerDeath.addEventListener(
      EventNames.ON_TICKER,
      this.onTickerDeathCache
    );
    this.paused = false;
    this.allowPlayerMovement = false;
  }
  set viewer(value) {
    this._viewer = value;
  }
  initiate() {
    this._viewer.lookAt(this.boat.index);
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
  }
  moveLeft() {
    if (this.paused) return;
    if (!this.allowPlayerMovement) return;
    if (this.boat.moveLeft()) {
      this._viewer.lookAt(this.boat.index);
      this.updateParaTrooperSquadWithBoat(this.boat.index);
      this.updateDisplaySequence(this.boat);
      this.audioPlayer.play("SFXMove");
    }
  }
  moveRight() {
    if (this.paused) return;
    if (!this.allowPlayerMovement) return;
    if (this.boat.moveRight()) {
      this._viewer.lookAt(this.boat.index);
      this.updateParaTrooperSquadWithBoat(this.boat.index);
      this.updateDisplaySequence(this.boat);
      this.audioPlayer.play("SFXMove");
    }
  }
  updateParaTrooperSquadWithBoat(index) {
    //handle current squad with boat before updating setting boat available to false
    if (this.paraTrooperSquadWithBoatCurrent) {
      //if a paratrooper was saved the display has a slight delay
      //since the boat is moving we cant have the character still there
      //so check for pending save clear and if found just complete it directly
      if (this.paraTrooperSquadWithBoatCurrent.clearSavedParatrooperPending) {
        this.paraTrooperSquadWithBoatCurrent.clearSavedParatrooper();
        this.updateDisplaySequence(this.paraTrooperSquadWithBoatCurrent);
      }
      this.paraTrooperSquadWithBoatCurrent.setBoatAvailable(false);
    }
    //set current squad with boat now and set boat available to true
    this.paraTrooperSquadWithBoatCurrent = this["squad" + this.boat.index];
    this.paraTrooperSquadWithBoatCurrent.setBoatAvailable(true);
    //validate a saved paratrooper
    this.validateParatrooperSave(this.paraTrooperSquadWithBoatCurrent);
  }
  updateDisplaySequence(sequence) {
    this._viewer.updateSprites(sequence);
  }

  gameStart() {
    //reset the game
    this.resetGame();
    //start the ticker, will remove any running ticker;
    this.tickerParaTroopers.start();
  }
  gameEnd() {
    this.tickerParaTroopers.stop();
  }
  executeDeathSequence(squad, index) {
    //the death sequence has a small amount of grace time before it runs,
    //when this is then called , validate that the sequence is in fact still required
    //because the player may have avoided the situation within the grace time
    if (squad.pendingDeath) {
      //
      squad.death();
      this.updateDisplaySequence(squad);
      this.allowPlayerMovement = false;
      this.tickerParaTroopers.stop();
      this.death.index = index;
      this.tickerDeath.start();
    }
  }
  onTickerDeath() {
    if (!this.death.process()) {
      //death sequence complete
      this.tickerDeath.stop();
      if (this.lives.process()) {
        //still have lives so call post death on paratroopers
        //allow movement and start trooper ticker again
        this.lives.displayManditorySprites(true);
        this.squad0.postDeathprocess();
        this.squad1.postDeathprocess();
        this.squad2.postDeathprocess();
        this.updateDisplaySequence(this.squad0);
        this.updateDisplaySequence(this.squad1);
        this.updateDisplaySequence(this.squad2);
        this.allowPlayerMovement = true;
        this.tickerParaTroopers.start();
      }

      this.updateDisplaySequence(this.lives);
    }
    //process display of sprites
    this.updateDisplaySequence(this.death);
    this.audioPlayer.play("SFXMiss");
  }
  validateParatrooperSave(squad) {
    if (squad.didSaveParatrooper()) {
      this.scoreclock.incrementBy(1);
      this.audioPlayer.play("SFXSuccess_1");
      squad.clearSavedParatrooperPending = true;
      setTimeout(() => {
        squad.clearSavedParatrooper();
        this.updateDisplaySequence(squad);
      }, 500);
    }
  }
  onTickerParaTroopers(index) {
    if (this.paused) return;
    this.chopper.process();
    this.updateDisplaySequence(this.chopper);
    let pts = this["squad" + index];
    if (!pts.process()) {
      setTimeout(() => {
        this.executeDeathSequence(pts, index);
      }, 300);
    } else {
      //validate a saved paratrooper
      this.validateParatrooperSave(pts);
      if (pts.hasActiveTroopers) {
        this.audioPlayer.play("SFXTick");
      }
    }
    //process display of sprites
    this.updateDisplaySequence(pts);
  }
  resetGame() {
    this.paused = false;
    this.sc.reset();
    this.tickerParaTroopers.reset();
    this._viewer.lookAt(this.boat.index);
    this.updateParaTrooperSquadWithBoat(this.boat.index);
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
    this.allowPlayerMovement = true;
  }
}
let singlton = new Parachute();
export default singlton;
