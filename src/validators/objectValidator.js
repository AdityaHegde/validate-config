define([
  "../typeOf",
], function(typeOf) {

return {
  objectValidator : function(key, val, validator) {
    var
    checked = {};

    for(var k in val) {
      checked[k] = 1;

      if(validator.keys[k]) {
        this.validator(k, val[k], validator.keys[k]);
      }
      else {
        this.pushToHierarchy(k, k);
        this.extraParamsValidator(k, val[k], validator);
        this.popFromHierarchy();
      }
    }

    for(var vk in validator.keys) {
      if(!checked[vk] && validator.keys[vk].isMandatory) {
        this.pushToHierarchy(vk, vk);
        this.mandatoryParamsValidator(vk, null, validator.keys[vk]);
        this.popFromHierarchy();
      }
    }

    return true;
  },
};

});
