define([
  "../typeOf",
], function(typeOf) {

return {
  "number" : function(key, val, validator) {
    return val + "";
  },

  "boolean" : function(key, val, validator) {
    return val + "";
  },

  "array" : function(key, val, validator) {
    var retVal = val;
    switch(validator.morph.type) {
      case "join" :
        retVal = val.join(validator.morph.joinStr || ",");
        break;

      case "stringify" :
      default:
        retVal = JSON.stringify(val);
        break;
    }

    return retVal;
  },

  "object" : function(key, val, validator) {
    var retVal = val;
    switch(validator.morph.type) {
      default:
      case "stringify" :
        retVal = JSON.stringify(val);
        break;
    }

    return retVal;
  },

  "__default__" : function(key, val, validator) {
    return val;
  },
};

});
