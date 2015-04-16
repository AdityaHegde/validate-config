define([
  "../typeOf",
  "./morph-object-value",
], function(typeOf, MorphObjectValue) {

var typeToMorphMap = {
  "object" : MorphObjectValue,
};

return {
  morphValue : function(key, val, validator) {
    if(validator.morph) {
      var
      morphSet = typeToMorphMap[validator.type],
      morphFn = morphSet && (morphSet[validator.morph.valueMorphType] || morphSet["__default__"]);

      if(morphFn) {
        return morphFn.call(this, key, val, validator);
      }
    }

    return val;
  },
};

});
