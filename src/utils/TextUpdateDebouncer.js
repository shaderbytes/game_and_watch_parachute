const ObjectExtendUtil = require("@/utils/ObjectExtendUtil.js");
const PublishSubscribe = require("@/events/PublishSubscribe.js");
const EventNames = require("@/events/EventNames.js");
class TextUpdateDebouncer {
  constructor() {
    ObjectExtendUtil.extend(this, PublishSubscribe);
    this.values = [];
    this.isProcessing = false;
    this.timer;
    this.curentIndex = 0;
    this.currentValue;
    this.minTime = 500;
  }

  updateText(value) {
    this.values.push(value);
    this.processTextUpdates();
  }

  processTextUpdates() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    //not processing so set value and start timer
    this.setNextvalue(this.curentIndex === 0 ? 0 : ++this.curentIndex);
    this.timer = setTimeout(this.evaluateProcess.bind(this), this.minTime);
  }
  evaluateProcess() {
    if (this.curentIndex < this.values.length - 1) {
      this.setNextvalue(++this.curentIndex);
      this.timer = setTimeout(this.evaluateProcess.bind(this), this.minTime);
    }else{
        this.isProcessing = false;
    }
  }
  setNextvalue(index) {
    this.currentValue = this.values[index];
    this.dispatchEvent(EventNames.TEXT_UPDATE, this.currentValue);
  }
}

module.exports = TextUpdateDebouncer;
