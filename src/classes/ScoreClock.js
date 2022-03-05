import DigitalDigit from "@/classes/DigitalDigit.js";
class ScoreClock {
  constructor() {
    this.score = 0;
    this.colon = { sprite: "clock_colon", mask: false };
    this.pm = { sprite: "pm_ui", mask: false };
    this.am = { sprite: "am_ui", mask: false };
    this.sequenceData = [];
    var isClockMode = true;
    this.setClockMode(true);
    this.allDigits = {};    

    var d = (this.allDigits.d1 = new DigitalDigit());
    d.sectionObjectsNamePrefix = "clock_digit";
    d.sectionObjectsKeyIndex = "1";
    d.setup();
    for (let i = 0; i < d.sections.length; i++) {
      this.sequenceData.push(d.sections[i]);
    }

    d = this.allDigits.d2 = new DigitalDigit();
    d.sectionObjectsNamePrefix = "clock_digit";
    d.sectionObjectsKeyIndex = "2";
    d.setup();
    for (let i = 0; i < d.sections.length; i++) {
      this.sequenceData.push(d.sections[i]);
    }

    d = this.allDigits.d3 = new DigitalDigit();
    d.sectionObjectsNamePrefix = "clock_digit";
    d.sectionObjectsKeyIndex = "3";
    d.setup();
    for (let i = 0; i < d.sections.length; i++) {
      this.sequenceData.push(d.sections[i]);
    }

    d = this.allDigits.d4 = new DigitalDigit();
    d.sectionObjectsNamePrefix = "clock_digit";
    d.sectionObjectsKeyIndex = "4";
    d.setup();
    for (let i = 0; i < d.sections.length; i++) {
      this.sequenceData.push(d.sections[i]);
    }
    this.sequenceData.push(this.colon);
    this.sequenceData.push(this.pm);
    this.sequenceData.push(this.am);

  }
  reset() {
    this.score = 0;
    this.setClockMode(false);
    this.setScore(this.score);
  }
  incrementBy(value) {
    this.score += value;
    console.log("score " + this.score);
    this.setScore(this.score);
  }
  setScore(value) {
    if (value < 10) {
      this.allDigits.d1.display_none();
      this.allDigits.d2.display_none();
      this.allDigits.d3.display_none();
      this.allDigits.d4["display_" + value]();
    } else if (value < 100) {
      this.allDigits.d1.display_none();
      this.allDigits.d2.display_none();
      let v1 = value / 10;
      v1 = v1 | 0;
      this.allDigits.d3["display_" + v1]();
      let v2 = value % 10;
      this.allDigits.d4["display_" + v2]();
    } else if (value < 1000) {
      this.allDigits.d1.display_none();
      let v0 = value / 100;
      v0 = v0 | 0;
      this.allDigits.d2["display_" + v0]();
      let v1 = value % 100;
      v1 /= 10;
      v1 = v1 | 0;
      this.allDigits.d3["display_" + v1]();
      let v2 = value % 100;
      v2 = v2 % 10;
      this.allDigits.d4["display_" + v2]();
    } else if (value < 10000) {
      let v00 = value / 1000;
      v00 = v00 | 0;
      this.allDigits.d1["display_" + v00]();
      let v0 = value % 1000;
      v0 /= 100;
      v0 = v0 | 0;
      this.allDigits.d2["display_" + v0]();
      let v1 = value % 100;
      v1 /= 10;
      v1 = v1 | 0;
      this.allDigits.d3["display_" + v1]();
      let v2 = value % 1000;
      v2 = v2 % 10;
      this.allDigits.d4["display_" + v2]();
    }
  }

  onTickerTime() {
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    if (h > 12) {
      this.pm.mask = true;
      this.am.mask = false;
    } else {
      this.pm.mask = false;
      this.am.mask = true;
    }
    if (h < 10) {
      this.allDigits.d1.display_0();
      this.allDigits.d2["display_" + h]();
    } else {
      var h1 = h / 10;
      h1 = h1 | 0;
      this.allDigits.d1["display_" + h1]();
      var h2 = h % 10;
      this.allDigits.d2["display_" + h2]();
    }
    if (m < 10) {
      this.allDigits.d3.display_0();
      this.allDigits.d4["display_" + m]();
    } else {
      var m1 = m / 10;
      m1 = m1 | 0;
      this.allDigits.d3["display_" + m1]();
      var m2 = m % 10;
      this.allDigits.d4["display_" + m2]();
    }
  }

  setClockMode(modeState) {
    this.isClockMode = modeState;
    this.colon.mask = this.isClockMode;
    if (modeState) {
      //
    } else {
      for (var i = 0; i < 4; i++) {
        var a = this.allDigits["d" + (i + 1)];
        a.display_none();
      }
      this.pm.mask = false;
      this.am.mask = false;
    }
  }
}

export default ScoreClock;
