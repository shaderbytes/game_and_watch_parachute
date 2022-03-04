class BoatSequence {
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
    this.index = 0;
    this.sequenceData[this.index].mask = 1;
  }
  moveLeft() {
    let previousIndex = this.index;
    this.index = Math.max(0, --this.playerXIndex);
    this.sequenceData[previousIndex].mask = 0;
    this.sequenceData[this.index].mask = 1;
  }
  moveRight() {
    let previousIndex = this.index;
    this.index = Math.min(2, ++this.playerXIndex);
    this.sequenceData[previousIndex].mask = 0;
    this.sequenceData[this.index].mask = 1;
  }
}

export default BoatSequence;
