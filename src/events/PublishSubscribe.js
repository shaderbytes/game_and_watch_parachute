function PublishSubscribe (){
 
    this.eventListeners = {};
  }
  PublishSubscribe.prototype = {
  //-----------------------------------------------------------------------------------------------------------------------

  addEventListener: function(eventKey, func) {
    if (
      this.eventListeners[eventKey] === null ||
      this.eventListeners[eventKey] === undefined
    ) {
      this.eventListeners[eventKey] = [];
    }
    this.eventListeners[eventKey].push(func);
  },

  removeEventListener:function(eventKey, func) {
    if (this.eventListeners[eventKey] !== null) {
      for (var i = this.eventListeners[eventKey].length - 1; i >= 0; i--) {
        if (this.eventListeners[eventKey][i] == func) {
          this.eventListeners[eventKey].splice(i, 1);
        }
      }
      if (this.eventListeners[eventKey].length === 0) {
        this.eventListeners[eventKey] = null;
      }
    }
  },
  removeAllEventListeners:function() {
    for (let prop in this.eventListeners) {
      for (let j = 0; j < this.eventListeners[prop].length; j++) {
        this.eventListeners[prop][j] = null;
      }
      this.eventListeners[prop] = null;
      delete this.eventListeners[prop];
    }
    this.eventListeners = {};
  },

  hasEventListener:function(eventKey, func) {
    var hasListener = false;
    if (
      this.eventListeners[eventKey] !== null &&
      this.eventListeners[eventKey] !== undefined
    ) {
      for (var i = this.eventListeners[eventKey].length - 1; i >= 0; i--) {
        if (this.eventListeners[eventKey][i].func == func) {
          hasListener = true;
          break;
        }
      }
    }
    return hasListener;
  },

  dispatchEvent:function(eventName, eventObject) { 
    var eventArray = this.eventListeners[eventName];   
    if (eventArray !== null && eventArray !== undefined) {
      for (var i = 0; i < eventArray.length; i++) {
        eventArray[i](eventObject);
      }
    }
  },

  //-----------------------------------------------------------------------------------------------------------------------


  
 

  eventListenersGlobal: {},

  //-----------------------------------------------------------------------------------------------------------------------

  addEventListenerGlobal:function(eventKey, func) {
    if (
      this.eventListenersGlobal[eventKey] === null ||
      this.eventListenersGlobal[eventKey] === undefined
    ) {
      this.eventListenersGlobal[eventKey] = [];
    }
    this.eventListenersGlobal[eventKey].push(func);
  },

  removeEventListenerGlobal:function(eventKey, func) {
    if (this.eventListenersGlobal[eventKey] !== null) {
      for (var i = this.eventListenersGlobal[eventKey].length - 1; i >= 0; i--) {
        if (this.eventListenersGlobal[eventKey][i] == func) {
          this.eventListenersGlobal[eventKey].splice(i, 1);
        }
      }
      if (this.eventListenersGlobal[eventKey].length === 0) {
        this.eventListenersGlobal[eventKey] = null;
      }
    }
  },
   removeAllEventListenersGlobal:function() {
    for (let prop in this.eventListenersGlobal) {
      for (let j = 0; j < this.eventListenersGlobal[prop].length; j++) {
        this.eventListenersGlobal[prop][j] = null;
      }
      this.eventListenersGlobal[prop] = null;
      delete this.eventListenersGlobal[prop];
    }
    this.eventListenersGlobal = {};
  },

  hasEventListenerGlobal:function(eventKey, func) {
    var hasListener = false;
    if (
      this.eventListenersGlobal[eventKey] !== null &&
      this.eventListenersGlobal[eventKey] !== undefined
    ) {
      for (var i = this.eventListenersGlobal[eventKey].length - 1; i >= 0; i--) {
        if (this.eventListenersGlobal[eventKey][i].func == func) {
          hasListener = true;
          break;
        }
      }
    }
    return hasListener;
  },

  dispatchEventGlobal:function(eventName, eventObject) {
    var eventArray = this.eventListenersGlobal[eventName];
    if (eventArray !== null && eventArray !== undefined) {
      for (var i = 0; i < eventArray.length; i++) {
        eventArray[i](eventObject);
      }
    }
  }

  //-----------------------------------------------------------------------------------------------------------------------


}

// expose the class
module.exports = PublishSubscribe;
