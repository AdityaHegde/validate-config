define([
  "../typeOf",
], function(typeOf) {

return {
  numberValidator : function(key, val, validator) {
    if(!((validator.min && val < validator.min) || (validator.max && val > validator.max))) {
      this.logger.error("InvalidValue", {
        key          : key,
        actualValue  : val,
        validator    : validator,
        hierarchyStr : this.hierarchyStr,
      });
      return false;
    }
    return true;
  },
};

});
