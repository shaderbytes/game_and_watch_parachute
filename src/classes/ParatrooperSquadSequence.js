class ParatrooperSquadSequence {
  constructor() {
    this.pendingDeath = false;
    this.boatIsAvailable = false;   
    this.sequenceData = [];
    this.pendingSave = false;
  }
  initiate(sprites) {
    this.sequenceData = [];
    for (let i = 0; i < sprites.length; i++) {
      let data = (this.sequenceData[i] = {});
      data.mask = 0;
      data.sprite = sprites[i];
    }
  }
  reset() {
    for (let i = 0; i < this.sequenceData.length; i++) {
      let data = this.sequenceData[i];
      data.mask = 0;
    }
    this.pendingSave = false;
    this.pendingDeath = false;
    this.boatIsAvailable = false;   
  }
  didSaveParatrooper() {
    if (this.pendingSave) {
      this.pendingSave = false;
      return true;
    }
    return false;
  }
  process() {
    //validate generation
    //shift mask values
    //if last data slot has mask of 1 and boatIsAvailable is false then death is pending so set this.pendingDeath to true and return false
    //if last data slot has mask of 1 and boatIsAvailable is true , then set pendingSave to true;
    //otherwise return true
  }
  setBoatAvailable(value) {
    this.boatIsAvailable = value;
    //if boat becomes available while pendingdeath , then set pendingDeath to false and mask to zero as the trooper will be saved
    if (this.boatIsAvailable && this.pendingDeath) {
      this.sequenceData[this.sequenceData.length - 1].mask = 0;
      this.pendingDeath = false;
    }
  }
  postDeathprocess() {
    //this is called after any paratrooper squad has a death
    //it is used to clear any troopers that are close to the water
    //to give the player some freedom to adjust gameplay after a fail
    this.pendingDeath = false;
  }
}
export default ParatrooperSquadSequence;
