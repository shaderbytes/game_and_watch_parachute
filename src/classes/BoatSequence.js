class BoatSequence {
  constructor(sprites) {
    this.index = 1;
    this.currentData;
    this.sequenceData = [];
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
    this.index = 1;
    this.sequenceData[this.index].mask = true;
  }
  moveLeft() {
    let previousIndex = this.index;
    this.index++;
    let returnValue = true;
    if(this.index> 2){
      this.index = 2;
      returnValue = false;
    }
   
   
    this.sequenceData[previousIndex].mask = false;
    this.sequenceData[this.index].mask = true;
    return returnValue;
  }
  moveRight() {
    let previousIndex = this.index;
    this.index--;
    let returnValue = true;
    if(this.index<0){
      this.index = 0;
      returnValue = false;
    }
   
    this.sequenceData[previousIndex].mask = false;
    this.sequenceData[this.index].mask = true;
    return returnValue;
  }
}

export default BoatSequence;
