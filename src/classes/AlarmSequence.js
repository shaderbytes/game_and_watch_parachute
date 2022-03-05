class AlarmSequence {
  constructor(sprites) {
    this.index = 0;
    this.currentData;
    this.sequenceData = [];
    this.manditoryData = [];
    this.hasManditoryData = false;
    for (let i = 0; i < sprites.length; i++) {
      let data = (this.sequenceData[i] = {});
      data.mask = false;
      data.sprite = sprites[i];
    }
  }
  manditorySprites(sprites){
    for (let i = 0; i < sprites.length; i++) {
      let data = (this.manditoryData[i] = {});
      data.mask = false;
      data.sprite = sprites[i];
    }
    this.hasManditoryData = true;
  }
  displayManditorySprites(state){
    for (let i = 0; i < this.manditoryData.length; i++) {
      let data = this.manditoryData[i];
      data.mask = state?true:false;      
    }
  }
  reset() {
    for (let i = 0; i < this.sequenceData.length; i++) {
      let data = this.sequenceData[i];
      data.mask = false;
    }
    this.displayManditorySprites(false);
    this.index = 0;
   
  }
  process() {
    this.sequenceData[ this.index] .mask = true;
         
    this.index++; 
    if(this.index === this.sequenceData.length )      {
        this.index = 0;
    }
    return true;
  }
}

export default AlarmSequence;
