define([
], function() {

return {
  "string" : function(key, val, validator) {
    var retVal = val;
    switch(validator.morph.type) {
      case "parse" :
      default:
        retVal = Number(val);
        if(isNaN(retVal)) {
          retVal = val;
        }
        break;
    }

    return retVal;
  },

  "boolean" : function(key, val, validator) {
    return val ? 1 : 0;
  },

  "__default__" : function(key, val, validator) {
    return val;
  },
};

});
