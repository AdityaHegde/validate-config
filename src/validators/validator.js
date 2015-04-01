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
    this.pushToHierarchy(key, (validator.parentValidator && validator.parentValidator.placeholderKey) || key);
    this.fullKeysPresent[this.fullHierarchy] = 1;

    if(this.typeValidator(key, val, validator)) {
      var validator = typeToValidatorMap[validator.type] || typeToValidatorMap["__default__"];
      this[validator](key, val, validator);
    }

    this.popFromHierarchy();

    return true;
  },
};

});
