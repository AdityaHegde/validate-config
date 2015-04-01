define([
  "../typeOf",
], function(typeOf) {

return {
  regexValidator : function(key, val, validator) {
    var result = true;
    if(validator.regex) {
      result = !!val.match(validator.regex);
    }
    if(!result) {
      this.logger.error("InvalidValue", {
        key         : key,
        actualValue : val,
        validator   : validator,
        hierarchyStr : this.hierarchyStr,
      });
    }
    return result;
  },
};

});
