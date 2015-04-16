define([
  "../typeOf",
  "./morph-number-type",
  "./morph-string-type",
  "./morph-object-type",
  "./morph-array-type",
], function(typeOf, MorphNumberType, MorphStringType, MorphObjectType, MorphArrayType) {

var typeToMorphMap = {
  "number" : MorphNumberType,
  "string" : MorphStringType,
  "object" : MorphObjectType,
  "array"  : MorphArrayType,

  "__default__" : {
    "__default__" : function() {
      return null;
    },
  },
};

return {
  morphType : function(key, val, validator) {
    var
    morphSet = typeToMorphMap[validator.type] || typeToMorphMap["__default__"],
    morphFn = morphSet[typeOf(val)] || morphSet["__default__"];

    return morphFn.call(this, key, val, validator);
  },
};

});
