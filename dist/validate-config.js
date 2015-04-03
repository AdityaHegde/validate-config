(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define([], factory);
  } else {
    // Browser globals.
    root.ValidateConfig = factory();
  }
}(this, function() {
/**
 * @license almond 0.3.0 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                name = baseParts.concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("lib/almond.js", function(){});

define('logger',[
], function() {

var typeToVarMap = {
  "Warn" : "warns",
  "Error" : "errors",
};

function Logger() {
  this.messages = [];
  this.errors = [];
  this.warns = [];
}

/*Logger.stringGeneratorTemplates = {
  "MandatoryParamMissing" : Handlebars.compile('' +
    '<div>' +
      '<p>{{type}}: {{message}}</p>' +
      '<p>Param: {{params.key}} at {{params.hierarchyStr}}</p>' +
    '</div>'),
  "InvalidType" : Handlebars.compile('' +
    '<div>' +
      '<p>{{type}}: {{message}}</p>' +
      '<p>Expected {{params.validator.type}}, Got {{params.actualType}}</p>' +
      '<p>For {{params.key}} at {{params.hierarchyStr}}</p>' +
    '</div>'),
  "InvalidValue" : Handlebars.compile('' +
    '<div>' +
      '<p>{{type}}: {{message}}</p>' +
      '<p>Expected {{params.validator.message}}, Got {{params.actualValue}}</p>' +
      '<p>For {{params.key}} at {{params.hierarchyStr}}</p>' +
    '</div>'),
  "ExtraParam" : Handlebars.compile('' +
    '<div>' +
      '<p>{{type}}: {{message}}</p>' +
      '<p>Param: {{params.key}} at {{params.hierarchyStr}}</p>' +
      '{{#if params.matches}}<p>Did you mean {{#each params.matches}}{{this}}{{#unless @last}} or {{/unless}}{{/each}} ?</p>{{/if}}' +
      '{{#if params.otherLoc}}<p>Did you meant to add it ad {{#each params.otherLoc}}{{this}}{{#unless @last}} or {{/unless}}{{/each}} ?</p>{{/if}}' +
    '</div>'),
  "UncaughtError" : Handlebars.compile('' +
    '<div>' +
      '<p>{{type}}: {{message}}</p>' +
      '<p>{{params, errMessage}} at {{params.hierarchyStr}}</p>' +
    '</div>'),
};*/

Logger.prototype.log = function(type, message, params) {
  /*var str = Logger.stringGeneratorTemplates[message]({
    type : type,
    message : message,
    params : params,
  });
  this[typeToVarMap[type]].push(str);
  this.messages.push(str);*/
  var messageObj = {
    type : type,
    message : message,
    params : params,
  };
  this[typeToVarMap[type]].push(messageObj);
  this.messages.push(messageObj);
};

Logger.prototype.warn = function(message, params) {
  this.log("Warn", message, params);
};

Logger.prototype.error = function(message, params) {
  this.log("Error", message, params);
};

return Logger;

});

define('typeOf',[],function () {
  return function(obj) {
    //Taken from "https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/"
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  };
})
;
define('validators/arrayValidator',[
  "../typeOf",
], function(typeOf) {

return {
  arrayValidator : function(key, val, validator) {
    for(var i = 0; i < val.length; i++) {
      this.validator(i, val[i], validator.elementsValidator);
    }

    return true;
  },
};

});

define('validators/numberValidator',[
  "../typeOf",
], function(typeOf) {

return {
  numberValidator : function(key, val, validator) {
    if((validator.min && val < validator.min) || (validator.max && val > validator.max)) {
      this.logger.error("InvalidValue", {
        key          : key,
        actualValue  : val,
        validator    : validator,
        hierarchyStr : this.hierarchyStr,
      });
      return false;
    }
    return true;
  },
};

});

define('validators/regexValidator',[
  "../typeOf",
], function(typeOf) {

return {
  regexValidator : function(key, val, validator) {
    var result = true;
    if(validator.regex) {
      result = !!val.match(validator.regex);
    }
    if(!result) {
      this.logger.error("InvalidValue", {
        key         : key,
        actualValue : val,
        validator   : validator,
        hierarchyStr : this.hierarchyStr,
      });
    }
    return result;
  },
};

});

