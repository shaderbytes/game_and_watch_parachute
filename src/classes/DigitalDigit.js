class DigitalDigit {
  constructor() {
    //a digital digit is made up of 7 sections
    //the object names can have a prefix
    this.sectionObjectsNamePrefix = "";
    //the object names also have a key , this is for when you have many digits , each needs its own key/index to differenciate from each other
    this.sectionObjectsKeyIndex = "";
    this.sections = [];
  }

  setup() {
    for (var i = 0; i < 7; i++) {
      var sprite =
        this.sectionObjectsNamePrefix +
        "_" +
        this.sectionObjectsKeyIndex +
        "_" +
        (i + 1);

      var ob = {};

      ob.sprite = sprite;

      ob.mask = false;

      this.sections.push(ob);
    }
  }

  display_none() {
    for (var i = 0; i < 7; i++) {
      var ob = this.sections[i];

      ob.mask = false;
    }
  }

  display_0() {
    for (var i = 0; i < 7; i++) {
      var ob = this.sections[i];

      if (i == 3) {
        ob.mask = false;
      } else {
        ob.mask = true;
      }
    }
  }

  display_1() {
    for (var i = 0; i < 7; i++) {
      var ob = this.sections[i];

      if (i == 2 || i == 5) {
        ob.mask = true;
      } else {
        ob.mask = false;
      }
    }
  }

  display_2() {
    for (var i = 0; i < 7; i++) {
      var ob = this.sections[i];

      if (i == 0 || i == 2 || i == 3 || i == 4 || i == 6) {
        ob.mask = true;
      } else {
        ob.mask = false;
      }
    }
  }

  display_3() {
    for (var i = 0; i < 7; i++) {
      var ob = this.sections[i];

      if (i == 0 || i == 2 || i == 3 || i == 5 || i == 6) {
        ob.mask = true;
      } else {
        ob.mask = false;
      }
    }
  }

  display_4() {
    for (var i = 0; i < 7; i++) {
      var ob = this.sections[i];

      if (i == 1 || i == 2 || i == 3 || i == 5) {
        ob.mask = true;
      } else {
        ob.mask = false;
      }
    }
  }

  display_5() {
    for (var i = 0; i < 7; i++) {
      var ob = this.sections[i];

      if (i == 0 || i == 1 || i == 3 || i == 5 || i == 6) {
        ob.mask = true;
      } else {
        ob.mask = false;
      }
    }
  }

  display_6() {
    for (var i = 0; i < 7; i++) {
      var ob = this.sections[i];

      if (i == 0 || i == 1 || i == 3 || i == 4 || i == 5 || i == 6) {
        ob.mask = true;
      } else {
        ob.mask = false;
      }
    }
  }

  display_7() {
    for (var i = 0; i < 7; i++) {
      var ob = this.sections[i];

      if (i == 0 || i == 2 || i == 5) {
        ob.mask = true;
      } else {
        ob.mask = false;
      }
    }
  }

  display_8() {
    for (var i = 0; i < 7; i++) {
      var ob = this.sections[i];

      ob.mask = true;
    }
  }

  display_9() {
    for (var i = 0; i < 7; i++) {
      var ob = this.sections[i];

      if (i == 4) {
        ob.mask = false;
      } else {
        ob.mask = true;
      }
    }
  }
}

export default DigitalDigit;
