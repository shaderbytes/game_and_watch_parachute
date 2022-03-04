class DeathSequence {
  constructor(sprites) {
    this.index = 0;
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
  }
  process() {
    if (this.currentData) {
        this.currentData.mask = 0;
      }
    if (this.index === this.sequenceData.length) {
      return false;
    }   
    this.currentData = this.sequenceData[this.index];
    this.currentData.mask = 1;
    this.index++;
    return true;
  }
}

export default DeathSequence;
