define([
  "./arrayValidator",
  "./numberValidator",
  "./regexValidator",
  "./validator",
  "./extraParamsValidator",
  "./mandatoryParamsValidator",
  "./objectValidator",
  "./typeValidator",
], function() {
  var Validators = {};
  //window.Validators = Validators;

  for(var i = 0; i < arguments.length; i++) {
    for(var k in arguments[i]) {
      Validators[k] = arguments[i][k];
    }
  }

  return Validators;
});
