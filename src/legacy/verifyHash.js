define([
  "./typeOf",
], function(typeOf) {
  var
  sample = {
    childKeys : {
      a : {
        regex  : /^\d+$/,
      },
      b : {
        childKeys : {
          c : {
            regex  : /^\w+$/,
          },
        },
        mandatoryKeys : {
          c : 1,
        },
      },
      d : {
        isArray : 1,
        childKeys : {
          e : {
            regex : /^\w+$/,
          },
        },
        mandatoryKeys : {
          e : 1,
        },
      },
    },
    mandatoryKeys : {
      b : 1,
    },
  },
  verifyHash = function(hash, options, messages, meta) {
    var mandatoryKeys = {};
    try {
      for(var k in hash) {
        if(hash.hasOwnProperty(k)) {
          var
          fullKey = meta.hierarchy.join(".") + "." + k;
          if(options.childKeys[k]) {
            var
            kmeta = options.childKeys[k],
            v     = hash[k];
            meta.fullKeysPresent[fullKey] = 1;
            if(options.mandatoryKeys[k]) {
              mandatoryKeys[k] = 1;
            }
            if(kmeta.regex && !kmeta.regex.test(v)) {
              messages.push({
                type      : "WARN",
                message   : "InvalidValue",
                key       : k,
                value     : v,
                hierarchy : meta.hierarchy.slice(),
              });
            }
            if(kmeta.isArray) {
              if(typeOf(v) === "array") {
                meta.hierarchy.push(k);
                for(var i = 0; i < v.length; i++) {
                  meta.hierarchy.push(i);
                  verifyHash(v[i], kmeta, messages, meta);
                  meta.hierarchy.pop();
                }
                meta.hierarchy.pop();
              }
              else {
                messages.push({
                  type      : "ERROR",
                  message   : "InvalidValue",
                  key       : k,
                  value     : v,
                  hierarchy : meta.hierarchy.slice(),
                });
              }
            }
            else if(kmeta.childKeys) {
              if(typeOf(v) === "object") {
                meta.hierarchy.push(k);
                verifyHash(v, kmeta, messages, meta);
                meta.hierarchy.pop();
              }
              else {
                messages.push({
                  type      : "ERROR",
                  message   : "InvalidValue",
                  key       : k,
                  value     : v,
                  hierarchy : meta.hierarchy.slice(),
                });
              }
            }
          }
          else {
            var
            matches = [],
            otherLoc = [];
            for(var ck in options.childKeys) {
              var
              ckl = ck.length, kl = k.length,
              ld = StringMatch.LevenshteinDistance(ck, k);
              if(ld <= 0.25 * kl) {
                matches.push(ck);
              }
            }
            if(meta.fullOptions.fullKeysSet[k]) {
              for(var i = 0; i < meta.fullOptions.fullKeysSet[k].length; i++) {
                if(!meta.fullKeysPresent[meta.fullOptions.fullKeysSet[k][i].join(".")]) {
                  otherLoc.push(meta.fullOptions.fullKeysSet[k][i]);
                }
              }
            }
            messages.push({
              type      : "WARN",
              message   : "ExtraParam",
              key       : k,
              hierarchy : meta.hierarchy.slice(),
              matches   : matches,
              otherLoc  : otherLoc,
            });
          }
        }
      }
      if(options.mandatoryKeys) {
        for(var mk in options.mandatoryKeys) {
          if(!mandatoryKeys[mk]) {
            messages.push({
              type      : "ERROR",
              message   : "MandatoryParamMissing",
              key       : mk,
              hierarchy : meta.hierarchy.slice(),
            });
          }
        }
      }
    } catch(e) {
      messages.push({
        type      : "ERROR",
        message   : e.message,
        hierarchy : meta.hierarchy.slice(),
      });
    }
  };

  return {
    verifyHash : function(hash, options) {
      var m = [];
      prepareOptions.prepareOptions(options);
      verifyHash(hash, options, m, {
        hierarchy : ["Root"],
        fullOptions : options,
        fullKeysPresent : {},
      });
      return m;
    },
    sample : sample,
  };
});
