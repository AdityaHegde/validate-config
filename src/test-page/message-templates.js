define([
  "handlebars",
], function(Handlebars) {

return {
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
  "SyntaxError" : Handlebars.compile('' +
    '<div>' +
      '<p>{{this}}</p>' +
    '</div>'),
};

});
