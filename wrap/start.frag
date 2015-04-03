(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define([], factory);
  } else {
    // Browser globals.
    root.ValidateConfig = factory();
  }
}(this, function() {
