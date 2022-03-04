const ObjectExtendUtil = require("@/utils/ObjectExtendUtil.js");
const PublishSubscribe = require("@/events/PublishSubscribe.js");
const EventNames = require("@/events/EventNames.js");
class Ticker {
  constructor(_interval, _subIntervalSegments) {
    ObjectExtendUtil.extend(this, PublishSubscribe);
    //passin a interval or it defaults to 1000 millseconds/ 1 second
    this.interval = _interval || 1000;
    this.intervalScalar = 1;
    this.subIntervalSegments = _subIntervalSegments;
    this.subInterval;
    this.pendingIntervalUpdate = false;
    this.intervalHandlerCache = this.intervalHandler.bind(this);
    this.intervalHandlerID;
    this.subIntervalIndex = 0;
  }
  invalidateSubInterval() {
    this.subInterval =
      ((this.interval * this.intervalScalar) / this.subIntervalSegments) | 0;
  }
  updateIntervalScalar(amount) {
    this.intervalScalar = amount;
    this.invalidateSubInterval();
    this.pendingIntervalUpdate = true;
  }
  intervalHandler() {
    //handle tick
    this.dispatchEvent(EventNames.ON_TICKER, this.subIntervalIndex);
    //then update index and look for pending change in interval
    this.subIntervalIndex++;
    if (this.subIntervalIndex === this.subIntervalSegments) {
      this.subIntervalIndex = 0;
    }
    if (this.pendingIntervalUpdate) {
      this.pendingIntervalUpdate = false;
      this.startIntervalTicker();
    }
  }
  startIntervalTicker() {
    this.stopIntervalTicker();
    this.intervalHandlerID = setInterval(
      this.intervalHandlerCache,
      this.subInterval
    );
  }
  stopIntervalTicker() {
    clearInterval(this.intervalHandlerID);
  }
  reset(){
    this.subIntervalIndex = 0;
  }
  start() {   
    this.invalidateSubInterval();
    //call handler manually to get a immediate start and not a delay on first tick
    this.intervalHandler();
    this.startIntervalTicker();
  }
  stop() {
    this.stopIntervalTicker();
  }
}

export default Ticker;
