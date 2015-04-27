module.exports = {
  dist : {
    src : "build/validate-config.clean.js",
    dest : "validate-config.js",
    objectToExport : "validate_config",
    globalAlias    : "ValidateConfig",
    deps : {
      "default" : ["DeepKeysLib"],
      amd : ["deep_keys_lib"],
      cjs : ["deep-keys-lib"],
    },
  },
};
