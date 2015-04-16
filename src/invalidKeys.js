define([
], function() {

var invalidTypeMap = {
  "type"      : "invalidType",
  "value"     : "invalidValue",
  "extra"     : "extraKey",
  "mandatory" : "mandatoryKeyMissing",
};

function InvalidKeys() {
  for(var k in invalidTypeMap) {
    this[invalidTypeMap[k]] = {};
  }
}

InvalidKeys.prototype.markAs = function(invalidType, key, type, details) {
  if(invalidTypeMap[invalidType]) {
    var ik = invalidTypeMap[invalidType];
    this[ik][key] = {
      type    : type,
      details : details,
    };
  }
};

InvalidKeys.prototype.unmarkAs = function(invalidType, key) {
  if(invalidTypeMap[invalidType]) {
    var ik = invalidTypeMap[invalidType];
    delete this[ik][key];
  }
};

return InvalidKeys;

});
