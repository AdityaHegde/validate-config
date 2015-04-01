define(function() {

return {
  _prepareValidator : function(validator) {
    for(var k in validator.keys) {
      this.hierarchy.push(k);

      if(validator.keys[k].type === "object") {
        this._prepareValidator(validator.keys[k]);
      }
      else if(validator.keys[k].type === "array") {
        this.hierarchy.push("@");
        this._prepareValidator(validator.keys[k]);
        this.hierarchy.pop();
      }

      validator.keys[k].parentValidator = validator;

      if(!this.fullKeysSet[k]) {
        this.fullKeysSet[k] = [];
      }
      this.fullKeysSet[k].push(this.hierarchy.slice());

      this.hierarchy.pop();
    }
  },

  setValidator : function(validator) {
    this.reset();
    this._prepareValidator(validator, []);
  },
};

});
