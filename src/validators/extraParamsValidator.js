define([
  "../typeOf",
  "../levenshteinDistance",
], function(typeOf, LevenshteinDistance) {

return function(key, val, validator) {
  var
  matches = [],
  matcheObjs = [],
  otherLoc = [];

  for(var ck in validator.keys) {
    var
    ckl = ck.length, kl = key.length,
    ld = LevenshteinDistance(ck, key);
    if(ld <= 0.25 * kl) {
      matcheObjs.push({
        ld : ld,
        ck : ck,
      });
    }
  }
  matches = matcheObjs.sort(function(a, b) {
    return a.ld - b.ld;
  }).map(function(e) {
    return e.ck;
  });

  if(this.fullKeysSet[key]) {
    for(var i = 0; i < this.fullKeysSet[key].length; i++) {
      var hierarchy = this.hierarchy.replacePlaceholders(this.fullKeysSet[key][i]).join(".");
      if(!this.fullKeysPresent[hierarchy]) {
        otherLoc.push(hierarchy);
      }
    }
  }

  this.invalidKeys.markAs("extra", this.hierarchy.fullHierarchyStr, "warn", {
    key          : key,
    val          : val,
    validator    : validator,
    hierarchyStr : this.hierarchy.hierarchyStr,
    matches      : matches,
    otherLoc     : otherLoc,
  });

  return true;
};

});
