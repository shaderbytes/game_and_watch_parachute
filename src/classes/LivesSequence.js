class LivesSequence{
    constructor(sprites) {
        this.index = 0;
        this.lives = 3;
        this.sequenceData = [];
        this.manditoryData = [];
        this.hasManditoryData = false;
        for (let i = 0; i < sprites.length; i++) {
          let data = (this.sequenceData[i] = {});
          data.mask = 0;
          data.sprite = sprites[i];
        }
      }
      manditorySprites(sprites){
        for (let i = 0; i < sprites.length; i++) {
          let data = (this.manditoryData[i] = {});
          data.mask = 1;
          data.sprite = sprites[i];
        }
        this.hasManditoryData = true;
      }
      displayManditorySprites(state){
        for (let i = 0; i < this.manditoryData.length; i++) {
          let data = this.manditoryData[i];
          data.mask = state?1:0;      
        }
      }
      reset() {
        for (let i = 0; i < this.sequenceData.length; i++) {
          let data = this.sequenceData[i];
          data.mask = 0;
        }
        this.displayManditorySprites(false);
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
export default LivesSequence;