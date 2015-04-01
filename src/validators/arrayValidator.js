define([
  "../typeOf",
], function(typeOf) {

return {
  arrayValidator : function(key, val, validator) {
    for(var i = 0; i < val.length; i++) {
      this.validator(i, val[i], validator.elementsValidator);
    }

    return true;
  },
};

});
