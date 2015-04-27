define([
  "../typeOf",
], function(typeOf) {

return function(key, val, validator) {
  this.invalidKeys.markAs("mandatory", this.hierarchy.fullHierarchyStr, "error", {
    key          : key,
    validator    : validator,
    hierarchyStr : this.hierarchy.hierarchyStr,
  });
  return true;
};

});
