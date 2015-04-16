module.exports = {
  dist : {
    options : {
      wrap : false,
      aggressiveOptimizations : true,
      esprima : {
        comment : false,
      },
      escodegen : {
        comment : false,
      },
      ignoreModules : ["deep_keys_lib"],
    },
    src : "build/validate-config.js",
    dest : "build/validate-config.clean.js",
  },
};
