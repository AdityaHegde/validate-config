define([
  "ember",
  "./app",
], function(Ember, App) {

App.IndexView = Ember.View.extend({
  template : Ember.HTMLBars.compile('' +
    '<nav class="navbar navbar-default" role="navigation">' +
      '<div class="navbar-header">' +
        '<a class="navbar-brand" href="#">Validate Config Viewer</a>' +
      '</div>' +
    '</nav>' +
    '<div class="container">' +
      '{{outlet}}' +
    '</div>' +
  ''),
});

App.ReadView = Ember.View.extend({
  template : Ember.HTMLBars.compile('' +
    '<div class="form">' +
      '<div class="form-group col-md-6">' +
        '<label for="validator">Validator</label>' +
        '{{textarea class="form-control" rows="25" id="validator" value=model.validatorStr}}' +
      '</div>' +
      '<div class="form-group col-md-6">' +
        '<label for="config">Config</label>' +
        '{{textarea class="form-control" rows="25" id="config" value=model.configStr}}' +
      '</div>' +
      '<button class="btn btn-primary" {{action "create"}}>Submit</button>' +
    '</div>' +
  ''),
});

App.ViewView = Ember.View.extend({
  template : Ember.HTMLBars.compile('' +
    '<div class="col-md-4">' +
    '</div>' +
    '<div class="col-md-8">' +
      '{{outlet}}' +
    '</div>' +
  ''),
});

});
