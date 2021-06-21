(function(view) {
  if (!view.requestAnimationFrame) {
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !view.requestAnimationFrame; ++x) {
      view.requestAnimationFrame = view[vendors[x] + 'RequestAnimationFrame'];
      view.cancelAnimationFrame =
        view[vendors[x] + 'CancelAnimationFrame'] || view[vendors[x] + 'CancelRequestAnimationFrame'];
    }
  }
  if (!view.requestAnimationFrame) {
    var lastTime = 0;
    view.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = view.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!view.cancelAnimationFrame) {
    view.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
})(window);
/* eslint-enable */
