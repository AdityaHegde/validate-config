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
      wrap : {
        startFile: "wrap/start.frag",
        endFile: "wrap/end.frag"
      },

      modules : [
        {
          name : "validate-config",
          include : ["lib/almond.js"],
        },
      ],
    },
  },
};
