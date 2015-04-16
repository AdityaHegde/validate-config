define([
  "./morph-key",
  "./morph-type",
  "./morph-value",
], function() {
  var MorphConfig = {};
  //window.MorphConfig = MorphConfig;

  for(var i = 0; i < arguments.length; i++) {
    for(var k in arguments[i]) {
      MorphConfig[k] = arguments[i][k];
    }
  }

  return MorphConfig;
});
