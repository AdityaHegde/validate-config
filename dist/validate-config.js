(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function () {
      return (root['validate_config'] = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    root['ValidateConfig'] = factory();
  }
}(this, function () {

var invalidKeys, _typeOf_, validators_arrayValidator, validators_numberValidator, validators_regexValidator, validators_validator, levenshteinDistance, validators_extraParamsValidator, validators_mandatoryParamsValidator, validators_objectValidator, validators_typeValidator, validators_main, morph_config_morph_key, morph_config_morph_number_type, morph_config_morph_string_type, morph_config_morph_object_type, morph_config_morph_array_type, morph_config_morph_type, morph_config_morph_object_value, morph_config_morph_value, morph_config_main, set_validator, validate_config, typeOf, DeepKeysLib;
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
(function (root, factory) {
  if (true) {
    define('deep_keys_lib', [], function () {
      return root['deep_keys_lib'] = factory();
    });
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root['DeepKeysLib'] = factory();
  }
}(this, function () {
  var typeOf, notNone, assignValue, deleteKey, hierarchy, diff, getValue, deep_keys_lib, _deepSearch_, _exists_, _replaceKeys_, deepSearch, HierarchyManager;
  typeOf = function (obj) {
    return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  };
  notNone = function (val) {
    return null !== val && undefined !== val;
  };
  _deepSearch_ = deepSearch = function () {
    var getInsertObject = function (nextKey) {
        if (nextKey.match(/^\d+$/)) {
          return [];
        } else {
          return {};
        }
      }, deepSearch = function (obj, key, insert, expandKeys) {
        var keys = key.split(/\./), i = 0;
        for (i = 0; i < keys.length - 1; i++) {
          if (keys[i] === '*') {
            var results = [];
            if (typeOf(obj) === 'array' || typeOf(obj) === 'object') {
              var searchObj = obj;
              if (typeOf(obj) === 'object' && expandKeys && expandKeys.length > 0) {
                searchObj = expandKeys[0];
                expandKeys = expandKeys.splice(1);
              }
              for (var k in searchObj) {
                if (obj[k] !== null && obj[k] !== undefined) {
                  var retResults = deepSearch(obj[k], keys.slice(i + 1).join('.'), insert, expandKeys);
                  if (retResults) {
                    Array.prototype.push.apply(results, retResults);
                  }
                }
              }
            }
            return results.length > 0 ? results : null;
          } else if (notNone(obj[keys[i]])) {
            obj = obj[keys[i]];
          } else if (insert) {
            obj[keys[i]] = getInsertObject(keys[i + 1]);
            obj = obj[keys[i]];
          } else {
            return null;
          }
        }
        if (keys[i] !== '') {
          if ((typeOf(obj) === 'array' && keys[i].match(/^\d*$/) || typeOf(obj) === 'object') && keys[i] !== '*') {
            return [[
                obj,
                keys[i],
                obj[keys[i]]
              ]];
          } else {
            return null;
          }
        } else {
          return [[
              obj,
              keys[i],
              obj
            ]];
        }
      };
    return deepSearch;
  }();
  assignValue = function () {
    return function (obj, key, value, dontReplace, expandKeys) {
      var deep = deepSearch(obj, key, true, expandKeys);
      if (deep) {
        for (var i = 0; i < deep.length; i++) {
          if (!dontReplace || (deep[i][0][deep[i][1]] === null || deep[i][0][deep[i][1]] === undefined)) {
            deep[i][0][deep[i][1]] = value;
          }
        }
      }
    };
  }();
  deleteKey = function () {
    return function (obj, key, expandKeys) {
      var deep = deepSearch(obj, key, false, expandKeys);
      if (deep) {
        for (var i = 0; i < deep.length; i++) {
          delete deep[i][0][deep[i][1]];
        }
      }
    };
  }();
  hierarchy = HierarchyManager = function () {
    function HierarchyManager() {
      this.hierarchy = [];
      this.hierarchyPlaceholder = [];
      this.hierarchyPlaceholders = [];
      this.hierarchyStr = '';
      this.hierarchyPlaceholderStr = '';
      this.fullHierarchyStr = '';
      this.fullHierarchyPlaceholderStr = '';
    }
    HierarchyManager.prototype.replacePlaceholders = function (srcHierarchyPlaceholder) {
      var retHierarchy = srcHierarchyPlaceholder.slice();
      for (var i = 0, j = 0; i < this.hierarchy.length && i < retHierarchy.length && j < this.hierarchyPlaceholders.length; i++) {
        if (i === this.hierarchyPlaceholders[j].index) {
          if (retHierarchy[i] === this.hierarchyPlaceholders[j].placeholder) {
            retHierarchy[i] = this.hierarchy[i];
            j++;
          } else {
            break;
          }
        } else if (this.hierarchy[i] !== retHierarchy[i]) {
          break;
        }
      }
      return retHierarchy;
    };
    HierarchyManager.prototype.pushToHierarchy = function (key, keyPlaceholder) {
      keyPlaceholder = keyPlaceholder || key;
      this.hierarchyStr = this.hierarchy.join('.');
      this.hierarchyPlaceholderStr = this.hierarchyPlaceholder.join('.');
      if (key !== keyPlaceholder) {
        this.hierarchyPlaceholders.push({
          placeholder: keyPlaceholder,
          index: this.hierarchyPlaceholder.length
        });
      }
      this.hierarchy.push(key);
      this.hierarchyPlaceholder.push(keyPlaceholder);
      this.fullHierarchyStr = this.hierarchy.join('.');
      this.fullHierarchyPlaceholderStr = this.hierarchyPlaceholder.join('.');
    };
    HierarchyManager.prototype.popFromHierarchy = function () {
      if (this.hierarchyPlaceholders.length > 0 && this.hierarchyPlaceholders[this.hierarchyPlaceholders.length - 1].index === this.hierarchyPlaceholder.length - 1) {
        this.hierarchyPlaceholders.pop();
      }
      this.hierarchy.pop();
      this.hierarchyPlaceholder.pop();
      this.hierarchyStr = this.hierarchy.slice(0, -1).join('.');
      this.hierarchyPlaceholderStr = this.hierarchyPlaceholder.slice(0, -1).join('.');
      this.fullHierarchyStr = this.hierarchy.join('.');
      this.fullHierarchyPlaceholderStr = this.hierarchyPlaceholder.join('.');
    };
    return HierarchyManager;
  }();
  diff = function () {
    var _diff = function (srcObj, tarObj, meta) {
      var diffObj, hasDiff = 0;
      if (typeOf(srcObj) === 'object') {
        if (typeOf(tarObj) === 'object') {
          diffObj = {};
          for (var k in tarObj) {
            meta.hierarchy.pushToHierarchy(k);
            var d = undefined;
            if (!meta.ignoreKeys[meta.hierarchy.fullHierarchyStr]) {
              d = _diff(srcObj[k], tarObj[k], meta);
            }
            meta.hierarchy.popFromHierarchy();
            if (d !== undefined) {
              diffObj[k] = d;
              hasDiff = 1;
            }
          }
        }
      } else if (typeOf(srcObj) === 'array') {
        if (typeOf(tarObj) === 'array') {
          diffObj = [];
          for (var i = 0; i < tarObj.length; i++) {
            meta.hierarchy.pushToHierarchy(i, '*');
            var d = undefined;
            if (!meta.ignoreKeys[meta.hierarchy.fullHierarchyStr]) {
              d = _diff(srcObj[i], tarObj[i], meta);
            }
            meta.hierarchy.popFromHierarchy();
            diffObj.push(d);
            if (d !== undefined) {
              hasDiff = 1;
            }
          }
        }
      } else {
        if (!meta.ignoreKeys[meta.hierarchy.fullHierarchyStr]) {
          if (srcObj !== tarObj) {
            diffObj = tarObj;
            hasDiff = 1;
          }
        }
      }
      return hasDiff === 1 ? diffObj : undefined;
    };
    return function (srcObj, tarObj, ignoreKeys) {
      return _diff(srcObj, tarObj, {
        ignoreKeys: ignoreKeys,
        hierarchy: new HierarchyManager()
      });
    };
  }();
  _exists_ = function () {
    return function (obj, key, or, expandKeys) {
      or = !!or;
      var val = deepSearch(obj, key, false, expandKeys), exists = !or;
      if (val) {
        for (var i = 0; i < val.length; i++) {
          var e = notNone(val[i][2]);
          exists = or && (exists || e) || !or && (exists && e);
        }
      } else {
        exists = false;
      }
      return exists;
    };
  }();
  getValue = function () {
    return function (obj, key, expandKeys) {
      var deep = deepSearch(obj, key, false, expandKeys), values = [];
      if (deep) {
        for (var i = 0; i < deep.length; i++) {
          values.push(deep[i][2]);
        }
      }
      return values.length > 0 ? values : null;
    };
  }();
  _replaceKeys_ = function () {
    var replaceKeys = function (obj, params) {
      if (typeOf(obj) === 'object' || typeOf(obj) === 'array') {
        for (var k in obj) {
          obj[k] = replaceKeys(obj[k], params);
        }
      } else {
        var parts = obj.match(/<.*?>/g) || [];
        for (var i = 0; i < parts.length; i++) {
          var val = getValue(params, parts[i].replace(/<(.*)>/, '$1')), regexp = new RegExp(parts[i].replace(/\./, '\\.'));
          if (val && notNone(val[0])) {
            obj = obj.replace(regexp, val[0]);
          }
        }
      }
      return obj;
    };
    return replaceKeys;
  }();
  deep_keys_lib = DeepKeysLib = function (exists, replaceKeys, HierarchyManager) {
    var DeepKeysLib = {
      typeOf: typeOf,
      notNone: notNone,
      deepSearch: deepSearch,
      assignValue: assignValue,
      deleteKey: deleteKey,
      diff: diff,
      exists: exists,
      getValue: getValue,
      replaceKeys: replaceKeys,
      HierarchyManager: HierarchyManager
    };
    return DeepKeysLib;
  }(_exists_, _replaceKeys_, hierarchy);
  return deep_keys_lib;
}));
_typeOf_ = typeOf = function (obj) {
  return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
};
validators_arrayValidator = function () {
  return {
    arrayValidator: function (key, val, validator) {
      for (var i = 0; i < val.length; i++) {
        this.hierarchy.pushToHierarchy(i, validator.placeholderKey);
        var newVal = this.morphKey(i, val[i], validator.elementsValidator, true);
        this.validator(i, newVal, validator.elementsValidator);
        val[i] = newVal;
        this.hierarchy.popFromHierarchy();
      }
      return true;
    }
  };
}();
validators_numberValidator = function () {
  return {
    numberValidator: function (key, val, validator) {
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
    }
  };
}();
validators_regexValidator = function () {
  return {
    regexValidator: function (key, val, validator) {
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
    }
  };
}();
validators_validator = function () {
  typeToValidatorMap = {
    'object': 'objectValidator',
    'array': 'arrayValidator',
    'string': 'regexValidator',
    'number': 'numberValidator',
    '__default__': 'regexValidator'
  };
  return {
    validator: function (key, val, validator) {
      this.fullKeysPresent[this.hierarchy.fullHierarchy] = 1;
      if (this.typeValidator(key, val, validator)) {
        var validatorFun = typeToValidatorMap[validator.type] || typeToValidatorMap['__default__'];
        this[validatorFun](key, val, validator);
      }
      return true;
    }
  };
}();
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
validators_extraParamsValidator = function (LevenshteinDistance) {
  return {
    extraParamsValidator: function (key, val, validator) {
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
    }
  };
}(levenshteinDistance);
validators_mandatoryParamsValidator = function () {
  return {
    mandatoryParamsValidator: function (key, val, validator) {
      this.invalidKeys.markAs('mandatory', this.hierarchy.fullHierarchyStr, 'error', {
        key: key,
        validator: validator,
        hierarchyStr: this.hierarchy.hierarchyStr
      });
      return true;
    }
  };
}();
validators_objectValidator = function () {
  return {
    objectValidator: function (key, val, validator) {
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
    }
  };
}();
validators_typeValidator = function () {
  return {
    typeValidator: function (key, val, validator) {
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
    }
  };
}();
validators_main = function () {
  var Validators = {};
  for (var i = 0; i < arguments.length; i++) {
    for (var k in arguments[i]) {
      Validators[k] = arguments[i][k];
    }
  }
  return Validators;
}();
morph_config_morph_key = {
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
morph_config_morph_number_type = {
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
morph_config_morph_string_type = function () {
  return {
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
}();
morph_config_morph_object_type = {
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
morph_config_morph_array_type = {
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
morph_config_morph_type = function (MorphNumberType, MorphStringType, MorphObjectType, MorphArrayType) {
  var typeToMorphMap = {
    'number': MorphNumberType,
    'string': MorphStringType,
    'object': MorphObjectType,
    'array': MorphArrayType,
    '__default__': {
      '__default__': function () {
        return null;
      }
    }
  };
  return {
    morphType: function (key, val, validator) {
      var morphSet = typeToMorphMap[validator.type] || typeToMorphMap['__default__'], morphFn = morphSet[typeOf(val)] || morphSet['__default__'];
      return morphFn.call(this, key, val, validator);
    }
  };
}(morph_config_morph_number_type, morph_config_morph_string_type, morph_config_morph_object_type, morph_config_morph_array_type);
morph_config_morph_object_value = function () {
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
}();
morph_config_morph_value = function (MorphObjectValue) {
  var typeToMorphMap = { 'object': MorphObjectValue };
  return {
    morphValue: function (key, val, validator) {
      if (validator.morph) {
        var morphSet = typeToMorphMap[validator.type], morphFn = morphSet && (morphSet[validator.morph.valueMorphType] || morphSet['__default__']);
        if (morphFn) {
          return morphFn.call(this, key, val, validator);
        }
      }
      return val;
    }
  };
}(morph_config_morph_object_value);
morph_config_main = function () {
  var MorphConfig = {};
  for (var i = 0; i < arguments.length; i++) {
    for (var k in arguments[i]) {
      MorphConfig[k] = arguments[i][k];
    }
  }
  return MorphConfig;
}();
set_validator = function () {
  return {
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
}();
validate_config = function (InvalidKeys) {
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
  for (var i = 2; i < arguments.length; i++) {
    for (var k in arguments[i]) {
      ValidateConfig.prototype[k] = arguments[i][k];
    }
  }
  return ValidateConfig;
}(invalidKeys);
return validate_config;

}));
