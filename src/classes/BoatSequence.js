class BoatSequence {
  constructor(sprites) {
    this.index = 1;
    this.currentData;
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
    this.index = 1;
    this.sequenceData[this.index].mask = 1;
  }
  moveLeft() {
    let previousIndex = this.index;
    this.index++;
    let returnValue = true;
    if(this.index> 2){
      this.index = 2;
      returnValue = false;
    }
   
   
    this.sequenceData[previousIndex].mask = 0;
    this.sequenceData[this.index].mask = 1;
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
   
    this.sequenceData[previousIndex].mask = 0;
    this.sequenceData[this.index].mask = 1;
    return returnValue;
  }
}

export default BoatSequence;
