define(function () {
  return function(obj) {
    //Taken from "https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/"
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  };
})
