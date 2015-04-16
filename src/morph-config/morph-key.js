define([
], function() {

return {
  morphKey : function(key, val, validator, isPresent) {
    var newVal = val;
    if(isPresent) {
      if(validator.morph) {
        newVal = this.morphType(key, newVal, validator, isPresent);
      }

      newVal = this.morphValue(key, newVal, validator, isPresent);
    }
    else {
      if(validator.morph && validator.morph.hasOwnProperty("default")) {
        newVal = validator.morph.default;
      }
    }

    return newVal;
  },
};

});
