define([
  "./invalidKeys",
  "deep_keys_lib",
  "./validators/main",
  "./morph-config/main",
  "./set-validator",
], function(InvalidKeys, DeepKeysLib) {

function ValidateConfig(validator) {
  if(validator) {
    this.setValidator(validator);
  }
  else {
    this.reset();
  }
}

ValidateConfig.prototype.reset = function() {
  this.hierarchy = new DeepKeysLib.HierarchyManager();

  this.invalidKeys = new InvalidKeys();

  this.fullKeysPresent = {};
  this.fullKeysSet = {};
};

ValidateConfig.prototype.validate = function(config) {
  this.hierarchy.pushToHierarchy("$", "$");
  this.validator("$", config, this.validatorConfig);
  this.hierarchy.popFromHierarchy();
};

for(var i = 2; i < arguments.length; i++) {
  for(var k in arguments[i]) {
    ValidateConfig.prototype[k] = arguments[i][k];
  }
}

//window.ValidateConfig = ValidateConfig;
return ValidateConfig;

});
