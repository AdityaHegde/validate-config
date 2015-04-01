define([
  "../typeOf",
], function(typeOf) {

return {
  typeValidator : function(key, val, validator) {
    if(typeOf(val) !== validator.type) {
      this.logger.error("InvalidType", {
        key          : key,
        actualType   : typeOf(val),
        validator    : validator,
        hierarchyStr : this.hierarchyStr,
      });
      return false;
    }
    return true;
  },
};

});