define('validators/validator',[
  "../typeOf",
], function(typeOf) {

typeToValidatorMap = {
  "object"      : "objectValidator",
  "array"       : "arrayValidator",
  "string"      : "regexValidator",
  "number"      : "numberValidator",
  "__default__" : "regexValidator",
};

return {
  validator : function(key, val, validator) {
    this.pushToHierarchy(key, (validator.parentValidator && validator.parentValidator.placeholderKey) || key);
    this.fullKeysPresent[this.fullHierarchy] = 1;

    if(this.typeValidator(key, val, validator)) {
      var validatorFun = typeToValidatorMap[validator.type] || typeToValidatorMap["__default__"];
      this[validatorFun](key, val, validator);
    }

    this.popFromHierarchy();

    return true;
  },
};

});

define('levenshteinDistance',[],function() {
  var
  registry = {},
  LevenshteinDistanceMain = function(s1, l1, s2, l2, meta) {
    var
    key = s1 + "__" + l1 + "__" + s2 + "__" + l2,
    val;
    if(registry[key]) {
      val = registry[key].val;
    }
    else {
      if(l1 === 0) {
        val = l2;
      }
      else if(l2 === 0) {
        val = l1;
      }
      else {
        var
        cost = s1.charAt(l1 - 1) === s2.charAt(l2 - 1) ? 0 : 1;
        val = Math.min(
          LevenshteinDistanceMain(s1, l1 - 1, s2, l2,     meta) + 1,
          LevenshteinDistanceMain(s1, l1,     s2, l2 - 1, meta) + 1,
          LevenshteinDistanceMain(s1, l1 - 1, s2, l2 - 1, meta) + cost
        );
      }
      registry[key] = {val : val};
    }
    return val;
  },
  LevenshteinDistance = function(s1, s2) {
    var
    st;
    if(s1 > s2) {
      st = s1;
      s1 = s2;
      s2 = st;
    }
    return LevenshteinDistanceMain(s1, s1.length, s2, s2.length);
  };
  return LevenshteinDistance;
});

define('validators/extraParamsValidator',[
  "../typeOf",
  "../levenshteinDistance",
], function(typeOf, LevenshteinDistance) {

return {
  extraParamsValidator : function(key, val, validator) {
    var
    matches = [],
    matcheObjs = [],
    otherLoc = [];

    for(var ck in validator.keys) {
      var
      ckl = ck.length, kl = key.length,
      ld = LevenshteinDistance(ck, key);
      if(ld <= 0.25 * kl) {
        matcheObjs.push({
          ld : ld,
          ck : ck,
        });
      }
    }
    matches = matcheObjs.sort(function(a, b) {
      return a.ld - b.ld;
    }).map(function(e) {
      return e.ck;
    });

    if(this.fullKeysSet[key]) {
      for(var i = 0; i < this.fullKeysSet[key].length; i++) {
        var hierarchy = this.replacePlaceholders(this.hierarchy, this.fullKeysSet[key][i]).join(".");
        if(!this.fullKeysPresent[hierarchy]) {
          otherLoc.push(hierarchy);
        }
      }
    }

    this.logger.warn("ExtraParam", {
      key          : key,
      val          : val,
      validator    : validator,
      hierarchyStr : this.hierarchyStr,
      matches      : matches,
      otherLoc     : otherLoc,
    });

    return true;
  },
};

});

define('validators/mandatoryParamsValidator',[
  "../typeOf",
], function(typeOf) {

return {
  mandatoryParamsValidator : function(key, val, validator) {
    this.logger.error("MandatoryParamMissing", {
      key          : key,
      validator    : validator,
      hierarchyStr : this.hierarchyStr,
    });
    return true;
  },
};

});

define('validators/objectValidator',[
  "../typeOf",
], function(typeOf) {

return {
  objectValidator : function(key, val, validator) {
    var
    checked = {};

    for(var k in val) {
      checked[k] = 1;

      if(validator.keys[k]) {
        this.validator(k, val[k], validator.keys[k]);
      }
      else {
        this.pushToHierarchy(k, k);
        this.extraParamsValidator(k, val[k], validator);
        this.popFromHierarchy();
      }
    }

    for(var vk in validator.keys) {
      if(!checked[vk] && validator.keys[vk].isMandatory) {
        this.pushToHierarchy(vk, vk);
        this.mandatoryParamsValidator(vk, null, validator.keys[vk]);
        this.popFromHierarchy();
      }
    }

    return true;
  },
};

});

define('validators/typeValidator',[
  "../typeOf",
], function(typeOf) {

return {
  typeValidator : function(key, val, validator) {
    if(typeOf(val) !== validator.type) {
      this.logger.error("InvalidType", {
        key          : key,
        actualType   : typeOf(val),
        validator    : validator,
        hierarchyStr : this.hierarchyStr,
      });
      return false;
    }
    return true;
  },
};

});

