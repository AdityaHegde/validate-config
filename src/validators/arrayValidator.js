define([
  "../typeOf",
], function(typeOf) {

return {
  arrayValidator : function(key, val, validator) {
    for(var i = 0; i < val.length; i++) {
      this.hierarchy.pushToHierarchy(i, validator.placeholderKey);

      var newVal = this.morphKey(i, val[i], validator.elementsValidator, true);
      this.validator(i, newVal, validator.elementsValidator);
      val[i] = newVal;

      this.hierarchy.popFromHierarchy();
    }

    return true;
  },
};

});
