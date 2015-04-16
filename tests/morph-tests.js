define([
  "src/validate-config",
  "./hasParentRefs",
], function(ValidateConfig, hasParentRefs) {

if(!Number.MIN_SAFE_INTEGER) {
  Number.MIN_SAFE_INTEGER = -Math.pow(2, 15);
}
if(!Number.MAX_SAFE_INTEGER) {
  Number.MAX_SAFE_INTEGER = Math.pow(2, 15);
}

var
validator = {
  type : "object",
  keys : {
    strings : {
      type : "object",
      keys : {
        stringify : {
          type : "string",
          morph : true,
        },
        join : {
          type : "string",
          morph : {
            type : "join",
          },
        },
        joinWithStr : {
          type : "string",
          morph : {
            type : "join",
            joinStr : " : ",
          },
        },
      },
    },
    numbers : {
      type : "number",
      morph : true,
    },
    objects : {
      type : "object",
      keys : {
        vara : {
          isMandatory : true,
          type : "number",
          morph : {
            default : 123,
          },
        },
        varb : {
          type : "string",
        },
        varc : {
          type : "array",
          elementsValidator : {
            type : "object",
            keys : {
              vard : {
                type : "number",
              },
              vare : {
                type : "string",
              },
            },
          },
        },
      },
      morph : {
        indexToKeys : [{
          key : "varb",
        }, {
          key : "varc",
        }, {
          key : "vara",
          morph : {
            default : 1,
          },
        }],
      },
    },
    merge : {
      type : "object",
      keys : {
        a : {
          type : "object",
          keys : {
            b : {
              type : "number",
            },
            c : {
              type : "string",
            },
          },
        },
        d : {
          type : "array",
          elementsValidator : {
            type : "object",
            keys : {
              e : {
                type : "number",
              },
              f : {
                type : "string",
              },
            },
          },
        },
        g : {
          type : "object",
          keys : {
            b : {
              type : "number",
            },
            c : {
              type : "string",
            },
          },
        },
        h : {
          type : "object",
          keys : {
            b : {
              type : "number",
            },
            c : {
              type : "string",
            },
          },
        },
      },
      morph : {
        valueMorphType : "mergeKeys",
        mergeKeys : {
          b : {
            toKey : "*.b",
            expandKeys : [{
              a : 1,
              h : 1,
            }],
          },
          e : {
            toKey : "d.*.e",
          },
        },
        dontReplaceExisting : true,
      },
    },
    arrays : {
      type : "array",
      isMandatory : true,
      elementsValidator : {
        type : "number",
        morph : true,
      },
      morph : true,
    },
    arrays_split : {
      type : "array",
      elementsValidator : {
        type : "number",
        morph : true,
      },
      morph : {
        type : "split",
      },
    },
    arrays_split_str : {
      type : "array",
      elementsValidator : {
        type : "number",
        morph : true,
      },
      morph : {
        type : "split",
        splitStr : " : ",
      },
    },
  },
};

return function() {

QUnit.module("MorphConfig");

QUnit.test("Type Morph", function(assert) {
  var
  tests = [{
    input  : {
      strings : {
        stringify : 123,
      },
      arrays : [],
    },
    output : {
      strings : {
        stringify : "123",
      },
      arrays : [],
    },
    invalidKeys : {
      extraKey            : {},
      invalidType         : {},
      invalidValue        : {},
      mandatoryKeyMissing : {},
    },
  }, {
    input  : {
      strings : {
        stringify : true,
        join : false,
      },
      arrays : [],
    },
    output : {
      strings : {
        stringify : "true",
        join : "false",
      },
      arrays : [],
    },
    invalidKeys : {
      extraKey            : {},
      invalidType         : {},
      invalidValue        : {},
      mandatoryKeyMissing : {},
    },
  }, {
    input  : {
      strings : {
        stringify : ["a", "b", 1],
      },
      arrays : [],
    },
    output : {
      strings : {
        stringify : '["a","b",1]',
      },
      arrays : [],
    },
    invalidKeys : {
      extraKey            : {},
      invalidType         : {},
      invalidValue        : {},
      mandatoryKeyMissing : {},
    },
  }, {
    input  : {
      strings : {
        stringify : {
          a : [1, 2, 3],
          b : "abc",
        },
        join : ["a", "b", 1],
        joinWithStr : ["a", "b", 1],
      },
      arrays : [],
    },
    output : {
      strings : {
        stringify : '{"a":[1,2,3],"b":"abc"}',
        join : "a,b,1",
        joinWithStr : "a : b : 1",
      },
      arrays : [],
    },
    invalidKeys : {
      extraKey            : {},
      invalidType         : {},
      invalidValue        : {},
      mandatoryKeyMissing : {},
    },
  }, {
    input  : {
      numbers : "123",
      arrays : [],
    },
    output : {
      numbers : 123,
      arrays : [],
    },
    invalidKeys : {
      extraKey            : {},
      invalidType         : {},
      invalidValue        : {},
      mandatoryKeyMissing : {},
    },
  }, {
    input  : {
      numbers : true,
      arrays : [],
    },
    output : {
      numbers : 1,
      arrays : [],
    },
    invalidKeys : {
      extraKey            : {},
      invalidType         : {},
      invalidValue        : {},
      mandatoryKeyMissing : {},
    },
  }, {
    input  : {
      numbers : false,
      arrays : [],
    },
    output : {
      numbers : 0,
      arrays : [],
    },
    invalidKeys : {
      extraKey            : {},
      invalidType         : {},
      invalidValue        : {},
      mandatoryKeyMissing : {},
    },
  }, {
    input  : {
      numbers : "abc",
      arrays : [],
    },
    output : {
      numbers : "abc",
      arrays : [],
    },
    invalidKeys : {
      extraKey            : {},
      invalidType         : {
        "$.numbers" : {
          type : "error",
          details : {
            actualType : "string",
            hierarchyStr : "$",
            key : "numbers",
            validator : {
              morph : {},
              type : "number"
            }
          },
        },
      },
      invalidValue        : {},
      mandatoryKeyMissing : {},
    },
  }, {
    input  : {
      objects : {
        varb : "abc",
      },
      arrays : [],
    },
    output : {
      objects : {
        vara : 123,
        varb : "abc",
      },
      arrays : [],
    },
    invalidKeys : {
      extraKey            : {},
      invalidType         : {},
      invalidValue        : {},
      mandatoryKeyMissing : {},
    },
  }, {
    input  : {
      objects : '{"vara":123,"varb":"abc"}',
      arrays : [],
    },
    output : {
      objects : {
        vara : 123,
        varb : "abc",
      },
      arrays : [],
    },
    invalidKeys : {
      extraKey            : {},
      invalidType         : {},
      invalidValue        : {},
      mandatoryKeyMissing : {},
    },
  }, {
    input  : {
      objects : ["def", [{
        vard : 123,
      }], 456],
      arrays : [],
    },
    output : {
      objects : {
        vara : 456,
        varb : "def",
        varc : [{
          vard : 123,
        }],
      },
      arrays : [],
    },
    invalidKeys : {
      extraKey            : {},
      invalidType         : {},
      invalidValue        : {},
      mandatoryKeyMissing : {},
    },
  }, {
    input  : {
      objects : ["def", [{
        vard : 123,
      }]],
      arrays : [],
    },
    output : {
      objects : {
        vara : 123,
        varb : "def",
        varc : [{
          vard : 123,
        }],
      },
      arrays : [],
    },
    invalidKeys : {
      extraKey            : {},
      invalidType         : {},
      invalidValue        : {},
      mandatoryKeyMissing : {},
    },
  }, {
    input  : {
      arrays : 1,
    },
    output : {
      arrays : [1],
    },
    invalidKeys : {
      extraKey            : {},
      invalidType         : {},
      invalidValue        : {},
      mandatoryKeyMissing : {},
    },
  }, {
    input  : {
      arrays : "[1,2,3]",
    },
    output : {
      arrays : [1, 2, 3],
    },
    invalidKeys : {
      extraKey            : {},
      invalidType         : {},
      invalidValue        : {},
      mandatoryKeyMissing : {},
    },
  }, {
    input  : {
      arrays : [],
      arrays_split : "1,2,3",
    },
    output : {
      arrays : [],
      arrays_split : [1, 2, 3],
    },
    invalidKeys : {
      extraKey            : {},
      invalidType         : {},
      invalidValue        : {},
      mandatoryKeyMissing : {},
    },
  }, {
    input  : {
      arrays : [],
      arrays_split_str : "1 : 2 : 3",
    },
    output : {
      arrays : [],
      arrays_split_str : [1, 2, 3],
    },
    invalidKeys : {
      extraKey            : {},
      invalidType         : {},
      invalidValue        : {},
      mandatoryKeyMissing : {},
    },
  }, {
    input  : {
      arrays : [],
      merge : {
        a : {
          b : 1,
        },
        b : 2,
        c : 3,
        d : [{
          e : 1,
        }, {
          f : "a",
        }],
        e : 4,
        f : 5,
        g : {},
        h : {},
      },
    },
    output : {
      arrays : [],
      merge : {
        a : {
          b : 1,
        },
        c : 3,
        d : [{
          e : 1,
        }, {
          e : 4,
          f : "a",
        }],
        f : 5,
        g : {},
        h : {
          b : 2,
        },
      },
    },
    invalidKeys : {
      extraKey            : {
        "$.merge.c" : {
          type : "warn",
          details : {
            key          : "c",
            val          : 3,
            hierarchyStr : "$.merge",
            matches      : [],
            otherLoc     : [
              "$.merge.a.c",
              "$.merge.g.c",
              "$.merge.h.c",
            ],
            validator : validator.keys.merge,
          },
        },
        "$.merge.f" : {
          type : "warn",
          details : {
            key          : "f",
            val          : 5,
            hierarchyStr : "$.merge",
            matches      : [],
            otherLoc     : [
              "$.merge.d.*.f",
            ],
            validator : validator.keys.merge,
          },
        },
      },
      invalidType         : {},
      invalidValue        : {},
      mandatoryKeyMissing : {},
    },
  }];

  for(var i = 0; i < tests.length; i++) {
    var ValidateConfigObj = new ValidateConfig(validator);
    ValidateConfigObj.validate(tests[i].input);

    //clear parent validator refs to remove circular refs
    hasParentRefs(validator);

    assert.propEqual(ValidateConfigObj.invalidKeys, tests[i].invalidKeys, "Invalid Keys for test case " + i);
    assert.propEqual(tests[i].input, tests[i].output, "Output config for test case " + i);
  }
});

};

});
