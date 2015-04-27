(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(["deep_keys_lib"], function (a0) {
      return (root['validate_config'] = factory(a0));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("deep-keys-lib"));
  } else {
    root['ValidateConfig'] = factory(DeepKeysLib);
  }
}(this, function (DeepKeysLib) {

var invalidKeys, typeOf, validators_arrayValidator, validators_numberValidator, validators_regexValidator, validators_validator, levenshteinDistance, validators_extraParamsValidator, validators_mandatoryParamsValidator, validators_objectValidator, validators_typeValidator, validators_validators, morph_config_morphKey, morph_config_morphNumberType, morph_config_morphStringType, morph_config_morphObjectType, morph_config_morphArrayType, morph_config_morphType, morph_config_morphObjectValue, morph_config_morphValue, morph_config_morphConfigs, setValidator, validate_config;
invalidKeys = function () {
  var invalidTypeMap = {
    'type': 'invalidType',
    'value': 'invalidValue',
    'extra': 'extraKey',
    'mandatory': 'mandatoryKeyMissing'
  };
  function InvalidKeys() {
    for (var k in invalidTypeMap) {
      this[invalidTypeMap[k]] = {};
    }
  }
  InvalidKeys.prototype.markAs = function (invalidType, key, type, details) {
    if (invalidTypeMap[invalidType]) {
      var ik = invalidTypeMap[invalidType];
      this[ik][key] = {
        type: type,
        details: details
      };
    }
  };
  InvalidKeys.prototype.unmarkAs = function (invalidType, key) {
    if (invalidTypeMap[invalidType]) {
      var ik = invalidTypeMap[invalidType];
      delete this[ik][key];
    }
  };
  return InvalidKeys;
}();
typeOf = function (obj) {
  return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
};
validators_arrayValidator = function (key, val, validator) {
  for (var i = 0; i < val.length; i++) {
    this.hierarchy.pushToHierarchy(i, validator.placeholderKey);
    var newVal = this.morphKey(i, val[i], validator.elementsValidator, true);
    this.validator(i, newVal, validator.elementsValidator);
    val[i] = newVal;
    this.hierarchy.popFromHierarchy();
  }
  return true;
};
validators_numberValidator = function (key, val, validator) {
  if (validator.min && val < validator.min || validator.max && val > validator.max) {
    this.invalidKeys.markAs('value', this.hierarchy.fullHierarchyStr, 'error', {
      key: key,
      actualValue: val,
      validator: validator,
      hierarchyStr: this.hierarchy.hierarchyStr
    });
    return false;
  }
  return true;
};
validators_regexValidator = function (key, val, validator) {
  var result = true;
  if (validator.regex) {
    result = !!val.match(validator.regex);
  }
  if (!result) {
    this.invalidKeys.markAs('value', this.hierarchy.fullHierarchyStr, 'error', {
      key: key,
      actualValue: val,
      validator: validator,
      hierarchyStr: this.hierarchy.hierarchyStr
    });
  }
  return result;
};
validators_validator = function (typeOf) {
  typeToValidatorMap = {
    'object': 'objectValidator',
    'array': 'arrayValidator',
    'string': 'regexValidator',
    'number': 'numberValidator',
    '__default__': 'regexValidator'
  };
  return function (key, val, validator) {
    this.fullKeysPresent[this.hierarchy.fullHierarchy] = 1;
    if (this.typeValidator(key, val, validator)) {
      var validatorFun = typeToValidatorMap[validator.type] || typeToValidatorMap['__default__'];
      this[validatorFun](key, val, validator);
    }
    return true;
  };
}(typeOf);
levenshteinDistance = function () {
  var registry = {}, LevenshteinDistanceMain = function (s1, l1, s2, l2, meta) {
      var key = s1 + '__' + l1 + '__' + s2 + '__' + l2, val;
      if (registry[key]) {
        val = registry[key].val;
      } else {
        if (l1 === 0) {
          val = l2;
        } else if (l2 === 0) {
          val = l1;
        } else {
          var cost = s1.charAt(l1 - 1) === s2.charAt(l2 - 1) ? 0 : 1;
          val = Math.min(LevenshteinDistanceMain(s1, l1 - 1, s2, l2, meta) + 1, LevenshteinDistanceMain(s1, l1, s2, l2 - 1, meta) + 1, LevenshteinDistanceMain(s1, l1 - 1, s2, l2 - 1, meta) + cost);
        }
        registry[key] = { val: val };
      }
      return val;
    }, LevenshteinDistance = function (s1, s2) {
      var st;
      if (s1 > s2) {
        st = s1;
        s1 = s2;
        s2 = st;
      }
      return LevenshteinDistanceMain(s1, s1.length, s2, s2.length);
    };
  return LevenshteinDistance;
}();
validators_extraParamsValidator = function (typeOf, LevenshteinDistance) {
  return function (key, val, validator) {
    var matches = [], matcheObjs = [], otherLoc = [];
    for (var ck in validator.keys) {
      var ckl = ck.length, kl = key.length, ld = LevenshteinDistance(ck, key);
      if (ld <= 0.25 * kl) {
        matcheObjs.push({
          ld: ld,
          ck: ck
        });
      }
    }
    matches = matcheObjs.sort(function (a, b) {
      return a.ld - b.ld;
    }).map(function (e) {
      return e.ck;
    });
    if (this.fullKeysSet[key]) {
      for (var i = 0; i < this.fullKeysSet[key].length; i++) {
        var hierarchy = this.hierarchy.replacePlaceholders(this.fullKeysSet[key][i]).join('.');
        if (!this.fullKeysPresent[hierarchy]) {
          otherLoc.push(hierarchy);
        }
      }
    }
    this.invalidKeys.markAs('extra', this.hierarchy.fullHierarchyStr, 'warn', {
      key: key,
      val: val,
      validator: validator,
      hierarchyStr: this.hierarchy.hierarchyStr,
      matches: matches,
      otherLoc: otherLoc
    });
    return true;
  };
}(typeOf, levenshteinDistance);
validators_mandatoryParamsValidator = function (key, val, validator) {
  this.invalidKeys.markAs('mandatory', this.hierarchy.fullHierarchyStr, 'error', {
    key: key,
    validator: validator,
    hierarchyStr: this.hierarchy.hierarchyStr
  });
  return true;
};
validators_objectValidator = function (key, val, validator) {
  var checked = {};
  for (var vk in validator.keys) {
    var newVal = val[vk], isPresent = val.hasOwnProperty(vk);
    this.hierarchy.pushToHierarchy(vk, vk);
    newVal = this.morphKey(vk, newVal, validator.keys[vk], isPresent);
    if (isPresent || newVal !== null && newVal !== undefined) {
      val[vk] = newVal;
      this.validator(vk, val[vk], validator.keys[vk]);
    } else {
      if (validator.keys[vk].isMandatory) {
        this.mandatoryParamsValidator(vk, null, validator.keys[vk]);
      }
    }
    this.hierarchy.popFromHierarchy();
  }
  for (var k in val) {
    if (!validator.keys[k]) {
      this.hierarchy.pushToHierarchy(k, k);
      this.extraParamsValidator(k, val[k], validator);
      this.hierarchy.popFromHierarchy();
    }
  }
  return true;
};
validators_typeValidator = function (key, val, validator) {
  if (typeOf(val) !== validator.type) {
    this.invalidKeys.markAs('type', this.hierarchy.fullHierarchyStr, 'error', {
      key: key,
      actualType: typeOf(val),
      validator: validator,
      hierarchyStr: this.hierarchy.hierarchyStr
    });
    return false;
  }
  return true;
};
validators_validators = function (arrayValidator, numberValidator, regexValidator, validator, extraParamsValidator, mandatoryParamsValidator, objectValidator, typeValidator) {
  return {
    arrayValidator: arrayValidator,
    numberValidator: numberValidator,
    regexValidator: regexValidator,
    validator: validator,
    extraParamsValidator: extraParamsValidator,
    mandatoryParamsValidator: mandatoryParamsValidator,
    objectValidator: objectValidator,
    typeValidator: typeValidator
  };
}(validators_arrayValidator, validators_numberValidator, validators_regexValidator, validators_validator, validators_extraParamsValidator, validators_mandatoryParamsValidator, validators_objectValidator, validators_typeValidator);
morph_config_morphKey = {
  morphKey: function (key, val, validator, isPresent) {
    var newVal = val;
    if (isPresent) {
      if (validator.morph) {
        newVal = this.morphType(key, newVal, validator, isPresent);
      }
      newVal = this.morphValue(key, newVal, validator, isPresent);
    } else {
      if (validator.morph && validator.morph.hasOwnProperty('default')) {
        newVal = validator.morph.default;
      }
    }
    return newVal;
  }
};
morph_config_morphNumberType = {
  'string': function (key, val, validator) {
    var retVal = val;
    switch (validator.morph.type) {
    case 'parse':
    default:
      retVal = Number(val);
      if (isNaN(retVal)) {
        retVal = val;
      }
      break;
    }
    return retVal;
  },
  'boolean': function (key, val, validator) {
    return val ? 1 : 0;
  },
  '__default__': function (key, val, validator) {
    return val;
  }
};
morph_config_morphStringType = {
  'number': function (key, val, validator) {
    return val + '';
  },
  'boolean': function (key, val, validator) {
    return val + '';
  },
  'array': function (key, val, validator) {
    var retVal = val;
    switch (validator.morph.type) {
    case 'join':
      retVal = val.join(validator.morph.joinStr || ',');
      break;
    case 'stringify':
    default:
      retVal = JSON.stringify(val);
      break;
    }
    return retVal;
  },
  'object': function (key, val, validator) {
    var retVal = val;
    switch (validator.morph.type) {
    default:
    case 'stringify':
      retVal = JSON.stringify(val);
      break;
    }
    return retVal;
  },
  '__default__': function (key, val, validator) {
    return val;
  }
};
morph_config_morphObjectType = {
  'string': function (key, val, validator) {
    var retVal = val;
    switch (validator.morph.type) {
    case 'parse':
    default:
      try {
        retVal = JSON.parse(val);
      } catch (e) {
        this.logger.error('InvalidValue', {
          key: key,
          actualValue: val,
          validator: validator,
          hierarchyStr: this.hierarchy.hierarchyStr
        });
      }
      break;
    }
    return retVal;
  },
  'array': function (key, val, validator) {
    var retObj = val;
    switch (validator.morph.type) {
    case 'indexToKeys':
    default:
      var i = 0;
      retObj = {};
      for (; i < val.length; i++) {
        if (validator.morph.indexToKeys.length > i) {
          retObj[validator.morph.indexToKeys[i].key] = val[i];
        }
      }
      for (; i < validator.morph.indexToKeys.length; i++) {
        if (validator.morph.indexToKeys[i].default) {
          retObj[validator.morph.indexToKeys[i].key] = validator.morph.indexToKeys[i].default;
        }
      }
      break;
    }
    return retObj;
  },
  '__default__': function (key, val, validator) {
    return val;
  }
};
morph_config_morphArrayType = {
  'string': function (key, val, validator) {
    var retVal = val;
    switch (validator.morph.type) {
    case 'split':
      var splitRegex = new RegExp(validator.morph.splitStr || ',');
      retVal = val.split(splitRegex);
      break;
    case 'parse':
    default:
      try {
        retVal = JSON.parse(val);
      } catch (e) {
        this.logger.error('InvalidValue', {
          key: key,
          actualValue: val,
          validator: validator,
          hierarchyStr: this.hierarchy.hierarchyStr
        });
      }
      break;
    }
    return retVal;
  },
  'array': function (key, val, validator) {
    return val;
  },
  '__default__': function (key, val, validator) {
    if (val !== null || val !== undefined) {
      return [val];
    }
    return val;
  }
};
morph_config_morphType = function (typeOf, morphNumberType, morphStringType, morphObjectType, morphArrayType) {
  var typeToMorphTypeMap = {
    'number': morphNumberType,
    'string': morphStringType,
    'object': morphObjectType,
    'array': morphArrayType,
    '__default__': {
      '__default__': function () {
        return null;
      }
    }
  };
  return {
    morphType: function (key, val, validator) {
      var morphSet = typeToMorphTypeMap[validator.type] || typeToMorphTypeMap['__default__'], morphFn = morphSet[typeOf(val)] || morphSet['__default__'];
      return morphFn.call(this, key, val, validator);
    }
  };
}(typeOf, morph_config_morphNumberType, morph_config_morphStringType, morph_config_morphObjectType, morph_config_morphArrayType);
morph_config_morphObjectValue = function (DeepKeysLib) {
  return {
    'seperateKeys': function (key, val, validator) {
      return val;
    },
    'mergeKeys': function (key, val, validator) {
      if (validator.morph.mergeKeys) {
        for (var k in validator.morph.mergeKeys) {
          if (val[k] !== null && val[k] !== undefined) {
            DeepKeysLib.assignValue(val, validator.morph.mergeKeys[k].toKey, val[k], validator.morph.dontReplaceExisting, validator.morph.mergeKeys[k].expandKeys);
            delete val[k];
          }
        }
      }
      return val;
    },
    '__default__': function (key, val, validator) {
      return val;
    }
  };
}(deep_keys_lib);
morph_config_morphValue = function (typeOf, morphObjectValue) {
  var typeToMorphValueMap = { 'object': morphObjectValue };
  return {
    morphValue: function (key, val, validator) {
      if (validator.morph) {
        var morphSet = typeToMorphValueMap[validator.type], morphFn = morphSet && (morphSet[validator.morph.valueMorphType] || morphSet['__default__']);
        if (morphFn) {
          return morphFn.call(this, key, val, validator);
        }
      }
      return val;
    }
  };
}(typeOf, morph_config_morphObjectValue);
morph_config_morphConfigs = function (morphKey, morphType, morphValue) {
  var morphModules = [
      morphKey,
      morphType,
      morphValue
    ], MorphConfig = {};
  for (var i = 0; i < morphModules.length; i++) {
    for (var k in morphModules[i]) {
      MorphConfig[k] = morphModules[i][k];
    }
  }
  return MorphConfig;
}(morph_config_morphKey, morph_config_morphType, morph_config_morphValue);
setValidator = {
  _prepareValidator: function (validator) {
    if (validator.type === 'object') {
      for (var k in validator.keys) {
        this.hierarchy.pushToHierarchy(k);
        this._prepareValidator(validator.keys[k]);
        validator.keys[k].parentValidator = validator;
        if (!this.fullKeysSet[k]) {
          this.fullKeysSet[k] = [];
        }
        this.fullKeysSet[k].push(this.hierarchy.hierarchyPlaceholder.slice());
        this.hierarchy.popFromHierarchy();
      }
    } else if (validator.type === 'array') {
      this.hierarchy.pushToHierarchy('arrayElement', '*');
      validator.placeholderKey = '*';
      validator.elementsValidator.parentValidator = validator;
      this._prepareValidator(validator.elementsValidator);
      this.hierarchy.popFromHierarchy();
    }
    if (validator.morph && typeOf(validator.morph) === 'boolean') {
      validator.morph = {};
    }
  },
  setValidator: function (validator) {
    this.reset();
    this.hierarchy.pushToHierarchy('$');
    this._prepareValidator(validator);
    this.hierarchy.popFromHierarchy();
    this.validatorConfig = validator;
  }
};
validate_config = function (InvalidKeys, DeepKeysLib, validators, morphConfigs, setValidator) {
  function ValidateConfig(validator) {
    if (validator) {
      this.setValidator(validator);
    } else {
      this.reset();
    }
  }
  ValidateConfig.prototype.reset = function () {
    this.hierarchy = new DeepKeysLib.HierarchyManager();
    this.invalidKeys = new InvalidKeys();
    this.fullKeysPresent = {};
    this.fullKeysSet = {};
  };
  ValidateConfig.prototype.validate = function (config) {
    this.hierarchy.pushToHierarchy('$', '$');
    this.validator('$', config, this.validatorConfig);
    this.hierarchy.popFromHierarchy();
  };
  var modules = [
    validators,
    morphConfigs,
    setValidator
  ];
  for (var i = 0; i < modules.length; i++) {
    for (var k in modules[i]) {
      ValidateConfig.prototype[k] = modules[i][k];
    }
  }
  return ValidateConfig;
}(invalidKeys, deep_keys_lib, validators_validators, morph_config_morphConfigs, setValidator);
return validate_config;

}));
