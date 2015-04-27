define([
  "./invalidKeys",
  "deep_keys_lib",
  "./validators/validators",
  "./morph-config/morphConfigs",
  "./setValidator",
], function(InvalidKeys, DeepKeysLib, validators, morphConfigs, setValidator) {

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

var modules = [validators, morphConfigs, setValidator];
for(var i = 0; i < modules.length; i++) {
  for(var k in modules[i]) {
    ValidateConfig.prototype[k] = modules[i][k];
  }
}

//window.ValidateConfig = ValidateConfig;
return ValidateConfig;

});
