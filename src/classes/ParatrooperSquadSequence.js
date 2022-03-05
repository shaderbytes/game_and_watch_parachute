class ParatrooperSquadSequence {
  constructor(sprites) {
    this.pendingDeath = false;
    this.squadIndex = 0;
    this.boatIsAvailable = false;   
    this.sequenceData = [];
    this.pendingSave = false;
    this.hasActiveTroopers = false;
    this.clearSavedParatrooperPending = false;
    this.sequenceData = [];
    this.hasTickerAsigned = false;
    for (let i = 0; i < sprites.length; i++) {
      let data = (this.sequenceData[i] = {});
      data.mask = false;
      data.sprite = sprites[i];
    }
  }
 
  reset() {
    for (let i = 0; i < this.sequenceData.length; i++) {
      let data = this.sequenceData[i];
      data.mask = false;
    }
    this.pendingSave = false;
    this.pendingDeath = false;
    this.boatIsAvailable = false; 
    this.hasActiveTroopers = false;  
    this.clearSavedParatrooperPending = false;
    this.hasTickerAsigned = false;
  }
  didSaveParatrooper() {
    if (this.pendingSave) {
      this.pendingSave = false;
      return true;
    }
    return false;
  }
  clearSavedParatrooper(){
    this.clearSavedParatrooperPending = false;
    this.sequenceData[this.sequenceData.length - 1].mask = false;
    this.evaluateActiveTroopers();
  }
  evaluateActiveTroopers(){
    this.hasActiveTroopers = false;
    for (let i = 0; i < this.sequenceData.length; i++) {
      let data = this.sequenceData[i];  
      if(data.mask === 1){
        this.hasActiveTroopers = true;
      }
    }
  }
  process() {
    //validate generation
    //shift mask values
    //if last data slot has mask of 1 and boatIsAvailable is false then death is pending so set this.pendingDeath to true and return false
    //if last data slot has mask of 1 and boatIsAvailable is true , then set pendingSave to true;
  
    this.hasActiveTroopers = false;
    //otherwise return true
    let returnValue = true;
    let r = Math.random();
    let newMask = 0;
    if(r < 0.1){
      newMask = 1;
    }  
    let previousMask;

    for (let i = 0; i < this.sequenceData.length; i++) {
      let data = this.sequenceData[i];     
      if(i===0){
        //dont allow a generation if the current first slot is active  
        previousMask = data.mask;
        if(previousMask === 1){
          newMask = 0;
        }
       
        data.mask = newMask;
      }else{
        let maskTemp = data.mask;       
        data.mask = previousMask;
        previousMask = maskTemp;
      }
      if(data.mask === 1){
        this.hasActiveTroopers = true;
      }
    }

    if(this.sequenceData[this.sequenceData.length - 1].mask === 1 && this.boatIsAvailable){
      this.pendingSave = true;
    }
    if(this.sequenceData[this.sequenceData.length - 1].mask === 1 && !this.boatIsAvailable){
      this.pendingDeath = true;
      returnValue = false;
    }
    return returnValue;
  }
  death(){
    this.sequenceData[this.sequenceData.length - 1].mask = false;
  }
  setBoatAvailable(value) {    
    this.boatIsAvailable = value;
    //if boat becomes available while pendingdeath , then set pendingDeath to false and mask to zero as the trooper will be saved
    if (this.boatIsAvailable && this.pendingDeath) {
      this.sequenceData[this.sequenceData.length - 1].mask = false;
      this.pendingDeath = false;
      this.pendingSave = true;
     
    }
  }
  
  postDeathprocess() {
    //this is called after any paratrooper squad has a death
    //it is used to clear any troopers that are close to the water
    //to give the player some freedom to adjust gameplay after a fail
    this.sequenceData[this.sequenceData.length - 1].mask = false;
    this.sequenceData[this.sequenceData.length - 2].mask = false;
    this.pendingDeath = false;
    this.evaluateActiveTroopers();
  }
}
export default ParatrooperSquadSequence;
