import {Howl, Howler} from 'howler';
class AudioPlayer{
    constructor(){
     
    
        this.howlAudioItems = {};
        this.howlAudioItems['SFXSuccess_1'] = new Howl({           
            src: [ "audio/success_1.webm","audio/success_1.mp3"],              
           
    
        });

        this.howlAudioItems['SFXTick'] = new Howl({

            src: ["audio/tick.webm", "audio/tick.mp3"],
          
    
           
    
        });
        this.howlAudioItems['SFXMiss'] = new Howl({

            src: ["audio/miss.webm", "audio/miss.mp3"],
           
    
        });

        this.howlAudioItems['SFXMove'] = new Howl({

            src: ["audio/move.webm", "audio/move.mp3"],
           
    
        });


    }
    play(key){
      
        this.howlAudioItems[key].play();
    }

}
export default AudioPlayer;