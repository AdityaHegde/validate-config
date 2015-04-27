define([
  "./typeOf",
], function(typeOf) {

return {
  _prepareValidator : function(validator) {
    if(validator.type === "object") {
      for(var k in validator.keys) {
        this.hierarchy.pushToHierarchy(k);

        this._prepareValidator(validator.keys[k]);
        validator.keys[k].parentValidator = validator;

        if(!this.fullKeysSet[k]) {
          this.fullKeysSet[k] = [];
        }
        this.fullKeysSet[k].push(this.hierarchy.hierarchyPlaceholder.slice());

        this.hierarchy.popFromHierarchy();
      }
    }
    else if(validator.type === "array") {
      this.hierarchy.pushToHierarchy("arrayElement", "*");

      validator.placeholderKey = "*";
      validator.elementsValidator.parentValidator = validator;
      this._prepareValidator(validator.elementsValidator);

      this.hierarchy.popFromHierarchy();
    }

    if(validator.morph && typeOf(validator.morph) === "boolean") {
      validator.morph = {};
    }
  },

  setValidator : function(validator) {
    this.reset();

    this.hierarchy.pushToHierarchy("$");
    this._prepareValidator(validator);
    this.hierarchy.popFromHierarchy();

    this.validatorConfig = validator;
  },
};

});
