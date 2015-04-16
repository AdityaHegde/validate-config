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
      this.invalidKeys.markAs("value", this.hierarchy.fullHierarchyStr, "error", {
        key          : key,
        actualValue  : val,
        validator    : validator,
        hierarchyStr : this.hierarchy.hierarchyStr,
      });
    }
    return result;
  },
};

});
