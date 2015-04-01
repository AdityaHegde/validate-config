module.exports = {
  options : {
    coverage : {
      disposeCollector : true,
      src : ["src/*.js", "src/*/*.js", "!src/lib/*.js"],
      instrumentedFiles : "tmp",
      lcovReport : "coverage",
    },
  },

  all : [
    "unit_test.html",
  ],
};
