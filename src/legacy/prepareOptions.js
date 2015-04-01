define([
  "./typeOf",
], function(typeOf) {
  var
  prepare = function(options, fullOptions, hierarchy) {
    options.mandatoryKeys = options.mandatoryKeys || {};
    for(var k in options.childKeys) {
      hierarchy.push(k);
      var obj = options.childKeys[k];
      if(typeOf(obj) === "object") {
        if(obj.childKeys) {
          prepare(obj, fullOptions, hierarchy);
        }
        else if(!obj.regex) {
          prepare({
            childKeys : obj,
          }, fullOptions, hierarchy);
        }
      }
      else if(typeOf(obj) === "regexp") {
        options.childKeys[k] = {
          regex : options.childKeys[k],
        };
      }

      if(!fullOptions.fullKeysSet[k]) {
        fullOptions.fullKeysSet[k] = [];
      }
      fullOptions.fullKeysSet[k].push(hierarchy.slice());

      hierarchy.pop();
    }
    options.fullKeysSet = fullOptions.fullKeysSet;
  };
  return {
    prepareOptions : function(options) {
      if(options.childKeys) {
        options.fullKeysSet = {};
      }
      else {
        options = {
          childKeys : options,
          fullKeysSet : {},
        };
      }
      prepare(options, options, ["Root"]);
    },
  };
});
