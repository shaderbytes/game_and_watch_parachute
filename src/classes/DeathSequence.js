class DeathSequence {
  constructor(sprites) {
    this.index = 0;
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
    this.index = 0;
    this.currentData = undefined;
  }
  process() {
    if (this.currentData) {
        this.currentData.mask = false;
      }
    if (this.index === this.sequenceData.length) {
      return false;
    }   
    this.currentData = this.sequenceData[this.index];
    this.currentData.mask = true;
    this.index++;
    return true;
  }
}

export default DeathSequence;
