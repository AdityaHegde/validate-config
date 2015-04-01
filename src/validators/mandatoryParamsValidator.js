define([
  "../typeOf",
], function(typeOf) {

return {
  mandatoryParamsValidator : function(key, val, validator) {
    this.logger.error("MandatoryParamMissing", {
      key          : key,
      validator    : validator,
      hierarchyStr : this.hierarchyStr,
    });
    return true;
  },
};

});
