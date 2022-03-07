import BoatSequence from "@/classes/BoatSequence.js";
import DeathSequence from "@/classes/DeathSequence.js";
import SharkSequence from "@/classes/SharkSequence.js";
import LivesSequence from "@/classes/LivesSequence.js";
import AlarmSequence from "@/classes/AlarmSequence.js";
import ScoreClock from "@/classes/ScoreClock.js";
import ChopperSequence from "@/classes/ChopperSequence.js";
import ParatrooperSquadSequence from "@/classes/ParatrooperSquadSequence.js";
class SequenceController {
  constructor() {
    //variables for keys so as not to have to type strings for keys when referencing 
      this.LIVES = "LIVES";
      this.BOAT = "BOAT";
      this.SCORECLOCK = "SCORECLOCK";
      this.CHOPPER = "CHOPPER";
      this.ALARM = "ALARM";
      this.SQUAD0 = "SQUAD0";
      this.SQUAD0B = "SQUAD0B";
      this.SQUAD1 = "SQUAD1";
      this.SQUAD2 = "SQUAD2";
      this.DEATH = "DEATH";
      this.SHARK = "SHARK";
      //all sequence instances stored here
      this.sequences = {};
      //each sequence handles logic for the display of its asigned sprites
      //the sequence is passed to the viewer in the game class to update the display
      this.addSequence(this.LIVES,new LivesSequence(["shark_0", "shark_1", "shark_2"]));
      this.getSequence(this.LIVES).manditorySprites(["miss"]);
      this.addSequence(this.BOAT,new BoatSequence(["boat_3", "boat_2", "boat_1"]));
      this.addSequence(this.SCORECLOCK,new ScoreClock());
      this.addSequence(this.CHOPPER,new ChopperSequence([
        "chopper_prop_0",
        "chopper_prop_1",
      ]));
      this.getSequence(this.CHOPPER).manditorySprites(["chopper"]);
      this.addSequence(this.ALARM,new AlarmSequence(["monkey_arm_0", "monkey_arm_1"]));
      this.getSequence(this.ALARM).manditorySprites(["monkey"]);
      this.addSequence(this.SQUAD0,new ParatrooperSquadSequence([
        "pt_0_0",
        "pt_0_1",
        "pt_0_2",
        "pt_0_3",
        "pt_0_4",
      ]));
      this.getSequence(this.SQUAD0).squadIndex = 0;
      
      this.addSequence(this.SQUAD0B,new ParatrooperSquadSequence([
        "pt_b_0_0",
        "pt_b_0_1",
      ]));
      this.addSequence(this.SQUAD1,new ParatrooperSquadSequence([
        "pt_1_0",
        "pt_1_1",
        "pt_1_2",
        "pt_1_3",
        "pt_1_4",
        "pt_1_5",
      ]));
      this.getSequence(this.SQUAD1).squadIndex = 1;
      this.addSequence(this.SQUAD2,new ParatrooperSquadSequence([
        "pt_2_0",
        "pt_2_1",
        "pt_2_2",
        "pt_2_3",
        "pt_2_4",
        "pt_2_5",
        "pt_2_6",
      ]));
      this.getSequence(this.SQUAD2).squadIndex = 2;
      this.addSequence(this.DEATH,new DeathSequence([
        "ptw_0_0",
        ["ptw_1_0", "sw_1_0"],
        ["ptw_2_0", "sw_2_0"],
        ["ptw_3_0", "sw_3_0"],
        ["ptw_4_0", "sw_4_0"],
        ["ptw_5_0", "sw_5_0"],
      ]));
      this.addSequence(this.SHARK,new SharkSequence([
       
         "sw_1_0",
         "sw_2_0",
         "sw_3_0",
         "sw_4_0",
         "sw_5_0",
      ]));
   
   
  
  
  }
  addSequence(key,value){
    this.sequences[key] = value;
  }
  getSequence(key){
   return this.sequences[key];
  }
  reset(){
    //call reset on all sequences    
    for(let prop in this.sequences){
      this.sequences[prop].reset();
    }
    //update any manditory sprites      
    this.getSequence(this.CHOPPER).displayManditorySprites(true);
    
  }
}
export default SequenceController;
