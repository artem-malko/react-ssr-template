var applyPolyfill = function () {
  var IDLE_ENOUGH_DELAY = 300;
  var timeoutId = null;
  var callbacks = [];
  var lastInteractionTime = Date.now();
  var deadline = {
      timeRemaining: IDLE_ENOUGH_DELAY
  };

  var isFree = function () {
      return timeoutId === null;
  }

  var onContinousInteractionStarts = function (interactionName) {
      deadline.timeRemaining = 0;
      lastInteractionTime = Date.now();

      if (!timeoutId) {
          timeoutId = setTimeout(timeoutCompleted, IDLE_ENOUGH_DELAY);
      }
  }

  var onContinousInteractionEnds = function (interactionName) {
      clearTimeout(timeoutId);
      timeoutId = null;

      for (var i = 0; i < callbacks.length; i++) {
          executeCallback(callbacks[i])
      }
  }

  document.addEventListener('keydown', onContinousInteractionStarts.bind(this, 'keydown'));
  document.addEventListener('mousedown', onContinousInteractionStarts.bind(this, 'mousedown'));
  document.addEventListener('touchstart', onContinousInteractionStarts.bind(this, 'touchstart'));
  document.addEventListener('touchmove', onContinousInteractionStarts.bind(this, 'touchmove'));
  document.addEventListener('mousemove', onContinousInteractionStarts.bind(this, 'mousemove'));
  document.addEventListener('scroll', onContinousInteractionStarts.bind(this, 'scroll'), true);


  var timeoutCompleted = function () {
      var expectedEndTime = lastInteractionTime + IDLE_ENOUGH_DELAY;
      var delta = expectedEndTime - Date.now();

      if (delta > 0) {
          timeoutId = setTimeout(timeoutCompleted, delta);
      } else {
          onContinousInteractionEnds();
      }
  }

  var createCallbackObject = function (callback, timeout) {
      var callbackObject = {
          callback: callback,
          timeoutId: null
      };

      callbackObject.timeoutId = timeout !== null ? setTimeout(executeCallback.bind(this, callbackObject), timeout) : null;

      return callbackObject;
  }

  var addCallback = function (callbackObject, timeout) {
      callbacks.push(callbackObject);
  }

  var executeCallback = function (callbackObject) {
      var callbackIndex = callbacks.indexOf(callbackObject);

      if (callbackIndex !== -1) {
          callbacks.splice(callbacks.indexOf(callbackObject), 1);
      }

      callbackObject.callback(deadline);

      if (callbackObject.timeoutId) {
          clearTimeout(callbackObject.timeoutId);
          callbackObject.timeoutId = null;
      }
  }

  return function (callback, options) {
      var timeout = (options && options.timeout) || null;
      var callbackObject = createCallbackObject(callback, timeout);

      if (isFree()) {
          executeCallback(callbackObject);
      } else {
          addCallback(callbackObject);
      }
  };
};

if (!window.requestIdleCallback) {
  window.ricActivated = true;
  window.requestIdleCallback = applyPolyfill();
}

window.requestUserIdle = window.ricActivated && window.requestIdleCallback || applyPolyfill();
