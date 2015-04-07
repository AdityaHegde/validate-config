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
      hierarchy             : [],
      hierarchyPlaceholder  : [],
      hierarchyPlaceholders : [],
      logger : {
        errors   : [],
        messages : [],
        warns    : []
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
      hierarchy             : [],
      hierarchyPlaceholder  : [],
      hierarchyPlaceholders : [],
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
      logger : {
        errors   : [],
        messages : [],
        warns    : []
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
      hierarchy             : [],
      hierarchyPlaceholder  : [],
      hierarchyPlaceholders : [],
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
      logger : {
        errors   : [],
        messages : [],
        warns    : []
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
          ["$", "a", "@", "c", "a"],
          ["$", "a"],
        ],
        b : [
          ["$", "a", "@", "b"],
        ],
        c : [
          ["$", "a", "@", "c"],
        ],
        d : [
          ["$", "d"],
        ],
      },
      hierarchy             : [],
      hierarchyPlaceholder  : [],
      hierarchyPlaceholders : [],
      validatorConfig       : {
        type : "object",
        keys : {
          a : {
            type : "array",
            placeholderKey : "@",
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
            placeholderKey : "@",
            elementsValidator : {
              type : "string",
            },
          },
        },
      },
      logger : {
        errors   : [],
        messages : [],
        warns    : []
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
      hierarchy             : [],
      hierarchyPlaceholder  : [],
      hierarchyPlaceholders : [],
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
      logger : {
        errors   : [],
        messages : [],
        warns    : []
      },
    },
  }];

  for(var i = 0; i < tests.length; i++) {
    var ValidateConfigObj = new ValidateConfig(tests[i].input);

    if(ValidateConfigObj.validatorConfig) {
      assert.ok(hasParentRefs(ValidateConfigObj.validatorConfig));
    }
    assert.propEqual(ValidateConfigObj, tests[i].output);
  }
});

};

});
