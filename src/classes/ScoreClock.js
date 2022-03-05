class ScoreClock{
    constructor(){
        this.score = 0;
        this.sequenceData = [];
    }
    reset(){
        this.score = 0;  
    }
    incrementBy(value){
        this.score += value;
        console.log("score "+ this.score);
    }

}

export default ScoreClock;