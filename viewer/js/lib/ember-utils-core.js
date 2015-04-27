(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(["ember"], function (a0) {
      return (root['ember_utils_core'] = factory(a0));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("ember"));
  } else {
    root['EmberUtilsCore'] = factory(Ember);
  }
}(this, function (ember) {

var hasMany, belongsTo, hierarchy, misc, objectWithArrayMixin, merge, ember_utils_core, _diff_;
hasMany = function () {
  function hasMany(modelClass, modelClassKey, defaultKey, registry, idKey) {
    modelClass = modelClass || Ember.Object;
    var hasInheritance = Ember.typeOf(modelClass) !== 'class', hasRegistry = registry && idKey;
    return Ember.computed(function (key, newval) {
      if (Ember.typeOf(modelClass) === 'string') {
        modelClass = Ember.get(modelClass);
        hasInheritance = Ember.typeOf(modelClass) !== 'class';
      }
      if (Ember.typeOf(registry) === 'string') {
        registry = Ember.get(registry);
        hasRegistry = registry && idKey;
      }
      if (arguments.length > 1) {
        if (newval && newval.length) {
          newval.beginPropertyChanges();
          for (var i = 0; i < newval.length; i++) {
            var obj = newval[i], classObj = modelClass;
            if (hasRegistry && registry[obj[idKey]]) {
              obj = registry[obj[idKey]];
            } else {
              if (hasInheritance)
                classObj = modelClass[Ember.isEmpty(obj[modelClassKey]) ? defaultKey : obj[modelClassKey]];
              if (!(obj instanceof classObj)) {
                obj = classObj.create(obj);
                obj.set('parentObj', this);
              }
              if (hasRegistry) {
                registry[obj[idKey]] = obj;
              }
            }
            newval.splice(i, 1, obj);
          }
          newval.endPropertyChanges();
        }
        return newval;
      }
    });
  }
  return hasMany;
}();
belongsTo = function () {
  function belongsTo(modelClass, modelClassKey, defaultKey, mixin, mixinKey, defaultMixin, registry, idKey) {
    modelClass = modelClass || Ember.Object;
    var hasInheritance = Ember.typeOf(modelClass) !== 'class', hasMixin = mixin instanceof Ember.Mixin, hasMixinInheritance = !hasMixin && Ember.typeOf(mixin) === 'object', hasRegistry = registry && idKey;
    return Ember.computed(function (key, newval) {
      if (Ember.typeOf(modelClass) === 'string') {
        modelClass = Ember.get(modelClass);
        hasInheritance = Ember.typeOf(modelClass) !== 'class';
      }
      if (Ember.typeOf(mixin) === 'string') {
        mixin = Ember.get(mixin);
        hasMixin = mixin instanceof Ember.Mixin;
        hasMixinInheritance = !hasMixin && Ember.typeOf(mixin) === 'object';
      }
      if (Ember.typeOf(registry) === 'string') {
        registry = Ember.get(registry);
        hasRegistry = registry && idKey;
      }
      if (arguments.length > 1) {
        if (newval) {
          var classObj = modelClass;
          if (hasRegistry && registry[newval[idKey]]) {
            newval = registry[newval[idKey]];
          } else {
            if (hasInheritance)
              classObj = modelClass[Ember.isEmpty(newval[modelClassKey]) ? defaultKey : newval[modelClassKey]];
            if (!(newval instanceof classObj)) {
              if (hasMixin) {
                newval = classObj.createWithMixins(mixin, newval);
              } else if (hasMixinInheritance) {
                newval = classObj.createWithMixins(mixin[newval[mixinKey] || defaultMixin], newval);
              } else {
                newval = classObj.create(newval);
              }
              newval.set('parentObj', this);
            }
          }
        }
        return newval;
      }
    });
  }
  return belongsTo;
}();
hierarchy = function () {
  function getMetaFromHierarchy(hasManyHierarchy) {
    var meta = {};
    for (var i = 0; i < hasManyHierarchy.length; i++) {
      for (var c in hasManyHierarchy[i].classes) {
        if (hasManyHierarchy[i].classes.hasOwnProperty(c)) {
          meta[c] = { level: i };
        }
      }
    }
    hasManyHierarchy.hierarchyMeta = meta;
    return meta;
  }
  function registerHierarchy(hierarchy) {
    hierarchy.hierarchyMeta = getMetaFromHierarchy(hierarchy);
  }
  function addToHierarchy(hierarchy, type, classObj, level) {
    var meta = hierarchy.hierarchyMeta;
    hierarchy[level].classes[type] = classObj;
    meta[type] = { level: level };
  }
  function getObjForHierarchyLevel(obj, meta, hierarchy, level) {
    var param = {};
    param[hierarchy[level].childrenKey] = Ember.typeOf(obj) === 'array' ? obj : [obj];
    return hierarchy[level].classes[hierarchy[level].base].create(param);
  }
  function getObjTillLevel(obj, meta, hierarchy, fromLevel, toLevel) {
    for (var i = fromLevel - 1; i >= toLevel; i--) {
      obj = getObjForHierarchyLevel(obj, meta, hierarchy, i);
    }
    return obj;
  }
  function hasManyWithHierarchy(hasManyHierarchy, level, hkey) {
    var meta;
    if (Ember.typeOf(hasManyHierarchy) === 'array') {
      meta = hasManyHierarchy.hierarchyMeta;
    }
    return Ember.computed(function (key, newval) {
      if (arguments.length > 1) {
        if (Ember.typeOf(hasManyHierarchy) === 'string') {
          hasManyHierarchy = Ember.get(hasManyHierarchy);
          meta = hasManyHierarchy.hierarchyMeta;
        }
        if (newval) {
          var cl = -1, cla = [];
          for (var i = 0; i < newval.length; i++) {
            var obj = newval[i], _obj = {}, type = Ember.typeOf(obj) === 'array' ? obj[0] : obj[hkey], objMeta = meta[type];
            if (Ember.typeOf(obj) !== 'instance') {
              if (objMeta && objMeta.level >= level) {
                if (Ember.typeOf(obj) === 'array') {
                  for (var j = 0; j < hasManyHierarchy[objMeta.level].keysInArray.length; j++) {
                    if (j < obj.length) {
                      _obj[hasManyHierarchy[objMeta.level].keysInArray[j]] = obj[j];
                    }
                  }
                } else {
                  _obj = obj;
                }
                _obj = hasManyHierarchy[objMeta.level].classes[type].create(_obj);
                if (cl === -1 || cl === objMeta.level) {
                  cla.push(_obj);
                  cl = objMeta.level;
                } else if (cl < objMeta.level) {
                  cla.push(getObjTillLevel(_obj, meta, hasManyHierarchy, objMeta.level, cl));
                } else {
                  var curObj = getObjForHierarchyLevel(cla, meta, hasManyHierarchy, objMeta.level);
                  cl = objMeta.level;
                  cla = [
                    curObj,
                    _obj
                  ];
                }
              }
            } else {
              cla.push(obj);
            }
          }
          if (cl === level || cl === -1) {
            newval = cla;
          } else {
            newval = [getObjTillLevel(cla, meta, hasManyHierarchy, cl, level)];
          }
        }
        return newval;
      }
    });
  }
  return {
    registerHierarchy: registerHierarchy,
    addToHierarchy: addToHierarchy,
    hasManyWithHierarchy: hasManyWithHierarchy
  };
}();
misc = function () {
  function deepSearchArray(d, e, k, ak) {
    if (e === undefined || e === null)
      return null;
    if (d[k] === e)
      return d;
    if (d[ak]) {
      for (var i = 0; i < d[ak].length; i++) {
        var ret = deepSearchArray(d[ak][i], e, k, ak);
        if (ret) {
          return ret;
        }
      }
    }
    return null;
  }
  var cmp = function (a, b) {
    return a - b;
  };
  var binarySearch = function (a, e, l, h, c) {
    var i = Math.floor((h + l) / 2), o = a.objectAt(i);
    if (l > h)
      return l;
    if (c(e, o) >= 0) {
      return binarySearch(a, e, i + 1, h, c);
    } else {
      return binarySearch(a, e, l, i - 1, c);
    }
  };
  function binaryInsert(a, e, c) {
    c = c || cmp;
    var len = a.get('length');
    if (len > 0) {
      var i = binarySearch(a, e, 0, len - 1, c);
      a.insertAt(i, e);
    } else {
      a.pushObject(e);
    }
  }
  function hashHasKeys(hash) {
    for (var k in hash) {
      if (hash.hasOwnProperty(k))
        return true;
    }
    return false;
  }
  function getArrayFromRange(l, h, s) {
    var a = [];
    s = s || 1;
    for (var i = l; i < h; i += s) {
      a.push(i);
    }
    return a;
  }
  var extractIdRegex = /:(ember\d+):?/;
  function getEmberId(obj) {
    var str = obj.toString(), match = str.match(extractIdRegex);
    return match && match[1];
  }
  function getOffset(ele, type, parentSelector) {
    parentSelector = parentSelector || 'body';
    if (!Ember.isEmpty($(ele).filter(parentSelector))) {
      return 0;
    }
    return ele['offset' + type] + getOffset(ele.offsetParent, type, parentSelector);
  }
  function emberDeepEqual(src, tar) {
    for (var k in tar) {
      var kObj = src.get(k);
      if (Ember.typeOf(tar[k]) === 'object' || Ember.typeOf(tar[k]) === 'instance') {
        return emberDeepEqual(kObj, tar[k]);
      } else if (Ember.typeOf(tar[k]) === 'array') {
        for (var i = 0; i < tar[k].length; i++) {
          if (!emberDeepEqual(kObj.objectAt(i), tar[k][i])) {
            return false;
          }
        }
      } else if (tar[k] !== kObj) {
        console.log(kObj + ' not equal to ' + tar[k] + ' for key : ' + k);
        return false;
      }
    }
    return true;
  }
  return {
    deepSearchArray: deepSearchArray,
    binaryInsert: binaryInsert,
    hashHasKeys: hashHasKeys,
    getArrayFromRange: getArrayFromRange,
    getEmberId: getEmberId,
    getOffset: getOffset,
    emberDeepEqual: emberDeepEqual
  };
}();
objectWithArrayMixin = function (Ember, Misc) {
  var ObjectWithArrayMixin = Ember.Mixin.create({
    init: function () {
      this._super();
      Ember.set(this, 'arrayProps', this.get('arrayProps') || []);
      this.addArrayObserverToProp('arrayProps');
      Ember.set(this, 'arrayProps.propKey', 'arrayProps');
      this.arrayPropsWasAdded(this.get('arrayProps') || []);
    },
    addBeforeObserverToProp: function (propKey) {
      Ember.addBeforeObserver(this, propKey, this, 'propWillChange');
    },
    removeBeforeObserverFromProp: function (propKey) {
      Ember.removeBeforeObserver(this, propKey, this, 'propWillChange');
    },
    addObserverToProp: function (propKey) {
      Ember.addObserver(this, propKey, this, 'propDidChange');
    },
    removeObserverFromProp: function (propKey) {
      Ember.removeObserver(this, propKey, this, 'propDidChange');
    },
    propWillChange: function (obj, key) {
      this.removeArrayObserverFromProp(key);
      var prop = this.get(key);
      if (prop && prop.objectsAt) {
        var idxs = Misc.getArrayFromRange(0, prop.get('length'));
        this[key + 'WillBeDeleted'](prop.objectsAt(idxs), idxs, true);
      }
    },
    propDidChange: function (obj, key) {
      this.addArrayObserverToProp(key);
      var prop = this.get(key);
      if (prop) {
        this.propArrayNotifyChange(prop, key);
      }
    },
    propArrayNotifyChange: function (prop, key) {
      if (prop.objectsAt) {
        var idxs = Misc.getArrayFromRange(0, prop.get('length'));
        this[key + 'WasAdded'](prop.objectsAt(idxs), idxs, true);
      }
    },
    addArrayObserverToProp: function (propKey) {
      var prop = this.get(propKey);
      if (prop && prop.addArrayObserver) {
        prop.set('propKey', propKey);
        prop.addArrayObserver(this, {
          willChange: this.propArrayWillChange,
          didChange: this.propArrayDidChange
        });
      }
    },
    removeArrayObserverFromProp: function (propKey) {
      var prop = this.get(propKey);
      if (prop && prop.removeArrayObserver) {
        prop.removeArrayObserver(this, {
          willChange: this.propArrayWillChange,
          didChange: this.propArrayDidChange
        });
      }
    },
    propArrayWillChange: function (array, idx, removedCount, addedCount) {
      if ((array.content || array.length) && array.get('length') > 0) {
        var propKey = array.get('propKey'), idxs = Misc.getArrayFromRange(idx, idx + removedCount);
        this[propKey + 'WillBeDeleted'](array.objectsAt(idxs), idxs);
      }
    },
    propArrayDidChange: function (array, idx, removedCount, addedCount) {
      if ((array.content || array.length) && array.get('length') > 0) {
        var propKey = array.get('propKey'), addedIdxs = [], removedObjs = [], rc = 0;
        for (var i = idx; i < idx + addedCount; i++) {
          var obj = array.objectAt(i);
          if (!this[propKey + 'CanAdd'](obj, i)) {
            removedObjs.push(obj);
            rc++;
          } else {
            addedIdxs.push(i);
          }
        }
        if (addedIdxs.length > 0) {
          this[propKey + 'WasAdded'](array.objectsAt(addedIdxs), addedIdxs);
        }
        if (removedObjs.length > 0) {
          array.removeObjects(removedObjs);
        }
      }
    },
    propWillBeDeleted: function (eles, idxs) {
    },
    propCanAdd: function (ele, idx) {
      return true;
    },
    propWasAdded: function (eles, idxs) {
    },
    arrayProps: null,
    arrayPropsWillBeDeleted: function (arrayProps) {
      for (var i = 0; i < arrayProps.length; i++) {
        this.removeArrayObserverFromProp(arrayProps[i]);
        this.removeBeforeObserverFromProp(arrayProps[i]);
        this.removeObserverFromProp(arrayProps[i]);
      }
    },
    arrayPropsCanAdd: function (ele, idx) {
      return true;
    },
    arrayPropsWasAdded: function (arrayProps) {
      for (var i = 0; i < arrayProps.length; i++) {
        this.arrayPropWasAdded(arrayProps[i]);
      }
    },
    arrayPropWasAdded: function (arrayProp) {
      var prop = this.get(arrayProp);
      if (!this[arrayProp + 'WillBeDeleted'])
        this[arrayProp + 'WillBeDeleted'] = this.propWillBeDeleted;
      if (!this[arrayProp + 'CanAdd'])
        this[arrayProp + 'CanAdd'] = this.propCanAdd;
      if (!this[arrayProp + 'WasAdded'])
        this[arrayProp + 'WasAdded'] = this.propWasAdded;
      if (!prop) {
        this.set(arrayProp, []);
      } else {
        this.propArrayNotifyChange(prop, arrayProp);
      }
      this.addArrayObserverToProp(arrayProp);
      this.addBeforeObserverToProp(arrayProp);
      this.addObserverToProp(arrayProp);
    }
  });
  return ObjectWithArrayMixin;
}(ember, misc);
_diff_ = function () {
  var typeOf = function (obj) {
      return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    }, _diff = function (srcObj, tarObj, meta) {
      var diffObj, hasDiff = 0, fullKey = meta.hierarchy.join('.'), fullKeyActual = meta.hierarchyActual.join('.');
      if (typeOf(srcObj) === 'object') {
        if (typeOf(tarObj) === 'object') {
          diffObj = {};
          for (var k in tarObj) {
            meta.hierarchy.push(k);
            meta.hierarchyActual.push(k);
            var d = _diff(srcObj[k], tarObj[k], meta);
            meta.hierarchyActual.pop();
            meta.hierarchy.pop();
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
            meta.hierarchy.push('@');
            meta.hierarchyActual.push(i);
            var d = _diff(srcObj[i], tarObj[i], meta);
            meta.hierarchyActual.pop();
            meta.hierarchy.pop();
            diffObj.push(d);
            if (d !== undefined) {
              hasDiff = 1;
            }
          }
        }
      } else {
        if (!meta.ignoreKeys[fullKey]) {
          if (srcObj !== tarObj) {
            diffObj = tarObj;
            hasDiff = 1;
          }
        }
      }
      return hasDiff === 1 ? diffObj : undefined;
    }, diff = function (srcObj, tarObj, ignoreKeys) {
      return _diff(srcObj, tarObj, {
        ignoreKeys: ignoreKeys || {},
        hierarchy: [],
        hierarchyActual: []
      });
    };
  return diff;
}();
merge = function () {
  var typeOf = function (obj) {
    return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  };
  function merge(tar, src, replace) {
    if (Ember.isNone(tar)) {
      return src;
    } else if (Ember.isNone(src)) {
      return tar;
    }
    if (typeOf(src) === 'object') {
      for (var k in src) {
        if (src.hasOwnProperty(k)) {
          if (Ember.isNone(tar[k]) || replace) {
            tar[k] = merge(tar[k], src[k], replace);
          }
        }
      }
    } else if (typeOf(src) === 'array') {
      if (src.length === tar.length) {
        for (var i = 0; i < src.length; i++) {
          tar[i] = merge(tar[i], src[i], replace);
        }
      } else {
        return src;
      }
    } else {
      return src;
    }
    return tar;
  }
  return merge;
}();
ember_utils_core = function (diff) {
  var EmberUtilsCore = Ember.Namespace.create(), modules = [
      hierarchy,
      misc
    ];
  for (var i = 0; i < modules.length; i++) {
    for (var k in modules[i]) {
      if (modules[i].hasOwnProperty(k)) {
        EmberUtilsCore[k] = modules[i][k];
      }
    }
  }
  EmberUtilsCore.hasMany = hasMany;
  EmberUtilsCore.belongsTo = belongsTo;
  EmberUtilsCore.ObjectWithArrayMixin = objectWithArrayMixin;
  EmberUtilsCore.diff = diff;
  EmberUtilsCore.merge = merge;
  return EmberUtilsCore;
}(_diff_);
return ember_utils_core;

}));
