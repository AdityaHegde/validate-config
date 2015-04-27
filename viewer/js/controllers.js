define([
  "ember",
  "./app",
  "validate_config",
], function(Ember, App, ValidateConfig) {

App.ReadController = Ember.Controller.extend({
  actions : {
    create : function() {
      var
      obj = this.get("model"),
      validate;
      obj.set("validator", JSON.parse(obj.get("validatorStr")));
      obj.set("config", JSON.parse(obj.get("configStr")));
      validate = new ValidateConfig(obj.get("validator"));
      validate.validate(obj.get("config"));
      obj.set("validate", validate);

      this.transitionToRoute("view");
    },
  },
});


});
