define([
], function() {

return {
  "string" :function(key, val, validator) {
    var retVal = val;
    switch(validator.morph.type) {
      case "split" :
        var splitRegex = new RegExp(validator.morph.splitStr || ",");
        retVal = val.split(splitRegex);
        break;

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
    return val;
  },

  "__default__" : function(key, val, validator) {
    if(val !== null || val !== undefined) {
      return [val];
    }
    return val;
  },
};

});
