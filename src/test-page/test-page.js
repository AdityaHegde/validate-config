define([
  "jquery",
  "../validate-config",
  "./message-templates",
], function($, ValidateConfig, MessageTemplates) {

var
validatorTextarea = $(".validator-textarea"),
configTextarea = $(".config-textarea"),
verifyBttn = $(".verify-bttn"),
messages = $(".messages");

validatorTextarea.val('{\n' +
'  "type" : "object",\n' +
'  "keys" : {\n' +
'    "a" : {\n' +
'      "type" : "string",\n' +
'      "isMandatory" : true\n' +
'    },\n' +
'    "b" : {\n' +
'      "type" : "number"\n' +
'    }\n' +
'  }\n' +
'}');

configTextarea.val('{\n' +
'  "a" : "abc",\n' +
'  "b" : 123\n' +
'}');

verifyBttn.click(function(e) {
  messages.html("");
  try {
    var
    validator = JSON.parse(validatorTextarea.val()),
    config    = JSON.parse(configTextarea.val()),
    validatorObj = new ValidateConfig(validator);
    validatorObj.validate(config);
    for(var i = 0; i < validatorObj.logger.messages.length; i++) {
      messages.append(MessageTemplates[validatorObj.logger.messages[i].message](validatorObj.logger.messages[i]));
    }
  } catch(e) {
    messages.append(MessageTemplates.SyntaxError(e.message));
  }
});

});
