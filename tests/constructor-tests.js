define([
  "src/validate-config",
  "./hasParentRefs",
], function(ValidateConfig, hasParentRefs) {

return function() {

QUnit.module("Constructor");

QUnit.test("Set Validator", function(assert) {
  var
  tests = [{
    input  : null,
    output : {
      fullKeysPresent       : {},
      fullKeysSet           : {},
      invalidKeys : {
        extraKey            : {},
        invalidType         : {},
        invalidValue        : {},
        mandatoryKeyMissing : {},
      },
    },
  }, {
    input  : {
      type : "object",
      keys : {
        a : {
          type : "number",
        },
        b : {
          type : "string",
        },
      },
    },
    output : {
      fullKeysPresent       : {},
      fullKeysSet           : {
        a : [
          ["$", "a"],
        ],
        b : [
          ["$", "b"],
        ],
      },
      validatorConfig       : {
        type : "object",
        keys : {
          a : {
            type : "number",
          },
          b : {
            type : "string",
          },
        },
      },
      invalidKeys : {
        extraKey            : {},
        invalidType         : {},
        invalidValue        : {},
        mandatoryKeyMissing : {},
      },
    },
  }, {
    input  : {
      type : "object",
      keys : {
        a : {
          type : "number",
        },
        b : {
          type : "object",
          keys : {
            a : {
              type : "string",
            },
            c : {
              type : "string",
            },
          },
        },
      },
    },
    output : {
      fullKeysPresent       : {},
      fullKeysSet           : {
        a : [
          ["$", "a"],
          ["$", "b", "a"],
        ],
        b : [
          ["$", "b"],
        ],
        c : [
          ["$", "b", "c"],
        ],
      },
      validatorConfig       : {
        type : "object",
        keys : {
          a : {
            type : "number",
          },
          b : {
            type : "object",
            keys : {
              a : {
                type : "string",
              },
              c : {
                type : "string",
              },
            },
          },
        },
      },
      invalidKeys : {
        extraKey            : {},
        invalidType         : {},
        invalidValue        : {},
        mandatoryKeyMissing : {},
      },
    },
  }, {
    input  : {
      type : "object",
      keys : {
        a : {
          type : "array",
          elementsValidator : {
            type : "object",
            keys : {
              b : {
                type : "string",
              },
              c : {
                type : "object",
                keys : {
                  a : {
                    type : "number",
                  },
                },
              },
            },
          },
        },
        d : {
          type : "array",
          elementsValidator : {
            type : "string",
          },
        },
      },
    },
    output : {
      fullKeysPresent       : {},
      fullKeysSet           : {
        a : [
          ["$", "a", "*", "c", "a"],
          ["$", "a"],
        ],
        b : [
          ["$", "a", "*", "b"],
        ],
        c : [
          ["$", "a", "*", "c"],
        ],
        d : [
          ["$", "d"],
        ],
      },
      validatorConfig       : {
        type : "object",
        keys : {
          a : {
            type : "array",
            placeholderKey : "*",
            elementsValidator : {
              type : "object",
              keys : {
                b : {
                  type : "string",
                },
                c : {
                  type : "object",
                  keys : {
                    a : {
                      type : "number",
                    },
                  },
                },
              },
            },
          },
          d : {
            type : "array",
            placeholderKey : "*",
            elementsValidator : {
              type : "string",
            },
          },
        },
      },
      invalidKeys : {
        extraKey            : {},
        invalidType         : {},
        invalidValue        : {},
        mandatoryKeyMissing : {},
      },
    },
  }, {
    input  : {
      type : "object",
      keys : {
        a : {
          type : "number",
          morph : true,
        },
        b : {
          type : "string",
        },
        c : {
          type : "string",
          morph : {
            type : "stringify",
          },
        },
      },
    },
    output : {
      fullKeysPresent       : {},
      fullKeysSet           : {
        a : [
          ["$", "a"],
        ],
        b : [
          ["$", "b"],
        ],
        c : [
          ["$", "c"],
        ],
      },
      validatorConfig       : {
        type : "object",
        keys : {
          a : {
            type : "number",
            morph : {},
          },
          b : {
            type : "string",
          },
          c : {
            type : "string",
            morph : {
              type : "stringify",
            },
          },
        },
      },
      invalidKeys : {
        extraKey            : {},
        invalidType         : {},
        invalidValue        : {},
        mandatoryKeyMissing : {},
      },
    },
  }];

  for(var i = 0; i < tests.length; i++) {
    var ValidateConfigObj = new ValidateConfig(tests[i].input);

    if(ValidateConfigObj.validatorConfig) {
      assert.ok(hasParentRefs(ValidateConfigObj.validatorConfig));
    }
    delete ValidateConfigObj.hierarchy;
    assert.propEqual(ValidateConfigObj, tests[i].output);
  }
});

};

});
