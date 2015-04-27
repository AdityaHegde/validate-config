define([
  "./morphKey",
  "./morphType",
  "./morphValue",
], function(morphKey, morphType, morphValue) {
  var
  morphModules = [morphKey, morphType, morphValue],
  MorphConfig = {};

  for(var i = 0; i < morphModules.length; i++) {
    for(var k in morphModules[i]) {
      MorphConfig[k] = morphModules[i][k];
    }
  }

  return MorphConfig;
});
