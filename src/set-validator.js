define([
  "./typeOf",
], function(typeOf) {

return {
  _prepareValidator : function(validator) {
    if(validator.type === "object") {
      for(var k in validator.keys) {
        this.hierarchy.push(k);

        this._prepareValidator(validator.keys[k]);
        validator.keys[k].parentValidator = validator;

        if(!this.fullKeysSet[k]) {
          this.fullKeysSet[k] = [];
        }
        this.fullKeysSet[k].push(this.hierarchy.slice());

        this.hierarchy.pop();
      }
    }
    else if(validator.type === "array") {
      this.hierarchy.push("@");

      validator.placeholderKey = "@";
      validator.elementsValidator.parentValidator = validator;
      this._prepareValidator(validator.elementsValidator);

      this.hierarchy.pop();
    }

    if(validator.morph && typeOf(validator.morph) === "boolean") {
      validator.morph = {};
    }
  },

  setValidator : function(validator) {
    this.reset();

    this.hierarchy.push("$");
    this._prepareValidator(validator);
    this.hierarchy.pop();

    this.validatorConfig = validator;
  },
};

});
