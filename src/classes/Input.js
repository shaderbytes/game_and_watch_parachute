const ObjectExtendUtil = require("@/utils/ObjectExtendUtil.js");
const PublishSubscribe = require("@/events/PublishSubscribe.js");
const EventNames = require("@/events/EventNames.js");

class Input {
  constructor() {
    ObjectExtendUtil.extend(this, PublishSubscribe);
    this._disable = false;
    this._active = false;
  }
  set disable(state) {
    this._disable = state;
  }
  set active(state) {
    this._active = state;
    if (state) {
      document.removeEventListener("keydown", this.processDownInput.bind(this));
      document.addEventListener("keydown", this.processDownInput.bind(this));
    } else {
      document.removeEventListener("keydown", this.processDownInput.bind(this));
    }
  }
  processDownInput(event) {
    if (this._disable) return;
  
    switch (event.code) {
      case "ArrowLeft":
        // Key left.
        if(event.repeat)return;
     
        this.dispatchEvent(EventNames.MOVE_LEFT);

        break;

      case "ArrowRight":
        // Key left.
        if(event.repeat)return;
       
        this.dispatchEvent(EventNames.MOVE_RIGHT);

        break;

      case "Digit1":
        // Key 1.
        if(event.repeat)return;
        this.dispatchEvent(EventNames.NEW_GAME);

        break;

      case "KeyP":
        // Key p.
        if(event.repeat)return;
        this.dispatchEvent(EventNames.PAUSE);

        break;
        case "KeyI":
          // Key i.
          if(event.repeat)return;
          this.dispatchEvent(EventNames.DEBUG);
  
          break;
    }
  }
}
let singlton = new Input();
export default singlton;
