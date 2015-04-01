define(function() {
  var
  registry = {},
  LevenshteinDistanceMain = function(s1, l1, s2, l2, meta) {
    var
    key = s1 + "__" + l1 + "__" + s2 + "__" + l2,
    val;
    if(registry[key]) {
      val = registry[key].val;
    }
    else {
      if(l1 === 0) {
        val = l2;
      }
      else if(l2 === 0) {
        val = l1;
      }
      else {
        var
        cost = s1.charAt(l1 - 1) === s2.charAt(l2 - 1) ? 0 : 1;
        val = Math.min(
          LevenshteinDistanceMain(s1, l1 - 1, s2, l2,     meta) + 1,
          LevenshteinDistanceMain(s1, l1,     s2, l2 - 1, meta) + 1,
          LevenshteinDistanceMain(s1, l1 - 1, s2, l2 - 1, meta) + cost
        );
      }
      registry[key] = {val : val};
    }
    return val;
  },
  LevenshteinDistance = function(s1, s2) {
    var
    st;
    if(s1 > s2) {
      st = s1;
      s1 = s2;
      s2 = st;
    }
    return LevenshteinDistanceMain(s1, s1.length, s2, s2.length);
  };
  return LevenshteinDistance;
});
