define(function() {

//for assert to not go to infinite loop
var hasParentRefs = function(validator, parentValidator) {
  var result = true;
  if(parentValidator && validator.parentValidator !== parentValidator) {
    result = false;
  }
  if(validator.type === "object") {
    for(var k in validator.keys) {
      result = result && hasParentRefs(validator.keys[k], validator);
    }
  }
  else if(validator.type === "array") {
    result = result && hasParentRefs(validator.elementsValidator, validator);
  }
  delete validator.parentValidator;
  return result;
}

return hasParentRefs;

});
