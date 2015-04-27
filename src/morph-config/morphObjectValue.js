define([
  "deep_keys_lib",
], function(DeepKeysLib) {

return {
  "seperateKeys" : function(key, val, validator) {
    return val;
  },

  "mergeKeys" : function(key, val, validator) {
    if(validator.morph.mergeKeys) {
      for(var k in validator.morph.mergeKeys) {
        if(val[k] !== null && val[k] !== undefined) {
          DeepKeysLib.assignValue(val, validator.morph.mergeKeys[k].toKey, val[k], validator.morph.dontReplaceExisting, validator.morph.mergeKeys[k].expandKeys);
          delete val[k];
        }
      }
    }
    return val;
  },

  "__default__" : function(key, val, validator) {
    return val;
  },
};

});
