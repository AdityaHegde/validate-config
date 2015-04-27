define([
  "./arrayValidator",
  "./numberValidator",
  "./regexValidator",
  "./validator",
  "./extraParamsValidator",
  "./mandatoryParamsValidator",
  "./objectValidator",
  "./typeValidator",
], function(arrayValidator, numberValidator, regexValidator, validator, extraParamsValidator, mandatoryParamsValidator, objectValidator, typeValidator) {
  return {
    arrayValidator           : arrayValidator,
    numberValidator          : numberValidator,
    regexValidator           : regexValidator,
    validator                : validator,
    extraParamsValidator     : extraParamsValidator,
    mandatoryParamsValidator : mandatoryParamsValidator,
    objectValidator          : objectValidator,
    typeValidator            : typeValidator,
  };
});
