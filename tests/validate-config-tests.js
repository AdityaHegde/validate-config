define([
  "./hierarchy-tests",
  "./constructor-tests",
  "./validate-tests",
], function() {
  for(var i = 0; i < arguments.length; i++) {
    arguments[i]();
  }
  QUnit.start();
});
