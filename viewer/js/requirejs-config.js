var require = {
  baseUrl : ".",
  paths : {
    jquery           : "js/lib/jquery-2.1.3",
    ember            : "js/lib/ember",
    ember_utils_core : "js/lib/ember-utils-core",
    deep_keys_lib    : "js/lib/deep-keys-lib",
    bootstrap        : "js/lib/bootstrap",
    validate_config  : "../validate-config",
    ember_template_compiler : "js/lib/ember-template-compiler",
  },
  shim : {
    ember : {
      deps : [ "jquery", "ember_template_compiler" ],
      exports : "Ember",
    },
    bootstrap : {
      deps : [ "jquery" ],
    },
    validate_config : {
      exports : "ValidateConfig",
      deps : ["deep_keys_lib"],
    },
  },
};
