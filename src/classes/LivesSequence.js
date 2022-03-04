class LivesSequence{
    constructor(sprites) {
        this.index = 0;
        this.lives = 3;
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
        this.lives = 3;
        this.index = 0;
      }
      process() {
        this.sequenceData[ this.index] .mask = 1;
        if (--this.lives === 0) {
          return false;
        }          
        this.index++;       
        return true;
      }
}