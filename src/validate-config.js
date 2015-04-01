define([
  "./logger",
  "./validators/main",
  "./setValidator",
  "./hierarchy",
], function(Logger) {

function ValidateConfig(validator) {
  if(validator) {
    this.setValidator(validator);
  }
  else {
    this.reset();
  }
}

ValidateConfig.prototype.reset = function() {
  this.hierarchy = [];
  this.hierarchyPlaceholder = [];

  this.logger = new Logger();

  this.fullKeysPresent = {};
};

for(var i = 1; i < arguments.length; i++) {
  for(var k in arguments[i]) {
    ValidateConfig.prototype[k] = arguments[i][k];
  }
}

window.ValidateConfig = ValidateConfig;

});
