import input from "@/classes/Input.js";
import EventNames from "@/events/EventNames.js";

class Parachute {
  constructor() {
   
    this.playerXIndex = 1;
  }
  set viewer(value) {
    this._viewer = value;
  }
  initiate() {
    this._viewer.lookAt(this.playerXIndex);
    input.active = true;
    input.removeAllEventListeners();
    input.addEventListener(EventNames.MOVE_LEFT, () => {       
        this.playerXIndex = Math.max(0, --this.playerXIndex);
      this._viewer.lookAt(this.playerXIndex);
     
    });
    input.addEventListener(EventNames.MOVE_RIGHT, () => {       
        this.playerXIndex =   Math.min(2, ++this.playerXIndex);
      this._viewer.lookAt(this.playerXIndex);
     
    });
  }
}
let singlton = new Parachute();
export default singlton;
