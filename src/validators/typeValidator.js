define([
  "../typeOf",
], function(typeOf) {

return function(key, val, validator) {
  if(typeOf(val) !== validator.type) {
    this.invalidKeys.markAs("type", this.hierarchy.fullHierarchyStr, "error", {
      key          : key,
      actualType   : typeOf(val),
      validator    : validator,
      hierarchyStr : this.hierarchy.hierarchyStr,
    });
    return false;
  }
  return true;
};

});
