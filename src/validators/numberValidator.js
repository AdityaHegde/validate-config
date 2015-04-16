define([
  "../typeOf",
], function(typeOf) {

return {
  numberValidator : function(key, val, validator) {
    if((validator.min && val < validator.min) || (validator.max && val > validator.max)) {
      this.invalidKeys.markAs("value", this.hierarchy.fullHierarchyStr, "error", {
        key          : key,
        actualValue  : val,
        validator    : validator,
        hierarchyStr : this.hierarchy.hierarchyStr,
      });
      return false;
    }
    return true;
  },
};

});
