define([
  "../typeOf",
  "./morphNumberType",
  "./morphStringType",
  "./morphObjectType",
  "./morphArrayType",
], function(typeOf, morphNumberType, morphStringType, morphObjectType, morphArrayType) {

var typeToMorphTypeMap = {
  "number" : morphNumberType,
  "string" : morphStringType,
  "object" : morphObjectType,
  "array"  : morphArrayType,

  "__default__" : {
    "__default__" : function() {
      return null;
    },
  },
};

return {
  morphType : function(key, val, validator) {
    var
    morphSet = typeToMorphTypeMap[validator.type] || typeToMorphTypeMap["__default__"],
    morphFn = morphSet[typeOf(val)] || morphSet["__default__"];

    return morphFn.call(this, key, val, validator);
  },
};

});
