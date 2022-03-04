import input from "@/classes/Input.js";
import Ticker from "@/classes/Ticker.js";
import BoatSequence from "@/classes/BoatSequence.js";
import DeathSequence from "@/classes/DeathSequence.js";
import LivesSequence from "@/classes/LivesSequence.js";
import ScoreClock from "@/classes/ScoreClock.js";
import ParatrooperSquadSequence from "@/classes/ParatrooperSquadSequence.js";

import EventNames from "@/events/EventNames.js";

class Parachute {
  constructor() {
    this.livesSequence = new LivesSequence([
      ["shark_0", "miss"],
      "shark_1",
      "shark_2",
    ]);
    this.boatSequence = new BoatSequence(["boat_1", "boat_2", "boat_3"]);
    this.scoreClock = new ScoreClock();
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
    this.lives = 3;
    this.allowPlayerMovement = false;
    this.paraTrooperSquadSequence0 = new ParatrooperSquadSequence([
      "pt_0_0",
      "pt_0_1",
      "pt_0_2",
      "pt_0_3",
      "pt_0_4",
    ]);
    this.paraTrooperSquadSequence1 = new ParatrooperSquadSequence([
      "pt_1_0",
      "pt_1_1",
      "pt_1_2",
      "pt_1_3",
      "pt_1_4",
      "pt_1_5",
    ]);
    this.paraTrooperSquadSequence2 = new ParatrooperSquadSequence([
      "pt_2_0",
      "pt_2_1",
      "pt_2_2",
      "pt_2_3",
      "pt_2_4",
      "pt_2_5",
      "pt_2_6",
    ]);
    this.deathSequence = new DeathSequence([
      "ptw_0_0",
      ["ptw_1_0", "ptw_1_1"],
      ["ptw_2_0", "ptw_2_1"],
      ["ptw_3_0", "ptw_3_1"],
      ["ptw_4_0", "ptw_4_1"],
      ["ptw_5_0", "ptw_5_1"],
    ]);
  }
  set viewer(value) {
    this._viewer = value;
  }
  initiate() {
    this._viewer.lookAt(this.playerXIndex);
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
    this.boatSequence.moveLeft();
    this._viewer.lookAt(this.boatSequence.index);
    this.updateParaTrooperSquadWithBoat(this.boatSequence.index);
    this.updateDisplaySequence(this.boatSequence);
  }
  moveRight() {
    if (this.paused) return;
    if (!this.allowPlayerMovement) return;
    this.boatSequence.moveLeft();
    this._viewer.lookAt(this.boatSequence.index);
    this.updateParaTrooperSquadWithBoat(this.boatSequence.index);
    this.updateDisplaySequence(this.boatSequence);
  }
  updateParaTrooperSquadWithBoat(index) {
    if (this.paraTrooperSquadWithBoatCurrent) {
      this.paraTrooperSquadWithBoatCurrent.setBoatAvailable(false);
    }
    this.paraTrooperSquadWithBoatCurrent =
      this["paraTrooperSquadSequence" + index];
    this.paraTrooperSquadWithBoatCurrent.setBoatAvailable(true);
  }
  updateDisplaySequence(sequence) {
    this._viewer.updateSprites(sequence);
  }
  resetGame() {
    this.paused = false;
    this.lives = 3;
    this.paraTrooperSquadSequence0.reset();
    this.paraTrooperSquadSequence1.reset();
    this.paraTrooperSquadSequence2.reset();
    this.tickerParaTroopers.reset();
    this.deathSequence.reset();
    this.boatSequence.reset();
    this.livesSequence.reset();
    this._viewer.lookAt(this.boatSequence.index);
    this.updateParaTrooperSquadWithBoat(this.boatSequence.index);
    this.updateDisplaySequence(this.boatSequence);
    this.updateDisplaySequence(this.paraTrooperSquadSequence0);
    this.updateDisplaySequence(this.paraTrooperSquadSequence1);
    this.updateDisplaySequence(this.paraTrooperSquadSequence2);
    this.updateDisplaySequence(this.deathSequence);
    this.updateDisplaySequence(this.livesSequence);
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
      this.allowPlayerMovement = false;
      this.tickerParaTroopers.stop();
      this.deathSequence.index = index;
      this.tickerDeath.start();
    }
  }
  onTickerDeath() {
    if (!this.deathSequence.process()) {
      //death sequence complete
      if (!this.livesSequence.process()) {
        //all lives used up so its game over!
      } else {
        this.updateDisplaySequence(this.livesSequence);
      }
    } else {
      //process display of sprites
      this.updateDisplaySequence(this.deathSequence);
    }
  }
  onTickerParaTroopers(index) {
    if (this.paused) return;
    let pts = this["paraTrooperSquadSequence" + index];
    if (!pts.process()) {
      setTimeout(() => {
        this.executeDeathSequence(pts, index);
      }, 300);
    } else {
      //process display of sprites
      this.updateDisplaySequence(pts);
      //validate a saved paratrooper
      if (pts.didSaveParatrooper()) {
        //increment score
      }
    }
  }
}
let singlton = new Parachute();
export default singlton;
