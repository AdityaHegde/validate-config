define([
  "../typeOf",
], function(typeOf) {

typeToValidatorMap = {
  "object"      : "objectValidator",
  "array"       : "arrayValidator",
  "string"      : "regexValidator",
  "number"      : "numberValidator",
  "__default__" : "regexValidator",
};

return {
  validator : function(key, val, validator) {
    this.fullKeysPresent[this.hierarchy.fullHierarchy] = 1;

    if(this.typeValidator(key, val, validator)) {
      var validatorFun = typeToValidatorMap[validator.type] || typeToValidatorMap["__default__"];
      this[validatorFun](key, val, validator);
    }

    return true;
  },
};

});
