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
validator1 = {
  type : "object",
  keys : {
    alpha : {
      isMandatory : true,
      type : "string",
      regex : /^[a-zA-Z]*$/,
    },
    numbers : {
      type : "object",
      keys : {
        num : {
          isMandatory : true,
          type : "number",
        },
        numMax : {
          isMandatory : true,
          type : "number",
          max  : 100,
        },
        numMin : {
          type : "number",
          min  : 10,
        },
        numMinMax : {
          type : "number",
          min  : 10,
          max  : 100,
        },
      },
    },
    array : {
      type : "array",
      elementsValidator : {
        type : "number",
      },
    },
  },
},
validator2 = {
  type : "object",
  keys : {
    key0Level0 : {
      isMandatory : true,
      type : "string",
    },
    key1Level0 : {
      type : "object",
      keys : {
        key0Level0 : {
          isMandatory : true,
          type : "number",
        },
        key00Tier1 : {
          type : "array",
          elementsValidator : {
            type : "object",
            keys : {
              key1Stage2 : {
                type : "object",
                keys : {
                  key0Level3 : {
                    type : "string",
                  },
                },
              },
              key1Tier1 : {
                type : "string",
              },
            },
          },
        },
        key1Tier1 : {
          type : "number",
        },
      },
    },
    key2Level0 : {
      type : "array",
      elementsValidator : {
        type : "number",
      },
    },
  },
};