define('validators/main',[
  "./arrayValidator",
  "./numberValidator",
  "./regexValidator",
  "./validator",
  "./extraParamsValidator",
  "./mandatoryParamsValidator",
  "./objectValidator",
  "./typeValidator",
], function() {
  var Validators = {};
  window.Validators = Validators;

  for(var i = 0; i < arguments.length; i++) {
    for(var k in arguments[i]) {
      Validators[k] = arguments[i][k];
    }
  }

  return Validators;
});

define('set-validator',[],function() {

return {
  _prepareValidator : function(validator) {
    if(validator.type === "object") {
      for(var k in validator.keys) {
        this.hierarchy.push(k);

        this._prepareValidator(validator.keys[k]);
        validator.keys[k].parentValidator = validator;

        if(!this.fullKeysSet[k]) {
          this.fullKeysSet[k] = [];
        }
        this.fullKeysSet[k].push(this.hierarchy.slice());

        this.hierarchy.pop();
      }
    }
    else if(validator.type === "array") {
      this.hierarchy.push("@");

      validator.placeholderKey = "@";
      validator.elementsValidator.parentValidator = validator;
      this._prepareValidator(validator.elementsValidator);

      this.hierarchy.pop();
    }
  },

  setValidator : function(validator) {
    this.reset();

    this.hierarchy.push("$");
    this._prepareValidator(validator);
    this.hierarchy.pop();

    this.validatorConfig = validator;
  },
};

});

define('hierarchy',[],function() {

return {
  replacePlaceholders : function(hierarchy, hierarchyPlaceholder) {
    var retHierarchy = hierarchyPlaceholder.slice();
    for(var i = 0, j = 0; i < hierarchy.length && j < this.hierarchyPlaceholders.length; i++) {
      if(i === this.hierarchyPlaceholders[j].index) {
        if(retHierarchy[i] === this.hierarchyPlaceholders[j].placeholder) {
          retHierarchy[i] = hierarchy[i];
          j++;
        }
        else {
          break;
        }
      }
      else if(hierarchy[i] !== retHierarchy[i]) {
        break;
      }
    }
    return retHierarchy;
  },

  pushToHierarchy : function(key, keyPlaceholder) {
    this.hierarchyStr = this.hierarchy.join(".");
    this.hierarchyPlaceholderStr = this.hierarchyPlaceholder.join(".");

    if(key !== keyPlaceholder) {
      this.hierarchyPlaceholders.push({
        placeholder : keyPlaceholder,
        index       : this.hierarchyPlaceholder.length,
      });
    }

    this.hierarchy.push(key);
    this.hierarchyPlaceholder.push(keyPlaceholder);

    this.fullHierarchyStr = this.hierarchy.join(".");
    this.fullHierarchyPlaceholderStr = this.hierarchyPlaceholder.join(".");
  },

  popFromHierarchy : function() {
    if(this.hierarchyPlaceholders.length > 0 && 
       this.hierarchyPlaceholders[this.hierarchyPlaceholders.length - 1].index === this.hierarchyPlaceholder.length - 1) {
      this.hierarchyPlaceholders.pop();
    }

    this.hierarchy.pop();
    this.hierarchyPlaceholder.pop();

    this.hierarchyStr = this.hierarchy.slice(0, -1).join(".");
    this.hierarchyPlaceholderStr = this.hierarchyPlaceholder.slice(0, -1).join(".");

    this.fullHierarchyStr = this.hierarchy.join(".");
    this.fullHierarchyPlaceholderStr = this.hierarchyPlaceholder.join(".");
  },
};

});

define('validate-config',[
  "./logger",
  "./validators/main",
  "./set-validator",
  "./hierarchy",
], function(Logger) {

function ValidateConfig(validator) {
  if(validator) {
    this.setValidator(validator);
  }
  else {
    this.reset();
  }
}

ValidateConfig.prototype.reset = function() {
  this.hierarchy = [];
  this.hierarchyPlaceholder = [];
  this.hierarchyPlaceholders = [];

  this.logger = new Logger();

  this.fullKeysPresent = {};
  this.fullKeysSet = {};
};

ValidateConfig.prototype.validate = function(config) {
  this.validator("$", config, this.validatorConfig);
};

for(var i = 1; i < arguments.length; i++) {
  for(var k in arguments[i]) {
    ValidateConfig.prototype[k] = arguments[i][k];
  }
}

window.ValidateConfig = ValidateConfig;
return ValidateConfig;

});

  // Register in the values from the outer closure for common dependencies
  // as local almond modules
 
  // Use almond's special top level synchronous require to trigger factory
  // functions, get the final module, and export it as the public api.
  return require('validate-config');
}));
