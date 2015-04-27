define([
  "ember",
  "./app",
], function(Ember, App) {

var obj = Ember.Object.create({
  validatorStr : "",
  cofnigStr    : "",
});

App.IndexRoute = Ember.Route.extend({
  model : function() {
    this.transitionTo("read");
  },

  actions : {
    willTransition : function(transition) {
      if(transition.targetName.match(/^index/)) {
        this.transitionTo("read");
      }
    },
  },
});

App.ReadRoute = Ember.Route.extend({
  model : function() {
    return obj;
  },
});

App.ViewRoute = Ember.Route.extend({
  model : function() {
    return obj;
  },
});


});
