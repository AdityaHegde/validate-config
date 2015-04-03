var require = {
  baseUrl : "src/",
  paths : {
    jquery     : "lib/jquery-2.1.3",
    handlebars : "lib/handlebars",
  },
  shim : {
    jquery : {
      exports : "$",
    },
    handlebars : {
      exports : "Handlebars",
    },
  },
  waitSeconds : 10,
};
