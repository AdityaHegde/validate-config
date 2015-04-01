define([
  "src/hierarchy",
], function(Hierarchy) {

return function() {

QUnit.module("Hierarchy");

QUnit.test("pushToHierarchy", function(assert) {
  var
  tests = [{
    input : {
      hierarchy : ["a", "b"],
      hierarchyPlaceholder : ["a", "b"],
    },
    args : ["c", "c"],
    output : {
      hierarchy : ["a", "b", "c"],
      hierarchyPlaceholder : ["a", "b", "c"],
      hierarchyStr : "a.b",
      hierarchyPlaceholderStr : "a.b",
      fullHierarchyStr : "a.b.c",
      fullHierarchyPlaceholderStr : "a.b.c",
    },
  }, {
    input : {
      hierarchy : ["a", "b"],
      hierarchyPlaceholder : ["a", "b"],
      hierarchyPlaceholders : [],
    },
    args : ["1", "@"],
    output : {
      hierarchy : ["a", "b", "1"],
      hierarchyPlaceholder : ["a", "b", "@"],
      hierarchyStr : "a.b",
      hierarchyPlaceholderStr : "a.b",
      fullHierarchyStr : "a.b.1",
      fullHierarchyPlaceholderStr : "a.b.@",
      hierarchyPlaceholders : [{
        placeholder : "@",
        index : 2,
      }],
    },
  }, {
    input : {
      hierarchy : ["a", "1", "b"],
      hierarchyPlaceholder : ["a", "@", "b"],
      hierarchyPlaceholders : [{
        placeholder : "@",
        index : 1,
      }],
    },
    args : ["2", "@"],
    output : {
      hierarchy : ["a", "1", "b", "2"],
      hierarchyPlaceholder : ["a", "@", "b", "@"],
      hierarchyStr : "a.1.b",
      hierarchyPlaceholderStr : "a.@.b",
      fullHierarchyStr : "a.1.b.2",
      fullHierarchyPlaceholderStr : "a.@.b.@",
      hierarchyPlaceholders : [{
        placeholder : "@",
        index : 1,
      }, {
        placeholder : "@",
        index : 3,
      }],
    },
  }];

  for(var i = 0; i < tests.length; i++) {
    Hierarchy.pushToHierarchy.apply(tests[i].input, tests[i].args);

    assert.deepEqual(tests[i].input, tests[i].output);
  }
});

QUnit.test("popFromHierarchy", function(assert) {
  var
  tests = [{
    input : {
      hierarchy : ["a", "b", "c"],
      hierarchyPlaceholder : ["a", "b", "c"],
      hierarchyStr : "a.b",
      hierarchyPlaceholderStr : "a.b",
      fullHierarchyStr : "a.b.c",
      fullHierarchyPlaceholderStr : "a.b.c",
      hierarchyPlaceholders : [],
    },
    output : {
      hierarchy : ["a", "b"],
      hierarchyPlaceholder : ["a", "b"],
      hierarchyStr : "a",
      hierarchyPlaceholderStr : "a",
      fullHierarchyStr : "a.b",
      fullHierarchyPlaceholderStr : "a.b",
      hierarchyPlaceholders : [],
    },
  }, {
    input : {
      hierarchy : ["a", "b", "1"],
      hierarchyPlaceholder : ["a", "b", "@"],
      hierarchyStr : "a.b",
      hierarchyPlaceholderStr : "a.b",
      fullHierarchyStr : "a.b.1",
      fullHierarchyPlaceholderStr : "a.b.@",
      hierarchyPlaceholders : [{
        placeholder : "@",
        index : 2,
      }],
    },
    output : {
      hierarchy : ["a", "b"],
      hierarchyPlaceholder : ["a", "b"],
      hierarchyStr : "a",
      hierarchyPlaceholderStr : "a",
      fullHierarchyStr : "a.b",
      fullHierarchyPlaceholderStr : "a.b",
      hierarchyPlaceholders : [],
    },
  }, {
    input : {
      hierarchy : ["a", "1", "b"],
      hierarchyPlaceholder : ["a", "@", "b"],
      hierarchyStr : "a.1",
      hierarchyPlaceholderStr : "a.@",
      fullHierarchyStr : "a.1.b",
      fullHierarchyPlaceholderStr : "a.@.b",
      hierarchyPlaceholders : [{
        placeholder : "@",
        index : 1,
      }],
    },
    output : {
      hierarchy : ["a", "1"],
      hierarchyPlaceholder : ["a", "@"],
      hierarchyStr : "a",
      hierarchyPlaceholderStr : "a",
      fullHierarchyStr : "a.1",
      fullHierarchyPlaceholderStr : "a.@",
      hierarchyPlaceholders : [{
        placeholder : "@",
        index : 1,
      }],
    },
  }, {
    input : {
      hierarchy : ["a", "1", "b", "2"],
      hierarchyPlaceholder : ["a", "@", "b", "@"],
      hierarchyStr : "a.1.b",
      hierarchyPlaceholderStr : "a.@.b",
      fullHierarchyStr : "a.1.b.2",
      fullHierarchyPlaceholderStr : "a.@.b.@",
      hierarchyPlaceholders : [{
        placeholder : "@",
        index : 1,
      }, {
        placeholder : "@",
        index : 3,
      }],
    },
    output : {
      hierarchy : ["a", "1", "b"],
      hierarchyPlaceholder : ["a", "@", "b"],
      hierarchyStr : "a.1",
      hierarchyPlaceholderStr : "a.@",
      fullHierarchyStr : "a.1.b",
      fullHierarchyPlaceholderStr : "a.@.b",
      hierarchyPlaceholders : [{
        placeholder : "@",
        index : 1,
      }],
    },
  }];

  for(var i = 0; i < tests.length; i++) {
    Hierarchy.popFromHierarchy.apply(tests[i].input);

    assert.deepEqual(tests[i].input, tests[i].output);
  }
});

QUnit.test("replacePlaceholders", function(assert) {
  var
  tests = [{
    input : {
      hierarchyPlaceholders : [],
    },
    args : [
      ["a", "b"],
      ["a", "b"]
    ],
    output : ["a", "b"],
  }, {
    input : {
      hierarchyPlaceholders : [{
        index : 1,
        placeholder : "@",
      }],
    },
    args : [
      ["a", "1", "b"],
      ["a", "@", "b"]
    ],
    output : ["a", "1", "b"],
  }, {
    input : {
      hierarchyPlaceholders : [{
        index : 1,
        placeholder : "@",
      }],
    },
    args : [
      ["a", "1", "b"],
      ["a", "b", "@"]
    ],
    output : ["a", "b", "@"],
  }, {
    input : {
      hierarchyPlaceholders : [{
        index : 1,
        placeholder : "@",
      }, {
        index : 3,
        placeholder : "@",
      }],
    },
    args : [
      ["a", "1", "b", "2", "c"],
      ["a", "@", "c", "@", "d"]
    ],
    output : ["a", "1", "c", "@", "d"],
  }, {
    input : {
      hierarchyPlaceholders : [{
        index : 1,
        placeholder : "@",
      }, {
        index : 3,
        placeholder : "@",
      }],
    },
    args : [
      ["a", "1", "b", "2", "c"],
      ["a", "@", "b", "c"]
    ],
    output : ["a", "1", "b", "c"],
  }, {
    input : {
      hierarchyPlaceholders : [{
        index : 1,
        placeholder : "@",
      }, {
        index : 3,
        placeholder : "@",
      }],
    },
    args : [
      ["a", "1", "b", "2", "c"],
      ["a", "@", "b", "@", "d"]
    ],
    output : ["a", "1", "b", "2", "d"],
  }];

  for(var i = 0; i < tests.length; i++) {
    var output = Hierarchy.replacePlaceholders.apply(tests[i].input, tests[i].args);

    assert.deepEqual(output, tests[i].output);
  }
});

};

});
