module.exports = {
  compile : {
    options : {
      baseUrl : "src",
      dir : "build",
      mainConfigFile : "src/requirejs-config.js",

      fileExclusionRegExp : /^(?:\.|_)/,
      findNestedDependencies : true,
      skipDirOptimize : true,
      removeCombined : true,
      optimize : "none",

      modules : [
        {
          name : "validate-config",
        },
      ],
    },
  },
};
