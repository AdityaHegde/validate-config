define([
], function() {

var typeToVarMap = {
  "Warn" : "warns",
  "Error" : "errors",
};

function Logger() {
  this.messages = [];
  this.errors = [];
  this.warns = [];
}

/*Logger.stringGeneratorTemplates = {
  "MandatoryParamMissing" : Handlebars.compile('' +
    '<div>' +
      '<p>{{type}}: {{message}}</p>' +
      '<p>Param: {{params.key}} at {{params.hierarchyStr}}</p>' +
    '</div>'),
  "InvalidType" : Handlebars.compile('' +
    '<div>' +
      '<p>{{type}}: {{message}}</p>' +
      '<p>Expected {{params.validator.type}}, Got {{params.actualType}}</p>' +
      '<p>For {{params.key}} at {{params.hierarchyStr}}</p>' +
    '</div>'),
  "InvalidValue" : Handlebars.compile('' +
    '<div>' +
      '<p>{{type}}: {{message}}</p>' +
      '<p>Expected {{params.validator.message}}, Got {{params.actualValue}}</p>' +
      '<p>For {{params.key}} at {{params.hierarchyStr}}</p>' +
    '</div>'),
  "ExtraParam" : Handlebars.compile('' +
    '<div>' +
      '<p>{{type}}: {{message}}</p>' +
      '<p>Param: {{params.key}} at {{params.hierarchyStr}}</p>' +
      '{{#if params.matches}}<p>Did you mean {{#each params.matches}}{{this}}{{#unless @last}} or {{/unless}}{{/each}} ?</p>{{/if}}' +
      '{{#if params.otherLoc}}<p>Did you meant to add it ad {{#each params.otherLoc}}{{this}}{{#unless @last}} or {{/unless}}{{/each}} ?</p>{{/if}}' +
    '</div>'),
  "UncaughtError" : Handlebars.compile('' +
    '<div>' +
      '<p>{{type}}: {{message}}</p>' +
      '<p>{{params, errMessage}} at {{params.hierarchyStr}}</p>' +
    '</div>'),
};*/

Logger.prototype.log = function(type, message, params) {
  /*var str = Logger.stringGeneratorTemplates[message]({
    type : type,
    message : message,
    params : params,
  });
  this[typeToVarMap[type]].push(str);
  this.messages.push(str);*/
  var messageObj = {
    type : type,
    message : message,
    params : params,
  };
  this[typeToVarMap[type]].push(messageObj);
  this.messages.push(messageObj);
};

Logger.prototype.warn = function(message, params) {
  this.log("Warn", message, params);
};

Logger.prototype.error = function(message, params) {
  this.log("Error", message, params);
};

return Logger;

});
