define([
  "../typeOf",
], function(typeOf) {

return {
  objectValidator : function(key, val, validator) {
    var
    checked = {};

    for(var vk in validator.keys) {
      var
      newVal = val[vk],
      isPresent = val.hasOwnProperty(vk);

      this.hierarchy.pushToHierarchy(vk, vk);

      newVal = this.morphKey(vk, newVal, validator.keys[vk], isPresent);

      if(isPresent || (newVal !== null && newVal !== undefined)) {
        val[vk] = newVal;
        this.validator(vk, val[vk], validator.keys[vk]);
      }
      else {
        if(validator.keys[vk].isMandatory) {
          this.mandatoryParamsValidator(vk, null, validator.keys[vk]);
        }
      }

      this.hierarchy.popFromHierarchy();
    }

    for(var k in val) {
      if(!validator.keys[k]) {
        this.hierarchy.pushToHierarchy(k, k);
        this.extraParamsValidator(k, val[k], validator);
        this.hierarchy.popFromHierarchy();
      }
    }

    return true;
  },
};

});
