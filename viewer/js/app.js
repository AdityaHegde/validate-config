define([
  "ember",
], function(Ember) {

  var App = Ember.Application.create({
    rootElement : "#viewer-app",
  });

  App.Router.map(function() {
    this.resource('index', { path : '' }, function() {
      this.resource('read', { path : 'read' });
      this.resource('view', { path : 'view' }, function() {
        this.resource('key', { path : 'key/:key_id' });
      });
    });
  });

  return App;
});