return function() {

QUnit.module("ValidateConfig");

QUnit.test("Type Validation", function(assert) {
  var
  tests = [{
    input : "a",
    messages : [{
      message : "InvalidType",
      params : {
        actualType : "string",
        hierarchyStr : "",
        key : "$",
        validator : validator1,
      },
      type: "Error",
    }],
  }, {
    input : {
      alpha : 123,
      numbers : {
        num : "123",
        numMax : "abc",
        numMin : 50,
        numMinMax : 50,
      },
      array : "abc",
    },
    messages : [{
      message : "InvalidType",
      params : {
        actualType : "number",
        hierarchyStr : "$",
        key : "alpha",
        validator : validator1.keys.alpha,
      },
      type : "Error",
    }, {
      message : "InvalidType",
      params : {
        actualType : "string",
        hierarchyStr : "$.numbers",
        key : "num",
        validator : validator1.keys.numbers.keys.num,
      },
      type : "Error",
    }, {
      message : "InvalidType",
      params : {
        actualType : "string",
        hierarchyStr : "$.numbers",
        key : "numMax",
        validator : validator1.keys.numbers.keys.numMax,
      },
      type : "Error",
    }, {
      message : "InvalidType",
      params : {
        actualType : "string",
        hierarchyStr : "$",
        key : "array",
        validator : validator1.keys.array,
      },
      type : "Error",
    }],
  }, {
    input : {
      alpha : "abc",
      array : [
        123,
        "abc",
        {},
        [],
      ],
    },
    messages : [{
      message : "InvalidType",
      params : {
        actualType : "string",
        hierarchyStr : "$.array",
        key : 1,
        validator : validator1.keys.array.elementsValidator,
      },
      type : "Error",
    }, {
      message : "InvalidType",
      params : {
        actualType : "object",
        hierarchyStr : "$.array",
        key : 2,
        validator : validator1.keys.array.elementsValidator,
      },
      type : "Error",
    }, {
      message : "InvalidType",
      params : {
        actualType : "array",
        hierarchyStr : "$.array",
        key : 3,
        validator : validator1.keys.array.elementsValidator,
      },
      type : "Error",
    }],
  }];

  for(var i = 0; i < tests.length; i++) {
    var ValidateConfigObj = new ValidateConfig(validator1);
    ValidateConfigObj.validate(tests[i].input);

    //clear parent validator refs to remove circular refs
    hasParentRefs(validator1);

    assert.propEqual(ValidateConfigObj.logger.messages, tests[i].messages);
  }
});

QUnit.test("Value Validation", function(assert) {
  var
  tests = [{
    input : {
      alpha : "abc",
      numbers : {
        num : 123,
        numMax : 50,
        numMin : 50,
        numMinMax : 50,
      },
    },
    messages : [],
  }, {
    input : {
      alpha : "123",
      numbers : {
        num : Number.MIN_SAFE_INTEGER,
        numMax : Number.MIN_SAFE_INTEGER,
        numMin : Number.MIN_SAFE_INTEGER,
        numMinMax : Number.MIN_SAFE_INTEGER,
      },
    },
    messages : [{
      message : "InvalidValue",
      params : {
        actualValue : "123",
        hierarchyStr : "$",
        key : "alpha",
        validator : validator1.keys.alpha,
      },
      type : "Error",
    }, {
      message : "InvalidValue",
      params : {
        actualValue : Number.MIN_SAFE_INTEGER,
        hierarchyStr : "$.numbers",
        key : "numMin",
        validator : validator1.keys.numbers.keys.numMin,
      },
      type : "Error",
    }, {
      message : "InvalidValue",
      params : {
        actualValue : Number.MIN_SAFE_INTEGER,
        hierarchyStr : "$.numbers",
        key : "numMinMax",
        validator : validator1.keys.numbers.keys.numMinMax,
      },
      type : "Error",
    }],
  }, {
    input : {
      alpha : "abc",
      numbers : {
        num : Number.MAX_SAFE_INTEGER,
        numMax : Number.MAX_SAFE_INTEGER,
        numMin : Number.MAX_SAFE_INTEGER,
        numMinMax : Number.MAX_SAFE_INTEGER,
      },
    },
    messages : [{
      message : "InvalidValue",
      params : {
        actualValue : Number.MAX_SAFE_INTEGER,
        hierarchyStr : "$.numbers",
        key : "numMax",
        validator : validator1.keys.numbers.keys.numMax,
      },
      type : "Error",
    }, {
      message : "InvalidValue",
      params : {
        actualValue : Number.MAX_SAFE_INTEGER,
        hierarchyStr : "$.numbers",
        key : "numMinMax",
        validator : validator1.keys.numbers.keys.numMinMax,
      },
      type : "Error",
    }],
  }];

  for(var i = 0; i < tests.length; i++) {
    var ValidateConfigObj = new ValidateConfig(validator1);
    ValidateConfigObj.validate(tests[i].input);

    //clear parent validator refs to remove circular refs
    hasParentRefs(validator1);

    assert.propEqual(ValidateConfigObj.logger.messages, tests[i].messages);
  }
});

QUnit.test("Misc Validation", function(assert) {
  var
  tests = [{
    input : {
      key0Level0 : "abc",
      key1Level0 : {
        key0Level0 : 123,
      },
    },
    messages : [],
  }, {
    input : {
      key0Level0 : "abc",
      key1Level0 : {},
    },
    messages : [{
      message : "MandatoryParamMissing",
      params : {
        hierarchyStr : "$.key1Level0",
        key : "key0Level0",
        validator : validator2.keys.key1Level0.keys.key0Level0,
      },
      type : "Error",
    }],
  }, {
    input : {
      key0Level0 : "abc",
      key1Level0 : {
        key0Level1 : 123,
        key2Tier1  : 123,
      },
    },
    messages : [{
      message : "ExtraParam",
      params : {
        hierarchyStr : "$.key1Level0",
        key : "key0Level1",
        matches : [
          "key0Level0",
        ],
        otherLoc : [],
        val : 123,
        validator : validator2.keys.key1Level0,
      },
      type : "Warn",
    }, {
      message : "ExtraParam",
      params : {
        hierarchyStr : "$.key1Level0",
        key : "key2Tier1",
        matches : [
          "key1Tier1",
          "key00Tier1",
        ],
        otherLoc : [],
        val : 123,
        validator : validator2.keys.key1Level0,
      },
      type : "Warn",
    }, {
      message : "MandatoryParamMissing",
      params : {
        hierarchyStr : "$.key1Level0",
        key : "key0Level0",
        validator : validator2.keys.key1Level0.keys.key0Level0,
      },
      type : "Error",
    }],
  }, {
    input : {
      key0Level0 : "abc",
      key1Level0 : {
        key0Level0 : 123,
        key00Tier1 : [{
          key1Stage2 : {
            key0Level3 : "abc",
            key1Tier1  : "abc",
          },
        }, {
          key1Stage2 : {
            key0Level3 : "abc",
          },
        }],
      },
    },
    messages : [{
      message : "ExtraParam",
      params : {
        hierarchyStr : "$.key1Level0.key00Tier1.0.key1Stage2",
        key : "key1Tier1",
        matches : [],
        otherLoc : [
          "$.key1Level0.key00Tier1.0.key1Tier1",
          "$.key1Level0.key1Tier1"
        ],
        val : "abc",
        validator : validator2.keys.key1Level0.keys.key00Tier1.elementsValidator.keys.key1Stage2,
      },
      type : "Warn",
    }],
  }];

  for(var i = 0; i < tests.length; i++) {
    var ValidateConfigObj = new ValidateConfig(validator2);
    ValidateConfigObj.validate(tests[i].input);

    //clear parent validator refs to remove circular refs
    hasParentRefs(validator2);

    assert.propEqual(ValidateConfigObj.logger.messages, tests[i].messages);
  }
});

};

});
