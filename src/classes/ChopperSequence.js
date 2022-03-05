class ChopperSequence {
    constructor(sprites) {
      this.index = 0;
      this.currentData;
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
      this.index = 0;
      this.currentData = undefined;
      
    }
    process() {
      if (this.currentData) {
        this.currentData.mask = 0;
      }
     
      this.currentData =  this.sequenceData[ this.index];
      this.currentData .mask = 1;
           
      this.index++; 
      if(this.index === this.sequenceData.length )      {
          this.index = 0;
      }
      return true;
    }
  }
  
  export default ChopperSequence;
  