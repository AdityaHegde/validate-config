define([
], function() {

return {
  "string" : function(key, val, validator) {
    var retVal = val;
    switch(validator.morph.type) {
      case "parse" :
      default:

        try {
          retVal = JSON.parse(val);
        } catch(e) {
          this.logger.error("InvalidValue", {
            key          : key,
            actualValue  : val,
            validator    : validator,
            hierarchyStr : this.hierarchy.hierarchyStr,
          });
        }

        break;
    }
    return retVal;
  },

  "array" : function(key, val, validator) {
    var
    retObj = val;

    switch(validator.morph.type) {
      case "indexToKeys" :
      default:

        var
        i = 0;
        retObj = {};
        for(; i < val.length; i++) {
          if(validator.morph.indexToKeys.length > i) {
            retObj[validator.morph.indexToKeys[i].key] = val[i];
          }
        }
        for(; i < validator.morph.indexToKeys.length; i++) {
          if(validator.morph.indexToKeys[i].default) {
            retObj[validator.morph.indexToKeys[i].key] = validator.morph.indexToKeys[i].default;
          }
        }

        break;
    }

    return retObj;
  },

  "__default__" : function(key, val, validator) {
    return val;
  },
};

});
