define([
  "../typeOf",
  "./morphObjectValue",
], function(typeOf, morphObjectValue) {

var typeToMorphValueMap = {
  "object" : morphObjectValue,
};

return {
  morphValue : function(key, val, validator) {
    if(validator.morph) {
      var
      morphSet = typeToMorphValueMap[validator.type],
      morphFn = morphSet && (morphSet[validator.morph.valueMorphType] || morphSet["__default__"]);

      if(morphFn) {
        return morphFn.call(this, key, val, validator);
      }
    }

    return val;
  },
};

});
