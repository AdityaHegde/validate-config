define([
  "../typeOf",
  "../levenshteinDistance",
], function(typeOf, LevenshteinDistance) {

return {
  extraParamsValidator : function(key, val, validator) {
    var
    matches = [],
    otherLoc = [];

    for(var ck in validator.keys) {
      var
      ckl = ck.length, kl = key.length,
      ld = LevenshteinDistance(ck, key);
      if(ld <= 0.25 * kl) {
        matches.push(ck);
      }
    }

    if(this.fullKeysSet[key]) {
      for(var i = 0; i < this.fullKeysSet[key].length; i++) {
        var hierarchy = this.replacePlaceholders(this.fullHierarchy, this.fullKeysSet[key][i].fullHierarchy).join(".");
        if(!this.fullKeysPresent[hierarchy]) {
          otherLoc.push(hierarchy);
        }
      }
    }

    this.logger.warn("ExtraParam", {
      key          : key,
      val          : val,
      validator    : validator,
      hierarchyStr : this.hierarchyStr,
      matches      : matches,
      otherLoc     : otherLoc,
    });

    return true;
  },
};

});
