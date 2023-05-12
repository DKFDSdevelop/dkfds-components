(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.DKFDS = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * array-foreach
 *   Array#forEach ponyfill for older browsers
 *   (Ponyfill: A polyfill that doesn't overwrite the native method)
 * 
 * https://github.com/twada/array-foreach
 *
 * Copyright (c) 2015-2016 Takuto Wada
 * Licensed under the MIT license.
 *   https://github.com/twada/array-foreach/blob/master/MIT-LICENSE
 */
'use strict';

module.exports = function forEach(ary, callback, thisArg) {
  if (ary.forEach) {
    ary.forEach(callback, thisArg);
    return;
  }
  for (var i = 0; i < ary.length; i += 1) {
    callback.call(thisArg, ary[i], i, ary);
  }
};

},{}],2:[function(require,module,exports){
"use strict";

/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20170427
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in window.self) {
  // Full polyfill for browsers with no classList support
  // Including IE < Edge missing SVGElement.classList
  if (!("classList" in document.createElement("_")) || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g"))) {
    (function (view) {
      "use strict";

      if (!('Element' in view)) return;
      var classListProp = "classList",
        protoProp = "prototype",
        elemCtrProto = view.Element[protoProp],
        objCtr = Object,
        strTrim = String[protoProp].trim || function () {
          return this.replace(/^\s+|\s+$/g, "");
        },
        arrIndexOf = Array[protoProp].indexOf || function (item) {
          var i = 0,
            len = this.length;
          for (; i < len; i++) {
            if (i in this && this[i] === item) {
              return i;
            }
          }
          return -1;
        }
        // Vendors: please allow content code to instantiate DOMExceptions
        ,
        DOMEx = function DOMEx(type, message) {
          this.name = type;
          this.code = DOMException[type];
          this.message = message;
        },
        checkTokenAndGetIndex = function checkTokenAndGetIndex(classList, token) {
          if (token === "") {
            throw new DOMEx("SYNTAX_ERR", "An invalid or illegal string was specified");
          }
          if (/\s/.test(token)) {
            throw new DOMEx("INVALID_CHARACTER_ERR", "String contains an invalid character");
          }
          return arrIndexOf.call(classList, token);
        },
        ClassList = function ClassList(elem) {
          var trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
            classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
            i = 0,
            len = classes.length;
          for (; i < len; i++) {
            this.push(classes[i]);
          }
          this._updateClassName = function () {
            elem.setAttribute("class", this.toString());
          };
        },
        classListProto = ClassList[protoProp] = [],
        classListGetter = function classListGetter() {
          return new ClassList(this);
        };
      // Most DOMException implementations don't allow calling DOMException's toString()
      // on non-DOMExceptions. Error's toString() is sufficient here.
      DOMEx[protoProp] = Error[protoProp];
      classListProto.item = function (i) {
        return this[i] || null;
      };
      classListProto.contains = function (token) {
        token += "";
        return checkTokenAndGetIndex(this, token) !== -1;
      };
      classListProto.add = function () {
        var tokens = arguments,
          i = 0,
          l = tokens.length,
          token,
          updated = false;
        do {
          token = tokens[i] + "";
          if (checkTokenAndGetIndex(this, token) === -1) {
            this.push(token);
            updated = true;
          }
        } while (++i < l);
        if (updated) {
          this._updateClassName();
        }
      };
      classListProto.remove = function () {
        var tokens = arguments,
          i = 0,
          l = tokens.length,
          token,
          updated = false,
          index;
        do {
          token = tokens[i] + "";
          index = checkTokenAndGetIndex(this, token);
          while (index !== -1) {
            this.splice(index, 1);
            updated = true;
            index = checkTokenAndGetIndex(this, token);
          }
        } while (++i < l);
        if (updated) {
          this._updateClassName();
        }
      };
      classListProto.toggle = function (token, force) {
        token += "";
        var result = this.contains(token),
          method = result ? force !== true && "remove" : force !== false && "add";
        if (method) {
          this[method](token);
        }
        if (force === true || force === false) {
          return force;
        } else {
          return !result;
        }
      };
      classListProto.toString = function () {
        return this.join(" ");
      };
      if (objCtr.defineProperty) {
        var classListPropDesc = {
          get: classListGetter,
          enumerable: true,
          configurable: true
        };
        try {
          objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        } catch (ex) {
          // IE 8 doesn't support enumerable:true
          // adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
          // modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
          if (ex.number === undefined || ex.number === -0x7FF5EC54) {
            classListPropDesc.enumerable = false;
            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
          }
        }
      } else if (objCtr[protoProp].__defineGetter__) {
        elemCtrProto.__defineGetter__(classListProp, classListGetter);
      }
    })(window.self);
  }

  // There is full or partial native classList support, so just check if we need
  // to normalize the add/remove and toggle APIs.

  (function () {
    "use strict";

    var testElement = document.createElement("_");
    testElement.classList.add("c1", "c2");

    // Polyfill for IE 10/11 and Firefox <26, where classList.add and
    // classList.remove exist but support only one argument at a time.
    if (!testElement.classList.contains("c2")) {
      var createMethod = function createMethod(method) {
        var original = DOMTokenList.prototype[method];
        DOMTokenList.prototype[method] = function (token) {
          var i,
            len = arguments.length;
          for (i = 0; i < len; i++) {
            token = arguments[i];
            original.call(this, token);
          }
        };
      };
      createMethod('add');
      createMethod('remove');
    }
    testElement.classList.toggle("c3", false);

    // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
    // support the second argument.
    if (testElement.classList.contains("c3")) {
      var _toggle = DOMTokenList.prototype.toggle;
      DOMTokenList.prototype.toggle = function (token, force) {
        if (1 in arguments && !this.contains(token) === !force) {
          return force;
        } else {
          return _toggle.call(this, token);
        }
      };
    }
    testElement = null;
  })();
}

},{}],3:[function(require,module,exports){
"use strict";

require('../../modules/es6.string.iterator');
require('../../modules/es6.array.from');
module.exports = require('../../modules/_core').Array.from;

},{"../../modules/_core":10,"../../modules/es6.array.from":58,"../../modules/es6.string.iterator":60}],4:[function(require,module,exports){
"use strict";

require('../../modules/es6.object.assign');
module.exports = require('../../modules/_core').Object.assign;

},{"../../modules/_core":10,"../../modules/es6.object.assign":59}],5:[function(require,module,exports){
"use strict";

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],6:[function(require,module,exports){
"use strict";

var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":27}],7:[function(require,module,exports){
"use strict";

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
    } else for (; length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    }
    return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":49,"./_to-iobject":51,"./_to-length":52}],8:[function(require,module,exports){
"use strict";

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () {
  return arguments;
}()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function tryGet(it, key) {
  try {
    return it[key];
  } catch (e) {/* empty */}
};
module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
  // @@toStringTag case
  : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
  // builtinTag case
  : ARG ? cof(O)
  // ES3 arguments fallback
  : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":9,"./_wks":56}],9:[function(require,module,exports){
"use strict";

var toString = {}.toString;
module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],10:[function(require,module,exports){
"use strict";

var core = module.exports = {
  version: '2.6.12'
};
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],11:[function(require,module,exports){
'use strict';

var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));else object[index] = value;
};

},{"./_object-dp":36,"./_property-desc":43}],12:[function(require,module,exports){
"use strict";

// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1:
      return function (a) {
        return fn.call(that, a);
      };
    case 2:
      return function (a, b) {
        return fn.call(that, a, b);
      };
    case 3:
      return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
  }
  return function /* ...args */
  () {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":5}],13:[function(require,module,exports){
"use strict";

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],14:[function(require,module,exports){
"use strict";

// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', {
    get: function get() {
      return 7;
    }
  }).a != 7;
});

},{"./_fails":18}],15:[function(require,module,exports){
"use strict";

var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":20,"./_is-object":27}],16:[function(require,module,exports){
"use strict";

// IE 8- don't enum bug keys
module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

},{}],17:[function(require,module,exports){
"use strict";

var global = require('./_global');
var core = require('./_core');
var hide = require('./_hide');
var redefine = require('./_redefine');
var ctx = require('./_ctx');
var PROTOTYPE = 'prototype';
var $export = function $export(type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1; // forced
$export.G = 2; // global
$export.S = 4; // static
$export.P = 8; // proto
$export.B = 16; // bind
$export.W = 32; // wrap
$export.U = 64; // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":10,"./_ctx":12,"./_global":20,"./_hide":22,"./_redefine":44}],18:[function(require,module,exports){
"use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],19:[function(require,module,exports){
"use strict";

module.exports = require('./_shared')('native-function-to-string', Function.toString);

},{"./_shared":47}],20:[function(require,module,exports){
"use strict";

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self
// eslint-disable-next-line no-new-func
: Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],21:[function(require,module,exports){
"use strict";

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],22:[function(require,module,exports){
"use strict";

var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":14,"./_object-dp":36,"./_property-desc":43}],23:[function(require,module,exports){
"use strict";

var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":20}],24:[function(require,module,exports){
"use strict";

module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {
    get: function get() {
      return 7;
    }
  }).a != 7;
});

},{"./_descriptors":14,"./_dom-create":15,"./_fails":18}],25:[function(require,module,exports){
"use strict";

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":9}],26:[function(require,module,exports){
"use strict";

// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":32,"./_wks":56}],27:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
module.exports = function (it) {
  return _typeof(it) === 'object' ? it !== null : typeof it === 'function';
};

},{}],28:[function(require,module,exports){
"use strict";

// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":6}],29:[function(require,module,exports){
'use strict';

var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () {
  return this;
});
module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, {
    next: descriptor(1, next)
  });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":22,"./_object-create":35,"./_property-desc":43,"./_set-to-string-tag":45,"./_wks":56}],30:[function(require,module,exports){
'use strict';

var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';
var returnThis = function returnThis() {
  return this;
};
module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function getMethod(kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS:
        return function keys() {
          return new Constructor(this, kind);
        };
      case VALUES:
        return function values() {
          return new Constructor(this, kind);
        };
    }
    return function entries() {
      return new Constructor(this, kind);
    };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() {
      return $native.call(this);
    };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":17,"./_hide":22,"./_iter-create":29,"./_iterators":32,"./_library":33,"./_object-gpo":39,"./_redefine":44,"./_set-to-string-tag":45,"./_wks":56}],31:[function(require,module,exports){
"use strict";

var ITERATOR = require('./_wks')('iterator');
var SAFE_CLOSING = false;
try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () {
    SAFE_CLOSING = true;
  };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () {
    throw 2;
  });
} catch (e) {/* empty */}
module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () {
      return {
        done: safe = true
      };
    };
    arr[ITERATOR] = function () {
      return iter;
    };
    exec(arr);
  } catch (e) {/* empty */}
  return safe;
};

},{"./_wks":56}],32:[function(require,module,exports){
"use strict";

module.exports = {};

},{}],33:[function(require,module,exports){
"use strict";

module.exports = false;

},{}],34:[function(require,module,exports){
'use strict';

// 19.1.2.1 Object.assign(target, source, ...)
var DESCRIPTORS = require('./_descriptors');
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) {
    B[k] = k;
  });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) {
  // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || isEnum.call(S, key)) T[key] = S[key];
    }
  }
  return T;
} : $assign;

},{"./_descriptors":14,"./_fails":18,"./_iobject":25,"./_object-gops":38,"./_object-keys":41,"./_object-pie":42,"./_to-object":53}],35:[function(require,module,exports){
"use strict";

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function Empty() {/* empty */};
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var _createDict = function createDict() {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  _createDict = iframeDocument.F;
  while (i--) delete _createDict[PROTOTYPE][enumBugKeys[i]];
  return _createDict();
};
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = _createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":6,"./_dom-create":15,"./_enum-bug-keys":16,"./_html":23,"./_object-dps":37,"./_shared-key":46}],36:[function(require,module,exports){
"use strict";

var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;
exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) {/* empty */}
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":6,"./_descriptors":14,"./_ie8-dom-define":24,"./_to-primitive":54}],37:[function(require,module,exports){
"use strict";

var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');
module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_an-object":6,"./_descriptors":14,"./_object-dp":36,"./_object-keys":41}],38:[function(require,module,exports){
"use strict";

exports.f = Object.getOwnPropertySymbols;

},{}],39:[function(require,module,exports){
"use strict";

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;
module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  }
  return O instanceof Object ? ObjectProto : null;
};

},{"./_has":21,"./_shared-key":46,"./_to-object":53}],40:[function(require,module,exports){
"use strict";

var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');
module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_array-includes":7,"./_has":21,"./_shared-key":46,"./_to-iobject":51}],41:[function(require,module,exports){
"use strict";

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');
module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":16,"./_object-keys-internal":40}],42:[function(require,module,exports){
"use strict";

exports.f = {}.propertyIsEnumerable;

},{}],43:[function(require,module,exports){
"use strict";

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],44:[function(require,module,exports){
"use strict";

var global = require('./_global');
var hide = require('./_hide');
var has = require('./_has');
var SRC = require('./_uid')('src');
var $toString = require('./_function-to-string');
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);
require('./_core').inspectSource = function (it) {
  return $toString.call(it);
};
(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

},{"./_core":10,"./_function-to-string":19,"./_global":20,"./_has":21,"./_hide":22,"./_uid":55}],45:[function(require,module,exports){
"use strict";

var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');
module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, {
    configurable: true,
    value: tag
  });
};

},{"./_has":21,"./_object-dp":36,"./_wks":56}],46:[function(require,module,exports){
"use strict";

var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":47,"./_uid":55}],47:[function(require,module,exports){
"use strict";

var core = require('./_core');
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});

},{"./_core":10,"./_global":20,"./_library":33}],48:[function(require,module,exports){
"use strict";

var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":13,"./_to-integer":50}],49:[function(require,module,exports){
"use strict";

var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":50}],50:[function(require,module,exports){
"use strict";

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],51:[function(require,module,exports){
"use strict";

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":13,"./_iobject":25}],52:[function(require,module,exports){
"use strict";

// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":50}],53:[function(require,module,exports){
"use strict";

// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":13}],54:[function(require,module,exports){
"use strict";

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":27}],55:[function(require,module,exports){
"use strict";

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],56:[function(require,module,exports){
"use strict";

var store = require('./_shared')('wks');
var uid = require('./_uid');
var _Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof _Symbol == 'function';
var $exports = module.exports = function (name) {
  return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : uid)('Symbol.' + name));
};
$exports.store = store;

},{"./_global":20,"./_shared":47,"./_uid":55}],57:[function(require,module,exports){
"use strict";

var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
};

},{"./_classof":8,"./_core":10,"./_iterators":32,"./_wks":56}],58:[function(require,module,exports){
'use strict';

var ctx = require('./_ctx');
var $export = require('./_export');
var toObject = require('./_to-object');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var toLength = require('./_to-length');
var createProperty = require('./_create-property');
var getIterFn = require('./core.get-iterator-method');
$export($export.S + $export.F * !require('./_iter-detect')(function (iter) {
  Array.from(iter);
}), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":11,"./_ctx":12,"./_export":17,"./_is-array-iter":26,"./_iter-call":28,"./_iter-detect":31,"./_to-length":52,"./_to-object":53,"./core.get-iterator-method":57}],59:[function(require,module,exports){
"use strict";

// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');
$export($export.S + $export.F, 'Object', {
  assign: require('./_object-assign')
});

},{"./_export":17,"./_object-assign":34}],60:[function(require,module,exports){
'use strict';

var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0; // next index
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return {
    value: undefined,
    done: true
  };
  point = $at(O, index);
  this._i += point.length;
  return {
    value: point,
    done: false
  };
});

},{"./_iter-define":30,"./_string-at":48}],61:[function(require,module,exports){
"use strict";

/* global define, KeyboardEvent, module */

(function () {
  var keyboardeventKeyPolyfill = {
    polyfill: polyfill,
    keys: {
      3: 'Cancel',
      6: 'Help',
      8: 'Backspace',
      9: 'Tab',
      12: 'Clear',
      13: 'Enter',
      16: 'Shift',
      17: 'Control',
      18: 'Alt',
      19: 'Pause',
      20: 'CapsLock',
      27: 'Escape',
      28: 'Convert',
      29: 'NonConvert',
      30: 'Accept',
      31: 'ModeChange',
      32: ' ',
      33: 'PageUp',
      34: 'PageDown',
      35: 'End',
      36: 'Home',
      37: 'ArrowLeft',
      38: 'ArrowUp',
      39: 'ArrowRight',
      40: 'ArrowDown',
      41: 'Select',
      42: 'Print',
      43: 'Execute',
      44: 'PrintScreen',
      45: 'Insert',
      46: 'Delete',
      48: ['0', ')'],
      49: ['1', '!'],
      50: ['2', '@'],
      51: ['3', '#'],
      52: ['4', '$'],
      53: ['5', '%'],
      54: ['6', '^'],
      55: ['7', '&'],
      56: ['8', '*'],
      57: ['9', '('],
      91: 'OS',
      93: 'ContextMenu',
      144: 'NumLock',
      145: 'ScrollLock',
      181: 'VolumeMute',
      182: 'VolumeDown',
      183: 'VolumeUp',
      186: [';', ':'],
      187: ['=', '+'],
      188: [',', '<'],
      189: ['-', '_'],
      190: ['.', '>'],
      191: ['/', '?'],
      192: ['`', '~'],
      219: ['[', '{'],
      220: ['\\', '|'],
      221: [']', '}'],
      222: ["'", '"'],
      224: 'Meta',
      225: 'AltGraph',
      246: 'Attn',
      247: 'CrSel',
      248: 'ExSel',
      249: 'EraseEof',
      250: 'Play',
      251: 'ZoomOut'
    }
  };

  // Function keys (F1-24).
  var i;
  for (i = 1; i < 25; i++) {
    keyboardeventKeyPolyfill.keys[111 + i] = 'F' + i;
  }

  // Printable ASCII characters.
  var letter = '';
  for (i = 65; i < 91; i++) {
    letter = String.fromCharCode(i);
    keyboardeventKeyPolyfill.keys[i] = [letter.toLowerCase(), letter.toUpperCase()];
  }
  function polyfill() {
    if (!('KeyboardEvent' in window) || 'key' in KeyboardEvent.prototype) {
      return false;
    }

    // Polyfill `key` on `KeyboardEvent`.
    var proto = {
      get: function get(x) {
        var key = keyboardeventKeyPolyfill.keys[this.which || this.keyCode];
        if (Array.isArray(key)) {
          key = key[+this.shiftKey];
        }
        return key;
      }
    };
    Object.defineProperty(KeyboardEvent.prototype, 'key', proto);
    return proto;
  }
  if (typeof define === 'function' && define.amd) {
    define('keyboardevent-key-polyfill', keyboardeventKeyPolyfill);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    module.exports = keyboardeventKeyPolyfill;
  } else if (window) {
    window.keyboardeventKeyPolyfill = keyboardeventKeyPolyfill;
  }
})();

},{}],62:[function(require,module,exports){
'use strict';

var proto = typeof Element !== 'undefined' ? Element.prototype : {};
var vendor = proto.matches || proto.matchesSelector || proto.webkitMatchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector;
module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (!el || el.nodeType !== 1) return false;
  if (vendor) return vendor.call(el, selector);
  var nodes = el.parentNode.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i] == el) return true;
  }
  return false;
}

},{}],63:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';

/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;
function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }
  return Object(val);
}
function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    }

    // Detect buggy property enumeration order in older V8 versions.

    // https://bugs.chromium.org/p/v8/issues/detail?id=4118
    var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
    test1[5] = 'de';
    if (Object.getOwnPropertyNames(test1)[0] === '5') {
      return false;
    }

    // https://bugs.chromium.org/p/v8/issues/detail?id=3056
    var test2 = {};
    for (var i = 0; i < 10; i++) {
      test2['_' + String.fromCharCode(i)] = i;
    }
    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
      return test2[n];
    });
    if (order2.join('') !== '0123456789') {
      return false;
    }

    // https://bugs.chromium.org/p/v8/issues/detail?id=3056
    var test3 = {};
    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
      test3[letter] = letter;
    });
    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
      return false;
    }
    return true;
  } catch (err) {
    // We don't expect any of the above to throw, but better to be safe.
    return false;
  }
}
module.exports = shouldUseNative() ? Object.assign : function (target, source) {
  var from;
  var to = toObject(target);
  var symbols;
  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);
    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }
    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);
      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }
  return to;
};

},{}],64:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var assign = require('object-assign');
var delegate = require('./delegate');
var delegateAll = require('./delegateAll');
var DELEGATE_PATTERN = /^(.+):delegate\((.+)\)$/;
var SPACE = ' ';
var getListeners = function getListeners(type, handler) {
  var match = type.match(DELEGATE_PATTERN);
  var selector;
  if (match) {
    type = match[1];
    selector = match[2];
  }
  var options;
  if (_typeof(handler) === 'object') {
    options = {
      capture: popKey(handler, 'capture'),
      passive: popKey(handler, 'passive')
    };
  }
  var listener = {
    selector: selector,
    delegate: _typeof(handler) === 'object' ? delegateAll(handler) : selector ? delegate(selector, handler) : handler,
    options: options
  };
  if (type.indexOf(SPACE) > -1) {
    return type.split(SPACE).map(function (_type) {
      return assign({
        type: _type
      }, listener);
    });
  } else {
    listener.type = type;
    return [listener];
  }
};
var popKey = function popKey(obj, key) {
  var value = obj[key];
  delete obj[key];
  return value;
};
module.exports = function behavior(events, props) {
  var listeners = Object.keys(events).reduce(function (memo, type) {
    var listeners = getListeners(type, events[type]);
    return memo.concat(listeners);
  }, []);
  return assign({
    add: function addBehavior(element) {
      listeners.forEach(function (listener) {
        element.addEventListener(listener.type, listener.delegate, listener.options);
      });
    },
    remove: function removeBehavior(element) {
      listeners.forEach(function (listener) {
        element.removeEventListener(listener.type, listener.delegate, listener.options);
      });
    }
  }, props);
};

},{"./delegate":67,"./delegateAll":68,"object-assign":63}],65:[function(require,module,exports){
"use strict";

var matches = require('matches-selector');
module.exports = function (element, selector) {
  do {
    if (matches(element, selector)) {
      return element;
    }
  } while ((element = element.parentNode) && element.nodeType === 1);
};

},{"matches-selector":62}],66:[function(require,module,exports){
"use strict";

module.exports = function compose(functions) {
  return function (e) {
    return functions.some(function (fn) {
      return fn.call(this, e) === false;
    }, this);
  };
};

},{}],67:[function(require,module,exports){
"use strict";

var closest = require('./closest');
module.exports = function delegate(selector, fn) {
  return function delegation(event) {
    var target = closest(event.target, selector);
    if (target) {
      return fn.call(target, event);
    }
  };
};

},{"./closest":65}],68:[function(require,module,exports){
"use strict";

var delegate = require('./delegate');
var compose = require('./compose');
var SPLAT = '*';
module.exports = function delegateAll(selectors) {
  var keys = Object.keys(selectors);

  // XXX optimization: if there is only one handler and it applies to
  // all elements (the "*" CSS selector), then just return that
  // handler
  if (keys.length === 1 && keys[0] === SPLAT) {
    return selectors[SPLAT];
  }
  var delegates = keys.reduce(function (memo, selector) {
    memo.push(delegate(selector, selectors[selector]));
    return memo;
  }, []);
  return compose(delegates);
};

},{"./compose":66,"./delegate":67}],69:[function(require,module,exports){
"use strict";

module.exports = function ignore(element, fn) {
  return function ignorance(e) {
    if (element !== e.target && !element.contains(e.target)) {
      return fn.call(this, e);
    }
  };
};

},{}],70:[function(require,module,exports){
'use strict';

module.exports = {
  behavior: require('./behavior'),
  delegate: require('./delegate'),
  delegateAll: require('./delegateAll'),
  ignore: require('./ignore'),
  keymap: require('./keymap')
};

},{"./behavior":64,"./delegate":67,"./delegateAll":68,"./ignore":69,"./keymap":71}],71:[function(require,module,exports){
"use strict";

require('keyboardevent-key-polyfill');

// these are the only relevant modifiers supported on all platforms,
// according to MDN:
// <https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState>
var MODIFIERS = {
  'Alt': 'altKey',
  'Control': 'ctrlKey',
  'Ctrl': 'ctrlKey',
  'Shift': 'shiftKey'
};
var MODIFIER_SEPARATOR = '+';
var getEventKey = function getEventKey(event, hasModifiers) {
  var key = event.key;
  if (hasModifiers) {
    for (var modifier in MODIFIERS) {
      if (event[MODIFIERS[modifier]] === true) {
        key = [modifier, key].join(MODIFIER_SEPARATOR);
      }
    }
  }
  return key;
};
module.exports = function keymap(keys) {
  var hasModifiers = Object.keys(keys).some(function (key) {
    return key.indexOf(MODIFIER_SEPARATOR) > -1;
  });
  return function (event) {
    var key = getEventKey(event, hasModifiers);
    return [key, key.toLowerCase()].reduce(function (result, _key) {
      if (_key in keys) {
        result = keys[key].call(this, event);
      }
      return result;
    }, undefined);
  };
};
module.exports.MODIFIERS = MODIFIERS;

},{"keyboardevent-key-polyfill":61}],72:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
require("../polyfills/Function/prototype/bind");
var toggle = require('../utils/toggle');
var isElementInViewport = require('../utils/is-in-viewport');
var BUTTON = ".accordion-button[aria-controls]";
var EXPANDED = 'aria-expanded';
var BULK_FUNCTION_ACTION_ATTRIBUTE = "data-accordion-bulk-expand";
var TEXT_ACCORDION = {
  "open_all": "Åbn alle",
  "close_all": "Luk alle"
};

/**
 * Adds click functionality to accordion list
 * @param {HTMLElement} $accordion the accordion ul element
 * @param {JSON} strings Translate labels: {"open_all": "Åbn alle", "close_all": "Luk alle"}
 */
function Accordion($accordion) {
  var strings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : TEXT_ACCORDION;
  if (!$accordion) {
    throw new Error("Missing accordion group element");
  }
  this.accordion = $accordion;
  this.text = strings;
}

/**
 * Set eventlisteners on click elements in accordion list
 */
Accordion.prototype.init = function () {
  this.buttons = this.accordion.querySelectorAll(BUTTON);
  if (this.buttons.length == 0) {
    throw new Error("Missing accordion buttons");
  }

  // loop buttons in list
  for (var i = 0; i < this.buttons.length; i++) {
    var currentButton = this.buttons[i];

    // Verify state on button and state on panel
    var expanded = currentButton.getAttribute(EXPANDED) === 'true';
    this.toggleButton(currentButton, expanded);

    // Set click event on accordion buttons
    currentButton.removeEventListener('click', this.eventOnClick.bind(this, currentButton), false);
    currentButton.addEventListener('click', this.eventOnClick.bind(this, currentButton), false);
  }
  // Set click event on bulk button if present
  var prevSibling = this.accordion.previousElementSibling;
  if (prevSibling !== null && prevSibling.classList.contains('accordion-bulk-button')) {
    this.bulkFunctionButton = prevSibling;
    this.bulkFunctionButton.addEventListener('click', this.bulkEvent.bind(this));
  }
};

/**
 * Bulk event handler: Triggered when clicking on .accordion-bulk-button
 */
Accordion.prototype.bulkEvent = function () {
  var $module = this;
  if (!$module.accordion.classList.contains('accordion')) {
    throw new Error("Could not find accordion.");
  }
  if ($module.buttons.length == 0) {
    throw new Error("Missing accordion buttons");
  }
  var expand = true;
  if ($module.bulkFunctionButton.getAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE) === "false") {
    expand = false;
  }
  for (var i = 0; i < $module.buttons.length; i++) {
    $module.toggleButton($module.buttons[i], expand, true);
  }
  $module.bulkFunctionButton.setAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE, !expand);
  if (!expand === true) {
    $module.bulkFunctionButton.innerText = this.text.open_all;
  } else {
    $module.bulkFunctionButton.innerText = this.text.close_all;
  }
};

/**
 * Accordion button event handler: Toggles accordion
 * @param {HTMLButtonElement} $button 
 * @param {PointerEvent} e 
 */
Accordion.prototype.eventOnClick = function ($button, e) {
  var $module = this;
  e.stopPropagation();
  e.preventDefault();
  $module.toggleButton($button);
  if ($button.getAttribute(EXPANDED) === 'true') {
    // We were just expanded, but if another accordion was also just
    // collapsed, we may no longer be in the viewport. This ensures
    // that we are still visible, so the user isn't confused.
    if (!isElementInViewport($button)) $button.scrollIntoView();
  }
};

/**
 * Toggle a button's "pressed" state, optionally providing a target
 * state.
 *
 * @param {HTMLButtonElement} button
 * @param {boolean?} expanded If no state is provided, the current
 * state will be toggled (from false to true, and vice-versa).
 * @return {boolean} the resulting state
 */
Accordion.prototype.toggleButton = function (button, expanded) {
  var bulk = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var accordion = null;
  if (button.parentNode.parentNode.classList.contains('accordion')) {
    accordion = button.parentNode.parentNode;
  } else if (button.parentNode.parentNode.parentNode.classList.contains('accordion')) {
    accordion = button.parentNode.parentNode.parentNode;
  }
  expanded = toggle(button, expanded);
  if (expanded) {
    var eventOpen = new Event('fds.accordion.open');
    button.dispatchEvent(eventOpen);
  } else {
    var eventClose = new Event('fds.accordion.close');
    button.dispatchEvent(eventClose);
  }
  if (accordion !== null) {
    var bulkFunction = accordion.previousElementSibling;
    if (bulkFunction !== null && bulkFunction.classList.contains('accordion-bulk-button')) {
      var buttons = accordion.querySelectorAll(BUTTON);
      if (bulk === false) {
        var buttonsOpen = accordion.querySelectorAll(BUTTON + '[aria-expanded="true"]');
        var newStatus = true;
        if (buttons.length === buttonsOpen.length) {
          newStatus = false;
        }
        bulkFunction.setAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE, newStatus);
        if (newStatus === true) {
          bulkFunction.innerText = this.text.open_all;
        } else {
          bulkFunction.innerText = this.text.close_all;
        }
      }
    }
  }
};
var _default = Accordion;
exports["default"] = _default;

},{"../polyfills/Function/prototype/bind":94,"../utils/is-in-viewport":103,"../utils/toggle":106}],73:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function Alert(alert) {
  this.alert = alert;
}
Alert.prototype.init = function () {
  var close = this.alert.getElementsByClassName('alert-close');
  if (close.length === 1) {
    close[0].addEventListener('click', this.hide.bind(this));
  }
};
Alert.prototype.hide = function () {
  this.alert.classList.add('d-none');
  var eventHide = new Event('fds.alert.hide');
  this.alert.dispatchEvent(eventHide);
};
Alert.prototype.show = function () {
  this.alert.classList.remove('d-none');
  var eventShow = new Event('fds.alert.show');
  this.alert.dispatchEvent(eventShow);
};
var _default = Alert;
exports["default"] = _default;

},{}],74:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function BackToTop(backtotop) {
  this.backtotop = backtotop;
}
BackToTop.prototype.init = function () {
  var backtotopbutton = this.backtotop;
  updateBackToTopButton(backtotopbutton);
  var observer = new MutationObserver(function (list) {
    var evt = new CustomEvent('dom-changed', {
      detail: list
    });
    document.body.dispatchEvent(evt);
  });

  // Which mutations to observe
  var config = {
    attributes: true,
    attributeOldValue: false,
    characterData: true,
    characterDataOldValue: false,
    childList: true,
    subtree: true
  };

  // DOM changes
  observer.observe(document.body, config);
  document.body.addEventListener('dom-changed', function (e) {
    updateBackToTopButton(backtotopbutton);
  });

  // Scroll actions
  window.addEventListener('scroll', function (e) {
    updateBackToTopButton(backtotopbutton);
  });

  // Window resizes
  window.addEventListener('resize', function (e) {
    updateBackToTopButton(backtotopbutton);
  });
};
function updateBackToTopButton(button) {
  var docBody = document.body;
  var docElem = document.documentElement;
  var heightOfViewport = Math.max(docElem.clientHeight || 0, window.innerHeight || 0);
  var heightOfPage = Math.max(docBody.scrollHeight, docBody.offsetHeight, docBody.getBoundingClientRect().height, docElem.scrollHeight, docElem.offsetHeight, docElem.getBoundingClientRect().height, docElem.clientHeight);
  var limit = heightOfViewport * 2; // The threshold selected to determine whether a back-to-top-button should be displayed

  // Never show the button if the page is too short
  if (limit > heightOfPage) {
    if (!button.classList.contains('d-none')) {
      button.classList.add('d-none');
    }
  }
  // If the page is long, calculate when to show the button
  else {
    if (button.classList.contains('d-none')) {
      button.classList.remove('d-none');
    }
    var lastKnownScrollPosition = window.scrollY;
    var footer = document.getElementsByTagName("footer")[0]; // If there are several footers, the code only applies to the first footer

    // Show the button, if the user has scrolled too far down
    if (lastKnownScrollPosition >= limit) {
      if (!isFooterVisible(footer) && button.classList.contains('footer-sticky')) {
        button.classList.remove('footer-sticky');
      } else if (isFooterVisible(footer) && !button.classList.contains('footer-sticky')) {
        button.classList.add('footer-sticky');
      }
    }
    // If there's a sidenav, we might want to show the button anyway
    else {
      var sidenav = document.querySelector('.sidenav-list'); // Finds side navigations (left menus) and step guides

      if (sidenav && sidenav.offsetParent !== null) {
        var _sidenav$closest, _sidenav$closest$prev, _sidenav$closest2, _sidenav$closest2$pre;
        // Only react to sidenavs, which are always visible (i.e. not opened from overflow-menu buttons)
        if (!(((_sidenav$closest = sidenav.closest(".overflow-menu-inner")) === null || _sidenav$closest === void 0 ? void 0 : (_sidenav$closest$prev = _sidenav$closest.previousElementSibling) === null || _sidenav$closest$prev === void 0 ? void 0 : _sidenav$closest$prev.getAttribute('aria-expanded')) === "true" && ((_sidenav$closest2 = sidenav.closest(".overflow-menu-inner")) === null || _sidenav$closest2 === void 0 ? void 0 : (_sidenav$closest2$pre = _sidenav$closest2.previousElementSibling) === null || _sidenav$closest2$pre === void 0 ? void 0 : _sidenav$closest2$pre.offsetParent) !== null)) {
          var rect = sidenav.getBoundingClientRect();
          if (rect.bottom < 0) {
            if (!isFooterVisible(footer) && button.classList.contains('footer-sticky')) {
              button.classList.remove('footer-sticky');
            } else if (isFooterVisible(footer) && !button.classList.contains('footer-sticky')) {
              button.classList.add('footer-sticky');
            }
          } else {
            if (!button.classList.contains('footer-sticky')) {
              button.classList.add('footer-sticky');
            }
          }
        }
      }
      // There's no sidenav and we know the user hasn't reached the scroll limit: Ensure the button is hidden
      else {
        if (!button.classList.contains('footer-sticky')) {
          button.classList.add('footer-sticky');
        }
      }
    }
  }
}
function isFooterVisible(footerElement) {
  if (footerElement !== null && footerElement !== void 0 && footerElement.querySelector('.footer')) {
    var rect = footerElement.querySelector('.footer').getBoundingClientRect();

    // Footer is visible or partly visible
    if (rect.top < window.innerHeight || rect.top < document.documentElement.clientHeight) {
      return true;
    }
    // Footer is hidden
    else {
      return false;
    }
  } else {
    return false;
  }
}
var _default = BackToTop;
exports["default"] = _default;

},{}],75:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var MAX_LENGTH = 'data-maxlength';
var TEXT_CHARACTERLIMIT = {
  "character_remaining": "Du har {value} tegn tilbage",
  "characters_remaining": "Du har {value} tegn tilbage",
  "character_too_many": "Du har {value} tegn for meget",
  "characters_too_many": "Du har {value} tegn for meget"
};

/**
 * Show number of characters left in a field
 * @param {HTMLElement} containerElement 
 * @param {JSON} strings Translate labels: {"character_remaining": "Du har {value} tegn tilbage", "characters_remaining": "Du har {value} tegn tilbage", "character_too_many": "Du har {value} tegn for meget", "characters_too_many": "Du har {value} tegn for meget"}
 */
function CharacterLimit(containerElement) {
  var _this = this;
  var strings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : TEXT_CHARACTERLIMIT;
  if (!containerElement) {
    throw new Error("Missing form-limit element");
  }
  this.container = containerElement;
  this.input = containerElement.getElementsByClassName('form-input')[0];
  this.maxlength = this.container.getAttribute(MAX_LENGTH);
  this.text = strings;
  var lastKeyUpTimestamp = null;
  var oldValue = this.input.value;
  var intervalID = null;
  var handleKeyUp = function handleKeyUp() {
    updateVisibleMessage(_this);
    lastKeyUpTimestamp = Date.now();
  };
  var handleFocus = function handleFocus() {
    /* Reset the screen reader message on focus to force an update of the message.
    This ensures that a screen reader informs the user of how many characters there is left
    on focus and not just what the character limit is. */
    if (_this.input.value !== "") {
      var sr_message = _this.container.getElementsByClassName('character-limit-sr-only')[0];
      sr_message.innerHTML = '';
    }
    intervalID = setInterval(function () {
      /* Don't update the Screen Reader message unless it's been awhile
      since the last key up event. Otherwise, the user will be spammed
      with audio notifications while typing. */
      if (!lastKeyUpTimestamp || Date.now() - 500 >= lastKeyUpTimestamp) {
        var _sr_message = this.container.getElementsByClassName('character-limit-sr-only')[0].innerHTML;
        var visible_message = this.container.getElementsByClassName('character-limit')[0].innerHTML;

        /* Don't update the messages unless the input has changed or if there
        is a mismatch between the visible message and the screen reader message. */
        if (oldValue !== this.input.value || _sr_message !== visible_message) {
          oldValue = this.input.value;
          this.updateMessages();
        }
      }
    }.bind(_this), 1000);
  };
  var handleBlur = function handleBlur() {
    clearInterval(intervalID);
    // Don't update the messages on blur unless the value of the textarea/text input has changed
    if (oldValue !== _this.input.value) {
      oldValue = _this.input.value;
      _this.updateMessages();
    }
  };
  this.init = function () {
    var _this2 = this;
    if (!this.maxlength) {
      throw new Error("Character limit is missing attribute ".concat(MAX_LENGTH));
    }
    this.input.addEventListener('keyup', function () {
      handleKeyUp();
    });
    this.input.addEventListener('focus', function () {
      handleFocus();
    });
    this.input.addEventListener('blur', function () {
      handleBlur();
    });

    /* If the browser supports the pageshow event, use it to update the character limit
    message and sr-message once a page has loaded. Second best, use the DOMContentLoaded event. 
    This ensures that if the user navigates to another page in the browser and goes back, the 
    message and sr-message will show/tell the correct amount of characters left. */
    if ('onpageshow' in window) {
      window.addEventListener('pageshow', function () {
        _this2.updateMessages();
      });
    } else {
      window.addEventListener('DOMContentLoaded', function () {
        _this2.updateMessages();
      });
    }
  };
}
CharacterLimit.prototype.charactersLeft = function () {
  var current_length = this.input.value.length;
  return this.maxlength - current_length;
};
function characterLimitMessage(formLimit) {
  var count_message = "";
  var characters_left = formLimit.charactersLeft();
  if (characters_left === -1) {
    var exceeded = Math.abs(characters_left);
    count_message = formLimit.text.character_too_many.replace(/{value}/, exceeded);
  } else if (characters_left === 1) {
    count_message = formLimit.text.character_remaining.replace(/{value}/, characters_left);
  } else if (characters_left >= 0) {
    count_message = formLimit.text.characters_remaining.replace(/{value}/, characters_left);
  } else {
    var _exceeded = Math.abs(characters_left);
    count_message = formLimit.text.characters_too_many.replace(/{value}/, _exceeded);
  }
  return count_message;
}
function updateVisibleMessage(formLimit) {
  var characters_left = formLimit.charactersLeft();
  var count_message = characterLimitMessage(formLimit);
  var character_label = formLimit.container.getElementsByClassName('character-limit')[0];
  if (characters_left < 0) {
    if (!character_label.classList.contains('limit-exceeded')) {
      character_label.classList.add('limit-exceeded');
    }
    if (!formLimit.input.classList.contains('form-limit-error')) {
      formLimit.input.classList.add('form-limit-error');
    }
  } else {
    if (character_label.classList.contains('limit-exceeded')) {
      character_label.classList.remove('limit-exceeded');
    }
    if (formLimit.input.classList.contains('form-limit-error')) {
      formLimit.input.classList.remove('form-limit-error');
    }
  }
  character_label.innerHTML = count_message;
}
function updateScreenReaderMessage(formLimit) {
  var count_message = characterLimitMessage(formLimit);
  var character_label = formLimit.container.getElementsByClassName('character-limit-sr-only')[0];
  character_label.innerHTML = count_message;
}
CharacterLimit.prototype.updateMessages = function () {
  updateVisibleMessage(this);
  updateScreenReaderMessage(this);
};
var _default = CharacterLimit;
exports["default"] = _default;

},{}],76:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
require("../polyfills/Function/prototype/bind");
var TOGGLE_TARGET_ATTRIBUTE = 'data-aria-controls';

/**
 * Adds click functionality to checkbox collapse component
 * @param {HTMLInputElement} checkboxElement 
 */
function CheckboxToggleContent(checkboxElement) {
  this.checkboxElement = checkboxElement;
  this.targetElement = null;
}

/**
 * Set events on checkbox state change
 */
CheckboxToggleContent.prototype.init = function () {
  this.checkboxElement.addEventListener('change', this.toggle.bind(this));
  this.toggle();
};

/**
 * Toggle checkbox content
 */
CheckboxToggleContent.prototype.toggle = function () {
  var $module = this;
  var targetAttr = this.checkboxElement.getAttribute(TOGGLE_TARGET_ATTRIBUTE);
  var targetEl = document.getElementById(targetAttr);
  if (targetEl === null || targetEl === undefined) {
    throw new Error("Could not find panel element. Verify value of attribute " + TOGGLE_TARGET_ATTRIBUTE);
  }
  if (this.checkboxElement.checked) {
    $module.expand(this.checkboxElement, targetEl);
  } else {
    $module.collapse(this.checkboxElement, targetEl);
  }
};

/**
 * Expand content
 * @param {HTMLInputElement} checkboxElement Checkbox input element 
 * @param {HTMLElement} contentElement Content container element 
 */
CheckboxToggleContent.prototype.expand = function (checkboxElement, contentElement) {
  if (checkboxElement !== null && checkboxElement !== undefined && contentElement !== null && contentElement !== undefined) {
    checkboxElement.setAttribute('data-aria-expanded', 'true');
    contentElement.classList.remove('collapsed');
    contentElement.setAttribute('aria-hidden', 'false');
    var eventOpen = new Event('fds.collapse.expanded');
    checkboxElement.dispatchEvent(eventOpen);
  }
};

/**
 * Collapse content
 * @param {HTMLInputElement} checkboxElement Checkbox input element 
 * @param {HTMLElement} contentElement Content container element 
 */
CheckboxToggleContent.prototype.collapse = function (triggerEl, targetEl) {
  if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
    triggerEl.setAttribute('data-aria-expanded', 'false');
    targetEl.classList.add('collapsed');
    targetEl.setAttribute('aria-hidden', 'true');
    var eventClose = new Event('fds.collapse.collapsed');
    triggerEl.dispatchEvent(eventClose);
  }
};
var _default = CheckboxToggleContent;
exports["default"] = _default;

},{"../polyfills/Function/prototype/bind":94}],77:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _receptor = require("receptor");
var _CLICK, _keydown, _focusout, _datePickerEvents;
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var behavior = require("../utils/behavior");
var select = require("../utils/select");
var _require = require("../config"),
  PREFIX = _require.prefix;
var _require2 = require("../events"),
  CLICK = _require2.CLICK;
var activeElement = require("../utils/active-element");
var isIosDevice = require("../utils/is-ios-device");
var DATE_PICKER_CLASS = "date-picker";
var DATE_PICKER_WRAPPER_CLASS = "".concat(DATE_PICKER_CLASS, "__wrapper");
var DATE_PICKER_INITIALIZED_CLASS = "".concat(DATE_PICKER_CLASS, "--initialized");
var DATE_PICKER_ACTIVE_CLASS = "".concat(DATE_PICKER_CLASS, "--active");
var DATE_PICKER_INTERNAL_INPUT_CLASS = "".concat(DATE_PICKER_CLASS, "__internal-input");
var DATE_PICKER_EXTERNAL_INPUT_CLASS = "".concat(DATE_PICKER_CLASS, "__external-input");
var DATE_PICKER_BUTTON_CLASS = "".concat(DATE_PICKER_CLASS, "__button");
var DATE_PICKER_CALENDAR_CLASS = "".concat(DATE_PICKER_CLASS, "__calendar");
var DATE_PICKER_STATUS_CLASS = "".concat(DATE_PICKER_CLASS, "__status");
var DATE_PICKER_GUIDE_CLASS = "".concat(DATE_PICKER_CLASS, "__guide");
var CALENDAR_DATE_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__date");
var DIALOG_WRAPPER_CLASS = "dialog-wrapper";
var DATE_PICKER_DIALOG_WRAPPER = ".".concat(DIALOG_WRAPPER_CLASS);
var CALENDAR_DATE_FOCUSED_CLASS = "".concat(CALENDAR_DATE_CLASS, "--focused");
var CALENDAR_DATE_SELECTED_CLASS = "".concat(CALENDAR_DATE_CLASS, "--selected");
var CALENDAR_DATE_PREVIOUS_MONTH_CLASS = "".concat(CALENDAR_DATE_CLASS, "--previous-month");
var CALENDAR_DATE_CURRENT_MONTH_CLASS = "".concat(CALENDAR_DATE_CLASS, "--current-month");
var CALENDAR_DATE_NEXT_MONTH_CLASS = "".concat(CALENDAR_DATE_CLASS, "--next-month");
var CALENDAR_DATE_RANGE_DATE_CLASS = "".concat(CALENDAR_DATE_CLASS, "--range-date");
var CALENDAR_DATE_TODAY_CLASS = "".concat(CALENDAR_DATE_CLASS, "--today");
var CALENDAR_DATE_RANGE_DATE_START_CLASS = "".concat(CALENDAR_DATE_CLASS, "--range-date-start");
var CALENDAR_DATE_RANGE_DATE_END_CLASS = "".concat(CALENDAR_DATE_CLASS, "--range-date-end");
var CALENDAR_DATE_WITHIN_RANGE_CLASS = "".concat(CALENDAR_DATE_CLASS, "--within-range");
var CALENDAR_PREVIOUS_YEAR_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__previous-year");
var CALENDAR_PREVIOUS_MONTH_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__previous-month");
var CALENDAR_NEXT_YEAR_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__next-year");
var CALENDAR_NEXT_MONTH_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__next-month");
var CALENDAR_MONTH_SELECTION_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__month-selection");
var CALENDAR_YEAR_SELECTION_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__year-selection");
var CALENDAR_MONTH_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__month");
var CALENDAR_MONTH_FOCUSED_CLASS = "".concat(CALENDAR_MONTH_CLASS, "--focused");
var CALENDAR_MONTH_SELECTED_CLASS = "".concat(CALENDAR_MONTH_CLASS, "--selected");
var CALENDAR_YEAR_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__year");
var CALENDAR_YEAR_FOCUSED_CLASS = "".concat(CALENDAR_YEAR_CLASS, "--focused");
var CALENDAR_YEAR_SELECTED_CLASS = "".concat(CALENDAR_YEAR_CLASS, "--selected");
var CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__previous-year-chunk");
var CALENDAR_NEXT_YEAR_CHUNK_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__next-year-chunk");
var CALENDAR_DATE_PICKER_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__date-picker");
var CALENDAR_MONTH_PICKER_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__month-picker");
var CALENDAR_YEAR_PICKER_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__year-picker");
var CALENDAR_TABLE_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__table");
var CALENDAR_ROW_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__row");
var CALENDAR_CELL_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__cell");
var CALENDAR_CELL_CENTER_ITEMS_CLASS = "".concat(CALENDAR_CELL_CLASS, "--center-items");
var CALENDAR_MONTH_LABEL_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__month-label");
var CALENDAR_DAY_OF_WEEK_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__day-of-week");
var DATE_PICKER = ".".concat(DATE_PICKER_CLASS);
var DATE_PICKER_BUTTON = ".".concat(DATE_PICKER_BUTTON_CLASS);
var DATE_PICKER_INTERNAL_INPUT = ".".concat(DATE_PICKER_INTERNAL_INPUT_CLASS);
var DATE_PICKER_EXTERNAL_INPUT = ".".concat(DATE_PICKER_EXTERNAL_INPUT_CLASS);
var DATE_PICKER_CALENDAR = ".".concat(DATE_PICKER_CALENDAR_CLASS);
var DATE_PICKER_STATUS = ".".concat(DATE_PICKER_STATUS_CLASS);
var DATE_PICKER_GUIDE = ".".concat(DATE_PICKER_GUIDE_CLASS);
var CALENDAR_DATE = ".".concat(CALENDAR_DATE_CLASS);
var CALENDAR_DATE_FOCUSED = ".".concat(CALENDAR_DATE_FOCUSED_CLASS);
var CALENDAR_DATE_CURRENT_MONTH = ".".concat(CALENDAR_DATE_CURRENT_MONTH_CLASS);
var CALENDAR_PREVIOUS_YEAR = ".".concat(CALENDAR_PREVIOUS_YEAR_CLASS);
var CALENDAR_PREVIOUS_MONTH = ".".concat(CALENDAR_PREVIOUS_MONTH_CLASS);
var CALENDAR_NEXT_YEAR = ".".concat(CALENDAR_NEXT_YEAR_CLASS);
var CALENDAR_NEXT_MONTH = ".".concat(CALENDAR_NEXT_MONTH_CLASS);
var CALENDAR_YEAR_SELECTION = ".".concat(CALENDAR_YEAR_SELECTION_CLASS);
var CALENDAR_MONTH_SELECTION = ".".concat(CALENDAR_MONTH_SELECTION_CLASS);
var CALENDAR_MONTH = ".".concat(CALENDAR_MONTH_CLASS);
var CALENDAR_YEAR = ".".concat(CALENDAR_YEAR_CLASS);
var CALENDAR_PREVIOUS_YEAR_CHUNK = ".".concat(CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS);
var CALENDAR_NEXT_YEAR_CHUNK = ".".concat(CALENDAR_NEXT_YEAR_CHUNK_CLASS);
var CALENDAR_DATE_PICKER = ".".concat(CALENDAR_DATE_PICKER_CLASS);
var CALENDAR_MONTH_PICKER = ".".concat(CALENDAR_MONTH_PICKER_CLASS);
var CALENDAR_YEAR_PICKER = ".".concat(CALENDAR_YEAR_PICKER_CLASS);
var CALENDAR_MONTH_FOCUSED = ".".concat(CALENDAR_MONTH_FOCUSED_CLASS);
var CALENDAR_YEAR_FOCUSED = ".".concat(CALENDAR_YEAR_FOCUSED_CLASS);
var text = {
  "open_calendar": "Åbn kalender",
  "choose_a_date": "Vælg en dato",
  "choose_a_date_between": "Vælg en dato mellem {minDay}. {minMonthStr} {minYear} og {maxDay}. {maxMonthStr} {maxYear}",
  "choose_a_date_before": "Vælg en dato. Der kan vælges indtil {maxDay}. {maxMonthStr} {maxYear}.",
  "choose_a_date_after": "Vælg en dato. Der kan vælges fra {minDay}. {minMonthStr} {minYear} og fremad.",
  "aria_label_date": "{dayStr} den {day}. {monthStr} {year}",
  "current_month_displayed": "Viser {monthLabel} {focusedYear}",
  "first_possible_date": "Første valgbare dato",
  "last_possible_date": "Sidste valgbare dato",
  "previous_year": "Navigér ét år tilbage",
  "previous_month": "Navigér én måned tilbage",
  "next_month": "Navigér én måned frem",
  "next_year": "Navigér ét år frem",
  "select_month": "Vælg måned",
  "select_year": "Vælg år",
  "previous_years": "Navigér {years} år tilbage",
  "next_years": "Navigér {years} år frem",
  "guide": "Navigerer du med tastatur, kan du skifte dag med højre og venstre piletaster, uger med op og ned piletaster, måneder med page up og page down-tasterne og år med shift-tasten plus page up eller page down. Home og end-tasten navigerer til start eller slutning af en uge.",
  "months_displayed": "Vælg en måned",
  "years_displayed": "Viser år {start} til {end}. Vælg et år.",
  "january": "januar",
  "february": "februar",
  "march": "marts",
  "april": "april",
  "may": "maj",
  "june": "juni",
  "july": "juli",
  "august": "august",
  "september": "september",
  "october": "oktober",
  "november": "november",
  "december": "december",
  "monday": "mandag",
  "tuesday": "tirsdag",
  "wednesday": "onsdag",
  "thursday": "torsdag",
  "friday": "fredag",
  "saturday": "lørdag",
  "sunday": "søndag"
};
var VALIDATION_MESSAGE = "Indtast venligst en gyldig dato";
var MONTH_LABELS = [text.january, text.february, text.march, text.april, text.may, text.june, text.july, text.august, text.september, text.october, text.november, text.december];
var DAY_OF_WEEK_LABELS = [text.monday, text.tuesday, text.wednesday, text.thursday, text.friday, text.saturday, text.sunday];
var ENTER_KEYCODE = 13;
var YEAR_CHUNK = 12;
var DEFAULT_MIN_DATE = "0000-01-01";
var DATE_FORMAT_OPTION_1 = "DD/MM/YYYY";
var DATE_FORMAT_OPTION_2 = "DD-MM-YYYY";
var DATE_FORMAT_OPTION_3 = "DD.MM.YYYY";
var DATE_FORMAT_OPTION_4 = "DD MM YYYY";
var DATE_FORMAT_OPTION_5 = "DD/MM-YYYY";
var INTERNAL_DATE_FORMAT = "YYYY-MM-DD";
var NOT_DISABLED_SELECTOR = ":not([disabled])";
var processFocusableSelectors = function processFocusableSelectors() {
  for (var _len = arguments.length, selectors = new Array(_len), _key = 0; _key < _len; _key++) {
    selectors[_key] = arguments[_key];
  }
  return selectors.map(function (query) {
    return query + NOT_DISABLED_SELECTOR;
  }).join(", ");
};
var DATE_PICKER_FOCUSABLE = processFocusableSelectors(CALENDAR_PREVIOUS_YEAR, CALENDAR_PREVIOUS_MONTH, CALENDAR_YEAR_SELECTION, CALENDAR_MONTH_SELECTION, CALENDAR_NEXT_YEAR, CALENDAR_NEXT_MONTH, CALENDAR_DATE_FOCUSED);
var MONTH_PICKER_FOCUSABLE = processFocusableSelectors(CALENDAR_MONTH_FOCUSED);
var YEAR_PICKER_FOCUSABLE = processFocusableSelectors(CALENDAR_PREVIOUS_YEAR_CHUNK, CALENDAR_NEXT_YEAR_CHUNK, CALENDAR_YEAR_FOCUSED);

// #region Date Manipulation Functions

/**
 * Keep date within month. Month would only be over by 1 to 3 days
 *
 * @param {Date} dateToCheck the date object to check
 * @param {number} month the correct month
 * @returns {Date} the date, corrected if needed
 */
var keepDateWithinMonth = function keepDateWithinMonth(dateToCheck, month) {
  if (month !== dateToCheck.getMonth()) {
    dateToCheck.setDate(0);
  }
  return dateToCheck;
};

/**
 * Set date from month day year
 *
 * @param {number} year the year to set
 * @param {number} month the month to set (zero-indexed)
 * @param {number} date the date to set
 * @returns {Date} the set date
 */
var setDate = function setDate(year, month, date) {
  var newDate = new Date(0);
  newDate.setFullYear(year, month, date);
  return newDate;
};

/**
 * todays date
 *
 * @returns {Date} todays date
 */
var today = function today() {
  var newDate = new Date();
  var day = newDate.getDate();
  var month = newDate.getMonth();
  var year = newDate.getFullYear();
  return setDate(year, month, day);
};

/**
 * Set date to first day of the month
 *
 * @param {number} date the date to adjust
 * @returns {Date} the adjusted date
 */
var startOfMonth = function startOfMonth(date) {
  var newDate = new Date(0);
  newDate.setFullYear(date.getFullYear(), date.getMonth(), 1);
  return newDate;
};

/**
 * Set date to last day of the month
 *
 * @param {number} date the date to adjust
 * @returns {Date} the adjusted date
 */
var lastDayOfMonth = function lastDayOfMonth(date) {
  var newDate = new Date(0);
  newDate.setFullYear(date.getFullYear(), date.getMonth() + 1, 0);
  return newDate;
};

/**
 * Add days to date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numDays the difference in days
 * @returns {Date} the adjusted date
 */
var addDays = function addDays(_date, numDays) {
  var newDate = new Date(_date.getTime());
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
};

/**
 * Subtract days from date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numDays the difference in days
 * @returns {Date} the adjusted date
 */
var subDays = function subDays(_date, numDays) {
  return addDays(_date, -numDays);
};

/**
 * Add weeks to date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numWeeks the difference in weeks
 * @returns {Date} the adjusted date
 */
var addWeeks = function addWeeks(_date, numWeeks) {
  return addDays(_date, numWeeks * 7);
};

/**
 * Subtract weeks from date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numWeeks the difference in weeks
 * @returns {Date} the adjusted date
 */
var subWeeks = function subWeeks(_date, numWeeks) {
  return addWeeks(_date, -numWeeks);
};

/**
 * Set date to the start of the week (Monday)
 *
 * @param {Date} _date the date to adjust
 * @returns {Date} the adjusted date
 */
var startOfWeek = function startOfWeek(_date) {
  var dayOfWeek = _date.getDay() - 1;
  if (dayOfWeek === -1) {
    dayOfWeek = 6;
  }
  return subDays(_date, dayOfWeek);
};

/**
 * Set date to the end of the week (Sunday)
 *
 * @param {Date} _date the date to adjust
 * @param {number} numWeeks the difference in weeks
 * @returns {Date} the adjusted date
 */
var endOfWeek = function endOfWeek(_date) {
  var dayOfWeek = _date.getDay();
  return addDays(_date, 7 - dayOfWeek);
};

/**
 * Add months to date and keep date within month
 *
 * @param {Date} _date the date to adjust
 * @param {number} numMonths the difference in months
 * @returns {Date} the adjusted date
 */
var addMonths = function addMonths(_date, numMonths) {
  var newDate = new Date(_date.getTime());
  var dateMonth = (newDate.getMonth() + 12 + numMonths) % 12;
  newDate.setMonth(newDate.getMonth() + numMonths);
  keepDateWithinMonth(newDate, dateMonth);
  return newDate;
};

/**
 * Subtract months from date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numMonths the difference in months
 * @returns {Date} the adjusted date
 */
var subMonths = function subMonths(_date, numMonths) {
  return addMonths(_date, -numMonths);
};

/**
 * Add years to date and keep date within month
 *
 * @param {Date} _date the date to adjust
 * @param {number} numYears the difference in years
 * @returns {Date} the adjusted date
 */
var addYears = function addYears(_date, numYears) {
  return addMonths(_date, numYears * 12);
};

/**
 * Subtract years from date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numYears the difference in years
 * @returns {Date} the adjusted date
 */
var subYears = function subYears(_date, numYears) {
  return addYears(_date, -numYears);
};

/**
 * Set months of date
 *
 * @param {Date} _date the date to adjust
 * @param {number} month zero-indexed month to set
 * @returns {Date} the adjusted date
 */
var setMonth = function setMonth(_date, month) {
  var newDate = new Date(_date.getTime());
  newDate.setMonth(month);
  keepDateWithinMonth(newDate, month);
  return newDate;
};

/**
 * Set year of date
 *
 * @param {Date} _date the date to adjust
 * @param {number} year the year to set
 * @returns {Date} the adjusted date
 */
var setYear = function setYear(_date, year) {
  var newDate = new Date(_date.getTime());
  var month = newDate.getMonth();
  newDate.setFullYear(year);
  keepDateWithinMonth(newDate, month);
  return newDate;
};

/**
 * Return the earliest date
 *
 * @param {Date} dateA date to compare
 * @param {Date} dateB date to compare
 * @returns {Date} the earliest date
 */
var min = function min(dateA, dateB) {
  var newDate = dateA;
  if (dateB < dateA) {
    newDate = dateB;
  }
  return new Date(newDate.getTime());
};

/**
 * Return the latest date
 *
 * @param {Date} dateA date to compare
 * @param {Date} dateB date to compare
 * @returns {Date} the latest date
 */
var max = function max(dateA, dateB) {
  var newDate = dateA;
  if (dateB > dateA) {
    newDate = dateB;
  }
  return new Date(newDate.getTime());
};

/**
 * Check if dates are the in the same year
 *
 * @param {Date} dateA date to compare
 * @param {Date} dateB date to compare
 * @returns {boolean} are dates in the same year
 */
var isSameYear = function isSameYear(dateA, dateB) {
  return dateA && dateB && dateA.getFullYear() === dateB.getFullYear();
};

/**
 * Check if dates are the in the same month
 *
 * @param {Date} dateA date to compare
 * @param {Date} dateB date to compare
 * @returns {boolean} are dates in the same month
 */
var isSameMonth = function isSameMonth(dateA, dateB) {
  return isSameYear(dateA, dateB) && dateA.getMonth() === dateB.getMonth();
};

/**
 * Check if dates are the same date
 *
 * @param {Date} dateA the date to compare
 * @param {Date} dateB the date to compare
 * @returns {boolean} are dates the same date
 */
var isSameDay = function isSameDay(dateA, dateB) {
  return isSameMonth(dateA, dateB) && dateA.getDate() === dateB.getDate();
};

/**
 * return a new date within minimum and maximum date
 *
 * @param {Date} date date to check
 * @param {Date} minDate minimum date to allow
 * @param {Date} maxDate maximum date to allow
 * @returns {Date} the date between min and max
 */
var keepDateBetweenMinAndMax = function keepDateBetweenMinAndMax(date, minDate, maxDate) {
  var newDate = date;
  if (date < minDate) {
    newDate = minDate;
  } else if (maxDate && date > maxDate) {
    newDate = maxDate;
  }
  return new Date(newDate.getTime());
};

/**
 * Check if dates is valid.
 *
 * @param {Date} date date to check
 * @param {Date} minDate minimum date to allow
 * @param {Date} maxDate maximum date to allow
 * @return {boolean} is there a day within the month within min and max dates
 */
var isDateWithinMinAndMax = function isDateWithinMinAndMax(date, minDate, maxDate) {
  return date >= minDate && (!maxDate || date <= maxDate);
};

/**
 * Check if dates month is invalid.
 *
 * @param {Date} date date to check
 * @param {Date} minDate minimum date to allow
 * @param {Date} maxDate maximum date to allow
 * @return {boolean} is the month outside min or max dates
 */
var isDatesMonthOutsideMinOrMax = function isDatesMonthOutsideMinOrMax(date, minDate, maxDate) {
  return lastDayOfMonth(date) < minDate || maxDate && startOfMonth(date) > maxDate;
};

/**
 * Check if dates year is invalid.
 *
 * @param {Date} date date to check
 * @param {Date} minDate minimum date to allow
 * @param {Date} maxDate maximum date to allow
 * @return {boolean} is the month outside min or max dates
 */
var isDatesYearOutsideMinOrMax = function isDatesYearOutsideMinOrMax(date, minDate, maxDate) {
  return lastDayOfMonth(setMonth(date, 11)) < minDate || maxDate && startOfMonth(setMonth(date, 0)) > maxDate;
};

/**
 * Parse a date with format D-M-YY
 *
 * @param {string} dateString the date string to parse
 * @param {string} dateFormat the format of the date string
 * @param {boolean} adjustDate should the date be adjusted
 * @returns {Date} the parsed date
 */
var parseDateString = function parseDateString(dateString) {
  var dateFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : INTERNAL_DATE_FORMAT;
  var adjustDate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var date;
  var month;
  var day;
  var year;
  var parsed;
  if (dateString) {
    var monthStr, dayStr, yearStr;
    if (dateFormat === DATE_FORMAT_OPTION_1 || dateFormat === DATE_FORMAT_OPTION_2 || dateFormat === DATE_FORMAT_OPTION_3 || dateFormat === DATE_FORMAT_OPTION_4 || dateFormat === DATE_FORMAT_OPTION_5) {
      var _dateString$split = dateString.split(/-|\.|\/|\s/);
      var _dateString$split2 = _slicedToArray(_dateString$split, 3);
      dayStr = _dateString$split2[0];
      monthStr = _dateString$split2[1];
      yearStr = _dateString$split2[2];
    } else {
      var _dateString$split3 = dateString.split("-");
      var _dateString$split4 = _slicedToArray(_dateString$split3, 3);
      yearStr = _dateString$split4[0];
      monthStr = _dateString$split4[1];
      dayStr = _dateString$split4[2];
    }
    if (yearStr) {
      parsed = parseInt(yearStr, 10);
      if (!Number.isNaN(parsed)) {
        year = parsed;
        if (adjustDate) {
          year = Math.max(0, year);
          if (yearStr.length < 3) {
            var currentYear = today().getFullYear();
            var currentYearStub = currentYear - currentYear % Math.pow(10, yearStr.length);
            year = currentYearStub + parsed;
          }
        }
      }
    }
    if (monthStr) {
      parsed = parseInt(monthStr, 10);
      if (!Number.isNaN(parsed)) {
        month = parsed;
        if (adjustDate) {
          month = Math.max(1, month);
          month = Math.min(12, month);
        }
      }
    }
    if (month && dayStr && year != null) {
      parsed = parseInt(dayStr, 10);
      if (!Number.isNaN(parsed)) {
        day = parsed;
        if (adjustDate) {
          var lastDayOfTheMonth = setDate(year, month, 0).getDate();
          day = Math.max(1, day);
          day = Math.min(lastDayOfTheMonth, day);
        }
      }
    }
    if (month && day && year != null) {
      date = setDate(year, month - 1, day);
    }
  }
  return date;
};

/**
 * Format a date to format DD-MM-YYYY
 *
 * @param {Date} date the date to format
 * @param {string} dateFormat the format of the date string
 * @returns {string} the formatted date string
 */
var formatDate = function formatDate(date) {
  var dateFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : INTERNAL_DATE_FORMAT;
  var padZeros = function padZeros(value, length) {
    return "0000".concat(value).slice(-length);
  };
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var year = date.getFullYear();
  if (dateFormat === DATE_FORMAT_OPTION_1) {
    return [padZeros(day, 2), padZeros(month, 2), padZeros(year, 4)].join("/");
  } else if (dateFormat === DATE_FORMAT_OPTION_2) {
    return [padZeros(day, 2), padZeros(month, 2), padZeros(year, 4)].join("-");
  } else if (dateFormat === DATE_FORMAT_OPTION_3) {
    return [padZeros(day, 2), padZeros(month, 2), padZeros(year, 4)].join(".");
  } else if (dateFormat === DATE_FORMAT_OPTION_4) {
    return [padZeros(day, 2), padZeros(month, 2), padZeros(year, 4)].join(" ");
  } else if (dateFormat === DATE_FORMAT_OPTION_5) {
    var tempDayMonth = [padZeros(day, 2), padZeros(month, 2)].join("/");
    return [tempDayMonth, padZeros(year, 4)].join("-");
  }
  return [padZeros(year, 4), padZeros(month, 2), padZeros(day, 2)].join("-");
};

// #endregion Date Manipulation Functions

/**
 * Create a grid string from an array of html strings
 *
 * @param {string[]} htmlArray the array of html items
 * @param {number} rowSize the length of a row
 * @returns {string} the grid string
 */
var listToGridHtml = function listToGridHtml(htmlArray, rowSize) {
  var grid = [];
  var row = [];
  var i = 0;
  while (i < htmlArray.length) {
    row = [];
    while (i < htmlArray.length && row.length < rowSize) {
      row.push("<td>".concat(htmlArray[i], "</td>"));
      i += 1;
    }
    grid.push("<tr>".concat(row.join(""), "</tr>"));
  }
  return grid.join("");
};

/**
 * set the value of the element and dispatch a change event
 *
 * @param {HTMLInputElement} el The element to update
 * @param {string} value The new value of the element
 */
var changeElementValue = function changeElementValue(el) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var elementToChange = el;
  elementToChange.value = value;
  var event = new Event('change');
  elementToChange.dispatchEvent(event);
};

/**
 * The properties and elements within the date picker.
 * @typedef {Object} DatePickerContext
 * @property {HTMLDivElement} calendarEl
 * @property {HTMLElement} datePickerEl
 * @property {HTMLDivElement} dialogEl
 * @property {HTMLInputElement} internalInputEl
 * @property {HTMLInputElement} externalInputEl
 * @property {HTMLDivElement} statusEl
 * @property {HTMLDivElement} guideEl
 * @property {HTMLDivElement} firstYearChunkEl
 * @property {Date} calendarDate
 * @property {Date} minDate
 * @property {Date} maxDate
 * @property {Date} selectedDate
 * @property {Date} rangeDate
 * @property {Date} defaultDate
 */

/**
 * Get an object of the properties and elements belonging directly to the given
 * date picker component.
 *
 * @param {HTMLElement} el the element within the date picker
 * @returns {DatePickerContext} elements
 */
var getDatePickerContext = function getDatePickerContext(el) {
  var datePickerEl = el.closest(DATE_PICKER);
  if (!datePickerEl) {
    throw new Error("Element is missing outer ".concat(DATE_PICKER));
  }
  var internalInputEl = datePickerEl.querySelector(DATE_PICKER_INTERNAL_INPUT);
  var externalInputEl = datePickerEl.querySelector(DATE_PICKER_EXTERNAL_INPUT);
  var calendarEl = datePickerEl.querySelector(DATE_PICKER_CALENDAR);
  var toggleBtnEl = datePickerEl.querySelector(DATE_PICKER_BUTTON);
  var statusEl = datePickerEl.querySelector(DATE_PICKER_STATUS);
  var guideEl = datePickerEl.querySelector(DATE_PICKER_GUIDE);
  var firstYearChunkEl = datePickerEl.querySelector(CALENDAR_YEAR);
  var dialogEl = datePickerEl.querySelector(DATE_PICKER_DIALOG_WRAPPER);

  // Set date format
  var selectedDateFormat = DATE_FORMAT_OPTION_1;
  if (datePickerEl.hasAttribute("data-dateformat")) {
    switch (datePickerEl.dataset.dateformat) {
      case DATE_FORMAT_OPTION_1:
        selectedDateFormat = DATE_FORMAT_OPTION_1;
        break;
      case DATE_FORMAT_OPTION_2:
        selectedDateFormat = DATE_FORMAT_OPTION_2;
        break;
      case DATE_FORMAT_OPTION_3:
        selectedDateFormat = DATE_FORMAT_OPTION_3;
        break;
      case DATE_FORMAT_OPTION_4:
        selectedDateFormat = DATE_FORMAT_OPTION_4;
        break;
      case DATE_FORMAT_OPTION_5:
        selectedDateFormat = DATE_FORMAT_OPTION_5;
    }
  }
  var dateFormatOption = selectedDateFormat;
  var inputDate = parseDateString(externalInputEl.value, dateFormatOption, true);
  var selectedDate = parseDateString(internalInputEl.value);
  var calendarDate = parseDateString(calendarEl.dataset.value);
  var minDate = parseDateString(datePickerEl.dataset.minDate);
  var maxDate = parseDateString(datePickerEl.dataset.maxDate);
  var rangeDate = parseDateString(datePickerEl.dataset.rangeDate);
  var defaultDate = parseDateString(datePickerEl.dataset.defaultDate);
  if (minDate && maxDate && minDate > maxDate) {
    throw new Error("Minimum date cannot be after maximum date");
  }
  return {
    calendarDate: calendarDate,
    minDate: minDate,
    toggleBtnEl: toggleBtnEl,
    dialogEl: dialogEl,
    selectedDate: selectedDate,
    maxDate: maxDate,
    firstYearChunkEl: firstYearChunkEl,
    datePickerEl: datePickerEl,
    inputDate: inputDate,
    internalInputEl: internalInputEl,
    externalInputEl: externalInputEl,
    calendarEl: calendarEl,
    rangeDate: rangeDate,
    defaultDate: defaultDate,
    statusEl: statusEl,
    guideEl: guideEl,
    dateFormatOption: dateFormatOption
  };
};

/**
 * Disable the date picker component
 *
 * @param {HTMLElement} el An element within the date picker component
 */
var disable = function disable(el) {
  var _getDatePickerContext = getDatePickerContext(el),
    externalInputEl = _getDatePickerContext.externalInputEl,
    toggleBtnEl = _getDatePickerContext.toggleBtnEl;
  toggleBtnEl.disabled = true;
  externalInputEl.disabled = true;
};

/**
 * Enable the date picker component
 *
 * @param {HTMLElement} el An element within the date picker component
 */
var enable = function enable(el) {
  var _getDatePickerContext2 = getDatePickerContext(el),
    externalInputEl = _getDatePickerContext2.externalInputEl,
    toggleBtnEl = _getDatePickerContext2.toggleBtnEl;
  toggleBtnEl.disabled = false;
  externalInputEl.disabled = false;
};

// #region Validation

/**
 * Validate the value in the input as a valid date of format D/M/YYYY
 *
 * @param {HTMLElement} el An element within the date picker component
 */
var isDateInputInvalid = function isDateInputInvalid(el) {
  var _getDatePickerContext3 = getDatePickerContext(el),
    externalInputEl = _getDatePickerContext3.externalInputEl,
    minDate = _getDatePickerContext3.minDate,
    maxDate = _getDatePickerContext3.maxDate;
  var dateString = externalInputEl.value;
  var isInvalid = false;
  if (dateString) {
    isInvalid = true;
    var dateStringParts = dateString.split(/-|\.|\/|\s/);
    var _dateStringParts$map = dateStringParts.map(function (str) {
        var value;
        var parsed = parseInt(str, 10);
        if (!Number.isNaN(parsed)) value = parsed;
        return value;
      }),
      _dateStringParts$map2 = _slicedToArray(_dateStringParts$map, 3),
      day = _dateStringParts$map2[0],
      month = _dateStringParts$map2[1],
      year = _dateStringParts$map2[2];
    if (month && day && year != null) {
      var checkDate = setDate(year, month - 1, day);
      if (checkDate.getMonth() === month - 1 && checkDate.getDate() === day && checkDate.getFullYear() === year && dateStringParts[2].length === 4 && isDateWithinMinAndMax(checkDate, minDate, maxDate)) {
        isInvalid = false;
      }
    }
  }
  return isInvalid;
};

/**
 * Validate the value in the input as a valid date of format M/D/YYYY
 *
 * @param {HTMLElement} el An element within the date picker component
 */
var validateDateInput = function validateDateInput(el) {
  var _getDatePickerContext4 = getDatePickerContext(el),
    externalInputEl = _getDatePickerContext4.externalInputEl;
  var isInvalid = isDateInputInvalid(externalInputEl);
  if (isInvalid && !externalInputEl.validationMessage) {
    externalInputEl.setCustomValidity(VALIDATION_MESSAGE);
  }
  if (!isInvalid && externalInputEl.validationMessage === VALIDATION_MESSAGE) {
    externalInputEl.setCustomValidity("");
  }
};

// #endregion Validation

/**
 * Enable the date picker component
 *
 * @param {HTMLElement} el An element within the date picker component
 */
var reconcileInputValues = function reconcileInputValues(el) {
  var _getDatePickerContext5 = getDatePickerContext(el),
    internalInputEl = _getDatePickerContext5.internalInputEl,
    inputDate = _getDatePickerContext5.inputDate;
  var newValue = "";
  if (inputDate && !isDateInputInvalid(el)) {
    newValue = formatDate(inputDate);
  }
  if (internalInputEl.value !== newValue) {
    changeElementValue(internalInputEl, newValue);
  }
};

/**
 * Select the value of the date picker inputs.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 * @param {string} dateString The date string to update in YYYY-MM-DD format
 */
var setCalendarValue = function setCalendarValue(el, dateString) {
  var parsedDate = parseDateString(dateString);
  if (parsedDate) {
    var _getDatePickerContext6 = getDatePickerContext(el),
      datePickerEl = _getDatePickerContext6.datePickerEl,
      internalInputEl = _getDatePickerContext6.internalInputEl,
      externalInputEl = _getDatePickerContext6.externalInputEl,
      dateFormatOption = _getDatePickerContext6.dateFormatOption;
    var formattedDate = formatDate(parsedDate, dateFormatOption);
    changeElementValue(internalInputEl, dateString);
    changeElementValue(externalInputEl, formattedDate);
    validateDateInput(datePickerEl);
  }
};

/**
 * Enhance an input with the date picker elements
 *
 * @param {HTMLElement} el The initial wrapping element of the date picker component
 */
var enhanceDatePicker = function enhanceDatePicker(el) {
  var datePickerEl = el.closest(DATE_PICKER);
  var defaultValue = datePickerEl.dataset.defaultValue;
  var internalInputEl = datePickerEl.querySelector("input");
  if (!internalInputEl) {
    throw new Error("".concat(DATE_PICKER, " is missing inner input"));
  }
  var minDate = parseDateString(datePickerEl.dataset.minDate || internalInputEl.getAttribute("min"));
  datePickerEl.dataset.minDate = minDate ? formatDate(minDate) : DEFAULT_MIN_DATE;
  var maxDate = parseDateString(datePickerEl.dataset.maxDate || internalInputEl.getAttribute("max"));
  if (maxDate) {
    datePickerEl.dataset.maxDate = formatDate(maxDate);
  }
  var calendarWrapper = document.createElement("div");
  calendarWrapper.classList.add(DATE_PICKER_WRAPPER_CLASS);
  calendarWrapper.tabIndex = "-1";
  var externalInputEl = internalInputEl.cloneNode();
  externalInputEl.classList.add(DATE_PICKER_EXTERNAL_INPUT_CLASS);
  externalInputEl.type = "text";
  externalInputEl.name = "";
  var dialogTitle = text.choose_a_date;
  var hasMinDate = minDate !== undefined && minDate !== "";
  var isDefaultMinDate = minDate !== undefined && minDate !== "" && parseDateString(DEFAULT_MIN_DATE).getTime() === minDate.getTime();
  var hasMaxDate = maxDate !== undefined && maxDate !== "";
  if (hasMinDate && !isDefaultMinDate && hasMaxDate) {
    var minDay = minDate.getDate();
    var minMonth = minDate.getMonth();
    var minMonthStr = MONTH_LABELS[minMonth];
    var minYear = minDate.getFullYear();
    var maxDay = maxDate.getDate();
    var maxMonth = maxDate.getMonth();
    var maxMonthStr = MONTH_LABELS[maxMonth];
    var maxYear = maxDate.getFullYear();
    dialogTitle = text.choose_a_date_between.replace(/{minDay}/, minDay).replace(/{minMonthStr}/, minMonthStr).replace(/{minYear}/, minYear).replace(/{maxDay}/, maxDay).replace(/{maxMonthStr}/, maxMonthStr).replace(/{maxYear}/, maxYear);
  } else if (hasMinDate && !isDefaultMinDate && !hasMaxDate) {
    var _minDay = minDate.getDate();
    var _minMonth = minDate.getMonth();
    var _minMonthStr = MONTH_LABELS[_minMonth];
    var _minYear = minDate.getFullYear();
    dialogTitle = text.choose_a_date_after.replace(/{minDay}/, _minDay).replace(/{minMonthStr}/, _minMonthStr).replace(/{minYear}/, _minYear);
  } else if (hasMaxDate) {
    var _maxDay = maxDate.getDate();
    var _maxMonth = maxDate.getMonth();
    var _maxMonthStr = MONTH_LABELS[_maxMonth];
    var _maxYear = maxDate.getFullYear();
    dialogTitle = text.choose_a_date_before.replace(/{maxDay}/, _maxDay).replace(/{maxMonthStr}/, _maxMonthStr).replace(/{maxYear}/, _maxYear);
  }
  var guideID = externalInputEl.getAttribute("id") + "-guide";
  calendarWrapper.appendChild(externalInputEl);
  calendarWrapper.insertAdjacentHTML("beforeend", ["<button type=\"button\" class=\"".concat(DATE_PICKER_BUTTON_CLASS, "\" aria-haspopup=\"true\" aria-label=\"").concat(text.open_calendar, "\">&nbsp;</button>"), "<div class=\"".concat(DIALOG_WRAPPER_CLASS, "\" role=\"dialog\" aria-modal=\"true\" aria-label=\"").concat(dialogTitle, "\" aria-describedby=\"").concat(guideID, "\" hidden><div role=\"application\"><div class=\"").concat(DATE_PICKER_CALENDAR_CLASS, "\" hidden></div></div></div>"), "<div class=\"sr-only ".concat(DATE_PICKER_STATUS_CLASS, "\" role=\"status\" aria-live=\"polite\"></div>"), "<div class=\"sr-only ".concat(DATE_PICKER_GUIDE_CLASS, "\" id=\"").concat(guideID, "\" hidden>").concat(text.guide, "</div>")].join(""));
  internalInputEl.setAttribute("aria-hidden", "true");
  internalInputEl.setAttribute("tabindex", "-1");
  internalInputEl.classList.add("sr-only", DATE_PICKER_INTERNAL_INPUT_CLASS);
  internalInputEl.removeAttribute('id');
  internalInputEl.required = false;
  datePickerEl.appendChild(calendarWrapper);
  datePickerEl.classList.add(DATE_PICKER_INITIALIZED_CLASS);
  if (defaultValue) {
    setCalendarValue(datePickerEl, defaultValue);
  }
  if (internalInputEl.disabled) {
    disable(datePickerEl);
    internalInputEl.disabled = false;
  }
  if (externalInputEl.value) {
    validateDateInput(externalInputEl);
  }
};

// #region Calendar - Date Selection View

/**
 * render the calendar.
 *
 * @param {HTMLElement} el An element within the date picker component
 * @param {Date} _dateToDisplay a date to render on the calendar
 * @returns {HTMLElement} a reference to the new calendar element
 */
var renderCalendar = function renderCalendar(el, _dateToDisplay) {
  var _getDatePickerContext7 = getDatePickerContext(el),
    datePickerEl = _getDatePickerContext7.datePickerEl,
    calendarEl = _getDatePickerContext7.calendarEl,
    statusEl = _getDatePickerContext7.statusEl,
    selectedDate = _getDatePickerContext7.selectedDate,
    maxDate = _getDatePickerContext7.maxDate,
    minDate = _getDatePickerContext7.minDate,
    rangeDate = _getDatePickerContext7.rangeDate,
    dialogEl = _getDatePickerContext7.dialogEl,
    guideEl = _getDatePickerContext7.guideEl;
  var todaysDate = today();
  var dateToDisplay = _dateToDisplay || todaysDate;
  var calendarWasHidden = calendarEl.hidden;
  var focusedDate = addDays(dateToDisplay, 0);
  var focusedMonth = dateToDisplay.getMonth();
  var focusedYear = dateToDisplay.getFullYear();
  var prevMonth = subMonths(dateToDisplay, 1);
  var nextMonth = addMonths(dateToDisplay, 1);
  var currentFormattedDate = formatDate(dateToDisplay);
  var firstOfMonth = startOfMonth(dateToDisplay);
  var prevButtonsDisabled = isSameMonth(dateToDisplay, minDate);
  var nextButtonsDisabled = isSameMonth(dateToDisplay, maxDate);
  var rangeConclusionDate = selectedDate || dateToDisplay;
  var rangeStartDate = rangeDate && min(rangeConclusionDate, rangeDate);
  var rangeEndDate = rangeDate && max(rangeConclusionDate, rangeDate);
  var withinRangeStartDate = rangeDate && addDays(rangeStartDate, 1);
  var withinRangeEndDate = rangeDate && subDays(rangeEndDate, 1);
  var monthLabel = MONTH_LABELS[focusedMonth];
  var generateDateHtml = function generateDateHtml(dateToRender) {
    var classes = [CALENDAR_DATE_CLASS];
    var day = dateToRender.getDate();
    var month = dateToRender.getMonth();
    var year = dateToRender.getFullYear();
    var dayOfWeek = dateToRender.getDay() - 1;
    if (dayOfWeek === -1) {
      dayOfWeek = 6;
    }
    var formattedDate = formatDate(dateToRender);
    var tabindex = "-1";
    var isDisabled = !isDateWithinMinAndMax(dateToRender, minDate, maxDate);
    var isSelected = isSameDay(dateToRender, selectedDate);
    if (isSameMonth(dateToRender, prevMonth)) {
      classes.push(CALENDAR_DATE_PREVIOUS_MONTH_CLASS);
    }
    if (isSameMonth(dateToRender, focusedDate)) {
      classes.push(CALENDAR_DATE_CURRENT_MONTH_CLASS);
    }
    if (isSameMonth(dateToRender, nextMonth)) {
      classes.push(CALENDAR_DATE_NEXT_MONTH_CLASS);
    }
    if (isSelected) {
      classes.push(CALENDAR_DATE_SELECTED_CLASS);
    }
    if (isSameDay(dateToRender, todaysDate)) {
      classes.push(CALENDAR_DATE_TODAY_CLASS);
    }
    if (rangeDate) {
      if (isSameDay(dateToRender, rangeDate)) {
        classes.push(CALENDAR_DATE_RANGE_DATE_CLASS);
      }
      if (isSameDay(dateToRender, rangeStartDate)) {
        classes.push(CALENDAR_DATE_RANGE_DATE_START_CLASS);
      }
      if (isSameDay(dateToRender, rangeEndDate)) {
        classes.push(CALENDAR_DATE_RANGE_DATE_END_CLASS);
      }
      if (isDateWithinMinAndMax(dateToRender, withinRangeStartDate, withinRangeEndDate)) {
        classes.push(CALENDAR_DATE_WITHIN_RANGE_CLASS);
      }
    }
    if (isSameDay(dateToRender, focusedDate)) {
      tabindex = "0";
      classes.push(CALENDAR_DATE_FOCUSED_CLASS);
    }
    var monthStr = MONTH_LABELS[month];
    var dayStr = DAY_OF_WEEK_LABELS[dayOfWeek];
    var ariaLabelDate = text.aria_label_date.replace(/{dayStr}/, dayStr).replace(/{day}/, day).replace(/{monthStr}/, monthStr).replace(/{year}/, year);
    return "<button\n      type=\"button\"\n      tabindex=\"".concat(tabindex, "\"\n      class=\"").concat(classes.join(" "), "\" \n      data-day=\"").concat(day, "\" \n      data-month=\"").concat(month + 1, "\" \n      data-year=\"").concat(year, "\" \n      data-value=\"").concat(formattedDate, "\"\n      aria-label=\"").concat(ariaLabelDate, "\"\n      aria-current=\"").concat(isSelected ? "date" : "false", "\"\n      ").concat(isDisabled ? "disabled=\"disabled\"" : "", "\n    >").concat(day, "</button>");
  };
  // set date to first rendered day
  dateToDisplay = startOfWeek(firstOfMonth);
  var days = [];
  while (days.length < 28 || dateToDisplay.getMonth() === focusedMonth || days.length % 7 !== 0) {
    days.push(generateDateHtml(dateToDisplay));
    dateToDisplay = addDays(dateToDisplay, 1);
  }
  var datesHtml = listToGridHtml(days, 7);
  var newCalendar = calendarEl.cloneNode();
  newCalendar.dataset.value = currentFormattedDate;
  newCalendar.style.top = "".concat(datePickerEl.offsetHeight, "px");
  newCalendar.hidden = false;
  var content = "<div tabindex=\"-1\" class=\"".concat(CALENDAR_DATE_PICKER_CLASS, "\">\n      <div class=\"").concat(CALENDAR_ROW_CLASS, "\">\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_PREVIOUS_YEAR_CLASS, "\"\n            aria-label=\"").concat(text.previous_year, "\"\n            ").concat(prevButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_PREVIOUS_MONTH_CLASS, "\"\n            aria-label=\"").concat(text.previous_month, "\"\n            ").concat(prevButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_MONTH_LABEL_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_MONTH_SELECTION_CLASS, "\" aria-label=\"").concat(monthLabel, ". ").concat(text.select_month, ".\"\n          >").concat(monthLabel, "</button>\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_YEAR_SELECTION_CLASS, "\" aria-label=\"").concat(focusedYear, ". ").concat(text.select_year, ".\"\n          >").concat(focusedYear, "</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_NEXT_MONTH_CLASS, "\"\n            aria-label=\"").concat(text.next_month, "\"\n            ").concat(nextButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_NEXT_YEAR_CLASS, "\"\n            aria-label=\"").concat(text.next_year, "\"\n            ").concat(nextButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n      </div>\n      <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n        <thead>\n          <tr>");
  for (var d in DAY_OF_WEEK_LABELS) {
    content += "<th class=\"".concat(CALENDAR_DAY_OF_WEEK_CLASS, "\" scope=\"col\" aria-label=\"").concat(DAY_OF_WEEK_LABELS[d], "\">").concat(DAY_OF_WEEK_LABELS[d].charAt(0), "</th>");
  }
  content += "</tr>\n        </thead>\n        <tbody>\n          ".concat(datesHtml, "\n        </tbody>\n      </table>\n    </div>");
  newCalendar.innerHTML = content;
  calendarEl.parentNode.replaceChild(newCalendar, calendarEl);
  datePickerEl.classList.add(DATE_PICKER_ACTIVE_CLASS);
  if (dialogEl.hidden === true) {
    dialogEl.hidden = false;
    if (guideEl.hidden) {
      guideEl.hidden = false;
    }
  }
  var statuses = [];
  if (calendarWasHidden) {
    statusEl.textContent = "";
  } else if (_dateToDisplay.getTime() === minDate.getTime()) {
    statuses.push(text.first_possible_date);
  } else if (maxDate !== undefined && maxDate !== "" && _dateToDisplay.getTime() === maxDate.getTime()) {
    statuses.push(text.last_possible_date);
  } else {
    statuses.push(text.current_month_displayed.replace(/{monthLabel}/, monthLabel).replace(/{focusedYear}/, focusedYear));
  }
  statusEl.textContent = statuses.join(". ");
  return newCalendar;
};

/**
 * Navigate back one year and display the calendar.
 *
 * @param {HTMLButtonElement} _buttonEl An element within the date picker component
 */
var displayPreviousYear = function displayPreviousYear(_buttonEl) {
  if (_buttonEl.disabled) return;
  var _getDatePickerContext8 = getDatePickerContext(_buttonEl),
    calendarEl = _getDatePickerContext8.calendarEl,
    calendarDate = _getDatePickerContext8.calendarDate,
    minDate = _getDatePickerContext8.minDate,
    maxDate = _getDatePickerContext8.maxDate;
  var date = subYears(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  var nextToFocus = newCalendar.querySelector(CALENDAR_PREVIOUS_YEAR);
  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_DATE_PICKER);
  }
  nextToFocus.focus();
};

/**
 * Navigate back one month and display the calendar.
 *
 * @param {HTMLButtonElement} _buttonEl An element within the date picker component
 */
var displayPreviousMonth = function displayPreviousMonth(_buttonEl) {
  if (_buttonEl.disabled) return;
  var _getDatePickerContext9 = getDatePickerContext(_buttonEl),
    calendarEl = _getDatePickerContext9.calendarEl,
    calendarDate = _getDatePickerContext9.calendarDate,
    minDate = _getDatePickerContext9.minDate,
    maxDate = _getDatePickerContext9.maxDate;
  var date = subMonths(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  var nextToFocus = newCalendar.querySelector(CALENDAR_PREVIOUS_MONTH);
  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_DATE_PICKER);
  }
  nextToFocus.focus();
};

/**
 * Navigate forward one month and display the calendar.
 *
 * @param {HTMLButtonElement} _buttonEl An element within the date picker component
 */
var displayNextMonth = function displayNextMonth(_buttonEl) {
  if (_buttonEl.disabled) return;
  var _getDatePickerContext10 = getDatePickerContext(_buttonEl),
    calendarEl = _getDatePickerContext10.calendarEl,
    calendarDate = _getDatePickerContext10.calendarDate,
    minDate = _getDatePickerContext10.minDate,
    maxDate = _getDatePickerContext10.maxDate;
  var date = addMonths(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  var nextToFocus = newCalendar.querySelector(CALENDAR_NEXT_MONTH);
  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_DATE_PICKER);
  }
  nextToFocus.focus();
};

/**
 * Navigate forward one year and display the calendar.
 *
 * @param {HTMLButtonElement} _buttonEl An element within the date picker component
 */
var displayNextYear = function displayNextYear(_buttonEl) {
  if (_buttonEl.disabled) return;
  var _getDatePickerContext11 = getDatePickerContext(_buttonEl),
    calendarEl = _getDatePickerContext11.calendarEl,
    calendarDate = _getDatePickerContext11.calendarDate,
    minDate = _getDatePickerContext11.minDate,
    maxDate = _getDatePickerContext11.maxDate;
  var date = addYears(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  var nextToFocus = newCalendar.querySelector(CALENDAR_NEXT_YEAR);
  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_DATE_PICKER);
  }
  nextToFocus.focus();
};

/**
 * Hide the calendar of a date picker component.
 *
 * @param {HTMLElement} el An element within the date picker component
 */
var hideCalendar = function hideCalendar(el) {
  var _getDatePickerContext12 = getDatePickerContext(el),
    datePickerEl = _getDatePickerContext12.datePickerEl,
    calendarEl = _getDatePickerContext12.calendarEl,
    statusEl = _getDatePickerContext12.statusEl;
  datePickerEl.classList.remove(DATE_PICKER_ACTIVE_CLASS);
  calendarEl.hidden = true;
  statusEl.textContent = "";
};

/**
 * Select a date within the date picker component.
 *
 * @param {HTMLButtonElement} calendarDateEl A date element within the date picker component
 */
var selectDate = function selectDate(calendarDateEl) {
  if (calendarDateEl.disabled) return;
  var _getDatePickerContext13 = getDatePickerContext(calendarDateEl),
    datePickerEl = _getDatePickerContext13.datePickerEl,
    externalInputEl = _getDatePickerContext13.externalInputEl,
    dialogEl = _getDatePickerContext13.dialogEl,
    guideEl = _getDatePickerContext13.guideEl;
  setCalendarValue(calendarDateEl, calendarDateEl.dataset.value);
  hideCalendar(datePickerEl);
  dialogEl.hidden = true;
  guideEl.hidden = true;
  externalInputEl.focus();
};

/**
 * Toggle the calendar.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 */
var toggleCalendar = function toggleCalendar(el) {
  if (el.disabled) return;
  var _getDatePickerContext14 = getDatePickerContext(el),
    dialogEl = _getDatePickerContext14.dialogEl,
    calendarEl = _getDatePickerContext14.calendarEl,
    inputDate = _getDatePickerContext14.inputDate,
    minDate = _getDatePickerContext14.minDate,
    maxDate = _getDatePickerContext14.maxDate,
    defaultDate = _getDatePickerContext14.defaultDate,
    guideEl = _getDatePickerContext14.guideEl;
  if (calendarEl.hidden) {
    var dateToDisplay = keepDateBetweenMinAndMax(inputDate || defaultDate || today(), minDate, maxDate);
    var newCalendar = renderCalendar(calendarEl, dateToDisplay);
    newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
  } else {
    hideCalendar(el);
    dialogEl.hidden = true;
    guideEl.hidden = true;
  }
};

/**
 * Update the calendar when visible.
 *
 * @param {HTMLElement} el an element within the date picker
 */
var updateCalendarIfVisible = function updateCalendarIfVisible(el) {
  var _getDatePickerContext15 = getDatePickerContext(el),
    calendarEl = _getDatePickerContext15.calendarEl,
    inputDate = _getDatePickerContext15.inputDate,
    minDate = _getDatePickerContext15.minDate,
    maxDate = _getDatePickerContext15.maxDate;
  var calendarShown = !calendarEl.hidden;
  if (calendarShown && inputDate) {
    var dateToDisplay = keepDateBetweenMinAndMax(inputDate, minDate, maxDate);
    renderCalendar(calendarEl, dateToDisplay);
  }
};

// #endregion Calendar - Date Selection View

// #region Calendar - Month Selection View
/**
 * Display the month selection screen in the date picker.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 * @returns {HTMLElement} a reference to the new calendar element
 */
var displayMonthSelection = function displayMonthSelection(el, monthToDisplay) {
  var _getDatePickerContext16 = getDatePickerContext(el),
    calendarEl = _getDatePickerContext16.calendarEl,
    statusEl = _getDatePickerContext16.statusEl,
    calendarDate = _getDatePickerContext16.calendarDate,
    minDate = _getDatePickerContext16.minDate,
    maxDate = _getDatePickerContext16.maxDate;
  var selectedMonth = calendarDate.getMonth();
  var focusedMonth = monthToDisplay == null ? selectedMonth : monthToDisplay;
  var months = MONTH_LABELS.map(function (month, index) {
    var monthToCheck = setMonth(calendarDate, index);
    var isDisabled = isDatesMonthOutsideMinOrMax(monthToCheck, minDate, maxDate);
    var tabindex = "-1";
    var classes = [CALENDAR_MONTH_CLASS];
    var isSelected = index === selectedMonth;
    if (index === focusedMonth) {
      tabindex = "0";
      classes.push(CALENDAR_MONTH_FOCUSED_CLASS);
    }
    if (isSelected) {
      classes.push(CALENDAR_MONTH_SELECTED_CLASS);
    }
    return "<button \n        type=\"button\"\n        tabindex=\"".concat(tabindex, "\"\n        class=\"").concat(classes.join(" "), "\" \n        data-value=\"").concat(index, "\"\n        data-label=\"").concat(month, "\"\n        aria-current=\"").concat(isSelected ? "true" : "false", "\"\n        ").concat(isDisabled ? "disabled=\"disabled\"" : "", "\n      >").concat(month, "</button>");
  });
  var monthsHtml = "<div tabindex=\"-1\" class=\"".concat(CALENDAR_MONTH_PICKER_CLASS, "\">\n    <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n      <tbody>\n        ").concat(listToGridHtml(months, 3), "\n      </tbody>\n    </table>\n  </div>");
  var newCalendar = calendarEl.cloneNode();
  newCalendar.innerHTML = monthsHtml;
  calendarEl.parentNode.replaceChild(newCalendar, calendarEl);
  statusEl.textContent = text.months_displayed;
  return newCalendar;
};

/**
 * Select a month in the date picker component.
 *
 * @param {HTMLButtonElement} monthEl An month element within the date picker component
 */
var selectMonth = function selectMonth(monthEl) {
  if (monthEl.disabled) return;
  var _getDatePickerContext17 = getDatePickerContext(monthEl),
    calendarEl = _getDatePickerContext17.calendarEl,
    calendarDate = _getDatePickerContext17.calendarDate,
    minDate = _getDatePickerContext17.minDate,
    maxDate = _getDatePickerContext17.maxDate;
  var selectedMonth = parseInt(monthEl.dataset.value, 10);
  var date = setMonth(calendarDate, selectedMonth);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
};

// #endregion Calendar - Month Selection View

// #region Calendar - Year Selection View

/**
 * Display the year selection screen in the date picker.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 * @param {number} yearToDisplay year to display in year selection
 * @returns {HTMLElement} a reference to the new calendar element
 */
var displayYearSelection = function displayYearSelection(el, yearToDisplay) {
  var _getDatePickerContext18 = getDatePickerContext(el),
    calendarEl = _getDatePickerContext18.calendarEl,
    statusEl = _getDatePickerContext18.statusEl,
    calendarDate = _getDatePickerContext18.calendarDate,
    minDate = _getDatePickerContext18.minDate,
    maxDate = _getDatePickerContext18.maxDate;
  var selectedYear = calendarDate.getFullYear();
  var focusedYear = yearToDisplay == null ? selectedYear : yearToDisplay;
  var yearToChunk = focusedYear;
  yearToChunk -= yearToChunk % YEAR_CHUNK;
  yearToChunk = Math.max(0, yearToChunk);
  var prevYearChunkDisabled = isDatesYearOutsideMinOrMax(setYear(calendarDate, yearToChunk - 1), minDate, maxDate);
  var nextYearChunkDisabled = isDatesYearOutsideMinOrMax(setYear(calendarDate, yearToChunk + YEAR_CHUNK), minDate, maxDate);
  var years = [];
  var yearIndex = yearToChunk;
  while (years.length < YEAR_CHUNK) {
    var isDisabled = isDatesYearOutsideMinOrMax(setYear(calendarDate, yearIndex), minDate, maxDate);
    var tabindex = "-1";
    var classes = [CALENDAR_YEAR_CLASS];
    var isSelected = yearIndex === selectedYear;
    if (yearIndex === focusedYear) {
      tabindex = "0";
      classes.push(CALENDAR_YEAR_FOCUSED_CLASS);
    }
    if (isSelected) {
      classes.push(CALENDAR_YEAR_SELECTED_CLASS);
    }
    years.push("<button \n        type=\"button\"\n        tabindex=\"".concat(tabindex, "\"\n        class=\"").concat(classes.join(" "), "\" \n        data-value=\"").concat(yearIndex, "\"\n        aria-current=\"").concat(isSelected ? "true" : "false", "\"\n        ").concat(isDisabled ? "disabled=\"disabled\"" : "", "\n      >").concat(yearIndex, "</button>"));
    yearIndex += 1;
  }
  var yearsHtml = listToGridHtml(years, 3);
  var ariaLabelPreviousYears = text.previous_years.replace(/{years}/, YEAR_CHUNK);
  var ariaLabelNextYears = text.next_years.replace(/{years}/, YEAR_CHUNK);
  var announceYears = text.years_displayed.replace(/{start}/, yearToChunk).replace(/{end}/, yearToChunk + YEAR_CHUNK - 1);
  var newCalendar = calendarEl.cloneNode();
  newCalendar.innerHTML = "<div tabindex=\"-1\" class=\"".concat(CALENDAR_YEAR_PICKER_CLASS, "\">\n    <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n        <tbody>\n          <tr>\n            <td>\n              <button\n                type=\"button\"\n                class=\"").concat(CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS, "\" \n                aria-label=\"").concat(ariaLabelPreviousYears, "\"\n                ").concat(prevYearChunkDisabled ? "disabled=\"disabled\"" : "", "\n              >&nbsp;</button>\n            </td>\n            <td colspan=\"3\">\n              <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n                <tbody>\n                  ").concat(yearsHtml, "\n                </tbody>\n              </table>\n            </td>\n            <td>\n              <button\n                type=\"button\"\n                class=\"").concat(CALENDAR_NEXT_YEAR_CHUNK_CLASS, "\" \n                aria-label=\"").concat(ariaLabelNextYears, "\"\n                ").concat(nextYearChunkDisabled ? "disabled=\"disabled\"" : "", "\n              >&nbsp;</button>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n    </div>");
  calendarEl.parentNode.replaceChild(newCalendar, calendarEl);
  statusEl.textContent = announceYears;
  return newCalendar;
};

/**
 * Navigate back by years and display the year selection screen.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 */
var displayPreviousYearChunk = function displayPreviousYearChunk(el) {
  if (el.disabled) return;
  var _getDatePickerContext19 = getDatePickerContext(el),
    calendarEl = _getDatePickerContext19.calendarEl,
    calendarDate = _getDatePickerContext19.calendarDate,
    minDate = _getDatePickerContext19.minDate,
    maxDate = _getDatePickerContext19.maxDate;
  var yearEl = calendarEl.querySelector(CALENDAR_YEAR_FOCUSED);
  var selectedYear = parseInt(yearEl.textContent, 10);
  var adjustedYear = selectedYear - YEAR_CHUNK;
  adjustedYear = Math.max(0, adjustedYear);
  var date = setYear(calendarDate, adjustedYear);
  var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = displayYearSelection(calendarEl, cappedDate.getFullYear());
  var nextToFocus = newCalendar.querySelector(CALENDAR_PREVIOUS_YEAR_CHUNK);
  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_YEAR_PICKER);
  }
  nextToFocus.focus();
};

/**
 * Navigate forward by years and display the year selection screen.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 */
var displayNextYearChunk = function displayNextYearChunk(el) {
  if (el.disabled) return;
  var _getDatePickerContext20 = getDatePickerContext(el),
    calendarEl = _getDatePickerContext20.calendarEl,
    calendarDate = _getDatePickerContext20.calendarDate,
    minDate = _getDatePickerContext20.minDate,
    maxDate = _getDatePickerContext20.maxDate;
  var yearEl = calendarEl.querySelector(CALENDAR_YEAR_FOCUSED);
  var selectedYear = parseInt(yearEl.textContent, 10);
  var adjustedYear = selectedYear + YEAR_CHUNK;
  adjustedYear = Math.max(0, adjustedYear);
  var date = setYear(calendarDate, adjustedYear);
  var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = displayYearSelection(calendarEl, cappedDate.getFullYear());
  var nextToFocus = newCalendar.querySelector(CALENDAR_NEXT_YEAR_CHUNK);
  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_YEAR_PICKER);
  }
  nextToFocus.focus();
};

/**
 * Select a year in the date picker component.
 *
 * @param {HTMLButtonElement} yearEl A year element within the date picker component
 */
var selectYear = function selectYear(yearEl) {
  if (yearEl.disabled) return;
  var _getDatePickerContext21 = getDatePickerContext(yearEl),
    calendarEl = _getDatePickerContext21.calendarEl,
    calendarDate = _getDatePickerContext21.calendarDate,
    minDate = _getDatePickerContext21.minDate,
    maxDate = _getDatePickerContext21.maxDate;
  var selectedYear = parseInt(yearEl.innerHTML, 10);
  var date = setYear(calendarDate, selectedYear);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
};

// #endregion Calendar - Year Selection View

// #region Calendar Event Handling

/**
 * Hide the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleEscapeFromCalendar = function handleEscapeFromCalendar(event) {
  var _getDatePickerContext22 = getDatePickerContext(event.target),
    datePickerEl = _getDatePickerContext22.datePickerEl,
    externalInputEl = _getDatePickerContext22.externalInputEl,
    dialogEl = _getDatePickerContext22.dialogEl,
    guideEl = _getDatePickerContext22.guideEl;
  hideCalendar(datePickerEl);
  dialogEl.hidden = true;
  guideEl.hidden = true;
  externalInputEl.focus();
  event.preventDefault();
};

// #endregion Calendar Event Handling

// #region Calendar Date Event Handling

/**
 * Adjust the date and display the calendar if needed.
 *
 * @param {function} adjustDateFn function that returns the adjusted date
 */
var adjustCalendar = function adjustCalendar(adjustDateFn) {
  return function (event) {
    var _getDatePickerContext23 = getDatePickerContext(event.target),
      calendarEl = _getDatePickerContext23.calendarEl,
      calendarDate = _getDatePickerContext23.calendarDate,
      minDate = _getDatePickerContext23.minDate,
      maxDate = _getDatePickerContext23.maxDate;
    var date = adjustDateFn(calendarDate);
    var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);
    if (!isSameDay(calendarDate, cappedDate)) {
      var newCalendar = renderCalendar(calendarEl, cappedDate);
      newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
    }
    event.preventDefault();
  };
};

/**
 * Navigate back one week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleUpFromDate = adjustCalendar(function (date) {
  return subWeeks(date, 1);
});

/**
 * Navigate forward one week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleDownFromDate = adjustCalendar(function (date) {
  return addWeeks(date, 1);
});

/**
 * Navigate back one day and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleLeftFromDate = adjustCalendar(function (date) {
  return subDays(date, 1);
});

/**
 * Navigate forward one day and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleRightFromDate = adjustCalendar(function (date) {
  return addDays(date, 1);
});

/**
 * Navigate to the start of the week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleHomeFromDate = adjustCalendar(function (date) {
  return startOfWeek(date);
});

/**
 * Navigate to the end of the week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleEndFromDate = adjustCalendar(function (date) {
  return endOfWeek(date);
});

/**
 * Navigate forward one month and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handlePageDownFromDate = adjustCalendar(function (date) {
  return addMonths(date, 1);
});

/**
 * Navigate back one month and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handlePageUpFromDate = adjustCalendar(function (date) {
  return subMonths(date, 1);
});

/**
 * Navigate forward one year and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleShiftPageDownFromDate = adjustCalendar(function (date) {
  return addYears(date, 1);
});

/**
 * Navigate back one year and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleShiftPageUpFromDate = adjustCalendar(function (date) {
  return subYears(date, 1);
});

/**
 * display the calendar for the mousemove date.
 *
 * @param {MouseEvent} event The mousemove event
 * @param {HTMLButtonElement} dateEl A date element within the date picker component
 */
var handleMousemoveFromDate = function handleMousemoveFromDate(dateEl) {
  if (dateEl.disabled) return;
  var calendarEl = dateEl.closest(DATE_PICKER_CALENDAR);
  var currentCalendarDate = calendarEl.dataset.value;
  var hoverDate = dateEl.dataset.value;
  if (hoverDate === currentCalendarDate) return;
  var dateToDisplay = parseDateString(hoverDate);
  var newCalendar = renderCalendar(calendarEl, dateToDisplay);
  newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
};

// #endregion Calendar Date Event Handling

// #region Calendar Month Event Handling

/**
 * Adjust the month and display the month selection screen if needed.
 *
 * @param {function} adjustMonthFn function that returns the adjusted month
 */
var adjustMonthSelectionScreen = function adjustMonthSelectionScreen(adjustMonthFn) {
  return function (event) {
    var monthEl = event.target;
    var selectedMonth = parseInt(monthEl.dataset.value, 10);
    var _getDatePickerContext24 = getDatePickerContext(monthEl),
      calendarEl = _getDatePickerContext24.calendarEl,
      calendarDate = _getDatePickerContext24.calendarDate,
      minDate = _getDatePickerContext24.minDate,
      maxDate = _getDatePickerContext24.maxDate;
    var currentDate = setMonth(calendarDate, selectedMonth);
    var adjustedMonth = adjustMonthFn(selectedMonth);
    adjustedMonth = Math.max(0, Math.min(11, adjustedMonth));
    var date = setMonth(calendarDate, adjustedMonth);
    var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);
    if (!isSameMonth(currentDate, cappedDate)) {
      var newCalendar = displayMonthSelection(calendarEl, cappedDate.getMonth());
      newCalendar.querySelector(CALENDAR_MONTH_FOCUSED).focus();
    }
    event.preventDefault();
  };
};

/**
 * Navigate back three months and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleUpFromMonth = adjustMonthSelectionScreen(function (month) {
  return month - 3;
});

/**
 * Navigate forward three months and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleDownFromMonth = adjustMonthSelectionScreen(function (month) {
  return month + 3;
});

/**
 * Navigate back one month and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleLeftFromMonth = adjustMonthSelectionScreen(function (month) {
  return month - 1;
});

/**
 * Navigate forward one month and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleRightFromMonth = adjustMonthSelectionScreen(function (month) {
  return month + 1;
});

/**
 * Navigate to the start of the row of months and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleHomeFromMonth = adjustMonthSelectionScreen(function (month) {
  return month - month % 3;
});

/**
 * Navigate to the end of the row of months and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleEndFromMonth = adjustMonthSelectionScreen(function (month) {
  return month + 2 - month % 3;
});

/**
 * Navigate to the last month (December) and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handlePageDownFromMonth = adjustMonthSelectionScreen(function () {
  return 11;
});

/**
 * Navigate to the first month (January) and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handlePageUpFromMonth = adjustMonthSelectionScreen(function () {
  return 0;
});

/**
 * update the focus on a month when the mouse moves.
 *
 * @param {MouseEvent} event The mousemove event
 * @param {HTMLButtonElement} monthEl A month element within the date picker component
 */
var handleMousemoveFromMonth = function handleMousemoveFromMonth(monthEl) {
  if (monthEl.disabled) return;
  if (monthEl.classList.contains(CALENDAR_MONTH_FOCUSED_CLASS)) return;
  var focusMonth = parseInt(monthEl.dataset.value, 10);
  var newCalendar = displayMonthSelection(monthEl, focusMonth);
  newCalendar.querySelector(CALENDAR_MONTH_FOCUSED).focus();
};

// #endregion Calendar Month Event Handling

// #region Calendar Year Event Handling

/**
 * Adjust the year and display the year selection screen if needed.
 *
 * @param {function} adjustYearFn function that returns the adjusted year
 */
var adjustYearSelectionScreen = function adjustYearSelectionScreen(adjustYearFn) {
  return function (event) {
    var yearEl = event.target;
    var selectedYear = parseInt(yearEl.dataset.value, 10);
    var _getDatePickerContext25 = getDatePickerContext(yearEl),
      calendarEl = _getDatePickerContext25.calendarEl,
      calendarDate = _getDatePickerContext25.calendarDate,
      minDate = _getDatePickerContext25.minDate,
      maxDate = _getDatePickerContext25.maxDate;
    var currentDate = setYear(calendarDate, selectedYear);
    var adjustedYear = adjustYearFn(selectedYear);
    adjustedYear = Math.max(0, adjustedYear);
    var date = setYear(calendarDate, adjustedYear);
    var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);
    if (!isSameYear(currentDate, cappedDate)) {
      var newCalendar = displayYearSelection(calendarEl, cappedDate.getFullYear());
      newCalendar.querySelector(CALENDAR_YEAR_FOCUSED).focus();
    }
    event.preventDefault();
  };
};

/**
 * Navigate back three years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleUpFromYear = adjustYearSelectionScreen(function (year) {
  return year - 3;
});

/**
 * Navigate forward three years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleDownFromYear = adjustYearSelectionScreen(function (year) {
  return year + 3;
});

/**
 * Navigate back one year and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleLeftFromYear = adjustYearSelectionScreen(function (year) {
  return year - 1;
});

/**
 * Navigate forward one year and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleRightFromYear = adjustYearSelectionScreen(function (year) {
  return year + 1;
});

/**
 * Navigate to the start of the row of years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleHomeFromYear = adjustYearSelectionScreen(function (year) {
  return year - year % 3;
});

/**
 * Navigate to the end of the row of years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleEndFromYear = adjustYearSelectionScreen(function (year) {
  return year + 2 - year % 3;
});

/**
 * Navigate to back 12 years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handlePageUpFromYear = adjustYearSelectionScreen(function (year) {
  return year - YEAR_CHUNK;
});

/**
 * Navigate forward 12 years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handlePageDownFromYear = adjustYearSelectionScreen(function (year) {
  return year + YEAR_CHUNK;
});

/**
 * update the focus on a year when the mouse moves.
 *
 * @param {MouseEvent} event The mousemove event
 * @param {HTMLButtonElement} dateEl A year element within the date picker component
 */
var handleMousemoveFromYear = function handleMousemoveFromYear(yearEl) {
  if (yearEl.disabled) return;
  if (yearEl.classList.contains(CALENDAR_YEAR_FOCUSED_CLASS)) return;
  var focusYear = parseInt(yearEl.dataset.value, 10);
  var newCalendar = displayYearSelection(yearEl, focusYear);
  newCalendar.querySelector(CALENDAR_YEAR_FOCUSED).focus();
};

// #endregion Calendar Year Event Handling

// #region Focus Handling Event Handling

var tabHandler = function tabHandler(focusable) {
  var getFocusableContext = function getFocusableContext(el) {
    var _getDatePickerContext26 = getDatePickerContext(el),
      calendarEl = _getDatePickerContext26.calendarEl;
    var focusableElements = select(focusable, calendarEl);
    var firstTabIndex = 0;
    var lastTabIndex = focusableElements.length - 1;
    var firstTabStop = focusableElements[firstTabIndex];
    var lastTabStop = focusableElements[lastTabIndex];
    var focusIndex = focusableElements.indexOf(activeElement());
    var isLastTab = focusIndex === lastTabIndex;
    var isFirstTab = focusIndex === firstTabIndex;
    var isNotFound = focusIndex === -1;
    return {
      focusableElements: focusableElements,
      isNotFound: isNotFound,
      firstTabStop: firstTabStop,
      isFirstTab: isFirstTab,
      lastTabStop: lastTabStop,
      isLastTab: isLastTab
    };
  };
  return {
    tabAhead: function tabAhead(event) {
      var _getFocusableContext = getFocusableContext(event.target),
        firstTabStop = _getFocusableContext.firstTabStop,
        isLastTab = _getFocusableContext.isLastTab,
        isNotFound = _getFocusableContext.isNotFound;
      if (isLastTab || isNotFound) {
        event.preventDefault();
        firstTabStop.focus();
      }
    },
    tabBack: function tabBack(event) {
      var _getFocusableContext2 = getFocusableContext(event.target),
        lastTabStop = _getFocusableContext2.lastTabStop,
        isFirstTab = _getFocusableContext2.isFirstTab,
        isNotFound = _getFocusableContext2.isNotFound;
      if (isFirstTab || isNotFound) {
        event.preventDefault();
        lastTabStop.focus();
      }
    }
  };
};
var datePickerTabEventHandler = tabHandler(DATE_PICKER_FOCUSABLE);
var monthPickerTabEventHandler = tabHandler(MONTH_PICKER_FOCUSABLE);
var yearPickerTabEventHandler = tabHandler(YEAR_PICKER_FOCUSABLE);

// #endregion Focus Handling Event Handling

// #region Date Picker Event Delegation Registration / Component

var datePickerEvents = (_datePickerEvents = {}, _defineProperty(_datePickerEvents, CLICK, (_CLICK = {}, _defineProperty(_CLICK, DATE_PICKER_BUTTON, function () {
  toggleCalendar(this);
}), _defineProperty(_CLICK, CALENDAR_DATE, function () {
  selectDate(this);
}), _defineProperty(_CLICK, CALENDAR_MONTH, function () {
  selectMonth(this);
}), _defineProperty(_CLICK, CALENDAR_YEAR, function () {
  selectYear(this);
}), _defineProperty(_CLICK, CALENDAR_PREVIOUS_MONTH, function () {
  displayPreviousMonth(this);
}), _defineProperty(_CLICK, CALENDAR_NEXT_MONTH, function () {
  displayNextMonth(this);
}), _defineProperty(_CLICK, CALENDAR_PREVIOUS_YEAR, function () {
  displayPreviousYear(this);
}), _defineProperty(_CLICK, CALENDAR_NEXT_YEAR, function () {
  displayNextYear(this);
}), _defineProperty(_CLICK, CALENDAR_PREVIOUS_YEAR_CHUNK, function () {
  displayPreviousYearChunk(this);
}), _defineProperty(_CLICK, CALENDAR_NEXT_YEAR_CHUNK, function () {
  displayNextYearChunk(this);
}), _defineProperty(_CLICK, CALENDAR_MONTH_SELECTION, function () {
  var newCalendar = displayMonthSelection(this);
  newCalendar.querySelector(CALENDAR_MONTH_FOCUSED).focus();
}), _defineProperty(_CLICK, CALENDAR_YEAR_SELECTION, function () {
  var newCalendar = displayYearSelection(this);
  newCalendar.querySelector(CALENDAR_YEAR_FOCUSED).focus();
}), _CLICK)), _defineProperty(_datePickerEvents, "keyup", _defineProperty({}, DATE_PICKER_CALENDAR, function (event) {
  var keydown = this.dataset.keydownKeyCode;
  if ("".concat(event.keyCode) !== keydown) {
    event.preventDefault();
  }
})), _defineProperty(_datePickerEvents, "keydown", (_keydown = {}, _defineProperty(_keydown, DATE_PICKER_EXTERNAL_INPUT, function (event) {
  if (event.keyCode === ENTER_KEYCODE) {
    validateDateInput(this);
  }
}), _defineProperty(_keydown, CALENDAR_DATE, (0, _receptor.keymap)({
  Up: handleUpFromDate,
  ArrowUp: handleUpFromDate,
  Down: handleDownFromDate,
  ArrowDown: handleDownFromDate,
  Left: handleLeftFromDate,
  ArrowLeft: handleLeftFromDate,
  Right: handleRightFromDate,
  ArrowRight: handleRightFromDate,
  Home: handleHomeFromDate,
  End: handleEndFromDate,
  PageDown: handlePageDownFromDate,
  PageUp: handlePageUpFromDate,
  "Shift+PageDown": handleShiftPageDownFromDate,
  "Shift+PageUp": handleShiftPageUpFromDate
})), _defineProperty(_keydown, CALENDAR_DATE_PICKER, (0, _receptor.keymap)({
  Tab: datePickerTabEventHandler.tabAhead,
  "Shift+Tab": datePickerTabEventHandler.tabBack
})), _defineProperty(_keydown, CALENDAR_MONTH, (0, _receptor.keymap)({
  Up: handleUpFromMonth,
  ArrowUp: handleUpFromMonth,
  Down: handleDownFromMonth,
  ArrowDown: handleDownFromMonth,
  Left: handleLeftFromMonth,
  ArrowLeft: handleLeftFromMonth,
  Right: handleRightFromMonth,
  ArrowRight: handleRightFromMonth,
  Home: handleHomeFromMonth,
  End: handleEndFromMonth,
  PageDown: handlePageDownFromMonth,
  PageUp: handlePageUpFromMonth
})), _defineProperty(_keydown, CALENDAR_MONTH_PICKER, (0, _receptor.keymap)({
  Tab: monthPickerTabEventHandler.tabAhead,
  "Shift+Tab": monthPickerTabEventHandler.tabBack
})), _defineProperty(_keydown, CALENDAR_YEAR, (0, _receptor.keymap)({
  Up: handleUpFromYear,
  ArrowUp: handleUpFromYear,
  Down: handleDownFromYear,
  ArrowDown: handleDownFromYear,
  Left: handleLeftFromYear,
  ArrowLeft: handleLeftFromYear,
  Right: handleRightFromYear,
  ArrowRight: handleRightFromYear,
  Home: handleHomeFromYear,
  End: handleEndFromYear,
  PageDown: handlePageDownFromYear,
  PageUp: handlePageUpFromYear
})), _defineProperty(_keydown, CALENDAR_YEAR_PICKER, (0, _receptor.keymap)({
  Tab: yearPickerTabEventHandler.tabAhead,
  "Shift+Tab": yearPickerTabEventHandler.tabBack
})), _defineProperty(_keydown, DATE_PICKER_CALENDAR, function (event) {
  this.dataset.keydownKeyCode = event.keyCode;
}), _defineProperty(_keydown, DATE_PICKER, function (event) {
  var keyMap = (0, _receptor.keymap)({
    Escape: handleEscapeFromCalendar
  });
  keyMap(event);
}), _keydown)), _defineProperty(_datePickerEvents, "focusout", (_focusout = {}, _defineProperty(_focusout, DATE_PICKER_EXTERNAL_INPUT, function () {
  validateDateInput(this);
}), _defineProperty(_focusout, DATE_PICKER, function (event) {
  if (!this.contains(event.relatedTarget)) {
    hideCalendar(this);
  }
}), _focusout)), _defineProperty(_datePickerEvents, "input", _defineProperty({}, DATE_PICKER_EXTERNAL_INPUT, function () {
  reconcileInputValues(this);
  updateCalendarIfVisible(this);
})), _datePickerEvents);
if (!isIosDevice()) {
  var _datePickerEvents$mou;
  datePickerEvents.mousemove = (_datePickerEvents$mou = {}, _defineProperty(_datePickerEvents$mou, CALENDAR_DATE_CURRENT_MONTH, function () {
    handleMousemoveFromDate(this);
  }), _defineProperty(_datePickerEvents$mou, CALENDAR_MONTH, function () {
    handleMousemoveFromMonth(this);
  }), _defineProperty(_datePickerEvents$mou, CALENDAR_YEAR, function () {
    handleMousemoveFromYear(this);
  }), _datePickerEvents$mou);
}
var datePicker = behavior(datePickerEvents, {
  init: function init(root) {
    select(DATE_PICKER, root).forEach(function (datePickerEl) {
      if (!datePickerEl.classList.contains(DATE_PICKER_INITIALIZED_CLASS)) {
        enhanceDatePicker(datePickerEl);
      }
    });
  },
  setLanguage: function setLanguage(strings) {
    text = strings;
    MONTH_LABELS = [text.january, text.february, text.march, text.april, text.may, text.june, text.july, text.august, text.september, text.october, text.november, text.december];
    DAY_OF_WEEK_LABELS = [text.monday, text.tuesday, text.wednesday, text.thursday, text.friday, text.saturday, text.sunday];
  },
  getDatePickerContext: getDatePickerContext,
  disable: disable,
  enable: enable,
  isDateInputInvalid: isDateInputInvalid,
  setCalendarValue: setCalendarValue,
  validateDateInput: validateDateInput,
  renderCalendar: renderCalendar,
  updateCalendarIfVisible: updateCalendarIfVisible
});

// #endregion Date Picker Event Delegation Registration / Component

module.exports = datePicker;

},{"../config":91,"../events":93,"../utils/active-element":100,"../utils/behavior":101,"../utils/is-ios-device":104,"../utils/select":105,"receptor":70}],78:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _dropdown = _interopRequireDefault(require("./dropdown"));
require("../polyfills/Function/prototype/bind");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Add functionality to sorting variant of Overflow menu component
 * @param {HTMLElement} container .overflow-menu element
 */
function DropdownSort(container) {
  this.container = container;
  this.button = container.getElementsByClassName('button-overflow-menu')[0];

  // if no value is selected, choose first option
  if (!this.container.querySelector('.overflow-list li button[aria-current="true"]')) {
    this.container.querySelectorAll('.overflow-list li button')[0].setAttribute('aria-current', "true");
  }
  this.updateSelectedValue();
}

/**
 * Add click events on overflow menu and options in menu
 */
DropdownSort.prototype.init = function () {
  this.overflowMenu = new _dropdown["default"](this.button).init();
  var sortingOptions = this.container.querySelectorAll('.overflow-list li button');
  for (var s = 0; s < sortingOptions.length; s++) {
    var option = sortingOptions[s];
    option.addEventListener('click', this.onOptionClick.bind(this));
  }
};

/**
 * Update button text to selected value
 */
DropdownSort.prototype.updateSelectedValue = function () {
  var selectedItem = this.container.querySelector('.overflow-list li button[aria-current="true"]');
  this.container.getElementsByClassName('button-overflow-menu')[0].getElementsByClassName('selected-value')[0].innerText = selectedItem.innerText;
};

/**
 * Triggers when choosing option in menu
 * @param {PointerEvent} e
 */
DropdownSort.prototype.onOptionClick = function (e) {
  var li = e.target.parentNode;
  li.parentNode.querySelector('li button[aria-current="true"]').removeAttribute('aria-current');
  li.querySelectorAll('.overflow-list li button')[0].setAttribute('aria-current', 'true');
  var button = li.parentNode.parentNode.parentNode.getElementsByClassName('button-overflow-menu')[0];
  var eventSelected = new Event('fds.dropdown.selected');
  eventSelected.detail = this.target;
  button.dispatchEvent(eventSelected);
  this.updateSelectedValue();

  // hide menu
  var overflowMenu = new _dropdown["default"](button);
  overflowMenu.hide();
};
var _default = DropdownSort;
exports["default"] = _default;

},{"../polyfills/Function/prototype/bind":94,"./dropdown":79}],79:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var breakpoints = require('../utils/breakpoints');
var BUTTON = '.button-overflow-menu';
var jsDropdownCollapseModifier = 'js-dropdown--responsive-collapse'; //option: make dropdown behave as the collapse component when on small screens (used by submenus in the header and step-dropdown).
var TARGET = 'data-js-target';

/**
 * Add functionality to overflow menu component
 * @param {HTMLButtonElement} buttonElement Overflow menu button
 */
function Dropdown(buttonElement) {
  this.buttonElement = buttonElement;
  this.targetEl = null;
  this.responsiveListCollapseEnabled = false;
  if (this.buttonElement === null || this.buttonElement === undefined) {
    throw new Error("Could not find button for overflow menu component.");
  }
  var targetAttr = this.buttonElement.getAttribute(TARGET);
  if (targetAttr === null || targetAttr === undefined) {
    throw new Error('Attribute could not be found on overflow menu component: ' + TARGET);
  }
  var targetEl = document.getElementById(targetAttr.replace('#', ''));
  if (targetEl === null || targetEl === undefined) {
    throw new Error('Panel for overflow menu component could not be found.');
  }
  this.targetEl = targetEl;
}

/**
 * Set click events
 */
Dropdown.prototype.init = function () {
  if (this.buttonElement !== null && this.buttonElement !== undefined && this.targetEl !== null && this.targetEl !== undefined) {
    if (this.buttonElement.parentNode.classList.contains('overflow-menu--md-no-responsive') || this.buttonElement.parentNode.classList.contains('overflow-menu--lg-no-responsive')) {
      this.responsiveListCollapseEnabled = true;
    }

    //Clicked outside dropdown -> close it
    document.getElementsByTagName('body')[0].removeEventListener('click', outsideClose);
    document.getElementsByTagName('body')[0].addEventListener('click', outsideClose);
    //Clicked on dropdown open button --> toggle it
    this.buttonElement.removeEventListener('click', toggleDropdown);
    this.buttonElement.addEventListener('click', toggleDropdown);
    var $module = this;
    // set aria-hidden correctly for screenreaders (Tringuide responsive)
    if (this.responsiveListCollapseEnabled) {
      var element = this.buttonElement;
      if (window.IntersectionObserver) {
        // trigger event when button changes visibility
        var observer = new IntersectionObserver(function (entries) {
          // button is visible
          if (entries[0].intersectionRatio) {
            if (element.getAttribute('aria-expanded') === 'false') {
              $module.targetEl.setAttribute('aria-hidden', 'true');
            }
          } else {
            // button is not visible
            if ($module.targetEl.getAttribute('aria-hidden') === 'true') {
              $module.targetEl.setAttribute('aria-hidden', 'false');
            }
          }
        }, {
          root: document.body
        });
        observer.observe(element);
      } else {
        // IE: IntersectionObserver is not supported, so we listen for window resize and grid breakpoint instead
        if (doResponsiveCollapse($module.triggerEl)) {
          // small screen
          if (element.getAttribute('aria-expanded') === 'false') {
            $module.targetEl.setAttribute('aria-hidden', 'true');
          } else {
            $module.targetEl.setAttribute('aria-hidden', 'false');
          }
        } else {
          // Large screen
          $module.targetEl.setAttribute('aria-hidden', 'false');
        }
        window.addEventListener('resize', function () {
          if (doResponsiveCollapse($module.triggerEl)) {
            if (element.getAttribute('aria-expanded') === 'false') {
              $module.targetEl.setAttribute('aria-hidden', 'true');
            } else {
              $module.targetEl.setAttribute('aria-hidden', 'false');
            }
          } else {
            $module.targetEl.setAttribute('aria-hidden', 'false');
          }
        });
      }
    }
    document.removeEventListener('keyup', closeOnEscape);
    document.addEventListener('keyup', closeOnEscape);
  }
};

/**
 * Hide overflow menu
 */
Dropdown.prototype.hide = function () {
  toggle(this.buttonElement);
};

/**
 * Show overflow menu
 */
Dropdown.prototype.show = function () {
  toggle(this.buttonElement);
};
var closeOnEscape = function closeOnEscape(event) {
  var key = event.which || event.keyCode;
  if (key === 27) {
    closeAll(event);
  }
};

/**
 * Get an Array of button elements belonging directly to the given
 * accordion element.
 * @param parent accordion element
 * @returns {NodeListOf<SVGElementTagNameMap[[string]]> | NodeListOf<HTMLElementTagNameMap[[string]]> | NodeListOf<Element>}
 */
var getButtons = function getButtons(parent) {
  return parent.querySelectorAll(BUTTON);
};

/**
 * Close all overflow menus
 * @param {event} event default is null
 */
var closeAll = function closeAll() {
  var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var changed = false;
  var body = document.querySelector('body');
  var overflowMenuEl = document.getElementsByClassName('overflow-menu');
  for (var oi = 0; oi < overflowMenuEl.length; oi++) {
    var currentOverflowMenuEL = overflowMenuEl[oi];
    var triggerEl = currentOverflowMenuEL.querySelector(BUTTON + '[aria-expanded="true"]');
    if (triggerEl !== null) {
      changed = true;
      var targetEl = currentOverflowMenuEL.querySelector('#' + triggerEl.getAttribute(TARGET).replace('#', ''));
      if (targetEl !== null && triggerEl !== null) {
        if (doResponsiveCollapse(triggerEl)) {
          if (triggerEl.getAttribute('aria-expanded') === true) {
            var eventClose = new Event('fds.dropdown.close');
            triggerEl.dispatchEvent(eventClose);
          }
          triggerEl.setAttribute('aria-expanded', 'false');
          targetEl.classList.add('collapsed');
          targetEl.setAttribute('aria-hidden', 'true');
        }
      }
    }
  }
  if (changed && event !== null) {
    event.stopImmediatePropagation();
  }
};
var offset = function offset(el) {
  var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft
  };
};
var toggleDropdown = function toggleDropdown(event) {
  var forceClose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  event.stopPropagation();
  event.preventDefault();
  toggle(this, forceClose);
};
var toggle = function toggle(button) {
  var forceClose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var triggerEl = button;
  var targetEl = null;
  if (triggerEl !== null && triggerEl !== undefined) {
    var targetAttr = triggerEl.getAttribute(TARGET);
    if (targetAttr !== null && targetAttr !== undefined) {
      targetEl = document.getElementById(targetAttr.replace('#', ''));
    }
  }
  if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
    //change state

    targetEl.style.left = null;
    targetEl.style.right = null;
    if (triggerEl.getAttribute('aria-expanded') === 'true' || forceClose) {
      //close
      triggerEl.setAttribute('aria-expanded', 'false');
      targetEl.classList.add('collapsed');
      targetEl.setAttribute('aria-hidden', 'true');
      var eventClose = new Event('fds.dropdown.close');
      triggerEl.dispatchEvent(eventClose);
    } else {
      if (!document.getElementsByTagName('body')[0].classList.contains('mobile_nav-active')) {
        closeAll();
      }
      //open
      triggerEl.setAttribute('aria-expanded', 'true');
      targetEl.classList.remove('collapsed');
      targetEl.setAttribute('aria-hidden', 'false');
      var eventOpen = new Event('fds.dropdown.open');
      triggerEl.dispatchEvent(eventOpen);
      var targetOffset = offset(targetEl);
      if (targetOffset.left < 0) {
        targetEl.style.left = '0px';
        targetEl.style.right = 'auto';
      }
      var right = targetOffset.left + targetEl.offsetWidth;
      if (right > window.innerWidth) {
        targetEl.style.left = 'auto';
        targetEl.style.right = '0px';
      }
      var offsetAgain = offset(targetEl);
      if (offsetAgain.left < 0) {
        targetEl.style.left = '0px';
        targetEl.style.right = 'auto';
      }
      right = offsetAgain.left + targetEl.offsetWidth;
      if (right > window.innerWidth) {
        targetEl.style.left = 'auto';
        targetEl.style.right = '0px';
      }
    }
  }
};
var hasParent = function hasParent(child, parentTagName) {
  if (child.parentNode.tagName === parentTagName) {
    return true;
  } else if (parentTagName !== 'BODY' && child.parentNode.tagName !== 'BODY') {
    return hasParent(child.parentNode, parentTagName);
  } else {
    return false;
  }
};
var outsideClose = function outsideClose(evt) {
  if (!document.getElementsByTagName('body')[0].classList.contains('mobile_nav-active')) {
    if (document.querySelector('body.mobile_nav-active') === null && !evt.target.classList.contains('button-menu-close')) {
      var openDropdowns = document.querySelectorAll(BUTTON + '[aria-expanded=true]');
      for (var i = 0; i < openDropdowns.length; i++) {
        var triggerEl = openDropdowns[i];
        var targetEl = null;
        var targetAttr = triggerEl.getAttribute(TARGET);
        if (targetAttr !== null && targetAttr !== undefined) {
          if (targetAttr.indexOf('#') !== -1) {
            targetAttr = targetAttr.replace('#', '');
          }
          targetEl = document.getElementById(targetAttr);
        }
        if (doResponsiveCollapse(triggerEl) || hasParent(triggerEl, 'HEADER') && !evt.target.classList.contains('overlay')) {
          //closes dropdown when clicked outside
          if (evt.target !== triggerEl) {
            //clicked outside trigger, force close
            triggerEl.setAttribute('aria-expanded', 'false');
            targetEl.classList.add('collapsed');
            targetEl.setAttribute('aria-hidden', 'true');
            var eventClose = new Event('fds.dropdown.close');
            triggerEl.dispatchEvent(eventClose);
          }
        }
      }
    }
  }
};
var doResponsiveCollapse = function doResponsiveCollapse(triggerEl) {
  if (!triggerEl.classList.contains(jsDropdownCollapseModifier)) {
    // not nav overflow menu
    if (triggerEl.parentNode.classList.contains('overflow-menu--md-no-responsive') || triggerEl.parentNode.classList.contains('overflow-menu--lg-no-responsive')) {
      // trinindikator overflow menu
      if (window.innerWidth <= getTringuideBreakpoint(triggerEl)) {
        // overflow menu på responsiv tringuide aktiveret
        return true;
      }
    } else {
      // normal overflow menu
      return true;
    }
  }
  return false;
};
var getTringuideBreakpoint = function getTringuideBreakpoint(button) {
  if (button.parentNode.classList.contains('overflow-menu--md-no-responsive')) {
    return breakpoints.md;
  }
  if (button.parentNode.classList.contains('overflow-menu--lg-no-responsive')) {
    return breakpoints.lg;
  }
};
var _default = Dropdown;
exports["default"] = _default;

},{"../utils/breakpoints":102}],80:[function(require,module,exports){
'use strict';

/**
 * Handle focus on input elements upon clicking link in error message
 * @param {HTMLElement} element Error summary element
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function ErrorSummary(element) {
  this.element = element;
}

/**
 * Set events on links in error summary
 */
ErrorSummary.prototype.init = function () {
  if (!this.element) {
    return;
  }
  this.element.focus();
  this.element.addEventListener('click', this.handleClick.bind(this));
};

/**
* Click event handler
*
* @param {MouseEvent} event - Click event
*/
ErrorSummary.prototype.handleClick = function (event) {
  var target = event.target;
  if (this.focusTarget(target)) {
    event.preventDefault();
  }
};

/**
 * Focus the target element
 *
 * By default, the browser will scroll the target into view. Because our labels
 * or legends appear above the input, this means the user will be presented with
 * an input without any context, as the label or legend will be off the top of
 * the screen.
 *
 * Manually handling the click event, scrolling the question into view and then
 * focussing the element solves this.
 *
 * This also results in the label and/or legend being announced correctly in
 * NVDA (as tested in 2018.3.2) - without this only the field type is announced
 * (e.g. "Edit, has autocomplete").
 *
 * @param {HTMLElement} $target - Event target
 * @returns {boolean} True if the target was able to be focussed
 */
ErrorSummary.prototype.focusTarget = function ($target) {
  // If the element that was clicked was not a link, return early
  if ($target.tagName !== 'A' || $target.href === false) {
    return false;
  }
  var inputId = this.getFragmentFromUrl($target.href);
  var $input = document.getElementById(inputId);
  if (!$input) {
    return false;
  }
  var $legendOrLabel = this.getAssociatedLegendOrLabel($input);
  if (!$legendOrLabel) {
    return false;
  }

  // Scroll the legend or label into view *before* calling focus on the input to
  // avoid extra scrolling in browsers that don't support `preventScroll` (which
  // at time of writing is most of them...)
  $legendOrLabel.scrollIntoView();
  $input.focus({
    preventScroll: true
  });
  return true;
};

/**
 * Get fragment from URL
 *
 * Extract the fragment (everything after the hash) from a URL, but not including
 * the hash.
 *
 * @param {string} url - URL
 * @returns {string} Fragment from URL, without the hash
 */
ErrorSummary.prototype.getFragmentFromUrl = function (url) {
  if (url.indexOf('#') === -1) {
    return false;
  }
  return url.split('#').pop();
};

/**
 * Get associated legend or label
 *
 * Returns the first element that exists from this list:
 *
 * - The `<legend>` associated with the closest `<fieldset>` ancestor, as long
 *   as the top of it is no more than half a viewport height away from the
 *   bottom of the input
 * - The first `<label>` that is associated with the input using for="inputId"
 * - The closest parent `<label>`
 *
 * @param {HTMLElement} $input - The input
 * @returns {HTMLElement} Associated legend or label, or null if no associated
 *                        legend or label can be found
 */
ErrorSummary.prototype.getAssociatedLegendOrLabel = function ($input) {
  var $fieldset = $input.closest('fieldset');
  if ($fieldset) {
    var legends = $fieldset.getElementsByTagName('legend');
    if (legends.length) {
      var $candidateLegend = legends[0];

      // If the input type is radio or checkbox, always use the legend if there
      // is one.
      if ($input.type === 'checkbox' || $input.type === 'radio') {
        return $candidateLegend;
      }

      // For other input types, only scroll to the fieldset’s legend (instead of
      // the label associated with the input) if the input would end up in the
      // top half of the screen.
      //
      // This should avoid situations where the input either ends up off the
      // screen, or obscured by a software keyboard.
      var legendTop = $candidateLegend.getBoundingClientRect().top;
      var inputRect = $input.getBoundingClientRect();

      // If the browser doesn't support Element.getBoundingClientRect().height
      // or window.innerHeight (like IE8), bail and just link to the label.
      if (inputRect.height && window.innerHeight) {
        var inputBottom = inputRect.top + inputRect.height;
        if (inputBottom - legendTop < window.innerHeight / 2) {
          return $candidateLegend;
        }
      }
    }
  }
  return document.querySelector("label[for='" + $input.getAttribute('id') + "']") || $input.closest('label');
};
var _default = ErrorSummary;
exports["default"] = _default;

},{}],81:[function(require,module,exports){
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }
function isVariantValid(variant) {
  var VARIANTS = ["info", "success", "warning", "error"];
  if (VARIANTS.includes(variant)) {
    return true;
  } else {
    return false;
  }
}
function isHeadingtypeValid(headingtype) {
  var HEADINGTYPES = ["h1", "h2", "h3", "h4", "h5", "h6", "strong"];
  if (HEADINGTYPES.includes(headingtype)) {
    return true;
  } else {
    return false;
  }
}
var _closeClickhandler = /*#__PURE__*/new WeakMap();
var FDSAlert = /*#__PURE__*/function (_HTMLElement) {
  _inherits(FDSAlert, _HTMLElement);
  var _super = _createSuper(FDSAlert);
  function FDSAlert() {
    var _this;
    _classCallCheck(this, FDSAlert);
    _this = _super.call(this);
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _closeClickhandler, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldSet(_assertThisInitialized(_this), _closeClickhandler, function () {
      _this.hide();
    });
    return _this;
  }
  _createClass(FDSAlert, [{
    key: "variant",
    get: function get() {
      if (this.hasAttribute('variant')) {
        return this.getAttribute('variant');
      } else {
        return "";
      }
    },
    set: function set(val) {
      if (isVariantValid(val)) {
        this.setAttribute('variant', val);
      } else {
        throw new Error("Invalid variant: '" + val + "'. Variant must be 'info', 'success', 'warning' or 'error'.");
      }
    }
  }, {
    key: "heading",
    get: function get() {
      if (this.hasAttribute('heading')) {
        return this.getAttribute('heading');
      } else {
        return "";
      }
    },
    set: function set(val) {
      this.setAttribute('heading', val);
    }
  }, {
    key: "headingtype",
    get: function get() {
      if (this.hasAttribute('headingtype')) {
        return this.getAttribute('headingtype');
      } else {
        return "";
      }
    },
    set: function set(val) {
      if (isHeadingtypeValid(val)) {
        this.setAttribute('headingtype', val);
      } else {
        throw new Error("Invalid heading type: '" + val + "'. Valid values are 'h1', 'h2, 'h3', 'h4', 'h5', 'h6' and 'strong'.");
      }
    }
  }, {
    key: "closeable",
    get: function get() {
      return this.hasAttribute('closeable');
    },
    set: function set(val) {
      if (val) {
        this.setAttribute('closeable', '');
      }
    }
  }, {
    key: "hide",
    value: function hide() {
      this.setAttribute("hidden", '');
      var eventHide = new Event('fdsalerthide');
      this.dispatchEvent(eventHide);
    }
  }, {
    key: "show",
    value: function show() {
      // To do
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      /* Create the base for the alert */
      var constructedAlert = document.createElement('div');
      constructedAlert.classList.add('alert');

      /* Add variant */
      if (isVariantValid(this.variant)) {
        constructedAlert.classList.add("alert-" + this.variant);
      }

      /* Add heading */
      if (isHeadingtypeValid(this.headingtype)) {
        var alertHeading = document.createElement(this.headingtype);
        alertHeading.textContent = this.heading;
        alertHeading.classList.add('alert-heading');
        constructedAlert.appendChild(alertHeading);
      } else {
        var _alertHeading = document.createElement('div');
        _alertHeading.textContent = this.heading;
        _alertHeading.classList.add('alert-heading');
        constructedAlert.appendChild(_alertHeading);
      }

      /* Add content */
      var alertBody = document.createElement('div');
      alertBody.classList.add('alert-body');
      if (this.innerHTML === this.textContent) {
        alertBody.innerHTML = "<p class='mt-0 mb-0'>" + this.innerHTML + "</p>";
      } else {
        alertBody.innerHTML = this.innerHTML;
      }
      constructedAlert.appendChild(alertBody);

      /* Add close button */
      if (this.closeable) {
        var closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.classList.add('alert-close');
        closeButton.innerHTML = '<svg class="icon-svg" focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path></svg>Luk';
        constructedAlert.appendChild(closeButton);
        constructedAlert.querySelector('.alert-heading').classList.add('pr-8');
      }

      /* Finish the alert */
      this.innerHTML = constructedAlert.outerHTML;
      if (this.closeable) {
        /* In case there's an alert inside an alert, ensure that we find the correct close button */
        if (this.children.length > 0) {
          var alertElements = this.children[0].children;
          for (var i = 0; i < alertElements.length; i++) {
            if (alertElements[i].classList.contains('alert-close')) {
              alertElements[i].addEventListener("click", _classPrivateFieldGet(this, _closeClickhandler));
            }
          }
        }
      }
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {}
  }, {
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name, oldValue, newValue) {
      if (name === "variant") {
        if (this.querySelector('.alert')) {
          var classes = this.querySelector('.alert').classList;
          classes.remove('alert-info');
          classes.remove('alert-success');
          classes.remove('alert-warning');
          classes.remove('alert-error');
          if (isVariantValid(newValue)) {
            this.querySelector('.alert').classList.add("alert-" + newValue);
          }
        }
      }
      if (name === "heading") {
        if (this.querySelector('.alert-heading')) {
          var heading = this.querySelector('.alert-heading');
          heading.textContent = newValue;
        }
      }
      if (name === "headingtype") {
        if (this.querySelector('.alert') && this.querySelector('.alert-heading')) {
          if (isHeadingtypeValid(newValue)) {
            var _heading = document.createElement(newValue);
            _heading.textContent = this.heading;
            _heading.classList = this.querySelector('.alert-heading').classList;
            this.querySelector('.alert').replaceChild(_heading, this.querySelector('.alert-heading'));
          }
        }
      }
      if (name === "closeable") {
        if (!this.closeable) {
          /* In case there's an alert inside an alert, ensure that we find the correct close button */
          if (this.children.length > 0) {
            var alertElements = this.children[0].children;
            for (var i = 0; i < alertElements.length; i++) {
              if (alertElements[i].classList.contains('alert-close')) {
                alertElements[i].removeEventListener("click", _classPrivateFieldGet(this, _closeClickhandler));
                alertElements[i].remove();
              } else if (alertElements[i].classList.contains('alert-heading')) {
                alertElements[i].classList.remove('pr-8');
              }
            }
          }
        } else {
          var closeButtonExists = false;
          if (this.children.length > 0) {
            var _alertElements = this.children[0].children;
            for (var _i = 0; _i < _alertElements.length; _i++) {
              if (_alertElements[_i].classList.contains('alert-close')) {
                closeButtonExists = true;
              }
            }
          }
          if (!closeButtonExists && this.children.length > 0) {
            var closeButton = document.createElement('button');
            closeButton.type = 'button';
            closeButton.classList.add('alert-close');
            closeButton.innerHTML = '<svg class="icon-svg" focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path></svg>Luk';
            this.firstChild.appendChild(closeButton);
            var _alertElements2 = this.children[0].children;
            for (var _i2 = 0; _i2 < _alertElements2.length; _i2++) {
              if (_alertElements2[_i2].classList.contains('alert-close')) {
                _alertElements2[_i2].addEventListener("click", _classPrivateFieldGet(this, _closeClickhandler));
              } else if (_alertElements2[_i2].classList.contains('alert-heading')) {
                _alertElements2[_i2].classList.add('pr-8');
              }
            }
          }
        }
      }
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return ['variant', 'heading', 'headingtype', 'closeable'];
    }
  }]);
  return FDSAlert;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));
var _default = FDSAlert;
exports["default"] = _default;

},{}],82:[function(require,module,exports){
'use strict';

/**
 * Adds click functionality to modal
 * @param {HTMLElement} $modal Modal element
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function Modal($modal) {
  this.$modal = $modal;
  var id = this.$modal.getAttribute('id');
  this.triggers = document.querySelectorAll('[data-module="modal"][data-target="' + id + '"]');
}

/**
 * Set events
 */
Modal.prototype.init = function () {
  var triggers = this.triggers;
  for (var i = 0; i < triggers.length; i++) {
    var trigger = triggers[i];
    trigger.addEventListener('click', this.show.bind(this));
  }
  var closers = this.$modal.querySelectorAll('[data-modal-close]');
  for (var c = 0; c < closers.length; c++) {
    var closer = closers[c];
    closer.addEventListener('click', this.hide.bind(this));
  }
};

/**
 * Hide modal
 */
Modal.prototype.hide = function () {
  var modalElement = this.$modal;
  if (modalElement !== null) {
    modalElement.setAttribute('aria-hidden', 'true');
    var eventClose = document.createEvent('Event');
    eventClose.initEvent('fds.modal.hidden', true, true);
    modalElement.dispatchEvent(eventClose);
    var $backdrop = document.querySelector('#modal-backdrop');
    $backdrop.parentNode.removeChild($backdrop);
    document.getElementsByTagName('body')[0].classList.remove('modal-open');
    document.removeEventListener('keydown', trapFocus, true);
    if (!hasForcedAction(modalElement)) {
      document.removeEventListener('keyup', handleEscape);
    }
    var dataModalOpener = modalElement.getAttribute('data-modal-opener');
    if (dataModalOpener !== null) {
      var opener = document.getElementById(dataModalOpener);
      if (opener !== null) {
        opener.focus();
      }
      modalElement.removeAttribute('data-modal-opener');
    }
  }
};

/**
 * Show modal
 */
Modal.prototype.show = function () {
  var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var modalElement = this.$modal;
  if (modalElement !== null) {
    if (e !== null) {
      var openerId = e.target.getAttribute('id');
      if (openerId === null) {
        openerId = 'modal-opener-' + Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
        e.target.setAttribute('id', openerId);
      }
      modalElement.setAttribute('data-modal-opener', openerId);
    }

    // Hide open modals - FDS do not recommend more than one open modal at a time
    var activeModals = document.querySelectorAll('.fds-modal[aria-hidden=false]');
    for (var i = 0; i < activeModals.length; i++) {
      new Modal(activeModals[i]).hide();
    }
    modalElement.setAttribute('aria-hidden', 'false');
    modalElement.setAttribute('tabindex', '-1');
    var eventOpen = document.createEvent('Event');
    eventOpen.initEvent('fds.modal.shown', true, true);
    modalElement.dispatchEvent(eventOpen);
    var $backdrop = document.createElement('div');
    $backdrop.classList.add('modal-backdrop');
    $backdrop.setAttribute('id', "modal-backdrop");
    document.getElementsByTagName('body')[0].appendChild($backdrop);
    document.getElementsByTagName('body')[0].classList.add('modal-open');
    modalElement.focus();
    document.addEventListener('keydown', trapFocus, true);
    if (!hasForcedAction(modalElement)) {
      document.addEventListener('keyup', handleEscape);
    }
  }
};

/**
 * Close modal when hitting ESC
 * @param {KeyboardEvent} event 
 */
var handleEscape = function handleEscape(event) {
  var key = event.which || event.keyCode;
  var modalElement = document.querySelector('.fds-modal[aria-hidden=false]');
  var currentModal = new Modal(document.querySelector('.fds-modal[aria-hidden=false]'));
  if (key === 27) {
    var possibleOverflowMenus = modalElement.querySelectorAll('.button-overflow-menu[aria-expanded="true"]');
    if (possibleOverflowMenus.length === 0) {
      currentModal.hide();
    }
  }
};

/**
 * Trap focus in modal when open
 * @param {PointerEvent} e
 */
function trapFocus(e) {
  var currentDialog = document.querySelector('.fds-modal[aria-hidden=false]');
  if (currentDialog !== null) {
    var focusableElements = currentDialog.querySelectorAll('a[href]:not([disabled]):not([aria-hidden=true]), button:not([disabled]):not([aria-hidden=true]), textarea:not([disabled]):not([aria-hidden=true]), input:not([type=hidden]):not([disabled]):not([aria-hidden=true]), select:not([disabled]):not([aria-hidden=true]), details:not([disabled]):not([aria-hidden=true]), [tabindex]:not([tabindex="-1"]):not([disabled]):not([aria-hidden=true])');
    var firstFocusableElement = focusableElements[0];
    var lastFocusableElement = focusableElements[focusableElements.length - 1];
    var isTabPressed = e.key === 'Tab' || e.keyCode === 9;
    if (!isTabPressed) {
      return;
    }
    if (e.shiftKey) /* shift + tab */{
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else /* tab */{
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
  }
}
;
function hasForcedAction(modal) {
  if (modal.getAttribute('data-modal-forced-action') === null) {
    return false;
  }
  return true;
}
var _default = Modal;
exports["default"] = _default;

},{}],83:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var forEach = require('array-foreach');
var select = require('../utils/select');
var NAV = ".nav";
var NAV_LINKS = "".concat(NAV, " a");
var OPENERS = ".js-menu-open";
var CLOSE_BUTTON = ".js-menu-close";
var OVERLAY = ".overlay";
var CLOSERS = "".concat(CLOSE_BUTTON, ", .overlay");
var TOGGLES = [NAV, OVERLAY].join(', ');
var ACTIVE_CLASS = 'mobile_nav-active';
var VISIBLE_CLASS = 'is-visible';

/**
 * Add mobile menu functionality
 */
var Navigation = /*#__PURE__*/function () {
  function Navigation() {
    _classCallCheck(this, Navigation);
  }
  _createClass(Navigation, [{
    key: "init",
    value:
    /**
     * Set events
     */
    function init() {
      window.addEventListener('resize', mobileMenu, false);
      mobileMenu();
    }

    /**
     * Remove events
     */
  }, {
    key: "teardown",
    value: function teardown() {
      window.removeEventListener('resize', mobileMenu, false);
    }
  }]);
  return Navigation;
}();
/**
 * Add functionality to mobile menu
 */
var mobileMenu = function mobileMenu() {
  var mobile = false;
  var openers = document.querySelectorAll(OPENERS);
  for (var o = 0; o < openers.length; o++) {
    if (window.getComputedStyle(openers[o], null).display !== 'none') {
      openers[o].addEventListener('click', toggleNav);
      mobile = true;
    }
  }

  // if mobile
  if (mobile) {
    var closers = document.querySelectorAll(CLOSERS);
    for (var c = 0; c < closers.length; c++) {
      closers[c].addEventListener('click', toggleNav);
    }
    var navLinks = document.querySelectorAll(NAV_LINKS);
    for (var n = 0; n < navLinks.length; n++) {
      navLinks[n].addEventListener('click', function () {
        // A navigation link has been clicked! We want to collapse any
        // hierarchical navigation UI it's a part of, so that the user
        // can focus on whatever they've just selected.

        // Some navigation links are inside dropdowns; when they're
        // clicked, we want to collapse those dropdowns.

        // If the mobile navigation menu is active, we want to hide it.
        if (isActive()) {
          toggleNav.call(this, false);
        }
      });
    }
    var trapContainers = document.querySelectorAll(NAV);
    for (var i = 0; i < trapContainers.length; i++) {
      focusTrap = _focusTrap(trapContainers[i]);
    }
  }
  var closer = document.body.querySelector(CLOSE_BUTTON);
  if (isActive() && closer && closer.getBoundingClientRect().width === 0) {
    // The mobile nav is active, but the close box isn't visible, which
    // means the user's viewport has been resized so that it is no longer
    // in mobile mode. Let's make the page state consistent by
    // deactivating the mobile nav.
    toggleNav.call(closer, false);
  }
};

/**
 * Check if mobile menu is active
 * @returns true if mobile menu is active and false if not active
 */
var isActive = function isActive() {
  return document.body.classList.contains(ACTIVE_CLASS);
};

/**
 * Trap focus in mobile menu if active
 * @param {HTMLElement} trapContainer 
 */
var _focusTrap = function _focusTrap(trapContainer) {
  // Find all focusable children
  var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
  var focusableElements = trapContainer.querySelectorAll(focusableElementsString);
  var firstTabStop = focusableElements[0];
  function trapTabKey(e) {
    var key = event.which || event.keyCode;
    // Check for TAB key press
    if (key === 9) {
      var lastTabStop = null;
      for (var i = 0; i < focusableElements.length; i++) {
        var number = focusableElements.length - 1;
        var element = focusableElements[number - i];
        if (element.offsetWidth > 0 && element.offsetHeight > 0) {
          lastTabStop = element;
          break;
        }
      }

      // SHIFT + TAB
      if (e.shiftKey) {
        if (document.activeElement === firstTabStop) {
          e.preventDefault();
          lastTabStop.focus();
        }

        // TAB
      } else {
        if (document.activeElement === lastTabStop) {
          e.preventDefault();
          firstTabStop.focus();
        }
      }
    }

    // ESCAPE
    if (e.key === 'Escape') {
      toggleNav.call(this, false);
    }
  }
  return {
    enable: function enable() {
      // Focus first child
      firstTabStop.focus();
      // Listen for and trap the keyboard
      document.addEventListener('keydown', trapTabKey);
    },
    release: function release() {
      document.removeEventListener('keydown', trapTabKey);
    }
  };
};
var focusTrap;
var toggleNav = function toggleNav(active) {
  var body = document.body;
  if (typeof active !== 'boolean') {
    active = !isActive();
  }
  body.classList.toggle(ACTIVE_CLASS, active);
  forEach(select(TOGGLES), function (el) {
    el.classList.toggle(VISIBLE_CLASS, active);
  });
  if (active) {
    focusTrap.enable();
  } else {
    focusTrap.release();
  }
  var closeButton = body.querySelector(CLOSE_BUTTON);
  var menuButton = body.querySelector(OPENERS);
  if (active && closeButton) {
    // The mobile nav was just activated, so focus on the close button,
    // which is just before all the nav elements in the tab order.
    closeButton.focus();
  } else if (!active && document.activeElement === closeButton && menuButton) {
    // The mobile nav was just deactivated, and focus was on the close
    // button, which is no longer visible. We don't want the focus to
    // disappear into the void, so focus on the menu button if it's
    // visible (this may have been what the user was just focused on,
    // if they triggered the mobile nav by mistake).
    menuButton.focus();
  }
  return active;
};
var _default = Navigation;
exports["default"] = _default;

},{"../utils/select":105,"array-foreach":1}],84:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var TOGGLE_ATTRIBUTE = 'data-controls';

/**
 * Adds click functionality to radiobutton collapse list
 * @param {HTMLElement} containerElement 
 */
function RadioToggleGroup(containerElement) {
  this.radioGroup = containerElement;
  this.radioEls = null;
  this.targetEl = null;
}

/**
 * Set events
 */
RadioToggleGroup.prototype.init = function () {
  this.radioEls = this.radioGroup.querySelectorAll('input[type="radio"]');
  if (this.radioEls.length === 0) {
    throw new Error('No radiobuttons found in radiobutton group.');
  }
  var that = this;
  for (var i = 0; i < this.radioEls.length; i++) {
    var radio = this.radioEls[i];
    radio.addEventListener('change', function () {
      for (var a = 0; a < that.radioEls.length; a++) {
        that.toggle(that.radioEls[a]);
      }
    });
    this.toggle(radio);
  }
};

/**
 * Toggle radiobutton content
 * @param {HTMLInputElement} radioInputElement 
 */
RadioToggleGroup.prototype.toggle = function (radioInputElement) {
  var contentId = radioInputElement.getAttribute(TOGGLE_ATTRIBUTE);
  if (contentId !== null && contentId !== undefined && contentId !== "") {
    var contentElement = document.querySelector(contentId);
    if (contentElement === null || contentElement === undefined) {
      throw new Error("Could not find panel element. Verify value of attribute " + TOGGLE_ATTRIBUTE);
    }
    if (radioInputElement.checked) {
      this.expand(radioInputElement, contentElement);
    } else {
      this.collapse(radioInputElement, contentElement);
    }
  }
};

/**
 * Expand radio button content
 * @param {} radioInputElement Radio Input element
 * @param {*} contentElement Content element
 */
RadioToggleGroup.prototype.expand = function (radioInputElement, contentElement) {
  if (radioInputElement !== null && radioInputElement !== undefined && contentElement !== null && contentElement !== undefined) {
    radioInputElement.setAttribute('data-expanded', 'true');
    contentElement.setAttribute('aria-hidden', 'false');
    var eventOpen = new Event('fds.radio.expanded');
    radioInputElement.dispatchEvent(eventOpen);
  }
};
/**
 * Collapse radio button content
 * @param {} radioInputElement Radio Input element
 * @param {*} contentElement Content element
 */
RadioToggleGroup.prototype.collapse = function (radioInputElement, contentElement) {
  if (radioInputElement !== null && radioInputElement !== undefined && contentElement !== null && contentElement !== undefined) {
    radioInputElement.setAttribute('data-expanded', 'false');
    contentElement.setAttribute('aria-hidden', 'true');
    var eventClose = new Event('fds.radio.collapsed');
    radioInputElement.dispatchEvent(eventClose);
  }
};
var _default = RadioToggleGroup;
exports["default"] = _default;

},{}],85:[function(require,module,exports){
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var modifierState = {
  shift: false,
  alt: false,
  ctrl: false,
  command: false
};
/*
* Prevents the user from inputting based on a regex.
* Does not work the same way af <input pattern="">, this pattern is only used for validation, not to prevent input.
* Usecase: number input for date-component.
* Example - number only: <input type="text" data-input-regex="^\d*$">
*/
var InputRegexMask = /*#__PURE__*/_createClass(function InputRegexMask(element) {
  _classCallCheck(this, InputRegexMask);
  element.addEventListener('paste', regexMask);
  element.addEventListener('keydown', regexMask);
});
var regexMask = function regexMask(event) {
  if (modifierState.ctrl || modifierState.command) {
    return;
  }
  var newChar = null;
  if (typeof event.key !== 'undefined') {
    if (event.key.length === 1) {
      newChar = event.key;
    }
  } else {
    if (!event.charCode) {
      newChar = String.fromCharCode(event.keyCode);
    } else {
      newChar = String.fromCharCode(event.charCode);
    }
  }
  var regexStr = this.getAttribute('data-input-regex');
  if (event.type !== undefined && event.type === 'paste') {
    //console.log('paste');
  } else {
    var element = null;
    if (event.target !== undefined) {
      element = event.target;
    }
    if (newChar !== null && element !== null) {
      if (newChar.length > 0) {
        var newValue = this.value;
        if (element.type === 'number') {
          newValue = this.value; //Note input[type=number] does not have .selectionStart/End (Chrome).
        } else {
          newValue = this.value.slice(0, element.selectionStart) + this.value.slice(element.selectionEnd) + newChar; //removes the numbers selected by the user, then adds new char.
        }

        var r = new RegExp(regexStr);
        if (r.exec(newValue) === null) {
          if (event.preventDefault) {
            event.preventDefault();
          } else {
            event.returnValue = false;
          }
        }
      }
    }
  }
};
var _default = InputRegexMask;
exports["default"] = _default;

},{}],86:[function(require,module,exports){
'use strict';

/**
 * 
 * @param {HTMLTableElement} table Table Element
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function TableSelectableRows(table) {
  this.table = table;
}

/**
 * Initialize eventlisteners for checkboxes in table
 */
TableSelectableRows.prototype.init = function () {
  this.groupCheckbox = this.getGroupCheckbox();
  this.tbodyCheckboxList = this.getCheckboxList();
  if (this.tbodyCheckboxList.length !== 0) {
    for (var c = 0; c < this.tbodyCheckboxList.length; c++) {
      var checkbox = this.tbodyCheckboxList[c];
      checkbox.removeEventListener('change', updateGroupCheck);
      checkbox.addEventListener('change', updateGroupCheck);
    }
  }
  if (this.groupCheckbox !== false) {
    this.groupCheckbox.removeEventListener('change', updateCheckboxList);
    this.groupCheckbox.addEventListener('change', updateCheckboxList);
  }
};

/**
 * Get group checkbox in table header
 * @returns element on true - false if not found
 */
TableSelectableRows.prototype.getGroupCheckbox = function () {
  var checkbox = this.table.getElementsByTagName('thead')[0].getElementsByClassName('form-checkbox');
  if (checkbox.length === 0) {
    return false;
  }
  return checkbox[0];
};
/**
 * Get table body checkboxes
 * @returns HTMLCollection
 */
TableSelectableRows.prototype.getCheckboxList = function () {
  return this.table.getElementsByTagName('tbody')[0].getElementsByClassName('form-checkbox');
};

/**
 * Update checkboxes in table body when group checkbox is changed
 * @param {Event} e 
 */
function updateCheckboxList(e) {
  var checkbox = e.target;
  checkbox.removeAttribute('aria-checked');
  var table = e.target.parentNode.parentNode.parentNode.parentNode;
  var tableSelectableRows = new TableSelectableRows(table);
  var checkboxList = tableSelectableRows.getCheckboxList();
  var checkedNumber = 0;
  if (checkbox.checked) {
    for (var c = 0; c < checkboxList.length; c++) {
      checkboxList[c].checked = true;
      checkboxList[c].parentNode.parentNode.classList.add('table-row-selected');
    }
    checkedNumber = checkboxList.length;
  } else {
    for (var _c = 0; _c < checkboxList.length; _c++) {
      checkboxList[_c].checked = false;
      checkboxList[_c].parentNode.parentNode.classList.remove('table-row-selected');
    }
  }
  var event = new CustomEvent("fds.table.selectable.updated", {
    bubbles: true,
    cancelable: true,
    detail: {
      checkedNumber: checkedNumber
    }
  });
  table.dispatchEvent(event);
}

/**
 * Update group checkbox when checkbox in table body is changed
 * @param {Event} e 
 */
function updateGroupCheck(e) {
  // update label for event checkbox
  if (e.target.checked) {
    e.target.parentNode.parentNode.classList.add('table-row-selected');
  } else {
    e.target.parentNode.parentNode.classList.remove('table-row-selected');
  }
  var table = e.target.parentNode.parentNode.parentNode.parentNode;
  var tableSelectableRows = new TableSelectableRows(table);
  var groupCheckbox = tableSelectableRows.getGroupCheckbox();
  if (groupCheckbox !== false) {
    var checkboxList = tableSelectableRows.getCheckboxList();

    // how many row has been selected
    var checkedNumber = 0;
    for (var c = 0; c < checkboxList.length; c++) {
      var loopedCheckbox = checkboxList[c];
      if (loopedCheckbox.checked) {
        checkedNumber++;
      }
    }
    if (checkedNumber === checkboxList.length) {
      // if all rows has been selected
      groupCheckbox.removeAttribute('aria-checked');
      groupCheckbox.checked = true;
    } else if (checkedNumber == 0) {
      // if no rows has been selected
      groupCheckbox.removeAttribute('aria-checked');
      groupCheckbox.checked = false;
    } else {
      // if some but not all rows has been selected
      groupCheckbox.setAttribute('aria-checked', 'mixed');
      groupCheckbox.checked = false;
    }
    var event = new CustomEvent("fds.table.selectable.updated", {
      bubbles: true,
      cancelable: true,
      detail: {
        checkedNumber: checkedNumber
      }
    });
    table.dispatchEvent(event);
  }
}
var _default = TableSelectableRows;
exports["default"] = _default;

},{}],87:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var select = require('../utils/select');

/**
 * Set data-title on cells, where the attribute is missing
 */
var ResponsiveTable = /*#__PURE__*/_createClass(function ResponsiveTable(table) {
  _classCallCheck(this, ResponsiveTable);
  insertHeaderAsAttributes(table);
});
/**
 * Add data attributes needed for responsive mode.
 * @param {HTMLTableElement} tableEl Table element
 */
function insertHeaderAsAttributes(tableEl) {
  if (!tableEl) return;
  var header = tableEl.getElementsByTagName('thead');
  if (header.length !== 0) {
    var headerCellEls = header[0].getElementsByTagName('th');
    if (headerCellEls.length == 0) {
      headerCellEls = header[0].getElementsByTagName('td');
    }
    if (headerCellEls.length > 0) {
      var bodyRowEls = select('tbody tr', tableEl);
      Array.from(bodyRowEls).forEach(function (rowEl) {
        var cellEls = rowEl.children;
        if (cellEls.length === headerCellEls.length) {
          Array.from(headerCellEls).forEach(function (headerCellEl, i) {
            // Grab header cell text and use it body cell data title.
            if (!cellEls[i].hasAttribute('data-title') && headerCellEl.tagName === "TH" && !headerCellEl.classList.contains("sr-header")) {
              cellEls[i].setAttribute('data-title', headerCellEl.textContent);
            }
          });
        }
      });
    }
  }
}
var _default = ResponsiveTable;
exports["default"] = _default;

},{"../utils/select":105}],88:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var breakpoints = {
  'xs': 0,
  'sm': 576,
  'md': 768,
  'lg': 992,
  'xl': 1200
};

// For easy reference
var keys = {
  end: 35,
  home: 36,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  "delete": 46
};

// Add or substract depending on key pressed
var direction = {
  37: -1,
  38: -1,
  39: 1,
  40: 1
};

/**
 * Add functionality to tabnav component
 * @param {HTMLElement} tabnav Tabnav container
 */
function Tabnav(tabnav) {
  this.tabnav = tabnav;
  this.tabs = this.tabnav.querySelectorAll('button.tabnav-item');
}

/**
 * Set event on component
 */
Tabnav.prototype.init = function () {
  if (this.tabs.length === 0) {
    throw new Error("Tabnav HTML seems to be missing tabnav-item. Add tabnav items to ensure each panel has a button in the tabnavs navigation.");
  }

  // if no hash is set on load, set active tab
  if (!setActiveHashTab()) {
    // set first tab as active
    var tab = this.tabs[0];

    // check no other tabs as been set at default
    var alreadyActive = getActiveTabs(this.tabnav);
    if (alreadyActive.length === 0) {
      tab = alreadyActive[0];
    }

    // activate and deactivate tabs
    this.activateTab(tab, false);
  }
  var $module = this;
  // add eventlisteners on buttons
  for (var t = 0; t < this.tabs.length; t++) {
    this.tabs[t].addEventListener('click', function () {
      $module.activateTab(this, false);
    });
    this.tabs[t].addEventListener('keydown', keydownEventListener);
    this.tabs[t].addEventListener('keyup', keyupEventListener);
  }
};

/***
 * Show tab and hide others
 * @param {HTMLButtonElement} tab button element
 * @param {boolean} setFocus True if tab button should be focused
 */
Tabnav.prototype.activateTab = function (tab, setFocus) {
  var tabs = getAllTabsInList(tab);

  // close all tabs except selected
  for (var i = 0; i < this.tabs.length; i++) {
    if (tabs[i] === tab) {
      continue;
    }
    if (tabs[i].getAttribute('aria-selected') === 'true') {
      var eventClose = new Event('fds.tabnav.close');
      tabs[i].dispatchEvent(eventClose);
    }
    tabs[i].setAttribute('tabindex', '-1');
    tabs[i].setAttribute('aria-selected', 'false');
    var _tabpanelID = tabs[i].getAttribute('aria-controls');
    var _tabpanel = document.getElementById(_tabpanelID);
    if (_tabpanel === null) {
      throw new Error("Could not find tabpanel.");
    }
    _tabpanel.setAttribute('aria-hidden', 'true');
  }

  // Set selected tab to active
  var tabpanelID = tab.getAttribute('aria-controls');
  var tabpanel = document.getElementById(tabpanelID);
  if (tabpanel === null) {
    throw new Error("Could not find accordion panel.");
  }
  tab.setAttribute('aria-selected', 'true');
  tabpanel.setAttribute('aria-hidden', 'false');
  tab.removeAttribute('tabindex');

  // Set focus when required
  if (setFocus) {
    tab.focus();
  }
  var eventChanged = new Event('fds.tabnav.changed');
  tab.parentNode.dispatchEvent(eventChanged);
  var eventOpen = new Event('fds.tabnav.open');
  tab.dispatchEvent(eventOpen);
};

/**
 * Add keydown events to tabnav component
 * @param {KeyboardEvent} event 
 */
function keydownEventListener(event) {
  var key = event.keyCode;
  switch (key) {
    case keys.end:
      event.preventDefault();
      // Activate last tab
      focusLastTab(event.target);
      break;
    case keys.home:
      event.preventDefault();
      // Activate first tab
      focusFirstTab(event.target);
      break;
    // Up and down are in keydown
    // because we need to prevent page scroll >:)
    case keys.up:
    case keys.down:
      determineOrientation(event);
      break;
  }
}

/**
 * Add keyup events to tabnav component
 * @param {KeyboardEvent} event 
 */
function keyupEventListener(event) {
  var key = event.keyCode;
  switch (key) {
    case keys.left:
    case keys.right:
      determineOrientation(event);
      break;
    case keys["delete"]:
      break;
    case keys.enter:
    case keys.space:
      new Tabnav(event.target.parentNode).activateTab(event.target, true);
      break;
  }
}

/**
 * When a tablist aria-orientation is set to vertical,
 * only up and down arrow should function.
 * In all other cases only left and right arrow function.
 */
function determineOrientation(event) {
  var key = event.keyCode;
  var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight || e.clientHeight || g.clientHeight;
  var vertical = x < breakpoints.md;
  var proceed = false;
  if (vertical) {
    if (key === keys.up || key === keys.down) {
      event.preventDefault();
      proceed = true;
    }
  } else {
    if (key === keys.left || key === keys.right) {
      proceed = true;
    }
  }
  if (proceed) {
    switchTabOnArrowPress(event);
  }
}

/**
 * Either focus the next, previous, first, or last tab
 * depending on key pressed
 */
function switchTabOnArrowPress(event) {
  var pressed = event.keyCode;
  if (direction[pressed]) {
    var target = event.target;
    var tabs = getAllTabsInList(target);
    var index = getIndexOfElementInList(target, tabs);
    if (index !== -1) {
      if (tabs[index + direction[pressed]]) {
        tabs[index + direction[pressed]].focus();
      } else if (pressed === keys.left || pressed === keys.up) {
        focusLastTab(target);
      } else if (pressed === keys.right || pressed == keys.down) {
        focusFirstTab(target);
      }
    }
  }
}

/**
 * Get all active tabs in list
 * @param tabnav parent .tabnav element
 * @returns returns list of active tabs if any
 */
function getActiveTabs(tabnav) {
  return tabnav.querySelectorAll('button.tabnav-item[aria-selected=true]');
}

/**
 * Get a list of all button tabs in current tablist
 * @param tab Button tab element
 * @returns {*} return array of tabs
 */
function getAllTabsInList(tab) {
  var parentNode = tab.parentNode;
  if (parentNode.classList.contains('tabnav')) {
    return parentNode.querySelectorAll('button.tabnav-item');
  }
  return [];
}

/**
 * Get index of element in list
 * @param {HTMLElement} element 
 * @param {HTMLCollection} list 
 * @returns {index}
 */
function getIndexOfElementInList(element, list) {
  var index = -1;
  for (var i = 0; i < list.length; i++) {
    if (list[i] === element) {
      index = i;
      break;
    }
  }
  return index;
}

/**
 * Checks if there is a tab hash in the url and activates the tab accordingly
 * @returns {boolean} returns true if tab has been set - returns false if no tab has been set to active
 */
function setActiveHashTab() {
  var hash = location.hash.replace('#', '');
  if (hash !== '') {
    var tab = document.querySelector('button.tabnav-item[aria-controls="#' + hash + '"]');
    if (tab !== null) {
      activateTab(tab, false);
      return true;
    }
  }
  return false;
}

/**
 * Get first tab by tab in list
 * @param {HTMLButtonElement} tab 
 */
function focusFirstTab(tab) {
  getAllTabsInList(tab)[0].focus();
}

/**
 * Get last tab by tab in list
 * @param {HTMLButtonElement} tab 
 */
function focusLastTab(tab) {
  var tabs = getAllTabsInList(tab);
  tabs[tabs.length - 1].focus();
}
var _default = Tabnav;
exports["default"] = _default;

},{}],89:[function(require,module,exports){
'use strict';

/**
 * Show/hide toast component
 * @param {HTMLElement} element 
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function Toast(element) {
  this.element = element;
}

/**
 * Show toast
 */
Toast.prototype.show = function () {
  this.element.classList.remove('hide');
  this.element.classList.add('showing');
  this.element.getElementsByClassName('toast-close')[0].addEventListener('click', function () {
    var toast = this.parentNode.parentNode;
    new Toast(toast).hide();
  });
  requestAnimationFrame(showToast);
};

/**
 * Hide toast
 */
Toast.prototype.hide = function () {
  this.element.classList.remove('show');
  this.element.classList.add('hide');
};

/**
 * Adds classes to make show animation
 */
function showToast() {
  var toasts = document.querySelectorAll('.toast.showing');
  for (var t = 0; t < toasts.length; t++) {
    var toast = toasts[t];
    toast.classList.remove('showing');
    toast.classList.add('show');
  }
}
var _default = Toast;
exports["default"] = _default;

},{}],90:[function(require,module,exports){
'use strict';

/**
 * Set tooltip on element
 * @param {HTMLElement} element Element which has tooltip
 */
function Tooltip(element) {
  this.element = element;
  if (this.element.getAttribute('data-tooltip') === null) {
    throw new Error("Tooltip text is missing. Add attribute data-tooltip and the content of the tooltip as value.");
  }
}

/**
 * Set eventlisteners
 */
Tooltip.prototype.init = function () {
  var module = this;
  this.element.addEventListener('mouseenter', function (e) {
    var trigger = e.target;
    if (trigger.classList.contains('tooltip-hover') === false && trigger.classList.contains('tooltip-focus') === false) {
      closeAllTooltips(e);
      trigger.classList.add("tooltip-hover");
      setTimeout(function () {
        if (trigger.classList.contains('tooltip-hover')) {
          var element = e.target;
          if (element.getAttribute('aria-describedby') !== null) return;
          addTooltip(element);
        }
      }, 300);
    }
  });
  this.element.addEventListener('mouseleave', function (e) {
    var trigger = e.target;
    if (trigger.classList.contains('tooltip-hover')) {
      trigger.classList.remove('tooltip-hover');
      var tooltipId = trigger.getAttribute('aria-describedby');
      var tooltipElement = document.getElementById(tooltipId);
      if (tooltipElement !== null) {
        closeHoverTooltip(trigger);
      }
    }
  });
  this.element.addEventListener('keyup', function (event) {
    var key = event.which || event.keyCode;
    if (key === 27) {
      var tooltip = this.getAttribute('aria-describedby');
      if (tooltip !== null && document.getElementById(tooltip) !== null) {
        document.body.removeChild(document.getElementById(tooltip));
      }
      this.classList.remove('active');
      this.removeAttribute('aria-describedby');
    }
  });
  if (this.element.getAttribute('data-tooltip-trigger') === 'click') {
    this.element.addEventListener('click', function (e) {
      var trigger = e.target;
      closeAllTooltips(e);
      trigger.classList.add('tooltip-focus');
      trigger.classList.remove('tooltip-hover');
      if (trigger.getAttribute('aria-describedby') !== null) return;
      addTooltip(trigger);
    });
  }
  document.getElementsByTagName('body')[0].removeEventListener('click', closeAllTooltips);
  document.getElementsByTagName('body')[0].addEventListener('click', closeAllTooltips);
};

/**
 * Close all tooltips
 */
function closeAll() {
  var elements = document.querySelectorAll('.js-tooltip[aria-describedby]');
  for (var i = 0; i < elements.length; i++) {
    var popper = elements[i].getAttribute('aria-describedby');
    elements[i].removeAttribute('aria-describedby');
    document.body.removeChild(document.getElementById(popper));
  }
}
function addTooltip(trigger) {
  var pos = trigger.getAttribute('data-tooltip-position') || 'top';
  var tooltip = createTooltip(trigger, pos);
  document.body.appendChild(tooltip);
  positionAt(trigger, tooltip, pos);
}

/**
 * Create tooltip element
 * @param {HTMLElement} element Element which the tooltip is attached
 * @param {string} pos Position of tooltip (top | bottom)
 * @returns 
 */
function createTooltip(element, pos) {
  var tooltip = document.createElement('div');
  tooltip.className = 'tooltip-popper';
  var poppers = document.getElementsByClassName('tooltip-popper');
  var id = 'tooltip-' + poppers.length + 1;
  tooltip.setAttribute('id', id);
  tooltip.setAttribute('role', 'tooltip');
  tooltip.setAttribute('x-placement', pos);
  element.setAttribute('aria-describedby', id);
  var tooltipInner = document.createElement('div');
  tooltipInner.className = 'tooltip';
  var tooltipArrow = document.createElement('div');
  tooltipArrow.className = 'tooltip-arrow';
  tooltipInner.appendChild(tooltipArrow);
  var tooltipContent = document.createElement('div');
  tooltipContent.className = 'tooltip-content';
  tooltipContent.innerHTML = element.getAttribute('data-tooltip');
  tooltipInner.appendChild(tooltipContent);
  tooltip.appendChild(tooltipInner);
  return tooltip;
}

/**
 * Positions the tooltip.
 *
 * @param {object} parent - The trigger of the tooltip.
 * @param {object} tooltip - The tooltip itself.
 * @param {string} posHorizontal - Desired horizontal position of the tooltip relatively to the trigger (left/center/right)
 * @param {string} posVertical - Desired vertical position of the tooltip relatively to the trigger (top/center/bottom)
 *
 */
function positionAt(parent, tooltip, pos) {
  var trigger = parent;
  var arrow = tooltip.getElementsByClassName('tooltip-arrow')[0];
  var triggerPosition = parent.getBoundingClientRect();
  var parentCoords = parent.getBoundingClientRect(),
    left,
    top;
  var tooltipWidth = tooltip.offsetWidth;
  var dist = 12;
  var arrowDirection = "down";
  left = parseInt(parentCoords.left) + (parent.offsetWidth - tooltip.offsetWidth) / 2;
  switch (pos) {
    case 'bottom':
      top = parseInt(parentCoords.bottom) + dist;
      arrowDirection = "up";
      break;
    default:
    case 'top':
      top = parseInt(parentCoords.top) - tooltip.offsetHeight - dist;
  }

  // if tooltip is out of bounds on left side
  if (left < 0) {
    left = dist;
    var endPositionOnPage = triggerPosition.left + trigger.offsetWidth / 2;
    var tooltipArrowHalfWidth = 8;
    var arrowLeftPosition = endPositionOnPage - dist - tooltipArrowHalfWidth;
    tooltip.getElementsByClassName('tooltip-arrow')[0].style.left = arrowLeftPosition + 'px';
  }

  // if tooltip is out of bounds on the bottom of the page
  if (top + tooltip.offsetHeight >= window.innerHeight) {
    top = parseInt(parentCoords.top) - tooltip.offsetHeight - dist;
    arrowDirection = "down";
  }

  // if tooltip is out of bounds on the top of the page
  if (top < 0) {
    top = parseInt(parentCoords.bottom) + dist;
    arrowDirection = "up";
  }
  if (window.innerWidth < left + tooltipWidth) {
    tooltip.style.right = dist + 'px';
    var _endPositionOnPage = triggerPosition.right - trigger.offsetWidth / 2;
    var _tooltipArrowHalfWidth = 8;
    var arrowRightPosition = window.innerWidth - _endPositionOnPage - dist - _tooltipArrowHalfWidth;
    tooltip.getElementsByClassName('tooltip-arrow')[0].style.right = arrowRightPosition + 'px';
    tooltip.getElementsByClassName('tooltip-arrow')[0].style.left = 'auto';
  } else {
    tooltip.style.left = left + 'px';
  }
  tooltip.style.top = top + pageYOffset + 'px';
  tooltip.getElementsByClassName('tooltip-arrow')[0].classList.add(arrowDirection);
}
function closeAllTooltips(event) {
  var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (force || !event.target.classList.contains('js-tooltip') && !event.target.classList.contains('tooltip') && !event.target.classList.contains('tooltip-content')) {
    var elements = document.querySelectorAll('.tooltip-popper');
    for (var i = 0; i < elements.length; i++) {
      var trigger = document.querySelector('[aria-describedby=' + elements[i].getAttribute('id') + ']');
      trigger.removeAttribute('data-tooltip-active');
      trigger.removeAttribute('aria-describedby');
      trigger.classList.remove('tooltip-focus');
      trigger.classList.remove('tooltip-hover');
      document.body.removeChild(elements[i]);
    }
  }
}
function closeHoverTooltip(trigger) {
  var tooltipId = trigger.getAttribute('aria-describedby');
  var tooltipElement = document.getElementById(tooltipId);
  tooltipElement.removeEventListener('mouseenter', onTooltipHover);
  tooltipElement.addEventListener('mouseenter', onTooltipHover);
  setTimeout(function () {
    var tooltipElement = document.getElementById(tooltipId);
    if (tooltipElement !== null) {
      if (!trigger.classList.contains("tooltip-hover")) {
        removeTooltip(trigger);
      }
    }
  }, 300);
}
function onTooltipHover(e) {
  var tooltipElement = this;
  var trigger = document.querySelector('[aria-describedby=' + tooltipElement.getAttribute('id') + ']');
  trigger.classList.add('tooltip-hover');
  tooltipElement.addEventListener('mouseleave', function () {
    var trigger = document.querySelector('[aria-describedby=' + tooltipElement.getAttribute('id') + ']');
    if (trigger !== null) {
      trigger.classList.remove('tooltip-hover');
      closeHoverTooltip(trigger);
    }
  });
}
function removeTooltip(trigger) {
  var tooltipId = trigger.getAttribute('aria-describedby');
  var tooltipElement = document.getElementById(tooltipId);
  if (tooltipId !== null && tooltipElement !== null) {
    document.body.removeChild(tooltipElement);
  }
  trigger.removeAttribute('aria-describedby');
  trigger.classList.remove('tooltip-hover');
  trigger.classList.remove('tooltip-focus');
}
module.exports = Tooltip;

},{}],91:[function(require,module,exports){
"use strict";

module.exports = {
  prefix: ''
};

},{}],92:[function(require,module,exports){
'use strict';

var _accordion = _interopRequireDefault(require("./components/accordion"));
var _alert = _interopRequireDefault(require("./components/alert"));
var _backToTop = _interopRequireDefault(require("./components/back-to-top"));
var _characterLimit = _interopRequireDefault(require("./components/character-limit"));
var _checkboxToggleContent = _interopRequireDefault(require("./components/checkbox-toggle-content"));
var _dropdown = _interopRequireDefault(require("./components/dropdown"));
var _dropdownSort = _interopRequireDefault(require("./components/dropdown-sort"));
var _errorSummary = _interopRequireDefault(require("./components/error-summary"));
var _regexInputMask = _interopRequireDefault(require("./components/regex-input-mask"));
var _modal = _interopRequireDefault(require("./components/modal"));
var _navigation = _interopRequireDefault(require("./components/navigation"));
var _radioToggleContent = _interopRequireDefault(require("./components/radio-toggle-content"));
var _table = _interopRequireDefault(require("./components/table"));
var _tabnav = _interopRequireDefault(require("./components/tabnav"));
var _selectableTable = _interopRequireDefault(require("./components/selectable-table"));
var _toast = _interopRequireDefault(require("./components/toast"));
var _tooltip = _interopRequireDefault(require("./components/tooltip"));
var _fdsAlert = _interopRequireDefault(require("./components/fds-alert"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var datePicker = require('./components/date-picker');
/**
 * The 'polyfills' define key ECMAScript 5 methods that may be missing from
 * older browsers, so must be loaded first.
 */
require('./polyfills');

/**
 * Init all components
 * @param {JSON} options {scope: HTMLElement} - Init all components within scope (default is document)
 */
var init = function init(options) {
  // Set the options to an empty object by default if no options are passed.
  options = typeof options !== 'undefined' ? options : {};

  // Allow the user to initialise FDS in only certain sections of the page
  // Defaults to the entire document if nothing is set.
  var scope = typeof options.scope !== 'undefined' ? options.scope : document;

  /*
  ---------------------
  Accordions
  ---------------------
  */
  var jsSelectorAccordion = scope.getElementsByClassName('accordion');
  for (var c = 0; c < jsSelectorAccordion.length; c++) {
    new _accordion["default"](jsSelectorAccordion[c]).init();
  }
  var jsSelectorAccordionBordered = scope.querySelectorAll('.accordion-bordered:not(.accordion)');
  for (var _c = 0; _c < jsSelectorAccordionBordered.length; _c++) {
    new _accordion["default"](jsSelectorAccordionBordered[_c]).init();
  }

  /*
  ---------------------
  Alerts
  ---------------------
  */

  var alertsWithCloseButton = scope.querySelectorAll('.alert.has-close');
  for (var _c2 = 0; _c2 < alertsWithCloseButton.length; _c2++) {
    new _alert["default"](alertsWithCloseButton[_c2]).init();
  }

  /*
  ---------------------
  Back to top button
  ---------------------
  */

  var backToTopButtons = scope.getElementsByClassName('back-to-top-button');
  for (var _c3 = 0; _c3 < backToTopButtons.length; _c3++) {
    new _backToTop["default"](backToTopButtons[_c3]).init();
  }

  /*
  ---------------------
  Character limit
  ---------------------
  */
  var jsCharacterLimit = scope.getElementsByClassName('form-limit');
  for (var _c4 = 0; _c4 < jsCharacterLimit.length; _c4++) {
    new _characterLimit["default"](jsCharacterLimit[_c4]).init();
  }

  /*
  ---------------------
  Checkbox collapse
  ---------------------
  */
  var jsSelectorCheckboxCollapse = scope.getElementsByClassName('js-checkbox-toggle-content');
  for (var _c5 = 0; _c5 < jsSelectorCheckboxCollapse.length; _c5++) {
    new _checkboxToggleContent["default"](jsSelectorCheckboxCollapse[_c5]).init();
  }

  /*
  ---------------------
  Overflow menu
  ---------------------
  */
  var jsSelectorDropdown = scope.getElementsByClassName('js-dropdown');
  for (var _c6 = 0; _c6 < jsSelectorDropdown.length; _c6++) {
    new _dropdown["default"](jsSelectorDropdown[_c6]).init();
  }

  /*
  ---------------------
  Overflow menu sort
  ---------------------
  */
  var jsSelectorDropdownSort = scope.getElementsByClassName('overflow-menu--sort');
  for (var _c7 = 0; _c7 < jsSelectorDropdownSort.length; _c7++) {
    new _dropdownSort["default"](jsSelectorDropdownSort[_c7]).init();
  }

  /*
  ---------------------
  Datepicker
  ---------------------
  */
  datePicker.on(scope);

  /*
  ---------------------
  Error summary
  ---------------------
  */
  var $errorSummary = scope.querySelector('[data-module="error-summary"]');
  new _errorSummary["default"]($errorSummary).init();

  /*
  ---------------------
  Input Regex - used on date fields
  ---------------------
  */
  var jsSelectorRegex = scope.querySelectorAll('input[data-input-regex]');
  for (var _c8 = 0; _c8 < jsSelectorRegex.length; _c8++) {
    new _regexInputMask["default"](jsSelectorRegex[_c8]);
  }

  /*
  ---------------------
  Modal
  ---------------------
  */
  var modals = scope.querySelectorAll('.fds-modal');
  for (var d = 0; d < modals.length; d++) {
    new _modal["default"](modals[d]).init();
  }

  /*
  ---------------------
  Navigation
  ---------------------
  */
  new _navigation["default"]().init();

  /*
  ---------------------
  Radiobutton group collapse
  ---------------------
  */
  var jsSelectorRadioCollapse = scope.getElementsByClassName('js-radio-toggle-group');
  for (var _c9 = 0; _c9 < jsSelectorRadioCollapse.length; _c9++) {
    new _radioToggleContent["default"](jsSelectorRadioCollapse[_c9]).init();
  }

  /*
  ---------------------
  Responsive tables
  ---------------------
  */
  var jsSelectorTable = scope.querySelectorAll('table.table--responsive-headers, table.table-sm-responsive-headers, table.table-md-responsive-headers, table.table-lg-responsive-headers');
  for (var _c10 = 0; _c10 < jsSelectorTable.length; _c10++) {
    new _table["default"](jsSelectorTable[_c10]);
  }

  /*
  ---------------------
  Selectable rows in table
  ---------------------
  */
  var jsSelectableTable = scope.querySelectorAll('table.table--selectable');
  for (var _c11 = 0; _c11 < jsSelectableTable.length; _c11++) {
    new _selectableTable["default"](jsSelectableTable[_c11]).init();
  }

  /*
  ---------------------
  Tabnav
  ---------------------
  */
  var jsSelectorTabnav = scope.getElementsByClassName('tabnav');
  for (var _c12 = 0; _c12 < jsSelectorTabnav.length; _c12++) {
    new _tabnav["default"](jsSelectorTabnav[_c12]).init();
  }

  /*
  ---------------------
  Tooltip
  ---------------------
  */
  var jsSelectorTooltip = scope.getElementsByClassName('js-tooltip');
  for (var _c13 = 0; _c13 < jsSelectorTooltip.length; _c13++) {
    new _tooltip["default"](jsSelectorTooltip[_c13]).init();
  }
};
var initCustomElements = function initCustomElements() {
  if (customElements.get('fds-alert') === undefined) {
    window.customElements.define('fds-alert', _fdsAlert["default"]);
  }
};
module.exports = {
  init: init,
  Accordion: _accordion["default"],
  Alert: _alert["default"],
  BackToTop: _backToTop["default"],
  CharacterLimit: _characterLimit["default"],
  CheckboxToggleContent: _checkboxToggleContent["default"],
  Dropdown: _dropdown["default"],
  DropdownSort: _dropdownSort["default"],
  datePicker: datePicker,
  ErrorSummary: _errorSummary["default"],
  InputRegexMask: _regexInputMask["default"],
  Modal: _modal["default"],
  Navigation: _navigation["default"],
  RadioToggleGroup: _radioToggleContent["default"],
  ResponsiveTable: _table["default"],
  TableSelectableRows: _selectableTable["default"],
  Tabnav: _tabnav["default"],
  Toast: _toast["default"],
  Tooltip: _tooltip["default"],
  initCustomElements: initCustomElements
};

},{"./components/accordion":72,"./components/alert":73,"./components/back-to-top":74,"./components/character-limit":75,"./components/checkbox-toggle-content":76,"./components/date-picker":77,"./components/dropdown":79,"./components/dropdown-sort":78,"./components/error-summary":80,"./components/fds-alert":81,"./components/modal":82,"./components/navigation":83,"./components/radio-toggle-content":84,"./components/regex-input-mask":85,"./components/selectable-table":86,"./components/table":87,"./components/tabnav":88,"./components/toast":89,"./components/tooltip":90,"./polyfills":98}],93:[function(require,module,exports){
"use strict";

module.exports = {
  // This used to be conditionally dependent on whether the
  // browser supported touch events; if it did, `CLICK` was set to
  // `touchstart`.  However, this had downsides:
  //
  // * It pre-empted mobile browsers' default behavior of detecting
  //   whether a touch turned into a scroll, thereby preventing
  //   users from using some of our components as scroll surfaces.
  //
  // * Some devices, such as the Microsoft Surface Pro, support *both*
  //   touch and clicks. This meant the conditional effectively dropped
  //   support for the user's mouse, frustrating users who preferred
  //   it on those systems.
  CLICK: 'click'
};

},{}],94:[function(require,module,exports){
(function (global){(function (){
"use strict";

require("../../Object/defineProperty");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
(function (undefined) {
  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Function/prototype/bind/detect.js
  var detect = ('bind' in Function.prototype);
  if (detect) return;

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Function.prototype.bind&flags=always
  Object.defineProperty(Function.prototype, 'bind', {
    value: function bind(that) {
      // .length is 1
      // add necessary es5-shim utilities
      var $Array = Array;
      var $Object = Object;
      var ObjectPrototype = $Object.prototype;
      var ArrayPrototype = $Array.prototype;
      var Empty = function Empty() {};
      var to_string = ObjectPrototype.toString;
      var hasToStringTag = typeof Symbol === 'function' && _typeof(Symbol.toStringTag) === 'symbol';
      var isCallable; /* inlined from https://npmjs.com/is-callable */
      var fnToStr = Function.prototype.toString,
        tryFunctionObject = function tryFunctionObject(value) {
          try {
            fnToStr.call(value);
            return true;
          } catch (e) {
            return false;
          }
        },
        fnClass = '[object Function]',
        genClass = '[object GeneratorFunction]';
      isCallable = function isCallable(value) {
        if (typeof value !== 'function') {
          return false;
        }
        if (hasToStringTag) {
          return tryFunctionObject(value);
        }
        var strClass = to_string.call(value);
        return strClass === fnClass || strClass === genClass;
      };
      var array_slice = ArrayPrototype.slice;
      var array_concat = ArrayPrototype.concat;
      var array_push = ArrayPrototype.push;
      var max = Math.max;
      // /add necessary es5-shim utilities

      // 1. Let Target be the this value.
      var target = this;
      // 2. If IsCallable(Target) is false, throw a TypeError exception.
      if (!isCallable(target)) {
        throw new TypeError('Function.prototype.bind called on incompatible ' + target);
      }
      // 3. Let A be a new (possibly empty) internal list of all of the
      //   argument values provided after thisArg (arg1, arg2 etc), in order.
      // XXX slicedArgs will stand in for "A" if used
      var args = array_slice.call(arguments, 1); // for normal call
      // 4. Let F be a new native ECMAScript object.
      // 11. Set the [[Prototype]] internal property of F to the standard
      //   built-in Function prototype object as specified in 15.3.3.1.
      // 12. Set the [[Call]] internal property of F as described in
      //   15.3.4.5.1.
      // 13. Set the [[Construct]] internal property of F as described in
      //   15.3.4.5.2.
      // 14. Set the [[HasInstance]] internal property of F as described in
      //   15.3.4.5.3.
      var bound;
      var binder = function binder() {
        if (this instanceof bound) {
          // 15.3.4.5.2 [[Construct]]
          // When the [[Construct]] internal method of a function object,
          // F that was created using the bind function is called with a
          // list of arguments ExtraArgs, the following steps are taken:
          // 1. Let target be the value of F's [[TargetFunction]]
          //   internal property.
          // 2. If target has no [[Construct]] internal method, a
          //   TypeError exception is thrown.
          // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
          //   property.
          // 4. Let args be a new list containing the same values as the
          //   list boundArgs in the same order followed by the same
          //   values as the list ExtraArgs in the same order.
          // 5. Return the result of calling the [[Construct]] internal
          //   method of target providing args as the arguments.

          var result = target.apply(this, array_concat.call(args, array_slice.call(arguments)));
          if ($Object(result) === result) {
            return result;
          }
          return this;
        } else {
          // 15.3.4.5.1 [[Call]]
          // When the [[Call]] internal method of a function object, F,
          // which was created using the bind function is called with a
          // this value and a list of arguments ExtraArgs, the following
          // steps are taken:
          // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
          //   property.
          // 2. Let boundThis be the value of F's [[BoundThis]] internal
          //   property.
          // 3. Let target be the value of F's [[TargetFunction]] internal
          //   property.
          // 4. Let args be a new list containing the same values as the
          //   list boundArgs in the same order followed by the same
          //   values as the list ExtraArgs in the same order.
          // 5. Return the result of calling the [[Call]] internal method
          //   of target providing boundThis as the this value and
          //   providing args as the arguments.

          // equiv: target.call(this, ...boundArgs, ...args)
          return target.apply(that, array_concat.call(args, array_slice.call(arguments)));
        }
      };

      // 15. If the [[Class]] internal property of Target is "Function", then
      //     a. Let L be the length property of Target minus the length of A.
      //     b. Set the length own property of F to either 0 or L, whichever is
      //       larger.
      // 16. Else set the length own property of F to 0.

      var boundLength = max(0, target.length - args.length);

      // 17. Set the attributes of the length own property of F to the values
      //   specified in 15.3.5.1.
      var boundArgs = [];
      for (var i = 0; i < boundLength; i++) {
        array_push.call(boundArgs, '$' + i);
      }

      // XXX Build a dynamic function with desired amount of arguments is the only
      // way to set the length property of a function.
      // In environments where Content Security Policies enabled (Chrome extensions,
      // for ex.) all use of eval or Function costructor throws an exception.
      // However in all of these environments Function.prototype.bind exists
      // and so this code will never be executed.
      bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);
      if (target.prototype) {
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        // Clean up dangling references.
        Empty.prototype = null;
      }

      // TODO
      // 18. Set the [[Extensible]] internal property of F to true.

      // TODO
      // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
      // 20. Call the [[DefineOwnProperty]] internal method of F with
      //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
      //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
      //   false.
      // 21. Call the [[DefineOwnProperty]] internal method of F with
      //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
      //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
      //   and false.

      // TODO
      // NOTE Function objects created using Function.prototype.bind do not
      // have a prototype property or the [[Code]], [[FormalParameters]], and
      // [[Scope]] internal properties.
      // XXX can't delete prototype in pure-js.

      // 22. Return F.
      return bound;
    }
  });
}).call('object' === (typeof window === "undefined" ? "undefined" : _typeof(window)) && window || 'object' === (typeof self === "undefined" ? "undefined" : _typeof(self)) && self || 'object' === (typeof global === "undefined" ? "undefined" : _typeof(global)) && global || {});

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../Object/defineProperty":95}],95:[function(require,module,exports){
(function (global){(function (){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
(function (undefined) {
  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Object/defineProperty/detect.js
  var detect =
  // In IE8, defineProperty could only act on DOM elements, so full support
  // for the feature requires the ability to set a property on an arbitrary object
  'defineProperty' in Object && function () {
    try {
      var a = {};
      Object.defineProperty(a, 'test', {
        value: 42
      });
      return true;
    } catch (e) {
      return false;
    }
  }();
  if (detect) return;

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Object.defineProperty&flags=always
  (function (nativeDefineProperty) {
    var supportsAccessors = Object.prototype.hasOwnProperty('__defineGetter__');
    var ERR_ACCESSORS_NOT_SUPPORTED = 'Getters & setters cannot be defined on this javascript engine';
    var ERR_VALUE_ACCESSORS = 'A property cannot both have accessors and be writable or have a value';
    Object.defineProperty = function defineProperty(object, property, descriptor) {
      // Where native support exists, assume it
      if (nativeDefineProperty && (object === window || object === document || object === Element.prototype || object instanceof Element)) {
        return nativeDefineProperty(object, property, descriptor);
      }
      if (object === null || !(object instanceof Object || _typeof(object) === 'object')) {
        throw new TypeError('Object.defineProperty called on non-object');
      }
      if (!(descriptor instanceof Object)) {
        throw new TypeError('Property description must be an object');
      }
      var propertyString = String(property);
      var hasValueOrWritable = 'value' in descriptor || 'writable' in descriptor;
      var getterType = 'get' in descriptor && _typeof(descriptor.get);
      var setterType = 'set' in descriptor && _typeof(descriptor.set);

      // handle descriptor.get
      if (getterType) {
        if (getterType !== 'function') {
          throw new TypeError('Getter must be a function');
        }
        if (!supportsAccessors) {
          throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
        }
        if (hasValueOrWritable) {
          throw new TypeError(ERR_VALUE_ACCESSORS);
        }
        Object.__defineGetter__.call(object, propertyString, descriptor.get);
      } else {
        object[propertyString] = descriptor.value;
      }

      // handle descriptor.set
      if (setterType) {
        if (setterType !== 'function') {
          throw new TypeError('Setter must be a function');
        }
        if (!supportsAccessors) {
          throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
        }
        if (hasValueOrWritable) {
          throw new TypeError(ERR_VALUE_ACCESSORS);
        }
        Object.__defineSetter__.call(object, propertyString, descriptor.set);
      }

      // OK to define value unconditionally - if a getter has been specified as well, an error would be thrown above
      if ('value' in descriptor) {
        object[propertyString] = descriptor.value;
      }
      return object;
    };
  })(Object.defineProperty);
}).call('object' === (typeof window === "undefined" ? "undefined" : _typeof(window)) && window || 'object' === (typeof self === "undefined" ? "undefined" : _typeof(self)) && self || 'object' === (typeof global === "undefined" ? "undefined" : _typeof(global)) && global || {});

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],96:[function(require,module,exports){
"use strict";

/* eslint-disable consistent-return */
/* eslint-disable func-names */
(function () {
  if (typeof window.CustomEvent === "function") return false;
  function CustomEvent(event, _params) {
    var params = _params || {
      bubbles: false,
      cancelable: false,
      detail: null
    };
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }
  window.CustomEvent = CustomEvent;
})();

},{}],97:[function(require,module,exports){
'use strict';

var elproto = window.HTMLElement.prototype;
var HIDDEN = 'hidden';
if (!(HIDDEN in elproto)) {
  Object.defineProperty(elproto, HIDDEN, {
    get: function get() {
      return this.hasAttribute(HIDDEN);
    },
    set: function set(value) {
      if (value) {
        this.setAttribute(HIDDEN, '');
      } else {
        this.removeAttribute(HIDDEN);
      }
    }
  });
}

},{}],98:[function(require,module,exports){
'use strict';

// polyfills HTMLElement.prototype.classList and DOMTokenList
require('classlist-polyfill');
// polyfills HTMLElement.prototype.hidden
require('./element-hidden');

// polyfills Number.isNaN()
require("./number-is-nan");

// polyfills CustomEvent
require("./custom-event");
require('core-js/fn/object/assign');
require('core-js/fn/array/from');

},{"./custom-event":96,"./element-hidden":97,"./number-is-nan":99,"classlist-polyfill":2,"core-js/fn/array/from":3,"core-js/fn/object/assign":4}],99:[function(require,module,exports){
"use strict";

Number.isNaN = Number.isNaN || function isNaN(input) {
  // eslint-disable-next-line no-self-compare
  return typeof input === "number" && input !== input;
};

},{}],100:[function(require,module,exports){
"use strict";

module.exports = function () {
  var htmlDocument = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  return htmlDocument.activeElement;
};

},{}],101:[function(require,module,exports){
"use strict";

var assign = require("object-assign");
var receptor = require("receptor");

/**
 * @name sequence
 * @param {...Function} seq an array of functions
 * @return { closure } callHooks
 */
// We use a named function here because we want it to inherit its lexical scope
// from the behavior props object, not from the module
var sequence = function sequence() {
  for (var _len = arguments.length, seq = new Array(_len), _key = 0; _key < _len; _key++) {
    seq[_key] = arguments[_key];
  }
  return function callHooks() {
    var _this = this;
    var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;
    seq.forEach(function (method) {
      if (typeof _this[method] === "function") {
        _this[method].call(_this, target);
      }
    });
  };
};

/**
 * @name behavior
 * @param {object} events
 * @param {object?} props
 * @return {receptor.behavior}
 */
module.exports = function (events, props) {
  return receptor.behavior(events, assign({
    on: sequence("init", "add"),
    off: sequence("teardown", "remove")
  }, props));
};

},{"object-assign":63,"receptor":70}],102:[function(require,module,exports){
'use strict';

var breakpoints = {
  'xs': 0,
  'sm': 576,
  'md': 768,
  'lg': 992,
  'xl': 1200
};
module.exports = breakpoints;

},{}],103:[function(require,module,exports){
"use strict";

// https://stackoverflow.com/a/7557433
function isElementInViewport(el) {
  var win = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
  var docEl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.documentElement;
  var rect = el.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (win.innerHeight || docEl.clientHeight) && rect.right <= (win.innerWidth || docEl.clientWidth);
}
module.exports = isElementInViewport;

},{}],104:[function(require,module,exports){
"use strict";

// iOS detection from: http://stackoverflow.com/a/9039885/177710
function isIosDevice() {
  return typeof navigator !== "undefined" && (navigator.userAgent.match(/(iPod|iPhone|iPad)/g) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) && !window.MSStream;
}
module.exports = isIosDevice;

},{}],105:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
/**
 * @name isElement
 * @desc returns whether or not the given argument is a DOM element.
 * @param {any} value
 * @return {boolean}
 */
var isElement = function isElement(value) {
  return value && _typeof(value) === "object" && value.nodeType === 1;
};

/**
 * @name select
 * @desc selects elements from the DOM by class selector or ID selector.
 * @param {string} selector - The selector to traverse the DOM with.
 * @param {Document|HTMLElement?} context - The context to traverse the DOM
 *   in. If not provided, it defaults to the document.
 * @return {HTMLElement[]} - An array of DOM nodes or an empty array.
 */
module.exports = function (selector, context) {
  if (typeof selector !== "string") {
    return [];
  }
  if (!context || !isElement(context)) {
    context = window.document; // eslint-disable-line no-param-reassign
  }

  var selection = context.querySelectorAll(selector);
  return Array.prototype.slice.call(selection);
};

},{}],106:[function(require,module,exports){
'use strict';

var EXPANDED = 'aria-expanded';
var CONTROLS = 'aria-controls';
var HIDDEN = 'aria-hidden';
module.exports = function (button, expanded) {
  if (typeof expanded !== 'boolean') {
    expanded = button.getAttribute(EXPANDED) === 'false';
  }
  button.setAttribute(EXPANDED, expanded);
  var id = button.getAttribute(CONTROLS);
  var controls = document.getElementById(id);
  if (!controls) {
    throw new Error('No toggle target found with id: "' + id + '"');
  }
  controls.setAttribute(HIDDEN, !expanded);
  return expanded;
};

},{}]},{},[92])(92)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXJyYXktZm9yZWFjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzc2xpc3QtcG9seWZpbGwvc3JjL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvZm4vYXJyYXkvZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ZuL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jbGFzc29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NyZWF0ZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2N0eC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RlZmluZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19mdW5jdGlvbi10by1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oYXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LWl0ZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNhbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyYXRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19saWJyYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1waWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9rZXlib2FyZGV2ZW50LWtleS1wb2x5ZmlsbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXRjaGVzLXNlbGVjdG9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2JlaGF2aW9yLmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9jbG9zZXN0LmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9jb21wb3NlLmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9kZWxlZ2F0ZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9saWIvZGVsZWdhdGVBbGwuanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2lnbm9yZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2tleW1hcC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2FjY29yZGlvbi5qcyIsInNyYy9qcy9jb21wb25lbnRzL2FsZXJ0LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvYmFjay10by10b3AuanMiLCJzcmMvanMvY29tcG9uZW50cy9jaGFyYWN0ZXItbGltaXQuanMiLCJzcmMvanMvY29tcG9uZW50cy9jaGVja2JveC10b2dnbGUtY29udGVudC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2RhdGUtcGlja2VyLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZHJvcGRvd24tc29ydC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2Ryb3Bkb3duLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZXJyb3Itc3VtbWFyeS5qcyIsInNyYy9qcy9jb21wb25lbnRzL2Zkcy1hbGVydC5qcyIsInNyYy9qcy9jb21wb25lbnRzL21vZGFsLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvbmF2aWdhdGlvbi5qcyIsInNyYy9qcy9jb21wb25lbnRzL3JhZGlvLXRvZ2dsZS1jb250ZW50LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvcmVnZXgtaW5wdXQtbWFzay5qcyIsInNyYy9qcy9jb21wb25lbnRzL3NlbGVjdGFibGUtdGFibGUuanMiLCJzcmMvanMvY29tcG9uZW50cy90YWJsZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RhYm5hdi5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RvYXN0LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvdG9vbHRpcC5qcyIsInNyYy9qcy9jb25maWcuanMiLCJzcmMvanMvZGtmZHMuanMiLCJzcmMvanMvZXZlbnRzLmpzIiwic3JjL2pzL3BvbHlmaWxscy9GdW5jdGlvbi9wcm90b3R5cGUvYmluZC5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvT2JqZWN0L2RlZmluZVByb3BlcnR5LmpzIiwic3JjL2pzL3BvbHlmaWxscy9jdXN0b20tZXZlbnQuanMiLCJzcmMvanMvcG9seWZpbGxzL2VsZW1lbnQtaGlkZGVuLmpzIiwic3JjL2pzL3BvbHlmaWxscy9pbmRleC5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvbnVtYmVyLWlzLW5hbi5qcyIsInNyYy9qcy91dGlscy9hY3RpdmUtZWxlbWVudC5qcyIsInNyYy9qcy91dGlscy9iZWhhdmlvci5qcyIsInNyYy9qcy91dGlscy9icmVha3BvaW50cy5qcyIsInNyYy9qcy91dGlscy9pcy1pbi12aWV3cG9ydC5qcyIsInNyYy9qcy91dGlscy9pcy1pb3MtZGV2aWNlLmpzIiwic3JjL2pzL3V0aWxzL3NlbGVjdC5qcyIsInNyYy9qcy91dGlscy90b2dnbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTs7QUFFWixNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsT0FBTyxDQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFO0VBQ3ZELElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRTtJQUNiLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQztJQUM5QjtFQUNKO0VBQ0EsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFFLENBQUMsRUFBRTtJQUNsQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQztFQUMxQztBQUNKLENBQUM7Ozs7O0FDckJEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUEsSUFBSSxVQUFVLElBQUksTUFBTSxDQUFDLElBQUksRUFBRTtFQUUvQjtFQUNBO0VBQ0EsSUFBSSxFQUFFLFdBQVcsSUFBSSxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQzdDLFFBQVEsQ0FBQyxlQUFlLElBQUksRUFBRSxXQUFXLElBQUksUUFBUSxDQUFDLGVBQWUsQ0FBQyw0QkFBNEIsRUFBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO0lBRTdHLFdBQVUsSUFBSSxFQUFFO01BRWpCLFlBQVk7O01BRVosSUFBSSxFQUFFLFNBQVMsSUFBSSxJQUFJLENBQUMsRUFBRTtNQUUxQixJQUNHLGFBQWEsR0FBRyxXQUFXO1FBQzNCLFNBQVMsR0FBRyxXQUFXO1FBQ3ZCLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUN0QyxNQUFNLEdBQUcsTUFBTTtRQUNmLE9BQU8sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxJQUFJLFlBQVk7VUFDakQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUM7UUFDdEMsQ0FBQztRQUNDLFVBQVUsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxJQUFJLFVBQVUsSUFBSSxFQUFFO1VBQzFELElBQ0csQ0FBQyxHQUFHLENBQUM7WUFDTCxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU07VUFFcEIsT0FBTyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFFO2NBQ2xDLE9BQU8sQ0FBQztZQUNUO1VBQ0Q7VUFDQSxPQUFPLENBQUMsQ0FBQztRQUNWO1FBQ0E7UUFBQTtRQUNFLEtBQUssR0FBRyxTQUFSLEtBQUssQ0FBYSxJQUFJLEVBQUUsT0FBTyxFQUFFO1VBQ2xDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSTtVQUNoQixJQUFJLENBQUMsSUFBSSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUM7VUFDOUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPO1FBQ3ZCLENBQUM7UUFDQyxxQkFBcUIsR0FBRyxTQUF4QixxQkFBcUIsQ0FBYSxTQUFTLEVBQUUsS0FBSyxFQUFFO1VBQ3JELElBQUksS0FBSyxLQUFLLEVBQUUsRUFBRTtZQUNqQixNQUFNLElBQUksS0FBSyxDQUNaLFlBQVksRUFDWiw0Q0FBNEMsQ0FDOUM7VUFDRjtVQUNBLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNyQixNQUFNLElBQUksS0FBSyxDQUNaLHVCQUF1QixFQUN2QixzQ0FBc0MsQ0FDeEM7VUFDRjtVQUNBLE9BQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDO1FBQ3pDLENBQUM7UUFDQyxTQUFTLEdBQUcsU0FBWixTQUFTLENBQWEsSUFBSSxFQUFFO1VBQzdCLElBQ0csY0FBYyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDL0QsT0FBTyxHQUFHLGNBQWMsR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUU7WUFDM0QsQ0FBQyxHQUFHLENBQUM7WUFDTCxHQUFHLEdBQUcsT0FBTyxDQUFDLE1BQU07VUFFdkIsT0FBTyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1VBQ3RCO1VBQ0EsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFlBQVk7WUFDbkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1VBQzVDLENBQUM7UUFDRixDQUFDO1FBQ0MsY0FBYyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1FBQzFDLGVBQWUsR0FBRyxTQUFsQixlQUFlLENBQUEsRUFBZTtVQUMvQixPQUFPLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQztRQUMzQixDQUFDO01BRUY7TUFDQTtNQUNBLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO01BQ25DLGNBQWMsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLEVBQUU7UUFDbEMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSTtNQUN2QixDQUFDO01BQ0QsY0FBYyxDQUFDLFFBQVEsR0FBRyxVQUFVLEtBQUssRUFBRTtRQUMxQyxLQUFLLElBQUksRUFBRTtRQUNYLE9BQU8scUJBQXFCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUNqRCxDQUFDO01BQ0QsY0FBYyxDQUFDLEdBQUcsR0FBRyxZQUFZO1FBQ2hDLElBQ0csTUFBTSxHQUFHLFNBQVM7VUFDbEIsQ0FBQyxHQUFHLENBQUM7VUFDTCxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU07VUFDakIsS0FBSztVQUNMLE9BQU8sR0FBRyxLQUFLO1FBRWxCLEdBQUc7VUFDRixLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUU7VUFDdEIsSUFBSSxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDOUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDaEIsT0FBTyxHQUFHLElBQUk7VUFDZjtRQUNELENBQUMsUUFDTSxFQUFFLENBQUMsR0FBRyxDQUFDO1FBRWQsSUFBSSxPQUFPLEVBQUU7VUFDWixJQUFJLENBQUMsZ0JBQWdCLEVBQUU7UUFDeEI7TUFDRCxDQUFDO01BQ0QsY0FBYyxDQUFDLE1BQU0sR0FBRyxZQUFZO1FBQ25DLElBQ0csTUFBTSxHQUFHLFNBQVM7VUFDbEIsQ0FBQyxHQUFHLENBQUM7VUFDTCxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU07VUFDakIsS0FBSztVQUNMLE9BQU8sR0FBRyxLQUFLO1VBQ2YsS0FBSztRQUVSLEdBQUc7VUFDRixLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUU7VUFDdEIsS0FBSyxHQUFHLHFCQUFxQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUM7VUFDMUMsT0FBTyxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3JCLE9BQU8sR0FBRyxJQUFJO1lBQ2QsS0FBSyxHQUFHLHFCQUFxQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUM7VUFDM0M7UUFDRCxDQUFDLFFBQ00sRUFBRSxDQUFDLEdBQUcsQ0FBQztRQUVkLElBQUksT0FBTyxFQUFFO1VBQ1osSUFBSSxDQUFDLGdCQUFnQixFQUFFO1FBQ3hCO01BQ0QsQ0FBQztNQUNELGNBQWMsQ0FBQyxNQUFNLEdBQUcsVUFBVSxLQUFLLEVBQUUsS0FBSyxFQUFFO1FBQy9DLEtBQUssSUFBSSxFQUFFO1FBRVgsSUFDRyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7VUFDN0IsTUFBTSxHQUFHLE1BQU0sR0FDaEIsS0FBSyxLQUFLLElBQUksSUFBSSxRQUFRLEdBRTFCLEtBQUssS0FBSyxLQUFLLElBQUksS0FBSztRQUcxQixJQUFJLE1BQU0sRUFBRTtVQUNYLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDcEI7UUFFQSxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxLQUFLLEtBQUssRUFBRTtVQUN0QyxPQUFPLEtBQUs7UUFDYixDQUFDLE1BQU07VUFDTixPQUFPLENBQUMsTUFBTTtRQUNmO01BQ0QsQ0FBQztNQUNELGNBQWMsQ0FBQyxRQUFRLEdBQUcsWUFBWTtRQUNyQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO01BQ3RCLENBQUM7TUFFRCxJQUFJLE1BQU0sQ0FBQyxjQUFjLEVBQUU7UUFDMUIsSUFBSSxpQkFBaUIsR0FBRztVQUNyQixHQUFHLEVBQUUsZUFBZTtVQUNwQixVQUFVLEVBQUUsSUFBSTtVQUNoQixZQUFZLEVBQUU7UUFDakIsQ0FBQztRQUNELElBQUk7VUFDSCxNQUFNLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxhQUFhLEVBQUUsaUJBQWlCLENBQUM7UUFDdEUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1VBQUU7VUFDZDtVQUNBO1VBQ0EsSUFBSSxFQUFFLENBQUMsTUFBTSxLQUFLLFNBQVMsSUFBSSxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsVUFBVSxFQUFFO1lBQ3pELGlCQUFpQixDQUFDLFVBQVUsR0FBRyxLQUFLO1lBQ3BDLE1BQU0sQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQztVQUN0RTtRQUNEO01BQ0QsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLGdCQUFnQixFQUFFO1FBQzlDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsZUFBZSxDQUFDO01BQzlEO0lBRUEsQ0FBQyxFQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7RUFFZDs7RUFFQTtFQUNBOztFQUVDLGFBQVk7SUFDWixZQUFZOztJQUVaLElBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDO0lBRTdDLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7O0lBRXJDO0lBQ0E7SUFDQSxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDMUMsSUFBSSxZQUFZLEdBQUcsU0FBZixZQUFZLENBQVksTUFBTSxFQUFFO1FBQ25DLElBQUksUUFBUSxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO1FBRTdDLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsVUFBUyxLQUFLLEVBQUU7VUFDaEQsSUFBSSxDQUFDO1lBQUUsR0FBRyxHQUFHLFNBQVMsQ0FBQyxNQUFNO1VBRTdCLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3pCLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQztVQUMzQjtRQUNELENBQUM7TUFDRixDQUFDO01BQ0QsWUFBWSxDQUFDLEtBQUssQ0FBQztNQUNuQixZQUFZLENBQUMsUUFBUSxDQUFDO0lBQ3ZCO0lBRUEsV0FBVyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQzs7SUFFekM7SUFDQTtJQUNBLElBQUksV0FBVyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDekMsSUFBSSxPQUFPLEdBQUcsWUFBWSxDQUFDLFNBQVMsQ0FBQyxNQUFNO01BRTNDLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFVBQVMsS0FBSyxFQUFFLEtBQUssRUFBRTtRQUN0RCxJQUFJLENBQUMsSUFBSSxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFO1VBQ3ZELE9BQU8sS0FBSztRQUNiLENBQUMsTUFBTTtVQUNOLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO1FBQ2pDO01BQ0QsQ0FBQztJQUVGO0lBRUEsV0FBVyxHQUFHLElBQUk7RUFDbkIsQ0FBQyxHQUFFO0FBRUg7Ozs7O0FDL09BLE9BQU8sQ0FBQyxtQ0FBbUMsQ0FBQztBQUM1QyxPQUFPLENBQUMsOEJBQThCLENBQUM7QUFDdkMsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSTs7Ozs7QUNGMUQsT0FBTyxDQUFDLGlDQUFpQyxDQUFDO0FBQzFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU07Ozs7O0FDRDdELE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxFQUFFLEVBQUU7RUFDN0IsSUFBSSxPQUFPLEVBQUUsSUFBSSxVQUFVLEVBQUUsTUFBTSxTQUFTLENBQUMsRUFBRSxHQUFHLHFCQUFxQixDQUFDO0VBQ3hFLE9BQU8sRUFBRTtBQUNYLENBQUM7Ozs7O0FDSEQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQztBQUN0QyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsRUFBRSxFQUFFO0VBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxTQUFTLENBQUMsRUFBRSxHQUFHLG9CQUFvQixDQUFDO0VBQzdELE9BQU8sRUFBRTtBQUNYLENBQUM7Ozs7O0FDSkQ7QUFDQTtBQUNBLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUM7QUFDeEMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQztBQUN0QyxJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUM7QUFDckQsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLFdBQVcsRUFBRTtFQUN0QyxPQUFPLFVBQVUsS0FBSyxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUU7SUFDckMsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQztJQUN4QixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUMvQixJQUFJLEtBQUssR0FBRyxlQUFlLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQztJQUM5QyxJQUFJLEtBQUs7SUFDVDtJQUNBO0lBQ0EsSUFBSSxXQUFXLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxPQUFPLE1BQU0sR0FBRyxLQUFLLEVBQUU7TUFDbEQsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztNQUNsQjtNQUNBLElBQUksS0FBSyxJQUFJLEtBQUssRUFBRSxPQUFPLElBQUk7TUFDakM7SUFDQSxDQUFDLE1BQU0sT0FBTSxNQUFNLEdBQUcsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLElBQUksV0FBVyxJQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7TUFDbkUsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sV0FBVyxJQUFJLEtBQUssSUFBSSxDQUFDO0lBQ3ZEO0lBQUUsT0FBTyxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUM7RUFDN0IsQ0FBQztBQUNILENBQUM7Ozs7O0FDdEJEO0FBQ0EsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztBQUMzQixJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsYUFBYSxDQUFDO0FBQzFDO0FBQ0EsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLFlBQVk7RUFBRSxPQUFPLFNBQVM7QUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLFdBQVc7O0FBRWpFO0FBQ0EsSUFBSSxNQUFNLEdBQUcsU0FBVCxNQUFNLENBQWEsRUFBRSxFQUFFLEdBQUcsRUFBRTtFQUM5QixJQUFJO0lBQ0YsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDO0VBQ2hCLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFFO0FBQ2hCLENBQUM7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsRUFBRSxFQUFFO0VBQzdCLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0VBQ1gsT0FBTyxFQUFFLEtBQUssU0FBUyxHQUFHLFdBQVcsR0FBRyxFQUFFLEtBQUssSUFBSSxHQUFHO0VBQ3BEO0VBQUEsRUFDRSxRQUFRLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLFFBQVEsR0FBRztFQUN6RDtFQUFBLEVBQ0UsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0VBQ2I7RUFBQSxFQUNFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLElBQUksT0FBTyxDQUFDLENBQUMsTUFBTSxJQUFJLFVBQVUsR0FBRyxXQUFXLEdBQUcsQ0FBQztBQUNqRixDQUFDOzs7OztBQ3RCRCxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRO0FBRTFCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxFQUFFLEVBQUU7RUFDN0IsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkMsQ0FBQzs7Ozs7QUNKRCxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHO0VBQUUsT0FBTyxFQUFFO0FBQVMsQ0FBQztBQUNqRCxJQUFJLE9BQU8sR0FBRyxJQUFJLFFBQVEsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUM7OztBQ0R4QyxZQUFZOztBQUNaLElBQUksZUFBZSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUM7QUFDN0MsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDO0FBRTVDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtFQUMvQyxJQUFJLEtBQUssSUFBSSxNQUFNLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUN2RSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSztBQUM1QixDQUFDOzs7OztBQ1BEO0FBQ0EsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQztBQUN4QyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7RUFDM0MsU0FBUyxDQUFDLEVBQUUsQ0FBQztFQUNiLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRSxPQUFPLEVBQUU7RUFDakMsUUFBUSxNQUFNO0lBQ1osS0FBSyxDQUFDO01BQUUsT0FBTyxVQUFVLENBQUMsRUFBRTtRQUMxQixPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztNQUN6QixDQUFDO0lBQ0QsS0FBSyxDQUFDO01BQUUsT0FBTyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDN0IsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO01BQzVCLENBQUM7SUFDRCxLQUFLLENBQUM7TUFBRSxPQUFPLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDaEMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztNQUMvQixDQUFDO0VBQUM7RUFFSixPQUFPLFNBQVU7RUFBQSxHQUFlO0lBQzlCLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDO0VBQ2xDLENBQUM7QUFDSCxDQUFDOzs7OztBQ25CRDtBQUNBLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxFQUFFLEVBQUU7RUFDN0IsSUFBSSxFQUFFLElBQUksU0FBUyxFQUFFLE1BQU0sU0FBUyxDQUFDLHdCQUF3QixHQUFHLEVBQUUsQ0FBQztFQUNuRSxPQUFPLEVBQUU7QUFDWCxDQUFDOzs7OztBQ0pEO0FBQ0EsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxZQUFZO0VBQ2hELE9BQU8sTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFBRSxHQUFHLEVBQUUsU0FBQSxJQUFBLEVBQVk7TUFBRSxPQUFPLENBQUM7SUFBRTtFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ2xGLENBQUMsQ0FBQzs7Ozs7QUNIRixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDO0FBQ3RDLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRO0FBQzVDO0FBQ0EsSUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDO0FBQy9ELE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxFQUFFLEVBQUU7RUFDN0IsT0FBTyxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0MsQ0FBQzs7Ozs7QUNORDtBQUNBLE1BQU0sQ0FBQyxPQUFPLEdBQ1osK0ZBQStGLENBQy9GLEtBQUssQ0FBQyxHQUFHLENBQUM7Ozs7O0FDSFosSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQztBQUNqQyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO0FBQzdCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7QUFDN0IsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQztBQUNyQyxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO0FBQzNCLElBQUksU0FBUyxHQUFHLFdBQVc7QUFFM0IsSUFBSSxPQUFPLEdBQUcsU0FBVixPQUFPLENBQWEsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7RUFDMUMsSUFBSSxTQUFTLEdBQUcsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDO0VBQ2hDLElBQUksU0FBUyxHQUFHLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQztFQUNoQyxJQUFJLFNBQVMsR0FBRyxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUM7RUFDaEMsSUFBSSxRQUFRLEdBQUcsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDO0VBQy9CLElBQUksT0FBTyxHQUFHLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQztFQUM5QixJQUFJLE1BQU0sR0FBRyxTQUFTLEdBQUcsTUFBTSxHQUFHLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDO0VBQ25ILElBQUksT0FBTyxHQUFHLFNBQVMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztFQUNoRSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0VBQzlELElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRztFQUN0QixJQUFJLFNBQVMsRUFBRSxNQUFNLEdBQUcsSUFBSTtFQUM1QixLQUFLLEdBQUcsSUFBSSxNQUFNLEVBQUU7SUFDbEI7SUFDQSxHQUFHLEdBQUcsQ0FBQyxTQUFTLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxTQUFTO0lBQ3ZEO0lBQ0EsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLE1BQU0sR0FBRyxNQUFNLEVBQUUsR0FBRyxDQUFDO0lBQ2xDO0lBQ0EsR0FBRyxHQUFHLE9BQU8sSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsR0FBRyxRQUFRLElBQUksT0FBTyxHQUFHLElBQUksVUFBVSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUc7SUFDOUc7SUFDQSxJQUFJLE1BQU0sRUFBRSxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDeEQ7SUFDQSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQ2hELElBQUksUUFBUSxJQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUc7RUFDM0Q7QUFDRixDQUFDO0FBQ0QsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJO0FBQ2xCO0FBQ0EsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBRztBQUNqQixPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFHO0FBQ2pCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUc7QUFDakIsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBRztBQUNqQixPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFFO0FBQ2pCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUU7QUFDakIsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBRTtBQUNqQixPQUFPLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTzs7Ozs7QUMxQ3hCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxJQUFJLEVBQUU7RUFDL0IsSUFBSTtJQUNGLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRTtFQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUU7SUFDVixPQUFPLElBQUk7RUFDYjtBQUNGLENBQUM7Ozs7O0FDTkQsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsMkJBQTJCLEVBQUUsUUFBUSxDQUFDLFFBQVEsQ0FBQzs7Ozs7QUNBckY7QUFDQSxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sTUFBTSxJQUFJLFdBQVcsSUFBSSxNQUFNLENBQUMsSUFBSSxJQUFJLElBQUksR0FDN0UsTUFBTSxHQUFHLE9BQU8sSUFBSSxJQUFJLFdBQVcsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksR0FBRztBQUM3RDtBQUFBLEVBQ0UsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFO0FBQzdCLElBQUksT0FBTyxHQUFHLElBQUksUUFBUSxFQUFFLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQzs7Ozs7QUNMMUMsSUFBSSxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUMsY0FBYztBQUN0QyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsRUFBRSxFQUFFLEdBQUcsRUFBRTtFQUNsQyxPQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQztBQUNyQyxDQUFDOzs7OztBQ0hELElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUM7QUFDaEMsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDO0FBQzVDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsVUFBVSxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRTtFQUN6RSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2hELENBQUMsR0FBRyxVQUFVLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO0VBQ2hDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLO0VBQ25CLE9BQU8sTUFBTTtBQUNmLENBQUM7Ozs7O0FDUEQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVE7QUFDNUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLElBQUksUUFBUSxDQUFDLGVBQWU7Ozs7O0FDRHJELE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxZQUFZO0VBQzlFLE9BQU8sTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQUUsR0FBRyxFQUFFLFNBQUEsSUFBQSxFQUFZO01BQUUsT0FBTyxDQUFDO0lBQUU7RUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUMvRyxDQUFDLENBQUM7Ozs7O0FDRkY7QUFDQSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO0FBQzNCO0FBQ0EsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxHQUFHLFVBQVUsRUFBRSxFQUFFO0VBQzVFLE9BQU8sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUM7QUFDeEQsQ0FBQzs7Ozs7QUNMRDtBQUNBLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUM7QUFDdkMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFVBQVUsQ0FBQztBQUM1QyxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsU0FBUztBQUVoQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsRUFBRSxFQUFFO0VBQzdCLE9BQU8sRUFBRSxLQUFLLFNBQVMsS0FBSyxTQUFTLENBQUMsS0FBSyxLQUFLLEVBQUUsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3BGLENBQUM7Ozs7OztBQ1BELE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxFQUFFLEVBQUU7RUFDN0IsT0FBTyxPQUFBLENBQU8sRUFBRSxNQUFLLFFBQVEsR0FBRyxFQUFFLEtBQUssSUFBSSxHQUFHLE9BQU8sRUFBRSxLQUFLLFVBQVU7QUFDeEUsQ0FBQzs7Ozs7QUNGRDtBQUNBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUM7QUFDdEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLFFBQVEsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRTtFQUN2RCxJQUFJO0lBQ0YsT0FBTyxPQUFPLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDO0lBQy9EO0VBQ0EsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0lBQ1YsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztJQUM1QixJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkQsTUFBTSxDQUFDO0VBQ1Q7QUFDRixDQUFDOzs7QUNYRCxZQUFZOztBQUNaLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQztBQUN4QyxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUM7QUFDNUMsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDO0FBQ3BELElBQUksaUJBQWlCLEdBQUcsQ0FBQyxDQUFDOztBQUUxQjtBQUNBLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsWUFBWTtFQUFFLE9BQU8sSUFBSTtBQUFFLENBQUMsQ0FBQztBQUVsRyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsV0FBVyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7RUFDbEQsV0FBVyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsaUJBQWlCLEVBQUU7SUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJO0VBQUUsQ0FBQyxDQUFDO0VBQ2hGLGNBQWMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxHQUFHLFdBQVcsQ0FBQztBQUNqRCxDQUFDOzs7QUNaRCxZQUFZOztBQUNaLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7QUFDbkMsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQztBQUNsQyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDO0FBQ3JDLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7QUFDN0IsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQztBQUN2QyxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7QUFDM0MsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDO0FBQ3BELElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUM7QUFDN0MsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFVBQVUsQ0FBQztBQUM1QyxJQUFJLEtBQUssR0FBRyxFQUFFLEVBQUUsQ0FBQyxJQUFJLElBQUksTUFBTSxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0MsSUFBSSxXQUFXLEdBQUcsWUFBWTtBQUM5QixJQUFJLElBQUksR0FBRyxNQUFNO0FBQ2pCLElBQUksTUFBTSxHQUFHLFFBQVE7QUFFckIsSUFBSSxVQUFVLEdBQUcsU0FBYixVQUFVLENBQUEsRUFBZTtFQUFFLE9BQU8sSUFBSTtBQUFFLENBQUM7QUFFN0MsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLElBQUksRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRTtFQUNqRixXQUFXLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUM7RUFDcEMsSUFBSSxTQUFTLEdBQUcsU0FBWixTQUFTLENBQWEsSUFBSSxFQUFFO0lBQzlCLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRSxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDL0MsUUFBUSxJQUFJO01BQ1YsS0FBSyxJQUFJO1FBQUUsT0FBTyxTQUFTLElBQUksQ0FBQSxFQUFHO1VBQUUsT0FBTyxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO1FBQUUsQ0FBQztNQUN6RSxLQUFLLE1BQU07UUFBRSxPQUFPLFNBQVMsTUFBTSxDQUFBLEVBQUc7VUFBRSxPQUFPLElBQUksV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7UUFBRSxDQUFDO0lBQUM7SUFDOUUsT0FBTyxTQUFTLE9BQU8sQ0FBQSxFQUFHO01BQUUsT0FBTyxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO0lBQUUsQ0FBQztFQUNyRSxDQUFDO0VBQ0QsSUFBSSxHQUFHLEdBQUcsSUFBSSxHQUFHLFdBQVc7RUFDNUIsSUFBSSxVQUFVLEdBQUcsT0FBTyxJQUFJLE1BQU07RUFDbEMsSUFBSSxVQUFVLEdBQUcsS0FBSztFQUN0QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUztFQUMxQixJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLE9BQU8sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDO0VBQ2hGLElBQUksUUFBUSxHQUFHLE9BQU8sSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDO0VBQzVDLElBQUksUUFBUSxHQUFHLE9BQU8sR0FBRyxDQUFDLFVBQVUsR0FBRyxRQUFRLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLFNBQVM7RUFDbEYsSUFBSSxVQUFVLEdBQUcsSUFBSSxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxJQUFJLE9BQU8sR0FBRyxPQUFPO0VBQ3JFLElBQUksT0FBTyxFQUFFLEdBQUcsRUFBRSxpQkFBaUI7RUFDbkM7RUFDQSxJQUFJLFVBQVUsRUFBRTtJQUNkLGlCQUFpQixHQUFHLGNBQWMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQztJQUMvRCxJQUFJLGlCQUFpQixLQUFLLE1BQU0sQ0FBQyxTQUFTLElBQUksaUJBQWlCLENBQUMsSUFBSSxFQUFFO01BQ3BFO01BQ0EsY0FBYyxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUM7TUFDNUM7TUFDQSxJQUFJLENBQUMsT0FBTyxJQUFJLE9BQU8saUJBQWlCLENBQUMsUUFBUSxDQUFDLElBQUksVUFBVSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxRQUFRLEVBQUUsVUFBVSxDQUFDO0lBQ2pIO0VBQ0Y7RUFDQTtFQUNBLElBQUksVUFBVSxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtJQUNwRCxVQUFVLEdBQUcsSUFBSTtJQUNqQixRQUFRLEdBQUcsU0FBUyxNQUFNLENBQUEsRUFBRztNQUFFLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7SUFBRSxDQUFDO0VBQzdEO0VBQ0E7RUFDQSxJQUFJLENBQUMsQ0FBQyxPQUFPLElBQUksTUFBTSxNQUFNLEtBQUssSUFBSSxVQUFVLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRTtJQUNyRSxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUM7RUFDakM7RUFDQTtFQUNBLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRO0VBQzFCLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxVQUFVO0VBQzNCLElBQUksT0FBTyxFQUFFO0lBQ1gsT0FBTyxHQUFHO01BQ1IsTUFBTSxFQUFFLFVBQVUsR0FBRyxRQUFRLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQztNQUNqRCxJQUFJLEVBQUUsTUFBTSxHQUFHLFFBQVEsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDO01BQ3pDLE9BQU8sRUFBRTtJQUNYLENBQUM7SUFDRCxJQUFJLE1BQU0sRUFBRSxLQUFLLEdBQUcsSUFBSSxPQUFPLEVBQUU7TUFDL0IsSUFBSSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekQsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLFVBQVUsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUM7RUFDOUU7RUFDQSxPQUFPLE9BQU87QUFDaEIsQ0FBQzs7Ozs7QUNwRUQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFVBQVUsQ0FBQztBQUM1QyxJQUFJLFlBQVksR0FBRyxLQUFLO0FBRXhCLElBQUk7RUFDRixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0VBQzNCLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxZQUFZO0lBQUUsWUFBWSxHQUFHLElBQUk7RUFBRSxDQUFDO0VBQ3REO0VBQ0EsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsWUFBWTtJQUFFLE1BQU0sQ0FBQztFQUFFLENBQUMsQ0FBQztBQUM3QyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBRTtBQUVkLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxJQUFJLEVBQUUsV0FBVyxFQUFFO0VBQzVDLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxZQUFZLEVBQUUsT0FBTyxLQUFLO0VBQy9DLElBQUksSUFBSSxHQUFHLEtBQUs7RUFDaEIsSUFBSTtJQUNGLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2IsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0lBQzFCLElBQUksQ0FBQyxJQUFJLEdBQUcsWUFBWTtNQUFFLE9BQU87UUFBRSxJQUFJLEVBQUUsSUFBSSxHQUFHO01BQUssQ0FBQztJQUFFLENBQUM7SUFDekQsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLFlBQVk7TUFBRSxPQUFPLElBQUk7SUFBRSxDQUFDO0lBQzVDLElBQUksQ0FBQyxHQUFHLENBQUM7RUFDWCxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBRTtFQUNkLE9BQU8sSUFBSTtBQUNiLENBQUM7Ozs7O0FDckJELE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDOzs7OztBQ0FuQixNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUs7OztBQ0F0QixZQUFZOztBQUNaO0FBQ0EsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDO0FBQzNDLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztBQUN2QyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7QUFDcEMsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQztBQUNsQyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDO0FBQ3RDLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7QUFDbkMsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU07O0FBRTNCO0FBQ0EsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsWUFBWTtFQUMzRCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDVixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDVjtFQUNBLElBQUksQ0FBQyxHQUFHLE1BQU0sRUFBRTtFQUNoQixJQUFJLENBQUMsR0FBRyxzQkFBc0I7RUFDOUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7RUFDUixDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRTtJQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0VBQUUsQ0FBQyxDQUFDO0VBQy9DLE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO0FBQzVFLENBQUMsQ0FBQyxHQUFHLFNBQVMsTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUU7RUFBRTtFQUNyQyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO0VBQ3hCLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxNQUFNO0VBQzNCLElBQUksS0FBSyxHQUFHLENBQUM7RUFDYixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQztFQUN2QixJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztFQUNsQixPQUFPLElBQUksR0FBRyxLQUFLLEVBQUU7SUFDbkIsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ25DLElBQUksSUFBSSxHQUFHLFVBQVUsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDckUsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU07SUFDeEIsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNULElBQUksR0FBRztJQUNQLE9BQU8sTUFBTSxHQUFHLENBQUMsRUFBRTtNQUNqQixHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDO01BQ2YsSUFBSSxDQUFDLFdBQVcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUMxRDtFQUNGO0VBQUUsT0FBTyxDQUFDO0FBQ1osQ0FBQyxHQUFHLE9BQU87Ozs7O0FDckNYO0FBQ0EsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQztBQUN0QyxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDO0FBQ2xDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQztBQUM3QyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsVUFBVSxDQUFDO0FBQ25ELElBQUksS0FBSyxHQUFHLFNBQVIsS0FBSyxDQUFBLEVBQWUsQ0FBRSxZQUFhO0FBQ3ZDLElBQUksU0FBUyxHQUFHLFdBQVc7O0FBRTNCO0FBQ0EsSUFBSSxXQUFVLEdBQUcsU0FBQSxXQUFBLEVBQVk7RUFDM0I7RUFDQSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsUUFBUSxDQUFDO0VBQy9DLElBQUksQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNO0VBQzFCLElBQUksRUFBRSxHQUFHLEdBQUc7RUFDWixJQUFJLEVBQUUsR0FBRyxHQUFHO0VBQ1osSUFBSSxjQUFjO0VBQ2xCLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU07RUFDN0IsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7RUFDdEMsTUFBTSxDQUFDLEdBQUcsR0FBRyxhQUFhLENBQUMsQ0FBQztFQUM1QjtFQUNBO0VBQ0EsY0FBYyxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUTtFQUM5QyxjQUFjLENBQUMsSUFBSSxFQUFFO0VBQ3JCLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLFFBQVEsR0FBRyxFQUFFLEdBQUcsbUJBQW1CLEdBQUcsRUFBRSxHQUFHLFNBQVMsR0FBRyxFQUFFLENBQUM7RUFDcEYsY0FBYyxDQUFDLEtBQUssRUFBRTtFQUN0QixXQUFVLEdBQUcsY0FBYyxDQUFDLENBQUM7RUFDN0IsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLFdBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDeEQsT0FBTyxXQUFVLEVBQUU7QUFDckIsQ0FBQztBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxTQUFTLE1BQU0sQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFO0VBQy9ELElBQUksTUFBTTtFQUNWLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRTtJQUNkLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQzlCLE1BQU0sR0FBRyxJQUFJLEtBQUssRUFBRTtJQUNwQixLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSTtJQUN2QjtJQUNBLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO0VBQ3RCLENBQUMsTUFBTSxNQUFNLEdBQUcsV0FBVSxFQUFFO0VBQzVCLE9BQU8sVUFBVSxLQUFLLFNBQVMsR0FBRyxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUM7QUFDcEUsQ0FBQzs7Ozs7QUN4Q0QsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQztBQUN0QyxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUM7QUFDakQsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDO0FBQzVDLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxjQUFjO0FBRTlCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsTUFBTSxDQUFDLGNBQWMsR0FBRyxTQUFTLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRTtFQUN4RyxRQUFRLENBQUMsQ0FBQyxDQUFDO0VBQ1gsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDO0VBQ3hCLFFBQVEsQ0FBQyxVQUFVLENBQUM7RUFDcEIsSUFBSSxjQUFjLEVBQUUsSUFBSTtJQUN0QixPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQztFQUM3QixDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBRTtFQUNkLElBQUksS0FBSyxJQUFJLFVBQVUsSUFBSSxLQUFLLElBQUksVUFBVSxFQUFFLE1BQU0sU0FBUyxDQUFDLDBCQUEwQixDQUFDO0VBQzNGLElBQUksT0FBTyxJQUFJLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUs7RUFDbEQsT0FBTyxDQUFDO0FBQ1YsQ0FBQzs7Ozs7QUNmRCxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDO0FBQ2hDLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUM7QUFDdEMsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDO0FBRXZDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixHQUFHLFNBQVMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRTtFQUM5RyxRQUFRLENBQUMsQ0FBQyxDQUFDO0VBQ1gsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQztFQUM5QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTTtFQUN4QixJQUFJLENBQUMsR0FBRyxDQUFDO0VBQ1QsSUFBSSxDQUFDO0VBQ0wsT0FBTyxNQUFNLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDeEQsT0FBTyxDQUFDO0FBQ1YsQ0FBQzs7Ozs7QUNaRCxPQUFPLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxxQkFBcUI7Ozs7O0FDQXhDO0FBQ0EsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztBQUMzQixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDO0FBQ3RDLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxVQUFVLENBQUM7QUFDbkQsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLFNBQVM7QUFFbEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsY0FBYyxJQUFJLFVBQVUsQ0FBQyxFQUFFO0VBQ3JELENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO0VBQ2YsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQztFQUN4QyxJQUFJLE9BQU8sQ0FBQyxDQUFDLFdBQVcsSUFBSSxVQUFVLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxXQUFXLEVBQUU7SUFDcEUsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLFNBQVM7RUFDaEM7RUFBRSxPQUFPLENBQUMsWUFBWSxNQUFNLEdBQUcsV0FBVyxHQUFHLElBQUk7QUFDbkQsQ0FBQzs7Ozs7QUNaRCxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO0FBQzNCLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUM7QUFDeEMsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3RELElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxVQUFVLENBQUM7QUFFbkQsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLE1BQU0sRUFBRSxLQUFLLEVBQUU7RUFDeEMsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQztFQUN6QixJQUFJLENBQUMsR0FBRyxDQUFDO0VBQ1QsSUFBSSxNQUFNLEdBQUcsRUFBRTtFQUNmLElBQUksR0FBRztFQUNQLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztFQUNuRTtFQUNBLE9BQU8sS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0lBQ3JELENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztFQUNoRDtFQUNBLE9BQU8sTUFBTTtBQUNmLENBQUM7Ozs7O0FDaEJEO0FBQ0EsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDO0FBQzlDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQztBQUU3QyxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLElBQUksU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFO0VBQy9DLE9BQU8sS0FBSyxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUM7QUFDOUIsQ0FBQzs7Ozs7QUNORCxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLG9CQUFvQjs7Ozs7QUNBbkMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLE1BQU0sRUFBRSxLQUFLLEVBQUU7RUFDeEMsT0FBTztJQUNMLFVBQVUsRUFBRSxFQUFFLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDekIsWUFBWSxFQUFFLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUMzQixRQUFRLEVBQUUsRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZCLEtBQUssRUFBRTtFQUNULENBQUM7QUFDSCxDQUFDOzs7OztBQ1BELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7QUFDakMsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztBQUM3QixJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO0FBQzNCLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDbEMsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDO0FBQ2hELElBQUksU0FBUyxHQUFHLFVBQVU7QUFDMUIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUM7QUFFM0MsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGFBQWEsR0FBRyxVQUFVLEVBQUUsRUFBRTtFQUMvQyxPQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQzNCLENBQUM7QUFFRCxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUU7RUFDN0MsSUFBSSxVQUFVLEdBQUcsT0FBTyxHQUFHLElBQUksVUFBVTtFQUN6QyxJQUFJLFVBQVUsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQztFQUMxRCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUU7RUFDcEIsSUFBSSxVQUFVLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0VBQzdGLElBQUksQ0FBQyxLQUFLLE1BQU0sRUFBRTtJQUNoQixDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRztFQUNkLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFO0lBQ2hCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNiLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztFQUNuQixDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDakIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUc7RUFDZCxDQUFDLE1BQU07SUFDTCxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7RUFDbkI7RUFDRjtBQUNBLENBQUMsRUFBRSxRQUFRLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLFFBQVEsQ0FBQSxFQUFHO0VBQ3BELE9BQU8sT0FBTyxJQUFJLElBQUksVUFBVSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztBQUN2RSxDQUFDLENBQUM7Ozs7O0FDOUJGLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0FBQ25DLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7QUFDM0IsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLGFBQWEsQ0FBQztBQUUxQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUU7RUFDeEMsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRTtJQUFFLFlBQVksRUFBRSxJQUFJO0lBQUUsS0FBSyxFQUFFO0VBQUksQ0FBQyxDQUFDO0FBQ3RHLENBQUM7Ozs7O0FDTkQsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN6QyxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO0FBQzNCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxHQUFHLEVBQUU7RUFDOUIsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoRCxDQUFDOzs7OztBQ0pELElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7QUFDN0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQztBQUNqQyxJQUFJLE1BQU0sR0FBRyxvQkFBb0I7QUFDakMsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUVuRCxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxHQUFHLEVBQUUsS0FBSyxFQUFFO0VBQ3RDLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLEtBQUssU0FBUyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN0RSxDQUFDLEVBQUUsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQztFQUN0QixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87RUFDckIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxNQUFNLEdBQUcsUUFBUTtFQUMvQyxTQUFTLEVBQUU7QUFDYixDQUFDLENBQUM7Ozs7O0FDWEYsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQztBQUN4QyxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO0FBQ25DO0FBQ0E7QUFDQSxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsU0FBUyxFQUFFO0VBQ3BDLE9BQU8sVUFBVSxJQUFJLEVBQUUsR0FBRyxFQUFFO0lBQzFCLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0IsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQztJQUN0QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTTtJQUNoQixJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ1IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxTQUFTLEdBQUcsRUFBRSxHQUFHLFNBQVM7SUFDdEQsQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ25CLE9BQU8sQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLE1BQU0sSUFBSSxDQUFDLEdBQUcsTUFBTSxHQUM5RixTQUFTLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQzNCLFNBQVMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxJQUFJLEVBQUUsS0FBSyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsT0FBTztFQUNqRixDQUFDO0FBQ0gsQ0FBQzs7Ozs7QUNoQkQsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQztBQUN4QyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRztBQUNsQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRztBQUNsQixNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsS0FBSyxFQUFFLE1BQU0sRUFBRTtFQUN4QyxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQztFQUN4QixPQUFPLEtBQUssR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssR0FBRyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUM7QUFDaEUsQ0FBQzs7Ozs7QUNORDtBQUNBLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJO0FBQ3BCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLO0FBQ3RCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxFQUFFLEVBQUU7RUFDN0IsT0FBTyxLQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQztBQUMxRCxDQUFDOzs7OztBQ0xEO0FBQ0EsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztBQUNuQyxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO0FBQ25DLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxFQUFFLEVBQUU7RUFDN0IsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdCLENBQUM7Ozs7O0FDTEQ7QUFDQSxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDO0FBQ3hDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHO0FBQ2xCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxFQUFFLEVBQUU7RUFDN0IsT0FBTyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM1RCxDQUFDOzs7OztBQ0xEO0FBQ0EsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztBQUNuQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsRUFBRSxFQUFFO0VBQzdCLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM1QixDQUFDOzs7OztBQ0pEO0FBQ0EsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQztBQUN0QztBQUNBO0FBQ0EsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUU7RUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUU7RUFDNUIsSUFBSSxFQUFFLEVBQUUsR0FBRztFQUNYLElBQUksQ0FBQyxJQUFJLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxVQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLEdBQUc7RUFDNUYsSUFBSSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksVUFBVSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxHQUFHO0VBQ3RGLElBQUksQ0FBQyxDQUFDLElBQUksUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLFVBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sR0FBRztFQUM3RixNQUFNLFNBQVMsQ0FBQyx5Q0FBeUMsQ0FBQztBQUM1RCxDQUFDOzs7OztBQ1hELElBQUksRUFBRSxHQUFHLENBQUM7QUFDVixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ3RCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxHQUFHLEVBQUU7RUFDOUIsT0FBTyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxTQUFTLEdBQUcsRUFBRSxHQUFHLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZGLENBQUM7Ozs7O0FDSkQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUN2QyxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO0FBQzNCLElBQUksT0FBTSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNO0FBQ3hDLElBQUksVUFBVSxHQUFHLE9BQU8sT0FBTSxJQUFJLFVBQVU7QUFFNUMsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLElBQUksRUFBRTtFQUM5QyxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQ2hDLFVBQVUsSUFBSSxPQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTSxHQUFHLEdBQUcsRUFBRSxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDaEYsQ0FBQztBQUVELFFBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSzs7Ozs7QUNWdEIsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztBQUNuQyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsVUFBVSxDQUFDO0FBQzVDLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUM7QUFDdkMsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsVUFBVSxFQUFFLEVBQUU7RUFDcEUsSUFBSSxFQUFFLElBQUksU0FBUyxFQUFFLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUNuQyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQ2hCLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0IsQ0FBQzs7O0FDUEQsWUFBWTs7QUFDWixJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO0FBQzNCLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7QUFDbEMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQztBQUN0QyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDO0FBQ2xDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQztBQUM3QyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDO0FBQ3RDLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQztBQUNsRCxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUM7QUFFckQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFVBQVUsSUFBSSxFQUFFO0VBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUU7RUFDMUc7RUFDQSxJQUFJLEVBQUUsU0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGdEQUFnRDtJQUM1RSxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDO0lBQzNCLElBQUksQ0FBQyxHQUFHLE9BQU8sSUFBSSxJQUFJLFVBQVUsR0FBRyxJQUFJLEdBQUcsS0FBSztJQUNoRCxJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsTUFBTTtJQUMzQixJQUFJLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTO0lBQy9DLElBQUksT0FBTyxHQUFHLEtBQUssS0FBSyxTQUFTO0lBQ2pDLElBQUksS0FBSyxHQUFHLENBQUM7SUFDYixJQUFJLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLElBQUksTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUTtJQUNsQyxJQUFJLE9BQU8sRUFBRSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZFO0lBQ0EsSUFBSSxNQUFNLElBQUksU0FBUyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEtBQUssSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRTtNQUMvRCxLQUFLLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUN6RixjQUFjLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7TUFDeEc7SUFDRixDQUFDLE1BQU07TUFDTCxNQUFNLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7TUFDM0IsS0FBSyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxHQUFHLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUNwRCxjQUFjLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDNUU7SUFDRjtJQUNBLE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSztJQUNyQixPQUFPLE1BQU07RUFDZjtBQUNGLENBQUMsQ0FBQzs7Ozs7QUNwQ0Y7QUFDQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO0FBRWxDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFO0VBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxrQkFBa0I7QUFBRSxDQUFDLENBQUM7OztBQ0hqRixZQUFZOztBQUNaLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUM7O0FBRXZDO0FBQ0EsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxVQUFVLFFBQVEsRUFBRTtFQUM5RCxJQUFJLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0VBQzVCLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQWdCO0VBQzlCO0FBQ0EsQ0FBQyxFQUFFLFlBQVk7RUFDYixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRTtFQUNmLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFO0VBQ25CLElBQUksS0FBSztFQUNULElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsT0FBTztJQUFFLEtBQUssRUFBRSxTQUFTO0lBQUUsSUFBSSxFQUFFO0VBQUssQ0FBQztFQUM5RCxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUM7RUFDckIsSUFBSSxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTTtFQUN2QixPQUFPO0lBQUUsS0FBSyxFQUFFLEtBQUs7SUFBRSxJQUFJLEVBQUU7RUFBTSxDQUFDO0FBQ3RDLENBQUMsQ0FBQzs7Ozs7QUNoQkY7O0FBRUEsQ0FBQyxZQUFZO0VBRVgsSUFBSSx3QkFBd0IsR0FBRztJQUM3QixRQUFRLEVBQUUsUUFBUTtJQUNsQixJQUFJLEVBQUU7TUFDSixDQUFDLEVBQUUsUUFBUTtNQUNYLENBQUMsRUFBRSxNQUFNO01BQ1QsQ0FBQyxFQUFFLFdBQVc7TUFDZCxDQUFDLEVBQUUsS0FBSztNQUNSLEVBQUUsRUFBRSxPQUFPO01BQ1gsRUFBRSxFQUFFLE9BQU87TUFDWCxFQUFFLEVBQUUsT0FBTztNQUNYLEVBQUUsRUFBRSxTQUFTO01BQ2IsRUFBRSxFQUFFLEtBQUs7TUFDVCxFQUFFLEVBQUUsT0FBTztNQUNYLEVBQUUsRUFBRSxVQUFVO01BQ2QsRUFBRSxFQUFFLFFBQVE7TUFDWixFQUFFLEVBQUUsU0FBUztNQUNiLEVBQUUsRUFBRSxZQUFZO01BQ2hCLEVBQUUsRUFBRSxRQUFRO01BQ1osRUFBRSxFQUFFLFlBQVk7TUFDaEIsRUFBRSxFQUFFLEdBQUc7TUFDUCxFQUFFLEVBQUUsUUFBUTtNQUNaLEVBQUUsRUFBRSxVQUFVO01BQ2QsRUFBRSxFQUFFLEtBQUs7TUFDVCxFQUFFLEVBQUUsTUFBTTtNQUNWLEVBQUUsRUFBRSxXQUFXO01BQ2YsRUFBRSxFQUFFLFNBQVM7TUFDYixFQUFFLEVBQUUsWUFBWTtNQUNoQixFQUFFLEVBQUUsV0FBVztNQUNmLEVBQUUsRUFBRSxRQUFRO01BQ1osRUFBRSxFQUFFLE9BQU87TUFDWCxFQUFFLEVBQUUsU0FBUztNQUNiLEVBQUUsRUFBRSxhQUFhO01BQ2pCLEVBQUUsRUFBRSxRQUFRO01BQ1osRUFBRSxFQUFFLFFBQVE7TUFDWixFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO01BQ2QsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztNQUNkLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7TUFDZCxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO01BQ2QsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztNQUNkLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7TUFDZCxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO01BQ2QsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztNQUNkLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7TUFDZCxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO01BQ2QsRUFBRSxFQUFFLElBQUk7TUFDUixFQUFFLEVBQUUsYUFBYTtNQUNqQixHQUFHLEVBQUUsU0FBUztNQUNkLEdBQUcsRUFBRSxZQUFZO01BQ2pCLEdBQUcsRUFBRSxZQUFZO01BQ2pCLEdBQUcsRUFBRSxZQUFZO01BQ2pCLEdBQUcsRUFBRSxVQUFVO01BQ2YsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztNQUNmLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7TUFDZixHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO01BQ2YsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztNQUNmLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7TUFDZixHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO01BQ2YsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztNQUNmLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7TUFDZixHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDO01BQ2hCLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7TUFDZixHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO01BQ2YsR0FBRyxFQUFFLE1BQU07TUFDWCxHQUFHLEVBQUUsVUFBVTtNQUNmLEdBQUcsRUFBRSxNQUFNO01BQ1gsR0FBRyxFQUFFLE9BQU87TUFDWixHQUFHLEVBQUUsT0FBTztNQUNaLEdBQUcsRUFBRSxVQUFVO01BQ2YsR0FBRyxFQUFFLE1BQU07TUFDWCxHQUFHLEVBQUU7SUFDUDtFQUNGLENBQUM7O0VBRUQ7RUFDQSxJQUFJLENBQUM7RUFDTCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUN2Qix3QkFBd0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0VBQ2xEOztFQUVBO0VBQ0EsSUFBSSxNQUFNLEdBQUcsRUFBRTtFQUNmLEtBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ3hCLE1BQU0sR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUMvQix3QkFBd0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO0VBQ2pGO0VBRUEsU0FBUyxRQUFRLENBQUEsRUFBSTtJQUNuQixJQUFJLEVBQUUsZUFBZSxJQUFJLE1BQU0sQ0FBQyxJQUM1QixLQUFLLElBQUksYUFBYSxDQUFDLFNBQVMsRUFBRTtNQUNwQyxPQUFPLEtBQUs7SUFDZDs7SUFFQTtJQUNBLElBQUksS0FBSyxHQUFHO01BQ1YsR0FBRyxFQUFFLFNBQUEsSUFBVSxDQUFDLEVBQUU7UUFDaEIsSUFBSSxHQUFHLEdBQUcsd0JBQXdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUVuRSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7VUFDdEIsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDM0I7UUFFQSxPQUFPLEdBQUc7TUFDWjtJQUNGLENBQUM7SUFDRCxNQUFNLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQztJQUM1RCxPQUFPLEtBQUs7RUFDZDtFQUVBLElBQUksT0FBTyxNQUFNLEtBQUssVUFBVSxJQUFJLE1BQU0sQ0FBQyxHQUFHLEVBQUU7SUFDOUMsTUFBTSxDQUFDLDRCQUE0QixFQUFFLHdCQUF3QixDQUFDO0VBQ2hFLENBQUMsTUFBTSxJQUFJLE9BQU8sT0FBTyxLQUFLLFdBQVcsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7SUFDMUUsTUFBTSxDQUFDLE9BQU8sR0FBRyx3QkFBd0I7RUFDM0MsQ0FBQyxNQUFNLElBQUksTUFBTSxFQUFFO0lBQ2pCLE1BQU0sQ0FBQyx3QkFBd0IsR0FBRyx3QkFBd0I7RUFDNUQ7QUFFRixDQUFDLEdBQUc7OztBQ3hISixZQUFZOztBQUVaLElBQUksS0FBSyxHQUFHLE9BQU8sT0FBTyxLQUFLLFdBQVcsR0FBRyxPQUFPLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNuRSxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxJQUNyQixLQUFLLENBQUMsZUFBZSxJQUNyQixLQUFLLENBQUMscUJBQXFCLElBQzNCLEtBQUssQ0FBQyxrQkFBa0IsSUFDeEIsS0FBSyxDQUFDLGlCQUFpQixJQUN2QixLQUFLLENBQUMsZ0JBQWdCO0FBRTNCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSzs7QUFFdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTLEtBQUssQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFO0VBQzNCLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLFFBQVEsS0FBSyxDQUFDLEVBQUUsT0FBTyxLQUFLO0VBQzFDLElBQUksTUFBTSxFQUFFLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDO0VBQzVDLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDO0VBQ3BELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ3JDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxPQUFPLElBQUk7RUFDakM7RUFDQSxPQUFPLEtBQUs7QUFDZDs7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsWUFBWTs7QUFDWjtBQUNBLElBQUkscUJBQXFCLEdBQUcsTUFBTSxDQUFDLHFCQUFxQjtBQUN4RCxJQUFJLGNBQWMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWM7QUFDcEQsSUFBSSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFvQjtBQUU1RCxTQUFTLFFBQVEsQ0FBQyxHQUFHLEVBQUU7RUFDdEIsSUFBSSxHQUFHLEtBQUssSUFBSSxJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7SUFDdEMsTUFBTSxJQUFJLFNBQVMsQ0FBQyx1REFBdUQsQ0FBQztFQUM3RTtFQUVBLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUNuQjtBQUVBLFNBQVMsZUFBZSxDQUFBLEVBQUc7RUFDMUIsSUFBSTtJQUNILElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO01BQ25CLE9BQU8sS0FBSztJQUNiOztJQUVBOztJQUVBO0lBQ0EsSUFBSSxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBRTtJQUNoQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSTtJQUNmLElBQUksTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtNQUNqRCxPQUFPLEtBQUs7SUFDYjs7SUFFQTtJQUNBLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztJQUNkLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7TUFDNUIsS0FBSyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUN4QztJQUNBLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUU7TUFDL0QsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2hCLENBQUMsQ0FBQztJQUNGLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxZQUFZLEVBQUU7TUFDckMsT0FBTyxLQUFLO0lBQ2I7O0lBRUE7SUFDQSxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDZCxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsTUFBTSxFQUFFO01BQzFELEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNO0lBQ3ZCLENBQUMsQ0FBQztJQUNGLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUNoRCxzQkFBc0IsRUFBRTtNQUN6QixPQUFPLEtBQUs7SUFDYjtJQUVBLE9BQU8sSUFBSTtFQUNaLENBQUMsQ0FBQyxPQUFPLEdBQUcsRUFBRTtJQUNiO0lBQ0EsT0FBTyxLQUFLO0VBQ2I7QUFDRDtBQUVBLE1BQU0sQ0FBQyxPQUFPLEdBQUcsZUFBZSxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxVQUFVLE1BQU0sRUFBRSxNQUFNLEVBQUU7RUFDOUUsSUFBSSxJQUFJO0VBQ1IsSUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztFQUN6QixJQUFJLE9BQU87RUFFWCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUMxQyxJQUFJLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUUzQixLQUFLLElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtNQUNyQixJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1FBQ25DLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO01BQ3BCO0lBQ0Q7SUFFQSxJQUFJLHFCQUFxQixFQUFFO01BQzFCLE9BQU8sR0FBRyxxQkFBcUIsQ0FBQyxJQUFJLENBQUM7TUFDckMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDeEMsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1VBQzVDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDO01BQ0Q7SUFDRDtFQUNEO0VBRUEsT0FBTyxFQUFFO0FBQ1YsQ0FBQzs7Ozs7O0FDekZELElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUM7QUFDdkMsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztBQUN0QyxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDO0FBRTVDLElBQU0sZ0JBQWdCLEdBQUcseUJBQXlCO0FBQ2xELElBQU0sS0FBSyxHQUFHLEdBQUc7QUFFakIsSUFBTSxZQUFZLEdBQUcsU0FBZixZQUFZLENBQVksSUFBSSxFQUFFLE9BQU8sRUFBRTtFQUMzQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDO0VBQ3hDLElBQUksUUFBUTtFQUNaLElBQUksS0FBSyxFQUFFO0lBQ1QsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDZixRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztFQUNyQjtFQUVBLElBQUksT0FBTztFQUNYLElBQUksT0FBQSxDQUFPLE9BQU8sTUFBSyxRQUFRLEVBQUU7SUFDL0IsT0FBTyxHQUFHO01BQ1IsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDO01BQ25DLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLFNBQVM7SUFDcEMsQ0FBQztFQUNIO0VBRUEsSUFBSSxRQUFRLEdBQUc7SUFDYixRQUFRLEVBQUUsUUFBUTtJQUNsQixRQUFRLEVBQUcsT0FBQSxDQUFPLE9BQU8sTUFBSyxRQUFRLEdBQ2xDLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FDcEIsUUFBUSxHQUNOLFFBQVEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQzNCLE9BQU87SUFDYixPQUFPLEVBQUU7RUFDWCxDQUFDO0VBRUQsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO0lBQzVCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBUyxLQUFLLEVBQUU7TUFDM0MsT0FBTyxNQUFNLENBQUM7UUFBQyxJQUFJLEVBQUU7TUFBSyxDQUFDLEVBQUUsUUFBUSxDQUFDO0lBQ3hDLENBQUMsQ0FBQztFQUNKLENBQUMsTUFBTTtJQUNMLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSTtJQUNwQixPQUFPLENBQUMsUUFBUSxDQUFDO0VBQ25CO0FBQ0YsQ0FBQztBQUVELElBQUksTUFBTSxHQUFHLFNBQVQsTUFBTSxDQUFZLEdBQUcsRUFBRSxHQUFHLEVBQUU7RUFDOUIsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUNwQixPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDZixPQUFPLEtBQUs7QUFDZCxDQUFDO0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLFFBQVEsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFO0VBQ2hELElBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQ2xDLE1BQU0sQ0FBQyxVQUFTLElBQUksRUFBRSxJQUFJLEVBQUU7SUFDM0IsSUFBSSxTQUFTLEdBQUcsWUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztFQUMvQixDQUFDLEVBQUUsRUFBRSxDQUFDO0VBRVIsT0FBTyxNQUFNLENBQUM7SUFDWixHQUFHLEVBQUUsU0FBUyxXQUFXLENBQUMsT0FBTyxFQUFFO01BQ2pDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBUyxRQUFRLEVBQUU7UUFDbkMsT0FBTyxDQUFDLGdCQUFnQixDQUN0QixRQUFRLENBQUMsSUFBSSxFQUNiLFFBQVEsQ0FBQyxRQUFRLEVBQ2pCLFFBQVEsQ0FBQyxPQUFPLENBQ2pCO01BQ0gsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUNELE1BQU0sRUFBRSxTQUFTLGNBQWMsQ0FBQyxPQUFPLEVBQUU7TUFDdkMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFTLFFBQVEsRUFBRTtRQUNuQyxPQUFPLENBQUMsbUJBQW1CLENBQ3pCLFFBQVEsQ0FBQyxJQUFJLEVBQ2IsUUFBUSxDQUFDLFFBQVEsRUFDakIsUUFBUSxDQUFDLE9BQU8sQ0FDakI7TUFDSCxDQUFDLENBQUM7SUFDSjtFQUNGLENBQUMsRUFBRSxLQUFLLENBQUM7QUFDWCxDQUFDOzs7OztBQzVFRCxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUM7QUFFM0MsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLE9BQU8sRUFBRSxRQUFRLEVBQUU7RUFDM0MsR0FBRztJQUNELElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsRUFBRTtNQUM5QixPQUFPLE9BQU87SUFDaEI7RUFDRixDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsS0FBSyxPQUFPLENBQUMsUUFBUSxLQUFLLENBQUM7QUFDbkUsQ0FBQzs7Ozs7QUNSRCxNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsT0FBTyxDQUFDLFNBQVMsRUFBRTtFQUMzQyxPQUFPLFVBQVMsQ0FBQyxFQUFFO0lBQ2pCLE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFTLEVBQUUsRUFBRTtNQUNqQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUs7SUFDbkMsQ0FBQyxFQUFFLElBQUksQ0FBQztFQUNWLENBQUM7QUFDSCxDQUFDOzs7OztBQ05ELElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7QUFFcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFO0VBQy9DLE9BQU8sU0FBUyxVQUFVLENBQUMsS0FBSyxFQUFFO0lBQ2hDLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQztJQUM1QyxJQUFJLE1BQU0sRUFBRTtNQUNWLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDO0lBQy9CO0VBQ0YsQ0FBQztBQUNILENBQUM7Ozs7O0FDVEQsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztBQUN0QyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO0FBRXBDLElBQU0sS0FBSyxHQUFHLEdBQUc7QUFFakIsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLFdBQVcsQ0FBQyxTQUFTLEVBQUU7RUFDL0MsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7O0VBRW5DO0VBQ0E7RUFDQTtFQUNBLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssRUFBRTtJQUMxQyxPQUFPLFNBQVMsQ0FBQyxLQUFLLENBQUM7RUFDekI7RUFFQSxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVMsSUFBSSxFQUFFLFFBQVEsRUFBRTtJQUNyRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDbEQsT0FBTyxJQUFJO0VBQ2IsQ0FBQyxFQUFFLEVBQUUsQ0FBQztFQUNOLE9BQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQztBQUMzQixDQUFDOzs7OztBQ3BCRCxNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUU7RUFDNUMsT0FBTyxTQUFTLFNBQVMsQ0FBQyxDQUFDLEVBQUU7SUFDM0IsSUFBSSxPQUFPLEtBQUssQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFO01BQ3ZELE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3pCO0VBQ0YsQ0FBQztBQUNILENBQUM7OztBQ05ELFlBQVk7O0FBRVosTUFBTSxDQUFDLE9BQU8sR0FBRztFQUNmLFFBQVEsRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDO0VBQy9CLFFBQVEsRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDO0VBQy9CLFdBQVcsRUFBRSxPQUFPLENBQUMsZUFBZSxDQUFDO0VBQ3JDLE1BQU0sRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDO0VBQzNCLE1BQU0sRUFBRSxPQUFPLENBQUMsVUFBVTtBQUM1QixDQUFDOzs7OztBQ1JELE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQzs7QUFFckM7QUFDQTtBQUNBO0FBQ0EsSUFBTSxTQUFTLEdBQUc7RUFDaEIsS0FBSyxFQUFPLFFBQVE7RUFDcEIsU0FBUyxFQUFHLFNBQVM7RUFDckIsTUFBTSxFQUFNLFNBQVM7RUFDckIsT0FBTyxFQUFLO0FBQ2QsQ0FBQztBQUVELElBQU0sa0JBQWtCLEdBQUcsR0FBRztBQUU5QixJQUFNLFdBQVcsR0FBRyxTQUFkLFdBQVcsQ0FBWSxLQUFLLEVBQUUsWUFBWSxFQUFFO0VBQ2hELElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHO0VBQ25CLElBQUksWUFBWSxFQUFFO0lBQ2hCLEtBQUssSUFBSSxRQUFRLElBQUksU0FBUyxFQUFFO01BQzlCLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUN2QyxHQUFHLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDO01BQ2hEO0lBQ0Y7RUFDRjtFQUNBLE9BQU8sR0FBRztBQUNaLENBQUM7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsTUFBTSxDQUFDLElBQUksRUFBRTtFQUNyQyxJQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFTLEdBQUcsRUFBRTtJQUN4RCxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDN0MsQ0FBQyxDQUFDO0VBQ0YsT0FBTyxVQUFTLEtBQUssRUFBRTtJQUNyQixJQUFJLEdBQUcsR0FBRyxXQUFXLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQztJQUMxQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUM1QixNQUFNLENBQUMsVUFBUyxNQUFNLEVBQUUsSUFBSSxFQUFFO01BQzdCLElBQUksSUFBSSxJQUFJLElBQUksRUFBRTtRQUNoQixNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO01BQ3RDO01BQ0EsT0FBTyxNQUFNO0lBQ2YsQ0FBQyxFQUFFLFNBQVMsQ0FBQztFQUNqQixDQUFDO0FBQ0gsQ0FBQztBQUVELE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLFNBQVM7OztBQzFDcEMsWUFBWTs7QUFBQyxNQUFBLENBQUEsY0FBQSxDQUFBLE9BQUE7RUFBQSxLQUFBO0FBQUE7QUFBQSxPQUFBO0FBQ2IsT0FBQTtBQUNBLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztBQUN6QyxJQUFNLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQztBQUM5RCxJQUFNLE1BQU0scUNBQXFDO0FBQ2pELElBQU0sUUFBUSxHQUFHLGVBQWU7QUFDaEMsSUFBTSw4QkFBOEIsR0FBRyw0QkFBNEI7QUFDbkUsSUFBTSxjQUFjLEdBQUc7RUFDbkIsVUFBVSxFQUFFLFVBQVU7RUFDdEIsV0FBVyxFQUFFO0FBQ2pCLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsU0FBUyxDQUFDLFVBQVUsRUFBNEI7RUFBQSxJQUExQixPQUFPLEdBQUEsU0FBQSxDQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsU0FBQSxHQUFBLFNBQUEsTUFBRyxjQUFjO0VBQ25ELElBQUksQ0FBQyxVQUFVLEVBQUU7SUFDYixNQUFNLElBQUksS0FBSyxtQ0FBbUM7RUFDdEQ7RUFDQSxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVU7RUFDM0IsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPO0FBQ3ZCOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFlBQVk7RUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQztFQUN0RCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtJQUMxQixNQUFNLElBQUksS0FBSyw2QkFBNkI7RUFDaEQ7O0VBRUE7RUFDQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDMUMsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7O0lBRW5DO0lBQ0EsSUFBSSxRQUFRLEdBQUcsYUFBYSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxNQUFNO0lBQzlELElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQzs7SUFFMUM7SUFDQSxhQUFhLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsRUFBRSxLQUFLLENBQUM7SUFDOUYsYUFBYSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLEVBQUUsS0FBSyxDQUFDO0VBQy9GO0VBQ0E7RUFDQSxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLHNCQUFzQjtFQUN2RCxJQUFJLFdBQVcsS0FBSyxJQUFJLElBQUksV0FBVyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsRUFBRTtJQUNqRixJQUFJLENBQUMsa0JBQWtCLEdBQUcsV0FBVztJQUNyQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ2hGO0FBQ0osQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxTQUFTLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxZQUFZO0VBQ3hDLElBQUksT0FBTyxHQUFHLElBQUk7RUFDbEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRTtJQUNwRCxNQUFNLElBQUksS0FBSyw2QkFBNkI7RUFDaEQ7RUFDQSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtJQUM3QixNQUFNLElBQUksS0FBSyw2QkFBNkI7RUFDaEQ7RUFFQSxJQUFJLE1BQU0sR0FBRyxJQUFJO0VBQ2pCLElBQUksT0FBTyxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyw4QkFBOEIsQ0FBQyxLQUFLLE9BQU8sRUFBRTtJQUNyRixNQUFNLEdBQUcsS0FBSztFQUNsQjtFQUNBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUM3QyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQztFQUMxRDtFQUVBLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsOEJBQThCLEVBQUUsQ0FBQyxNQUFNLENBQUM7RUFDaEYsSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUU7SUFDbEIsT0FBTyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVE7RUFDN0QsQ0FBQyxNQUFNO0lBQ0gsT0FBTyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVM7RUFDOUQ7QUFDSixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxVQUFVLE9BQU8sRUFBRSxDQUFDLEVBQUU7RUFDckQsSUFBSSxPQUFPLEdBQUcsSUFBSTtFQUNsQixDQUFDLENBQUMsZUFBZSxFQUFFO0VBQ25CLENBQUMsQ0FBQyxjQUFjLEVBQUU7RUFDbEIsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUM7RUFDN0IsSUFBSSxPQUFPLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLE1BQU0sRUFBRTtJQUMzQztJQUNBO0lBQ0E7SUFDQSxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxDQUFDLGNBQWMsRUFBRTtFQUMvRDtBQUNKLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsVUFBVSxNQUFNLEVBQUUsUUFBUSxFQUFnQjtFQUFBLElBQWQsSUFBSSxHQUFBLFNBQUEsQ0FBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUEsR0FBQSxTQUFBLE1BQUcsS0FBSztFQUN2RSxJQUFJLFNBQVMsR0FBRyxJQUFJO0VBQ3BCLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRTtJQUM5RCxTQUFTLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFVO0VBQzVDLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFO0lBQ2hGLFNBQVMsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxVQUFVO0VBQ3ZEO0VBQ0EsUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDO0VBQ25DLElBQUksUUFBUSxFQUFFO0lBQ1YsSUFBSSxTQUFTLEdBQUcsSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUM7SUFDL0MsTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7RUFDbkMsQ0FBQyxNQUFNO0lBQ0gsSUFBSSxVQUFVLEdBQUcsSUFBSSxLQUFLLENBQUMscUJBQXFCLENBQUM7SUFDakQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUM7RUFDcEM7RUFFQSxJQUFJLFNBQVMsS0FBSyxJQUFJLEVBQUU7SUFDcEIsSUFBSSxZQUFZLEdBQUcsU0FBUyxDQUFDLHNCQUFzQjtJQUNuRCxJQUFJLFlBQVksS0FBSyxJQUFJLElBQUksWUFBWSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsRUFBRTtNQUNuRixJQUFJLE9BQU8sR0FBRyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDO01BQ2hELElBQUksSUFBSSxLQUFLLEtBQUssRUFBRTtRQUNoQixJQUFJLFdBQVcsR0FBRyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLHdCQUF3QixDQUFDO1FBQy9FLElBQUksU0FBUyxHQUFHLElBQUk7UUFFcEIsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLFdBQVcsQ0FBQyxNQUFNLEVBQUU7VUFDdkMsU0FBUyxHQUFHLEtBQUs7UUFDckI7UUFFQSxZQUFZLENBQUMsWUFBWSxDQUFDLDhCQUE4QixFQUFFLFNBQVMsQ0FBQztRQUNwRSxJQUFJLFNBQVMsS0FBSyxJQUFJLEVBQUU7VUFDcEIsWUFBWSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVE7UUFDL0MsQ0FBQyxNQUFNO1VBQ0gsWUFBWSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVM7UUFDaEQ7TUFDSjtJQUNKO0VBQ0o7QUFDSixDQUFDO0FBQUMsSUFBQSxRQUFBLEdBRWEsU0FBUztBQUFBLE9BQUEsY0FBQSxRQUFBOzs7QUNwSnhCLFlBQVk7O0FBQUMsTUFBQSxDQUFBLGNBQUEsQ0FBQSxPQUFBO0VBQUEsS0FBQTtBQUFBO0FBQUEsT0FBQTtBQUNiLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBQztFQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUs7QUFDdEI7QUFFQSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxZQUFVO0VBQzdCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsYUFBYSxDQUFDO0VBQzVELElBQUcsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUM7SUFDbEIsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUM1RDtBQUNKLENBQUM7QUFFRCxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxZQUFVO0VBQzdCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7RUFDbEMsSUFBSSxTQUFTLEdBQUcsSUFBSSxLQUFLLENBQUMsZ0JBQWdCLENBQUM7RUFDM0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDO0FBQ3ZDLENBQUM7QUFFRCxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxZQUFVO0VBQzdCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7RUFFckMsSUFBSSxTQUFTLEdBQUcsSUFBSSxLQUFLLENBQUMsZ0JBQWdCLENBQUM7RUFDM0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDO0FBQ3ZDLENBQUM7QUFBQyxJQUFBLFFBQUEsR0FFYSxLQUFLO0FBQUEsT0FBQSxjQUFBLFFBQUE7OztBQ3pCcEIsWUFBWTs7QUFBQyxNQUFBLENBQUEsY0FBQSxDQUFBLE9BQUE7RUFBQSxLQUFBO0FBQUE7QUFBQSxPQUFBO0FBRWIsU0FBUyxTQUFTLENBQUMsU0FBUyxFQUFDO0VBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUztBQUM5QjtBQUVBLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFlBQVc7RUFDbEMsSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDLFNBQVM7RUFFcEMscUJBQXFCLENBQUMsZUFBZSxDQUFDO0VBRXRDLElBQU0sUUFBUSxHQUFHLElBQUksZ0JBQWdCLENBQUUsVUFBQSxJQUFJLEVBQUk7SUFDM0MsSUFBTSxHQUFHLEdBQUcsSUFBSSxXQUFXLENBQUMsYUFBYSxFQUFFO01BQUMsTUFBTSxFQUFFO0lBQUksQ0FBQyxDQUFDO0lBQzFELFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQztFQUNwQyxDQUFDLENBQUM7O0VBRUY7RUFDQSxJQUFJLE1BQU0sR0FBRztJQUNULFVBQVUsRUFBYyxJQUFJO0lBQzVCLGlCQUFpQixFQUFPLEtBQUs7SUFDN0IsYUFBYSxFQUFXLElBQUk7SUFDNUIscUJBQXFCLEVBQUcsS0FBSztJQUM3QixTQUFTLEVBQWUsSUFBSTtJQUM1QixPQUFPLEVBQWlCO0VBQzVCLENBQUM7O0VBRUQ7RUFDQSxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO0VBQ3ZDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLFVBQVMsQ0FBQyxFQUFFO0lBQ3RELHFCQUFxQixDQUFDLGVBQWUsQ0FBQztFQUMxQyxDQUFDLENBQUM7O0VBRUY7RUFDQSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFVBQVMsQ0FBQyxFQUFFO0lBQzFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQztFQUMxQyxDQUFDLENBQUM7O0VBRUY7RUFDQSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFVBQVMsQ0FBQyxFQUFFO0lBQzFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQztFQUMxQyxDQUFDLENBQUM7QUFDTixDQUFDO0FBRUQsU0FBUyxxQkFBcUIsQ0FBQyxNQUFNLEVBQUU7RUFDbkMsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLElBQUk7RUFDM0IsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGVBQWU7RUFDdEMsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLElBQUksQ0FBQyxFQUFFLE1BQU0sQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDO0VBQ25GLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLE1BQU0sRUFDaEYsT0FBTyxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDO0VBRXZJLElBQUksS0FBSyxHQUFHLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxDQUFDOztFQUVsQztFQUNBLElBQUksS0FBSyxHQUFHLFlBQVksRUFBRTtJQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUU7TUFDdEMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO0lBQ2xDO0VBQ0o7RUFDQTtFQUFBLEtBQ0s7SUFDRCxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO01BQ3JDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUNyQztJQUVBLElBQUksdUJBQXVCLEdBQUcsTUFBTSxDQUFDLE9BQU87SUFDNUMsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRXpEO0lBQ0EsSUFBSSx1QkFBdUIsSUFBSSxLQUFLLEVBQUU7TUFDbEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRTtRQUN4RSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUM7TUFDNUMsQ0FBQyxNQUNJLElBQUksZUFBZSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUU7UUFDN0UsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDO01BQ3pDO0lBQ0o7SUFDQTtJQUFBLEtBQ0s7TUFDRCxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7O01BRXZELElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxZQUFZLEtBQUssSUFBSSxFQUFFO1FBQUEsSUFBQSxnQkFBQSxFQUFBLHFCQUFBLEVBQUEsaUJBQUEsRUFBQSxxQkFBQTtRQUMxQztRQUNBLElBQUksRUFBRSxFQUFBLGdCQUFBLEdBQUEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxjQUFBLGdCQUFBLHdCQUFBLHFCQUFBLEdBQXZDLGdCQUFBLENBQXlDLHNCQUFzQixjQUFBLHFCQUFBLHVCQUEvRCxxQkFBQSxDQUFpRSxZQUFZLENBQUMsZUFBZSxDQUFDLE1BQUssTUFBTSxJQUMvRyxFQUFBLGlCQUFBLEdBQUEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxjQUFBLGlCQUFBLHdCQUFBLHFCQUFBLEdBQXZDLGlCQUFBLENBQXlDLHNCQUFzQixjQUFBLHFCQUFBLHVCQUEvRCxxQkFBQSxDQUFpRSxZQUFZLE1BQUssSUFBSSxDQUFDLEVBQUU7VUFFckYsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixFQUFFO1VBQzFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDakIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRTtjQUN4RSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUM7WUFDNUMsQ0FBQyxNQUNJLElBQUksZUFBZSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUU7Y0FDN0UsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ3pDO1VBQ0osQ0FBQyxNQUNJO1lBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFO2NBQzdDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUN6QztVQUNKO1FBRUo7TUFDSjtNQUNBO01BQUEsS0FDSztRQUNELElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRTtVQUM3QyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUM7UUFDekM7TUFDSjtJQUNKO0VBQ0o7QUFFSjtBQUVBLFNBQVMsZUFBZSxDQUFDLGFBQWEsRUFBRTtFQUNwQyxJQUFJLGFBQWEsYUFBYixhQUFhLGVBQWIsYUFBYSxDQUFFLGFBQWEsQ0FBQyxTQUFTLENBQUMsRUFBRTtJQUN6QyxJQUFJLElBQUksR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLHFCQUFxQixFQUFFOztJQUV6RTtJQUNBLElBQUssSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUc7TUFDckYsT0FBTyxJQUFJO0lBQ2Y7SUFDQTtJQUFBLEtBQ0s7TUFDRCxPQUFPLEtBQUs7SUFDaEI7RUFDSixDQUFDLE1BQ0k7SUFDRCxPQUFPLEtBQUs7RUFDaEI7QUFDSjtBQUFDLElBQUEsUUFBQSxHQUVjLFNBQVM7QUFBQSxPQUFBLGNBQUEsUUFBQTs7O0FDbkl4QixZQUFZOztBQUFDLE1BQUEsQ0FBQSxjQUFBLENBQUEsT0FBQTtFQUFBLEtBQUE7QUFBQTtBQUFBLE9BQUE7QUFFYixJQUFNLFVBQVUsR0FBRyxnQkFBZ0I7QUFDbkMsSUFBTSxtQkFBbUIsR0FBRztFQUN4QixxQkFBcUIsRUFBRSw2QkFBNkI7RUFDcEQsc0JBQXNCLEVBQUUsNkJBQTZCO0VBQ3JELG9CQUFvQixFQUFFLCtCQUErQjtFQUNyRCxxQkFBcUIsRUFBRTtBQUMzQixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQyxTQUFTLGNBQWMsQ0FBQyxnQkFBZ0IsRUFBaUM7RUFBQSxJQUFBLEtBQUE7RUFBQSxJQUEvQixPQUFPLEdBQUEsU0FBQSxDQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsU0FBQSxHQUFBLFNBQUEsTUFBRyxtQkFBbUI7RUFDcEUsSUFBSSxDQUFDLGdCQUFnQixFQUFFO0lBQ25CLE1BQU0sSUFBSSxLQUFLLDhCQUE4QjtFQUNqRDtFQUNBLElBQUksQ0FBQyxTQUFTLEdBQUcsZ0JBQWdCO0VBQ2pDLElBQUksQ0FBQyxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsc0JBQXNCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3JFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO0VBQ3hELElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTztFQUVuQixJQUFJLGtCQUFrQixHQUFHLElBQUk7RUFDN0IsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLO0VBQy9CLElBQUksVUFBVSxHQUFHLElBQUk7RUFFckIsSUFBSSxXQUFXLEdBQUcsU0FBZCxXQUFXLENBQUEsRUFBUztJQUNwQixvQkFBb0IsQ0FBQyxLQUFJLENBQUM7SUFDMUIsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRTtFQUNuQyxDQUFDO0VBRUQsSUFBSSxXQUFXLEdBQUcsU0FBZCxXQUFXLENBQUEsRUFBUztJQUNwQjtBQUNSO0FBQ0E7SUFDUSxJQUFJLEtBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLEVBQUUsRUFBRTtNQUN6QixJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsU0FBUyxDQUFDLHNCQUFzQixDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ3BGLFVBQVUsQ0FBQyxTQUFTLEdBQUcsRUFBRTtJQUM3QjtJQUVBLFVBQVUsR0FBRyxXQUFXLENBQUMsWUFBWTtNQUNqQztBQUNaO0FBQ0E7TUFDWSxJQUFJLENBQUMsa0JBQWtCLElBQUssSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsSUFBSyxrQkFBa0IsRUFBRTtRQUNqRSxJQUFJLFdBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLHNCQUFzQixDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztRQUM5RixJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLHNCQUFzQixDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUzs7UUFFM0Y7QUFDaEI7UUFDZ0IsSUFBSSxRQUFRLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksV0FBVSxLQUFLLGVBQWUsRUFBRTtVQUNqRSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLO1VBQzNCLElBQUksQ0FBQyxjQUFjLEVBQUU7UUFDekI7TUFDSjtJQUNKLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLEVBQUUsSUFBSSxDQUFDO0VBQ3ZCLENBQUM7RUFFRCxJQUFJLFVBQVUsR0FBRyxTQUFiLFVBQVUsQ0FBQSxFQUFTO0lBQ25CLGFBQWEsQ0FBQyxVQUFVLENBQUM7SUFDekI7SUFDQSxJQUFJLFFBQVEsS0FBSyxLQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTtNQUMvQixRQUFRLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxLQUFLO01BQzNCLEtBQUksQ0FBQyxjQUFjLEVBQUU7SUFDekI7RUFDSixDQUFDO0VBRUQsSUFBSSxDQUFDLElBQUksR0FBRyxZQUFXO0lBQUEsSUFBQSxNQUFBO0lBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO01BQ2pCLE1BQU0sSUFBSSxLQUFLLHlDQUFBLE1BQUEsQ0FBeUMsVUFBVSxFQUFHO0lBQ3pFO0lBRUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBVztNQUM1QyxXQUFXLEVBQUU7SUFDakIsQ0FBQyxDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBVztNQUM1QyxXQUFXLEVBQUU7SUFDakIsQ0FBQyxDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsWUFBVztNQUMzQyxVQUFVLEVBQUU7SUFDaEIsQ0FBQyxDQUFDOztJQUVGO0FBQ1I7QUFDQTtBQUNBO0lBQ1EsSUFBSSxZQUFZLElBQUksTUFBTSxFQUFFO01BQ3hCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsWUFBTTtRQUN0QyxNQUFJLENBQUMsY0FBYyxFQUFFO01BQ3pCLENBQUMsQ0FBQztJQUNOLENBQUMsTUFDSTtNQUNELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxZQUFNO1FBQzlDLE1BQUksQ0FBQyxjQUFjLEVBQUU7TUFDekIsQ0FBQyxDQUFDO0lBQ047RUFDSixDQUFDO0FBQ0w7QUFFQSxjQUFjLENBQUMsU0FBUyxDQUFDLGNBQWMsR0FBRyxZQUFZO0VBQ2xELElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU07RUFDNUMsT0FBTyxJQUFJLENBQUMsU0FBUyxHQUFHLGNBQWM7QUFDMUMsQ0FBQztBQUVELFNBQVMscUJBQXFCLENBQUMsU0FBUyxFQUFFO0VBQ3RDLElBQUksYUFBYSxHQUFHLEVBQUU7RUFDdEIsSUFBSSxlQUFlLEdBQUcsU0FBUyxDQUFDLGNBQWMsRUFBRTtFQUVoRCxJQUFJLGVBQWUsS0FBSyxDQUFDLENBQUMsRUFBRTtJQUN4QixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQztJQUN4QyxhQUFhLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQztFQUNsRixDQUFDLE1BQ0ksSUFBSSxlQUFlLEtBQUssQ0FBQyxFQUFFO0lBQzVCLGFBQWEsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDO0VBQzFGLENBQUMsTUFDSSxJQUFJLGVBQWUsSUFBSSxDQUFDLEVBQUU7SUFDM0IsYUFBYSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUM7RUFDM0YsQ0FBQyxNQUNJO0lBQ0QsSUFBSSxTQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUM7SUFDeEMsYUFBYSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxTQUFRLENBQUM7RUFDbkY7RUFFQSxPQUFPLGFBQWE7QUFDeEI7QUFFQSxTQUFTLG9CQUFvQixDQUFDLFNBQVMsRUFBRTtFQUNyQyxJQUFJLGVBQWUsR0FBRyxTQUFTLENBQUMsY0FBYyxFQUFFO0VBQ2hELElBQUksYUFBYSxHQUFHLHFCQUFxQixDQUFDLFNBQVMsQ0FBQztFQUNwRCxJQUFJLGVBQWUsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLHNCQUFzQixDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO0VBRXRGLElBQUksZUFBZSxHQUFHLENBQUMsRUFBRTtJQUNyQixJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtNQUN2RCxlQUFlLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztJQUNuRDtJQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsRUFBRTtNQUN6RCxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUM7SUFDckQ7RUFDSixDQUFDLE1BQ0k7SUFDRCxJQUFJLGVBQWUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEVBQUU7TUFDdEQsZUFBZSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7SUFDdEQ7SUFDQSxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFO01BQ3hELFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQztJQUN4RDtFQUNKO0VBRUEsZUFBZSxDQUFDLFNBQVMsR0FBRyxhQUFhO0FBQzdDO0FBRUEsU0FBUyx5QkFBeUIsQ0FBQyxTQUFTLEVBQUU7RUFDMUMsSUFBSSxhQUFhLEdBQUcscUJBQXFCLENBQUMsU0FBUyxDQUFDO0VBQ3BELElBQUksZUFBZSxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDOUYsZUFBZSxDQUFDLFNBQVMsR0FBRyxhQUFhO0FBQzdDO0FBRUEsY0FBYyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEdBQUcsWUFBWTtFQUNsRCxvQkFBb0IsQ0FBQyxJQUFJLENBQUM7RUFDMUIseUJBQXlCLENBQUMsSUFBSSxDQUFDO0FBQ25DLENBQUM7QUFBQSxJQUFBLFFBQUEsR0FFYyxjQUFjO0FBQUEsT0FBQSxjQUFBLFFBQUE7OztBQ3BLN0IsWUFBWTs7QUFBQyxNQUFBLENBQUEsY0FBQSxDQUFBLE9BQUE7RUFBQSxLQUFBO0FBQUE7QUFBQSxPQUFBO0FBQ2IsT0FBQTtBQUVBLElBQU0sdUJBQXVCLEdBQUcsb0JBQW9COztBQUVwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMscUJBQXFCLENBQUMsZUFBZSxFQUFDO0VBQzNDLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZTtFQUN0QyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUk7QUFDN0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxZQUFVO0VBQzdDLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ3ZFLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDakIsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFlBQVU7RUFDL0MsSUFBSSxPQUFPLEdBQUcsSUFBSTtFQUNsQixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyx1QkFBdUIsQ0FBQztFQUMzRSxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQztFQUNsRCxJQUFHLFFBQVEsS0FBSyxJQUFJLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBQztJQUMzQyxNQUFNLElBQUksS0FBSyxDQUFDLDZEQUE0RCx1QkFBdUIsQ0FBQztFQUN4RztFQUNBLElBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUM7SUFDNUIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQztFQUNsRCxDQUFDLE1BQUk7SUFDRCxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsUUFBUSxDQUFDO0VBQ3BEO0FBQ0osQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxVQUFTLGVBQWUsRUFBRSxjQUFjLEVBQUM7RUFDOUUsSUFBRyxlQUFlLEtBQUssSUFBSSxJQUFJLGVBQWUsS0FBSyxTQUFTLElBQUksY0FBYyxLQUFLLElBQUksSUFBSSxjQUFjLEtBQUssU0FBUyxFQUFDO0lBQ3BILGVBQWUsQ0FBQyxZQUFZLENBQUMsb0JBQW9CLEVBQUUsTUFBTSxDQUFDO0lBQzFELGNBQWMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztJQUM1QyxjQUFjLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUM7SUFDbkQsSUFBSSxTQUFTLEdBQUcsSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUM7SUFDbEQsZUFBZSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7RUFDNUM7QUFDSixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFVBQVMsU0FBUyxFQUFFLFFBQVEsRUFBQztFQUNwRSxJQUFHLFNBQVMsS0FBSyxJQUFJLElBQUksU0FBUyxLQUFLLFNBQVMsSUFBSSxRQUFRLEtBQUssSUFBSSxJQUFJLFFBQVEsS0FBSyxTQUFTLEVBQUM7SUFDNUYsU0FBUyxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLENBQUM7SUFDckQsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO0lBQ25DLFFBQVEsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQztJQUU1QyxJQUFJLFVBQVUsR0FBRyxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQztJQUNwRCxTQUFTLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQztFQUN2QztBQUNKLENBQUM7QUFBQSxJQUFBLFFBQUEsR0FFYyxxQkFBcUI7QUFBQSxPQUFBLGNBQUEsUUFBQTs7Ozs7O0FDdEVwQyxJQUFBLFNBQUEsR0FBQSxPQUFBO0FBQWdDLElBQUEsTUFBQSxFQUFBLFFBQUEsRUFBQSxTQUFBLEVBQUEsaUJBQUE7QUFBQSxTQUFBLGdCQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsS0FBQSxJQUFBLEdBQUEsR0FBQSxjQUFBLENBQUEsR0FBQSxPQUFBLEdBQUEsSUFBQSxHQUFBLElBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxHQUFBLEVBQUEsR0FBQSxJQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsVUFBQSxRQUFBLFlBQUEsUUFBQSxRQUFBLG9CQUFBLEdBQUEsQ0FBQSxHQUFBLElBQUEsS0FBQSxXQUFBLEdBQUE7QUFBQSxTQUFBLGVBQUEsR0FBQSxRQUFBLEdBQUEsR0FBQSxZQUFBLENBQUEsR0FBQSxvQkFBQSxPQUFBLENBQUEsR0FBQSxpQkFBQSxHQUFBLEdBQUEsTUFBQSxDQUFBLEdBQUE7QUFBQSxTQUFBLGFBQUEsS0FBQSxFQUFBLElBQUEsUUFBQSxPQUFBLENBQUEsS0FBQSxrQkFBQSxLQUFBLGtCQUFBLEtBQUEsTUFBQSxJQUFBLEdBQUEsS0FBQSxDQUFBLE1BQUEsQ0FBQSxXQUFBLE9BQUEsSUFBQSxLQUFBLFNBQUEsUUFBQSxHQUFBLEdBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxLQUFBLEVBQUEsSUFBQSxvQkFBQSxPQUFBLENBQUEsR0FBQSx1QkFBQSxHQUFBLFlBQUEsU0FBQSw0REFBQSxJQUFBLGdCQUFBLE1BQUEsR0FBQSxNQUFBLEVBQUEsS0FBQTtBQUFBLFNBQUEsZUFBQSxHQUFBLEVBQUEsQ0FBQSxXQUFBLGVBQUEsQ0FBQSxHQUFBLEtBQUEscUJBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxLQUFBLDJCQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsS0FBQSxnQkFBQTtBQUFBLFNBQUEsaUJBQUEsY0FBQSxTQUFBO0FBQUEsU0FBQSw0QkFBQSxDQUFBLEVBQUEsTUFBQSxTQUFBLENBQUEscUJBQUEsQ0FBQSxzQkFBQSxpQkFBQSxDQUFBLENBQUEsRUFBQSxNQUFBLE9BQUEsQ0FBQSxHQUFBLE1BQUEsQ0FBQSxTQUFBLENBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLEVBQUEsS0FBQSxhQUFBLENBQUEsaUJBQUEsQ0FBQSxDQUFBLFdBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLFdBQUEsQ0FBQSxJQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsbUJBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLE9BQUEsQ0FBQSwrREFBQSxJQUFBLENBQUEsQ0FBQSxVQUFBLGlCQUFBLENBQUEsQ0FBQSxFQUFBLE1BQUE7QUFBQSxTQUFBLGtCQUFBLEdBQUEsRUFBQSxHQUFBLFFBQUEsR0FBQSxZQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxXQUFBLENBQUEsTUFBQSxJQUFBLE9BQUEsS0FBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsSUFBQSxJQUFBLENBQUEsQ0FBQSxJQUFBLEdBQUEsQ0FBQSxDQUFBLFVBQUEsSUFBQTtBQUFBLFNBQUEsc0JBQUEsR0FBQSxFQUFBLENBQUEsUUFBQSxFQUFBLFdBQUEsR0FBQSxnQ0FBQSxNQUFBLElBQUEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxRQUFBLEtBQUEsR0FBQSw0QkFBQSxFQUFBLFFBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxpQkFBQSxFQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxHQUFBLElBQUEsUUFBQSxDQUFBLFFBQUEsTUFBQSxDQUFBLEVBQUEsTUFBQSxFQUFBLFVBQUEsRUFBQSx1QkFBQSxFQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsRUFBQSxHQUFBLElBQUEsTUFBQSxJQUFBLENBQUEsSUFBQSxDQUFBLEVBQUEsQ0FBQSxLQUFBLEdBQUEsSUFBQSxDQUFBLE1BQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxpQkFBQSxHQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsR0FBQSxHQUFBLHlCQUFBLEVBQUEsWUFBQSxFQUFBLGVBQUEsRUFBQSxHQUFBLEVBQUEsY0FBQSxNQUFBLENBQUEsRUFBQSxNQUFBLEVBQUEsMkJBQUEsRUFBQSxRQUFBLEVBQUEsYUFBQSxJQUFBO0FBQUEsU0FBQSxnQkFBQSxHQUFBLFFBQUEsS0FBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLFVBQUEsR0FBQTtBQUNoQyxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUM7QUFDN0MsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDO0FBQ3pDLElBQUEsUUFBQSxHQUEyQixPQUFPLENBQUMsV0FBVyxDQUFDO0VBQS9CLE1BQU0sR0FBQSxRQUFBLENBQWQsTUFBTTtBQUNkLElBQUEsU0FBQSxHQUFrQixPQUFPLENBQUMsV0FBVyxDQUFDO0VBQTlCLEtBQUssR0FBQSxTQUFBLENBQUwsS0FBSztBQUNiLElBQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQztBQUN4RCxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUM7QUFFckQsSUFBTSxpQkFBaUIsZ0JBQWdCO0FBQ3ZDLElBQU0seUJBQXlCLE1BQUEsTUFBQSxDQUFNLGlCQUFpQixjQUFXO0FBQ2pFLElBQU0sNkJBQTZCLE1BQUEsTUFBQSxDQUFNLGlCQUFpQixrQkFBZTtBQUN6RSxJQUFNLHdCQUF3QixNQUFBLE1BQUEsQ0FBTSxpQkFBaUIsYUFBVTtBQUMvRCxJQUFNLGdDQUFnQyxNQUFBLE1BQUEsQ0FBTSxpQkFBaUIscUJBQWtCO0FBQy9FLElBQU0sZ0NBQWdDLE1BQUEsTUFBQSxDQUFNLGlCQUFpQixxQkFBa0I7QUFDL0UsSUFBTSx3QkFBd0IsTUFBQSxNQUFBLENBQU0saUJBQWlCLGFBQVU7QUFDL0QsSUFBTSwwQkFBMEIsTUFBQSxNQUFBLENBQU0saUJBQWlCLGVBQVk7QUFDbkUsSUFBTSx3QkFBd0IsTUFBQSxNQUFBLENBQU0saUJBQWlCLGFBQVU7QUFDL0QsSUFBTSx1QkFBdUIsTUFBQSxNQUFBLENBQU0saUJBQWlCLFlBQVM7QUFDN0QsSUFBTSxtQkFBbUIsTUFBQSxNQUFBLENBQU0sMEJBQTBCLFdBQVE7QUFFakUsSUFBTSxvQkFBb0IsbUJBQW1CO0FBQzdDLElBQU0sMEJBQTBCLE9BQUEsTUFBQSxDQUFPLG9CQUFvQixDQUFFO0FBRTdELElBQU0sMkJBQTJCLE1BQUEsTUFBQSxDQUFNLG1CQUFtQixjQUFXO0FBQ3JFLElBQU0sNEJBQTRCLE1BQUEsTUFBQSxDQUFNLG1CQUFtQixlQUFZO0FBQ3ZFLElBQU0sa0NBQWtDLE1BQUEsTUFBQSxDQUFNLG1CQUFtQixxQkFBa0I7QUFDbkYsSUFBTSxpQ0FBaUMsTUFBQSxNQUFBLENBQU0sbUJBQW1CLG9CQUFpQjtBQUNqRixJQUFNLDhCQUE4QixNQUFBLE1BQUEsQ0FBTSxtQkFBbUIsaUJBQWM7QUFDM0UsSUFBTSw4QkFBOEIsTUFBQSxNQUFBLENBQU0sbUJBQW1CLGlCQUFjO0FBQzNFLElBQU0seUJBQXlCLE1BQUEsTUFBQSxDQUFNLG1CQUFtQixZQUFTO0FBQ2pFLElBQU0sb0NBQW9DLE1BQUEsTUFBQSxDQUFNLG1CQUFtQix1QkFBb0I7QUFDdkYsSUFBTSxrQ0FBa0MsTUFBQSxNQUFBLENBQU0sbUJBQW1CLHFCQUFrQjtBQUNuRixJQUFNLGdDQUFnQyxNQUFBLE1BQUEsQ0FBTSxtQkFBbUIsbUJBQWdCO0FBQy9FLElBQU0sNEJBQTRCLE1BQUEsTUFBQSxDQUFNLDBCQUEwQixvQkFBaUI7QUFDbkYsSUFBTSw2QkFBNkIsTUFBQSxNQUFBLENBQU0sMEJBQTBCLHFCQUFrQjtBQUNyRixJQUFNLHdCQUF3QixNQUFBLE1BQUEsQ0FBTSwwQkFBMEIsZ0JBQWE7QUFDM0UsSUFBTSx5QkFBeUIsTUFBQSxNQUFBLENBQU0sMEJBQTBCLGlCQUFjO0FBQzdFLElBQU0sOEJBQThCLE1BQUEsTUFBQSxDQUFNLDBCQUEwQixzQkFBbUI7QUFDdkYsSUFBTSw2QkFBNkIsTUFBQSxNQUFBLENBQU0sMEJBQTBCLHFCQUFrQjtBQUNyRixJQUFNLG9CQUFvQixNQUFBLE1BQUEsQ0FBTSwwQkFBMEIsWUFBUztBQUNuRSxJQUFNLDRCQUE0QixNQUFBLE1BQUEsQ0FBTSxvQkFBb0IsY0FBVztBQUN2RSxJQUFNLDZCQUE2QixNQUFBLE1BQUEsQ0FBTSxvQkFBb0IsZUFBWTtBQUN6RSxJQUFNLG1CQUFtQixNQUFBLE1BQUEsQ0FBTSwwQkFBMEIsV0FBUTtBQUNqRSxJQUFNLDJCQUEyQixNQUFBLE1BQUEsQ0FBTSxtQkFBbUIsY0FBVztBQUNyRSxJQUFNLDRCQUE0QixNQUFBLE1BQUEsQ0FBTSxtQkFBbUIsZUFBWTtBQUN2RSxJQUFNLGtDQUFrQyxNQUFBLE1BQUEsQ0FBTSwwQkFBMEIsMEJBQXVCO0FBQy9GLElBQU0sOEJBQThCLE1BQUEsTUFBQSxDQUFNLDBCQUEwQixzQkFBbUI7QUFDdkYsSUFBTSwwQkFBMEIsTUFBQSxNQUFBLENBQU0sMEJBQTBCLGtCQUFlO0FBQy9FLElBQU0sMkJBQTJCLE1BQUEsTUFBQSxDQUFNLDBCQUEwQixtQkFBZ0I7QUFDakYsSUFBTSwwQkFBMEIsTUFBQSxNQUFBLENBQU0sMEJBQTBCLGtCQUFlO0FBQy9FLElBQU0sb0JBQW9CLE1BQUEsTUFBQSxDQUFNLDBCQUEwQixZQUFTO0FBQ25FLElBQU0sa0JBQWtCLE1BQUEsTUFBQSxDQUFNLDBCQUEwQixVQUFPO0FBQy9ELElBQU0sbUJBQW1CLE1BQUEsTUFBQSxDQUFNLDBCQUEwQixXQUFRO0FBQ2pFLElBQU0sZ0NBQWdDLE1BQUEsTUFBQSxDQUFNLG1CQUFtQixtQkFBZ0I7QUFDL0UsSUFBTSwwQkFBMEIsTUFBQSxNQUFBLENBQU0sMEJBQTBCLGtCQUFlO0FBQy9FLElBQU0sMEJBQTBCLE1BQUEsTUFBQSxDQUFNLDBCQUEwQixrQkFBZTtBQUUvRSxJQUFNLFdBQVcsT0FBQSxNQUFBLENBQU8saUJBQWlCLENBQUU7QUFDM0MsSUFBTSxrQkFBa0IsT0FBQSxNQUFBLENBQU8sd0JBQXdCLENBQUU7QUFDekQsSUFBTSwwQkFBMEIsT0FBQSxNQUFBLENBQU8sZ0NBQWdDLENBQUU7QUFDekUsSUFBTSwwQkFBMEIsT0FBQSxNQUFBLENBQU8sZ0NBQWdDLENBQUU7QUFDekUsSUFBTSxvQkFBb0IsT0FBQSxNQUFBLENBQU8sMEJBQTBCLENBQUU7QUFDN0QsSUFBTSxrQkFBa0IsT0FBQSxNQUFBLENBQU8sd0JBQXdCLENBQUU7QUFDekQsSUFBTSxpQkFBaUIsT0FBQSxNQUFBLENBQU8sdUJBQXVCLENBQUU7QUFDdkQsSUFBTSxhQUFhLE9BQUEsTUFBQSxDQUFPLG1CQUFtQixDQUFFO0FBQy9DLElBQU0scUJBQXFCLE9BQUEsTUFBQSxDQUFPLDJCQUEyQixDQUFFO0FBQy9ELElBQU0sMkJBQTJCLE9BQUEsTUFBQSxDQUFPLGlDQUFpQyxDQUFFO0FBQzNFLElBQU0sc0JBQXNCLE9BQUEsTUFBQSxDQUFPLDRCQUE0QixDQUFFO0FBQ2pFLElBQU0sdUJBQXVCLE9BQUEsTUFBQSxDQUFPLDZCQUE2QixDQUFFO0FBQ25FLElBQU0sa0JBQWtCLE9BQUEsTUFBQSxDQUFPLHdCQUF3QixDQUFFO0FBQ3pELElBQU0sbUJBQW1CLE9BQUEsTUFBQSxDQUFPLHlCQUF5QixDQUFFO0FBQzNELElBQU0sdUJBQXVCLE9BQUEsTUFBQSxDQUFPLDZCQUE2QixDQUFFO0FBQ25FLElBQU0sd0JBQXdCLE9BQUEsTUFBQSxDQUFPLDhCQUE4QixDQUFFO0FBQ3JFLElBQU0sY0FBYyxPQUFBLE1BQUEsQ0FBTyxvQkFBb0IsQ0FBRTtBQUNqRCxJQUFNLGFBQWEsT0FBQSxNQUFBLENBQU8sbUJBQW1CLENBQUU7QUFDL0MsSUFBTSw0QkFBNEIsT0FBQSxNQUFBLENBQU8sa0NBQWtDLENBQUU7QUFDN0UsSUFBTSx3QkFBd0IsT0FBQSxNQUFBLENBQU8sOEJBQThCLENBQUU7QUFDckUsSUFBTSxvQkFBb0IsT0FBQSxNQUFBLENBQU8sMEJBQTBCLENBQUU7QUFDN0QsSUFBTSxxQkFBcUIsT0FBQSxNQUFBLENBQU8sMkJBQTJCLENBQUU7QUFDL0QsSUFBTSxvQkFBb0IsT0FBQSxNQUFBLENBQU8sMEJBQTBCLENBQUU7QUFDN0QsSUFBTSxzQkFBc0IsT0FBQSxNQUFBLENBQU8sNEJBQTRCLENBQUU7QUFDakUsSUFBTSxxQkFBcUIsT0FBQSxNQUFBLENBQU8sMkJBQTJCLENBQUU7QUFFL0QsSUFBSSxJQUFJLEdBQUc7RUFDVCxlQUFlLEVBQUUsY0FBYztFQUMvQixlQUFlLEVBQUUsY0FBYztFQUMvQix1QkFBdUIsRUFBRSw0RkFBNEY7RUFDckgsc0JBQXNCLEVBQUUsd0VBQXdFO0VBQ2hHLHFCQUFxQixFQUFFLCtFQUErRTtFQUN0RyxpQkFBaUIsRUFBRSx1Q0FBdUM7RUFDMUQseUJBQXlCLEVBQUUsa0NBQWtDO0VBQzdELHFCQUFxQixFQUFFLHNCQUFzQjtFQUM3QyxvQkFBb0IsRUFBRSxzQkFBc0I7RUFDNUMsZUFBZSxFQUFFLHVCQUF1QjtFQUN4QyxnQkFBZ0IsRUFBRSwwQkFBMEI7RUFDNUMsWUFBWSxFQUFFLHVCQUF1QjtFQUNyQyxXQUFXLEVBQUUsb0JBQW9CO0VBQ2pDLGNBQWMsRUFBRSxZQUFZO0VBQzVCLGFBQWEsRUFBRSxTQUFTO0VBQ3hCLGdCQUFnQixFQUFFLDRCQUE0QjtFQUM5QyxZQUFZLEVBQUUseUJBQXlCO0VBQ3ZDLE9BQU8sRUFBRSw4UUFBOFE7RUFDdlIsa0JBQWtCLEVBQUUsZUFBZTtFQUNuQyxpQkFBaUIsRUFBRSx5Q0FBeUM7RUFDNUQsU0FBUyxFQUFFLFFBQVE7RUFDbkIsVUFBVSxFQUFFLFNBQVM7RUFDckIsT0FBTyxFQUFFLE9BQU87RUFDaEIsT0FBTyxFQUFFLE9BQU87RUFDaEIsS0FBSyxFQUFFLEtBQUs7RUFDWixNQUFNLEVBQUUsTUFBTTtFQUNkLE1BQU0sRUFBRSxNQUFNO0VBQ2QsUUFBUSxFQUFFLFFBQVE7RUFDbEIsV0FBVyxFQUFFLFdBQVc7RUFDeEIsU0FBUyxFQUFFLFNBQVM7RUFDcEIsVUFBVSxFQUFFLFVBQVU7RUFDdEIsVUFBVSxFQUFFLFVBQVU7RUFDdEIsUUFBUSxFQUFFLFFBQVE7RUFDbEIsU0FBUyxFQUFFLFNBQVM7RUFDcEIsV0FBVyxFQUFFLFFBQVE7RUFDckIsVUFBVSxFQUFFLFNBQVM7RUFDckIsUUFBUSxFQUFFLFFBQVE7RUFDbEIsVUFBVSxFQUFFLFFBQVE7RUFDcEIsUUFBUSxFQUFFO0FBQ1osQ0FBQztBQUVELElBQU0sa0JBQWtCLEdBQUcsaUNBQWlDO0FBRTVELElBQUksWUFBWSxHQUFHLENBQ2pCLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxDQUFDLFFBQVEsRUFDYixJQUFJLENBQUMsS0FBSyxFQUNWLElBQUksQ0FBQyxLQUFLLEVBQ1YsSUFBSSxDQUFDLEdBQUcsRUFDUixJQUFJLENBQUMsSUFBSSxFQUNULElBQUksQ0FBQyxJQUFJLEVBQ1QsSUFBSSxDQUFDLE1BQU0sRUFDWCxJQUFJLENBQUMsU0FBUyxFQUNkLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxDQUFDLFFBQVEsRUFDYixJQUFJLENBQUMsUUFBUSxDQUNkO0FBRUQsSUFBSSxrQkFBa0IsR0FBRyxDQUN2QixJQUFJLENBQUMsTUFBTSxFQUNYLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxDQUFDLFNBQVMsRUFDZCxJQUFJLENBQUMsUUFBUSxFQUNiLElBQUksQ0FBQyxNQUFNLEVBQ1gsSUFBSSxDQUFDLFFBQVEsRUFDYixJQUFJLENBQUMsTUFBTSxDQUNaO0FBRUQsSUFBTSxhQUFhLEdBQUcsRUFBRTtBQUV4QixJQUFNLFVBQVUsR0FBRyxFQUFFO0FBRXJCLElBQU0sZ0JBQWdCLEdBQUcsWUFBWTtBQUNyQyxJQUFNLG9CQUFvQixHQUFHLFlBQVk7QUFDekMsSUFBTSxvQkFBb0IsR0FBRyxZQUFZO0FBQ3pDLElBQU0sb0JBQW9CLEdBQUcsWUFBWTtBQUN6QyxJQUFNLG9CQUFvQixHQUFHLFlBQVk7QUFDekMsSUFBTSxvQkFBb0IsR0FBRyxZQUFZO0FBQ3pDLElBQU0sb0JBQW9CLEdBQUcsWUFBWTtBQUV6QyxJQUFNLHFCQUFxQixHQUFHLGtCQUFrQjtBQUVoRCxJQUFNLHlCQUF5QixHQUFHLFNBQTVCLHlCQUF5QixDQUFBO0VBQUEsU0FBQSxJQUFBLEdBQUEsU0FBQSxDQUFBLE1BQUEsRUFBTyxTQUFTLE9BQUEsS0FBQSxDQUFBLElBQUEsR0FBQSxJQUFBLE1BQUEsSUFBQSxHQUFBLElBQUEsRUFBQSxJQUFBO0lBQVQsU0FBUyxDQUFBLElBQUEsSUFBQSxTQUFBLENBQUEsSUFBQTtFQUFBO0VBQUEsT0FDN0MsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEtBQUs7SUFBQSxPQUFLLEtBQUssR0FBRyxxQkFBcUI7RUFBQSxFQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztBQUFBO0FBRXBFLElBQU0scUJBQXFCLEdBQUcseUJBQXlCLENBQ3JELHNCQUFzQixFQUN0Qix1QkFBdUIsRUFDdkIsdUJBQXVCLEVBQ3ZCLHdCQUF3QixFQUN4QixrQkFBa0IsRUFDbEIsbUJBQW1CLEVBQ25CLHFCQUFxQixDQUN0QjtBQUVELElBQU0sc0JBQXNCLEdBQUcseUJBQXlCLENBQ3RELHNCQUFzQixDQUN2QjtBQUVELElBQU0scUJBQXFCLEdBQUcseUJBQXlCLENBQ3JELDRCQUE0QixFQUM1Qix3QkFBd0IsRUFDeEIscUJBQXFCLENBQ3RCOztBQUVEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxtQkFBbUIsR0FBRyxTQUF0QixtQkFBbUIsQ0FBSSxXQUFXLEVBQUUsS0FBSyxFQUFLO0VBQ2xELElBQUksS0FBSyxLQUFLLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBRTtJQUNwQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztFQUN4QjtFQUVBLE9BQU8sV0FBVztBQUNwQixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLE9BQU8sR0FBRyxTQUFWLE9BQU8sQ0FBSSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBSztFQUNyQyxJQUFNLE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7RUFDM0IsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQztFQUN0QyxPQUFPLE9BQU87QUFDaEIsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxLQUFLLEdBQUcsU0FBUixLQUFLLENBQUEsRUFBUztFQUNsQixJQUFNLE9BQU8sR0FBRyxJQUFJLElBQUksRUFBRTtFQUMxQixJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFO0VBQzdCLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxRQUFRLEVBQUU7RUFDaEMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRTtFQUNsQyxPQUFPLE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQztBQUNsQyxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sWUFBWSxHQUFHLFNBQWYsWUFBWSxDQUFJLElBQUksRUFBSztFQUM3QixJQUFNLE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7RUFDM0IsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztFQUMzRCxPQUFPLE9BQU87QUFDaEIsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLGNBQWMsR0FBRyxTQUFqQixjQUFjLENBQUksSUFBSSxFQUFLO0VBQy9CLElBQU0sT0FBTyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztFQUMzQixPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUMvRCxPQUFPLE9BQU87QUFDaEIsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sT0FBTyxHQUFHLFNBQVYsT0FBTyxDQUFJLEtBQUssRUFBRSxPQUFPLEVBQUs7RUFDbEMsSUFBTSxPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0VBQ3pDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxHQUFHLE9BQU8sQ0FBQztFQUM1QyxPQUFPLE9BQU87QUFDaEIsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sT0FBTyxHQUFHLFNBQVYsT0FBTyxDQUFJLEtBQUssRUFBRSxPQUFPO0VBQUEsT0FBSyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBQUE7O0FBRTVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFRLENBQUksS0FBSyxFQUFFLFFBQVE7RUFBQSxPQUFLLE9BQU8sQ0FBQyxLQUFLLEVBQUUsUUFBUSxHQUFHLENBQUMsQ0FBQztBQUFBOztBQUVsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sUUFBUSxHQUFHLFNBQVgsUUFBUSxDQUFJLEtBQUssRUFBRSxRQUFRO0VBQUEsT0FBSyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsUUFBUSxDQUFDO0FBQUE7O0FBRWhFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sV0FBVyxHQUFHLFNBQWQsV0FBVyxDQUFJLEtBQUssRUFBSztFQUM3QixJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLEdBQUMsQ0FBQztFQUNoQyxJQUFHLFNBQVMsS0FBSyxDQUFDLENBQUMsRUFBQztJQUNsQixTQUFTLEdBQUcsQ0FBQztFQUNmO0VBQ0EsT0FBTyxPQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQztBQUNsQyxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxTQUFTLEdBQUcsU0FBWixTQUFTLENBQUksS0FBSyxFQUFLO0VBQzNCLElBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUU7RUFDaEMsT0FBTyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUM7QUFDdEMsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFJLEtBQUssRUFBRSxTQUFTLEVBQUs7RUFDdEMsSUFBTSxPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0VBRXpDLElBQU0sU0FBUyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsR0FBRyxTQUFTLElBQUksRUFBRTtFQUM1RCxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxTQUFTLENBQUM7RUFDaEQsbUJBQW1CLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQztFQUV2QyxPQUFPLE9BQU87QUFDaEIsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFJLEtBQUssRUFBRSxTQUFTO0VBQUEsT0FBSyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsU0FBUyxDQUFDO0FBQUE7O0FBRXBFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFRLENBQUksS0FBSyxFQUFFLFFBQVE7RUFBQSxPQUFLLFNBQVMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUFBOztBQUVyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sUUFBUSxHQUFHLFNBQVgsUUFBUSxDQUFJLEtBQUssRUFBRSxRQUFRO0VBQUEsT0FBSyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsUUFBUSxDQUFDO0FBQUE7O0FBRWhFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFRLENBQUksS0FBSyxFQUFFLEtBQUssRUFBSztFQUNqQyxJQUFNLE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7RUFFekMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7RUFDdkIsbUJBQW1CLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQztFQUVuQyxPQUFPLE9BQU87QUFDaEIsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sT0FBTyxHQUFHLFNBQVYsT0FBTyxDQUFJLEtBQUssRUFBRSxJQUFJLEVBQUs7RUFDL0IsSUFBTSxPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0VBRXpDLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxRQUFRLEVBQUU7RUFDaEMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7RUFDekIsbUJBQW1CLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQztFQUVuQyxPQUFPLE9BQU87QUFDaEIsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sR0FBRyxHQUFHLFNBQU4sR0FBRyxDQUFJLEtBQUssRUFBRSxLQUFLLEVBQUs7RUFDNUIsSUFBSSxPQUFPLEdBQUcsS0FBSztFQUVuQixJQUFJLEtBQUssR0FBRyxLQUFLLEVBQUU7SUFDakIsT0FBTyxHQUFHLEtBQUs7RUFDakI7RUFFQSxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNwQyxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxHQUFHLEdBQUcsU0FBTixHQUFHLENBQUksS0FBSyxFQUFFLEtBQUssRUFBSztFQUM1QixJQUFJLE9BQU8sR0FBRyxLQUFLO0VBRW5CLElBQUksS0FBSyxHQUFHLEtBQUssRUFBRTtJQUNqQixPQUFPLEdBQUcsS0FBSztFQUNqQjtFQUVBLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3BDLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLFVBQVUsR0FBRyxTQUFiLFVBQVUsQ0FBSSxLQUFLLEVBQUUsS0FBSyxFQUFLO0VBQ25DLE9BQU8sS0FBSyxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssS0FBSyxDQUFDLFdBQVcsRUFBRTtBQUN0RSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxXQUFXLEdBQUcsU0FBZCxXQUFXLENBQUksS0FBSyxFQUFFLEtBQUssRUFBSztFQUNwQyxPQUFPLFVBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLEtBQUssQ0FBQyxRQUFRLEVBQUU7QUFDMUUsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFJLEtBQUssRUFBRSxLQUFLLEVBQUs7RUFDbEMsT0FBTyxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxLQUFLLENBQUMsT0FBTyxFQUFFO0FBQ3pFLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sd0JBQXdCLEdBQUcsU0FBM0Isd0JBQXdCLENBQUksSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUs7RUFDM0QsSUFBSSxPQUFPLEdBQUcsSUFBSTtFQUVsQixJQUFJLElBQUksR0FBRyxPQUFPLEVBQUU7SUFDbEIsT0FBTyxHQUFHLE9BQU87RUFDbkIsQ0FBQyxNQUFNLElBQUksT0FBTyxJQUFJLElBQUksR0FBRyxPQUFPLEVBQUU7SUFDcEMsT0FBTyxHQUFHLE9BQU87RUFDbkI7RUFFQSxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNwQyxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLHFCQUFxQixHQUFHLFNBQXhCLHFCQUFxQixDQUFJLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTztFQUFBLE9BQ25ELElBQUksSUFBSSxPQUFPLEtBQUssQ0FBQyxPQUFPLElBQUksSUFBSSxJQUFJLE9BQU8sQ0FBQztBQUFBOztBQUVsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSwyQkFBMkIsR0FBRyxTQUE5QiwyQkFBMkIsQ0FBSSxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBSztFQUM5RCxPQUNFLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLElBQUssT0FBTyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFRO0FBRS9FLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sMEJBQTBCLEdBQUcsU0FBN0IsMEJBQTBCLENBQUksSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUs7RUFDN0QsT0FDRSxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLE9BQU8sSUFDM0MsT0FBTyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBUTtBQUUxRCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLGVBQWUsR0FBRyxTQUFsQixlQUFlLENBQ25CLFVBQVUsRUFHUDtFQUFBLElBRkgsVUFBVSxHQUFBLFNBQUEsQ0FBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUEsR0FBQSxTQUFBLE1BQUcsb0JBQW9CO0VBQUEsSUFDakMsVUFBVSxHQUFBLFNBQUEsQ0FBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUEsR0FBQSxTQUFBLE1BQUcsS0FBSztFQUVsQixJQUFJLElBQUk7RUFDUixJQUFJLEtBQUs7RUFDVCxJQUFJLEdBQUc7RUFDUCxJQUFJLElBQUk7RUFDUixJQUFJLE1BQU07RUFFVixJQUFJLFVBQVUsRUFBRTtJQUNkLElBQUksUUFBUSxFQUFFLE1BQU0sRUFBRSxPQUFPO0lBQzdCLElBQUksVUFBVSxLQUFLLG9CQUFvQixJQUFJLFVBQVUsS0FBSyxvQkFBb0IsSUFBSSxVQUFVLEtBQUssb0JBQW9CLElBQUksVUFBVSxLQUFLLG9CQUFvQixJQUFJLFVBQVUsS0FBSyxvQkFBb0IsRUFBRTtNQUFBLElBQUEsaUJBQUEsR0FDckssVUFBVSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7TUFBQSxJQUFBLGtCQUFBLEdBQUEsY0FBQSxDQUFBLGlCQUFBO01BQTNELE1BQU0sR0FBQSxrQkFBQTtNQUFFLFFBQVEsR0FBQSxrQkFBQTtNQUFFLE9BQU8sR0FBQSxrQkFBQTtJQUM1QixDQUFDLE1BQU07TUFBQSxJQUFBLGtCQUFBLEdBQ3lCLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO01BQUEsSUFBQSxrQkFBQSxHQUFBLGNBQUEsQ0FBQSxrQkFBQTtNQUFsRCxPQUFPLEdBQUEsa0JBQUE7TUFBRSxRQUFRLEdBQUEsa0JBQUE7TUFBRSxNQUFNLEdBQUEsa0JBQUE7SUFDNUI7SUFFQSxJQUFJLE9BQU8sRUFBRTtNQUNYLE1BQU0sR0FBRyxRQUFRLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztNQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUN6QixJQUFJLEdBQUcsTUFBTTtRQUNiLElBQUksVUFBVSxFQUFFO1VBQ2QsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQztVQUN4QixJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3RCLElBQU0sV0FBVyxHQUFHLEtBQUssRUFBRSxDQUFDLFdBQVcsRUFBRTtZQUN6QyxJQUFNLGVBQWUsR0FDbkIsV0FBVyxHQUFJLFdBQVcsR0FBQSxJQUFBLENBQUEsR0FBQSxDQUFHLEVBQUUsRUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDO1lBQ3BELElBQUksR0FBRyxlQUFlLEdBQUcsTUFBTTtVQUNqQztRQUNGO01BQ0Y7SUFDRjtJQUVBLElBQUksUUFBUSxFQUFFO01BQ1osTUFBTSxHQUFHLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO01BQy9CLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ3pCLEtBQUssR0FBRyxNQUFNO1FBQ2QsSUFBSSxVQUFVLEVBQUU7VUFDZCxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDO1VBQzFCLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUM7UUFDN0I7TUFDRjtJQUNGO0lBRUEsSUFBSSxLQUFLLElBQUksTUFBTSxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUU7TUFDbkMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDO01BQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ3pCLEdBQUcsR0FBRyxNQUFNO1FBQ1osSUFBSSxVQUFVLEVBQUU7VUFDZCxJQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRTtVQUMzRCxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDO1VBQ3RCLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQztRQUN4QztNQUNGO0lBQ0Y7SUFFQSxJQUFJLEtBQUssSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLElBQUksRUFBRTtNQUNoQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQztJQUN0QztFQUNGO0VBRUEsT0FBTyxJQUFJO0FBQ2IsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFJLElBQUksRUFBd0M7RUFBQSxJQUF0QyxVQUFVLEdBQUEsU0FBQSxDQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsU0FBQSxHQUFBLFNBQUEsTUFBRyxvQkFBb0I7RUFDekQsSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFRLENBQUksS0FBSyxFQUFFLE1BQU0sRUFBSztJQUNsQyxPQUFPLE9BQUEsTUFBQSxDQUFPLEtBQUssRUFBRyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUM7RUFDdEMsQ0FBQztFQUVELElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDO0VBQ2pDLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUU7RUFDMUIsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRTtFQUUvQixJQUFJLFVBQVUsS0FBSyxvQkFBb0IsRUFBRTtJQUN2QyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0VBQzVFLENBQUMsTUFDSSxJQUFJLFVBQVUsS0FBSyxvQkFBb0IsRUFBRTtJQUM1QyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0VBQzVFLENBQUMsTUFDSSxJQUFJLFVBQVUsS0FBSyxvQkFBb0IsRUFBRTtJQUM1QyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0VBQzVFLENBQUMsTUFDSSxJQUFJLFVBQVUsS0FBSyxvQkFBb0IsRUFBRTtJQUM1QyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0VBQzVFLENBQUMsTUFDSSxJQUFJLFVBQVUsS0FBSyxvQkFBb0IsRUFBRTtJQUM1QyxJQUFJLFlBQVksR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFD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QTtFQUFBLEtBQUE7QUFBQTtBQUFBLE9BQUE7QUFBQSxTQUFBLGdCQUFBLFFBQUEsRUFBQSxXQUFBLFVBQUEsUUFBQSxZQUFBLFdBQUEsZUFBQSxTQUFBO0FBQUEsU0FBQSxrQkFBQSxNQUFBLEVBQUEsS0FBQSxhQUFBLENBQUEsTUFBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLFVBQUEsVUFBQSxHQUFBLEtBQUEsQ0FBQSxDQUFBLEdBQUEsVUFBQSxDQUFBLFVBQUEsR0FBQSxVQUFBLENBQUEsVUFBQSxXQUFBLFVBQUEsQ0FBQSxZQUFBLHdCQUFBLFVBQUEsRUFBQSxVQUFBLENBQUEsUUFBQSxTQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsTUFBQSxFQUFBLGNBQUEsQ0FBQSxVQUFBLENBQUEsR0FBQSxHQUFBLFVBQUE7QUFBQSxTQUFBLGFBQUEsV0FBQSxFQUFBLFVBQUEsRUFBQSxXQUFBLFFBQUEsVUFBQSxFQUFBLGlCQUFBLENBQUEsV0FBQSxDQUFBLFNBQUEsRUFBQSxVQUFBLE9BQUEsV0FBQSxFQUFBLGlCQUFBLENBQUEsV0FBQSxFQUFBLFdBQUEsR0FBQSxNQUFBLENBQUEsY0FBQSxDQUFBLFdBQUEsaUJBQUEsUUFBQSxtQkFBQSxXQUFBO0FBQUEsU0FBQSxlQUFBLEdBQUEsUUFBQSxHQUFBLEdBQUEsWUFBQSxDQUFBLEdBQUEsb0JBQUEsT0FBQSxDQUFBLEdBQUEsaUJBQUEsR0FBQSxHQUFBLE1BQUEsQ0FBQSxHQUFBO0FBQUEsU0FBQSxhQUFBLEtBQUEsRUFBQSxJQUFBLFFBQUEsT0FBQSxDQUFBLEtBQUEsa0JBQUEsS0FBQSxrQkFBQSxLQUFBLE1BQUEsSUFBQSxHQUFBLEtBQUEsQ0FBQSxNQUFBLENBQUEsV0FBQSxPQUFBLElBQUEsS0FBQSxTQUFBLFFBQUEsR0FBQSxHQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsS0FBQSxFQUFBLElBQUEsb0JBQUEsT0FBQSxDQUFBLEdBQUEsdUJBQUEsR0FBQSxZQUFBLFNBQUEsNERBQUEsSUFBQSxnQkFBQSxNQUFBLEdBQUEsTUFBQSxFQUFBLEtBQUE7QUFBQSxTQUFBLFVBQUEsUUFBQSxFQUFBLFVBQUEsZUFBQSxVQUFBLG1CQUFBLFVBQUEsdUJBQUEsU0FBQSwwREFBQSxRQUFBLENBQUEsU0FBQSxHQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxJQUFBLFVBQUEsQ0FBQSxTQUFBLElBQUEsV0FBQSxJQUFBLEtBQUEsRUFBQSxRQUFBLEVBQUEsUUFBQSxRQUFBLFlBQUEsYUFBQSxNQUFBLENBQUEsY0FBQSxDQUFBLFFBQUEsaUJBQUEsUUFBQSxnQkFBQSxVQUFBLEVBQUEsZUFBQSxDQUFBLFFBQUEsRUFBQSxVQUFBO0FBQUEsU0FBQSxhQUFBLE9BQUEsUUFBQSx5QkFBQSxHQUFBLHlCQUFBLG9CQUFBLHFCQUFBLFFBQUEsS0FBQSxHQUFBLGVBQUEsQ0FBQSxPQUFBLEdBQUEsTUFBQSxNQUFBLHlCQUFBLFFBQUEsU0FBQSxHQUFBLGVBQUEsT0FBQSxXQUFBLEVBQUEsTUFBQSxHQUFBLE9BQUEsQ0FBQSxTQUFBLENBQUEsS0FBQSxFQUFBLFNBQUEsRUFBQSxTQUFBLFlBQUEsTUFBQSxHQUFBLEtBQUEsQ0FBQSxLQUFBLE9BQUEsU0FBQSxZQUFBLDBCQUFBLE9BQUEsTUFBQTtBQUFBLFNBQUEsMkJBQUEsSUFBQSxFQUFBLElBQUEsUUFBQSxJQUFBLEtBQUEsT0FBQSxDQUFBLElBQUEseUJBQUEsSUFBQSwyQkFBQSxJQUFBLGFBQUEsSUFBQSx5QkFBQSxTQUFBLHVFQUFBLHNCQUFBLENBQUEsSUFBQTtBQUFBLFNBQUEsdUJBQUEsSUFBQSxRQUFBLElBQUEseUJBQUEsY0FBQSx3RUFBQSxJQUFBO0FBQUEsU0FBQSxpQkFBQSxLQUFBLFFBQUEsTUFBQSxVQUFBLEdBQUEsc0JBQUEsR0FBQSxLQUFBLFNBQUEsRUFBQSxnQkFBQSxZQUFBLGlCQUFBLEtBQUEsUUFBQSxLQUFBLGNBQUEsaUJBQUEsQ0FBQSxLQUFBLFVBQUEsS0FBQSxhQUFBLEtBQUEsNkJBQUEsU0FBQSxxRUFBQSxNQUFBLHdCQUFBLE1BQUEsQ0FBQSxHQUFBLENBQUEsS0FBQSxVQUFBLE1BQUEsQ0FBQSxHQUFBLENBQUEsS0FBQSxHQUFBLE1BQUEsQ0FBQSxHQUFBLENBQUEsS0FBQSxFQUFBLE9BQUEsY0FBQSxRQUFBLFdBQUEsVUFBQSxDQUFBLEtBQUEsRUFBQSxTQUFBLEVBQUEsZUFBQSxPQUFBLFdBQUEsS0FBQSxPQUFBLENBQUEsU0FBQSxHQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUEsS0FBQSxDQUFBLFNBQUEsSUFBQSxXQUFBLElBQUEsS0FBQSxFQUFBLE9BQUEsRUFBQSxVQUFBLFNBQUEsUUFBQSxRQUFBLFlBQUEsb0JBQUEsZUFBQSxDQUFBLE9BQUEsRUFBQSxLQUFBLGFBQUEsZ0JBQUEsQ0FBQSxLQUFBO0FBQUEsU0FBQSxXQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxRQUFBLHlCQUFBLE1BQUEsVUFBQSxHQUFBLE9BQUEsQ0FBQSxTQUFBLENBQUEsSUFBQSxhQUFBLFVBQUEsWUFBQSxXQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxRQUFBLENBQUEsV0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLEVBQUEsSUFBQSxPQUFBLFdBQUEsR0FBQSxRQUFBLENBQUEsSUFBQSxDQUFBLEtBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxPQUFBLFFBQUEsT0FBQSxXQUFBLFFBQUEsS0FBQSxFQUFBLGVBQUEsQ0FBQSxRQUFBLEVBQUEsS0FBQSxDQUFBLFNBQUEsVUFBQSxRQUFBLGNBQUEsVUFBQSxDQUFBLEtBQUEsT0FBQSxTQUFBO0FBQUEsU0FBQSwwQkFBQSxlQUFBLE9BQUEscUJBQUEsT0FBQSxDQUFBLFNBQUEsb0JBQUEsT0FBQSxDQUFBLFNBQUEsQ0FBQSxJQUFBLDJCQUFBLEtBQUEsb0NBQUEsT0FBQSxDQUFBLFNBQUEsQ0FBQSxPQUFBLENBQUEsSUFBQSxDQUFBLE9BQUEsQ0FBQSxTQUFBLENBQUEsT0FBQSw4Q0FBQSxDQUFBO0FBQUEsU0FBQSxrQkFBQSxFQUFBLFdBQUEsUUFBQSxDQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUEsRUFBQSxFQUFBLE9BQUE7QUFBQSxTQUFBLGdCQUFBLENBQUEsRUFBQSxDQUFBLElBQUEsZUFBQSxHQUFBLE1BQUEsQ0FBQSxjQUFBLEdBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxJQUFBLGNBQUEsZ0JBQUEsQ0FBQSxFQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsU0FBQSxHQUFBLENBQUEsU0FBQSxDQUFBLFlBQUEsZUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBO0FBQUEsU0FBQSxnQkFBQSxDQUFBLElBQUEsZUFBQSxHQUFBLE1BQUEsQ0FBQSxjQUFBLEdBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxJQUFBLGNBQUEsZ0JBQUEsQ0FBQSxXQUFBLENBQUEsQ0FBQSxTQUFBLElBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxDQUFBLGFBQUEsZUFBQSxDQUFBLENBQUE7QUFBQSxTQUFBLDJCQUFBLEdBQUEsRUFBQSxVQUFBLEVBQUEsS0FBQSxJQUFBLDBCQUFBLENBQUEsR0FBQSxFQUFBLFVBQUEsR0FBQSxVQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsRUFBQSxLQUFBO0FBQUEsU0FBQSwyQkFBQSxHQUFBLEVBQUEsaUJBQUEsUUFBQSxpQkFBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLGVBQUEsU0FBQTtBQUFBLFNBQUEsc0JBQUEsUUFBQSxFQUFBLFVBQUEsUUFBQSxVQUFBLEdBQUEsNEJBQUEsQ0FBQSxRQUFBLEVBQUEsVUFBQSxpQkFBQSx3QkFBQSxDQUFBLFFBQUEsRUFBQSxVQUFBO0FBQUEsU0FBQSx5QkFBQSxRQUFBLEVBQUEsVUFBQSxRQUFBLFVBQUEsQ0FBQSxHQUFBLFdBQUEsVUFBQSxDQUFBLEdBQUEsQ0FBQSxJQUFBLENBQUEsUUFBQSxZQUFBLFVBQUEsQ0FBQSxLQUFBO0FBQUEsU0FBQSxzQkFBQSxRQUFBLEVBQUEsVUFBQSxFQUFBLEtBQUEsUUFBQSxVQUFBLEdBQUEsNEJBQUEsQ0FBQSxRQUFBLEVBQUEsVUFBQSxVQUFBLHdCQUFBLENBQUEsUUFBQSxFQUFBLFVBQUEsRUFBQSxLQUFBLFVBQUEsS0FB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QUFBLHVCQUFBLE1BQUEsQ0FBQSxRQUFBLGFBQUEsR0FBQSxrQkFBQSxHQUFBLGdCQUFBLEdBQUEsV0FBQSxHQUFBLHlCQUFBLE1BQUEsSUFBQSxHQUFBLENBQUEsV0FBQSxLQUFBLE1BQUEsSUFBQSxHQUFBLEtBQUEsTUFBQSxDQUFBLFNBQUEscUJBQUEsR0FBQSxLQUFBLE9BQUEsQ0FBQSxHQUFBO0FBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxPQUFBO0VBQUEsS0FBQTtBQUFBO0FBQUEsT0FBQTtBQUFBLFNBQUEsa0JBQUEsTUFBQSxFQUFBLEtBQUEsYUFBQSxDQUFBLE1BQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxVQUFBLFVBQUEsR0FBQSxLQUFBLENBQUEsQ0FBQSxHQUFBLFVBQUEsQ0FBQSxVQUFBLEdBQUEsVUFBQSxDQUFBLFVBQUEsV0FBQSxVQUFBLENBQUEsWUFBQSx3QkFBQSxVQUFBLEVBQUEsVUFBQSxDQUFBLFFBQUEsU0FBQSxNQUFBLENBQUEsY0FBQSxDQUFBLE1BQUEsRUFBQSxjQUFBLENBQUEsVUFBQSxDQUFBLEdBQUEsR0FBQSxVQUFBO0FBQUEsU0FBQSxhQUFBLFdBQUEsRUFBQSxVQUFBLEVBQUEsV0FBQSxRQUFBLFVBQUEsRUFBQSxpQkFBQSxDQUFBLFdBQUEsQ0FBQSxTQUFBLEVBQUEsVUFBQSxPQUFBLFdBQUEsRUFBQSxpQkFBQSxDQUFBLFdBQUEsRUFBQSxXQUFBLEdBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxXQUFBLGlCQUFBLFFBQUEsbUJBQUEsV0FBQTtBQUFBLFNBQUEsZUFBQSxHQUFBLFFBQUEsR0FBQSxHQUFBLFlBQUEsQ0FBQSxHQUFBLG9CQUFBLE9BQUEsQ0FBQSxHQUFBLGlCQUFBLEdBQUEsR0FBQSxNQUFBLENBQUEsR0FBQTtBQUFBLFNBQUEsYUFBQSxLQUFBLEVBQUEsSUFBQSxRQUFBLE9BQUEsQ0FBQSxLQUFBLGtCQUFBLEtBQUEsa0JBQUEsS0FBQSxNQUFBLElBQUEsR0FBQSxLQUFBLENBQUEsTUFBQSxDQUFBLFdBQUEsT0FBQSxJ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O0VBQzVDLElBQUksQ0FBQyxRQUFRLEVBQUU7SUFDYixNQUFNLElBQUksS0FBSyxDQUNiLG1DQUFtQyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQy9DO0VBQ0g7RUFFQSxRQUFRLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQztFQUN4QyxPQUFPLFFBQVE7QUFDakIsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogYXJyYXktZm9yZWFjaFxuICogICBBcnJheSNmb3JFYWNoIHBvbnlmaWxsIGZvciBvbGRlciBicm93c2Vyc1xuICogICAoUG9ueWZpbGw6IEEgcG9seWZpbGwgdGhhdCBkb2Vzbid0IG92ZXJ3cml0ZSB0aGUgbmF0aXZlIG1ldGhvZClcbiAqIFxuICogaHR0cHM6Ly9naXRodWIuY29tL3R3YWRhL2FycmF5LWZvcmVhY2hcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtMjAxNiBUYWt1dG8gV2FkYVxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogICBodHRwczovL2dpdGh1Yi5jb20vdHdhZGEvYXJyYXktZm9yZWFjaC9ibG9iL21hc3Rlci9NSVQtTElDRU5TRVxuICovXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZm9yRWFjaCAoYXJ5LCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgIGlmIChhcnkuZm9yRWFjaCkge1xuICAgICAgICBhcnkuZm9yRWFjaChjYWxsYmFjaywgdGhpc0FyZyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnkubGVuZ3RoOyBpKz0xKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgYXJ5W2ldLCBpLCBhcnkpO1xuICAgIH1cbn07XG4iLCIvKlxuICogY2xhc3NMaXN0LmpzOiBDcm9zcy1icm93c2VyIGZ1bGwgZWxlbWVudC5jbGFzc0xpc3QgaW1wbGVtZW50YXRpb24uXG4gKiAxLjEuMjAxNzA0MjdcbiAqXG4gKiBCeSBFbGkgR3JleSwgaHR0cDovL2VsaWdyZXkuY29tXG4gKiBMaWNlbnNlOiBEZWRpY2F0ZWQgdG8gdGhlIHB1YmxpYyBkb21haW4uXG4gKiAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZWxpZ3JleS9jbGFzc0xpc3QuanMvYmxvYi9tYXN0ZXIvTElDRU5TRS5tZFxuICovXG5cbi8qZ2xvYmFsIHNlbGYsIGRvY3VtZW50LCBET01FeGNlcHRpb24gKi9cblxuLyohIEBzb3VyY2UgaHR0cDovL3B1cmwuZWxpZ3JleS5jb20vZ2l0aHViL2NsYXNzTGlzdC5qcy9ibG9iL21hc3Rlci9jbGFzc0xpc3QuanMgKi9cblxuaWYgKFwiZG9jdW1lbnRcIiBpbiB3aW5kb3cuc2VsZikge1xuXG4vLyBGdWxsIHBvbHlmaWxsIGZvciBicm93c2VycyB3aXRoIG5vIGNsYXNzTGlzdCBzdXBwb3J0XG4vLyBJbmNsdWRpbmcgSUUgPCBFZGdlIG1pc3NpbmcgU1ZHRWxlbWVudC5jbGFzc0xpc3RcbmlmICghKFwiY2xhc3NMaXN0XCIgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIl9cIikpIFxuXHR8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMgJiYgIShcImNsYXNzTGlzdFwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpKSkge1xuXG4oZnVuY3Rpb24gKHZpZXcpIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmlmICghKCdFbGVtZW50JyBpbiB2aWV3KSkgcmV0dXJuO1xuXG52YXJcblx0ICBjbGFzc0xpc3RQcm9wID0gXCJjbGFzc0xpc3RcIlxuXHQsIHByb3RvUHJvcCA9IFwicHJvdG90eXBlXCJcblx0LCBlbGVtQ3RyUHJvdG8gPSB2aWV3LkVsZW1lbnRbcHJvdG9Qcm9wXVxuXHQsIG9iakN0ciA9IE9iamVjdFxuXHQsIHN0clRyaW0gPSBTdHJpbmdbcHJvdG9Qcm9wXS50cmltIHx8IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gdGhpcy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCBcIlwiKTtcblx0fVxuXHQsIGFyckluZGV4T2YgPSBBcnJheVtwcm90b1Byb3BdLmluZGV4T2YgfHwgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHR2YXJcblx0XHRcdCAgaSA9IDBcblx0XHRcdCwgbGVuID0gdGhpcy5sZW5ndGhcblx0XHQ7XG5cdFx0Zm9yICg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0aWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSB7XG5cdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gLTE7XG5cdH1cblx0Ly8gVmVuZG9yczogcGxlYXNlIGFsbG93IGNvbnRlbnQgY29kZSB0byBpbnN0YW50aWF0ZSBET01FeGNlcHRpb25zXG5cdCwgRE9NRXggPSBmdW5jdGlvbiAodHlwZSwgbWVzc2FnZSkge1xuXHRcdHRoaXMubmFtZSA9IHR5cGU7XG5cdFx0dGhpcy5jb2RlID0gRE9NRXhjZXB0aW9uW3R5cGVdO1xuXHRcdHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG5cdH1cblx0LCBjaGVja1Rva2VuQW5kR2V0SW5kZXggPSBmdW5jdGlvbiAoY2xhc3NMaXN0LCB0b2tlbikge1xuXHRcdGlmICh0b2tlbiA9PT0gXCJcIikge1xuXHRcdFx0dGhyb3cgbmV3IERPTUV4KFxuXHRcdFx0XHQgIFwiU1lOVEFYX0VSUlwiXG5cdFx0XHRcdCwgXCJBbiBpbnZhbGlkIG9yIGlsbGVnYWwgc3RyaW5nIHdhcyBzcGVjaWZpZWRcIlxuXHRcdFx0KTtcblx0XHR9XG5cdFx0aWYgKC9cXHMvLnRlc3QodG9rZW4pKSB7XG5cdFx0XHR0aHJvdyBuZXcgRE9NRXgoXG5cdFx0XHRcdCAgXCJJTlZBTElEX0NIQVJBQ1RFUl9FUlJcIlxuXHRcdFx0XHQsIFwiU3RyaW5nIGNvbnRhaW5zIGFuIGludmFsaWQgY2hhcmFjdGVyXCJcblx0XHRcdCk7XG5cdFx0fVxuXHRcdHJldHVybiBhcnJJbmRleE9mLmNhbGwoY2xhc3NMaXN0LCB0b2tlbik7XG5cdH1cblx0LCBDbGFzc0xpc3QgPSBmdW5jdGlvbiAoZWxlbSkge1xuXHRcdHZhclxuXHRcdFx0ICB0cmltbWVkQ2xhc3NlcyA9IHN0clRyaW0uY2FsbChlbGVtLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCIpXG5cdFx0XHQsIGNsYXNzZXMgPSB0cmltbWVkQ2xhc3NlcyA/IHRyaW1tZWRDbGFzc2VzLnNwbGl0KC9cXHMrLykgOiBbXVxuXHRcdFx0LCBpID0gMFxuXHRcdFx0LCBsZW4gPSBjbGFzc2VzLmxlbmd0aFxuXHRcdDtcblx0XHRmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHR0aGlzLnB1c2goY2xhc3Nlc1tpXSk7XG5cdFx0fVxuXHRcdHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGVsZW0uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgdGhpcy50b1N0cmluZygpKTtcblx0XHR9O1xuXHR9XG5cdCwgY2xhc3NMaXN0UHJvdG8gPSBDbGFzc0xpc3RbcHJvdG9Qcm9wXSA9IFtdXG5cdCwgY2xhc3NMaXN0R2V0dGVyID0gZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBuZXcgQ2xhc3NMaXN0KHRoaXMpO1xuXHR9XG47XG4vLyBNb3N0IERPTUV4Y2VwdGlvbiBpbXBsZW1lbnRhdGlvbnMgZG9uJ3QgYWxsb3cgY2FsbGluZyBET01FeGNlcHRpb24ncyB0b1N0cmluZygpXG4vLyBvbiBub24tRE9NRXhjZXB0aW9ucy4gRXJyb3IncyB0b1N0cmluZygpIGlzIHN1ZmZpY2llbnQgaGVyZS5cbkRPTUV4W3Byb3RvUHJvcF0gPSBFcnJvcltwcm90b1Byb3BdO1xuY2xhc3NMaXN0UHJvdG8uaXRlbSA9IGZ1bmN0aW9uIChpKSB7XG5cdHJldHVybiB0aGlzW2ldIHx8IG51bGw7XG59O1xuY2xhc3NMaXN0UHJvdG8uY29udGFpbnMgPSBmdW5jdGlvbiAodG9rZW4pIHtcblx0dG9rZW4gKz0gXCJcIjtcblx0cmV0dXJuIGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbikgIT09IC0xO1xufTtcbmNsYXNzTGlzdFByb3RvLmFkZCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyXG5cdFx0ICB0b2tlbnMgPSBhcmd1bWVudHNcblx0XHQsIGkgPSAwXG5cdFx0LCBsID0gdG9rZW5zLmxlbmd0aFxuXHRcdCwgdG9rZW5cblx0XHQsIHVwZGF0ZWQgPSBmYWxzZVxuXHQ7XG5cdGRvIHtcblx0XHR0b2tlbiA9IHRva2Vuc1tpXSArIFwiXCI7XG5cdFx0aWYgKGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbikgPT09IC0xKSB7XG5cdFx0XHR0aGlzLnB1c2godG9rZW4pO1xuXHRcdFx0dXBkYXRlZCA9IHRydWU7XG5cdFx0fVxuXHR9XG5cdHdoaWxlICgrK2kgPCBsKTtcblxuXHRpZiAodXBkYXRlZCkge1xuXHRcdHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSgpO1xuXHR9XG59O1xuY2xhc3NMaXN0UHJvdG8ucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuXHR2YXJcblx0XHQgIHRva2VucyA9IGFyZ3VtZW50c1xuXHRcdCwgaSA9IDBcblx0XHQsIGwgPSB0b2tlbnMubGVuZ3RoXG5cdFx0LCB0b2tlblxuXHRcdCwgdXBkYXRlZCA9IGZhbHNlXG5cdFx0LCBpbmRleFxuXHQ7XG5cdGRvIHtcblx0XHR0b2tlbiA9IHRva2Vuc1tpXSArIFwiXCI7XG5cdFx0aW5kZXggPSBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pO1xuXHRcdHdoaWxlIChpbmRleCAhPT0gLTEpIHtcblx0XHRcdHRoaXMuc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdHVwZGF0ZWQgPSB0cnVlO1xuXHRcdFx0aW5kZXggPSBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pO1xuXHRcdH1cblx0fVxuXHR3aGlsZSAoKytpIDwgbCk7XG5cblx0aWYgKHVwZGF0ZWQpIHtcblx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUoKTtcblx0fVxufTtcbmNsYXNzTGlzdFByb3RvLnRvZ2dsZSA9IGZ1bmN0aW9uICh0b2tlbiwgZm9yY2UpIHtcblx0dG9rZW4gKz0gXCJcIjtcblxuXHR2YXJcblx0XHQgIHJlc3VsdCA9IHRoaXMuY29udGFpbnModG9rZW4pXG5cdFx0LCBtZXRob2QgPSByZXN1bHQgP1xuXHRcdFx0Zm9yY2UgIT09IHRydWUgJiYgXCJyZW1vdmVcIlxuXHRcdDpcblx0XHRcdGZvcmNlICE9PSBmYWxzZSAmJiBcImFkZFwiXG5cdDtcblxuXHRpZiAobWV0aG9kKSB7XG5cdFx0dGhpc1ttZXRob2RdKHRva2VuKTtcblx0fVxuXG5cdGlmIChmb3JjZSA9PT0gdHJ1ZSB8fCBmb3JjZSA9PT0gZmFsc2UpIHtcblx0XHRyZXR1cm4gZm9yY2U7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuICFyZXN1bHQ7XG5cdH1cbn07XG5jbGFzc0xpc3RQcm90by50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIHRoaXMuam9pbihcIiBcIik7XG59O1xuXG5pZiAob2JqQ3RyLmRlZmluZVByb3BlcnR5KSB7XG5cdHZhciBjbGFzc0xpc3RQcm9wRGVzYyA9IHtcblx0XHQgIGdldDogY2xhc3NMaXN0R2V0dGVyXG5cdFx0LCBlbnVtZXJhYmxlOiB0cnVlXG5cdFx0LCBjb25maWd1cmFibGU6IHRydWVcblx0fTtcblx0dHJ5IHtcblx0XHRvYmpDdHIuZGVmaW5lUHJvcGVydHkoZWxlbUN0clByb3RvLCBjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RQcm9wRGVzYyk7XG5cdH0gY2F0Y2ggKGV4KSB7IC8vIElFIDggZG9lc24ndCBzdXBwb3J0IGVudW1lcmFibGU6dHJ1ZVxuXHRcdC8vIGFkZGluZyB1bmRlZmluZWQgdG8gZmlnaHQgdGhpcyBpc3N1ZSBodHRwczovL2dpdGh1Yi5jb20vZWxpZ3JleS9jbGFzc0xpc3QuanMvaXNzdWVzLzM2XG5cdFx0Ly8gbW9kZXJuaWUgSUU4LU1TVzcgbWFjaGluZSBoYXMgSUU4IDguMC42MDAxLjE4NzAyIGFuZCBpcyBhZmZlY3RlZFxuXHRcdGlmIChleC5udW1iZXIgPT09IHVuZGVmaW5lZCB8fCBleC5udW1iZXIgPT09IC0weDdGRjVFQzU0KSB7XG5cdFx0XHRjbGFzc0xpc3RQcm9wRGVzYy5lbnVtZXJhYmxlID0gZmFsc2U7XG5cdFx0XHRvYmpDdHIuZGVmaW5lUHJvcGVydHkoZWxlbUN0clByb3RvLCBjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RQcm9wRGVzYyk7XG5cdFx0fVxuXHR9XG59IGVsc2UgaWYgKG9iakN0cltwcm90b1Byb3BdLl9fZGVmaW5lR2V0dGVyX18pIHtcblx0ZWxlbUN0clByb3RvLl9fZGVmaW5lR2V0dGVyX18oY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0R2V0dGVyKTtcbn1cblxufSh3aW5kb3cuc2VsZikpO1xuXG59XG5cbi8vIFRoZXJlIGlzIGZ1bGwgb3IgcGFydGlhbCBuYXRpdmUgY2xhc3NMaXN0IHN1cHBvcnQsIHNvIGp1c3QgY2hlY2sgaWYgd2UgbmVlZFxuLy8gdG8gbm9ybWFsaXplIHRoZSBhZGQvcmVtb3ZlIGFuZCB0b2dnbGUgQVBJcy5cblxuKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIHRlc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIl9cIik7XG5cblx0dGVzdEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImMxXCIsIFwiYzJcIik7XG5cblx0Ly8gUG9seWZpbGwgZm9yIElFIDEwLzExIGFuZCBGaXJlZm94IDwyNiwgd2hlcmUgY2xhc3NMaXN0LmFkZCBhbmRcblx0Ly8gY2xhc3NMaXN0LnJlbW92ZSBleGlzdCBidXQgc3VwcG9ydCBvbmx5IG9uZSBhcmd1bWVudCBhdCBhIHRpbWUuXG5cdGlmICghdGVzdEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYzJcIikpIHtcblx0XHR2YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24obWV0aG9kKSB7XG5cdFx0XHR2YXIgb3JpZ2luYWwgPSBET01Ub2tlbkxpc3QucHJvdG90eXBlW21ldGhvZF07XG5cblx0XHRcdERPTVRva2VuTGlzdC5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHRva2VuKSB7XG5cdFx0XHRcdHZhciBpLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuXG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0XHRcdHRva2VuID0gYXJndW1lbnRzW2ldO1xuXHRcdFx0XHRcdG9yaWdpbmFsLmNhbGwodGhpcywgdG9rZW4pO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH07XG5cdFx0Y3JlYXRlTWV0aG9kKCdhZGQnKTtcblx0XHRjcmVhdGVNZXRob2QoJ3JlbW92ZScpO1xuXHR9XG5cblx0dGVzdEVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImMzXCIsIGZhbHNlKTtcblxuXHQvLyBQb2x5ZmlsbCBmb3IgSUUgMTAgYW5kIEZpcmVmb3ggPDI0LCB3aGVyZSBjbGFzc0xpc3QudG9nZ2xlIGRvZXMgbm90XG5cdC8vIHN1cHBvcnQgdGhlIHNlY29uZCBhcmd1bWVudC5cblx0aWYgKHRlc3RFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImMzXCIpKSB7XG5cdFx0dmFyIF90b2dnbGUgPSBET01Ub2tlbkxpc3QucHJvdG90eXBlLnRvZ2dsZTtcblxuXHRcdERPTVRva2VuTGlzdC5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24odG9rZW4sIGZvcmNlKSB7XG5cdFx0XHRpZiAoMSBpbiBhcmd1bWVudHMgJiYgIXRoaXMuY29udGFpbnModG9rZW4pID09PSAhZm9yY2UpIHtcblx0XHRcdFx0cmV0dXJuIGZvcmNlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIF90b2dnbGUuY2FsbCh0aGlzLCB0b2tlbik7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9XG5cblx0dGVzdEVsZW1lbnQgPSBudWxsO1xufSgpKTtcblxufVxuIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5hcnJheS5mcm9tJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5BcnJheS5mcm9tO1xuIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0LmFzc2lnbjtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICh0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJykgdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIGZhbHNlIC0+IEFycmF5I2luZGV4T2Zcbi8vIHRydWUgIC0+IEFycmF5I2luY2x1ZGVzXG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgdG9BYnNvbHV0ZUluZGV4ID0gcmVxdWlyZSgnLi9fdG8tYWJzb2x1dGUtaW5kZXgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKElTX0lOQ0xVREVTKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGVsLCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgTyA9IHRvSU9iamVjdCgkdGhpcyk7XG4gICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICB2YXIgaW5kZXggPSB0b0Fic29sdXRlSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpO1xuICAgIHZhciB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIGlmIChJU19JTkNMVURFUyAmJiBlbCAhPSBlbCkgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSB7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgICBpZiAodmFsdWUgIT0gdmFsdWUpIHJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I2luZGV4T2YgaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIGlmIChJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKSB7XG4gICAgICBpZiAoT1tpbmRleF0gPT09IGVsKSByZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59O1xuIiwiLy8gZ2V0dGluZyB0YWcgZnJvbSAxOS4xLjMuNiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbnZhciBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcbi8vIEVTMyB3cm9uZyBoZXJlXG52YXIgQVJHID0gY29mKGZ1bmN0aW9uICgpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnQXJndW1lbnRzJztcblxuLy8gZmFsbGJhY2sgZm9yIElFMTEgU2NyaXB0IEFjY2VzcyBEZW5pZWQgZXJyb3JcbnZhciB0cnlHZXQgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICB0cnkge1xuICAgIHJldHVybiBpdFtrZXldO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciBPLCBULCBCO1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogaXQgPT09IG51bGwgPyAnTnVsbCdcbiAgICAvLyBAQHRvU3RyaW5nVGFnIGNhc2VcbiAgICA6IHR5cGVvZiAoVCA9IHRyeUdldChPID0gT2JqZWN0KGl0KSwgVEFHKSkgPT0gJ3N0cmluZycgPyBUXG4gICAgLy8gYnVpbHRpblRhZyBjYXNlXG4gICAgOiBBUkcgPyBjb2YoTylcbiAgICAvLyBFUzMgYXJndW1lbnRzIGZhbGxiYWNrXG4gICAgOiAoQiA9IGNvZihPKSkgPT0gJ09iamVjdCcgJiYgdHlwZW9mIE8uY2FsbGVlID09ICdmdW5jdGlvbicgPyAnQXJndW1lbnRzJyA6IEI7XG59O1xuIiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59O1xuIiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHsgdmVyc2lvbjogJzIuNi4xMicgfTtcbmlmICh0eXBlb2YgX19lID09ICdudW1iZXInKSBfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBpbmRleCwgdmFsdWUpIHtcbiAgaWYgKGluZGV4IGluIG9iamVjdCkgJGRlZmluZVByb3BlcnR5LmYob2JqZWN0LCBpbmRleCwgY3JlYXRlRGVzYygwLCB2YWx1ZSkpO1xuICBlbHNlIG9iamVjdFtpbmRleF0gPSB2YWx1ZTtcbn07XG4iLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmbiwgdGhhdCwgbGVuZ3RoKSB7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmICh0aGF0ID09PSB1bmRlZmluZWQpIHJldHVybiBmbjtcbiAgc3dpdGNoIChsZW5ndGgpIHtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKC8qIC4uLmFyZ3MgKi8pIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG4iLCIvLyA3LjIuMSBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ID09IHVuZGVmaW5lZCkgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSkuYSAhPSA3O1xufSk7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xuLy8gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCcgaW4gb2xkIElFXG52YXIgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTtcbiIsIi8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcbm1vZHVsZS5leHBvcnRzID0gKFxuICAnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSx0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJ1xuKS5zcGxpdCgnLCcpO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24gKHR5cGUsIG5hbWUsIHNvdXJjZSkge1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRjtcbiAgdmFyIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0Lkc7XG4gIHZhciBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TO1xuICB2YXIgSVNfUFJPVE8gPSB0eXBlICYgJGV4cG9ydC5QO1xuICB2YXIgSVNfQklORCA9IHR5cGUgJiAkZXhwb3J0LkI7XG4gIHZhciB0YXJnZXQgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gfHwgKGdsb2JhbFtuYW1lXSA9IHt9KSA6IChnbG9iYWxbbmFtZV0gfHwge30pW1BST1RPVFlQRV07XG4gIHZhciBleHBvcnRzID0gSVNfR0xPQkFMID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSk7XG4gIHZhciBleHBQcm90byA9IGV4cG9ydHNbUFJPVE9UWVBFXSB8fCAoZXhwb3J0c1tQUk9UT1RZUEVdID0ge30pO1xuICB2YXIga2V5LCBvd24sIG91dCwgZXhwO1xuICBpZiAoSVNfR0xPQkFMKSBzb3VyY2UgPSBuYW1lO1xuICBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiB0YXJnZXRba2V5XSAhPT0gdW5kZWZpbmVkO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gKG93biA/IHRhcmdldCA6IHNvdXJjZSlba2V5XTtcbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIGV4cCA9IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4dGVuZCBnbG9iYWxcbiAgICBpZiAodGFyZ2V0KSByZWRlZmluZSh0YXJnZXQsIGtleSwgb3V0LCB0eXBlICYgJGV4cG9ydC5VKTtcbiAgICAvLyBleHBvcnRcbiAgICBpZiAoZXhwb3J0c1trZXldICE9IG91dCkgaGlkZShleHBvcnRzLCBrZXksIGV4cCk7XG4gICAgaWYgKElTX1BST1RPICYmIGV4cFByb3RvW2tleV0gIT0gb3V0KSBleHBQcm90b1trZXldID0gb3V0O1xuICB9XG59O1xuZ2xvYmFsLmNvcmUgPSBjb3JlO1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYykge1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnbmF0aXZlLWZ1bmN0aW9uLXRvLXN0cmluZycsIEZ1bmN0aW9uLnRvU3RyaW5nKTtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGZcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmICh0eXBlb2YgX19nID09ICdudW1iZXInKSBfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJ2YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07XG4iLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgIT09IHVuZGVmaW5lZCAmJiAoSXRlcmF0b3JzLkFycmF5ID09PSBpdCB8fCBBcnJheVByb3RvW0lURVJBVE9SXSA9PT0gaXQpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59O1xuIiwiLy8gY2FsbCBzb21ldGhpbmcgb24gaXRlcmF0b3Igc3RlcCB3aXRoIHNhZmUgY2xvc2luZyBvbiBlcnJvclxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaCAoZSkge1xuICAgIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XG4gICAgaWYgKHJldCAhPT0gdW5kZWZpbmVkKSBhbk9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xuICAgIHRocm93IGU7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xudmFyIGRlc2NyaXB0b3IgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpIHtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7IG5leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCkgfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZID0gcmVxdWlyZSgnLi9fbGlicmFyeScpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciAkaXRlckNyZWF0ZSA9IHJlcXVpcmUoJy4vX2l0ZXItY3JlYXRlJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgQlVHR1kgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSk7IC8vIFNhZmFyaSBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbnZhciBGRl9JVEVSQVRPUiA9ICdAQGl0ZXJhdG9yJztcbnZhciBLRVlTID0gJ2tleXMnO1xudmFyIFZBTFVFUyA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCkge1xuICAkaXRlckNyZWF0ZShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG4gIHZhciBnZXRNZXRob2QgPSBmdW5jdGlvbiAoa2luZCkge1xuICAgIGlmICghQlVHR1kgJiYga2luZCBpbiBwcm90bykgcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaCAoa2luZCkge1xuICAgICAgY2FzZSBLRVlTOiByZXR1cm4gZnVuY3Rpb24ga2V5cygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gIH07XG4gIHZhciBUQUcgPSBOQU1FICsgJyBJdGVyYXRvcic7XG4gIHZhciBERUZfVkFMVUVTID0gREVGQVVMVCA9PSBWQUxVRVM7XG4gIHZhciBWQUxVRVNfQlVHID0gZmFsc2U7XG4gIHZhciBwcm90byA9IEJhc2UucHJvdG90eXBlO1xuICB2YXIgJG5hdGl2ZSA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXTtcbiAgdmFyICRkZWZhdWx0ID0gJG5hdGl2ZSB8fCBnZXRNZXRob2QoREVGQVVMVCk7XG4gIHZhciAkZW50cmllcyA9IERFRkFVTFQgPyAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJykgOiB1bmRlZmluZWQ7XG4gIHZhciAkYW55TmF0aXZlID0gTkFNRSA9PSAnQXJyYXknID8gcHJvdG8uZW50cmllcyB8fCAkbmF0aXZlIDogJG5hdGl2ZTtcbiAgdmFyIG1ldGhvZHMsIGtleSwgSXRlcmF0b3JQcm90b3R5cGU7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYgKCRhbnlOYXRpdmUpIHtcbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvdHlwZU9mKCRhbnlOYXRpdmUuY2FsbChuZXcgQmFzZSgpKSk7XG4gICAgaWYgKEl0ZXJhdG9yUHJvdG90eXBlICE9PSBPYmplY3QucHJvdG90eXBlICYmIEl0ZXJhdG9yUHJvdG90eXBlLm5leHQpIHtcbiAgICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICAgIHNldFRvU3RyaW5nVGFnKEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgICAgLy8gZml4IGZvciBzb21lIG9sZCBlbmdpbmVzXG4gICAgICBpZiAoIUxJQlJBUlkgJiYgdHlwZW9mIEl0ZXJhdG9yUHJvdG90eXBlW0lURVJBVE9SXSAhPSAnZnVuY3Rpb24nKSBoaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgaWYgKERFRl9WQUxVRVMgJiYgJG5hdGl2ZSAmJiAkbmF0aXZlLm5hbWUgIT09IFZBTFVFUykge1xuICAgIFZBTFVFU19CVUcgPSB0cnVlO1xuICAgICRkZWZhdWx0ID0gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZiAoKCFMSUJSQVJZIHx8IEZPUkNFRCkgJiYgKEJVR0dZIHx8IFZBTFVFU19CVUcgfHwgIXByb3RvW0lURVJBVE9SXSkpIHtcbiAgICBoaWRlKHByb3RvLCBJVEVSQVRPUiwgJGRlZmF1bHQpO1xuICB9XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gJGRlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddID0gcmV0dXJuVGhpcztcbiAgaWYgKERFRkFVTFQpIHtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiBERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6IElTX1NFVCA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKEtFWVMpLFxuICAgICAgZW50cmllczogJGVudHJpZXNcbiAgICB9O1xuICAgIGlmIChGT1JDRUQpIGZvciAoa2V5IGluIG1ldGhvZHMpIHtcbiAgICAgIGlmICghKGtleSBpbiBwcm90bykpIHJlZGVmaW5lKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKEJVR0dZIHx8IFZBTFVFU19CVUcpLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07XG4iLCJ2YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBTQUZFX0NMT1NJTkcgPSBmYWxzZTtcblxudHJ5IHtcbiAgdmFyIHJpdGVyID0gWzddW0lURVJBVE9SXSgpO1xuICByaXRlclsncmV0dXJuJ10gPSBmdW5jdGlvbiAoKSB7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby10aHJvdy1saXRlcmFsXG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uICgpIHsgdGhyb3cgMjsgfSk7XG59IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYywgc2tpcENsb3NpbmcpIHtcbiAgaWYgKCFza2lwQ2xvc2luZyAmJiAhU0FGRV9DTE9TSU5HKSByZXR1cm4gZmFsc2U7XG4gIHZhciBzYWZlID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IFs3XTtcbiAgICB2YXIgaXRlciA9IGFycltJVEVSQVRPUl0oKTtcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB7IGRvbmU6IHNhZmUgPSB0cnVlIH07IH07XG4gICAgYXJyW0lURVJBVE9SXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGl0ZXI7IH07XG4gICAgZXhlYyhhcnIpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIHNhZmU7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7fTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZmFsc2U7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAxOS4xLjIuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlLCAuLi4pXG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xudmFyIGdPUFMgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpO1xudmFyIHBJRSA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgJGFzc2lnbiA9IE9iamVjdC5hc3NpZ247XG5cbi8vIHNob3VsZCB3b3JrIHdpdGggc3ltYm9scyBhbmQgc2hvdWxkIGhhdmUgZGV0ZXJtaW5pc3RpYyBwcm9wZXJ0eSBvcmRlciAoVjggYnVnKVxubW9kdWxlLmV4cG9ydHMgPSAhJGFzc2lnbiB8fCByZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgdmFyIEEgPSB7fTtcbiAgdmFyIEIgPSB7fTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gIHZhciBTID0gU3ltYm9sKCk7XG4gIHZhciBLID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0JztcbiAgQVtTXSA9IDc7XG4gIEsuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGspIHsgQltrXSA9IGs7IH0pO1xuICByZXR1cm4gJGFzc2lnbih7fSwgQSlbU10gIT0gNyB8fCBPYmplY3Qua2V5cygkYXNzaWduKHt9LCBCKSkuam9pbignJykgIT0gSztcbn0pID8gZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgdmFyIFQgPSB0b09iamVjdCh0YXJnZXQpO1xuICB2YXIgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHZhciBpbmRleCA9IDE7XG4gIHZhciBnZXRTeW1ib2xzID0gZ09QUy5mO1xuICB2YXIgaXNFbnVtID0gcElFLmY7XG4gIHdoaWxlIChhTGVuID4gaW5kZXgpIHtcbiAgICB2YXIgUyA9IElPYmplY3QoYXJndW1lbnRzW2luZGV4KytdKTtcbiAgICB2YXIga2V5cyA9IGdldFN5bWJvbHMgPyBnZXRLZXlzKFMpLmNvbmNhdChnZXRTeW1ib2xzKFMpKSA6IGdldEtleXMoUyk7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIHZhciBqID0gMDtcbiAgICB2YXIga2V5O1xuICAgIHdoaWxlIChsZW5ndGggPiBqKSB7XG4gICAgICBrZXkgPSBrZXlzW2orK107XG4gICAgICBpZiAoIURFU0NSSVBUT1JTIHx8IGlzRW51bS5jYWxsKFMsIGtleSkpIFRba2V5XSA9IFNba2V5XTtcbiAgICB9XG4gIH0gcmV0dXJuIFQ7XG59IDogJGFzc2lnbjtcbiIsIi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZFBzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwcycpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIEVtcHR5ID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnaWZyYW1lJyk7XG4gIHZhciBpID0gZW51bUJ1Z0tleXMubGVuZ3RoO1xuICB2YXIgbHQgPSAnPCc7XG4gIHZhciBndCA9ICc+JztcbiAgdmFyIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgcmVxdWlyZSgnLi9faHRtbCcpLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcbiAgLy8gaHRtbC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKGx0ICsgJ3NjcmlwdCcgKyBndCArICdkb2N1bWVudC5GPU9iamVjdCcgKyBsdCArICcvc2NyaXB0JyArIGd0KTtcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcbiAgY3JlYXRlRGljdCA9IGlmcmFtZURvY3VtZW50LkY7XG4gIHdoaWxlIChpLS0pIGRlbGV0ZSBjcmVhdGVEaWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbaV1dO1xuICByZXR1cm4gY3JlYXRlRGljdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChPICE9PSBudWxsKSB7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eSgpO1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IGNyZWF0ZURpY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRQcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi9faWU4LWRvbS1kZWZpbmUnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpO1xudmFyIGRQID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcykge1xuICBhbk9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBhbk9iamVjdChBdHRyaWJ1dGVzKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIGlmICgnZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpIHRocm93IFR5cGVFcnJvcignQWNjZXNzb3JzIG5vdCBzdXBwb3J0ZWQhJyk7XG4gIGlmICgndmFsdWUnIGluIEF0dHJpYnV0ZXMpIE9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcykge1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgPSBnZXRLZXlzKFByb3BlcnRpZXMpO1xuICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gIHZhciBpID0gMDtcbiAgdmFyIFA7XG4gIHdoaWxlIChsZW5ndGggPiBpKSBkUC5mKE8sIFAgPSBrZXlzW2krK10sIFByb3BlcnRpZXNbUF0pO1xuICByZXR1cm4gTztcbn07XG4iLCJleHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuIiwiLy8gMTkuMS4yLjkgLyAxNS4yLjMuMiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIE9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gKE8pIHtcbiAgTyA9IHRvT2JqZWN0KE8pO1xuICBpZiAoaGFzKE8sIElFX1BST1RPKSkgcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZiAodHlwZW9mIE8uY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBPIGluc3RhbmNlb2YgTy5jb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvIDogbnVsbDtcbn07XG4iLCJ2YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIGFycmF5SW5kZXhPZiA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJykoZmFsc2UpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWVzKSB7XG4gIHZhciBPID0gdG9JT2JqZWN0KG9iamVjdCk7XG4gIHZhciBpID0gMDtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBPKSBpZiAoa2V5ICE9IElFX1BST1RPKSBoYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlIChuYW1lcy5sZW5ndGggPiBpKSBpZiAoaGFzKE8sIGtleSA9IG5hbWVzW2krK10pKSB7XG4gICAgfmFycmF5SW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pIHtcbiAgcmV0dXJuICRrZXlzKE8sIGVudW1CdWdLZXlzKTtcbn07XG4iLCJleHBvcnRzLmYgPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJpdG1hcCwgdmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZTogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfTtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBTUkMgPSByZXF1aXJlKCcuL191aWQnKSgnc3JjJyk7XG52YXIgJHRvU3RyaW5nID0gcmVxdWlyZSgnLi9fZnVuY3Rpb24tdG8tc3RyaW5nJyk7XG52YXIgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJztcbnZhciBUUEwgPSAoJycgKyAkdG9TdHJpbmcpLnNwbGl0KFRPX1NUUklORyk7XG5cbnJlcXVpcmUoJy4vX2NvcmUnKS5pbnNwZWN0U291cmNlID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiAkdG9TdHJpbmcuY2FsbChpdCk7XG59O1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTywga2V5LCB2YWwsIHNhZmUpIHtcbiAgdmFyIGlzRnVuY3Rpb24gPSB0eXBlb2YgdmFsID09ICdmdW5jdGlvbic7XG4gIGlmIChpc0Z1bmN0aW9uKSBoYXModmFsLCAnbmFtZScpIHx8IGhpZGUodmFsLCAnbmFtZScsIGtleSk7XG4gIGlmIChPW2tleV0gPT09IHZhbCkgcmV0dXJuO1xuICBpZiAoaXNGdW5jdGlvbikgaGFzKHZhbCwgU1JDKSB8fCBoaWRlKHZhbCwgU1JDLCBPW2tleV0gPyAnJyArIE9ba2V5XSA6IFRQTC5qb2luKFN0cmluZyhrZXkpKSk7XG4gIGlmIChPID09PSBnbG9iYWwpIHtcbiAgICBPW2tleV0gPSB2YWw7XG4gIH0gZWxzZSBpZiAoIXNhZmUpIHtcbiAgICBkZWxldGUgT1trZXldO1xuICAgIGhpZGUoTywga2V5LCB2YWwpO1xuICB9IGVsc2UgaWYgKE9ba2V5XSkge1xuICAgIE9ba2V5XSA9IHZhbDtcbiAgfSBlbHNlIHtcbiAgICBoaWRlKE8sIGtleSwgdmFsKTtcbiAgfVxuLy8gYWRkIGZha2UgRnVuY3Rpb24jdG9TdHJpbmcgZm9yIGNvcnJlY3Qgd29yayB3cmFwcGVkIG1ldGhvZHMgLyBjb25zdHJ1Y3RvcnMgd2l0aCBtZXRob2RzIGxpa2UgTG9EYXNoIGlzTmF0aXZlXG59KShGdW5jdGlvbi5wcm90b3R5cGUsIFRPX1NUUklORywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nICYmIHRoaXNbU1JDXSB8fCAkdG9TdHJpbmcuY2FsbCh0aGlzKTtcbn0pO1xuIiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCB0YWcsIHN0YXQpIHtcbiAgaWYgKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpIGRlZihpdCwgVEFHLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHRhZyB9KTtcbn07XG4iLCJ2YXIgc2hhcmVkID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ2tleXMnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gc2hhcmVkW2tleV0gfHwgKHNoYXJlZFtrZXldID0gdWlkKGtleSkpO1xufTtcbiIsInZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nO1xudmFyIHN0b3JlID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHZhbHVlICE9PSB1bmRlZmluZWQgPyB2YWx1ZSA6IHt9KTtcbn0pKCd2ZXJzaW9ucycsIFtdKS5wdXNoKHtcbiAgdmVyc2lvbjogY29yZS52ZXJzaW9uLFxuICBtb2RlOiByZXF1aXJlKCcuL19saWJyYXJ5JykgPyAncHVyZScgOiAnZ2xvYmFsJyxcbiAgY29weXJpZ2h0OiAnwqkgMjAyMCBEZW5pcyBQdXNoa2FyZXYgKHpsb2lyb2NrLnJ1KSdcbn0pO1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFRPX1NUUklORykge1xuICByZXR1cm4gZnVuY3Rpb24gKHRoYXQsIHBvcykge1xuICAgIHZhciBzID0gU3RyaW5nKGRlZmluZWQodGhhdCkpO1xuICAgIHZhciBpID0gdG9JbnRlZ2VyKHBvcyk7XG4gICAgdmFyIGwgPSBzLmxlbmd0aDtcbiAgICB2YXIgYSwgYjtcbiAgICBpZiAoaSA8IDAgfHwgaSA+PSBsKSByZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTtcbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgbWF4ID0gTWF0aC5tYXg7XG52YXIgbWluID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpbmRleCwgbGVuZ3RoKSB7XG4gIGluZGV4ID0gdG9JbnRlZ2VyKGluZGV4KTtcbiAgcmV0dXJuIGluZGV4IDwgMCA/IG1heChpbmRleCArIGxlbmd0aCwgMCkgOiBtaW4oaW5kZXgsIGxlbmd0aCk7XG59O1xuIiwiLy8gNy4xLjQgVG9JbnRlZ2VyXG52YXIgY2VpbCA9IE1hdGguY2VpbDtcbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn07XG4iLCIvLyB0byBpbmRleGVkIG9iamVjdCwgdG9PYmplY3Qgd2l0aCBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIHN0cmluZ3NcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gSU9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuIiwiLy8gNy4xLjE1IFRvTGVuZ3RoXG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIG1pbiA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07XG4iLCIvLyA3LjEuMTMgVG9PYmplY3QoYXJndW1lbnQpXG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcbiIsIi8vIDcuMS4xIFRvUHJpbWl0aXZlKGlucHV0IFssIFByZWZlcnJlZFR5cGVdKVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG4vLyBpbnN0ZWFkIG9mIHRoZSBFUzYgc3BlYyB2ZXJzaW9uLCB3ZSBkaWRuJ3QgaW1wbGVtZW50IEBAdG9QcmltaXRpdmUgY2FzZVxuLy8gYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgLSBmbGFnIC0gcHJlZmVycmVkIHR5cGUgaXMgYSBzdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBTKSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSByZXR1cm4gaXQ7XG4gIHZhciBmbiwgdmFsO1xuICBpZiAoUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKHR5cGVvZiAoZm4gPSBpdC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICghUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTtcbiIsInZhciBpZCA9IDA7XG52YXIgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiAnU3ltYm9sKCcuY29uY2F0KGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXksICcpXycsICgrK2lkICsgcHgpLnRvU3RyaW5nKDM2KSk7XG59O1xuIiwidmFyIHN0b3JlID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ3drcycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xudmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLlN5bWJvbDtcbnZhciBVU0VfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PSAnZnVuY3Rpb24nO1xuXG52YXIgJGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxuICAgIFVTRV9TWU1CT0wgJiYgU3ltYm9sW25hbWVdIHx8IChVU0VfU1lNQk9MID8gU3ltYm9sIDogdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59O1xuXG4kZXhwb3J0cy5zdG9yZSA9IHN0b3JlO1xuIiwidmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuL19jbGFzc29mJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29yZScpLmdldEl0ZXJhdG9yTWV0aG9kID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCAhPSB1bmRlZmluZWQpIHJldHVybiBpdFtJVEVSQVRPUl1cbiAgICB8fCBpdFsnQEBpdGVyYXRvciddXG4gICAgfHwgSXRlcmF0b3JzW2NsYXNzb2YoaXQpXTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgY2FsbCA9IHJlcXVpcmUoJy4vX2l0ZXItY2FsbCcpO1xudmFyIGlzQXJyYXlJdGVyID0gcmVxdWlyZSgnLi9faXMtYXJyYXktaXRlcicpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgY3JlYXRlUHJvcGVydHkgPSByZXF1aXJlKCcuL19jcmVhdGUtcHJvcGVydHknKTtcbnZhciBnZXRJdGVyRm4gPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFyZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpKGZ1bmN0aW9uIChpdGVyKSB7IEFycmF5LmZyb20oaXRlcik7IH0pLCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMi4xIEFycmF5LmZyb20oYXJyYXlMaWtlLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgZnJvbTogZnVuY3Rpb24gZnJvbShhcnJheUxpa2UgLyogLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZCAqLykge1xuICAgIHZhciBPID0gdG9PYmplY3QoYXJyYXlMaWtlKTtcbiAgICB2YXIgQyA9IHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgPyB0aGlzIDogQXJyYXk7XG4gICAgdmFyIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHZhciBtYXBmbiA9IGFMZW4gPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkO1xuICAgIHZhciBtYXBwaW5nID0gbWFwZm4gIT09IHVuZGVmaW5lZDtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBpdGVyRm4gPSBnZXRJdGVyRm4oTyk7XG4gICAgdmFyIGxlbmd0aCwgcmVzdWx0LCBzdGVwLCBpdGVyYXRvcjtcbiAgICBpZiAobWFwcGluZykgbWFwZm4gPSBjdHgobWFwZm4sIGFMZW4gPiAyID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkLCAyKTtcbiAgICAvLyBpZiBvYmplY3QgaXNuJ3QgaXRlcmFibGUgb3IgaXQncyBhcnJheSB3aXRoIGRlZmF1bHQgaXRlcmF0b3IgLSB1c2Ugc2ltcGxlIGNhc2VcbiAgICBpZiAoaXRlckZuICE9IHVuZGVmaW5lZCAmJiAhKEMgPT0gQXJyYXkgJiYgaXNBcnJheUl0ZXIoaXRlckZuKSkpIHtcbiAgICAgIGZvciAoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChPKSwgcmVzdWx0ID0gbmV3IEMoKTsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyBpbmRleCsrKSB7XG4gICAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIG1hcHBpbmcgPyBjYWxsKGl0ZXJhdG9yLCBtYXBmbiwgW3N0ZXAudmFsdWUsIGluZGV4XSwgdHJ1ZSkgOiBzdGVwLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgICAgZm9yIChyZXN1bHQgPSBuZXcgQyhsZW5ndGgpOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gbWFwZm4oT1tpbmRleF0sIGluZGV4KSA6IE9baW5kZXhdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0Lmxlbmd0aCA9IGluZGV4O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pO1xuIiwiLy8gMTkuMS4zLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSlcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GLCAnT2JqZWN0JywgeyBhc3NpZ246IHJlcXVpcmUoJy4vX29iamVjdC1hc3NpZ24nKSB9KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkYXQgPSByZXF1aXJlKCcuL19zdHJpbmctYXQnKSh0cnVlKTtcblxuLy8gMjEuMS4zLjI3IFN0cmluZy5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShTdHJpbmcsICdTdHJpbmcnLCBmdW5jdGlvbiAoaXRlcmF0ZWQpIHtcbiAgdGhpcy5fdCA9IFN0cmluZyhpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24gKCkge1xuICB2YXIgTyA9IHRoaXMuX3Q7XG4gIHZhciBpbmRleCA9IHRoaXMuX2k7XG4gIHZhciBwb2ludDtcbiAgaWYgKGluZGV4ID49IE8ubGVuZ3RoKSByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIHBvaW50ID0gJGF0KE8sIGluZGV4KTtcbiAgdGhpcy5faSArPSBwb2ludC5sZW5ndGg7XG4gIHJldHVybiB7IHZhbHVlOiBwb2ludCwgZG9uZTogZmFsc2UgfTtcbn0pO1xuIiwiLyogZ2xvYmFsIGRlZmluZSwgS2V5Ym9hcmRFdmVudCwgbW9kdWxlICovXG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbCA9IHtcbiAgICBwb2x5ZmlsbDogcG9seWZpbGwsXG4gICAga2V5czoge1xuICAgICAgMzogJ0NhbmNlbCcsXG4gICAgICA2OiAnSGVscCcsXG4gICAgICA4OiAnQmFja3NwYWNlJyxcbiAgICAgIDk6ICdUYWInLFxuICAgICAgMTI6ICdDbGVhcicsXG4gICAgICAxMzogJ0VudGVyJyxcbiAgICAgIDE2OiAnU2hpZnQnLFxuICAgICAgMTc6ICdDb250cm9sJyxcbiAgICAgIDE4OiAnQWx0JyxcbiAgICAgIDE5OiAnUGF1c2UnLFxuICAgICAgMjA6ICdDYXBzTG9jaycsXG4gICAgICAyNzogJ0VzY2FwZScsXG4gICAgICAyODogJ0NvbnZlcnQnLFxuICAgICAgMjk6ICdOb25Db252ZXJ0JyxcbiAgICAgIDMwOiAnQWNjZXB0JyxcbiAgICAgIDMxOiAnTW9kZUNoYW5nZScsXG4gICAgICAzMjogJyAnLFxuICAgICAgMzM6ICdQYWdlVXAnLFxuICAgICAgMzQ6ICdQYWdlRG93bicsXG4gICAgICAzNTogJ0VuZCcsXG4gICAgICAzNjogJ0hvbWUnLFxuICAgICAgMzc6ICdBcnJvd0xlZnQnLFxuICAgICAgMzg6ICdBcnJvd1VwJyxcbiAgICAgIDM5OiAnQXJyb3dSaWdodCcsXG4gICAgICA0MDogJ0Fycm93RG93bicsXG4gICAgICA0MTogJ1NlbGVjdCcsXG4gICAgICA0MjogJ1ByaW50JyxcbiAgICAgIDQzOiAnRXhlY3V0ZScsXG4gICAgICA0NDogJ1ByaW50U2NyZWVuJyxcbiAgICAgIDQ1OiAnSW5zZXJ0JyxcbiAgICAgIDQ2OiAnRGVsZXRlJyxcbiAgICAgIDQ4OiBbJzAnLCAnKSddLFxuICAgICAgNDk6IFsnMScsICchJ10sXG4gICAgICA1MDogWycyJywgJ0AnXSxcbiAgICAgIDUxOiBbJzMnLCAnIyddLFxuICAgICAgNTI6IFsnNCcsICckJ10sXG4gICAgICA1MzogWyc1JywgJyUnXSxcbiAgICAgIDU0OiBbJzYnLCAnXiddLFxuICAgICAgNTU6IFsnNycsICcmJ10sXG4gICAgICA1NjogWyc4JywgJyonXSxcbiAgICAgIDU3OiBbJzknLCAnKCddLFxuICAgICAgOTE6ICdPUycsXG4gICAgICA5MzogJ0NvbnRleHRNZW51JyxcbiAgICAgIDE0NDogJ051bUxvY2snLFxuICAgICAgMTQ1OiAnU2Nyb2xsTG9jaycsXG4gICAgICAxODE6ICdWb2x1bWVNdXRlJyxcbiAgICAgIDE4MjogJ1ZvbHVtZURvd24nLFxuICAgICAgMTgzOiAnVm9sdW1lVXAnLFxuICAgICAgMTg2OiBbJzsnLCAnOiddLFxuICAgICAgMTg3OiBbJz0nLCAnKyddLFxuICAgICAgMTg4OiBbJywnLCAnPCddLFxuICAgICAgMTg5OiBbJy0nLCAnXyddLFxuICAgICAgMTkwOiBbJy4nLCAnPiddLFxuICAgICAgMTkxOiBbJy8nLCAnPyddLFxuICAgICAgMTkyOiBbJ2AnLCAnfiddLFxuICAgICAgMjE5OiBbJ1snLCAneyddLFxuICAgICAgMjIwOiBbJ1xcXFwnLCAnfCddLFxuICAgICAgMjIxOiBbJ10nLCAnfSddLFxuICAgICAgMjIyOiBbXCInXCIsICdcIiddLFxuICAgICAgMjI0OiAnTWV0YScsXG4gICAgICAyMjU6ICdBbHRHcmFwaCcsXG4gICAgICAyNDY6ICdBdHRuJyxcbiAgICAgIDI0NzogJ0NyU2VsJyxcbiAgICAgIDI0ODogJ0V4U2VsJyxcbiAgICAgIDI0OTogJ0VyYXNlRW9mJyxcbiAgICAgIDI1MDogJ1BsYXknLFxuICAgICAgMjUxOiAnWm9vbU91dCdcbiAgICB9XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24ga2V5cyAoRjEtMjQpLlxuICB2YXIgaTtcbiAgZm9yIChpID0gMTsgaSA8IDI1OyBpKyspIHtcbiAgICBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwua2V5c1sxMTEgKyBpXSA9ICdGJyArIGk7XG4gIH1cblxuICAvLyBQcmludGFibGUgQVNDSUkgY2hhcmFjdGVycy5cbiAgdmFyIGxldHRlciA9ICcnO1xuICBmb3IgKGkgPSA2NTsgaSA8IDkxOyBpKyspIHtcbiAgICBsZXR0ZXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpO1xuICAgIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbC5rZXlzW2ldID0gW2xldHRlci50b0xvd2VyQ2FzZSgpLCBsZXR0ZXIudG9VcHBlckNhc2UoKV07XG4gIH1cblxuICBmdW5jdGlvbiBwb2x5ZmlsbCAoKSB7XG4gICAgaWYgKCEoJ0tleWJvYXJkRXZlbnQnIGluIHdpbmRvdykgfHxcbiAgICAgICAgJ2tleScgaW4gS2V5Ym9hcmRFdmVudC5wcm90b3R5cGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBQb2x5ZmlsbCBga2V5YCBvbiBgS2V5Ym9hcmRFdmVudGAuXG4gICAgdmFyIHByb3RvID0ge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoeCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsLmtleXNbdGhpcy53aGljaCB8fCB0aGlzLmtleUNvZGVdO1xuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGtleSkpIHtcbiAgICAgICAgICBrZXkgPSBrZXlbK3RoaXMuc2hpZnRLZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgIH1cbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShLZXlib2FyZEV2ZW50LnByb3RvdHlwZSwgJ2tleScsIHByb3RvKTtcbiAgICByZXR1cm4gcHJvdG87XG4gIH1cblxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKCdrZXlib2FyZGV2ZW50LWtleS1wb2x5ZmlsbCcsIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGw7XG4gIH0gZWxzZSBpZiAod2luZG93KSB7XG4gICAgd2luZG93LmtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbCA9IGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbDtcbiAgfVxuXG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcHJvdG8gPSB0eXBlb2YgRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcgPyBFbGVtZW50LnByb3RvdHlwZSA6IHt9O1xudmFyIHZlbmRvciA9IHByb3RvLm1hdGNoZXNcbiAgfHwgcHJvdG8ubWF0Y2hlc1NlbGVjdG9yXG4gIHx8IHByb3RvLndlYmtpdE1hdGNoZXNTZWxlY3RvclxuICB8fCBwcm90by5tb3pNYXRjaGVzU2VsZWN0b3JcbiAgfHwgcHJvdG8ubXNNYXRjaGVzU2VsZWN0b3JcbiAgfHwgcHJvdG8ub01hdGNoZXNTZWxlY3RvcjtcblxubW9kdWxlLmV4cG9ydHMgPSBtYXRjaDtcblxuLyoqXG4gKiBNYXRjaCBgZWxgIHRvIGBzZWxlY3RvcmAuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBtYXRjaChlbCwgc2VsZWN0b3IpIHtcbiAgaWYgKCFlbCB8fCBlbC5ub2RlVHlwZSAhPT0gMSkgcmV0dXJuIGZhbHNlO1xuICBpZiAodmVuZG9yKSByZXR1cm4gdmVuZG9yLmNhbGwoZWwsIHNlbGVjdG9yKTtcbiAgdmFyIG5vZGVzID0gZWwucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChub2Rlc1tpXSA9PSBlbCkgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuIiwiLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cbid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsImNvbnN0IGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcbmNvbnN0IGRlbGVnYXRlID0gcmVxdWlyZSgnLi9kZWxlZ2F0ZScpO1xuY29uc3QgZGVsZWdhdGVBbGwgPSByZXF1aXJlKCcuL2RlbGVnYXRlQWxsJyk7XG5cbmNvbnN0IERFTEVHQVRFX1BBVFRFUk4gPSAvXiguKyk6ZGVsZWdhdGVcXCgoLispXFwpJC87XG5jb25zdCBTUEFDRSA9ICcgJztcblxuY29uc3QgZ2V0TGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSwgaGFuZGxlcikge1xuICB2YXIgbWF0Y2ggPSB0eXBlLm1hdGNoKERFTEVHQVRFX1BBVFRFUk4pO1xuICB2YXIgc2VsZWN0b3I7XG4gIGlmIChtYXRjaCkge1xuICAgIHR5cGUgPSBtYXRjaFsxXTtcbiAgICBzZWxlY3RvciA9IG1hdGNoWzJdO1xuICB9XG5cbiAgdmFyIG9wdGlvbnM7XG4gIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gJ29iamVjdCcpIHtcbiAgICBvcHRpb25zID0ge1xuICAgICAgY2FwdHVyZTogcG9wS2V5KGhhbmRsZXIsICdjYXB0dXJlJyksXG4gICAgICBwYXNzaXZlOiBwb3BLZXkoaGFuZGxlciwgJ3Bhc3NpdmUnKVxuICAgIH07XG4gIH1cblxuICB2YXIgbGlzdGVuZXIgPSB7XG4gICAgc2VsZWN0b3I6IHNlbGVjdG9yLFxuICAgIGRlbGVnYXRlOiAodHlwZW9mIGhhbmRsZXIgPT09ICdvYmplY3QnKVxuICAgICAgPyBkZWxlZ2F0ZUFsbChoYW5kbGVyKVxuICAgICAgOiBzZWxlY3RvclxuICAgICAgICA/IGRlbGVnYXRlKHNlbGVjdG9yLCBoYW5kbGVyKVxuICAgICAgICA6IGhhbmRsZXIsXG4gICAgb3B0aW9uczogb3B0aW9uc1xuICB9O1xuXG4gIGlmICh0eXBlLmluZGV4T2YoU1BBQ0UpID4gLTEpIHtcbiAgICByZXR1cm4gdHlwZS5zcGxpdChTUEFDRSkubWFwKGZ1bmN0aW9uKF90eXBlKSB7XG4gICAgICByZXR1cm4gYXNzaWduKHt0eXBlOiBfdHlwZX0sIGxpc3RlbmVyKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBsaXN0ZW5lci50eXBlID0gdHlwZTtcbiAgICByZXR1cm4gW2xpc3RlbmVyXTtcbiAgfVxufTtcblxudmFyIHBvcEtleSA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gIHZhciB2YWx1ZSA9IG9ialtrZXldO1xuICBkZWxldGUgb2JqW2tleV07XG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmVoYXZpb3IoZXZlbnRzLCBwcm9wcykge1xuICBjb25zdCBsaXN0ZW5lcnMgPSBPYmplY3Qua2V5cyhldmVudHMpXG4gICAgLnJlZHVjZShmdW5jdGlvbihtZW1vLCB0eXBlKSB7XG4gICAgICB2YXIgbGlzdGVuZXJzID0gZ2V0TGlzdGVuZXJzKHR5cGUsIGV2ZW50c1t0eXBlXSk7XG4gICAgICByZXR1cm4gbWVtby5jb25jYXQobGlzdGVuZXJzKTtcbiAgICB9LCBbXSk7XG5cbiAgcmV0dXJuIGFzc2lnbih7XG4gICAgYWRkOiBmdW5jdGlvbiBhZGRCZWhhdmlvcihlbGVtZW50KSB7XG4gICAgICBsaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbihsaXN0ZW5lcikge1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgbGlzdGVuZXIudHlwZSxcbiAgICAgICAgICBsaXN0ZW5lci5kZWxlZ2F0ZSxcbiAgICAgICAgICBsaXN0ZW5lci5vcHRpb25zXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlQmVoYXZpb3IoZWxlbWVudCkge1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgICAgIGxpc3RlbmVyLnR5cGUsXG4gICAgICAgICAgbGlzdGVuZXIuZGVsZWdhdGUsXG4gICAgICAgICAgbGlzdGVuZXIub3B0aW9uc1xuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCBwcm9wcyk7XG59O1xuIiwiY29uc3QgbWF0Y2hlcyA9IHJlcXVpcmUoJ21hdGNoZXMtc2VsZWN0b3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihlbGVtZW50LCBzZWxlY3Rvcikge1xuICBkbyB7XG4gICAgaWYgKG1hdGNoZXMoZWxlbWVudCwgc2VsZWN0b3IpKSB7XG4gICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9XG4gIH0gd2hpbGUgKChlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlKSAmJiBlbGVtZW50Lm5vZGVUeXBlID09PSAxKTtcbn07XG5cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tcG9zZShmdW5jdGlvbnMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb25zLnNvbWUoZnVuY3Rpb24oZm4pIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGUpID09PSBmYWxzZTtcbiAgICB9LCB0aGlzKTtcbiAgfTtcbn07XG4iLCJjb25zdCBjbG9zZXN0ID0gcmVxdWlyZSgnLi9jbG9zZXN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVsZWdhdGUoc2VsZWN0b3IsIGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiBkZWxlZ2F0aW9uKGV2ZW50KSB7XG4gICAgdmFyIHRhcmdldCA9IGNsb3Nlc3QoZXZlbnQudGFyZ2V0LCBzZWxlY3Rvcik7XG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGFyZ2V0LCBldmVudCk7XG4gICAgfVxuICB9XG59O1xuIiwiY29uc3QgZGVsZWdhdGUgPSByZXF1aXJlKCcuL2RlbGVnYXRlJyk7XG5jb25zdCBjb21wb3NlID0gcmVxdWlyZSgnLi9jb21wb3NlJyk7XG5cbmNvbnN0IFNQTEFUID0gJyonO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlbGVnYXRlQWxsKHNlbGVjdG9ycykge1xuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoc2VsZWN0b3JzKVxuXG4gIC8vIFhYWCBvcHRpbWl6YXRpb246IGlmIHRoZXJlIGlzIG9ubHkgb25lIGhhbmRsZXIgYW5kIGl0IGFwcGxpZXMgdG9cbiAgLy8gYWxsIGVsZW1lbnRzICh0aGUgXCIqXCIgQ1NTIHNlbGVjdG9yKSwgdGhlbiBqdXN0IHJldHVybiB0aGF0XG4gIC8vIGhhbmRsZXJcbiAgaWYgKGtleXMubGVuZ3RoID09PSAxICYmIGtleXNbMF0gPT09IFNQTEFUKSB7XG4gICAgcmV0dXJuIHNlbGVjdG9yc1tTUExBVF07XG4gIH1cblxuICBjb25zdCBkZWxlZ2F0ZXMgPSBrZXlzLnJlZHVjZShmdW5jdGlvbihtZW1vLCBzZWxlY3Rvcikge1xuICAgIG1lbW8ucHVzaChkZWxlZ2F0ZShzZWxlY3Rvciwgc2VsZWN0b3JzW3NlbGVjdG9yXSkpO1xuICAgIHJldHVybiBtZW1vO1xuICB9LCBbXSk7XG4gIHJldHVybiBjb21wb3NlKGRlbGVnYXRlcyk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpZ25vcmUoZWxlbWVudCwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGlnbm9yYW5jZShlKSB7XG4gICAgaWYgKGVsZW1lbnQgIT09IGUudGFyZ2V0ICYmICFlbGVtZW50LmNvbnRhaW5zKGUudGFyZ2V0KSkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhpcywgZSk7XG4gICAgfVxuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGJlaGF2aW9yOiByZXF1aXJlKCcuL2JlaGF2aW9yJyksXG4gIGRlbGVnYXRlOiByZXF1aXJlKCcuL2RlbGVnYXRlJyksXG4gIGRlbGVnYXRlQWxsOiByZXF1aXJlKCcuL2RlbGVnYXRlQWxsJyksXG4gIGlnbm9yZTogcmVxdWlyZSgnLi9pZ25vcmUnKSxcbiAga2V5bWFwOiByZXF1aXJlKCcuL2tleW1hcCcpLFxufTtcbiIsInJlcXVpcmUoJ2tleWJvYXJkZXZlbnQta2V5LXBvbHlmaWxsJyk7XG5cbi8vIHRoZXNlIGFyZSB0aGUgb25seSByZWxldmFudCBtb2RpZmllcnMgc3VwcG9ydGVkIG9uIGFsbCBwbGF0Zm9ybXMsXG4vLyBhY2NvcmRpbmcgdG8gTUROOlxuLy8gPGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9LZXlib2FyZEV2ZW50L2dldE1vZGlmaWVyU3RhdGU+XG5jb25zdCBNT0RJRklFUlMgPSB7XG4gICdBbHQnOiAgICAgICdhbHRLZXknLFxuICAnQ29udHJvbCc6ICAnY3RybEtleScsXG4gICdDdHJsJzogICAgICdjdHJsS2V5JyxcbiAgJ1NoaWZ0JzogICAgJ3NoaWZ0S2V5J1xufTtcblxuY29uc3QgTU9ESUZJRVJfU0VQQVJBVE9SID0gJysnO1xuXG5jb25zdCBnZXRFdmVudEtleSA9IGZ1bmN0aW9uKGV2ZW50LCBoYXNNb2RpZmllcnMpIHtcbiAgdmFyIGtleSA9IGV2ZW50LmtleTtcbiAgaWYgKGhhc01vZGlmaWVycykge1xuICAgIGZvciAodmFyIG1vZGlmaWVyIGluIE1PRElGSUVSUykge1xuICAgICAgaWYgKGV2ZW50W01PRElGSUVSU1ttb2RpZmllcl1dID09PSB0cnVlKSB7XG4gICAgICAgIGtleSA9IFttb2RpZmllciwga2V5XS5qb2luKE1PRElGSUVSX1NFUEFSQVRPUik7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBrZXk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGtleW1hcChrZXlzKSB7XG4gIGNvbnN0IGhhc01vZGlmaWVycyA9IE9iamVjdC5rZXlzKGtleXMpLnNvbWUoZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIGtleS5pbmRleE9mKE1PRElGSUVSX1NFUEFSQVRPUikgPiAtMTtcbiAgfSk7XG4gIHJldHVybiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBrZXkgPSBnZXRFdmVudEtleShldmVudCwgaGFzTW9kaWZpZXJzKTtcbiAgICByZXR1cm4gW2tleSwga2V5LnRvTG93ZXJDYXNlKCldXG4gICAgICAucmVkdWNlKGZ1bmN0aW9uKHJlc3VsdCwgX2tleSkge1xuICAgICAgICBpZiAoX2tleSBpbiBrZXlzKSB7XG4gICAgICAgICAgcmVzdWx0ID0ga2V5c1trZXldLmNhbGwodGhpcywgZXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9LCB1bmRlZmluZWQpO1xuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMuTU9ESUZJRVJTID0gTU9ESUZJRVJTO1xuIiwiJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQgJy4uL3BvbHlmaWxscy9GdW5jdGlvbi9wcm90b3R5cGUvYmluZCc7XHJcbmNvbnN0IHRvZ2dsZSA9IHJlcXVpcmUoJy4uL3V0aWxzL3RvZ2dsZScpO1xyXG5jb25zdCBpc0VsZW1lbnRJblZpZXdwb3J0ID0gcmVxdWlyZSgnLi4vdXRpbHMvaXMtaW4tdmlld3BvcnQnKTtcclxuY29uc3QgQlVUVE9OID0gYC5hY2NvcmRpb24tYnV0dG9uW2FyaWEtY29udHJvbHNdYDtcclxuY29uc3QgRVhQQU5ERUQgPSAnYXJpYS1leHBhbmRlZCc7XHJcbmNvbnN0IEJVTEtfRlVOQ1RJT05fQUNUSU9OX0FUVFJJQlVURSA9IFwiZGF0YS1hY2NvcmRpb24tYnVsay1leHBhbmRcIjtcclxuY29uc3QgVEVYVF9BQ0NPUkRJT04gPSB7XHJcbiAgICBcIm9wZW5fYWxsXCI6IFwiw4VibiBhbGxlXCIsXHJcbiAgICBcImNsb3NlX2FsbFwiOiBcIkx1ayBhbGxlXCJcclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZHMgY2xpY2sgZnVuY3Rpb25hbGl0eSB0byBhY2NvcmRpb24gbGlzdFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAkYWNjb3JkaW9uIHRoZSBhY2NvcmRpb24gdWwgZWxlbWVudFxyXG4gKiBAcGFyYW0ge0pTT059IHN0cmluZ3MgVHJhbnNsYXRlIGxhYmVsczoge1wib3Blbl9hbGxcIjogXCLDhWJuIGFsbGVcIiwgXCJjbG9zZV9hbGxcIjogXCJMdWsgYWxsZVwifVxyXG4gKi9cclxuZnVuY3Rpb24gQWNjb3JkaW9uKCRhY2NvcmRpb24sIHN0cmluZ3MgPSBURVhUX0FDQ09SRElPTikge1xyXG4gICAgaWYgKCEkYWNjb3JkaW9uKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIGFjY29yZGlvbiBncm91cCBlbGVtZW50YCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmFjY29yZGlvbiA9ICRhY2NvcmRpb247XHJcbiAgICB0aGlzLnRleHQgPSBzdHJpbmdzO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0IGV2ZW50bGlzdGVuZXJzIG9uIGNsaWNrIGVsZW1lbnRzIGluIGFjY29yZGlvbiBsaXN0XHJcbiAqL1xyXG5BY2NvcmRpb24ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmJ1dHRvbnMgPSB0aGlzLmFjY29yZGlvbi5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTik7XHJcbiAgICBpZiAodGhpcy5idXR0b25zLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIGFjY29yZGlvbiBidXR0b25zYCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbG9vcCBidXR0b25zIGluIGxpc3RcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5idXR0b25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRCdXR0b24gPSB0aGlzLmJ1dHRvbnNbaV07XHJcblxyXG4gICAgICAgIC8vIFZlcmlmeSBzdGF0ZSBvbiBidXR0b24gYW5kIHN0YXRlIG9uIHBhbmVsXHJcbiAgICAgICAgbGV0IGV4cGFuZGVkID0gY3VycmVudEJ1dHRvbi5nZXRBdHRyaWJ1dGUoRVhQQU5ERUQpID09PSAndHJ1ZSc7XHJcbiAgICAgICAgdGhpcy50b2dnbGVCdXR0b24oY3VycmVudEJ1dHRvbiwgZXhwYW5kZWQpO1xyXG5cclxuICAgICAgICAvLyBTZXQgY2xpY2sgZXZlbnQgb24gYWNjb3JkaW9uIGJ1dHRvbnNcclxuICAgICAgICBjdXJyZW50QnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5ldmVudE9uQ2xpY2suYmluZCh0aGlzLCBjdXJyZW50QnV0dG9uKSwgZmFsc2UpO1xyXG4gICAgICAgIGN1cnJlbnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmV2ZW50T25DbGljay5iaW5kKHRoaXMsIGN1cnJlbnRCdXR0b24pLCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgICAvLyBTZXQgY2xpY2sgZXZlbnQgb24gYnVsayBidXR0b24gaWYgcHJlc2VudFxyXG4gICAgbGV0IHByZXZTaWJsaW5nID0gdGhpcy5hY2NvcmRpb24ucHJldmlvdXNFbGVtZW50U2libGluZztcclxuICAgIGlmIChwcmV2U2libGluZyAhPT0gbnVsbCAmJiBwcmV2U2libGluZy5jbGFzc0xpc3QuY29udGFpbnMoJ2FjY29yZGlvbi1idWxrLWJ1dHRvbicpKSB7XHJcbiAgICAgICAgdGhpcy5idWxrRnVuY3Rpb25CdXR0b24gPSBwcmV2U2libGluZztcclxuICAgICAgICB0aGlzLmJ1bGtGdW5jdGlvbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYnVsa0V2ZW50LmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQnVsayBldmVudCBoYW5kbGVyOiBUcmlnZ2VyZWQgd2hlbiBjbGlja2luZyBvbiAuYWNjb3JkaW9uLWJ1bGstYnV0dG9uXHJcbiAqL1xyXG5BY2NvcmRpb24ucHJvdG90eXBlLmJ1bGtFdmVudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciAkbW9kdWxlID0gdGhpcztcclxuICAgIGlmICghJG1vZHVsZS5hY2NvcmRpb24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY2NvcmRpb24nKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgYWNjb3JkaW9uLmApO1xyXG4gICAgfVxyXG4gICAgaWYgKCRtb2R1bGUuYnV0dG9ucy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBhY2NvcmRpb24gYnV0dG9uc2ApO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBleHBhbmQgPSB0cnVlO1xyXG4gICAgaWYgKCRtb2R1bGUuYnVsa0Z1bmN0aW9uQnV0dG9uLmdldEF0dHJpYnV0ZShCVUxLX0ZVTkNUSU9OX0FDVElPTl9BVFRSSUJVVEUpID09PSBcImZhbHNlXCIpIHtcclxuICAgICAgICBleHBhbmQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJG1vZHVsZS5idXR0b25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgJG1vZHVsZS50b2dnbGVCdXR0b24oJG1vZHVsZS5idXR0b25zW2ldLCBleHBhbmQsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgICRtb2R1bGUuYnVsa0Z1bmN0aW9uQnV0dG9uLnNldEF0dHJpYnV0ZShCVUxLX0ZVTkNUSU9OX0FDVElPTl9BVFRSSUJVVEUsICFleHBhbmQpO1xyXG4gICAgaWYgKCFleHBhbmQgPT09IHRydWUpIHtcclxuICAgICAgICAkbW9kdWxlLmJ1bGtGdW5jdGlvbkJ1dHRvbi5pbm5lclRleHQgPSB0aGlzLnRleHQub3Blbl9hbGw7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgICRtb2R1bGUuYnVsa0Z1bmN0aW9uQnV0dG9uLmlubmVyVGV4dCA9IHRoaXMudGV4dC5jbG9zZV9hbGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBY2NvcmRpb24gYnV0dG9uIGV2ZW50IGhhbmRsZXI6IFRvZ2dsZXMgYWNjb3JkaW9uXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9ICRidXR0b24gXHJcbiAqIEBwYXJhbSB7UG9pbnRlckV2ZW50fSBlIFxyXG4gKi9cclxuQWNjb3JkaW9uLnByb3RvdHlwZS5ldmVudE9uQ2xpY2sgPSBmdW5jdGlvbiAoJGJ1dHRvbiwgZSkge1xyXG4gICAgdmFyICRtb2R1bGUgPSB0aGlzO1xyXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICRtb2R1bGUudG9nZ2xlQnV0dG9uKCRidXR0b24pO1xyXG4gICAgaWYgKCRidXR0b24uZ2V0QXR0cmlidXRlKEVYUEFOREVEKSA9PT0gJ3RydWUnKSB7XHJcbiAgICAgICAgLy8gV2Ugd2VyZSBqdXN0IGV4cGFuZGVkLCBidXQgaWYgYW5vdGhlciBhY2NvcmRpb24gd2FzIGFsc28ganVzdFxyXG4gICAgICAgIC8vIGNvbGxhcHNlZCwgd2UgbWF5IG5vIGxvbmdlciBiZSBpbiB0aGUgdmlld3BvcnQuIFRoaXMgZW5zdXJlc1xyXG4gICAgICAgIC8vIHRoYXQgd2UgYXJlIHN0aWxsIHZpc2libGUsIHNvIHRoZSB1c2VyIGlzbid0IGNvbmZ1c2VkLlxyXG4gICAgICAgIGlmICghaXNFbGVtZW50SW5WaWV3cG9ydCgkYnV0dG9uKSkgJGJ1dHRvbi5zY3JvbGxJbnRvVmlldygpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogVG9nZ2xlIGEgYnV0dG9uJ3MgXCJwcmVzc2VkXCIgc3RhdGUsIG9wdGlvbmFsbHkgcHJvdmlkaW5nIGEgdGFyZ2V0XHJcbiAqIHN0YXRlLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBidXR0b25cclxuICogQHBhcmFtIHtib29sZWFuP30gZXhwYW5kZWQgSWYgbm8gc3RhdGUgaXMgcHJvdmlkZWQsIHRoZSBjdXJyZW50XHJcbiAqIHN0YXRlIHdpbGwgYmUgdG9nZ2xlZCAoZnJvbSBmYWxzZSB0byB0cnVlLCBhbmQgdmljZS12ZXJzYSkuXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRoZSByZXN1bHRpbmcgc3RhdGVcclxuICovXHJcbkFjY29yZGlvbi5wcm90b3R5cGUudG9nZ2xlQnV0dG9uID0gZnVuY3Rpb24gKGJ1dHRvbiwgZXhwYW5kZWQsIGJ1bGsgPSBmYWxzZSkge1xyXG4gICAgbGV0IGFjY29yZGlvbiA9IG51bGw7XHJcbiAgICBpZiAoYnV0dG9uLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjY29yZGlvbicpKSB7XHJcbiAgICAgICAgYWNjb3JkaW9uID0gYnV0dG9uLnBhcmVudE5vZGUucGFyZW50Tm9kZTtcclxuICAgIH0gZWxzZSBpZiAoYnV0dG9uLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnYWNjb3JkaW9uJykpIHtcclxuICAgICAgICBhY2NvcmRpb24gPSBidXR0b24ucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGU7XHJcbiAgICB9XHJcbiAgICBleHBhbmRlZCA9IHRvZ2dsZShidXR0b24sIGV4cGFuZGVkKTtcclxuICAgIGlmIChleHBhbmRlZCkge1xyXG4gICAgICAgIGxldCBldmVudE9wZW4gPSBuZXcgRXZlbnQoJ2Zkcy5hY2NvcmRpb24ub3BlbicpO1xyXG4gICAgICAgIGJ1dHRvbi5kaXNwYXRjaEV2ZW50KGV2ZW50T3Blbik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMuYWNjb3JkaW9uLmNsb3NlJyk7XHJcbiAgICAgICAgYnV0dG9uLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGFjY29yZGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICAgIGxldCBidWxrRnVuY3Rpb24gPSBhY2NvcmRpb24ucHJldmlvdXNFbGVtZW50U2libGluZztcclxuICAgICAgICBpZiAoYnVsa0Z1bmN0aW9uICE9PSBudWxsICYmIGJ1bGtGdW5jdGlvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjY29yZGlvbi1idWxrLWJ1dHRvbicpKSB7XHJcbiAgICAgICAgICAgIGxldCBidXR0b25zID0gYWNjb3JkaW9uLnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKTtcclxuICAgICAgICAgICAgaWYgKGJ1bGsgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYnV0dG9uc09wZW4gPSBhY2NvcmRpb24ucXVlcnlTZWxlY3RvckFsbChCVVRUT04gKyAnW2FyaWEtZXhwYW5kZWQ9XCJ0cnVlXCJdJyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3U3RhdHVzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYnV0dG9ucy5sZW5ndGggPT09IGJ1dHRvbnNPcGVuLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld1N0YXR1cyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGJ1bGtGdW5jdGlvbi5zZXRBdHRyaWJ1dGUoQlVMS19GVU5DVElPTl9BQ1RJT05fQVRUUklCVVRFLCBuZXdTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5ld1N0YXR1cyA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1bGtGdW5jdGlvbi5pbm5lclRleHQgPSB0aGlzLnRleHQub3Blbl9hbGw7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1bGtGdW5jdGlvbi5pbm5lclRleHQgPSB0aGlzLnRleHQuY2xvc2VfYWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQWNjb3JkaW9uOyIsIid1c2Ugc3RyaWN0JztcclxuZnVuY3Rpb24gQWxlcnQoYWxlcnQpe1xyXG4gICAgdGhpcy5hbGVydCA9IGFsZXJ0O1xyXG59XHJcblxyXG5BbGVydC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICBsZXQgY2xvc2UgPSB0aGlzLmFsZXJ0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2FsZXJ0LWNsb3NlJyk7XHJcbiAgICBpZihjbG9zZS5sZW5ndGggPT09IDEpe1xyXG4gICAgICAgIGNsb3NlWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oaWRlLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG59XHJcblxyXG5BbGVydC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmFsZXJ0LmNsYXNzTGlzdC5hZGQoJ2Qtbm9uZScpO1xyXG4gICAgbGV0IGV2ZW50SGlkZSA9IG5ldyBFdmVudCgnZmRzLmFsZXJ0LmhpZGUnKTtcclxuICAgIHRoaXMuYWxlcnQuZGlzcGF0Y2hFdmVudChldmVudEhpZGUpO1xyXG59O1xyXG5cclxuQWxlcnQucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5hbGVydC5jbGFzc0xpc3QucmVtb3ZlKCdkLW5vbmUnKTtcclxuICAgIFxyXG4gICAgbGV0IGV2ZW50U2hvdyA9IG5ldyBFdmVudCgnZmRzLmFsZXJ0LnNob3cnKTtcclxuICAgIHRoaXMuYWxlcnQuZGlzcGF0Y2hFdmVudChldmVudFNob3cpO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQWxlcnQ7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZnVuY3Rpb24gQmFja1RvVG9wKGJhY2t0b3RvcCl7XHJcbiAgICB0aGlzLmJhY2t0b3RvcCA9IGJhY2t0b3RvcDtcclxufVxyXG5cclxuQmFja1RvVG9wLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgYmFja3RvdG9wYnV0dG9uID0gdGhpcy5iYWNrdG90b3A7XHJcblxyXG4gICAgdXBkYXRlQmFja1RvVG9wQnV0dG9uKGJhY2t0b3RvcGJ1dHRvbik7XHJcblxyXG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlciggbGlzdCA9PiB7XHJcbiAgICAgICAgY29uc3QgZXZ0ID0gbmV3IEN1c3RvbUV2ZW50KCdkb20tY2hhbmdlZCcsIHtkZXRhaWw6IGxpc3R9KTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmRpc3BhdGNoRXZlbnQoZXZ0KVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gV2hpY2ggbXV0YXRpb25zIHRvIG9ic2VydmVcclxuICAgIGxldCBjb25maWcgPSB7XHJcbiAgICAgICAgYXR0cmlidXRlcyAgICAgICAgICAgIDogdHJ1ZSxcclxuICAgICAgICBhdHRyaWJ1dGVPbGRWYWx1ZSAgICAgOiBmYWxzZSxcclxuICAgICAgICBjaGFyYWN0ZXJEYXRhICAgICAgICAgOiB0cnVlLFxyXG4gICAgICAgIGNoYXJhY3RlckRhdGFPbGRWYWx1ZSA6IGZhbHNlLFxyXG4gICAgICAgIGNoaWxkTGlzdCAgICAgICAgICAgICA6IHRydWUsXHJcbiAgICAgICAgc3VidHJlZSAgICAgICAgICAgICAgIDogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBET00gY2hhbmdlc1xyXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCBjb25maWcpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdkb20tY2hhbmdlZCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB1cGRhdGVCYWNrVG9Ub3BCdXR0b24oYmFja3RvdG9wYnV0dG9uKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFNjcm9sbCBhY3Rpb25zXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHVwZGF0ZUJhY2tUb1RvcEJ1dHRvbihiYWNrdG90b3BidXR0b24pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gV2luZG93IHJlc2l6ZXNcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgdXBkYXRlQmFja1RvVG9wQnV0dG9uKGJhY2t0b3RvcGJ1dHRvbik7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlQmFja1RvVG9wQnV0dG9uKGJ1dHRvbikge1xyXG4gICAgbGV0IGRvY0JvZHkgPSBkb2N1bWVudC5ib2R5O1xyXG4gICAgbGV0IGRvY0VsZW0gPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgICBsZXQgaGVpZ2h0T2ZWaWV3cG9ydCA9IE1hdGgubWF4KGRvY0VsZW0uY2xpZW50SGVpZ2h0IHx8IDAsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKTtcclxuICAgIGxldCBoZWlnaHRPZlBhZ2UgPSBNYXRoLm1heChkb2NCb2R5LnNjcm9sbEhlaWdodCwgZG9jQm9keS5vZmZzZXRIZWlnaHQsIGRvY0JvZHkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY0VsZW0uc2Nyb2xsSGVpZ2h0LCBkb2NFbGVtLm9mZnNldEhlaWdodCwgZG9jRWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQsIGRvY0VsZW0uY2xpZW50SGVpZ2h0KTtcclxuICAgIFxyXG4gICAgbGV0IGxpbWl0ID0gaGVpZ2h0T2ZWaWV3cG9ydCAqIDI7IC8vIFRoZSB0aHJlc2hvbGQgc2VsZWN0ZWQgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgYSBiYWNrLXRvLXRvcC1idXR0b24gc2hvdWxkIGJlIGRpc3BsYXllZFxyXG4gICAgXHJcbiAgICAvLyBOZXZlciBzaG93IHRoZSBidXR0b24gaWYgdGhlIHBhZ2UgaXMgdG9vIHNob3J0XHJcbiAgICBpZiAobGltaXQgPiBoZWlnaHRPZlBhZ2UpIHtcclxuICAgICAgICBpZiAoIWJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2Qtbm9uZScpKSB7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkLW5vbmUnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBJZiB0aGUgcGFnZSBpcyBsb25nLCBjYWxjdWxhdGUgd2hlbiB0byBzaG93IHRoZSBidXR0b25cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmIChidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdkLW5vbmUnKSkge1xyXG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnZC1ub25lJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbGFzdEtub3duU2Nyb2xsUG9zaXRpb24gPSB3aW5kb3cuc2Nyb2xsWTtcclxuICAgICAgICBsZXQgZm9vdGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJmb290ZXJcIilbMF07IC8vIElmIHRoZXJlIGFyZSBzZXZlcmFsIGZvb3RlcnMsIHRoZSBjb2RlIG9ubHkgYXBwbGllcyB0byB0aGUgZmlyc3QgZm9vdGVyXHJcblxyXG4gICAgICAgIC8vIFNob3cgdGhlIGJ1dHRvbiwgaWYgdGhlIHVzZXIgaGFzIHNjcm9sbGVkIHRvbyBmYXIgZG93blxyXG4gICAgICAgIGlmIChsYXN0S25vd25TY3JvbGxQb3NpdGlvbiA+PSBsaW1pdCkge1xyXG4gICAgICAgICAgICBpZiAoIWlzRm9vdGVyVmlzaWJsZShmb290ZXIpICYmIGJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvb3Rlci1zdGlja3knKSkge1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Zvb3Rlci1zdGlja3knKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChpc0Zvb3RlclZpc2libGUoZm9vdGVyKSAmJiAhYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnZm9vdGVyLXN0aWNreScpKSB7XHJcbiAgICAgICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnZm9vdGVyLXN0aWNreScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIElmIHRoZXJlJ3MgYSBzaWRlbmF2LCB3ZSBtaWdodCB3YW50IHRvIHNob3cgdGhlIGJ1dHRvbiBhbnl3YXlcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHNpZGVuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2lkZW5hdi1saXN0Jyk7IC8vIEZpbmRzIHNpZGUgbmF2aWdhdGlvbnMgKGxlZnQgbWVudXMpIGFuZCBzdGVwIGd1aWRlc1xyXG5cclxuICAgICAgICAgICAgaWYgKHNpZGVuYXYgJiYgc2lkZW5hdi5vZmZzZXRQYXJlbnQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIC8vIE9ubHkgcmVhY3QgdG8gc2lkZW5hdnMsIHdoaWNoIGFyZSBhbHdheXMgdmlzaWJsZSAoaS5lLiBub3Qgb3BlbmVkIGZyb20gb3ZlcmZsb3ctbWVudSBidXR0b25zKVxyXG4gICAgICAgICAgICAgICAgaWYgKCEoc2lkZW5hdi5jbG9zZXN0KFwiLm92ZXJmbG93LW1lbnUtaW5uZXJcIik/LnByZXZpb3VzRWxlbWVudFNpYmxpbmc/LmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSBcInRydWVcIiAmJlxyXG4gICAgICAgICAgICAgICAgc2lkZW5hdi5jbG9zZXN0KFwiLm92ZXJmbG93LW1lbnUtaW5uZXJcIik/LnByZXZpb3VzRWxlbWVudFNpYmxpbmc/Lm9mZnNldFBhcmVudCAhPT0gbnVsbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVjdCA9IHNpZGVuYXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlY3QuYm90dG9tIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzRm9vdGVyVmlzaWJsZShmb290ZXIpICYmIGJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvb3Rlci1zdGlja3knKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Zvb3Rlci1zdGlja3knKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChpc0Zvb3RlclZpc2libGUoZm9vdGVyKSAmJiAhYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnZm9vdGVyLXN0aWNreScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnZm9vdGVyLXN0aWNreScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvb3Rlci1zdGlja3knKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2Zvb3Rlci1zdGlja3knKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gVGhlcmUncyBubyBzaWRlbmF2IGFuZCB3ZSBrbm93IHRoZSB1c2VyIGhhc24ndCByZWFjaGVkIHRoZSBzY3JvbGwgbGltaXQ6IEVuc3VyZSB0aGUgYnV0dG9uIGlzIGhpZGRlblxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnZm9vdGVyLXN0aWNreScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2Zvb3Rlci1zdGlja3knKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzRm9vdGVyVmlzaWJsZShmb290ZXJFbGVtZW50KSB7XHJcbiAgICBpZiAoZm9vdGVyRWxlbWVudD8ucXVlcnlTZWxlY3RvcignLmZvb3RlcicpKSB7XHJcbiAgICAgICAgbGV0IHJlY3QgPSBmb290ZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb290ZXInKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICAgICAgLy8gRm9vdGVyIGlzIHZpc2libGUgb3IgcGFydGx5IHZpc2libGVcclxuICAgICAgICBpZiAoKHJlY3QudG9wIDwgd2luZG93LmlubmVySGVpZ2h0IHx8IHJlY3QudG9wIDwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEZvb3RlciBpcyBoaWRkZW5cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQmFja1RvVG9wOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IE1BWF9MRU5HVEggPSAnZGF0YS1tYXhsZW5ndGgnO1xyXG5jb25zdCBURVhUX0NIQVJBQ1RFUkxJTUlUID0ge1xyXG4gICAgXCJjaGFyYWN0ZXJfcmVtYWluaW5nXCI6IFwiRHUgaGFyIHt2YWx1ZX0gdGVnbiB0aWxiYWdlXCIsXHJcbiAgICBcImNoYXJhY3RlcnNfcmVtYWluaW5nXCI6IFwiRHUgaGFyIHt2YWx1ZX0gdGVnbiB0aWxiYWdlXCIsXHJcbiAgICBcImNoYXJhY3Rlcl90b29fbWFueVwiOiBcIkR1IGhhciB7dmFsdWV9IHRlZ24gZm9yIG1lZ2V0XCIsXHJcbiAgICBcImNoYXJhY3RlcnNfdG9vX21hbnlcIjogXCJEdSBoYXIge3ZhbHVlfSB0ZWduIGZvciBtZWdldFwiXHJcbn07XHJcblxyXG4vKipcclxuICogU2hvdyBudW1iZXIgb2YgY2hhcmFjdGVycyBsZWZ0IGluIGEgZmllbGRcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyRWxlbWVudCBcclxuICogQHBhcmFtIHtKU09OfSBzdHJpbmdzIFRyYW5zbGF0ZSBsYWJlbHM6IHtcImNoYXJhY3Rlcl9yZW1haW5pbmdcIjogXCJEdSBoYXIge3ZhbHVlfSB0ZWduIHRpbGJhZ2VcIiwgXCJjaGFyYWN0ZXJzX3JlbWFpbmluZ1wiOiBcIkR1IGhhciB7dmFsdWV9IHRlZ24gdGlsYmFnZVwiLCBcImNoYXJhY3Rlcl90b29fbWFueVwiOiBcIkR1IGhhciB7dmFsdWV9IHRlZ24gZm9yIG1lZ2V0XCIsIFwiY2hhcmFjdGVyc190b29fbWFueVwiOiBcIkR1IGhhciB7dmFsdWV9IHRlZ24gZm9yIG1lZ2V0XCJ9XHJcbiAqL1xyXG4gZnVuY3Rpb24gQ2hhcmFjdGVyTGltaXQoY29udGFpbmVyRWxlbWVudCwgc3RyaW5ncyA9IFRFWFRfQ0hBUkFDVEVSTElNSVQpIHtcclxuICAgIGlmICghY29udGFpbmVyRWxlbWVudCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBmb3JtLWxpbWl0IGVsZW1lbnRgKTtcclxuICAgIH1cclxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyRWxlbWVudDtcclxuICAgIHRoaXMuaW5wdXQgPSBjb250YWluZXJFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Zvcm0taW5wdXQnKVswXTtcclxuICAgIHRoaXMubWF4bGVuZ3RoID0gdGhpcy5jb250YWluZXIuZ2V0QXR0cmlidXRlKE1BWF9MRU5HVEgpO1xyXG4gICAgdGhpcy50ZXh0ID0gc3RyaW5ncztcclxuXHJcbiAgICBsZXQgbGFzdEtleVVwVGltZXN0YW1wID0gbnVsbDtcclxuICAgIGxldCBvbGRWYWx1ZSA9IHRoaXMuaW5wdXQudmFsdWU7XHJcbiAgICBsZXQgaW50ZXJ2YWxJRCA9IG51bGw7XHJcblxyXG4gICAgbGV0IGhhbmRsZUtleVVwID0gKCkgPT4ge1xyXG4gICAgICAgIHVwZGF0ZVZpc2libGVNZXNzYWdlKHRoaXMpO1xyXG4gICAgICAgIGxhc3RLZXlVcFRpbWVzdGFtcCA9IERhdGUubm93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGhhbmRsZUZvY3VzID0gKCkgPT4ge1xyXG4gICAgICAgIC8qIFJlc2V0IHRoZSBzY3JlZW4gcmVhZGVyIG1lc3NhZ2Ugb24gZm9jdXMgdG8gZm9yY2UgYW4gdXBkYXRlIG9mIHRoZSBtZXNzYWdlLlxyXG4gICAgICAgIFRoaXMgZW5zdXJlcyB0aGF0IGEgc2NyZWVuIHJlYWRlciBpbmZvcm1zIHRoZSB1c2VyIG9mIGhvdyBtYW55IGNoYXJhY3RlcnMgdGhlcmUgaXMgbGVmdFxyXG4gICAgICAgIG9uIGZvY3VzIGFuZCBub3QganVzdCB3aGF0IHRoZSBjaGFyYWN0ZXIgbGltaXQgaXMuICovXHJcbiAgICAgICAgaWYgKHRoaXMuaW5wdXQudmFsdWUgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgbGV0IHNyX21lc3NhZ2UgPSB0aGlzLmNvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjaGFyYWN0ZXItbGltaXQtc3Itb25seScpWzBdO1xyXG4gICAgICAgICAgICBzcl9tZXNzYWdlLmlubmVySFRNTCA9ICcnO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIGludGVydmFsSUQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8qIERvbid0IHVwZGF0ZSB0aGUgU2NyZWVuIFJlYWRlciBtZXNzYWdlIHVubGVzcyBpdCdzIGJlZW4gYXdoaWxlXHJcbiAgICAgICAgICAgIHNpbmNlIHRoZSBsYXN0IGtleSB1cCBldmVudC4gT3RoZXJ3aXNlLCB0aGUgdXNlciB3aWxsIGJlIHNwYW1tZWRcclxuICAgICAgICAgICAgd2l0aCBhdWRpbyBub3RpZmljYXRpb25zIHdoaWxlIHR5cGluZy4gKi9cclxuICAgICAgICAgICAgaWYgKCFsYXN0S2V5VXBUaW1lc3RhbXAgfHwgKERhdGUubm93KCkgLSA1MDApID49IGxhc3RLZXlVcFRpbWVzdGFtcCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNyX21lc3NhZ2UgPSB0aGlzLmNvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjaGFyYWN0ZXItbGltaXQtc3Itb25seScpWzBdLmlubmVySFRNTDtcclxuICAgICAgICAgICAgICAgIGxldCB2aXNpYmxlX21lc3NhZ2UgPSB0aGlzLmNvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjaGFyYWN0ZXItbGltaXQnKVswXS5pbm5lckhUTUw7ICAgICBcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgLyogRG9uJ3QgdXBkYXRlIHRoZSBtZXNzYWdlcyB1bmxlc3MgdGhlIGlucHV0IGhhcyBjaGFuZ2VkIG9yIGlmIHRoZXJlXHJcbiAgICAgICAgICAgICAgICBpcyBhIG1pc21hdGNoIGJldHdlZW4gdGhlIHZpc2libGUgbWVzc2FnZSBhbmQgdGhlIHNjcmVlbiByZWFkZXIgbWVzc2FnZS4gKi9cclxuICAgICAgICAgICAgICAgIGlmIChvbGRWYWx1ZSAhPT0gdGhpcy5pbnB1dC52YWx1ZSB8fCBzcl9tZXNzYWdlICE9PSB2aXNpYmxlX21lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBvbGRWYWx1ZSA9IHRoaXMuaW5wdXQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVNZXNzYWdlcygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpLCAxMDAwKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgbGV0IGhhbmRsZUJsdXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbElEKTtcclxuICAgICAgICAvLyBEb24ndCB1cGRhdGUgdGhlIG1lc3NhZ2VzIG9uIGJsdXIgdW5sZXNzIHRoZSB2YWx1ZSBvZiB0aGUgdGV4dGFyZWEvdGV4dCBpbnB1dCBoYXMgY2hhbmdlZFxyXG4gICAgICAgIGlmIChvbGRWYWx1ZSAhPT0gdGhpcy5pbnB1dC52YWx1ZSkge1xyXG4gICAgICAgICAgICBvbGRWYWx1ZSA9IHRoaXMuaW5wdXQudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTWVzc2FnZXMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLm1heGxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENoYXJhY3RlciBsaW1pdCBpcyBtaXNzaW5nIGF0dHJpYnV0ZSAke01BWF9MRU5HVEh9YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZUtleVVwKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBoYW5kbGVGb2N1cygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBoYW5kbGVCbHVyKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8qIElmIHRoZSBicm93c2VyIHN1cHBvcnRzIHRoZSBwYWdlc2hvdyBldmVudCwgdXNlIGl0IHRvIHVwZGF0ZSB0aGUgY2hhcmFjdGVyIGxpbWl0XHJcbiAgICAgICAgbWVzc2FnZSBhbmQgc3ItbWVzc2FnZSBvbmNlIGEgcGFnZSBoYXMgbG9hZGVkLiBTZWNvbmQgYmVzdCwgdXNlIHRoZSBET01Db250ZW50TG9hZGVkIGV2ZW50LiBcclxuICAgICAgICBUaGlzIGVuc3VyZXMgdGhhdCBpZiB0aGUgdXNlciBuYXZpZ2F0ZXMgdG8gYW5vdGhlciBwYWdlIGluIHRoZSBicm93c2VyIGFuZCBnb2VzIGJhY2ssIHRoZSBcclxuICAgICAgICBtZXNzYWdlIGFuZCBzci1tZXNzYWdlIHdpbGwgc2hvdy90ZWxsIHRoZSBjb3JyZWN0IGFtb3VudCBvZiBjaGFyYWN0ZXJzIGxlZnQuICovXHJcbiAgICAgICAgaWYgKCdvbnBhZ2VzaG93JyBpbiB3aW5kb3cpIHtcclxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BhZ2VzaG93JywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVNZXNzYWdlcygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IFxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlTWVzc2FnZXMoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuQ2hhcmFjdGVyTGltaXQucHJvdG90eXBlLmNoYXJhY3RlcnNMZWZ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGN1cnJlbnRfbGVuZ3RoID0gdGhpcy5pbnB1dC52YWx1ZS5sZW5ndGg7XHJcbiAgICByZXR1cm4gdGhpcy5tYXhsZW5ndGggLSBjdXJyZW50X2xlbmd0aDtcclxufVxyXG5cclxuZnVuY3Rpb24gY2hhcmFjdGVyTGltaXRNZXNzYWdlKGZvcm1MaW1pdCkge1xyXG4gICAgbGV0IGNvdW50X21lc3NhZ2UgPSBcIlwiO1xyXG4gICAgbGV0IGNoYXJhY3RlcnNfbGVmdCA9IGZvcm1MaW1pdC5jaGFyYWN0ZXJzTGVmdCgpO1xyXG5cclxuICAgIGlmIChjaGFyYWN0ZXJzX2xlZnQgPT09IC0xKSB7XHJcbiAgICAgICAgbGV0IGV4Y2VlZGVkID0gTWF0aC5hYnMoY2hhcmFjdGVyc19sZWZ0KTtcclxuICAgICAgICBjb3VudF9tZXNzYWdlID0gZm9ybUxpbWl0LnRleHQuY2hhcmFjdGVyX3Rvb19tYW55LnJlcGxhY2UoL3t2YWx1ZX0vLCBleGNlZWRlZCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChjaGFyYWN0ZXJzX2xlZnQgPT09IDEpIHtcclxuICAgICAgICBjb3VudF9tZXNzYWdlID0gZm9ybUxpbWl0LnRleHQuY2hhcmFjdGVyX3JlbWFpbmluZy5yZXBsYWNlKC97dmFsdWV9LywgY2hhcmFjdGVyc19sZWZ0KTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGNoYXJhY3RlcnNfbGVmdCA+PSAwKSB7XHJcbiAgICAgICAgY291bnRfbWVzc2FnZSA9IGZvcm1MaW1pdC50ZXh0LmNoYXJhY3RlcnNfcmVtYWluaW5nLnJlcGxhY2UoL3t2YWx1ZX0vLCBjaGFyYWN0ZXJzX2xlZnQpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgbGV0IGV4Y2VlZGVkID0gTWF0aC5hYnMoY2hhcmFjdGVyc19sZWZ0KTtcclxuICAgICAgICBjb3VudF9tZXNzYWdlID0gZm9ybUxpbWl0LnRleHQuY2hhcmFjdGVyc190b29fbWFueS5yZXBsYWNlKC97dmFsdWV9LywgZXhjZWVkZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjb3VudF9tZXNzYWdlO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVWaXNpYmxlTWVzc2FnZShmb3JtTGltaXQpIHtcclxuICAgIGxldCBjaGFyYWN0ZXJzX2xlZnQgPSBmb3JtTGltaXQuY2hhcmFjdGVyc0xlZnQoKTtcclxuICAgIGxldCBjb3VudF9tZXNzYWdlID0gY2hhcmFjdGVyTGltaXRNZXNzYWdlKGZvcm1MaW1pdCk7XHJcbiAgICBsZXQgY2hhcmFjdGVyX2xhYmVsID0gZm9ybUxpbWl0LmNvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjaGFyYWN0ZXItbGltaXQnKVswXTtcclxuXHJcbiAgICBpZiAoY2hhcmFjdGVyc19sZWZ0IDwgMCkge1xyXG4gICAgICAgIGlmICghY2hhcmFjdGVyX2xhYmVsLmNsYXNzTGlzdC5jb250YWlucygnbGltaXQtZXhjZWVkZWQnKSkge1xyXG4gICAgICAgICAgICBjaGFyYWN0ZXJfbGFiZWwuY2xhc3NMaXN0LmFkZCgnbGltaXQtZXhjZWVkZWQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFmb3JtTGltaXQuaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb3JtLWxpbWl0LWVycm9yJykpIHtcclxuICAgICAgICAgICAgZm9ybUxpbWl0LmlucHV0LmNsYXNzTGlzdC5hZGQoJ2Zvcm0tbGltaXQtZXJyb3InKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpZiAoY2hhcmFjdGVyX2xhYmVsLmNsYXNzTGlzdC5jb250YWlucygnbGltaXQtZXhjZWVkZWQnKSkge1xyXG4gICAgICAgICAgICBjaGFyYWN0ZXJfbGFiZWwuY2xhc3NMaXN0LnJlbW92ZSgnbGltaXQtZXhjZWVkZWQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGZvcm1MaW1pdC5pbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvcm0tbGltaXQtZXJyb3InKSkge1xyXG4gICAgICAgICAgICBmb3JtTGltaXQuaW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnZm9ybS1saW1pdC1lcnJvcicpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjaGFyYWN0ZXJfbGFiZWwuaW5uZXJIVE1MID0gY291bnRfbWVzc2FnZTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlU2NyZWVuUmVhZGVyTWVzc2FnZShmb3JtTGltaXQpIHtcclxuICAgIGxldCBjb3VudF9tZXNzYWdlID0gY2hhcmFjdGVyTGltaXRNZXNzYWdlKGZvcm1MaW1pdCk7XHJcbiAgICBsZXQgY2hhcmFjdGVyX2xhYmVsID0gZm9ybUxpbWl0LmNvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjaGFyYWN0ZXItbGltaXQtc3Itb25seScpWzBdO1xyXG4gICAgY2hhcmFjdGVyX2xhYmVsLmlubmVySFRNTCA9IGNvdW50X21lc3NhZ2U7XHJcbn1cclxuXHJcbkNoYXJhY3RlckxpbWl0LnByb3RvdHlwZS51cGRhdGVNZXNzYWdlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHVwZGF0ZVZpc2libGVNZXNzYWdlKHRoaXMpO1xyXG4gICAgdXBkYXRlU2NyZWVuUmVhZGVyTWVzc2FnZSh0aGlzKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ2hhcmFjdGVyTGltaXQ7IiwiJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQgJy4uL3BvbHlmaWxscy9GdW5jdGlvbi9wcm90b3R5cGUvYmluZCc7XHJcblxyXG5jb25zdCBUT0dHTEVfVEFSR0VUX0FUVFJJQlVURSA9ICdkYXRhLWFyaWEtY29udHJvbHMnO1xyXG5cclxuLyoqXHJcbiAqIEFkZHMgY2xpY2sgZnVuY3Rpb25hbGl0eSB0byBjaGVja2JveCBjb2xsYXBzZSBjb21wb25lbnRcclxuICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSBjaGVja2JveEVsZW1lbnQgXHJcbiAqL1xyXG5mdW5jdGlvbiBDaGVja2JveFRvZ2dsZUNvbnRlbnQoY2hlY2tib3hFbGVtZW50KXtcclxuICAgIHRoaXMuY2hlY2tib3hFbGVtZW50ID0gY2hlY2tib3hFbGVtZW50O1xyXG4gICAgdGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCBldmVudHMgb24gY2hlY2tib3ggc3RhdGUgY2hhbmdlXHJcbiAqL1xyXG5DaGVja2JveFRvZ2dsZUNvbnRlbnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5jaGVja2JveEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy50b2dnbGUuYmluZCh0aGlzKSk7XHJcbiAgICB0aGlzLnRvZ2dsZSgpO1xyXG59XHJcblxyXG4vKipcclxuICogVG9nZ2xlIGNoZWNrYm94IGNvbnRlbnRcclxuICovXHJcbkNoZWNrYm94VG9nZ2xlQ29udGVudC5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciAkbW9kdWxlID0gdGhpcztcclxuICAgIHZhciB0YXJnZXRBdHRyID0gdGhpcy5jaGVja2JveEVsZW1lbnQuZ2V0QXR0cmlidXRlKFRPR0dMRV9UQVJHRVRfQVRUUklCVVRFKVxyXG4gICAgdmFyIHRhcmdldEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0QXR0cik7XHJcbiAgICBpZih0YXJnZXRFbCA9PT0gbnVsbCB8fCB0YXJnZXRFbCA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIHBhbmVsIGVsZW1lbnQuIFZlcmlmeSB2YWx1ZSBvZiBhdHRyaWJ1dGUgYCsgVE9HR0xFX1RBUkdFVF9BVFRSSUJVVEUpO1xyXG4gICAgfVxyXG4gICAgaWYodGhpcy5jaGVja2JveEVsZW1lbnQuY2hlY2tlZCl7XHJcbiAgICAgICAgJG1vZHVsZS5leHBhbmQodGhpcy5jaGVja2JveEVsZW1lbnQsIHRhcmdldEVsKTtcclxuICAgIH1lbHNle1xyXG4gICAgICAgICRtb2R1bGUuY29sbGFwc2UodGhpcy5jaGVja2JveEVsZW1lbnQsIHRhcmdldEVsKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEV4cGFuZCBjb250ZW50XHJcbiAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gY2hlY2tib3hFbGVtZW50IENoZWNrYm94IGlucHV0IGVsZW1lbnQgXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRlbnRFbGVtZW50IENvbnRlbnQgY29udGFpbmVyIGVsZW1lbnQgXHJcbiAqL1xyXG5DaGVja2JveFRvZ2dsZUNvbnRlbnQucHJvdG90eXBlLmV4cGFuZCA9IGZ1bmN0aW9uKGNoZWNrYm94RWxlbWVudCwgY29udGVudEVsZW1lbnQpe1xyXG4gICAgaWYoY2hlY2tib3hFbGVtZW50ICE9PSBudWxsICYmIGNoZWNrYm94RWxlbWVudCAhPT0gdW5kZWZpbmVkICYmIGNvbnRlbnRFbGVtZW50ICE9PSBudWxsICYmIGNvbnRlbnRFbGVtZW50ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIGNoZWNrYm94RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XHJcbiAgICAgICAgY29udGVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY29sbGFwc2VkJyk7XHJcbiAgICAgICAgY29udGVudEVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgIGxldCBldmVudE9wZW4gPSBuZXcgRXZlbnQoJ2Zkcy5jb2xsYXBzZS5leHBhbmRlZCcpO1xyXG4gICAgICAgIGNoZWNrYm94RWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50T3Blbik7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb2xsYXBzZSBjb250ZW50XHJcbiAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gY2hlY2tib3hFbGVtZW50IENoZWNrYm94IGlucHV0IGVsZW1lbnQgXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRlbnRFbGVtZW50IENvbnRlbnQgY29udGFpbmVyIGVsZW1lbnQgXHJcbiAqL1xyXG5DaGVja2JveFRvZ2dsZUNvbnRlbnQucHJvdG90eXBlLmNvbGxhcHNlID0gZnVuY3Rpb24odHJpZ2dlckVsLCB0YXJnZXRFbCl7XHJcbiAgICBpZih0cmlnZ2VyRWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSB1bmRlZmluZWQgJiYgdGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnZGF0YS1hcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XHJcbiAgICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5jb2xsYXBzZS5jb2xsYXBzZWQnKTtcclxuICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ2hlY2tib3hUb2dnbGVDb250ZW50O1xyXG4iLCJpbXBvcnQge2tleW1hcH0gZnJvbSAncmVjZXB0b3InO1xyXG5jb25zdCBiZWhhdmlvciA9IHJlcXVpcmUoXCIuLi91dGlscy9iZWhhdmlvclwiKTtcclxuY29uc3Qgc2VsZWN0ID0gcmVxdWlyZShcIi4uL3V0aWxzL3NlbGVjdFwiKTtcclxuY29uc3QgeyBwcmVmaXg6IFBSRUZJWCB9ID0gcmVxdWlyZShcIi4uL2NvbmZpZ1wiKTtcclxuY29uc3QgeyBDTElDSyB9ID0gcmVxdWlyZShcIi4uL2V2ZW50c1wiKTtcclxuY29uc3QgYWN0aXZlRWxlbWVudCA9IHJlcXVpcmUoXCIuLi91dGlscy9hY3RpdmUtZWxlbWVudFwiKTtcclxuY29uc3QgaXNJb3NEZXZpY2UgPSByZXF1aXJlKFwiLi4vdXRpbHMvaXMtaW9zLWRldmljZVwiKTtcclxuXHJcbmNvbnN0IERBVEVfUElDS0VSX0NMQVNTID0gYGRhdGUtcGlja2VyYDtcclxuY29uc3QgREFURV9QSUNLRVJfV1JBUFBFUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9fd3JhcHBlcmA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0lOSVRJQUxJWkVEX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9LS1pbml0aWFsaXplZGA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0FDVElWRV9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfS0tYWN0aXZlYDtcclxuY29uc3QgREFURV9QSUNLRVJfSU5URVJOQUxfSU5QVVRfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU31fX2ludGVybmFsLWlucHV0YDtcclxuY29uc3QgREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU31fX2V4dGVybmFsLWlucHV0YDtcclxuY29uc3QgREFURV9QSUNLRVJfQlVUVE9OX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X19idXR0b25gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9fY2FsZW5kYXJgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9TVEFUVVNfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU31fX3N0YXR1c2A7XHJcbmNvbnN0IERBVEVfUElDS0VSX0dVSURFX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X19ndWlkZWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX2RhdGVgO1xyXG5cclxuY29uc3QgRElBTE9HX1dSQVBQRVJfQ0xBU1MgPSBgZGlhbG9nLXdyYXBwZXJgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9ESUFMT0dfV1JBUFBFUiA9IGAuJHtESUFMT0dfV1JBUFBFUl9DTEFTU31gO1xyXG5cclxuY29uc3QgQ0FMRU5EQVJfREFURV9GT0NVU0VEX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLWZvY3VzZWRgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1NFTEVDVEVEX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXNlbGVjdGVkYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9QUkVWSU9VU19NT05USF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1wcmV2aW91cy1tb250aGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfQ1VSUkVOVF9NT05USF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1jdXJyZW50LW1vbnRoYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9ORVhUX01PTlRIX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLW5leHQtbW9udGhgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1JBTkdFX0RBVEVfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tcmFuZ2UtZGF0ZWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfVE9EQVlfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tdG9kYXlgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1JBTkdFX0RBVEVfU1RBUlRfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tcmFuZ2UtZGF0ZS1zdGFydGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9FTkRfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tcmFuZ2UtZGF0ZS1lbmRgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1dJVEhJTl9SQU5HRV9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS13aXRoaW4tcmFuZ2VgO1xyXG5jb25zdCBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19wcmV2aW91cy15ZWFyYDtcclxuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfTU9OVEhfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3ByZXZpb3VzLW1vbnRoYDtcclxuY29uc3QgQ0FMRU5EQVJfTkVYVF9ZRUFSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19uZXh0LXllYXJgO1xyXG5jb25zdCBDQUxFTkRBUl9ORVhUX01PTlRIX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19uZXh0LW1vbnRoYDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfU0VMRUNUSU9OX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19tb250aC1zZWxlY3Rpb25gO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX1NFTEVDVElPTl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9feWVhci1zZWxlY3Rpb25gO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbW9udGhgO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9GT0NVU0VEX0NMQVNTID0gYCR7Q0FMRU5EQVJfTU9OVEhfQ0xBU1N9LS1mb2N1c2VkYDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfU0VMRUNURURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9NT05USF9DTEFTU30tLXNlbGVjdGVkYDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9feWVhcmA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfRk9DVVNFRF9DTEFTUyA9IGAke0NBTEVOREFSX1lFQVJfQ0xBU1N9LS1mb2N1c2VkYDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9TRUxFQ1RFRF9DTEFTUyA9IGAke0NBTEVOREFSX1lFQVJfQ0xBU1N9LS1zZWxlY3RlZGA7XHJcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0hVTktfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3ByZXZpb3VzLXllYXItY2h1bmtgO1xyXG5jb25zdCBDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTktfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX25leHQteWVhci1jaHVua2A7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfUElDS0VSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19kYXRlLXBpY2tlcmA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX1BJQ0tFUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbW9udGgtcGlja2VyYDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9QSUNLRVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3llYXItcGlja2VyYDtcclxuY29uc3QgQ0FMRU5EQVJfVEFCTEVfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3RhYmxlYDtcclxuY29uc3QgQ0FMRU5EQVJfUk9XX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19yb3dgO1xyXG5jb25zdCBDQUxFTkRBUl9DRUxMX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19jZWxsYDtcclxuY29uc3QgQ0FMRU5EQVJfQ0VMTF9DRU5URVJfSVRFTVNfQ0xBU1MgPSBgJHtDQUxFTkRBUl9DRUxMX0NMQVNTfS0tY2VudGVyLWl0ZW1zYDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfTEFCRUxfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX21vbnRoLWxhYmVsYDtcclxuY29uc3QgQ0FMRU5EQVJfREFZX09GX1dFRUtfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX2RheS1vZi13ZWVrYDtcclxuXHJcbmNvbnN0IERBVEVfUElDS0VSID0gYC4ke0RBVEVfUElDS0VSX0NMQVNTfWA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0JVVFRPTiA9IGAuJHtEQVRFX1BJQ0tFUl9CVVRUT05fQ0xBU1N9YDtcclxuY29uc3QgREFURV9QSUNLRVJfSU5URVJOQUxfSU5QVVQgPSBgLiR7REFURV9QSUNLRVJfSU5URVJOQUxfSU5QVVRfQ0xBU1N9YDtcclxuY29uc3QgREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVQgPSBgLiR7REFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRfQ0xBU1N9YDtcclxuY29uc3QgREFURV9QSUNLRVJfQ0FMRU5EQVIgPSBgLiR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9YDtcclxuY29uc3QgREFURV9QSUNLRVJfU1RBVFVTID0gYC4ke0RBVEVfUElDS0VSX1NUQVRVU19DTEFTU31gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9HVUlERSA9IGAuJHtEQVRFX1BJQ0tFUl9HVUlERV9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFID0gYC4ke0NBTEVOREFSX0RBVEVfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9GT0NVU0VEID0gYC4ke0NBTEVOREFSX0RBVEVfRk9DVVNFRF9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX0NVUlJFTlRfTU9OVEggPSBgLiR7Q0FMRU5EQVJfREFURV9DVVJSRU5UX01PTlRIX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX1lFQVIgPSBgLiR7Q0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9QUkVWSU9VU19NT05USCA9IGAuJHtDQUxFTkRBUl9QUkVWSU9VU19NT05USF9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9ORVhUX1lFQVIgPSBgLiR7Q0FMRU5EQVJfTkVYVF9ZRUFSX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX05FWFRfTU9OVEggPSBgLiR7Q0FMRU5EQVJfTkVYVF9NT05USF9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX1NFTEVDVElPTiA9IGAuJHtDQUxFTkRBUl9ZRUFSX1NFTEVDVElPTl9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9TRUxFQ1RJT04gPSBgLiR7Q0FMRU5EQVJfTU9OVEhfU0VMRUNUSU9OX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIID0gYC4ke0NBTEVOREFSX01PTlRIX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVIgPSBgLiR7Q0FMRU5EQVJfWUVBUl9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LID0gYC4ke0NBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0hVTktfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LID0gYC4ke0NBTEVOREFSX05FWFRfWUVBUl9DSFVOS19DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1BJQ0tFUiA9IGAuJHtDQUxFTkRBUl9EQVRFX1BJQ0tFUl9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9QSUNLRVIgPSBgLiR7Q0FMRU5EQVJfTU9OVEhfUElDS0VSX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfUElDS0VSID0gYC4ke0NBTEVOREFSX1lFQVJfUElDS0VSX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX0ZPQ1VTRUQgPSBgLiR7Q0FMRU5EQVJfTU9OVEhfRk9DVVNFRF9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX0ZPQ1VTRUQgPSBgLiR7Q0FMRU5EQVJfWUVBUl9GT0NVU0VEX0NMQVNTfWA7XHJcblxyXG5sZXQgdGV4dCA9IHtcclxuICBcIm9wZW5fY2FsZW5kYXJcIjogXCLDhWJuIGthbGVuZGVyXCIsXHJcbiAgXCJjaG9vc2VfYV9kYXRlXCI6IFwiVsOmbGcgZW4gZGF0b1wiLFxyXG4gIFwiY2hvb3NlX2FfZGF0ZV9iZXR3ZWVuXCI6IFwiVsOmbGcgZW4gZGF0byBtZWxsZW0ge21pbkRheX0uIHttaW5Nb250aFN0cn0ge21pblllYXJ9IG9nIHttYXhEYXl9LiB7bWF4TW9udGhTdHJ9IHttYXhZZWFyfVwiLFxyXG4gIFwiY2hvb3NlX2FfZGF0ZV9iZWZvcmVcIjogXCJWw6ZsZyBlbiBkYXRvLiBEZXIga2FuIHbDpmxnZXMgaW5kdGlsIHttYXhEYXl9LiB7bWF4TW9udGhTdHJ9IHttYXhZZWFyfS5cIixcclxuICBcImNob29zZV9hX2RhdGVfYWZ0ZXJcIjogXCJWw6ZsZyBlbiBkYXRvLiBEZXIga2FuIHbDpmxnZXMgZnJhIHttaW5EYXl9LiB7bWluTW9udGhTdHJ9IHttaW5ZZWFyfSBvZyBmcmVtYWQuXCIsXHJcbiAgXCJhcmlhX2xhYmVsX2RhdGVcIjogXCJ7ZGF5U3RyfSBkZW4ge2RheX0uIHttb250aFN0cn0ge3llYXJ9XCIsXHJcbiAgXCJjdXJyZW50X21vbnRoX2Rpc3BsYXllZFwiOiBcIlZpc2VyIHttb250aExhYmVsfSB7Zm9jdXNlZFllYXJ9XCIsXHJcbiAgXCJmaXJzdF9wb3NzaWJsZV9kYXRlXCI6IFwiRsO4cnN0ZSB2YWxnYmFyZSBkYXRvXCIsXHJcbiAgXCJsYXN0X3Bvc3NpYmxlX2RhdGVcIjogXCJTaWRzdGUgdmFsZ2JhcmUgZGF0b1wiLFxyXG4gIFwicHJldmlvdXNfeWVhclwiOiBcIk5hdmlnw6lyIMOpdCDDpXIgdGlsYmFnZVwiLFxyXG4gIFwicHJldmlvdXNfbW9udGhcIjogXCJOYXZpZ8OpciDDqW4gbcOlbmVkIHRpbGJhZ2VcIixcclxuICBcIm5leHRfbW9udGhcIjogXCJOYXZpZ8OpciDDqW4gbcOlbmVkIGZyZW1cIixcclxuICBcIm5leHRfeWVhclwiOiBcIk5hdmlnw6lyIMOpdCDDpXIgZnJlbVwiLFxyXG4gIFwic2VsZWN0X21vbnRoXCI6IFwiVsOmbGcgbcOlbmVkXCIsXHJcbiAgXCJzZWxlY3RfeWVhclwiOiBcIlbDpmxnIMOlclwiLFxyXG4gIFwicHJldmlvdXNfeWVhcnNcIjogXCJOYXZpZ8OpciB7eWVhcnN9IMOlciB0aWxiYWdlXCIsXHJcbiAgXCJuZXh0X3llYXJzXCI6IFwiTmF2aWfDqXIge3llYXJzfSDDpXIgZnJlbVwiLFxyXG4gIFwiZ3VpZGVcIjogXCJOYXZpZ2VyZXIgZHUgbWVkIHRhc3RhdHVyLCBrYW4gZHUgc2tpZnRlIGRhZyBtZWQgaMO4anJlIG9nIHZlbnN0cmUgcGlsZXRhc3RlciwgdWdlciBtZWQgb3Agb2cgbmVkIHBpbGV0YXN0ZXIsIG3DpW5lZGVyIG1lZCBwYWdlIHVwIG9nIHBhZ2UgZG93bi10YXN0ZXJuZSBvZyDDpXIgbWVkIHNoaWZ0LXRhc3RlbiBwbHVzIHBhZ2UgdXAgZWxsZXIgcGFnZSBkb3duLiBIb21lIG9nIGVuZC10YXN0ZW4gbmF2aWdlcmVyIHRpbCBzdGFydCBlbGxlciBzbHV0bmluZyBhZiBlbiB1Z2UuXCIsXHJcbiAgXCJtb250aHNfZGlzcGxheWVkXCI6IFwiVsOmbGcgZW4gbcOlbmVkXCIsXHJcbiAgXCJ5ZWFyc19kaXNwbGF5ZWRcIjogXCJWaXNlciDDpXIge3N0YXJ0fSB0aWwge2VuZH0uIFbDpmxnIGV0IMOlci5cIixcclxuICBcImphbnVhcnlcIjogXCJqYW51YXJcIixcclxuICBcImZlYnJ1YXJ5XCI6IFwiZmVicnVhclwiLFxyXG4gIFwibWFyY2hcIjogXCJtYXJ0c1wiLFxyXG4gIFwiYXByaWxcIjogXCJhcHJpbFwiLFxyXG4gIFwibWF5XCI6IFwibWFqXCIsXHJcbiAgXCJqdW5lXCI6IFwianVuaVwiLFxyXG4gIFwianVseVwiOiBcImp1bGlcIixcclxuICBcImF1Z3VzdFwiOiBcImF1Z3VzdFwiLFxyXG4gIFwic2VwdGVtYmVyXCI6IFwic2VwdGVtYmVyXCIsXHJcbiAgXCJvY3RvYmVyXCI6IFwib2t0b2JlclwiLFxyXG4gIFwibm92ZW1iZXJcIjogXCJub3ZlbWJlclwiLFxyXG4gIFwiZGVjZW1iZXJcIjogXCJkZWNlbWJlclwiLFxyXG4gIFwibW9uZGF5XCI6IFwibWFuZGFnXCIsXHJcbiAgXCJ0dWVzZGF5XCI6IFwidGlyc2RhZ1wiLFxyXG4gIFwid2VkbmVzZGF5XCI6IFwib25zZGFnXCIsXHJcbiAgXCJ0aHVyc2RheVwiOiBcInRvcnNkYWdcIixcclxuICBcImZyaWRheVwiOiBcImZyZWRhZ1wiLFxyXG4gIFwic2F0dXJkYXlcIjogXCJsw7hyZGFnXCIsXHJcbiAgXCJzdW5kYXlcIjogXCJzw7huZGFnXCJcclxufVxyXG5cclxuY29uc3QgVkFMSURBVElPTl9NRVNTQUdFID0gXCJJbmR0YXN0IHZlbmxpZ3N0IGVuIGd5bGRpZyBkYXRvXCI7XHJcblxyXG5sZXQgTU9OVEhfTEFCRUxTID0gW1xyXG4gIHRleHQuamFudWFyeSxcclxuICB0ZXh0LmZlYnJ1YXJ5LFxyXG4gIHRleHQubWFyY2gsXHJcbiAgdGV4dC5hcHJpbCxcclxuICB0ZXh0Lm1heSxcclxuICB0ZXh0Lmp1bmUsXHJcbiAgdGV4dC5qdWx5LFxyXG4gIHRleHQuYXVndXN0LFxyXG4gIHRleHQuc2VwdGVtYmVyLFxyXG4gIHRleHQub2N0b2JlcixcclxuICB0ZXh0Lm5vdmVtYmVyLFxyXG4gIHRleHQuZGVjZW1iZXJcclxuXTtcclxuXHJcbmxldCBEQVlfT0ZfV0VFS19MQUJFTFMgPSBbXHJcbiAgdGV4dC5tb25kYXksXHJcbiAgdGV4dC50dWVzZGF5LFxyXG4gIHRleHQud2VkbmVzZGF5LFxyXG4gIHRleHQudGh1cnNkYXksXHJcbiAgdGV4dC5mcmlkYXksXHJcbiAgdGV4dC5zYXR1cmRheSxcclxuICB0ZXh0LnN1bmRheVxyXG5dO1xyXG5cclxuY29uc3QgRU5URVJfS0VZQ09ERSA9IDEzO1xyXG5cclxuY29uc3QgWUVBUl9DSFVOSyA9IDEyO1xyXG5cclxuY29uc3QgREVGQVVMVF9NSU5fREFURSA9IFwiMDAwMC0wMS0wMVwiO1xyXG5jb25zdCBEQVRFX0ZPUk1BVF9PUFRJT05fMSA9IFwiREQvTU0vWVlZWVwiO1xyXG5jb25zdCBEQVRFX0ZPUk1BVF9PUFRJT05fMiA9IFwiREQtTU0tWVlZWVwiO1xyXG5jb25zdCBEQVRFX0ZPUk1BVF9PUFRJT05fMyA9IFwiREQuTU0uWVlZWVwiO1xyXG5jb25zdCBEQVRFX0ZPUk1BVF9PUFRJT05fNCA9IFwiREQgTU0gWVlZWVwiO1xyXG5jb25zdCBEQVRFX0ZPUk1BVF9PUFRJT05fNSA9IFwiREQvTU0tWVlZWVwiO1xyXG5jb25zdCBJTlRFUk5BTF9EQVRFX0ZPUk1BVCA9IFwiWVlZWS1NTS1ERFwiO1xyXG5cclxuY29uc3QgTk9UX0RJU0FCTEVEX1NFTEVDVE9SID0gXCI6bm90KFtkaXNhYmxlZF0pXCI7XHJcblxyXG5jb25zdCBwcm9jZXNzRm9jdXNhYmxlU2VsZWN0b3JzID0gKC4uLnNlbGVjdG9ycykgPT5cclxuICBzZWxlY3RvcnMubWFwKChxdWVyeSkgPT4gcXVlcnkgKyBOT1RfRElTQUJMRURfU0VMRUNUT1IpLmpvaW4oXCIsIFwiKTtcclxuXHJcbmNvbnN0IERBVEVfUElDS0VSX0ZPQ1VTQUJMRSA9IHByb2Nlc3NGb2N1c2FibGVTZWxlY3RvcnMoXHJcbiAgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUixcclxuICBDQUxFTkRBUl9QUkVWSU9VU19NT05USCxcclxuICBDQUxFTkRBUl9ZRUFSX1NFTEVDVElPTixcclxuICBDQUxFTkRBUl9NT05USF9TRUxFQ1RJT04sXHJcbiAgQ0FMRU5EQVJfTkVYVF9ZRUFSLFxyXG4gIENBTEVOREFSX05FWFRfTU9OVEgsXHJcbiAgQ0FMRU5EQVJfREFURV9GT0NVU0VEXHJcbik7XHJcblxyXG5jb25zdCBNT05USF9QSUNLRVJfRk9DVVNBQkxFID0gcHJvY2Vzc0ZvY3VzYWJsZVNlbGVjdG9ycyhcclxuICBDQUxFTkRBUl9NT05USF9GT0NVU0VEXHJcbik7XHJcblxyXG5jb25zdCBZRUFSX1BJQ0tFUl9GT0NVU0FCTEUgPSBwcm9jZXNzRm9jdXNhYmxlU2VsZWN0b3JzKFxyXG4gIENBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0hVTkssXHJcbiAgQ0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LLFxyXG4gIENBTEVOREFSX1lFQVJfRk9DVVNFRFxyXG4pO1xyXG5cclxuLy8gI3JlZ2lvbiBEYXRlIE1hbmlwdWxhdGlvbiBGdW5jdGlvbnNcclxuXHJcbi8qKlxyXG4gKiBLZWVwIGRhdGUgd2l0aGluIG1vbnRoLiBNb250aCB3b3VsZCBvbmx5IGJlIG92ZXIgYnkgMSB0byAzIGRheXNcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlVG9DaGVjayB0aGUgZGF0ZSBvYmplY3QgdG8gY2hlY2tcclxuICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIHRoZSBjb3JyZWN0IG1vbnRoXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgZGF0ZSwgY29ycmVjdGVkIGlmIG5lZWRlZFxyXG4gKi9cclxuY29uc3Qga2VlcERhdGVXaXRoaW5Nb250aCA9IChkYXRlVG9DaGVjaywgbW9udGgpID0+IHtcclxuICBpZiAobW9udGggIT09IGRhdGVUb0NoZWNrLmdldE1vbnRoKCkpIHtcclxuICAgIGRhdGVUb0NoZWNrLnNldERhdGUoMCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZGF0ZVRvQ2hlY2s7XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IGRhdGUgZnJvbSBtb250aCBkYXkgeWVhclxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0geWVhciB0aGUgeWVhciB0byBzZXRcclxuICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIHRoZSBtb250aCB0byBzZXQgKHplcm8taW5kZXhlZClcclxuICogQHBhcmFtIHtudW1iZXJ9IGRhdGUgdGhlIGRhdGUgdG8gc2V0XHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgc2V0IGRhdGVcclxuICovXHJcbmNvbnN0IHNldERhdGUgPSAoeWVhciwgbW9udGgsIGRhdGUpID0+IHtcclxuICBjb25zdCBuZXdEYXRlID0gbmV3IERhdGUoMCk7XHJcbiAgbmV3RGF0ZS5zZXRGdWxsWWVhcih5ZWFyLCBtb250aCwgZGF0ZSk7XHJcbiAgcmV0dXJuIG5ld0RhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogdG9kYXlzIGRhdGVcclxuICpcclxuICogQHJldHVybnMge0RhdGV9IHRvZGF5cyBkYXRlXHJcbiAqL1xyXG5jb25zdCB0b2RheSA9ICgpID0+IHtcclxuICBjb25zdCBuZXdEYXRlID0gbmV3IERhdGUoKTtcclxuICBjb25zdCBkYXkgPSBuZXdEYXRlLmdldERhdGUoKTtcclxuICBjb25zdCBtb250aCA9IG5ld0RhdGUuZ2V0TW9udGgoKTtcclxuICBjb25zdCB5ZWFyID0gbmV3RGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gIHJldHVybiBzZXREYXRlKHllYXIsIG1vbnRoLCBkYXkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCBkYXRlIHRvIGZpcnN0IGRheSBvZiB0aGUgbW9udGhcclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IGRhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc3RhcnRPZk1vbnRoID0gKGRhdGUpID0+IHtcclxuICBjb25zdCBuZXdEYXRlID0gbmV3IERhdGUoMCk7XHJcbiAgbmV3RGF0ZS5zZXRGdWxsWWVhcihkYXRlLmdldEZ1bGxZZWFyKCksIGRhdGUuZ2V0TW9udGgoKSwgMSk7XHJcbiAgcmV0dXJuIG5ld0RhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IGRhdGUgdG8gbGFzdCBkYXkgb2YgdGhlIG1vbnRoXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IGxhc3REYXlPZk1vbnRoID0gKGRhdGUpID0+IHtcclxuICBjb25zdCBuZXdEYXRlID0gbmV3IERhdGUoMCk7XHJcbiAgbmV3RGF0ZS5zZXRGdWxsWWVhcihkYXRlLmdldEZ1bGxZZWFyKCksIGRhdGUuZ2V0TW9udGgoKSArIDEsIDApO1xyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZCBkYXlzIHRvIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bURheXMgdGhlIGRpZmZlcmVuY2UgaW4gZGF5c1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IGFkZERheXMgPSAoX2RhdGUsIG51bURheXMpID0+IHtcclxuICBjb25zdCBuZXdEYXRlID0gbmV3IERhdGUoX2RhdGUuZ2V0VGltZSgpKTtcclxuICBuZXdEYXRlLnNldERhdGUobmV3RGF0ZS5nZXREYXRlKCkgKyBudW1EYXlzKTtcclxuICByZXR1cm4gbmV3RGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTdWJ0cmFjdCBkYXlzIGZyb20gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtRGF5cyB0aGUgZGlmZmVyZW5jZSBpbiBkYXlzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc3ViRGF5cyA9IChfZGF0ZSwgbnVtRGF5cykgPT4gYWRkRGF5cyhfZGF0ZSwgLW51bURheXMpO1xyXG5cclxuLyoqXHJcbiAqIEFkZCB3ZWVrcyB0byBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1XZWVrcyB0aGUgZGlmZmVyZW5jZSBpbiB3ZWVrc1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IGFkZFdlZWtzID0gKF9kYXRlLCBudW1XZWVrcykgPT4gYWRkRGF5cyhfZGF0ZSwgbnVtV2Vla3MgKiA3KTtcclxuXHJcbi8qKlxyXG4gKiBTdWJ0cmFjdCB3ZWVrcyBmcm9tIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bVdlZWtzIHRoZSBkaWZmZXJlbmNlIGluIHdlZWtzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc3ViV2Vla3MgPSAoX2RhdGUsIG51bVdlZWtzKSA9PiBhZGRXZWVrcyhfZGF0ZSwgLW51bVdlZWtzKTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZGF0ZSB0byB0aGUgc3RhcnQgb2YgdGhlIHdlZWsgKE1vbmRheSlcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzdGFydE9mV2VlayA9IChfZGF0ZSkgPT4ge1xyXG4gIGxldCBkYXlPZldlZWsgPSBfZGF0ZS5nZXREYXkoKS0xO1xyXG4gIGlmKGRheU9mV2VlayA9PT0gLTEpe1xyXG4gICAgZGF5T2ZXZWVrID0gNjtcclxuICB9XHJcbiAgcmV0dXJuIHN1YkRheXMoX2RhdGUsIGRheU9mV2Vlayk7XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IGRhdGUgdG8gdGhlIGVuZCBvZiB0aGUgd2VlayAoU3VuZGF5KVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtV2Vla3MgdGhlIGRpZmZlcmVuY2UgaW4gd2Vla3NcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBlbmRPZldlZWsgPSAoX2RhdGUpID0+IHtcclxuICBjb25zdCBkYXlPZldlZWsgPSBfZGF0ZS5nZXREYXkoKTtcclxuICByZXR1cm4gYWRkRGF5cyhfZGF0ZSwgNyAtIGRheU9mV2Vlayk7XHJcbn07XHJcblxyXG4vKipcclxuICogQWRkIG1vbnRocyB0byBkYXRlIGFuZCBrZWVwIGRhdGUgd2l0aGluIG1vbnRoXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1Nb250aHMgdGhlIGRpZmZlcmVuY2UgaW4gbW9udGhzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgYWRkTW9udGhzID0gKF9kYXRlLCBudW1Nb250aHMpID0+IHtcclxuICBjb25zdCBuZXdEYXRlID0gbmV3IERhdGUoX2RhdGUuZ2V0VGltZSgpKTtcclxuXHJcbiAgY29uc3QgZGF0ZU1vbnRoID0gKG5ld0RhdGUuZ2V0TW9udGgoKSArIDEyICsgbnVtTW9udGhzKSAlIDEyO1xyXG4gIG5ld0RhdGUuc2V0TW9udGgobmV3RGF0ZS5nZXRNb250aCgpICsgbnVtTW9udGhzKTtcclxuICBrZWVwRGF0ZVdpdGhpbk1vbnRoKG5ld0RhdGUsIGRhdGVNb250aCk7XHJcblxyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFN1YnRyYWN0IG1vbnRocyBmcm9tIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bU1vbnRocyB0aGUgZGlmZmVyZW5jZSBpbiBtb250aHNcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzdWJNb250aHMgPSAoX2RhdGUsIG51bU1vbnRocykgPT4gYWRkTW9udGhzKF9kYXRlLCAtbnVtTW9udGhzKTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgeWVhcnMgdG8gZGF0ZSBhbmQga2VlcCBkYXRlIHdpdGhpbiBtb250aFxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtWWVhcnMgdGhlIGRpZmZlcmVuY2UgaW4geWVhcnNcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBhZGRZZWFycyA9IChfZGF0ZSwgbnVtWWVhcnMpID0+IGFkZE1vbnRocyhfZGF0ZSwgbnVtWWVhcnMgKiAxMik7XHJcblxyXG4vKipcclxuICogU3VidHJhY3QgeWVhcnMgZnJvbSBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1ZZWFycyB0aGUgZGlmZmVyZW5jZSBpbiB5ZWFyc1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHN1YlllYXJzID0gKF9kYXRlLCBudW1ZZWFycykgPT4gYWRkWWVhcnMoX2RhdGUsIC1udW1ZZWFycyk7XHJcblxyXG4vKipcclxuICogU2V0IG1vbnRocyBvZiBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCB6ZXJvLWluZGV4ZWQgbW9udGggdG8gc2V0XHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc2V0TW9udGggPSAoX2RhdGUsIG1vbnRoKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKF9kYXRlLmdldFRpbWUoKSk7XHJcblxyXG4gIG5ld0RhdGUuc2V0TW9udGgobW9udGgpO1xyXG4gIGtlZXBEYXRlV2l0aGluTW9udGgobmV3RGF0ZSwgbW9udGgpO1xyXG5cclxuICByZXR1cm4gbmV3RGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgeWVhciBvZiBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIHRoZSB5ZWFyIHRvIHNldFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHNldFllYXIgPSAoX2RhdGUsIHllYXIpID0+IHtcclxuICBjb25zdCBuZXdEYXRlID0gbmV3IERhdGUoX2RhdGUuZ2V0VGltZSgpKTtcclxuXHJcbiAgY29uc3QgbW9udGggPSBuZXdEYXRlLmdldE1vbnRoKCk7XHJcbiAgbmV3RGF0ZS5zZXRGdWxsWWVhcih5ZWFyKTtcclxuICBrZWVwRGF0ZVdpdGhpbk1vbnRoKG5ld0RhdGUsIG1vbnRoKTtcclxuXHJcbiAgcmV0dXJuIG5ld0RhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJuIHRoZSBlYXJsaWVzdCBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUEgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUIgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgZWFybGllc3QgZGF0ZVxyXG4gKi9cclxuY29uc3QgbWluID0gKGRhdGVBLCBkYXRlQikgPT4ge1xyXG4gIGxldCBuZXdEYXRlID0gZGF0ZUE7XHJcblxyXG4gIGlmIChkYXRlQiA8IGRhdGVBKSB7XHJcbiAgICBuZXdEYXRlID0gZGF0ZUI7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbmV3IERhdGUobmV3RGF0ZS5nZXRUaW1lKCkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybiB0aGUgbGF0ZXN0IGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSBkYXRlIHRvIGNvbXBhcmVcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQiBkYXRlIHRvIGNvbXBhcmVcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBsYXRlc3QgZGF0ZVxyXG4gKi9cclxuY29uc3QgbWF4ID0gKGRhdGVBLCBkYXRlQikgPT4ge1xyXG4gIGxldCBuZXdEYXRlID0gZGF0ZUE7XHJcblxyXG4gIGlmIChkYXRlQiA+IGRhdGVBKSB7XHJcbiAgICBuZXdEYXRlID0gZGF0ZUI7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbmV3IERhdGUobmV3RGF0ZS5nZXRUaW1lKCkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGRhdGVzIGFyZSB0aGUgaW4gdGhlIHNhbWUgeWVhclxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVBIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVCIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gYXJlIGRhdGVzIGluIHRoZSBzYW1lIHllYXJcclxuICovXHJcbmNvbnN0IGlzU2FtZVllYXIgPSAoZGF0ZUEsIGRhdGVCKSA9PiB7XHJcbiAgcmV0dXJuIGRhdGVBICYmIGRhdGVCICYmIGRhdGVBLmdldEZ1bGxZZWFyKCkgPT09IGRhdGVCLmdldEZ1bGxZZWFyKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgZGF0ZXMgYXJlIHRoZSBpbiB0aGUgc2FtZSBtb250aFxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVBIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVCIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gYXJlIGRhdGVzIGluIHRoZSBzYW1lIG1vbnRoXHJcbiAqL1xyXG5jb25zdCBpc1NhbWVNb250aCA9IChkYXRlQSwgZGF0ZUIpID0+IHtcclxuICByZXR1cm4gaXNTYW1lWWVhcihkYXRlQSwgZGF0ZUIpICYmIGRhdGVBLmdldE1vbnRoKCkgPT09IGRhdGVCLmdldE1vbnRoKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgZGF0ZXMgYXJlIHRoZSBzYW1lIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSB0aGUgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUIgdGhlIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gYXJlIGRhdGVzIHRoZSBzYW1lIGRhdGVcclxuICovXHJcbmNvbnN0IGlzU2FtZURheSA9IChkYXRlQSwgZGF0ZUIpID0+IHtcclxuICByZXR1cm4gaXNTYW1lTW9udGgoZGF0ZUEsIGRhdGVCKSAmJiBkYXRlQS5nZXREYXRlKCkgPT09IGRhdGVCLmdldERhdGUoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiByZXR1cm4gYSBuZXcgZGF0ZSB3aXRoaW4gbWluaW11bSBhbmQgbWF4aW11bSBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSBkYXRlIHRvIGNoZWNrXHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWluRGF0ZSBtaW5pbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHBhcmFtIHtEYXRlfSBtYXhEYXRlIG1heGltdW0gZGF0ZSB0byBhbGxvd1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGRhdGUgYmV0d2VlbiBtaW4gYW5kIG1heFxyXG4gKi9cclxuY29uc3Qga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4ID0gKGRhdGUsIG1pbkRhdGUsIG1heERhdGUpID0+IHtcclxuICBsZXQgbmV3RGF0ZSA9IGRhdGU7XHJcblxyXG4gIGlmIChkYXRlIDwgbWluRGF0ZSkge1xyXG4gICAgbmV3RGF0ZSA9IG1pbkRhdGU7XHJcbiAgfSBlbHNlIGlmIChtYXhEYXRlICYmIGRhdGUgPiBtYXhEYXRlKSB7XHJcbiAgICBuZXdEYXRlID0gbWF4RGF0ZTtcclxuICB9XHJcblxyXG4gIHJldHVybiBuZXcgRGF0ZShuZXdEYXRlLmdldFRpbWUoKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgZGF0ZXMgaXMgdmFsaWQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSBkYXRlIHRvIGNoZWNrXHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWluRGF0ZSBtaW5pbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHBhcmFtIHtEYXRlfSBtYXhEYXRlIG1heGltdW0gZGF0ZSB0byBhbGxvd1xyXG4gKiBAcmV0dXJuIHtib29sZWFufSBpcyB0aGVyZSBhIGRheSB3aXRoaW4gdGhlIG1vbnRoIHdpdGhpbiBtaW4gYW5kIG1heCBkYXRlc1xyXG4gKi9cclxuY29uc3QgaXNEYXRlV2l0aGluTWluQW5kTWF4ID0gKGRhdGUsIG1pbkRhdGUsIG1heERhdGUpID0+XHJcbiAgZGF0ZSA+PSBtaW5EYXRlICYmICghbWF4RGF0ZSB8fCBkYXRlIDw9IG1heERhdGUpO1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGRhdGVzIG1vbnRoIGlzIGludmFsaWQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSBkYXRlIHRvIGNoZWNrXHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWluRGF0ZSBtaW5pbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHBhcmFtIHtEYXRlfSBtYXhEYXRlIG1heGltdW0gZGF0ZSB0byBhbGxvd1xyXG4gKiBAcmV0dXJuIHtib29sZWFufSBpcyB0aGUgbW9udGggb3V0c2lkZSBtaW4gb3IgbWF4IGRhdGVzXHJcbiAqL1xyXG5jb25zdCBpc0RhdGVzTW9udGhPdXRzaWRlTWluT3JNYXggPSAoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSkgPT4ge1xyXG4gIHJldHVybiAoXHJcbiAgICBsYXN0RGF5T2ZNb250aChkYXRlKSA8IG1pbkRhdGUgfHwgKG1heERhdGUgJiYgc3RhcnRPZk1vbnRoKGRhdGUpID4gbWF4RGF0ZSlcclxuICApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGRhdGVzIHllYXIgaXMgaW52YWxpZC5cclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlIGRhdGUgdG8gY2hlY2tcclxuICogQHBhcmFtIHtEYXRlfSBtaW5EYXRlIG1pbmltdW0gZGF0ZSB0byBhbGxvd1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1heERhdGUgbWF4aW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IGlzIHRoZSBtb250aCBvdXRzaWRlIG1pbiBvciBtYXggZGF0ZXNcclxuICovXHJcbmNvbnN0IGlzRGF0ZXNZZWFyT3V0c2lkZU1pbk9yTWF4ID0gKGRhdGUsIG1pbkRhdGUsIG1heERhdGUpID0+IHtcclxuICByZXR1cm4gKFxyXG4gICAgbGFzdERheU9mTW9udGgoc2V0TW9udGgoZGF0ZSwgMTEpKSA8IG1pbkRhdGUgfHxcclxuICAgIChtYXhEYXRlICYmIHN0YXJ0T2ZNb250aChzZXRNb250aChkYXRlLCAwKSkgPiBtYXhEYXRlKVxyXG4gICk7XHJcbn07XHJcblxyXG4vKipcclxuICogUGFyc2UgYSBkYXRlIHdpdGggZm9ybWF0IEQtTS1ZWVxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0ZVN0cmluZyB0aGUgZGF0ZSBzdHJpbmcgdG8gcGFyc2VcclxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGVGb3JtYXQgdGhlIGZvcm1hdCBvZiB0aGUgZGF0ZSBzdHJpbmdcclxuICogQHBhcmFtIHtib29sZWFufSBhZGp1c3REYXRlIHNob3VsZCB0aGUgZGF0ZSBiZSBhZGp1c3RlZFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIHBhcnNlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBwYXJzZURhdGVTdHJpbmcgPSAoXHJcbiAgZGF0ZVN0cmluZyxcclxuICBkYXRlRm9ybWF0ID0gSU5URVJOQUxfREFURV9GT1JNQVQsXHJcbiAgYWRqdXN0RGF0ZSA9IGZhbHNlXHJcbikgPT4ge1xyXG4gIGxldCBkYXRlO1xyXG4gIGxldCBtb250aDtcclxuICBsZXQgZGF5O1xyXG4gIGxldCB5ZWFyO1xyXG4gIGxldCBwYXJzZWQ7XHJcblxyXG4gIGlmIChkYXRlU3RyaW5nKSB7XHJcbiAgICBsZXQgbW9udGhTdHIsIGRheVN0ciwgeWVhclN0cjtcclxuICAgIGlmIChkYXRlRm9ybWF0ID09PSBEQVRFX0ZPUk1BVF9PUFRJT05fMSB8fCBkYXRlRm9ybWF0ID09PSBEQVRFX0ZPUk1BVF9PUFRJT05fMiB8fCBkYXRlRm9ybWF0ID09PSBEQVRFX0ZPUk1BVF9PUFRJT05fMyB8fCBkYXRlRm9ybWF0ID09PSBEQVRFX0ZPUk1BVF9PUFRJT05fNCB8fCBkYXRlRm9ybWF0ID09PSBEQVRFX0ZPUk1BVF9PUFRJT05fNSkge1xyXG4gICAgICBbZGF5U3RyLCBtb250aFN0ciwgeWVhclN0cl0gPSBkYXRlU3RyaW5nLnNwbGl0KC8tfFxcLnxcXC98XFxzLyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBbeWVhclN0ciwgbW9udGhTdHIsIGRheVN0cl0gPSBkYXRlU3RyaW5nLnNwbGl0KFwiLVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoeWVhclN0cikge1xyXG4gICAgICBwYXJzZWQgPSBwYXJzZUludCh5ZWFyU3RyLCAxMCk7XHJcbiAgICAgIGlmICghTnVtYmVyLmlzTmFOKHBhcnNlZCkpIHtcclxuICAgICAgICB5ZWFyID0gcGFyc2VkO1xyXG4gICAgICAgIGlmIChhZGp1c3REYXRlKSB7XHJcbiAgICAgICAgICB5ZWFyID0gTWF0aC5tYXgoMCwgeWVhcik7XHJcbiAgICAgICAgICBpZiAoeWVhclN0ci5sZW5ndGggPCAzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRZZWFyID0gdG9kYXkoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50WWVhclN0dWIgPVxyXG4gICAgICAgICAgICAgIGN1cnJlbnRZZWFyIC0gKGN1cnJlbnRZZWFyICUgMTAgKiogeWVhclN0ci5sZW5ndGgpO1xyXG4gICAgICAgICAgICB5ZWFyID0gY3VycmVudFllYXJTdHViICsgcGFyc2VkO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChtb250aFN0cikge1xyXG4gICAgICBwYXJzZWQgPSBwYXJzZUludChtb250aFN0ciwgMTApO1xyXG4gICAgICBpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB7XHJcbiAgICAgICAgbW9udGggPSBwYXJzZWQ7XHJcbiAgICAgICAgaWYgKGFkanVzdERhdGUpIHtcclxuICAgICAgICAgIG1vbnRoID0gTWF0aC5tYXgoMSwgbW9udGgpO1xyXG4gICAgICAgICAgbW9udGggPSBNYXRoLm1pbigxMiwgbW9udGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChtb250aCAmJiBkYXlTdHIgJiYgeWVhciAhPSBudWxsKSB7XHJcbiAgICAgIHBhcnNlZCA9IHBhcnNlSW50KGRheVN0ciwgMTApO1xyXG4gICAgICBpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB7XHJcbiAgICAgICAgZGF5ID0gcGFyc2VkO1xyXG4gICAgICAgIGlmIChhZGp1c3REYXRlKSB7XHJcbiAgICAgICAgICBjb25zdCBsYXN0RGF5T2ZUaGVNb250aCA9IHNldERhdGUoeWVhciwgbW9udGgsIDApLmdldERhdGUoKTtcclxuICAgICAgICAgIGRheSA9IE1hdGgubWF4KDEsIGRheSk7XHJcbiAgICAgICAgICBkYXkgPSBNYXRoLm1pbihsYXN0RGF5T2ZUaGVNb250aCwgZGF5KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobW9udGggJiYgZGF5ICYmIHllYXIgIT0gbnVsbCkge1xyXG4gICAgICBkYXRlID0gc2V0RGF0ZSh5ZWFyLCBtb250aCAtIDEsIGRheSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBGb3JtYXQgYSBkYXRlIHRvIGZvcm1hdCBERC1NTS1ZWVlZXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSB0aGUgZGF0ZSB0byBmb3JtYXRcclxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGVGb3JtYXQgdGhlIGZvcm1hdCBvZiB0aGUgZGF0ZSBzdHJpbmdcclxuICogQHJldHVybnMge3N0cmluZ30gdGhlIGZvcm1hdHRlZCBkYXRlIHN0cmluZ1xyXG4gKi9cclxuY29uc3QgZm9ybWF0RGF0ZSA9IChkYXRlLCBkYXRlRm9ybWF0ID0gSU5URVJOQUxfREFURV9GT1JNQVQpID0+IHtcclxuICBjb25zdCBwYWRaZXJvcyA9ICh2YWx1ZSwgbGVuZ3RoKSA9PiB7XHJcbiAgICByZXR1cm4gYDAwMDAke3ZhbHVlfWAuc2xpY2UoLWxlbmd0aCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgbW9udGggPSBkYXRlLmdldE1vbnRoKCkgKyAxO1xyXG4gIGNvbnN0IGRheSA9IGRhdGUuZ2V0RGF0ZSgpO1xyXG4gIGNvbnN0IHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XHJcblxyXG4gIGlmIChkYXRlRm9ybWF0ID09PSBEQVRFX0ZPUk1BVF9PUFRJT05fMSkge1xyXG4gICAgcmV0dXJuIFtwYWRaZXJvcyhkYXksIDIpLCBwYWRaZXJvcyhtb250aCwgMiksIHBhZFplcm9zKHllYXIsIDQpXS5qb2luKFwiL1wiKTtcclxuICB9XHJcbiAgZWxzZSBpZiAoZGF0ZUZvcm1hdCA9PT0gREFURV9GT1JNQVRfT1BUSU9OXzIpIHtcclxuICAgIHJldHVybiBbcGFkWmVyb3MoZGF5LCAyKSwgcGFkWmVyb3MobW9udGgsIDIpLCBwYWRaZXJvcyh5ZWFyLCA0KV0uam9pbihcIi1cIik7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKGRhdGVGb3JtYXQgPT09IERBVEVfRk9STUFUX09QVElPTl8zKSB7XHJcbiAgICByZXR1cm4gW3BhZFplcm9zKGRheSwgMiksIHBhZFplcm9zKG1vbnRoLCAyKSwgcGFkWmVyb3MoeWVhciwgNCldLmpvaW4oXCIuXCIpO1xyXG4gIH1cclxuICBlbHNlIGlmIChkYXRlRm9ybWF0ID09PSBEQVRFX0ZPUk1BVF9PUFRJT05fNCkge1xyXG4gICAgcmV0dXJuIFtwYWRaZXJvcyhkYXksIDIpLCBwYWRaZXJvcyhtb250aCwgMiksIHBhZFplcm9zKHllYXIsIDQpXS5qb2luKFwiIFwiKTtcclxuICB9XHJcbiAgZWxzZSBpZiAoZGF0ZUZvcm1hdCA9PT0gREFURV9GT1JNQVRfT1BUSU9OXzUpIHtcclxuICAgIGxldCB0ZW1wRGF5TW9udGggPSBbcGFkWmVyb3MoZGF5LCAyKSwgcGFkWmVyb3MobW9udGgsIDIpXS5qb2luKFwiL1wiKTtcclxuICAgIHJldHVybiBbdGVtcERheU1vbnRoLCBwYWRaZXJvcyh5ZWFyLCA0KV0uam9pbihcIi1cIik7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gW3BhZFplcm9zKHllYXIsIDQpLCBwYWRaZXJvcyhtb250aCwgMiksIHBhZFplcm9zKGRheSwgMildLmpvaW4oXCItXCIpO1xyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBEYXRlIE1hbmlwdWxhdGlvbiBGdW5jdGlvbnNcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYSBncmlkIHN0cmluZyBmcm9tIGFuIGFycmF5IG9mIGh0bWwgc3RyaW5nc1xyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBodG1sQXJyYXkgdGhlIGFycmF5IG9mIGh0bWwgaXRlbXNcclxuICogQHBhcmFtIHtudW1iZXJ9IHJvd1NpemUgdGhlIGxlbmd0aCBvZiBhIHJvd1xyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgZ3JpZCBzdHJpbmdcclxuICovXHJcbmNvbnN0IGxpc3RUb0dyaWRIdG1sID0gKGh0bWxBcnJheSwgcm93U2l6ZSkgPT4ge1xyXG4gIGNvbnN0IGdyaWQgPSBbXTtcclxuICBsZXQgcm93ID0gW107XHJcblxyXG4gIGxldCBpID0gMDtcclxuICB3aGlsZSAoaSA8IGh0bWxBcnJheS5sZW5ndGgpIHtcclxuICAgIHJvdyA9IFtdO1xyXG4gICAgd2hpbGUgKGkgPCBodG1sQXJyYXkubGVuZ3RoICYmIHJvdy5sZW5ndGggPCByb3dTaXplKSB7XHJcbiAgICAgIHJvdy5wdXNoKGA8dGQ+JHtodG1sQXJyYXlbaV19PC90ZD5gKTtcclxuICAgICAgaSArPSAxO1xyXG4gICAgfVxyXG4gICAgZ3JpZC5wdXNoKGA8dHI+JHtyb3cuam9pbihcIlwiKX08L3RyPmApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGdyaWQuam9pbihcIlwiKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBzZXQgdGhlIHZhbHVlIG9mIHRoZSBlbGVtZW50IGFuZCBkaXNwYXRjaCBhIGNoYW5nZSBldmVudFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGVsIFRoZSBlbGVtZW50IHRvIHVwZGF0ZVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgVGhlIG5ldyB2YWx1ZSBvZiB0aGUgZWxlbWVudFxyXG4gKi9cclxuY29uc3QgY2hhbmdlRWxlbWVudFZhbHVlID0gKGVsLCB2YWx1ZSA9IFwiXCIpID0+IHtcclxuICBjb25zdCBlbGVtZW50VG9DaGFuZ2UgPSBlbDtcclxuICBlbGVtZW50VG9DaGFuZ2UudmFsdWUgPSB2YWx1ZTtcclxuXHJcblxyXG4gIHZhciBldmVudCA9IG5ldyBFdmVudCgnY2hhbmdlJyk7XHJcbiAgZWxlbWVudFRvQ2hhbmdlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRoZSBwcm9wZXJ0aWVzIGFuZCBlbGVtZW50cyB3aXRoaW4gdGhlIGRhdGUgcGlja2VyLlxyXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBEYXRlUGlja2VyQ29udGV4dFxyXG4gKiBAcHJvcGVydHkge0hUTUxEaXZFbGVtZW50fSBjYWxlbmRhckVsXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGRhdGVQaWNrZXJFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxEaXZFbGVtZW50fSBkaWFsb2dFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxJbnB1dEVsZW1lbnR9IGludGVybmFsSW5wdXRFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxJbnB1dEVsZW1lbnR9IGV4dGVybmFsSW5wdXRFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxEaXZFbGVtZW50fSBzdGF0dXNFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxEaXZFbGVtZW50fSBndWlkZUVsXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTERpdkVsZW1lbnR9IGZpcnN0WWVhckNodW5rRWxcclxuICogQHByb3BlcnR5IHtEYXRlfSBjYWxlbmRhckRhdGVcclxuICogQHByb3BlcnR5IHtEYXRlfSBtaW5EYXRlXHJcbiAqIEBwcm9wZXJ0eSB7RGF0ZX0gbWF4RGF0ZVxyXG4gKiBAcHJvcGVydHkge0RhdGV9IHNlbGVjdGVkRGF0ZVxyXG4gKiBAcHJvcGVydHkge0RhdGV9IHJhbmdlRGF0ZVxyXG4gKiBAcHJvcGVydHkge0RhdGV9IGRlZmF1bHREYXRlXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEdldCBhbiBvYmplY3Qgb2YgdGhlIHByb3BlcnRpZXMgYW5kIGVsZW1lbnRzIGJlbG9uZ2luZyBkaXJlY3RseSB0byB0aGUgZ2l2ZW5cclxuICogZGF0ZSBwaWNrZXIgY29tcG9uZW50LlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCB0aGUgZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyXHJcbiAqIEByZXR1cm5zIHtEYXRlUGlja2VyQ29udGV4dH0gZWxlbWVudHNcclxuICovXHJcbmNvbnN0IGdldERhdGVQaWNrZXJDb250ZXh0ID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgZGF0ZVBpY2tlckVsID0gZWwuY2xvc2VzdChEQVRFX1BJQ0tFUik7XHJcblxyXG4gIGlmICghZGF0ZVBpY2tlckVsKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgaXMgbWlzc2luZyBvdXRlciAke0RBVEVfUElDS0VSfWApO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgaW50ZXJuYWxJbnB1dEVsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICBEQVRFX1BJQ0tFUl9JTlRFUk5BTF9JTlBVVFxyXG4gICk7XHJcbiAgY29uc3QgZXh0ZXJuYWxJbnB1dEVsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICBEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVFxyXG4gICk7XHJcbiAgY29uc3QgY2FsZW5kYXJFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKERBVEVfUElDS0VSX0NBTEVOREFSKTtcclxuICBjb25zdCB0b2dnbGVCdG5FbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKERBVEVfUElDS0VSX0JVVFRPTik7XHJcbiAgY29uc3Qgc3RhdHVzRWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihEQVRFX1BJQ0tFUl9TVEFUVVMpO1xyXG4gIGNvbnN0IGd1aWRlRWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihEQVRFX1BJQ0tFUl9HVUlERSk7XHJcbiAgY29uc3QgZmlyc3RZZWFyQ2h1bmtFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVIpO1xyXG4gIGNvbnN0IGRpYWxvZ0VsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoREFURV9QSUNLRVJfRElBTE9HX1dSQVBQRVIpO1xyXG5cclxuICAvLyBTZXQgZGF0ZSBmb3JtYXRcclxuICBsZXQgc2VsZWN0ZWREYXRlRm9ybWF0ID0gREFURV9GT1JNQVRfT1BUSU9OXzE7XHJcbiAgaWYgKGRhdGVQaWNrZXJFbC5oYXNBdHRyaWJ1dGUoXCJkYXRhLWRhdGVmb3JtYXRcIikpIHtcclxuICAgIHN3aXRjaCAoZGF0ZVBpY2tlckVsLmRhdGFzZXQuZGF0ZWZvcm1hdCkge1xyXG4gICAgICBjYXNlIERBVEVfRk9STUFUX09QVElPTl8xOlxyXG4gICAgICAgIHNlbGVjdGVkRGF0ZUZvcm1hdCA9IERBVEVfRk9STUFUX09QVElPTl8xO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIERBVEVfRk9STUFUX09QVElPTl8yOlxyXG4gICAgICAgIHNlbGVjdGVkRGF0ZUZvcm1hdCA9IERBVEVfRk9STUFUX09QVElPTl8yO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIERBVEVfRk9STUFUX09QVElPTl8zOlxyXG4gICAgICAgIHNlbGVjdGVkRGF0ZUZvcm1hdCA9IERBVEVfRk9STUFUX09QVElPTl8zO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIERBVEVfRk9STUFUX09QVElPTl80OlxyXG4gICAgICAgIHNlbGVjdGVkRGF0ZUZvcm1hdCA9IERBVEVfRk9STUFUX09QVElPTl80O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIERBVEVfRk9STUFUX09QVElPTl81OlxyXG4gICAgICAgIHNlbGVjdGVkRGF0ZUZvcm1hdCA9IERBVEVfRk9STUFUX09QVElPTl81O1xyXG4gICAgfVxyXG4gIH1cclxuICBjb25zdCBkYXRlRm9ybWF0T3B0aW9uID0gc2VsZWN0ZWREYXRlRm9ybWF0OyBcclxuXHJcbiAgY29uc3QgaW5wdXREYXRlID0gcGFyc2VEYXRlU3RyaW5nKFxyXG4gICAgZXh0ZXJuYWxJbnB1dEVsLnZhbHVlLFxyXG4gICAgZGF0ZUZvcm1hdE9wdGlvbixcclxuICAgIHRydWVcclxuICApO1xyXG4gIGNvbnN0IHNlbGVjdGVkRGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhpbnRlcm5hbElucHV0RWwudmFsdWUpO1xyXG5cclxuICBjb25zdCBjYWxlbmRhckRhdGUgPSBwYXJzZURhdGVTdHJpbmcoY2FsZW5kYXJFbC5kYXRhc2V0LnZhbHVlKTtcclxuICBjb25zdCBtaW5EYXRlID0gcGFyc2VEYXRlU3RyaW5nKGRhdGVQaWNrZXJFbC5kYXRhc2V0Lm1pbkRhdGUpO1xyXG4gIGNvbnN0IG1heERhdGUgPSBwYXJzZURhdGVTdHJpbmcoZGF0ZVBpY2tlckVsLmRhdGFzZXQubWF4RGF0ZSk7XHJcbiAgY29uc3QgcmFuZ2VEYXRlID0gcGFyc2VEYXRlU3RyaW5nKGRhdGVQaWNrZXJFbC5kYXRhc2V0LnJhbmdlRGF0ZSk7XHJcbiAgY29uc3QgZGVmYXVsdERhdGUgPSBwYXJzZURhdGVTdHJpbmcoZGF0ZVBpY2tlckVsLmRhdGFzZXQuZGVmYXVsdERhdGUpO1xyXG5cclxuICBpZiAobWluRGF0ZSAmJiBtYXhEYXRlICYmIG1pbkRhdGUgPiBtYXhEYXRlKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNaW5pbXVtIGRhdGUgY2Fubm90IGJlIGFmdGVyIG1heGltdW0gZGF0ZVwiKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBjYWxlbmRhckRhdGUsXHJcbiAgICBtaW5EYXRlLFxyXG4gICAgdG9nZ2xlQnRuRWwsXHJcbiAgICBkaWFsb2dFbCxcclxuICAgIHNlbGVjdGVkRGF0ZSxcclxuICAgIG1heERhdGUsXHJcbiAgICBmaXJzdFllYXJDaHVua0VsLFxyXG4gICAgZGF0ZVBpY2tlckVsLFxyXG4gICAgaW5wdXREYXRlLFxyXG4gICAgaW50ZXJuYWxJbnB1dEVsLFxyXG4gICAgZXh0ZXJuYWxJbnB1dEVsLFxyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIHJhbmdlRGF0ZSxcclxuICAgIGRlZmF1bHREYXRlLFxyXG4gICAgc3RhdHVzRWwsXHJcbiAgICBndWlkZUVsLFxyXG4gICAgZGF0ZUZvcm1hdE9wdGlvblxyXG4gIH07XHJcbn07XHJcblxyXG4vKipcclxuICogRGlzYWJsZSB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGRpc2FibGUgPSAoZWwpID0+IHtcclxuICBjb25zdCB7IGV4dGVybmFsSW5wdXRFbCwgdG9nZ2xlQnRuRWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgdG9nZ2xlQnRuRWwuZGlzYWJsZWQgPSB0cnVlO1xyXG4gIGV4dGVybmFsSW5wdXRFbC5kaXNhYmxlZCA9IHRydWU7XHJcbn07XHJcblxyXG4vKipcclxuICogRW5hYmxlIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZW5hYmxlID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBleHRlcm5hbElucHV0RWwsIHRvZ2dsZUJ0bkVsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gIHRvZ2dsZUJ0bkVsLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgZXh0ZXJuYWxJbnB1dEVsLmRpc2FibGVkID0gZmFsc2U7XHJcbn07XHJcblxyXG4vLyAjcmVnaW9uIFZhbGlkYXRpb25cclxuXHJcbi8qKlxyXG4gKiBWYWxpZGF0ZSB0aGUgdmFsdWUgaW4gdGhlIGlucHV0IGFzIGEgdmFsaWQgZGF0ZSBvZiBmb3JtYXQgRC9NL1lZWVlcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgaXNEYXRlSW5wdXRJbnZhbGlkID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBleHRlcm5hbElucHV0RWwsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgY29uc3QgZGF0ZVN0cmluZyA9IGV4dGVybmFsSW5wdXRFbC52YWx1ZTtcclxuICBsZXQgaXNJbnZhbGlkID0gZmFsc2U7XHJcblxyXG4gIGlmIChkYXRlU3RyaW5nKSB7XHJcbiAgICBpc0ludmFsaWQgPSB0cnVlO1xyXG5cclxuICAgIGNvbnN0IGRhdGVTdHJpbmdQYXJ0cyA9IGRhdGVTdHJpbmcuc3BsaXQoLy18XFwufFxcL3xcXHMvKTtcclxuICAgIGNvbnN0IFtkYXksIG1vbnRoLCB5ZWFyXSA9IGRhdGVTdHJpbmdQYXJ0cy5tYXAoKHN0cikgPT4ge1xyXG4gICAgICBsZXQgdmFsdWU7XHJcbiAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlSW50KHN0ciwgMTApO1xyXG4gICAgICBpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB2YWx1ZSA9IHBhcnNlZDtcclxuICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKG1vbnRoICYmIGRheSAmJiB5ZWFyICE9IG51bGwpIHtcclxuICAgICAgY29uc3QgY2hlY2tEYXRlID0gc2V0RGF0ZSh5ZWFyLCBtb250aCAtIDEsIGRheSk7XHJcblxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgY2hlY2tEYXRlLmdldE1vbnRoKCkgPT09IG1vbnRoIC0gMSAmJlxyXG4gICAgICAgIGNoZWNrRGF0ZS5nZXREYXRlKCkgPT09IGRheSAmJlxyXG4gICAgICAgIGNoZWNrRGF0ZS5nZXRGdWxsWWVhcigpID09PSB5ZWFyICYmXHJcbiAgICAgICAgZGF0ZVN0cmluZ1BhcnRzWzJdLmxlbmd0aCA9PT0gNCAmJlxyXG4gICAgICAgIGlzRGF0ZVdpdGhpbk1pbkFuZE1heChjaGVja0RhdGUsIG1pbkRhdGUsIG1heERhdGUpXHJcbiAgICAgICkge1xyXG4gICAgICAgIGlzSW52YWxpZCA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaXNJbnZhbGlkO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFZhbGlkYXRlIHRoZSB2YWx1ZSBpbiB0aGUgaW5wdXQgYXMgYSB2YWxpZCBkYXRlIG9mIGZvcm1hdCBNL0QvWVlZWVxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCB2YWxpZGF0ZURhdGVJbnB1dCA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgZXh0ZXJuYWxJbnB1dEVsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcbiAgY29uc3QgaXNJbnZhbGlkID0gaXNEYXRlSW5wdXRJbnZhbGlkKGV4dGVybmFsSW5wdXRFbCk7XHJcblxyXG4gIGlmIChpc0ludmFsaWQgJiYgIWV4dGVybmFsSW5wdXRFbC52YWxpZGF0aW9uTWVzc2FnZSkge1xyXG4gICAgZXh0ZXJuYWxJbnB1dEVsLnNldEN1c3RvbVZhbGlkaXR5KFZBTElEQVRJT05fTUVTU0FHRSk7XHJcbiAgfVxyXG5cclxuICBpZiAoIWlzSW52YWxpZCAmJiBleHRlcm5hbElucHV0RWwudmFsaWRhdGlvbk1lc3NhZ2UgPT09IFZBTElEQVRJT05fTUVTU0FHRSkge1xyXG4gICAgZXh0ZXJuYWxJbnB1dEVsLnNldEN1c3RvbVZhbGlkaXR5KFwiXCIpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gVmFsaWRhdGlvblxyXG5cclxuLyoqXHJcbiAqIEVuYWJsZSB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IHJlY29uY2lsZUlucHV0VmFsdWVzID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBpbnRlcm5hbElucHV0RWwsIGlucHV0RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG4gIGxldCBuZXdWYWx1ZSA9IFwiXCI7XHJcblxyXG4gIGlmIChpbnB1dERhdGUgJiYgIWlzRGF0ZUlucHV0SW52YWxpZChlbCkpIHtcclxuICAgIG5ld1ZhbHVlID0gZm9ybWF0RGF0ZShpbnB1dERhdGUpO1xyXG4gIH1cclxuXHJcbiAgaWYgKGludGVybmFsSW5wdXRFbC52YWx1ZSAhPT0gbmV3VmFsdWUpIHtcclxuICAgIGNoYW5nZUVsZW1lbnRWYWx1ZShpbnRlcm5hbElucHV0RWwsIG5ld1ZhbHVlKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogU2VsZWN0IHRoZSB2YWx1ZSBvZiB0aGUgZGF0ZSBwaWNrZXIgaW5wdXRzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlU3RyaW5nIFRoZSBkYXRlIHN0cmluZyB0byB1cGRhdGUgaW4gWVlZWS1NTS1ERCBmb3JtYXRcclxuICovXHJcbmNvbnN0IHNldENhbGVuZGFyVmFsdWUgPSAoZWwsIGRhdGVTdHJpbmcpID0+IHtcclxuICBjb25zdCBwYXJzZWREYXRlID0gcGFyc2VEYXRlU3RyaW5nKGRhdGVTdHJpbmcpO1xyXG5cclxuICBpZiAocGFyc2VkRGF0ZSkge1xyXG4gICAgXHJcbiAgICBjb25zdCB7XHJcbiAgICAgIGRhdGVQaWNrZXJFbCxcclxuICAgICAgaW50ZXJuYWxJbnB1dEVsLFxyXG4gICAgICBleHRlcm5hbElucHV0RWwsXHJcbiAgICAgIGRhdGVGb3JtYXRPcHRpb25cclxuICAgIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gICAgY29uc3QgZm9ybWF0dGVkRGF0ZSA9IGZvcm1hdERhdGUocGFyc2VkRGF0ZSwgZGF0ZUZvcm1hdE9wdGlvbik7XHJcblxyXG4gICAgY2hhbmdlRWxlbWVudFZhbHVlKGludGVybmFsSW5wdXRFbCwgZGF0ZVN0cmluZyk7XHJcbiAgICBjaGFuZ2VFbGVtZW50VmFsdWUoZXh0ZXJuYWxJbnB1dEVsLCBmb3JtYXR0ZWREYXRlKTtcclxuXHJcbiAgICB2YWxpZGF0ZURhdGVJbnB1dChkYXRlUGlja2VyRWwpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBFbmhhbmNlIGFuIGlucHV0IHdpdGggdGhlIGRhdGUgcGlja2VyIGVsZW1lbnRzXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIFRoZSBpbml0aWFsIHdyYXBwaW5nIGVsZW1lbnQgb2YgdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZW5oYW5jZURhdGVQaWNrZXIgPSAoZWwpID0+IHtcclxuICBjb25zdCBkYXRlUGlja2VyRWwgPSBlbC5jbG9zZXN0KERBVEVfUElDS0VSKTtcclxuICBjb25zdCBkZWZhdWx0VmFsdWUgPSBkYXRlUGlja2VyRWwuZGF0YXNldC5kZWZhdWx0VmFsdWU7XHJcblxyXG4gIGNvbnN0IGludGVybmFsSW5wdXRFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKGBpbnB1dGApO1xyXG5cclxuICBpZiAoIWludGVybmFsSW5wdXRFbCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGAke0RBVEVfUElDS0VSfSBpcyBtaXNzaW5nIGlubmVyIGlucHV0YCk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBtaW5EYXRlID0gcGFyc2VEYXRlU3RyaW5nKFxyXG4gICAgZGF0ZVBpY2tlckVsLmRhdGFzZXQubWluRGF0ZSB8fCBpbnRlcm5hbElucHV0RWwuZ2V0QXR0cmlidXRlKFwibWluXCIpXHJcbiAgKTtcclxuICBkYXRlUGlja2VyRWwuZGF0YXNldC5taW5EYXRlID0gbWluRGF0ZVxyXG4gICAgPyBmb3JtYXREYXRlKG1pbkRhdGUpXHJcbiAgICA6IERFRkFVTFRfTUlOX0RBVEU7XHJcblxyXG4gIGNvbnN0IG1heERhdGUgPSBwYXJzZURhdGVTdHJpbmcoXHJcbiAgICBkYXRlUGlja2VyRWwuZGF0YXNldC5tYXhEYXRlIHx8IGludGVybmFsSW5wdXRFbC5nZXRBdHRyaWJ1dGUoXCJtYXhcIilcclxuICApO1xyXG4gIGlmIChtYXhEYXRlKSB7XHJcbiAgICBkYXRlUGlja2VyRWwuZGF0YXNldC5tYXhEYXRlID0gZm9ybWF0RGF0ZShtYXhEYXRlKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGNhbGVuZGFyV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgY2FsZW5kYXJXcmFwcGVyLmNsYXNzTGlzdC5hZGQoREFURV9QSUNLRVJfV1JBUFBFUl9DTEFTUyk7XHJcbiAgY2FsZW5kYXJXcmFwcGVyLnRhYkluZGV4ID0gXCItMVwiO1xyXG5cclxuICBjb25zdCBleHRlcm5hbElucHV0RWwgPSBpbnRlcm5hbElucHV0RWwuY2xvbmVOb2RlKCk7XHJcbiAgZXh0ZXJuYWxJbnB1dEVsLmNsYXNzTGlzdC5hZGQoREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRfQ0xBU1MpO1xyXG4gIGV4dGVybmFsSW5wdXRFbC50eXBlID0gXCJ0ZXh0XCI7XHJcbiAgZXh0ZXJuYWxJbnB1dEVsLm5hbWUgPSBcIlwiO1xyXG5cclxuICBsZXQgZGlhbG9nVGl0bGUgPSB0ZXh0LmNob29zZV9hX2RhdGU7XHJcbiAgY29uc3QgaGFzTWluRGF0ZSA9IG1pbkRhdGUgIT09IHVuZGVmaW5lZCAmJiBtaW5EYXRlICE9PSBcIlwiO1xyXG4gIGNvbnN0IGlzRGVmYXVsdE1pbkRhdGUgPSAgbWluRGF0ZSAhPT0gdW5kZWZpbmVkICYmIG1pbkRhdGUgIT09IFwiXCIgJiYgcGFyc2VEYXRlU3RyaW5nKERFRkFVTFRfTUlOX0RBVEUpLmdldFRpbWUoKSA9PT0gbWluRGF0ZS5nZXRUaW1lKCk7XHJcbiAgY29uc3QgaGFzTWF4RGF0ZSA9IG1heERhdGUgIT09IHVuZGVmaW5lZCAmJiBtYXhEYXRlICE9PSBcIlwiO1xyXG4gIFxyXG4gIGlmIChoYXNNaW5EYXRlICYmICFpc0RlZmF1bHRNaW5EYXRlICYmIGhhc01heERhdGUpIHtcclxuICAgIGNvbnN0IG1pbkRheSA9IG1pbkRhdGUuZ2V0RGF0ZSgpO1xyXG4gICAgY29uc3QgbWluTW9udGggPSBtaW5EYXRlLmdldE1vbnRoKCk7XHJcbiAgICBjb25zdCBtaW5Nb250aFN0ciA9IE1PTlRIX0xBQkVMU1ttaW5Nb250aF07XHJcbiAgICBjb25zdCBtaW5ZZWFyID0gbWluRGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gICAgY29uc3QgbWF4RGF5ID0gbWF4RGF0ZS5nZXREYXRlKCk7XHJcbiAgICBjb25zdCBtYXhNb250aCA9IG1heERhdGUuZ2V0TW9udGgoKTtcclxuICAgIGNvbnN0IG1heE1vbnRoU3RyID0gTU9OVEhfTEFCRUxTW21heE1vbnRoXTtcclxuICAgIGNvbnN0IG1heFllYXIgPSBtYXhEYXRlLmdldEZ1bGxZZWFyKCk7XHJcbiAgICBkaWFsb2dUaXRsZSA9IHRleHQuY2hvb3NlX2FfZGF0ZV9iZXR3ZWVuLnJlcGxhY2UoL3ttaW5EYXl9LywgbWluRGF5KS5yZXBsYWNlKC97bWluTW9udGhTdHJ9LywgbWluTW9udGhTdHIpLnJlcGxhY2UoL3ttaW5ZZWFyfS8sIG1pblllYXIpLnJlcGxhY2UoL3ttYXhEYXl9LywgbWF4RGF5KS5yZXBsYWNlKC97bWF4TW9udGhTdHJ9LywgbWF4TW9udGhTdHIpLnJlcGxhY2UoL3ttYXhZZWFyfS8sIG1heFllYXIpO1xyXG4gIH1cclxuICBlbHNlIGlmIChoYXNNaW5EYXRlICYmICFpc0RlZmF1bHRNaW5EYXRlICYmICFoYXNNYXhEYXRlKSB7XHJcbiAgICBjb25zdCBtaW5EYXkgPSBtaW5EYXRlLmdldERhdGUoKTtcclxuICAgIGNvbnN0IG1pbk1vbnRoID0gbWluRGF0ZS5nZXRNb250aCgpO1xyXG4gICAgY29uc3QgbWluTW9udGhTdHIgPSBNT05USF9MQUJFTFNbbWluTW9udGhdO1xyXG4gICAgY29uc3QgbWluWWVhciA9IG1pbkRhdGUuZ2V0RnVsbFllYXIoKTtcclxuICAgIGRpYWxvZ1RpdGxlID0gdGV4dC5jaG9vc2VfYV9kYXRlX2FmdGVyLnJlcGxhY2UoL3ttaW5EYXl9LywgbWluRGF5KS5yZXBsYWNlKC97bWluTW9udGhTdHJ9LywgbWluTW9udGhTdHIpLnJlcGxhY2UoL3ttaW5ZZWFyfS8sIG1pblllYXIpO1xyXG4gIH1cclxuICBlbHNlIGlmIChoYXNNYXhEYXRlKSB7XHJcbiAgICBjb25zdCBtYXhEYXkgPSBtYXhEYXRlLmdldERhdGUoKTtcclxuICAgIGNvbnN0IG1heE1vbnRoID0gbWF4RGF0ZS5nZXRNb250aCgpO1xyXG4gICAgY29uc3QgbWF4TW9udGhTdHIgPSBNT05USF9MQUJFTFNbbWF4TW9udGhdO1xyXG4gICAgY29uc3QgbWF4WWVhciA9IG1heERhdGUuZ2V0RnVsbFllYXIoKTtcclxuICAgIGRpYWxvZ1RpdGxlID0gdGV4dC5jaG9vc2VfYV9kYXRlX2JlZm9yZS5yZXBsYWNlKC97bWF4RGF5fS8sIG1heERheSkucmVwbGFjZSgve21heE1vbnRoU3RyfS8sIG1heE1vbnRoU3RyKS5yZXBsYWNlKC97bWF4WWVhcn0vLCBtYXhZZWFyKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGd1aWRlSUQgPSBleHRlcm5hbElucHV0RWwuZ2V0QXR0cmlidXRlKFwiaWRcIikgKyBcIi1ndWlkZVwiO1xyXG5cclxuICBjYWxlbmRhcldyYXBwZXIuYXBwZW5kQ2hpbGQoZXh0ZXJuYWxJbnB1dEVsKTtcclxuICBjYWxlbmRhcldyYXBwZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKFxyXG4gICAgXCJiZWZvcmVlbmRcIixcclxuICAgIFtcclxuICAgICAgYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiJHtEQVRFX1BJQ0tFUl9CVVRUT05fQ0xBU1N9XCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWxhYmVsPVwiJHt0ZXh0Lm9wZW5fY2FsZW5kYXJ9XCI+Jm5ic3A7PC9idXR0b24+YCxcclxuICAgICAgYDxkaXYgY2xhc3M9XCIke0RJQUxPR19XUkFQUEVSX0NMQVNTfVwiIHJvbGU9XCJkaWFsb2dcIiBhcmlhLW1vZGFsPVwidHJ1ZVwiIGFyaWEtbGFiZWw9XCIke2RpYWxvZ1RpdGxlfVwiIGFyaWEtZGVzY3JpYmVkYnk9XCIke2d1aWRlSUR9XCIgaGlkZGVuPjxkaXYgcm9sZT1cImFwcGxpY2F0aW9uXCI+PGRpdiBjbGFzcz1cIiR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9XCIgaGlkZGVuPjwvZGl2PjwvZGl2PjwvZGl2PmAsXHJcbiAgICAgIGA8ZGl2IGNsYXNzPVwic3Itb25seSAke0RBVEVfUElDS0VSX1NUQVRVU19DTEFTU31cIiByb2xlPVwic3RhdHVzXCIgYXJpYS1saXZlPVwicG9saXRlXCI+PC9kaXY+YCxcclxuICAgICAgYDxkaXYgY2xhc3M9XCJzci1vbmx5ICR7REFURV9QSUNLRVJfR1VJREVfQ0xBU1N9XCIgaWQ9XCIke2d1aWRlSUR9XCIgaGlkZGVuPiR7dGV4dC5ndWlkZX08L2Rpdj5gXHJcbiAgICBdLmpvaW4oXCJcIilcclxuICApO1xyXG5cclxuICBpbnRlcm5hbElucHV0RWwuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJ0cnVlXCIpO1xyXG4gIGludGVybmFsSW5wdXRFbC5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBcIi0xXCIpO1xyXG4gIGludGVybmFsSW5wdXRFbC5jbGFzc0xpc3QuYWRkKFxyXG4gICAgXCJzci1vbmx5XCIsXHJcbiAgICBEQVRFX1BJQ0tFUl9JTlRFUk5BTF9JTlBVVF9DTEFTU1xyXG4gICk7XHJcbiAgaW50ZXJuYWxJbnB1dEVsLnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTtcclxuICBpbnRlcm5hbElucHV0RWwucmVxdWlyZWQgPSBmYWxzZTtcclxuXHJcbiAgZGF0ZVBpY2tlckVsLmFwcGVuZENoaWxkKGNhbGVuZGFyV3JhcHBlcik7XHJcbiAgZGF0ZVBpY2tlckVsLmNsYXNzTGlzdC5hZGQoREFURV9QSUNLRVJfSU5JVElBTElaRURfQ0xBU1MpO1xyXG5cclxuICBpZiAoZGVmYXVsdFZhbHVlKSB7XHJcbiAgICBzZXRDYWxlbmRhclZhbHVlKGRhdGVQaWNrZXJFbCwgZGVmYXVsdFZhbHVlKTtcclxuICB9XHJcblxyXG4gIGlmIChpbnRlcm5hbElucHV0RWwuZGlzYWJsZWQpIHtcclxuICAgIGRpc2FibGUoZGF0ZVBpY2tlckVsKTtcclxuICAgIGludGVybmFsSW5wdXRFbC5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIH1cclxuICBcclxuICBpZiAoZXh0ZXJuYWxJbnB1dEVsLnZhbHVlKSB7XHJcbiAgICB2YWxpZGF0ZURhdGVJbnB1dChleHRlcm5hbElucHV0RWwpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vICNyZWdpb24gQ2FsZW5kYXIgLSBEYXRlIFNlbGVjdGlvbiBWaWV3XHJcblxyXG4vKipcclxuICogcmVuZGVyIHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlVG9EaXNwbGF5IGEgZGF0ZSB0byByZW5kZXIgb24gdGhlIGNhbGVuZGFyXHJcbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH0gYSByZWZlcmVuY2UgdG8gdGhlIG5ldyBjYWxlbmRhciBlbGVtZW50XHJcbiAqL1xyXG5jb25zdCByZW5kZXJDYWxlbmRhciA9IChlbCwgX2RhdGVUb0Rpc3BsYXkpID0+IHtcclxuICBjb25zdCB7XHJcbiAgICBkYXRlUGlja2VyRWwsXHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgc3RhdHVzRWwsXHJcbiAgICBzZWxlY3RlZERhdGUsXHJcbiAgICBtYXhEYXRlLFxyXG4gICAgbWluRGF0ZSxcclxuICAgIHJhbmdlRGF0ZSxcclxuICAgIGRpYWxvZ0VsLFxyXG4gICAgZ3VpZGVFbFxyXG4gIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcbiAgY29uc3QgdG9kYXlzRGF0ZSA9IHRvZGF5KCk7XHJcbiAgbGV0IGRhdGVUb0Rpc3BsYXkgPSBfZGF0ZVRvRGlzcGxheSB8fCB0b2RheXNEYXRlO1xyXG5cclxuICBjb25zdCBjYWxlbmRhcldhc0hpZGRlbiA9IGNhbGVuZGFyRWwuaGlkZGVuO1xyXG5cclxuICBjb25zdCBmb2N1c2VkRGF0ZSA9IGFkZERheXMoZGF0ZVRvRGlzcGxheSwgMCk7XHJcbiAgY29uc3QgZm9jdXNlZE1vbnRoID0gZGF0ZVRvRGlzcGxheS5nZXRNb250aCgpO1xyXG4gIGNvbnN0IGZvY3VzZWRZZWFyID0gZGF0ZVRvRGlzcGxheS5nZXRGdWxsWWVhcigpO1xyXG5cclxuICBjb25zdCBwcmV2TW9udGggPSBzdWJNb250aHMoZGF0ZVRvRGlzcGxheSwgMSk7XHJcbiAgY29uc3QgbmV4dE1vbnRoID0gYWRkTW9udGhzKGRhdGVUb0Rpc3BsYXksIDEpO1xyXG5cclxuICBjb25zdCBjdXJyZW50Rm9ybWF0dGVkRGF0ZSA9IGZvcm1hdERhdGUoZGF0ZVRvRGlzcGxheSk7XHJcblxyXG4gIGNvbnN0IGZpcnN0T2ZNb250aCA9IHN0YXJ0T2ZNb250aChkYXRlVG9EaXNwbGF5KTtcclxuICBjb25zdCBwcmV2QnV0dG9uc0Rpc2FibGVkID0gaXNTYW1lTW9udGgoZGF0ZVRvRGlzcGxheSwgbWluRGF0ZSk7XHJcbiAgY29uc3QgbmV4dEJ1dHRvbnNEaXNhYmxlZCA9IGlzU2FtZU1vbnRoKGRhdGVUb0Rpc3BsYXksIG1heERhdGUpO1xyXG5cclxuICBjb25zdCByYW5nZUNvbmNsdXNpb25EYXRlID0gc2VsZWN0ZWREYXRlIHx8IGRhdGVUb0Rpc3BsYXk7XHJcbiAgY29uc3QgcmFuZ2VTdGFydERhdGUgPSByYW5nZURhdGUgJiYgbWluKHJhbmdlQ29uY2x1c2lvbkRhdGUsIHJhbmdlRGF0ZSk7XHJcbiAgY29uc3QgcmFuZ2VFbmREYXRlID0gcmFuZ2VEYXRlICYmIG1heChyYW5nZUNvbmNsdXNpb25EYXRlLCByYW5nZURhdGUpO1xyXG5cclxuICBjb25zdCB3aXRoaW5SYW5nZVN0YXJ0RGF0ZSA9IHJhbmdlRGF0ZSAmJiBhZGREYXlzKHJhbmdlU3RhcnREYXRlLCAxKTtcclxuICBjb25zdCB3aXRoaW5SYW5nZUVuZERhdGUgPSByYW5nZURhdGUgJiYgc3ViRGF5cyhyYW5nZUVuZERhdGUsIDEpO1xyXG5cclxuICBjb25zdCBtb250aExhYmVsID0gTU9OVEhfTEFCRUxTW2ZvY3VzZWRNb250aF07XHJcblxyXG4gIGNvbnN0IGdlbmVyYXRlRGF0ZUh0bWwgPSAoZGF0ZVRvUmVuZGVyKSA9PiB7XHJcbiAgICBjb25zdCBjbGFzc2VzID0gW0NBTEVOREFSX0RBVEVfQ0xBU1NdO1xyXG4gICAgY29uc3QgZGF5ID0gZGF0ZVRvUmVuZGVyLmdldERhdGUoKTtcclxuICAgIGNvbnN0IG1vbnRoID0gZGF0ZVRvUmVuZGVyLmdldE1vbnRoKCk7XHJcbiAgICBjb25zdCB5ZWFyID0gZGF0ZVRvUmVuZGVyLmdldEZ1bGxZZWFyKCk7XHJcbiAgICBsZXQgZGF5T2ZXZWVrID0gZGF0ZVRvUmVuZGVyLmdldERheSgpIC0gMTtcclxuICAgIGlmIChkYXlPZldlZWsgPT09IC0xKSB7XHJcbiAgICAgIGRheU9mV2VlayA9IDY7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZm9ybWF0dGVkRGF0ZSA9IGZvcm1hdERhdGUoZGF0ZVRvUmVuZGVyKTtcclxuXHJcbiAgICBsZXQgdGFiaW5kZXggPSBcIi0xXCI7XHJcblxyXG4gICAgY29uc3QgaXNEaXNhYmxlZCA9ICFpc0RhdGVXaXRoaW5NaW5BbmRNYXgoZGF0ZVRvUmVuZGVyLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSBpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCBzZWxlY3RlZERhdGUpO1xyXG5cclxuICAgIGlmIChpc1NhbWVNb250aChkYXRlVG9SZW5kZXIsIHByZXZNb250aCkpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfUFJFVklPVVNfTU9OVEhfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NhbWVNb250aChkYXRlVG9SZW5kZXIsIGZvY3VzZWREYXRlKSkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9DVVJSRU5UX01PTlRIX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNTYW1lTW9udGgoZGF0ZVRvUmVuZGVyLCBuZXh0TW9udGgpKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX05FWFRfTU9OVEhfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NlbGVjdGVkKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1NFTEVDVEVEX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgdG9kYXlzRGF0ZSkpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfVE9EQVlfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChyYW5nZURhdGUpIHtcclxuICAgICAgaWYgKGlzU2FtZURheShkYXRlVG9SZW5kZXIsIHJhbmdlRGF0ZSkpIHtcclxuICAgICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9SQU5HRV9EQVRFX0NMQVNTKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGlzU2FtZURheShkYXRlVG9SZW5kZXIsIHJhbmdlU3RhcnREYXRlKSkge1xyXG4gICAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1JBTkdFX0RBVEVfU1RBUlRfQ0xBU1MpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgcmFuZ2VFbmREYXRlKSkge1xyXG4gICAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1JBTkdFX0RBVEVfRU5EX0NMQVNTKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKFxyXG4gICAgICAgIGlzRGF0ZVdpdGhpbk1pbkFuZE1heChcclxuICAgICAgICAgIGRhdGVUb1JlbmRlcixcclxuICAgICAgICAgIHdpdGhpblJhbmdlU3RhcnREYXRlLFxyXG4gICAgICAgICAgd2l0aGluUmFuZ2VFbmREYXRlXHJcbiAgICAgICAgKVxyXG4gICAgICApIHtcclxuICAgICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9XSVRISU5fUkFOR0VfQ0xBU1MpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2FtZURheShkYXRlVG9SZW5kZXIsIGZvY3VzZWREYXRlKSkge1xyXG4gICAgICB0YWJpbmRleCA9IFwiMFwiO1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9GT0NVU0VEX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtb250aFN0ciA9IE1PTlRIX0xBQkVMU1ttb250aF07XHJcbiAgICBjb25zdCBkYXlTdHIgPSBEQVlfT0ZfV0VFS19MQUJFTFNbZGF5T2ZXZWVrXTtcclxuICAgIGNvbnN0IGFyaWFMYWJlbERhdGUgPSB0ZXh0LmFyaWFfbGFiZWxfZGF0ZS5yZXBsYWNlKC97ZGF5U3RyfS8sIGRheVN0cikucmVwbGFjZSgve2RheX0vLCBkYXkpLnJlcGxhY2UoL3ttb250aFN0cn0vLCBtb250aFN0cikucmVwbGFjZSgve3llYXJ9LywgeWVhcik7XHJcblxyXG4gICAgcmV0dXJuIGA8YnV0dG9uXHJcbiAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICB0YWJpbmRleD1cIiR7dGFiaW5kZXh9XCJcclxuICAgICAgY2xhc3M9XCIke2NsYXNzZXMuam9pbihcIiBcIil9XCIgXHJcbiAgICAgIGRhdGEtZGF5PVwiJHtkYXl9XCIgXHJcbiAgICAgIGRhdGEtbW9udGg9XCIke21vbnRoICsgMX1cIiBcclxuICAgICAgZGF0YS15ZWFyPVwiJHt5ZWFyfVwiIFxyXG4gICAgICBkYXRhLXZhbHVlPVwiJHtmb3JtYXR0ZWREYXRlfVwiXHJcbiAgICAgIGFyaWEtbGFiZWw9XCIke2FyaWFMYWJlbERhdGV9XCJcclxuICAgICAgYXJpYS1jdXJyZW50PVwiJHtpc1NlbGVjdGVkID8gXCJkYXRlXCIgOiBcImZhbHNlXCJ9XCJcclxuICAgICAgJHtpc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgPiR7ZGF5fTwvYnV0dG9uPmA7XHJcbiAgfTtcclxuICAvLyBzZXQgZGF0ZSB0byBmaXJzdCByZW5kZXJlZCBkYXlcclxuICBkYXRlVG9EaXNwbGF5ID0gc3RhcnRPZldlZWsoZmlyc3RPZk1vbnRoKTtcclxuXHJcbiAgY29uc3QgZGF5cyA9IFtdO1xyXG5cclxuICB3aGlsZSAoXHJcbiAgICBkYXlzLmxlbmd0aCA8IDI4IHx8XHJcbiAgICBkYXRlVG9EaXNwbGF5LmdldE1vbnRoKCkgPT09IGZvY3VzZWRNb250aCB8fFxyXG4gICAgZGF5cy5sZW5ndGggJSA3ICE9PSAwXHJcbiAgKSB7XHJcbiAgICBkYXlzLnB1c2goZ2VuZXJhdGVEYXRlSHRtbChkYXRlVG9EaXNwbGF5KSk7XHJcbiAgICBkYXRlVG9EaXNwbGF5ID0gYWRkRGF5cyhkYXRlVG9EaXNwbGF5LCAxKTsgICAgXHJcbiAgfVxyXG4gIGNvbnN0IGRhdGVzSHRtbCA9IGxpc3RUb0dyaWRIdG1sKGRheXMsIDcpO1xyXG5cclxuICBjb25zdCBuZXdDYWxlbmRhciA9IGNhbGVuZGFyRWwuY2xvbmVOb2RlKCk7XHJcbiAgbmV3Q2FsZW5kYXIuZGF0YXNldC52YWx1ZSA9IGN1cnJlbnRGb3JtYXR0ZWREYXRlO1xyXG4gIG5ld0NhbGVuZGFyLnN0eWxlLnRvcCA9IGAke2RhdGVQaWNrZXJFbC5vZmZzZXRIZWlnaHR9cHhgO1xyXG4gIG5ld0NhbGVuZGFyLmhpZGRlbiA9IGZhbHNlO1xyXG4gIGxldCBjb250ZW50ID0gYDxkaXYgdGFiaW5kZXg9XCItMVwiIGNsYXNzPVwiJHtDQUxFTkRBUl9EQVRFX1BJQ0tFUl9DTEFTU31cIj5cclxuICAgICAgPGRpdiBjbGFzcz1cIiR7Q0FMRU5EQVJfUk9XX0NMQVNTfVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX0NFTExfQ0xBU1N9ICR7Q0FMRU5EQVJfQ0VMTF9DRU5URVJfSVRFTVNfQ0xBU1N9XCI+XHJcbiAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0xBU1N9XCJcclxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIiR7dGV4dC5wcmV2aW91c195ZWFyfVwiXHJcbiAgICAgICAgICAgICR7cHJldkJ1dHRvbnNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiJHtDQUxFTkRBUl9DRUxMX0NMQVNTfSAke0NBTEVOREFSX0NFTExfQ0VOVEVSX0lURU1TX0NMQVNTfVwiPlxyXG4gICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9QUkVWSU9VU19NT05USF9DTEFTU31cIlxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiJHt0ZXh0LnByZXZpb3VzX21vbnRofVwiXHJcbiAgICAgICAgICAgICR7cHJldkJ1dHRvbnNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiJHtDQUxFTkRBUl9DRUxMX0NMQVNTfSAke0NBTEVOREFSX01PTlRIX0xBQkVMX0NMQVNTfVwiPlxyXG4gICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9NT05USF9TRUxFQ1RJT05fQ0xBU1N9XCIgYXJpYS1sYWJlbD1cIiR7bW9udGhMYWJlbH0uICR7dGV4dC5zZWxlY3RfbW9udGh9LlwiXHJcbiAgICAgICAgICA+JHttb250aExhYmVsfTwvYnV0dG9uPlxyXG4gICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9ZRUFSX1NFTEVDVElPTl9DTEFTU31cIiBhcmlhLWxhYmVsPVwiJHtmb2N1c2VkWWVhcn0uICR7dGV4dC5zZWxlY3RfeWVhcn0uXCJcclxuICAgICAgICAgID4ke2ZvY3VzZWRZZWFyfTwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX0NFTExfQ0xBU1N9ICR7Q0FMRU5EQVJfQ0VMTF9DRU5URVJfSVRFTVNfQ0xBU1N9XCI+XHJcbiAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX05FWFRfTU9OVEhfQ0xBU1N9XCJcclxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIiR7dGV4dC5uZXh0X21vbnRofVwiXHJcbiAgICAgICAgICAgICR7bmV4dEJ1dHRvbnNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiJHtDQUxFTkRBUl9DRUxMX0NMQVNTfSAke0NBTEVOREFSX0NFTExfQ0VOVEVSX0lURU1TX0NMQVNTfVwiPlxyXG4gICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9ORVhUX1lFQVJfQ0xBU1N9XCJcclxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIiR7dGV4dC5uZXh0X3llYXJ9XCJcclxuICAgICAgICAgICAgJHtuZXh0QnV0dG9uc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPHRhYmxlIGNsYXNzPVwiJHtDQUxFTkRBUl9UQUJMRV9DTEFTU31cIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgPHRoZWFkPlxyXG4gICAgICAgICAgPHRyPmA7XHJcbiAgZm9yKGxldCBkIGluIERBWV9PRl9XRUVLX0xBQkVMUyl7XHJcbiAgICBjb250ZW50ICs9IGA8dGggY2xhc3M9XCIke0NBTEVOREFSX0RBWV9PRl9XRUVLX0NMQVNTfVwiIHNjb3BlPVwiY29sXCIgYXJpYS1sYWJlbD1cIiR7REFZX09GX1dFRUtfTEFCRUxTW2RdfVwiPiR7REFZX09GX1dFRUtfTEFCRUxTW2RdLmNoYXJBdCgwKX08L3RoPmA7XHJcbiAgfVxyXG4gIGNvbnRlbnQgKz0gYDwvdHI+XHJcbiAgICAgICAgPC90aGVhZD5cclxuICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAke2RhdGVzSHRtbH1cclxuICAgICAgICA8L3Rib2R5PlxyXG4gICAgICA8L3RhYmxlPlxyXG4gICAgPC9kaXY+YDtcclxuICBuZXdDYWxlbmRhci5pbm5lckhUTUwgPSBjb250ZW50O1xyXG4gIGNhbGVuZGFyRWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3Q2FsZW5kYXIsIGNhbGVuZGFyRWwpO1xyXG5cclxuICBkYXRlUGlja2VyRWwuY2xhc3NMaXN0LmFkZChEQVRFX1BJQ0tFUl9BQ1RJVkVfQ0xBU1MpO1xyXG4gIGlmIChkaWFsb2dFbC5oaWRkZW4gPT09IHRydWUpIHtcclxuICAgIGRpYWxvZ0VsLmhpZGRlbiA9IGZhbHNlO1xyXG4gICAgaWYgKGd1aWRlRWwuaGlkZGVuKSB7XHJcbiAgICAgIGd1aWRlRWwuaGlkZGVuID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIGNvbnN0IHN0YXR1c2VzID0gW107XHJcblxyXG4gIGlmIChjYWxlbmRhcldhc0hpZGRlbikge1xyXG4gICAgc3RhdHVzRWwudGV4dENvbnRlbnQgPSBcIlwiO1xyXG4gIH0gXHJcbiAgZWxzZSBpZiAoX2RhdGVUb0Rpc3BsYXkuZ2V0VGltZSgpID09PSBtaW5EYXRlLmdldFRpbWUoKSkge1xyXG4gICAgc3RhdHVzZXMucHVzaCh0ZXh0LmZpcnN0X3Bvc3NpYmxlX2RhdGUpO1xyXG4gIH1cclxuICBlbHNlIGlmIChtYXhEYXRlICE9PSB1bmRlZmluZWQgJiYgbWF4RGF0ZSAhPT0gXCJcIiAmJiBfZGF0ZVRvRGlzcGxheS5nZXRUaW1lKCkgPT09IG1heERhdGUuZ2V0VGltZSgpKSB7XHJcbiAgICBzdGF0dXNlcy5wdXNoKHRleHQubGFzdF9wb3NzaWJsZV9kYXRlKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBzdGF0dXNlcy5wdXNoKHRleHQuY3VycmVudF9tb250aF9kaXNwbGF5ZWQucmVwbGFjZSgve21vbnRoTGFiZWx9LywgbW9udGhMYWJlbCkucmVwbGFjZSgve2ZvY3VzZWRZZWFyfS8sIGZvY3VzZWRZZWFyKSk7XHJcbiAgfVxyXG5cclxuICBzdGF0dXNFbC50ZXh0Q29udGVudCA9IHN0YXR1c2VzLmpvaW4oXCIuIFwiKTtcclxuXHJcbiAgcmV0dXJuIG5ld0NhbGVuZGFyO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgb25lIHllYXIgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBfYnV0dG9uRWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheVByZXZpb3VzWWVhciA9IChfYnV0dG9uRWwpID0+IHtcclxuICBpZiAoX2J1dHRvbkVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgX2J1dHRvbkVsXHJcbiAgKTtcclxuICBsZXQgZGF0ZSA9IHN1YlllYXJzKGNhbGVuZGFyRGF0ZSwgMSk7XHJcbiAgZGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGUpO1xyXG5cclxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1BSRVZJT1VTX1lFQVIpO1xyXG4gIGlmIChuZXh0VG9Gb2N1cy5kaXNhYmxlZCkge1xyXG4gICAgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfUElDS0VSKTtcclxuICB9XHJcbiAgbmV4dFRvRm9jdXMuZm9jdXMoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IF9idXR0b25FbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNwbGF5UHJldmlvdXNNb250aCA9IChfYnV0dG9uRWwpID0+IHtcclxuICBpZiAoX2J1dHRvbkVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgX2J1dHRvbkVsXHJcbiAgKTtcclxuICBsZXQgZGF0ZSA9IHN1Yk1vbnRocyhjYWxlbmRhckRhdGUsIDEpO1xyXG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcclxuXHJcbiAgbGV0IG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9QUkVWSU9VU19NT05USCk7XHJcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XHJcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9QSUNLRVIpO1xyXG4gIH1cclxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gX2J1dHRvbkVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlOZXh0TW9udGggPSAoX2J1dHRvbkVsKSA9PiB7XHJcbiAgaWYgKF9idXR0b25FbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIF9idXR0b25FbFxyXG4gICk7XHJcbiAgbGV0IGRhdGUgPSBhZGRNb250aHMoY2FsZW5kYXJEYXRlLCAxKTtcclxuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XHJcblxyXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTkVYVF9NT05USCk7XHJcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XHJcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9QSUNLRVIpO1xyXG4gIH1cclxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIHllYXIgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBfYnV0dG9uRWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheU5leHRZZWFyID0gKF9idXR0b25FbCkgPT4ge1xyXG4gIGlmIChfYnV0dG9uRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBfYnV0dG9uRWxcclxuICApO1xyXG4gIGxldCBkYXRlID0gYWRkWWVhcnMoY2FsZW5kYXJEYXRlLCAxKTtcclxuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XHJcblxyXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTkVYVF9ZRUFSKTtcclxuICBpZiAobmV4dFRvRm9jdXMuZGlzYWJsZWQpIHtcclxuICAgIG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX1BJQ0tFUik7XHJcbiAgfVxyXG4gIG5leHRUb0ZvY3VzLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogSGlkZSB0aGUgY2FsZW5kYXIgb2YgYSBkYXRlIHBpY2tlciBjb21wb25lbnQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGhpZGVDYWxlbmRhciA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgZGF0ZVBpY2tlckVsLCBjYWxlbmRhckVsLCBzdGF0dXNFbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICBkYXRlUGlja2VyRWwuY2xhc3NMaXN0LnJlbW92ZShEQVRFX1BJQ0tFUl9BQ1RJVkVfQ0xBU1MpO1xyXG4gIGNhbGVuZGFyRWwuaGlkZGVuID0gdHJ1ZTtcclxuICBzdGF0dXNFbC50ZXh0Q29udGVudCA9IFwiXCI7XHJcbn07XHJcblxyXG4vKipcclxuICogU2VsZWN0IGEgZGF0ZSB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudC5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gY2FsZW5kYXJEYXRlRWwgQSBkYXRlIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IHNlbGVjdERhdGUgPSAoY2FsZW5kYXJEYXRlRWwpID0+IHtcclxuICBpZiAoY2FsZW5kYXJEYXRlRWwuZGlzYWJsZWQpIHJldHVybjtcclxuXHJcbiAgY29uc3QgeyBkYXRlUGlja2VyRWwsIGV4dGVybmFsSW5wdXRFbCwgZGlhbG9nRWwsIGd1aWRlRWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgY2FsZW5kYXJEYXRlRWxcclxuICApO1xyXG4gIHNldENhbGVuZGFyVmFsdWUoY2FsZW5kYXJEYXRlRWwsIGNhbGVuZGFyRGF0ZUVsLmRhdGFzZXQudmFsdWUpO1xyXG4gIGhpZGVDYWxlbmRhcihkYXRlUGlja2VyRWwpO1xyXG4gIGRpYWxvZ0VsLmhpZGRlbiA9IHRydWU7XHJcbiAgZ3VpZGVFbC5oaWRkZW4gPSB0cnVlO1xyXG5cclxuICBleHRlcm5hbElucHV0RWwuZm9jdXMoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUb2dnbGUgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCB0b2dnbGVDYWxlbmRhciA9IChlbCkgPT4ge1xyXG4gIGlmIChlbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGNvbnN0IHtcclxuICAgIGRpYWxvZ0VsLFxyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIGlucHV0RGF0ZSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICBtYXhEYXRlLFxyXG4gICAgZGVmYXVsdERhdGUsXHJcbiAgICBndWlkZUVsXHJcbiAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgaWYgKGNhbGVuZGFyRWwuaGlkZGVuKSB7XHJcbiAgICBjb25zdCBkYXRlVG9EaXNwbGF5ID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KFxyXG4gICAgICBpbnB1dERhdGUgfHwgZGVmYXVsdERhdGUgfHwgdG9kYXkoKSxcclxuICAgICAgbWluRGF0ZSxcclxuICAgICAgbWF4RGF0ZVxyXG4gICAgKTtcclxuICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZVRvRGlzcGxheSk7XHJcbiAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgaGlkZUNhbGVuZGFyKGVsKTtcclxuICAgIGRpYWxvZ0VsLmhpZGRlbiA9IHRydWU7XHJcbiAgICBndWlkZUVsLmhpZGRlbiA9IHRydWU7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZSB0aGUgY2FsZW5kYXIgd2hlbiB2aXNpYmxlLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBhbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXJcclxuICovXHJcbmNvbnN0IHVwZGF0ZUNhbGVuZGFySWZWaXNpYmxlID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBpbnB1dERhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuICBjb25zdCBjYWxlbmRhclNob3duID0gIWNhbGVuZGFyRWwuaGlkZGVuO1xyXG5cclxuICBpZiAoY2FsZW5kYXJTaG93biAmJiBpbnB1dERhdGUpIHtcclxuICAgIGNvbnN0IGRhdGVUb0Rpc3BsYXkgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoaW5wdXREYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICAgIHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGVUb0Rpc3BsYXkpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgLSBEYXRlIFNlbGVjdGlvbiBWaWV3XHJcblxyXG4vLyAjcmVnaW9uIENhbGVuZGFyIC0gTW9udGggU2VsZWN0aW9uIFZpZXdcclxuLyoqXHJcbiAqIERpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4gaW4gdGhlIGRhdGUgcGlja2VyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH0gYSByZWZlcmVuY2UgdG8gdGhlIG5ldyBjYWxlbmRhciBlbGVtZW50XHJcbiAqL1xyXG5jb25zdCBkaXNwbGF5TW9udGhTZWxlY3Rpb24gPSAoZWwsIG1vbnRoVG9EaXNwbGF5KSA9PiB7XHJcbiAgY29uc3Qge1xyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIHN0YXR1c0VsLFxyXG4gICAgY2FsZW5kYXJEYXRlLFxyXG4gICAgbWluRGF0ZSxcclxuICAgIG1heERhdGUsXHJcbiAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgY29uc3Qgc2VsZWN0ZWRNb250aCA9IGNhbGVuZGFyRGF0ZS5nZXRNb250aCgpO1xyXG4gIGNvbnN0IGZvY3VzZWRNb250aCA9IG1vbnRoVG9EaXNwbGF5ID09IG51bGwgPyBzZWxlY3RlZE1vbnRoIDogbW9udGhUb0Rpc3BsYXk7XHJcblxyXG4gIGNvbnN0IG1vbnRocyA9IE1PTlRIX0xBQkVMUy5tYXAoKG1vbnRoLCBpbmRleCkgPT4ge1xyXG4gICAgY29uc3QgbW9udGhUb0NoZWNrID0gc2V0TW9udGgoY2FsZW5kYXJEYXRlLCBpbmRleCk7XHJcblxyXG4gICAgY29uc3QgaXNEaXNhYmxlZCA9IGlzRGF0ZXNNb250aE91dHNpZGVNaW5Pck1heChcclxuICAgICAgbW9udGhUb0NoZWNrLFxyXG4gICAgICBtaW5EYXRlLFxyXG4gICAgICBtYXhEYXRlXHJcbiAgICApO1xyXG5cclxuICAgIGxldCB0YWJpbmRleCA9IFwiLTFcIjtcclxuXHJcbiAgICBjb25zdCBjbGFzc2VzID0gW0NBTEVOREFSX01PTlRIX0NMQVNTXTtcclxuICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSBpbmRleCA9PT0gc2VsZWN0ZWRNb250aDtcclxuXHJcbiAgICBpZiAoaW5kZXggPT09IGZvY3VzZWRNb250aCkge1xyXG4gICAgICB0YWJpbmRleCA9IFwiMFwiO1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2VsZWN0ZWQpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX01PTlRIX1NFTEVDVEVEX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYDxidXR0b24gXHJcbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgdGFiaW5kZXg9XCIke3RhYmluZGV4fVwiXHJcbiAgICAgICAgY2xhc3M9XCIke2NsYXNzZXMuam9pbihcIiBcIil9XCIgXHJcbiAgICAgICAgZGF0YS12YWx1ZT1cIiR7aW5kZXh9XCJcclxuICAgICAgICBkYXRhLWxhYmVsPVwiJHttb250aH1cIlxyXG4gICAgICAgIGFyaWEtY3VycmVudD1cIiR7aXNTZWxlY3RlZCA/IFwidHJ1ZVwiIDogXCJmYWxzZVwifVwiXHJcbiAgICAgICAgJHtpc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICA+JHttb250aH08L2J1dHRvbj5gO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBtb250aHNIdG1sID0gYDxkaXYgdGFiaW5kZXg9XCItMVwiIGNsYXNzPVwiJHtDQUxFTkRBUl9NT05USF9QSUNLRVJfQ0xBU1N9XCI+XHJcbiAgICA8dGFibGUgY2xhc3M9XCIke0NBTEVOREFSX1RBQkxFX0NMQVNTfVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgPHRib2R5PlxyXG4gICAgICAgICR7bGlzdFRvR3JpZEh0bWwobW9udGhzLCAzKX1cclxuICAgICAgPC90Ym9keT5cclxuICAgIDwvdGFibGU+XHJcbiAgPC9kaXY+YDtcclxuXHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBjYWxlbmRhckVsLmNsb25lTm9kZSgpO1xyXG4gIG5ld0NhbGVuZGFyLmlubmVySFRNTCA9IG1vbnRoc0h0bWw7XHJcbiAgY2FsZW5kYXJFbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdDYWxlbmRhciwgY2FsZW5kYXJFbCk7XHJcblxyXG4gIHN0YXR1c0VsLnRleHRDb250ZW50ID0gdGV4dC5tb250aHNfZGlzcGxheWVkO1xyXG5cclxuICByZXR1cm4gbmV3Q2FsZW5kYXI7XHJcbn07XHJcblxyXG4vKipcclxuICogU2VsZWN0IGEgbW9udGggaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudC5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gbW9udGhFbCBBbiBtb250aCBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBzZWxlY3RNb250aCA9IChtb250aEVsKSA9PiB7XHJcbiAgaWYgKG1vbnRoRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBtb250aEVsXHJcbiAgKTtcclxuICBjb25zdCBzZWxlY3RlZE1vbnRoID0gcGFyc2VJbnQobW9udGhFbC5kYXRhc2V0LnZhbHVlLCAxMCk7XHJcbiAgbGV0IGRhdGUgPSBzZXRNb250aChjYWxlbmRhckRhdGUsIHNlbGVjdGVkTW9udGgpO1xyXG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcclxuICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgLSBNb250aCBTZWxlY3Rpb24gVmlld1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciAtIFllYXIgU2VsZWN0aW9uIFZpZXdcclxuXHJcbi8qKlxyXG4gKiBEaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4gaW4gdGhlIGRhdGUgcGlja2VyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyVG9EaXNwbGF5IHllYXIgdG8gZGlzcGxheSBpbiB5ZWFyIHNlbGVjdGlvblxyXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IGEgcmVmZXJlbmNlIHRvIHRoZSBuZXcgY2FsZW5kYXIgZWxlbWVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheVllYXJTZWxlY3Rpb24gPSAoZWwsIHllYXJUb0Rpc3BsYXkpID0+IHtcclxuICBjb25zdCB7XHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgc3RhdHVzRWwsXHJcbiAgICBjYWxlbmRhckRhdGUsXHJcbiAgICBtaW5EYXRlLFxyXG4gICAgbWF4RGF0ZSxcclxuICB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICBjb25zdCBzZWxlY3RlZFllYXIgPSBjYWxlbmRhckRhdGUuZ2V0RnVsbFllYXIoKTtcclxuICBjb25zdCBmb2N1c2VkWWVhciA9IHllYXJUb0Rpc3BsYXkgPT0gbnVsbCA/IHNlbGVjdGVkWWVhciA6IHllYXJUb0Rpc3BsYXk7XHJcblxyXG4gIGxldCB5ZWFyVG9DaHVuayA9IGZvY3VzZWRZZWFyO1xyXG4gIHllYXJUb0NodW5rIC09IHllYXJUb0NodW5rICUgWUVBUl9DSFVOSztcclxuICB5ZWFyVG9DaHVuayA9IE1hdGgubWF4KDAsIHllYXJUb0NodW5rKTtcclxuXHJcbiAgY29uc3QgcHJldlllYXJDaHVua0Rpc2FibGVkID0gaXNEYXRlc1llYXJPdXRzaWRlTWluT3JNYXgoXHJcbiAgICBzZXRZZWFyKGNhbGVuZGFyRGF0ZSwgeWVhclRvQ2h1bmsgLSAxKSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICBtYXhEYXRlXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgbmV4dFllYXJDaHVua0Rpc2FibGVkID0gaXNEYXRlc1llYXJPdXRzaWRlTWluT3JNYXgoXHJcbiAgICBzZXRZZWFyKGNhbGVuZGFyRGF0ZSwgeWVhclRvQ2h1bmsgKyBZRUFSX0NIVU5LKSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICBtYXhEYXRlXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgeWVhcnMgPSBbXTtcclxuICBsZXQgeWVhckluZGV4ID0geWVhclRvQ2h1bms7XHJcbiAgd2hpbGUgKHllYXJzLmxlbmd0aCA8IFlFQVJfQ0hVTkspIHtcclxuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSBpc0RhdGVzWWVhck91dHNpZGVNaW5Pck1heChcclxuICAgICAgc2V0WWVhcihjYWxlbmRhckRhdGUsIHllYXJJbmRleCksXHJcbiAgICAgIG1pbkRhdGUsXHJcbiAgICAgIG1heERhdGVcclxuICAgICk7XHJcblxyXG4gICAgbGV0IHRhYmluZGV4ID0gXCItMVwiO1xyXG5cclxuICAgIGNvbnN0IGNsYXNzZXMgPSBbQ0FMRU5EQVJfWUVBUl9DTEFTU107XHJcbiAgICBjb25zdCBpc1NlbGVjdGVkID0geWVhckluZGV4ID09PSBzZWxlY3RlZFllYXI7XHJcblxyXG4gICAgaWYgKHllYXJJbmRleCA9PT0gZm9jdXNlZFllYXIpIHtcclxuICAgICAgdGFiaW5kZXggPSBcIjBcIjtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX1lFQVJfRk9DVVNFRF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2VsZWN0ZWQpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX1lFQVJfU0VMRUNURURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIHllYXJzLnB1c2goXHJcbiAgICAgIGA8YnV0dG9uIFxyXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgIHRhYmluZGV4PVwiJHt0YWJpbmRleH1cIlxyXG4gICAgICAgIGNsYXNzPVwiJHtjbGFzc2VzLmpvaW4oXCIgXCIpfVwiIFxyXG4gICAgICAgIGRhdGEtdmFsdWU9XCIke3llYXJJbmRleH1cIlxyXG4gICAgICAgIGFyaWEtY3VycmVudD1cIiR7aXNTZWxlY3RlZCA/IFwidHJ1ZVwiIDogXCJmYWxzZVwifVwiXHJcbiAgICAgICAgJHtpc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICA+JHt5ZWFySW5kZXh9PC9idXR0b24+YFxyXG4gICAgKTtcclxuICAgIHllYXJJbmRleCArPSAxO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgeWVhcnNIdG1sID0gbGlzdFRvR3JpZEh0bWwoeWVhcnMsIDMpO1xyXG4gIGNvbnN0IGFyaWFMYWJlbFByZXZpb3VzWWVhcnMgPSB0ZXh0LnByZXZpb3VzX3llYXJzLnJlcGxhY2UoL3t5ZWFyc30vLCBZRUFSX0NIVU5LKTtcclxuICBjb25zdCBhcmlhTGFiZWxOZXh0WWVhcnMgPSB0ZXh0Lm5leHRfeWVhcnMucmVwbGFjZSgve3llYXJzfS8sIFlFQVJfQ0hVTkspO1xyXG4gIGNvbnN0IGFubm91bmNlWWVhcnMgPSB0ZXh0LnllYXJzX2Rpc3BsYXllZC5yZXBsYWNlKC97c3RhcnR9LywgeWVhclRvQ2h1bmspLnJlcGxhY2UoL3tlbmR9LywgeWVhclRvQ2h1bmsgKyBZRUFSX0NIVU5LIC0gMSk7XHJcblxyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gY2FsZW5kYXJFbC5jbG9uZU5vZGUoKTtcclxuICBuZXdDYWxlbmRhci5pbm5lckhUTUwgPSBgPGRpdiB0YWJpbmRleD1cIi0xXCIgY2xhc3M9XCIke0NBTEVOREFSX1lFQVJfUElDS0VSX0NMQVNTfVwiPlxyXG4gICAgPHRhYmxlIGNsYXNzPVwiJHtDQUxFTkRBUl9UQUJMRV9DTEFTU31cIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOS19DTEFTU31cIiBcclxuICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCIke2FyaWFMYWJlbFByZXZpb3VzWWVhcnN9XCJcclxuICAgICAgICAgICAgICAgICR7cHJldlllYXJDaHVua0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgPHRkIGNvbHNwYW49XCIzXCI+XHJcbiAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwiJHtDQUxFTkRBUl9UQUJMRV9DTEFTU31cIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICR7eWVhcnNIdG1sfVxyXG4gICAgICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LX0NMQVNTfVwiIFxyXG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIiR7YXJpYUxhYmVsTmV4dFllYXJzfVwiXHJcbiAgICAgICAgICAgICAgICAke25leHRZZWFyQ2h1bmtEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgICAgICAgICA+Jm5ic3A7PC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICA8L3RyPlxyXG4gICAgICAgIDwvdGJvZHk+XHJcbiAgICAgIDwvdGFibGU+XHJcbiAgICA8L2Rpdj5gO1xyXG4gIGNhbGVuZGFyRWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3Q2FsZW5kYXIsIGNhbGVuZGFyRWwpO1xyXG5cclxuICBzdGF0dXNFbC50ZXh0Q29udGVudCA9IGFubm91bmNlWWVhcnM7XHJcblxyXG4gIHJldHVybiBuZXdDYWxlbmRhcjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIGJ5IHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlQcmV2aW91c1llYXJDaHVuayA9IChlbCkgPT4ge1xyXG4gIGlmIChlbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG5cclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBlbFxyXG4gICk7XHJcbiAgY29uc3QgeWVhckVsID0gY2FsZW5kYXJFbC5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfRk9DVVNFRCk7XHJcbiAgY29uc3Qgc2VsZWN0ZWRZZWFyID0gcGFyc2VJbnQoeWVhckVsLnRleHRDb250ZW50LCAxMCk7XHJcblxyXG4gIGxldCBhZGp1c3RlZFllYXIgPSBzZWxlY3RlZFllYXIgLSBZRUFSX0NIVU5LO1xyXG4gIGFkanVzdGVkWWVhciA9IE1hdGgubWF4KDAsIGFkanVzdGVkWWVhcik7XHJcblxyXG4gIGNvbnN0IGRhdGUgPSBzZXRZZWFyKGNhbGVuZGFyRGF0ZSwgYWRqdXN0ZWRZZWFyKTtcclxuICBjb25zdCBjYXBwZWREYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheVllYXJTZWxlY3Rpb24oXHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgY2FwcGVkRGF0ZS5nZXRGdWxsWWVhcigpXHJcbiAgKTtcclxuXHJcbiAgbGV0IG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LKTtcclxuICBpZiAobmV4dFRvRm9jdXMuZGlzYWJsZWQpIHtcclxuICAgIG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX1BJQ0tFUik7XHJcbiAgfVxyXG4gIG5leHRUb0ZvY3VzLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBieSB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNwbGF5TmV4dFllYXJDaHVuayA9IChlbCkgPT4ge1xyXG4gIGlmIChlbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG5cclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBlbFxyXG4gICk7XHJcbiAgY29uc3QgeWVhckVsID0gY2FsZW5kYXJFbC5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfRk9DVVNFRCk7XHJcbiAgY29uc3Qgc2VsZWN0ZWRZZWFyID0gcGFyc2VJbnQoeWVhckVsLnRleHRDb250ZW50LCAxMCk7XHJcblxyXG4gIGxldCBhZGp1c3RlZFllYXIgPSBzZWxlY3RlZFllYXIgKyBZRUFSX0NIVU5LO1xyXG4gIGFkanVzdGVkWWVhciA9IE1hdGgubWF4KDAsIGFkanVzdGVkWWVhcik7XHJcblxyXG4gIGNvbnN0IGRhdGUgPSBzZXRZZWFyKGNhbGVuZGFyRGF0ZSwgYWRqdXN0ZWRZZWFyKTtcclxuICBjb25zdCBjYXBwZWREYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheVllYXJTZWxlY3Rpb24oXHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgY2FwcGVkRGF0ZS5nZXRGdWxsWWVhcigpXHJcbiAgKTtcclxuXHJcbiAgbGV0IG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTkspO1xyXG4gIGlmIChuZXh0VG9Gb2N1cy5kaXNhYmxlZCkge1xyXG4gICAgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfUElDS0VSKTtcclxuICB9XHJcbiAgbmV4dFRvRm9jdXMuZm9jdXMoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZWxlY3QgYSB5ZWFyIGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IHllYXJFbCBBIHllYXIgZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3Qgc2VsZWN0WWVhciA9ICh5ZWFyRWwpID0+IHtcclxuICBpZiAoeWVhckVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgeWVhckVsXHJcbiAgKTtcclxuICBjb25zdCBzZWxlY3RlZFllYXIgPSBwYXJzZUludCh5ZWFyRWwuaW5uZXJIVE1MLCAxMCk7XHJcbiAgbGV0IGRhdGUgPSBzZXRZZWFyKGNhbGVuZGFyRGF0ZSwgc2VsZWN0ZWRZZWFyKTtcclxuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XHJcbiAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIENhbGVuZGFyIC0gWWVhciBTZWxlY3Rpb24gVmlld1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciBFdmVudCBIYW5kbGluZ1xyXG5cclxuLyoqXHJcbiAqIEhpZGUgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVFc2NhcGVGcm9tQ2FsZW5kYXIgPSAoZXZlbnQpID0+IHtcclxuICBjb25zdCB7IGRhdGVQaWNrZXJFbCwgZXh0ZXJuYWxJbnB1dEVsLCBkaWFsb2dFbCwgZ3VpZGVFbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZXZlbnQudGFyZ2V0KTtcclxuXHJcbiAgaGlkZUNhbGVuZGFyKGRhdGVQaWNrZXJFbCk7XHJcbiAgZGlhbG9nRWwuaGlkZGVuID0gdHJ1ZTtcclxuICBndWlkZUVsLmhpZGRlbiA9IHRydWU7XHJcbiAgZXh0ZXJuYWxJbnB1dEVsLmZvY3VzKCk7XHJcblxyXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIENhbGVuZGFyIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vLyAjcmVnaW9uIENhbGVuZGFyIERhdGUgRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8qKlxyXG4gKiBBZGp1c3QgdGhlIGRhdGUgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyIGlmIG5lZWRlZC5cclxuICpcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gYWRqdXN0RGF0ZUZuIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgYWRqdXN0Q2FsZW5kYXIgPSAoYWRqdXN0RGF0ZUZuKSA9PiB7XHJcbiAgcmV0dXJuIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgICBldmVudC50YXJnZXRcclxuICAgICk7XHJcblxyXG4gICAgY29uc3QgZGF0ZSA9IGFkanVzdERhdGVGbihjYWxlbmRhckRhdGUpO1xyXG5cclxuICAgIGNvbnN0IGNhcHBlZERhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgICBpZiAoIWlzU2FtZURheShjYWxlbmRhckRhdGUsIGNhcHBlZERhdGUpKSB7XHJcbiAgICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgY2FwcGVkRGF0ZSk7XHJcbiAgICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9GT0NVU0VEKS5mb2N1cygpO1xyXG4gICAgfVxyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgb25lIHdlZWsgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVVcEZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IHN1YldlZWtzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSB3ZWVrIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRG93bkZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IGFkZFdlZWtzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSBkYXkgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVMZWZ0RnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gc3ViRGF5cyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgZGF5IGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlUmlnaHRGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBhZGREYXlzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgc3RhcnQgb2YgdGhlIHdlZWsgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVIb21lRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gc3RhcnRPZldlZWsoZGF0ZSkpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBlbmQgb2YgdGhlIHdlZWsgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVFbmRGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBlbmRPZldlZWsoZGF0ZSkpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlUGFnZURvd25Gcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBhZGRNb250aHMoZGF0ZSwgMSkpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgb25lIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlUGFnZVVwRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gc3ViTW9udGhzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlU2hpZnRQYWdlRG93bkZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IGFkZFllYXJzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlU2hpZnRQYWdlVXBGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBzdWJZZWFycyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogZGlzcGxheSB0aGUgY2FsZW5kYXIgZm9yIHRoZSBtb3VzZW1vdmUgZGF0ZS5cclxuICpcclxuICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCBUaGUgbW91c2Vtb3ZlIGV2ZW50XHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGRhdGVFbCBBIGRhdGUgZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlTW91c2Vtb3ZlRnJvbURhdGUgPSAoZGF0ZUVsKSA9PiB7XHJcbiAgaWYgKGRhdGVFbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG5cclxuICBjb25zdCBjYWxlbmRhckVsID0gZGF0ZUVsLmNsb3Nlc3QoREFURV9QSUNLRVJfQ0FMRU5EQVIpO1xyXG5cclxuICBjb25zdCBjdXJyZW50Q2FsZW5kYXJEYXRlID0gY2FsZW5kYXJFbC5kYXRhc2V0LnZhbHVlO1xyXG4gIGNvbnN0IGhvdmVyRGF0ZSA9IGRhdGVFbC5kYXRhc2V0LnZhbHVlO1xyXG5cclxuICBpZiAoaG92ZXJEYXRlID09PSBjdXJyZW50Q2FsZW5kYXJEYXRlKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IGRhdGVUb0Rpc3BsYXkgPSBwYXJzZURhdGVTdHJpbmcoaG92ZXJEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGVUb0Rpc3BsYXkpO1xyXG4gIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9GT0NVU0VEKS5mb2N1cygpO1xyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciBEYXRlIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vLyAjcmVnaW9uIENhbGVuZGFyIE1vbnRoIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vKipcclxuICogQWRqdXN0IHRoZSBtb250aCBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbiBpZiBuZWVkZWQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGFkanVzdE1vbnRoRm4gZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBhZGp1c3RlZCBtb250aFxyXG4gKi9cclxuY29uc3QgYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4gPSAoYWRqdXN0TW9udGhGbikgPT4ge1xyXG4gIHJldHVybiAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IG1vbnRoRWwgPSBldmVudC50YXJnZXQ7XHJcbiAgICBjb25zdCBzZWxlY3RlZE1vbnRoID0gcGFyc2VJbnQobW9udGhFbC5kYXRhc2V0LnZhbHVlLCAxMCk7XHJcbiAgICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICAgIG1vbnRoRWxcclxuICAgICk7XHJcbiAgICBjb25zdCBjdXJyZW50RGF0ZSA9IHNldE1vbnRoKGNhbGVuZGFyRGF0ZSwgc2VsZWN0ZWRNb250aCk7XHJcblxyXG4gICAgbGV0IGFkanVzdGVkTW9udGggPSBhZGp1c3RNb250aEZuKHNlbGVjdGVkTW9udGgpO1xyXG4gICAgYWRqdXN0ZWRNb250aCA9IE1hdGgubWF4KDAsIE1hdGgubWluKDExLCBhZGp1c3RlZE1vbnRoKSk7XHJcblxyXG4gICAgY29uc3QgZGF0ZSA9IHNldE1vbnRoKGNhbGVuZGFyRGF0ZSwgYWRqdXN0ZWRNb250aCk7XHJcbiAgICBjb25zdCBjYXBwZWREYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gICAgaWYgKCFpc1NhbWVNb250aChjdXJyZW50RGF0ZSwgY2FwcGVkRGF0ZSkpIHtcclxuICAgICAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5TW9udGhTZWxlY3Rpb24oXHJcbiAgICAgICAgY2FsZW5kYXJFbCxcclxuICAgICAgICBjYXBwZWREYXRlLmdldE1vbnRoKClcclxuICAgICAgKTtcclxuICAgICAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9NT05USF9GT0NVU0VEKS5mb2N1cygpO1xyXG4gICAgfVxyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgdGhyZWUgbW9udGhzIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVVcEZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKChtb250aCkgPT4gbW9udGggLSAzKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIHRocmVlIG1vbnRocyBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRG93bkZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKChtb250aCkgPT4gbW9udGggKyAzKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlTGVmdEZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKChtb250aCkgPT4gbW9udGggLSAxKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlUmlnaHRGcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigobW9udGgpID0+IG1vbnRoICsgMSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIHN0YXJ0IG9mIHRoZSByb3cgb2YgbW9udGhzIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVIb21lRnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oXHJcbiAgKG1vbnRoKSA9PiBtb250aCAtIChtb250aCAlIDMpXHJcbik7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIGVuZCBvZiB0aGUgcm93IG9mIG1vbnRocyBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRW5kRnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oXHJcbiAgKG1vbnRoKSA9PiBtb250aCArIDIgLSAobW9udGggJSAzKVxyXG4pO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBsYXN0IG1vbnRoIChEZWNlbWJlcikgYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VEb3duRnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oKCkgPT4gMTEpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBmaXJzdCBtb250aCAoSmFudWFyeSkgYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VVcEZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKCgpID0+IDApO1xyXG5cclxuLyoqXHJcbiAqIHVwZGF0ZSB0aGUgZm9jdXMgb24gYSBtb250aCB3aGVuIHRoZSBtb3VzZSBtb3Zlcy5cclxuICpcclxuICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCBUaGUgbW91c2Vtb3ZlIGV2ZW50XHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IG1vbnRoRWwgQSBtb250aCBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVNb3VzZW1vdmVGcm9tTW9udGggPSAobW9udGhFbCkgPT4ge1xyXG4gIGlmIChtb250aEVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgaWYgKG1vbnRoRWwuY2xhc3NMaXN0LmNvbnRhaW5zKENBTEVOREFSX01PTlRIX0ZPQ1VTRURfQ0xBU1MpKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IGZvY3VzTW9udGggPSBwYXJzZUludChtb250aEVsLmRhdGFzZXQudmFsdWUsIDEwKTtcclxuXHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5TW9udGhTZWxlY3Rpb24obW9udGhFbCwgZm9jdXNNb250aCk7XHJcbiAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9NT05USF9GT0NVU0VEKS5mb2N1cygpO1xyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciBNb250aCBFdmVudCBIYW5kbGluZ1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciBZZWFyIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vKipcclxuICogQWRqdXN0IHRoZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4gaWYgbmVlZGVkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBhZGp1c3RZZWFyRm4gZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBhZGp1c3RlZCB5ZWFyXHJcbiAqL1xyXG5jb25zdCBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuID0gKGFkanVzdFllYXJGbikgPT4ge1xyXG4gIHJldHVybiAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IHllYXJFbCA9IGV2ZW50LnRhcmdldDtcclxuICAgIGNvbnN0IHNlbGVjdGVkWWVhciA9IHBhcnNlSW50KHllYXJFbC5kYXRhc2V0LnZhbHVlLCAxMCk7XHJcbiAgICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICAgIHllYXJFbFxyXG4gICAgKTtcclxuICAgIGNvbnN0IGN1cnJlbnREYXRlID0gc2V0WWVhcihjYWxlbmRhckRhdGUsIHNlbGVjdGVkWWVhcik7XHJcblxyXG4gICAgbGV0IGFkanVzdGVkWWVhciA9IGFkanVzdFllYXJGbihzZWxlY3RlZFllYXIpO1xyXG4gICAgYWRqdXN0ZWRZZWFyID0gTWF0aC5tYXgoMCwgYWRqdXN0ZWRZZWFyKTtcclxuXHJcbiAgICBjb25zdCBkYXRlID0gc2V0WWVhcihjYWxlbmRhckRhdGUsIGFkanVzdGVkWWVhcik7XHJcbiAgICBjb25zdCBjYXBwZWREYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gICAgaWYgKCFpc1NhbWVZZWFyKGN1cnJlbnREYXRlLCBjYXBwZWREYXRlKSkge1xyXG4gICAgICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlZZWFyU2VsZWN0aW9uKFxyXG4gICAgICAgIGNhbGVuZGFyRWwsXHJcbiAgICAgICAgY2FwcGVkRGF0ZS5nZXRGdWxsWWVhcigpXHJcbiAgICAgICk7XHJcbiAgICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEKS5mb2N1cygpO1xyXG4gICAgfVxyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgdGhyZWUgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlVXBGcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oKHllYXIpID0+IHllYXIgLSAzKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIHRocmVlIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZURvd25Gcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oKHllYXIpID0+IHllYXIgKyAzKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUxlZnRGcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oKHllYXIpID0+IHllYXIgLSAxKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVJpZ2h0RnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKCh5ZWFyKSA9PiB5ZWFyICsgMSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIHN0YXJ0IG9mIHRoZSByb3cgb2YgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlSG9tZUZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbihcclxuICAoeWVhcikgPT4geWVhciAtICh5ZWFyICUgMylcclxuKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgZW5kIG9mIHRoZSByb3cgb2YgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRW5kRnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKFxyXG4gICh5ZWFyKSA9PiB5ZWFyICsgMiAtICh5ZWFyICUgMylcclxuKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byBiYWNrIDEyIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VVcEZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbihcclxuICAoeWVhcikgPT4geWVhciAtIFlFQVJfQ0hVTktcclxuKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIDEyIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VEb3duRnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKFxyXG4gICh5ZWFyKSA9PiB5ZWFyICsgWUVBUl9DSFVOS1xyXG4pO1xyXG5cclxuLyoqXHJcbiAqIHVwZGF0ZSB0aGUgZm9jdXMgb24gYSB5ZWFyIHdoZW4gdGhlIG1vdXNlIG1vdmVzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ZW50IFRoZSBtb3VzZW1vdmUgZXZlbnRcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZGF0ZUVsIEEgeWVhciBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVNb3VzZW1vdmVGcm9tWWVhciA9ICh5ZWFyRWwpID0+IHtcclxuICBpZiAoeWVhckVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgaWYgKHllYXJFbC5jbGFzc0xpc3QuY29udGFpbnMoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEX0NMQVNTKSkgcmV0dXJuO1xyXG5cclxuICBjb25zdCBmb2N1c1llYXIgPSBwYXJzZUludCh5ZWFyRWwuZGF0YXNldC52YWx1ZSwgMTApO1xyXG5cclxuICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlZZWFyU2VsZWN0aW9uKHllYXJFbCwgZm9jdXNZZWFyKTtcclxuICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfRk9DVVNFRCkuZm9jdXMoKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgWWVhciBFdmVudCBIYW5kbGluZ1xyXG5cclxuLy8gI3JlZ2lvbiBGb2N1cyBIYW5kbGluZyBFdmVudCBIYW5kbGluZ1xyXG5cclxuY29uc3QgdGFiSGFuZGxlciA9IChmb2N1c2FibGUpID0+IHtcclxuICBjb25zdCBnZXRGb2N1c2FibGVDb250ZXh0ID0gKGVsKSA9PiB7XHJcbiAgICBjb25zdCB7IGNhbGVuZGFyRWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuICAgIGNvbnN0IGZvY3VzYWJsZUVsZW1lbnRzID0gc2VsZWN0KGZvY3VzYWJsZSwgY2FsZW5kYXJFbCk7XHJcblxyXG4gICAgY29uc3QgZmlyc3RUYWJJbmRleCA9IDA7XHJcbiAgICBjb25zdCBsYXN0VGFiSW5kZXggPSBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxO1xyXG4gICAgY29uc3QgZmlyc3RUYWJTdG9wID0gZm9jdXNhYmxlRWxlbWVudHNbZmlyc3RUYWJJbmRleF07XHJcbiAgICBjb25zdCBsYXN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzW2xhc3RUYWJJbmRleF07XHJcbiAgICBjb25zdCBmb2N1c0luZGV4ID0gZm9jdXNhYmxlRWxlbWVudHMuaW5kZXhPZihhY3RpdmVFbGVtZW50KCkpO1xyXG5cclxuICAgIGNvbnN0IGlzTGFzdFRhYiA9IGZvY3VzSW5kZXggPT09IGxhc3RUYWJJbmRleDtcclxuICAgIGNvbnN0IGlzRmlyc3RUYWIgPSBmb2N1c0luZGV4ID09PSBmaXJzdFRhYkluZGV4O1xyXG4gICAgY29uc3QgaXNOb3RGb3VuZCA9IGZvY3VzSW5kZXggPT09IC0xO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGZvY3VzYWJsZUVsZW1lbnRzLFxyXG4gICAgICBpc05vdEZvdW5kLFxyXG4gICAgICBmaXJzdFRhYlN0b3AsXHJcbiAgICAgIGlzRmlyc3RUYWIsXHJcbiAgICAgIGxhc3RUYWJTdG9wLFxyXG4gICAgICBpc0xhc3RUYWIsXHJcbiAgICB9O1xyXG4gIH07XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB0YWJBaGVhZChldmVudCkge1xyXG4gICAgICBjb25zdCB7IGZpcnN0VGFiU3RvcCwgaXNMYXN0VGFiLCBpc05vdEZvdW5kIH0gPSBnZXRGb2N1c2FibGVDb250ZXh0KFxyXG4gICAgICAgIGV2ZW50LnRhcmdldFxyXG4gICAgICApO1xyXG5cclxuICAgICAgaWYgKGlzTGFzdFRhYiB8fCBpc05vdEZvdW5kKSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBmaXJzdFRhYlN0b3AuZm9jdXMoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHRhYkJhY2soZXZlbnQpIHtcclxuICAgICAgY29uc3QgeyBsYXN0VGFiU3RvcCwgaXNGaXJzdFRhYiwgaXNOb3RGb3VuZCB9ID0gZ2V0Rm9jdXNhYmxlQ29udGV4dChcclxuICAgICAgICBldmVudC50YXJnZXRcclxuICAgICAgKTtcclxuXHJcbiAgICAgIGlmIChpc0ZpcnN0VGFiIHx8IGlzTm90Rm91bmQpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGxhc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfTtcclxufTtcclxuXHJcbmNvbnN0IGRhdGVQaWNrZXJUYWJFdmVudEhhbmRsZXIgPSB0YWJIYW5kbGVyKERBVEVfUElDS0VSX0ZPQ1VTQUJMRSk7XHJcbmNvbnN0IG1vbnRoUGlja2VyVGFiRXZlbnRIYW5kbGVyID0gdGFiSGFuZGxlcihNT05USF9QSUNLRVJfRk9DVVNBQkxFKTtcclxuY29uc3QgeWVhclBpY2tlclRhYkV2ZW50SGFuZGxlciA9IHRhYkhhbmRsZXIoWUVBUl9QSUNLRVJfRk9DVVNBQkxFKTtcclxuXHJcbi8vICNlbmRyZWdpb24gRm9jdXMgSGFuZGxpbmcgRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8vICNyZWdpb24gRGF0ZSBQaWNrZXIgRXZlbnQgRGVsZWdhdGlvbiBSZWdpc3RyYXRpb24gLyBDb21wb25lbnRcclxuXHJcbmNvbnN0IGRhdGVQaWNrZXJFdmVudHMgPSB7XHJcbiAgW0NMSUNLXToge1xyXG4gICAgW0RBVEVfUElDS0VSX0JVVFRPTl0oKSB7XHJcbiAgICAgIHRvZ2dsZUNhbGVuZGFyKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9EQVRFXSgpIHtcclxuICAgICAgc2VsZWN0RGF0ZSh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfTU9OVEhdKCkge1xyXG4gICAgICBzZWxlY3RNb250aCh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfWUVBUl0oKSB7XHJcbiAgICAgIHNlbGVjdFllYXIodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX1BSRVZJT1VTX01PTlRIXSgpIHtcclxuICAgICAgZGlzcGxheVByZXZpb3VzTW9udGgodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX05FWFRfTU9OVEhdKCkge1xyXG4gICAgICBkaXNwbGF5TmV4dE1vbnRoKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSXSgpIHtcclxuICAgICAgZGlzcGxheVByZXZpb3VzWWVhcih0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfTkVYVF9ZRUFSXSgpIHtcclxuICAgICAgZGlzcGxheU5leHRZZWFyKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LXSgpIHtcclxuICAgICAgZGlzcGxheVByZXZpb3VzWWVhckNodW5rKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTktdKCkge1xyXG4gICAgICBkaXNwbGF5TmV4dFllYXJDaHVuayh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfTU9OVEhfU0VMRUNUSU9OXSgpIHtcclxuICAgICAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5TW9udGhTZWxlY3Rpb24odGhpcyk7XHJcbiAgICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRCkuZm9jdXMoKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfWUVBUl9TRUxFQ1RJT05dKCkge1xyXG4gICAgICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlZZWFyU2VsZWN0aW9uKHRoaXMpO1xyXG4gICAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfRk9DVVNFRCkuZm9jdXMoKTtcclxuICAgIH0sXHJcbiAgfSxcclxuICBrZXl1cDoge1xyXG4gICAgW0RBVEVfUElDS0VSX0NBTEVOREFSXShldmVudCkge1xyXG4gICAgICBjb25zdCBrZXlkb3duID0gdGhpcy5kYXRhc2V0LmtleWRvd25LZXlDb2RlO1xyXG4gICAgICBpZiAoYCR7ZXZlbnQua2V5Q29kZX1gICE9PSBrZXlkb3duKSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG4gIGtleWRvd246IHtcclxuICAgIFtEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVF0oZXZlbnQpIHtcclxuICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IEVOVEVSX0tFWUNPREUpIHtcclxuICAgICAgICB2YWxpZGF0ZURhdGVJbnB1dCh0aGlzKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9EQVRFXToga2V5bWFwKHtcclxuICAgICAgVXA6IGhhbmRsZVVwRnJvbURhdGUsXHJcbiAgICAgIEFycm93VXA6IGhhbmRsZVVwRnJvbURhdGUsXHJcbiAgICAgIERvd246IGhhbmRsZURvd25Gcm9tRGF0ZSxcclxuICAgICAgQXJyb3dEb3duOiBoYW5kbGVEb3duRnJvbURhdGUsXHJcbiAgICAgIExlZnQ6IGhhbmRsZUxlZnRGcm9tRGF0ZSxcclxuICAgICAgQXJyb3dMZWZ0OiBoYW5kbGVMZWZ0RnJvbURhdGUsXHJcbiAgICAgIFJpZ2h0OiBoYW5kbGVSaWdodEZyb21EYXRlLFxyXG4gICAgICBBcnJvd1JpZ2h0OiBoYW5kbGVSaWdodEZyb21EYXRlLFxyXG4gICAgICBIb21lOiBoYW5kbGVIb21lRnJvbURhdGUsXHJcbiAgICAgIEVuZDogaGFuZGxlRW5kRnJvbURhdGUsXHJcbiAgICAgIFBhZ2VEb3duOiBoYW5kbGVQYWdlRG93bkZyb21EYXRlLFxyXG4gICAgICBQYWdlVXA6IGhhbmRsZVBhZ2VVcEZyb21EYXRlLFxyXG4gICAgICBcIlNoaWZ0K1BhZ2VEb3duXCI6IGhhbmRsZVNoaWZ0UGFnZURvd25Gcm9tRGF0ZSxcclxuICAgICAgXCJTaGlmdCtQYWdlVXBcIjogaGFuZGxlU2hpZnRQYWdlVXBGcm9tRGF0ZSxcclxuICAgIH0pLFxyXG4gICAgW0NBTEVOREFSX0RBVEVfUElDS0VSXToga2V5bWFwKHtcclxuICAgICAgVGFiOiBkYXRlUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkFoZWFkLFxyXG4gICAgICBcIlNoaWZ0K1RhYlwiOiBkYXRlUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkJhY2ssXHJcbiAgICB9KSxcclxuICAgIFtDQUxFTkRBUl9NT05USF06IGtleW1hcCh7XHJcbiAgICAgIFVwOiBoYW5kbGVVcEZyb21Nb250aCxcclxuICAgICAgQXJyb3dVcDogaGFuZGxlVXBGcm9tTW9udGgsXHJcbiAgICAgIERvd246IGhhbmRsZURvd25Gcm9tTW9udGgsXHJcbiAgICAgIEFycm93RG93bjogaGFuZGxlRG93bkZyb21Nb250aCxcclxuICAgICAgTGVmdDogaGFuZGxlTGVmdEZyb21Nb250aCxcclxuICAgICAgQXJyb3dMZWZ0OiBoYW5kbGVMZWZ0RnJvbU1vbnRoLFxyXG4gICAgICBSaWdodDogaGFuZGxlUmlnaHRGcm9tTW9udGgsXHJcbiAgICAgIEFycm93UmlnaHQ6IGhhbmRsZVJpZ2h0RnJvbU1vbnRoLFxyXG4gICAgICBIb21lOiBoYW5kbGVIb21lRnJvbU1vbnRoLFxyXG4gICAgICBFbmQ6IGhhbmRsZUVuZEZyb21Nb250aCxcclxuICAgICAgUGFnZURvd246IGhhbmRsZVBhZ2VEb3duRnJvbU1vbnRoLFxyXG4gICAgICBQYWdlVXA6IGhhbmRsZVBhZ2VVcEZyb21Nb250aCxcclxuICAgIH0pLFxyXG4gICAgW0NBTEVOREFSX01PTlRIX1BJQ0tFUl06IGtleW1hcCh7XHJcbiAgICAgIFRhYjogbW9udGhQaWNrZXJUYWJFdmVudEhhbmRsZXIudGFiQWhlYWQsXHJcbiAgICAgIFwiU2hpZnQrVGFiXCI6IG1vbnRoUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkJhY2ssXHJcbiAgICB9KSxcclxuICAgIFtDQUxFTkRBUl9ZRUFSXToga2V5bWFwKHtcclxuICAgICAgVXA6IGhhbmRsZVVwRnJvbVllYXIsXHJcbiAgICAgIEFycm93VXA6IGhhbmRsZVVwRnJvbVllYXIsXHJcbiAgICAgIERvd246IGhhbmRsZURvd25Gcm9tWWVhcixcclxuICAgICAgQXJyb3dEb3duOiBoYW5kbGVEb3duRnJvbVllYXIsXHJcbiAgICAgIExlZnQ6IGhhbmRsZUxlZnRGcm9tWWVhcixcclxuICAgICAgQXJyb3dMZWZ0OiBoYW5kbGVMZWZ0RnJvbVllYXIsXHJcbiAgICAgIFJpZ2h0OiBoYW5kbGVSaWdodEZyb21ZZWFyLFxyXG4gICAgICBBcnJvd1JpZ2h0OiBoYW5kbGVSaWdodEZyb21ZZWFyLFxyXG4gICAgICBIb21lOiBoYW5kbGVIb21lRnJvbVllYXIsXHJcbiAgICAgIEVuZDogaGFuZGxlRW5kRnJvbVllYXIsXHJcbiAgICAgIFBhZ2VEb3duOiBoYW5kbGVQYWdlRG93bkZyb21ZZWFyLFxyXG4gICAgICBQYWdlVXA6IGhhbmRsZVBhZ2VVcEZyb21ZZWFyLFxyXG4gICAgfSksXHJcbiAgICBbQ0FMRU5EQVJfWUVBUl9QSUNLRVJdOiBrZXltYXAoe1xyXG4gICAgICBUYWI6IHllYXJQaWNrZXJUYWJFdmVudEhhbmRsZXIudGFiQWhlYWQsXHJcbiAgICAgIFwiU2hpZnQrVGFiXCI6IHllYXJQaWNrZXJUYWJFdmVudEhhbmRsZXIudGFiQmFjayxcclxuICAgIH0pLFxyXG4gICAgW0RBVEVfUElDS0VSX0NBTEVOREFSXShldmVudCkge1xyXG4gICAgICB0aGlzLmRhdGFzZXQua2V5ZG93bktleUNvZGUgPSBldmVudC5rZXlDb2RlO1xyXG4gICAgfSxcclxuICAgIFtEQVRFX1BJQ0tFUl0oZXZlbnQpIHtcclxuICAgICAgY29uc3Qga2V5TWFwID0ga2V5bWFwKHtcclxuICAgICAgICBFc2NhcGU6IGhhbmRsZUVzY2FwZUZyb21DYWxlbmRhcixcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBrZXlNYXAoZXZlbnQpO1xyXG4gICAgfSxcclxuICB9LFxyXG4gIGZvY3Vzb3V0OiB7XHJcbiAgICBbREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRdKCkge1xyXG4gICAgICB2YWxpZGF0ZURhdGVJbnB1dCh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbREFURV9QSUNLRVJdKGV2ZW50KSB7XHJcbiAgICAgIGlmICghdGhpcy5jb250YWlucyhldmVudC5yZWxhdGVkVGFyZ2V0KSkge1xyXG4gICAgICAgIGhpZGVDYWxlbmRhcih0aGlzKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG4gIGlucHV0OiB7XHJcbiAgICBbREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRdKCkge1xyXG4gICAgICByZWNvbmNpbGVJbnB1dFZhbHVlcyh0aGlzKTtcclxuICAgICAgdXBkYXRlQ2FsZW5kYXJJZlZpc2libGUodGhpcyk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn07XHJcblxyXG5pZiAoIWlzSW9zRGV2aWNlKCkpIHtcclxuICBkYXRlUGlja2VyRXZlbnRzLm1vdXNlbW92ZSA9IHtcclxuICAgIFtDQUxFTkRBUl9EQVRFX0NVUlJFTlRfTU9OVEhdKCkge1xyXG4gICAgICBoYW5kbGVNb3VzZW1vdmVGcm9tRGF0ZSh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfTU9OVEhdKCkge1xyXG4gICAgICBoYW5kbGVNb3VzZW1vdmVGcm9tTW9udGgodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX1lFQVJdKCkge1xyXG4gICAgICBoYW5kbGVNb3VzZW1vdmVGcm9tWWVhcih0aGlzKTtcclxuICAgIH0sXHJcbiAgfTtcclxufVxyXG5cclxuY29uc3QgZGF0ZVBpY2tlciA9IGJlaGF2aW9yKGRhdGVQaWNrZXJFdmVudHMsIHtcclxuICBpbml0KHJvb3QpIHtcclxuICAgIHNlbGVjdChEQVRFX1BJQ0tFUiwgcm9vdCkuZm9yRWFjaCgoZGF0ZVBpY2tlckVsKSA9PiB7XHJcbiAgICAgIGlmKCFkYXRlUGlja2VyRWwuY2xhc3NMaXN0LmNvbnRhaW5zKERBVEVfUElDS0VSX0lOSVRJQUxJWkVEX0NMQVNTKSl7XHJcbiAgICAgICAgZW5oYW5jZURhdGVQaWNrZXIoZGF0ZVBpY2tlckVsKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSxcclxuICBzZXRMYW5ndWFnZShzdHJpbmdzKSB7XHJcbiAgICB0ZXh0ID0gc3RyaW5ncztcclxuICAgIE1PTlRIX0xBQkVMUyA9IFtcclxuICAgICAgdGV4dC5qYW51YXJ5LFxyXG4gICAgICB0ZXh0LmZlYnJ1YXJ5LFxyXG4gICAgICB0ZXh0Lm1hcmNoLFxyXG4gICAgICB0ZXh0LmFwcmlsLFxyXG4gICAgICB0ZXh0Lm1heSxcclxuICAgICAgdGV4dC5qdW5lLFxyXG4gICAgICB0ZXh0Lmp1bHksXHJcbiAgICAgIHRleHQuYXVndXN0LFxyXG4gICAgICB0ZXh0LnNlcHRlbWJlcixcclxuICAgICAgdGV4dC5vY3RvYmVyLFxyXG4gICAgICB0ZXh0Lm5vdmVtYmVyLFxyXG4gICAgICB0ZXh0LmRlY2VtYmVyXHJcbiAgICBdO1xyXG4gICAgREFZX09GX1dFRUtfTEFCRUxTID0gW1xyXG4gICAgICB0ZXh0Lm1vbmRheSxcclxuICAgICAgdGV4dC50dWVzZGF5LFxyXG4gICAgICB0ZXh0LndlZG5lc2RheSxcclxuICAgICAgdGV4dC50aHVyc2RheSxcclxuICAgICAgdGV4dC5mcmlkYXksXHJcbiAgICAgIHRleHQuc2F0dXJkYXksXHJcbiAgICAgIHRleHQuc3VuZGF5XHJcbiAgICBdO1xyXG4gIH0sXHJcbiAgZ2V0RGF0ZVBpY2tlckNvbnRleHQsXHJcbiAgZGlzYWJsZSxcclxuICBlbmFibGUsXHJcbiAgaXNEYXRlSW5wdXRJbnZhbGlkLFxyXG4gIHNldENhbGVuZGFyVmFsdWUsXHJcbiAgdmFsaWRhdGVEYXRlSW5wdXQsXHJcbiAgcmVuZGVyQ2FsZW5kYXIsXHJcbiAgdXBkYXRlQ2FsZW5kYXJJZlZpc2libGVcclxufSk7XHJcblxyXG4vLyAjZW5kcmVnaW9uIERhdGUgUGlja2VyIEV2ZW50IERlbGVnYXRpb24gUmVnaXN0cmF0aW9uIC8gQ29tcG9uZW50XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRhdGVQaWNrZXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuaW1wb3J0IERyb3Bkb3duIGZyb20gJy4vZHJvcGRvd24nO1xyXG5pbXBvcnQgJy4uL3BvbHlmaWxscy9GdW5jdGlvbi9wcm90b3R5cGUvYmluZCc7XHJcblxyXG4vKipcclxuICogQWRkIGZ1bmN0aW9uYWxpdHkgdG8gc29ydGluZyB2YXJpYW50IG9mIE92ZXJmbG93IG1lbnUgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lciAub3ZlcmZsb3ctbWVudSBlbGVtZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBEcm9wZG93blNvcnQgKGNvbnRhaW5lcil7XHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgIHRoaXMuYnV0dG9uID0gY29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2J1dHRvbi1vdmVyZmxvdy1tZW51JylbMF07XHJcblxyXG4gICAgLy8gaWYgbm8gdmFsdWUgaXMgc2VsZWN0ZWQsIGNob29zZSBmaXJzdCBvcHRpb25cclxuICAgIGlmKCF0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcub3ZlcmZsb3ctbGlzdCBsaSBidXR0b25bYXJpYS1jdXJyZW50PVwidHJ1ZVwiXScpKXtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcub3ZlcmZsb3ctbGlzdCBsaSBidXR0b24nKVswXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtY3VycmVudCcsIFwidHJ1ZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVwZGF0ZVNlbGVjdGVkVmFsdWUoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZCBjbGljayBldmVudHMgb24gb3ZlcmZsb3cgbWVudSBhbmQgb3B0aW9ucyBpbiBtZW51XHJcbiAqL1xyXG5Ecm9wZG93blNvcnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5vdmVyZmxvd01lbnUgPSBuZXcgRHJvcGRvd24odGhpcy5idXR0b24pLmluaXQoKTtcclxuXHJcbiAgICBsZXQgc29ydGluZ09wdGlvbnMgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcub3ZlcmZsb3ctbGlzdCBsaSBidXR0b24nKTtcclxuICAgIGZvcihsZXQgcyA9IDA7IHMgPCBzb3J0aW5nT3B0aW9ucy5sZW5ndGg7IHMrKyl7XHJcbiAgICAgICAgbGV0IG9wdGlvbiA9IHNvcnRpbmdPcHRpb25zW3NdO1xyXG4gICAgICAgIG9wdGlvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25PcHRpb25DbGljay5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZSBidXR0b24gdGV4dCB0byBzZWxlY3RlZCB2YWx1ZVxyXG4gKi9cclxuRHJvcGRvd25Tb3J0LnByb3RvdHlwZS51cGRhdGVTZWxlY3RlZFZhbHVlID0gZnVuY3Rpb24oKXtcclxuICAgIGxldCBzZWxlY3RlZEl0ZW0gPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcub3ZlcmZsb3ctbGlzdCBsaSBidXR0b25bYXJpYS1jdXJyZW50PVwidHJ1ZVwiXScpO1xyXG4gICAgdGhpcy5jb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYnV0dG9uLW92ZXJmbG93LW1lbnUnKVswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzZWxlY3RlZC12YWx1ZScpWzBdLmlubmVyVGV4dCA9IHNlbGVjdGVkSXRlbS5pbm5lclRleHQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUcmlnZ2VycyB3aGVuIGNob29zaW5nIG9wdGlvbiBpbiBtZW51XHJcbiAqIEBwYXJhbSB7UG9pbnRlckV2ZW50fSBlXHJcbiAqL1xyXG5Ecm9wZG93blNvcnQucHJvdG90eXBlLm9uT3B0aW9uQ2xpY2sgPSBmdW5jdGlvbihlKXtcclxuICAgIGxldCBsaSA9IGUudGFyZ2V0LnBhcmVudE5vZGU7XHJcbiAgICBsaS5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoJ2xpIGJ1dHRvblthcmlhLWN1cnJlbnQ9XCJ0cnVlXCJdJykucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWN1cnJlbnQnKTtcclxuICAgIGxpLnF1ZXJ5U2VsZWN0b3JBbGwoJy5vdmVyZmxvdy1saXN0IGxpIGJ1dHRvbicpWzBdLnNldEF0dHJpYnV0ZSgnYXJpYS1jdXJyZW50JywgJ3RydWUnKTtcclxuXHJcbiAgICBsZXQgYnV0dG9uID0gbGkucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYnV0dG9uLW92ZXJmbG93LW1lbnUnKVswXTtcclxuICAgIGxldCBldmVudFNlbGVjdGVkID0gbmV3IEV2ZW50KCdmZHMuZHJvcGRvd24uc2VsZWN0ZWQnKTtcclxuICAgIGV2ZW50U2VsZWN0ZWQuZGV0YWlsID0gdGhpcy50YXJnZXQ7XHJcbiAgICBidXR0b24uZGlzcGF0Y2hFdmVudChldmVudFNlbGVjdGVkKTtcclxuICAgIHRoaXMudXBkYXRlU2VsZWN0ZWRWYWx1ZSgpO1xyXG5cclxuICAgIC8vIGhpZGUgbWVudVxyXG4gICAgbGV0IG92ZXJmbG93TWVudSA9IG5ldyBEcm9wZG93bihidXR0b24pO1xyXG4gICAgb3ZlcmZsb3dNZW51LmhpZGUoKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRHJvcGRvd25Tb3J0O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IGJyZWFrcG9pbnRzID0gcmVxdWlyZSgnLi4vdXRpbHMvYnJlYWtwb2ludHMnKTtcclxuY29uc3QgQlVUVE9OID0gJy5idXR0b24tb3ZlcmZsb3ctbWVudSc7XHJcbmNvbnN0IGpzRHJvcGRvd25Db2xsYXBzZU1vZGlmaWVyID0gJ2pzLWRyb3Bkb3duLS1yZXNwb25zaXZlLWNvbGxhcHNlJzsgLy9vcHRpb246IG1ha2UgZHJvcGRvd24gYmVoYXZlIGFzIHRoZSBjb2xsYXBzZSBjb21wb25lbnQgd2hlbiBvbiBzbWFsbCBzY3JlZW5zICh1c2VkIGJ5IHN1Ym1lbnVzIGluIHRoZSBoZWFkZXIgYW5kIHN0ZXAtZHJvcGRvd24pLlxyXG5jb25zdCBUQVJHRVQgPSAnZGF0YS1qcy10YXJnZXQnO1xyXG5cclxuLyoqXHJcbiAqIEFkZCBmdW5jdGlvbmFsaXR5IHRvIG92ZXJmbG93IG1lbnUgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGJ1dHRvbkVsZW1lbnQgT3ZlcmZsb3cgbWVudSBidXR0b25cclxuICovXHJcbmZ1bmN0aW9uIERyb3Bkb3duIChidXR0b25FbGVtZW50KSB7XHJcbiAgdGhpcy5idXR0b25FbGVtZW50ID0gYnV0dG9uRWxlbWVudDtcclxuICB0aGlzLnRhcmdldEVsID0gbnVsbDtcclxuICB0aGlzLnJlc3BvbnNpdmVMaXN0Q29sbGFwc2VFbmFibGVkID0gZmFsc2U7XHJcblxyXG4gIGlmKHRoaXMuYnV0dG9uRWxlbWVudCA9PT0gbnVsbCB8fHRoaXMuYnV0dG9uRWxlbWVudCA9PT0gdW5kZWZpbmVkKXtcclxuICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgYnV0dG9uIGZvciBvdmVyZmxvdyBtZW51IGNvbXBvbmVudC5gKTtcclxuICB9XHJcbiAgbGV0IHRhcmdldEF0dHIgPSB0aGlzLmJ1dHRvbkVsZW1lbnQuZ2V0QXR0cmlidXRlKFRBUkdFVCk7XHJcbiAgaWYodGFyZ2V0QXR0ciA9PT0gbnVsbCB8fCB0YXJnZXRBdHRyID09PSB1bmRlZmluZWQpe1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdBdHRyaWJ1dGUgY291bGQgbm90IGJlIGZvdW5kIG9uIG92ZXJmbG93IG1lbnUgY29tcG9uZW50OiAnK1RBUkdFVCk7XHJcbiAgfVxyXG4gIGxldCB0YXJnZXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldEF0dHIucmVwbGFjZSgnIycsICcnKSk7XHJcbiAgaWYodGFyZ2V0RWwgPT09IG51bGwgfHwgdGFyZ2V0RWwgPT09IHVuZGVmaW5lZCl7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhbmVsIGZvciBvdmVyZmxvdyBtZW51IGNvbXBvbmVudCBjb3VsZCBub3QgYmUgZm91bmQuJyk7XHJcbiAgfVxyXG4gIHRoaXMudGFyZ2V0RWwgPSB0YXJnZXRFbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCBjbGljayBldmVudHNcclxuICovXHJcbkRyb3Bkb3duLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCl7XHJcbiAgaWYodGhpcy5idXR0b25FbGVtZW50ICE9PSBudWxsICYmIHRoaXMuYnV0dG9uRWxlbWVudCAhPT0gdW5kZWZpbmVkICYmIHRoaXMudGFyZ2V0RWwgIT09IG51bGwgJiYgdGhpcy50YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcclxuXHJcbiAgICBpZih0aGlzLmJ1dHRvbkVsZW1lbnQucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLW1kLW5vLXJlc3BvbnNpdmUnKSB8fCB0aGlzLmJ1dHRvbkVsZW1lbnQucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLWxnLW5vLXJlc3BvbnNpdmUnKSl7XHJcbiAgICAgIHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vQ2xpY2tlZCBvdXRzaWRlIGRyb3Bkb3duIC0+IGNsb3NlIGl0XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWyAwIF0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvdXRzaWRlQ2xvc2UpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVsgMCBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3V0c2lkZUNsb3NlKTtcclxuICAgIC8vQ2xpY2tlZCBvbiBkcm9wZG93biBvcGVuIGJ1dHRvbiAtLT4gdG9nZ2xlIGl0XHJcbiAgICB0aGlzLmJ1dHRvbkVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVEcm9wZG93bik7XHJcbiAgICB0aGlzLmJ1dHRvbkVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVEcm9wZG93bik7XHJcbiAgICBsZXQgJG1vZHVsZSA9IHRoaXM7XHJcbiAgICAvLyBzZXQgYXJpYS1oaWRkZW4gY29ycmVjdGx5IGZvciBzY3JlZW5yZWFkZXJzIChUcmluZ3VpZGUgcmVzcG9uc2l2ZSlcclxuICAgIGlmKHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQpIHtcclxuICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmJ1dHRvbkVsZW1lbnQ7XHJcbiAgICAgIGlmICh3aW5kb3cuSW50ZXJzZWN0aW9uT2JzZXJ2ZXIpIHtcclxuICAgICAgICAvLyB0cmlnZ2VyIGV2ZW50IHdoZW4gYnV0dG9uIGNoYW5nZXMgdmlzaWJpbGl0eVxyXG4gICAgICAgIGxldCBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihmdW5jdGlvbiAoZW50cmllcykge1xyXG4gICAgICAgICAgLy8gYnV0dG9uIGlzIHZpc2libGVcclxuICAgICAgICAgIGlmIChlbnRyaWVzWyAwIF0uaW50ZXJzZWN0aW9uUmF0aW8pIHtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICdmYWxzZScpIHtcclxuICAgICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBidXR0b24gaXMgbm90IHZpc2libGVcclxuICAgICAgICAgICAgaWYgKCRtb2R1bGUudGFyZ2V0RWwuZ2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicpID09PSAndHJ1ZScpIHtcclxuICAgICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgIHJvb3Q6IGRvY3VtZW50LmJvZHlcclxuICAgICAgICB9KTtcclxuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIElFOiBJbnRlcnNlY3Rpb25PYnNlcnZlciBpcyBub3Qgc3VwcG9ydGVkLCBzbyB3ZSBsaXN0ZW4gZm9yIHdpbmRvdyByZXNpemUgYW5kIGdyaWQgYnJlYWtwb2ludCBpbnN0ZWFkXHJcbiAgICAgICAgaWYgKGRvUmVzcG9uc2l2ZUNvbGxhcHNlKCRtb2R1bGUudHJpZ2dlckVsKSkge1xyXG4gICAgICAgICAgLy8gc21hbGwgc2NyZWVuXHJcbiAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ2ZhbHNlJykge1xyXG4gICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gTGFyZ2Ugc2NyZWVuXHJcbiAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGlmIChkb1Jlc3BvbnNpdmVDb2xsYXBzZSgkbW9kdWxlLnRyaWdnZXJFbCkpIHtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICdmYWxzZScpIHtcclxuICAgICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICB9IGVsc2V7XHJcbiAgICAgICAgICAgICAgJG1vZHVsZS50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIGNsb3NlT25Fc2NhcGUpO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBjbG9zZU9uRXNjYXBlKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBIaWRlIG92ZXJmbG93IG1lbnVcclxuICovXHJcbkRyb3Bkb3duLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24oKXtcclxuICB0b2dnbGUodGhpcy5idXR0b25FbGVtZW50KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNob3cgb3ZlcmZsb3cgbWVudVxyXG4gKi9cclxuRHJvcGRvd24ucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbigpe1xyXG4gIHRvZ2dsZSh0aGlzLmJ1dHRvbkVsZW1lbnQpO1xyXG59XHJcblxyXG5sZXQgY2xvc2VPbkVzY2FwZSA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICB2YXIga2V5ID0gZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZTtcclxuICBpZiAoa2V5ID09PSAyNykge1xyXG4gICAgY2xvc2VBbGwoZXZlbnQpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXQgYW4gQXJyYXkgb2YgYnV0dG9uIGVsZW1lbnRzIGJlbG9uZ2luZyBkaXJlY3RseSB0byB0aGUgZ2l2ZW5cclxuICogYWNjb3JkaW9uIGVsZW1lbnQuXHJcbiAqIEBwYXJhbSBwYXJlbnQgYWNjb3JkaW9uIGVsZW1lbnRcclxuICogQHJldHVybnMge05vZGVMaXN0T2Y8U1ZHRWxlbWVudFRhZ05hbWVNYXBbW3N0cmluZ11dPiB8IE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnRUYWdOYW1lTWFwW1tzdHJpbmddXT4gfCBOb2RlTGlzdE9mPEVsZW1lbnQ+fVxyXG4gKi9cclxubGV0IGdldEJ1dHRvbnMgPSBmdW5jdGlvbiAocGFyZW50KSB7XHJcbiAgcmV0dXJuIHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTik7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2xvc2UgYWxsIG92ZXJmbG93IG1lbnVzXHJcbiAqIEBwYXJhbSB7ZXZlbnR9IGV2ZW50IGRlZmF1bHQgaXMgbnVsbFxyXG4gKi9cclxubGV0IGNsb3NlQWxsID0gZnVuY3Rpb24gKGV2ZW50ID0gbnVsbCl7XHJcbiAgbGV0IGNoYW5nZWQgPSBmYWxzZTtcclxuICBjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xyXG5cclxuICBsZXQgb3ZlcmZsb3dNZW51RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdvdmVyZmxvdy1tZW51Jyk7XHJcbiAgZm9yIChsZXQgb2kgPSAwOyBvaSA8IG92ZXJmbG93TWVudUVsLmxlbmd0aDsgb2krKykge1xyXG4gICAgbGV0IGN1cnJlbnRPdmVyZmxvd01lbnVFTCA9IG92ZXJmbG93TWVudUVsWyBvaSBdO1xyXG4gICAgbGV0IHRyaWdnZXJFbCA9IGN1cnJlbnRPdmVyZmxvd01lbnVFTC5xdWVyeVNlbGVjdG9yKEJVVFRPTisnW2FyaWEtZXhwYW5kZWQ9XCJ0cnVlXCJdJyk7XHJcbiAgICBpZih0cmlnZ2VyRWwgIT09IG51bGwpe1xyXG4gICAgICBjaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgbGV0IHRhcmdldEVsID0gY3VycmVudE92ZXJmbG93TWVudUVMLnF1ZXJ5U2VsZWN0b3IoJyMnK3RyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoVEFSR0VUKS5yZXBsYWNlKCcjJywgJycpKTtcclxuXHJcbiAgICAgICAgaWYgKHRhcmdldEVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgaWYoZG9SZXNwb25zaXZlQ29sbGFwc2UodHJpZ2dlckVsKSl7XHJcbiAgICAgICAgICAgIGlmKHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5kcm9wZG93bi5jbG9zZScpO1xyXG4gICAgICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmKGNoYW5nZWQgJiYgZXZlbnQgIT09IG51bGwpe1xyXG4gICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgfVxyXG59O1xyXG5sZXQgb2Zmc2V0ID0gZnVuY3Rpb24gKGVsKSB7XHJcbiAgbGV0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcclxuICAgIHNjcm9sbExlZnQgPSB3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQsXHJcbiAgICBzY3JvbGxUb3AgPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcclxuICByZXR1cm4geyB0b3A6IHJlY3QudG9wICsgc2Nyb2xsVG9wLCBsZWZ0OiByZWN0LmxlZnQgKyBzY3JvbGxMZWZ0IH07XHJcbn07XHJcblxyXG5sZXQgdG9nZ2xlRHJvcGRvd24gPSBmdW5jdGlvbiAoZXZlbnQsIGZvcmNlQ2xvc2UgPSBmYWxzZSkge1xyXG4gIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gIHRvZ2dsZSh0aGlzLCBmb3JjZUNsb3NlKTtcclxuXHJcbn07XHJcblxyXG5sZXQgdG9nZ2xlID0gZnVuY3Rpb24oYnV0dG9uLCBmb3JjZUNsb3NlID0gZmFsc2Upe1xyXG4gIGxldCB0cmlnZ2VyRWwgPSBidXR0b247XHJcbiAgbGV0IHRhcmdldEVsID0gbnVsbDtcclxuICBpZih0cmlnZ2VyRWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgbGV0IHRhcmdldEF0dHIgPSB0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKFRBUkdFVCk7XHJcbiAgICBpZih0YXJnZXRBdHRyICE9PSBudWxsICYmIHRhcmdldEF0dHIgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIHRhcmdldEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0QXR0ci5yZXBsYWNlKCcjJywgJycpKTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgLy9jaGFuZ2Ugc3RhdGVcclxuXHJcbiAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gbnVsbDtcclxuICAgIHRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gbnVsbDtcclxuXHJcbiAgICBpZih0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICd0cnVlJyB8fCBmb3JjZUNsb3NlKXtcclxuICAgICAgLy9jbG9zZVxyXG4gICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTsgICAgICBcclxuICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5kcm9wZG93bi5jbG9zZScpO1xyXG4gICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgIH1lbHNle1xyXG4gICAgICBcclxuICAgICAgaWYoIWRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2JpbGVfbmF2LWFjdGl2ZScpKXtcclxuICAgICAgICBjbG9zZUFsbCgpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vb3BlblxyXG4gICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcclxuICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LnJlbW92ZSgnY29sbGFwc2VkJyk7XHJcbiAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgbGV0IGV2ZW50T3BlbiA9IG5ldyBFdmVudCgnZmRzLmRyb3Bkb3duLm9wZW4nKTtcclxuICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQoZXZlbnRPcGVuKTtcclxuICAgICAgbGV0IHRhcmdldE9mZnNldCA9IG9mZnNldCh0YXJnZXRFbCk7XHJcblxyXG4gICAgICBpZih0YXJnZXRPZmZzZXQubGVmdCA8IDApe1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLmxlZnQgPSAnMHB4JztcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5yaWdodCA9ICdhdXRvJztcclxuICAgICAgfVxyXG4gICAgICBsZXQgcmlnaHQgPSB0YXJnZXRPZmZzZXQubGVmdCArIHRhcmdldEVsLm9mZnNldFdpZHRoO1xyXG4gICAgICBpZihyaWdodCA+IHdpbmRvdy5pbm5lcldpZHRoKXtcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJ2F1dG8nO1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gJzBweCc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBvZmZzZXRBZ2FpbiA9IG9mZnNldCh0YXJnZXRFbCk7XHJcblxyXG4gICAgICBpZihvZmZzZXRBZ2Fpbi5sZWZ0IDwgMCl7XHJcblxyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLmxlZnQgPSAnMHB4JztcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5yaWdodCA9ICdhdXRvJztcclxuICAgICAgfVxyXG4gICAgICByaWdodCA9IG9mZnNldEFnYWluLmxlZnQgKyB0YXJnZXRFbC5vZmZzZXRXaWR0aDtcclxuICAgICAgaWYocmlnaHQgPiB3aW5kb3cuaW5uZXJXaWR0aCl7XHJcblxyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLmxlZnQgPSAnYXV0byc7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUucmlnaHQgPSAnMHB4JztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICB9XHJcbn1cclxuXHJcbmxldCBoYXNQYXJlbnQgPSBmdW5jdGlvbiAoY2hpbGQsIHBhcmVudFRhZ05hbWUpe1xyXG4gIGlmKGNoaWxkLnBhcmVudE5vZGUudGFnTmFtZSA9PT0gcGFyZW50VGFnTmFtZSl7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9IGVsc2UgaWYocGFyZW50VGFnTmFtZSAhPT0gJ0JPRFknICYmIGNoaWxkLnBhcmVudE5vZGUudGFnTmFtZSAhPT0gJ0JPRFknKXtcclxuICAgIHJldHVybiBoYXNQYXJlbnQoY2hpbGQucGFyZW50Tm9kZSwgcGFyZW50VGFnTmFtZSk7XHJcbiAgfWVsc2V7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59O1xyXG5cclxubGV0IG91dHNpZGVDbG9zZSA9IGZ1bmN0aW9uIChldnQpe1xyXG4gIGlmKCFkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmNsYXNzTGlzdC5jb250YWlucygnbW9iaWxlX25hdi1hY3RpdmUnKSl7XHJcbiAgICBpZihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Lm1vYmlsZV9uYXYtYWN0aXZlJykgPT09IG51bGwgJiYgIWV2dC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdidXR0b24tbWVudS1jbG9zZScpKSB7XHJcbiAgICAgIGxldCBvcGVuRHJvcGRvd25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChCVVRUT04rJ1thcmlhLWV4cGFuZGVkPXRydWVdJyk7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3BlbkRyb3Bkb3ducy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCB0cmlnZ2VyRWwgPSBvcGVuRHJvcGRvd25zW2ldO1xyXG4gICAgICAgIGxldCB0YXJnZXRFbCA9IG51bGw7XHJcbiAgICAgICAgbGV0IHRhcmdldEF0dHIgPSB0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKFRBUkdFVCk7XHJcbiAgICAgICAgaWYgKHRhcmdldEF0dHIgIT09IG51bGwgJiYgdGFyZ2V0QXR0ciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBpZih0YXJnZXRBdHRyLmluZGV4T2YoJyMnKSAhPT0gLTEpe1xyXG4gICAgICAgICAgICB0YXJnZXRBdHRyID0gdGFyZ2V0QXR0ci5yZXBsYWNlKCcjJywgJycpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGFyZ2V0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRBdHRyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRvUmVzcG9uc2l2ZUNvbGxhcHNlKHRyaWdnZXJFbCkgfHwgKGhhc1BhcmVudCh0cmlnZ2VyRWwsICdIRUFERVInKSAmJiAhZXZ0LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJsYXknKSkpIHtcclxuICAgICAgICAgIC8vY2xvc2VzIGRyb3Bkb3duIHdoZW4gY2xpY2tlZCBvdXRzaWRlXHJcbiAgICAgICAgICBpZiAoZXZ0LnRhcmdldCAhPT0gdHJpZ2dlckVsKSB7XHJcbiAgICAgICAgICAgIC8vY2xpY2tlZCBvdXRzaWRlIHRyaWdnZXIsIGZvcmNlIGNsb3NlXHJcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpOyAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5kcm9wZG93bi5jbG9zZScpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5sZXQgZG9SZXNwb25zaXZlQ29sbGFwc2UgPSBmdW5jdGlvbiAodHJpZ2dlckVsKXtcclxuICBpZighdHJpZ2dlckVsLmNsYXNzTGlzdC5jb250YWlucyhqc0Ryb3Bkb3duQ29sbGFwc2VNb2RpZmllcikpe1xyXG4gICAgLy8gbm90IG5hdiBvdmVyZmxvdyBtZW51XHJcbiAgICBpZih0cmlnZ2VyRWwucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLW1kLW5vLXJlc3BvbnNpdmUnKSB8fCB0cmlnZ2VyRWwucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLWxnLW5vLXJlc3BvbnNpdmUnKSkge1xyXG4gICAgICAvLyB0cmluaW5kaWthdG9yIG92ZXJmbG93IG1lbnVcclxuICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDw9IGdldFRyaW5ndWlkZUJyZWFrcG9pbnQodHJpZ2dlckVsKSkge1xyXG4gICAgICAgIC8vIG92ZXJmbG93IG1lbnUgcMOlIHJlc3BvbnNpdiB0cmluZ3VpZGUgYWt0aXZlcmV0XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZXtcclxuICAgICAgLy8gbm9ybWFsIG92ZXJmbG93IG1lbnVcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG5sZXQgZ2V0VHJpbmd1aWRlQnJlYWtwb2ludCA9IGZ1bmN0aW9uIChidXR0b24pe1xyXG4gIGlmKGJ1dHRvbi5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbWQtbm8tcmVzcG9uc2l2ZScpKXtcclxuICAgIHJldHVybiBicmVha3BvaW50cy5tZDtcclxuICB9XHJcbiAgaWYoYnV0dG9uLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1sZy1uby1yZXNwb25zaXZlJykpe1xyXG4gICAgcmV0dXJuIGJyZWFrcG9pbnRzLmxnO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IERyb3Bkb3duOyIsIid1c2Ugc3RyaWN0JztcclxuLyoqXHJcbiAqIEhhbmRsZSBmb2N1cyBvbiBpbnB1dCBlbGVtZW50cyB1cG9uIGNsaWNraW5nIGxpbmsgaW4gZXJyb3IgbWVzc2FnZVxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IEVycm9yIHN1bW1hcnkgZWxlbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gRXJyb3JTdW1tYXJ5IChlbGVtZW50KSB7XHJcbiAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCBldmVudHMgb24gbGlua3MgaW4gZXJyb3Igc3VtbWFyeVxyXG4gKi9cclxuRXJyb3JTdW1tYXJ5LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gIGlmICghdGhpcy5lbGVtZW50KSB7XHJcbiAgICByZXR1cm5cclxuICB9XHJcbiAgdGhpcy5lbGVtZW50LmZvY3VzKClcclxuXHJcbiAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpKVxyXG59XHJcblxyXG4vKipcclxuKiBDbGljayBldmVudCBoYW5kbGVyXHJcbipcclxuKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ZW50IC0gQ2xpY2sgZXZlbnRcclxuKi9cclxuRXJyb3JTdW1tYXJ5LnByb3RvdHlwZS5oYW5kbGVDbGljayA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gIHZhciB0YXJnZXQgPSBldmVudC50YXJnZXRcclxuICBpZiAodGhpcy5mb2N1c1RhcmdldCh0YXJnZXQpKSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogRm9jdXMgdGhlIHRhcmdldCBlbGVtZW50XHJcbiAqXHJcbiAqIEJ5IGRlZmF1bHQsIHRoZSBicm93c2VyIHdpbGwgc2Nyb2xsIHRoZSB0YXJnZXQgaW50byB2aWV3LiBCZWNhdXNlIG91ciBsYWJlbHNcclxuICogb3IgbGVnZW5kcyBhcHBlYXIgYWJvdmUgdGhlIGlucHV0LCB0aGlzIG1lYW5zIHRoZSB1c2VyIHdpbGwgYmUgcHJlc2VudGVkIHdpdGhcclxuICogYW4gaW5wdXQgd2l0aG91dCBhbnkgY29udGV4dCwgYXMgdGhlIGxhYmVsIG9yIGxlZ2VuZCB3aWxsIGJlIG9mZiB0aGUgdG9wIG9mXHJcbiAqIHRoZSBzY3JlZW4uXHJcbiAqXHJcbiAqIE1hbnVhbGx5IGhhbmRsaW5nIHRoZSBjbGljayBldmVudCwgc2Nyb2xsaW5nIHRoZSBxdWVzdGlvbiBpbnRvIHZpZXcgYW5kIHRoZW5cclxuICogZm9jdXNzaW5nIHRoZSBlbGVtZW50IHNvbHZlcyB0aGlzLlxyXG4gKlxyXG4gKiBUaGlzIGFsc28gcmVzdWx0cyBpbiB0aGUgbGFiZWwgYW5kL29yIGxlZ2VuZCBiZWluZyBhbm5vdW5jZWQgY29ycmVjdGx5IGluXHJcbiAqIE5WREEgKGFzIHRlc3RlZCBpbiAyMDE4LjMuMikgLSB3aXRob3V0IHRoaXMgb25seSB0aGUgZmllbGQgdHlwZSBpcyBhbm5vdW5jZWRcclxuICogKGUuZy4gXCJFZGl0LCBoYXMgYXV0b2NvbXBsZXRlXCIpLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAkdGFyZ2V0IC0gRXZlbnQgdGFyZ2V0XHJcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSB0YXJnZXQgd2FzIGFibGUgdG8gYmUgZm9jdXNzZWRcclxuICovXHJcbkVycm9yU3VtbWFyeS5wcm90b3R5cGUuZm9jdXNUYXJnZXQgPSBmdW5jdGlvbiAoJHRhcmdldCkge1xyXG4gIC8vIElmIHRoZSBlbGVtZW50IHRoYXQgd2FzIGNsaWNrZWQgd2FzIG5vdCBhIGxpbmssIHJldHVybiBlYXJseVxyXG4gIGlmICgkdGFyZ2V0LnRhZ05hbWUgIT09ICdBJyB8fCAkdGFyZ2V0LmhyZWYgPT09IGZhbHNlKSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcblxyXG4gIHZhciBpbnB1dElkID0gdGhpcy5nZXRGcmFnbWVudEZyb21VcmwoJHRhcmdldC5ocmVmKVxyXG4gIHZhciAkaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpbnB1dElkKVxyXG4gIGlmICghJGlucHV0KSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcblxyXG4gIHZhciAkbGVnZW5kT3JMYWJlbCA9IHRoaXMuZ2V0QXNzb2NpYXRlZExlZ2VuZE9yTGFiZWwoJGlucHV0KVxyXG4gIGlmICghJGxlZ2VuZE9yTGFiZWwpIHtcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgLy8gU2Nyb2xsIHRoZSBsZWdlbmQgb3IgbGFiZWwgaW50byB2aWV3ICpiZWZvcmUqIGNhbGxpbmcgZm9jdXMgb24gdGhlIGlucHV0IHRvXHJcbiAgLy8gYXZvaWQgZXh0cmEgc2Nyb2xsaW5nIGluIGJyb3dzZXJzIHRoYXQgZG9uJ3Qgc3VwcG9ydCBgcHJldmVudFNjcm9sbGAgKHdoaWNoXHJcbiAgLy8gYXQgdGltZSBvZiB3cml0aW5nIGlzIG1vc3Qgb2YgdGhlbS4uLilcclxuICAkbGVnZW5kT3JMYWJlbC5zY3JvbGxJbnRvVmlldygpXHJcbiAgJGlucHV0LmZvY3VzKHsgcHJldmVudFNjcm9sbDogdHJ1ZSB9KVxyXG5cclxuICByZXR1cm4gdHJ1ZVxyXG59XHJcblxyXG4vKipcclxuICogR2V0IGZyYWdtZW50IGZyb20gVVJMXHJcbiAqXHJcbiAqIEV4dHJhY3QgdGhlIGZyYWdtZW50IChldmVyeXRoaW5nIGFmdGVyIHRoZSBoYXNoKSBmcm9tIGEgVVJMLCBidXQgbm90IGluY2x1ZGluZ1xyXG4gKiB0aGUgaGFzaC5cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFVSTFxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBGcmFnbWVudCBmcm9tIFVSTCwgd2l0aG91dCB0aGUgaGFzaFxyXG4gKi9cclxuRXJyb3JTdW1tYXJ5LnByb3RvdHlwZS5nZXRGcmFnbWVudEZyb21VcmwgPSBmdW5jdGlvbiAodXJsKSB7XHJcbiAgaWYgKHVybC5pbmRleE9mKCcjJykgPT09IC0xKSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcblxyXG4gIHJldHVybiB1cmwuc3BsaXQoJyMnKS5wb3AoKVxyXG59XHJcblxyXG4vKipcclxuICogR2V0IGFzc29jaWF0ZWQgbGVnZW5kIG9yIGxhYmVsXHJcbiAqXHJcbiAqIFJldHVybnMgdGhlIGZpcnN0IGVsZW1lbnQgdGhhdCBleGlzdHMgZnJvbSB0aGlzIGxpc3Q6XHJcbiAqXHJcbiAqIC0gVGhlIGA8bGVnZW5kPmAgYXNzb2NpYXRlZCB3aXRoIHRoZSBjbG9zZXN0IGA8ZmllbGRzZXQ+YCBhbmNlc3RvciwgYXMgbG9uZ1xyXG4gKiAgIGFzIHRoZSB0b3Agb2YgaXQgaXMgbm8gbW9yZSB0aGFuIGhhbGYgYSB2aWV3cG9ydCBoZWlnaHQgYXdheSBmcm9tIHRoZVxyXG4gKiAgIGJvdHRvbSBvZiB0aGUgaW5wdXRcclxuICogLSBUaGUgZmlyc3QgYDxsYWJlbD5gIHRoYXQgaXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBpbnB1dCB1c2luZyBmb3I9XCJpbnB1dElkXCJcclxuICogLSBUaGUgY2xvc2VzdCBwYXJlbnQgYDxsYWJlbD5gXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9ICRpbnB1dCAtIFRoZSBpbnB1dFxyXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IEFzc29jaWF0ZWQgbGVnZW5kIG9yIGxhYmVsLCBvciBudWxsIGlmIG5vIGFzc29jaWF0ZWRcclxuICogICAgICAgICAgICAgICAgICAgICAgICBsZWdlbmQgb3IgbGFiZWwgY2FuIGJlIGZvdW5kXHJcbiAqL1xyXG5FcnJvclN1bW1hcnkucHJvdG90eXBlLmdldEFzc29jaWF0ZWRMZWdlbmRPckxhYmVsID0gZnVuY3Rpb24gKCRpbnB1dCkge1xyXG4gIHZhciAkZmllbGRzZXQgPSAkaW5wdXQuY2xvc2VzdCgnZmllbGRzZXQnKVxyXG5cclxuICBpZiAoJGZpZWxkc2V0KSB7XHJcbiAgICB2YXIgbGVnZW5kcyA9ICRmaWVsZHNldC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGVnZW5kJylcclxuXHJcbiAgICBpZiAobGVnZW5kcy5sZW5ndGgpIHtcclxuICAgICAgdmFyICRjYW5kaWRhdGVMZWdlbmQgPSBsZWdlbmRzWzBdXHJcblxyXG4gICAgICAvLyBJZiB0aGUgaW5wdXQgdHlwZSBpcyByYWRpbyBvciBjaGVja2JveCwgYWx3YXlzIHVzZSB0aGUgbGVnZW5kIGlmIHRoZXJlXHJcbiAgICAgIC8vIGlzIG9uZS5cclxuICAgICAgaWYgKCRpbnB1dC50eXBlID09PSAnY2hlY2tib3gnIHx8ICRpbnB1dC50eXBlID09PSAncmFkaW8nKSB7XHJcbiAgICAgICAgcmV0dXJuICRjYW5kaWRhdGVMZWdlbmRcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gRm9yIG90aGVyIGlucHV0IHR5cGVzLCBvbmx5IHNjcm9sbCB0byB0aGUgZmllbGRzZXTigJlzIGxlZ2VuZCAoaW5zdGVhZCBvZlxyXG4gICAgICAvLyB0aGUgbGFiZWwgYXNzb2NpYXRlZCB3aXRoIHRoZSBpbnB1dCkgaWYgdGhlIGlucHV0IHdvdWxkIGVuZCB1cCBpbiB0aGVcclxuICAgICAgLy8gdG9wIGhhbGYgb2YgdGhlIHNjcmVlbi5cclxuICAgICAgLy9cclxuICAgICAgLy8gVGhpcyBzaG91bGQgYXZvaWQgc2l0dWF0aW9ucyB3aGVyZSB0aGUgaW5wdXQgZWl0aGVyIGVuZHMgdXAgb2ZmIHRoZVxyXG4gICAgICAvLyBzY3JlZW4sIG9yIG9ic2N1cmVkIGJ5IGEgc29mdHdhcmUga2V5Ym9hcmQuXHJcbiAgICAgIHZhciBsZWdlbmRUb3AgPSAkY2FuZGlkYXRlTGVnZW5kLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcFxyXG4gICAgICB2YXIgaW5wdXRSZWN0ID0gJGlucHV0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcblxyXG4gICAgICAvLyBJZiB0aGUgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHRcclxuICAgICAgLy8gb3Igd2luZG93LmlubmVySGVpZ2h0IChsaWtlIElFOCksIGJhaWwgYW5kIGp1c3QgbGluayB0byB0aGUgbGFiZWwuXHJcbiAgICAgIGlmIChpbnB1dFJlY3QuaGVpZ2h0ICYmIHdpbmRvdy5pbm5lckhlaWdodCkge1xyXG4gICAgICAgIHZhciBpbnB1dEJvdHRvbSA9IGlucHV0UmVjdC50b3AgKyBpbnB1dFJlY3QuaGVpZ2h0XHJcblxyXG4gICAgICAgIGlmIChpbnB1dEJvdHRvbSAtIGxlZ2VuZFRvcCA8IHdpbmRvdy5pbm5lckhlaWdodCAvIDIpIHtcclxuICAgICAgICAgIHJldHVybiAkY2FuZGlkYXRlTGVnZW5kXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImxhYmVsW2Zvcj0nXCIgKyAkaW5wdXQuZ2V0QXR0cmlidXRlKCdpZCcpICsgXCInXVwiKSB8fFxyXG4gICAgJGlucHV0LmNsb3Nlc3QoJ2xhYmVsJylcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRXJyb3JTdW1tYXJ5OyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmZ1bmN0aW9uIGlzVmFyaWFudFZhbGlkKHZhcmlhbnQpIHtcclxuICAgIGNvbnN0IFZBUklBTlRTID0gW1wiaW5mb1wiLCBcInN1Y2Nlc3NcIiwgXCJ3YXJuaW5nXCIsIFwiZXJyb3JcIl07XHJcbiAgICBpZiAoVkFSSUFOVFMuaW5jbHVkZXModmFyaWFudCkpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaXNIZWFkaW5ndHlwZVZhbGlkKGhlYWRpbmd0eXBlKSB7XHJcbiAgICBjb25zdCBIRUFESU5HVFlQRVMgPSBbXCJoMVwiLCBcImgyXCIsIFwiaDNcIiwgXCJoNFwiLCBcImg1XCIsIFwiaDZcIiwgXCJzdHJvbmdcIl07XHJcbiAgICBpZiAoSEVBRElOR1RZUEVTLmluY2x1ZGVzKGhlYWRpbmd0eXBlKSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBGRFNBbGVydCBleHRlbmRzIEhUTUxFbGVtZW50IHtcclxuICAgICNjbG9zZUNsaWNraGFuZGxlcjtcclxuXHJcbiAgICBzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcclxuICAgICAgICByZXR1cm4gWyd2YXJpYW50JywgJ2hlYWRpbmcnLCAnaGVhZGluZ3R5cGUnLCAnY2xvc2VhYmxlJ107XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHZhcmlhbnQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzQXR0cmlidXRlKCd2YXJpYW50JykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCd2YXJpYW50Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHZhcmlhbnQodmFsKSB7XHJcbiAgICAgICAgaWYgKGlzVmFyaWFudFZhbGlkKHZhbCkpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ3ZhcmlhbnQnLCB2YWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB2YXJpYW50OiAnXCIgKyB2YWwgKyBcIicuIFZhcmlhbnQgbXVzdCBiZSAnaW5mbycsICdzdWNjZXNzJywgJ3dhcm5pbmcnIG9yICdlcnJvcicuXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgaGVhZGluZygpIHtcclxuICAgICAgICBpZiAodGhpcy5oYXNBdHRyaWJ1dGUoJ2hlYWRpbmcnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ2hlYWRpbmcnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXQgaGVhZGluZyh2YWwpIHtcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnaGVhZGluZycsIHZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGhlYWRpbmd0eXBlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmhhc0F0dHJpYnV0ZSgnaGVhZGluZ3R5cGUnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ2hlYWRpbmd0eXBlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGhlYWRpbmd0eXBlKHZhbCkge1xyXG4gICAgICAgIGlmIChpc0hlYWRpbmd0eXBlVmFsaWQodmFsKSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnaGVhZGluZ3R5cGUnLCB2YWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBoZWFkaW5nIHR5cGU6ICdcIiArIHZhbCArIFwiJy4gVmFsaWQgdmFsdWVzIGFyZSAnaDEnLCAnaDIsICdoMycsICdoNCcsICdoNScsICdoNicgYW5kICdzdHJvbmcnLlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNsb3NlYWJsZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoJ2Nsb3NlYWJsZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBjbG9zZWFibGUodmFsKSB7XHJcbiAgICAgICAgaWYgKHZhbCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnY2xvc2VhYmxlJywgJycpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuI2Nsb3NlQ2xpY2toYW5kbGVyID0gKCkgPT4geyB0aGlzLmhpZGUoKSB9O1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGUoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJoaWRkZW5cIiwgJycpO1xyXG4gICAgICAgIGxldCBldmVudEhpZGUgPSBuZXcgRXZlbnQoJ2Zkc2FsZXJ0aGlkZScpO1xyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChldmVudEhpZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3coKSB7XHJcbiAgICAgICAgLy8gVG8gZG9cclxuICAgIH1cclxuXHJcbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcclxuXHJcbiAgICAgICAgLyogQ3JlYXRlIHRoZSBiYXNlIGZvciB0aGUgYWxlcnQgKi9cclxuICAgICAgICBsZXQgY29uc3RydWN0ZWRBbGVydCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbnN0cnVjdGVkQWxlcnQuY2xhc3NMaXN0LmFkZCgnYWxlcnQnKTtcclxuXHJcbiAgICAgICAgLyogQWRkIHZhcmlhbnQgKi9cclxuICAgICAgICBpZiAoaXNWYXJpYW50VmFsaWQodGhpcy52YXJpYW50KSkge1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RlZEFsZXJ0LmNsYXNzTGlzdC5hZGQoXCJhbGVydC1cIiArIHRoaXMudmFyaWFudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBBZGQgaGVhZGluZyAqL1xyXG4gICAgICAgIGlmIChpc0hlYWRpbmd0eXBlVmFsaWQodGhpcy5oZWFkaW5ndHlwZSkpIHtcclxuICAgICAgICAgICAgbGV0IGFsZXJ0SGVhZGluZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy5oZWFkaW5ndHlwZSk7XHJcbiAgICAgICAgICAgIGFsZXJ0SGVhZGluZy50ZXh0Q29udGVudCA9IHRoaXMuaGVhZGluZztcclxuICAgICAgICAgICAgYWxlcnRIZWFkaW5nLmNsYXNzTGlzdC5hZGQoJ2FsZXJ0LWhlYWRpbmcnKTtcclxuICAgICAgICAgICAgY29uc3RydWN0ZWRBbGVydC5hcHBlbmRDaGlsZChhbGVydEhlYWRpbmcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGFsZXJ0SGVhZGluZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICBhbGVydEhlYWRpbmcudGV4dENvbnRlbnQgPSB0aGlzLmhlYWRpbmc7XHJcbiAgICAgICAgICAgIGFsZXJ0SGVhZGluZy5jbGFzc0xpc3QuYWRkKCdhbGVydC1oZWFkaW5nJyk7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdGVkQWxlcnQuYXBwZW5kQ2hpbGQoYWxlcnRIZWFkaW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIEFkZCBjb250ZW50ICovXHJcbiAgICAgICAgbGV0IGFsZXJ0Qm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGFsZXJ0Qm9keS5jbGFzc0xpc3QuYWRkKCdhbGVydC1ib2R5Jyk7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5uZXJIVE1MID09PSB0aGlzLnRleHRDb250ZW50KSB7XHJcbiAgICAgICAgICAgIGFsZXJ0Qm9keS5pbm5lckhUTUwgPSBcIjxwIGNsYXNzPSdtdC0wIG1iLTAnPlwiICsgdGhpcy5pbm5lckhUTUwgKyBcIjwvcD5cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGFsZXJ0Qm9keS5pbm5lckhUTUwgPSB0aGlzLmlubmVySFRNTDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3RydWN0ZWRBbGVydC5hcHBlbmRDaGlsZChhbGVydEJvZHkpO1xyXG5cclxuICAgICAgICAvKiBBZGQgY2xvc2UgYnV0dG9uICovXHJcbiAgICAgICAgaWYgKHRoaXMuY2xvc2VhYmxlKSB7XHJcbiAgICAgICAgICAgIGxldCBjbG9zZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgICAgICBjbG9zZUJ1dHRvbi50eXBlID0gJ2J1dHRvbic7XHJcbiAgICAgICAgICAgIGNsb3NlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2FsZXJ0LWNsb3NlJyk7XHJcbiAgICAgICAgICAgIGNsb3NlQnV0dG9uLmlubmVySFRNTCA9ICc8c3ZnIGNsYXNzPVwiaWNvbi1zdmdcIiBmb2N1c2FibGU9XCJmYWxzZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PHBhdGggZD1cIk0wIDBoMjR2MjRIMFYwelwiIGZpbGw9XCJub25lXCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTkgNi40MUwxNy41OSA1IDEyIDEwLjU5IDYuNDEgNSA1IDYuNDEgMTAuNTkgMTIgNSAxNy41OSA2LjQxIDE5IDEyIDEzLjQxIDE3LjU5IDE5IDE5IDE3LjU5IDEzLjQxIDEyIDE5IDYuNDF6XCI+PC9wYXRoPjwvc3ZnPkx1ayc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdGVkQWxlcnQuYXBwZW5kQ2hpbGQoY2xvc2VCdXR0b24pO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RlZEFsZXJ0LnF1ZXJ5U2VsZWN0b3IoJy5hbGVydC1oZWFkaW5nJykuY2xhc3NMaXN0LmFkZCgncHItOCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogRmluaXNoIHRoZSBhbGVydCAqL1xyXG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gY29uc3RydWN0ZWRBbGVydC5vdXRlckhUTUw7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNsb3NlYWJsZSkge1xyXG4gICAgICAgICAgICAvKiBJbiBjYXNlIHRoZXJlJ3MgYW4gYWxlcnQgaW5zaWRlIGFuIGFsZXJ0LCBlbnN1cmUgdGhhdCB3ZSBmaW5kIHRoZSBjb3JyZWN0IGNsb3NlIGJ1dHRvbiAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYWxlcnRFbGVtZW50cyA9IHRoaXMuY2hpbGRyZW5bMF0uY2hpbGRyZW47XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFsZXJ0RWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWxlcnRFbGVtZW50c1tpXS5jbGFzc0xpc3QuY29udGFpbnMoJ2FsZXJ0LWNsb3NlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnRFbGVtZW50c1tpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy4jY2xvc2VDbGlja2hhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XHJcbiAgICB9XHJcblxyXG4gICAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xyXG4gICAgICAgIGlmIChuYW1lID09PSBcInZhcmlhbnRcIikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5xdWVyeVNlbGVjdG9yKCcuYWxlcnQnKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsYXNzZXMgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5hbGVydCcpLmNsYXNzTGlzdDtcclxuICAgICAgICAgICAgICAgIGNsYXNzZXMucmVtb3ZlKCdhbGVydC1pbmZvJyk7XHJcbiAgICAgICAgICAgICAgICBjbGFzc2VzLnJlbW92ZSgnYWxlcnQtc3VjY2VzcycpO1xyXG4gICAgICAgICAgICAgICAgY2xhc3Nlcy5yZW1vdmUoJ2FsZXJ0LXdhcm5pbmcnKTtcclxuICAgICAgICAgICAgICAgIGNsYXNzZXMucmVtb3ZlKCdhbGVydC1lcnJvcicpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpc1ZhcmlhbnRWYWxpZChuZXdWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5hbGVydCcpLmNsYXNzTGlzdC5hZGQoXCJhbGVydC1cIiArIG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobmFtZSA9PT0gXCJoZWFkaW5nXCIpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucXVlcnlTZWxlY3RvcignLmFsZXJ0LWhlYWRpbmcnKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGhlYWRpbmcgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5hbGVydC1oZWFkaW5nJyk7XHJcbiAgICAgICAgICAgICAgICBoZWFkaW5nLnRleHRDb250ZW50ID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5hbWUgPT09IFwiaGVhZGluZ3R5cGVcIikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5xdWVyeVNlbGVjdG9yKCcuYWxlcnQnKSAmJiB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5hbGVydC1oZWFkaW5nJykpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpc0hlYWRpbmd0eXBlVmFsaWQobmV3VmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGhlYWRpbmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBoZWFkaW5nLnRleHRDb250ZW50ID0gdGhpcy5oZWFkaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRpbmcuY2xhc3NMaXN0ID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcuYWxlcnQtaGVhZGluZycpLmNsYXNzTGlzdDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5hbGVydCcpLnJlcGxhY2VDaGlsZChoZWFkaW5nLCB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5hbGVydC1oZWFkaW5nJykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChuYW1lID09PSBcImNsb3NlYWJsZVwiKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jbG9zZWFibGUpIHtcclxuICAgICAgICAgICAgICAgIC8qIEluIGNhc2UgdGhlcmUncyBhbiBhbGVydCBpbnNpZGUgYW4gYWxlcnQsIGVuc3VyZSB0aGF0IHdlIGZpbmQgdGhlIGNvcnJlY3QgY2xvc2UgYnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFsZXJ0RWxlbWVudHMgPSB0aGlzLmNoaWxkcmVuWzBdLmNoaWxkcmVuO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxlcnRFbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWxlcnRFbGVtZW50c1tpXS5jbGFzc0xpc3QuY29udGFpbnMoJ2FsZXJ0LWNsb3NlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0RWxlbWVudHNbaV0ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuI2Nsb3NlQ2xpY2toYW5kbGVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0RWxlbWVudHNbaV0ucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoYWxlcnRFbGVtZW50c1tpXS5jbGFzc0xpc3QuY29udGFpbnMoJ2FsZXJ0LWhlYWRpbmcnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnRFbGVtZW50c1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdwci04Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2xvc2VCdXR0b25FeGlzdHMgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFsZXJ0RWxlbWVudHMgPSB0aGlzLmNoaWxkcmVuWzBdLmNoaWxkcmVuO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxlcnRFbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWxlcnRFbGVtZW50c1tpXS5jbGFzc0xpc3QuY29udGFpbnMoJ2FsZXJ0LWNsb3NlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlQnV0dG9uRXhpc3RzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWNsb3NlQnV0dG9uRXhpc3RzICYmIHRoaXMuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjbG9zZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlQnV0dG9uLnR5cGUgPSAnYnV0dG9uJztcclxuICAgICAgICAgICAgICAgICAgICBjbG9zZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdhbGVydC1jbG9zZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlQnV0dG9uLmlubmVySFRNTCA9ICc8c3ZnIGNsYXNzPVwiaWNvbi1zdmdcIiBmb2N1c2FibGU9XCJmYWxzZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PHBhdGggZD1cIk0wIDBoMjR2MjRIMFYwelwiIGZpbGw9XCJub25lXCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTkgNi40MUwxNy41OSA1IDEyIDEwLjU5IDYuNDEgNSA1IDYuNDEgMTAuNTkgMTIgNSAxNy41OSA2LjQxIDE5IDEyIDEzLjQxIDE3LjU5IDE5IDE5IDE3LjU5IDEzLjQxIDEyIDE5IDYuNDF6XCI+PC9wYXRoPjwvc3ZnPkx1ayc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJzdENoaWxkLmFwcGVuZENoaWxkKGNsb3NlQnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFsZXJ0RWxlbWVudHMgPSB0aGlzLmNoaWxkcmVuWzBdLmNoaWxkcmVuO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxlcnRFbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWxlcnRFbGVtZW50c1tpXS5jbGFzc0xpc3QuY29udGFpbnMoJ2FsZXJ0LWNsb3NlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0RWxlbWVudHNbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuI2Nsb3NlQ2xpY2toYW5kbGVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChhbGVydEVsZW1lbnRzW2ldLmNsYXNzTGlzdC5jb250YWlucygnYWxlcnQtaGVhZGluZycpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydEVsZW1lbnRzW2ldLmNsYXNzTGlzdC5hZGQoJ3ByLTgnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRkRTQWxlcnQ7IiwiJ3VzZSBzdHJpY3QnO1xyXG4vKipcclxuICogQWRkcyBjbGljayBmdW5jdGlvbmFsaXR5IHRvIG1vZGFsXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9ICRtb2RhbCBNb2RhbCBlbGVtZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBNb2RhbCAoJG1vZGFsKSB7XHJcbiAgICB0aGlzLiRtb2RhbCA9ICRtb2RhbDtcclxuICAgIGxldCBpZCA9IHRoaXMuJG1vZGFsLmdldEF0dHJpYnV0ZSgnaWQnKTtcclxuICAgIHRoaXMudHJpZ2dlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2R1bGU9XCJtb2RhbFwiXVtkYXRhLXRhcmdldD1cIicraWQrJ1wiXScpO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0IGV2ZW50c1xyXG4gKi9cclxuTW9kYWwucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IHRyaWdnZXJzID0gdGhpcy50cmlnZ2VycztcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRyaWdnZXJzLmxlbmd0aDsgaSsrKXtcclxuICAgIGxldCB0cmlnZ2VyID0gdHJpZ2dlcnNbIGkgXTtcclxuICAgIHRyaWdnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnNob3cuYmluZCh0aGlzKSk7XHJcbiAgfVxyXG4gIGxldCBjbG9zZXJzID0gdGhpcy4kbW9kYWwucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbW9kYWwtY2xvc2VdJyk7XHJcbiAgZm9yIChsZXQgYyA9IDA7IGMgPCBjbG9zZXJzLmxlbmd0aDsgYysrKXtcclxuICAgIGxldCBjbG9zZXIgPSBjbG9zZXJzWyBjIF07XHJcbiAgICBjbG9zZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhpZGUuYmluZCh0aGlzKSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEhpZGUgbW9kYWxcclxuICovXHJcbk1vZGFsLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKCl7XHJcbiAgbGV0IG1vZGFsRWxlbWVudCA9IHRoaXMuJG1vZGFsO1xyXG4gIGlmKG1vZGFsRWxlbWVudCAhPT0gbnVsbCl7XHJcbiAgICBtb2RhbEVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcblxyXG4gICAgbGV0IGV2ZW50Q2xvc2UgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICAgIGV2ZW50Q2xvc2UuaW5pdEV2ZW50KCdmZHMubW9kYWwuaGlkZGVuJywgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICBtb2RhbEVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuXHJcbiAgICBsZXQgJGJhY2tkcm9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21vZGFsLWJhY2tkcm9wJyk7XHJcbiAgICAkYmFja2Ryb3AucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCgkYmFja2Ryb3ApO1xyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtb3BlbicpO1xyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRyYXBGb2N1cywgdHJ1ZSk7XHJcblxyXG4gICAgaWYoIWhhc0ZvcmNlZEFjdGlvbihtb2RhbEVsZW1lbnQpKXtcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVFc2NhcGUpO1xyXG4gICAgfVxyXG4gICAgbGV0IGRhdGFNb2RhbE9wZW5lciA9IG1vZGFsRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbW9kYWwtb3BlbmVyJyk7XHJcbiAgICBpZihkYXRhTW9kYWxPcGVuZXIgIT09IG51bGwpe1xyXG4gICAgICBsZXQgb3BlbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZGF0YU1vZGFsT3BlbmVyKVxyXG4gICAgICBpZihvcGVuZXIgIT09IG51bGwpe1xyXG4gICAgICAgIG9wZW5lci5mb2N1cygpO1xyXG4gICAgICB9XHJcbiAgICAgIG1vZGFsRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtbW9kYWwtb3BlbmVyJyk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNob3cgbW9kYWxcclxuICovXHJcbk1vZGFsLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKGUgPSBudWxsKXtcclxuICBsZXQgbW9kYWxFbGVtZW50ID0gdGhpcy4kbW9kYWw7XHJcbiAgaWYobW9kYWxFbGVtZW50ICE9PSBudWxsKXtcclxuICAgIGlmKGUgIT09IG51bGwpe1xyXG4gICAgICBsZXQgb3BlbmVySWQgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcbiAgICAgIGlmKG9wZW5lcklkID09PSBudWxsKXtcclxuICAgICAgICBvcGVuZXJJZCA9ICdtb2RhbC1vcGVuZXItJytNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoOTk5OSAtIDEwMDAgKyAxKSArIDEwMDApO1xyXG4gICAgICAgIGUudGFyZ2V0LnNldEF0dHJpYnV0ZSgnaWQnLCBvcGVuZXJJZClcclxuICAgICAgfVxyXG4gICAgICBtb2RhbEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLW1vZGFsLW9wZW5lcicsIG9wZW5lcklkKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBIaWRlIG9wZW4gbW9kYWxzIC0gRkRTIGRvIG5vdCByZWNvbW1lbmQgbW9yZSB0aGFuIG9uZSBvcGVuIG1vZGFsIGF0IGEgdGltZVxyXG4gICAgbGV0IGFjdGl2ZU1vZGFscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5mZHMtbW9kYWxbYXJpYS1oaWRkZW49ZmFsc2VdJyk7XHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYWN0aXZlTW9kYWxzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgbmV3IE1vZGFsKGFjdGl2ZU1vZGFsc1tpXSkuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG1vZGFsRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICBtb2RhbEVsZW1lbnQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xyXG5cclxuICAgIGxldCBldmVudE9wZW4gPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICAgIGV2ZW50T3Blbi5pbml0RXZlbnQoJ2Zkcy5tb2RhbC5zaG93bicsIHRydWUsIHRydWUpO1xyXG4gICAgbW9kYWxFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRPcGVuKTtcclxuXHJcbiAgICBsZXQgJGJhY2tkcm9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAkYmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnbW9kYWwtYmFja2Ryb3AnKTtcclxuICAgICRiYWNrZHJvcC5zZXRBdHRyaWJ1dGUoJ2lkJywgXCJtb2RhbC1iYWNrZHJvcFwiKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQoJGJhY2tkcm9wKTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmNsYXNzTGlzdC5hZGQoJ21vZGFsLW9wZW4nKTtcclxuXHJcbiAgICBtb2RhbEVsZW1lbnQuZm9jdXMoKTtcclxuXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdHJhcEZvY3VzLCB0cnVlKTtcclxuICAgIGlmKCFoYXNGb3JjZWRBY3Rpb24obW9kYWxFbGVtZW50KSl7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlRXNjYXBlKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENsb3NlIG1vZGFsIHdoZW4gaGl0dGluZyBFU0NcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCBcclxuICovXHJcbmxldCBoYW5kbGVFc2NhcGUgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICB2YXIga2V5ID0gZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZTtcclxuICBsZXQgbW9kYWxFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZkcy1tb2RhbFthcmlhLWhpZGRlbj1mYWxzZV0nKTtcclxuICBsZXQgY3VycmVudE1vZGFsID0gbmV3IE1vZGFsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mZHMtbW9kYWxbYXJpYS1oaWRkZW49ZmFsc2VdJykpO1xyXG4gIGlmIChrZXkgPT09IDI3KXtcclxuICAgIGxldCBwb3NzaWJsZU92ZXJmbG93TWVudXMgPSBtb2RhbEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJ1dHRvbi1vdmVyZmxvdy1tZW51W2FyaWEtZXhwYW5kZWQ9XCJ0cnVlXCJdJyk7XHJcbiAgICBpZihwb3NzaWJsZU92ZXJmbG93TWVudXMubGVuZ3RoID09PSAwKXtcclxuICAgICAgY3VycmVudE1vZGFsLmhpZGUoKTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogVHJhcCBmb2N1cyBpbiBtb2RhbCB3aGVuIG9wZW5cclxuICogQHBhcmFtIHtQb2ludGVyRXZlbnR9IGVcclxuICovXHJcbiBmdW5jdGlvbiB0cmFwRm9jdXMoZSl7XHJcbiAgdmFyIGN1cnJlbnREaWFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmRzLW1vZGFsW2FyaWEtaGlkZGVuPWZhbHNlXScpO1xyXG4gIGlmKGN1cnJlbnREaWFsb2cgIT09IG51bGwpe1xyXG4gICAgdmFyIGZvY3VzYWJsZUVsZW1lbnRzID0gY3VycmVudERpYWxvZy5xdWVyeVNlbGVjdG9yQWxsKCdhW2hyZWZdOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuPXRydWVdKSwgYnV0dG9uOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuPXRydWVdKSwgdGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pLCBpbnB1dDpub3QoW3R5cGU9aGlkZGVuXSk6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pLCBzZWxlY3Q6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pLCBkZXRhaWxzOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuPXRydWVdKSwgW3RhYmluZGV4XTpub3QoW3RhYmluZGV4PVwiLTFcIl0pOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuPXRydWVdKScpO1xyXG4gICAgXHJcbiAgICB2YXIgZmlyc3RGb2N1c2FibGVFbGVtZW50ID0gZm9jdXNhYmxlRWxlbWVudHNbMF07XHJcbiAgICB2YXIgbGFzdEZvY3VzYWJsZUVsZW1lbnQgPSBmb2N1c2FibGVFbGVtZW50c1tmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxXTtcclxuXHJcbiAgICB2YXIgaXNUYWJQcmVzc2VkID0gKGUua2V5ID09PSAnVGFiJyB8fCBlLmtleUNvZGUgPT09IDkpO1xyXG5cclxuICAgIGlmICghaXNUYWJQcmVzc2VkKSB7IFxyXG4gICAgICByZXR1cm47IFxyXG4gICAgfVxyXG5cclxuICAgIGlmICggZS5zaGlmdEtleSApIC8qIHNoaWZ0ICsgdGFiICovIHtcclxuICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGZpcnN0Rm9jdXNhYmxlRWxlbWVudCkge1xyXG4gICAgICAgIGxhc3RGb2N1c2FibGVFbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSAvKiB0YWIgKi8ge1xyXG4gICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gbGFzdEZvY3VzYWJsZUVsZW1lbnQpIHtcclxuICAgICAgICBmaXJzdEZvY3VzYWJsZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbmZ1bmN0aW9uIGhhc0ZvcmNlZEFjdGlvbiAobW9kYWwpe1xyXG4gIGlmKG1vZGFsLmdldEF0dHJpYnV0ZSgnZGF0YS1tb2RhbC1mb3JjZWQtYWN0aW9uJykgPT09IG51bGwpe1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuICByZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTW9kYWw7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgZm9yRWFjaCA9IHJlcXVpcmUoJ2FycmF5LWZvcmVhY2gnKTtcclxuY29uc3Qgc2VsZWN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvc2VsZWN0Jyk7XHJcblxyXG5jb25zdCBOQVYgPSBgLm5hdmA7XHJcbmNvbnN0IE5BVl9MSU5LUyA9IGAke05BVn0gYWA7XHJcbmNvbnN0IE9QRU5FUlMgPSBgLmpzLW1lbnUtb3BlbmA7XHJcbmNvbnN0IENMT1NFX0JVVFRPTiA9IGAuanMtbWVudS1jbG9zZWA7XHJcbmNvbnN0IE9WRVJMQVkgPSBgLm92ZXJsYXlgO1xyXG5jb25zdCBDTE9TRVJTID0gYCR7Q0xPU0VfQlVUVE9OfSwgLm92ZXJsYXlgO1xyXG5jb25zdCBUT0dHTEVTID0gWyBOQVYsIE9WRVJMQVkgXS5qb2luKCcsICcpO1xyXG5cclxuY29uc3QgQUNUSVZFX0NMQVNTID0gJ21vYmlsZV9uYXYtYWN0aXZlJztcclxuY29uc3QgVklTSUJMRV9DTEFTUyA9ICdpcy12aXNpYmxlJztcclxuXHJcbi8qKlxyXG4gKiBBZGQgbW9iaWxlIG1lbnUgZnVuY3Rpb25hbGl0eVxyXG4gKi9cclxuY2xhc3MgTmF2aWdhdGlvbiB7XHJcbiAgLyoqXHJcbiAgICogU2V0IGV2ZW50c1xyXG4gICAqL1xyXG4gIGluaXQgKCkge1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIG1vYmlsZU1lbnUsIGZhbHNlKTtcclxuICAgIG1vYmlsZU1lbnUoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZSBldmVudHNcclxuICAgKi9cclxuICB0ZWFyZG93biAoKSB7XHJcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgbW9iaWxlTWVudSwgZmFsc2UpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZCBmdW5jdGlvbmFsaXR5IHRvIG1vYmlsZSBtZW51XHJcbiAqL1xyXG5jb25zdCBtb2JpbGVNZW51ID0gZnVuY3Rpb24oKSB7XHJcbiAgbGV0IG1vYmlsZSA9IGZhbHNlO1xyXG4gIGxldCBvcGVuZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChPUEVORVJTKTtcclxuICBmb3IobGV0IG8gPSAwOyBvIDwgb3BlbmVycy5sZW5ndGg7IG8rKykge1xyXG4gICAgaWYod2luZG93LmdldENvbXB1dGVkU3R5bGUob3BlbmVyc1tvXSwgbnVsbCkuZGlzcGxheSAhPT0gJ25vbmUnKSB7XHJcbiAgICAgIG9wZW5lcnNbb10uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVOYXYpO1xyXG4gICAgICBtb2JpbGUgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gaWYgbW9iaWxlXHJcbiAgaWYobW9iaWxlKXtcclxuICAgIGxldCBjbG9zZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChDTE9TRVJTKTtcclxuICAgIGZvcihsZXQgYyA9IDA7IGMgPCBjbG9zZXJzLmxlbmd0aDsgYysrKSB7XHJcbiAgICAgIGNsb3NlcnNbIGMgXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZU5hdik7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG5hdkxpbmtzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChOQVZfTElOS1MpO1xyXG4gICAgZm9yKGxldCBuID0gMDsgbiA8IG5hdkxpbmtzLmxlbmd0aDsgbisrKSB7XHJcbiAgICAgIG5hdkxpbmtzWyBuIF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIC8vIEEgbmF2aWdhdGlvbiBsaW5rIGhhcyBiZWVuIGNsaWNrZWQhIFdlIHdhbnQgdG8gY29sbGFwc2UgYW55XHJcbiAgICAgICAgLy8gaGllcmFyY2hpY2FsIG5hdmlnYXRpb24gVUkgaXQncyBhIHBhcnQgb2YsIHNvIHRoYXQgdGhlIHVzZXJcclxuICAgICAgICAvLyBjYW4gZm9jdXMgb24gd2hhdGV2ZXIgdGhleSd2ZSBqdXN0IHNlbGVjdGVkLlxyXG5cclxuICAgICAgICAvLyBTb21lIG5hdmlnYXRpb24gbGlua3MgYXJlIGluc2lkZSBkcm9wZG93bnM7IHdoZW4gdGhleSdyZVxyXG4gICAgICAgIC8vIGNsaWNrZWQsIHdlIHdhbnQgdG8gY29sbGFwc2UgdGhvc2UgZHJvcGRvd25zLlxyXG5cclxuXHJcbiAgICAgICAgLy8gSWYgdGhlIG1vYmlsZSBuYXZpZ2F0aW9uIG1lbnUgaXMgYWN0aXZlLCB3ZSB3YW50IHRvIGhpZGUgaXQuXHJcbiAgICAgICAgaWYgKGlzQWN0aXZlKCkpIHtcclxuICAgICAgICAgIHRvZ2dsZU5hdi5jYWxsKHRoaXMsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRyYXBDb250YWluZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChOQVYpO1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRyYXBDb250YWluZXJzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgZm9jdXNUcmFwID0gX2ZvY3VzVHJhcCh0cmFwQ29udGFpbmVyc1tpXSk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgY29uc3QgY2xvc2VyID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKENMT1NFX0JVVFRPTik7XHJcblxyXG4gIGlmIChpc0FjdGl2ZSgpICYmIGNsb3NlciAmJiBjbG9zZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggPT09IDApIHtcclxuICAgIC8vIFRoZSBtb2JpbGUgbmF2IGlzIGFjdGl2ZSwgYnV0IHRoZSBjbG9zZSBib3ggaXNuJ3QgdmlzaWJsZSwgd2hpY2hcclxuICAgIC8vIG1lYW5zIHRoZSB1c2VyJ3Mgdmlld3BvcnQgaGFzIGJlZW4gcmVzaXplZCBzbyB0aGF0IGl0IGlzIG5vIGxvbmdlclxyXG4gICAgLy8gaW4gbW9iaWxlIG1vZGUuIExldCdzIG1ha2UgdGhlIHBhZ2Ugc3RhdGUgY29uc2lzdGVudCBieVxyXG4gICAgLy8gZGVhY3RpdmF0aW5nIHRoZSBtb2JpbGUgbmF2LlxyXG4gICAgdG9nZ2xlTmF2LmNhbGwoY2xvc2VyLCBmYWxzZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIG1vYmlsZSBtZW51IGlzIGFjdGl2ZVxyXG4gKiBAcmV0dXJucyB0cnVlIGlmIG1vYmlsZSBtZW51IGlzIGFjdGl2ZSBhbmQgZmFsc2UgaWYgbm90IGFjdGl2ZVxyXG4gKi9cclxuY29uc3QgaXNBY3RpdmUgPSAoKSA9PiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhBQ1RJVkVfQ0xBU1MpO1xyXG5cclxuLyoqXHJcbiAqIFRyYXAgZm9jdXMgaW4gbW9iaWxlIG1lbnUgaWYgYWN0aXZlXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRyYXBDb250YWluZXIgXHJcbiAqL1xyXG5jb25zdCBfZm9jdXNUcmFwID0gKHRyYXBDb250YWluZXIpID0+IHtcclxuXHJcbiAgLy8gRmluZCBhbGwgZm9jdXNhYmxlIGNoaWxkcmVuXHJcbiAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcgPSAnYVtocmVmXSwgYXJlYVtocmVmXSwgaW5wdXQ6bm90KFtkaXNhYmxlZF0pLCBzZWxlY3Q6bm90KFtkaXNhYmxlZF0pLCB0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSksIGJ1dHRvbjpub3QoW2Rpc2FibGVkXSksIGlmcmFtZSwgb2JqZWN0LCBlbWJlZCwgW3RhYmluZGV4PVwiMFwiXSwgW2NvbnRlbnRlZGl0YWJsZV0nO1xyXG4gIGxldCBmb2N1c2FibGVFbGVtZW50cyA9IHRyYXBDb250YWluZXIucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGVFbGVtZW50c1N0cmluZyk7XHJcbiAgbGV0IGZpcnN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzWyAwIF07XHJcblxyXG4gIGZ1bmN0aW9uIHRyYXBUYWJLZXkgKGUpIHtcclxuICAgIHZhciBrZXkgPSBldmVudC53aGljaCB8fCBldmVudC5rZXlDb2RlO1xyXG4gICAgLy8gQ2hlY2sgZm9yIFRBQiBrZXkgcHJlc3NcclxuICAgIGlmIChrZXkgPT09IDkpIHtcclxuXHJcbiAgICAgIGxldCBsYXN0VGFiU3RvcCA9IG51bGw7XHJcbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgbGV0IG51bWJlciA9IGZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBmb2N1c2FibGVFbGVtZW50c1sgbnVtYmVyIC0gaSBdO1xyXG4gICAgICAgIGlmIChlbGVtZW50Lm9mZnNldFdpZHRoID4gMCAmJiBlbGVtZW50Lm9mZnNldEhlaWdodCA+IDApIHtcclxuICAgICAgICAgIGxhc3RUYWJTdG9wID0gZWxlbWVudDtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gU0hJRlQgKyBUQUJcclxuICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcclxuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZmlyc3RUYWJTdG9wKSB7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBsYXN0VGFiU3RvcC5mb2N1cygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRBQlxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBsYXN0VGFiU3RvcCkge1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRVNDQVBFXHJcbiAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7XHJcbiAgICAgIHRvZ2dsZU5hdi5jYWxsKHRoaXMsIGZhbHNlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBlbmFibGUgKCkge1xyXG4gICAgICAgIC8vIEZvY3VzIGZpcnN0IGNoaWxkXHJcbiAgICAgICAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgIC8vIExpc3RlbiBmb3IgYW5kIHRyYXAgdGhlIGtleWJvYXJkXHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwVGFiS2V5KTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVsZWFzZSAoKSB7XHJcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwVGFiS2V5KTtcclxuICAgIH0sXHJcbiAgfTtcclxufTtcclxuXHJcbmxldCBmb2N1c1RyYXA7XHJcblxyXG5jb25zdCB0b2dnbGVOYXYgPSBmdW5jdGlvbiAoYWN0aXZlKSB7XHJcbiAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcbiAgaWYgKHR5cGVvZiBhY3RpdmUgIT09ICdib29sZWFuJykge1xyXG4gICAgYWN0aXZlID0gIWlzQWN0aXZlKCk7XHJcbiAgfVxyXG4gIGJvZHkuY2xhc3NMaXN0LnRvZ2dsZShBQ1RJVkVfQ0xBU1MsIGFjdGl2ZSk7XHJcblxyXG4gIGZvckVhY2goc2VsZWN0KFRPR0dMRVMpLCBlbCA9PiB7XHJcbiAgICBlbC5jbGFzc0xpc3QudG9nZ2xlKFZJU0lCTEVfQ0xBU1MsIGFjdGl2ZSk7XHJcbiAgfSk7XHJcbiAgaWYgKGFjdGl2ZSkge1xyXG4gICAgZm9jdXNUcmFwLmVuYWJsZSgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBmb2N1c1RyYXAucmVsZWFzZSgpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgY2xvc2VCdXR0b24gPSBib2R5LnF1ZXJ5U2VsZWN0b3IoQ0xPU0VfQlVUVE9OKTtcclxuICBjb25zdCBtZW51QnV0dG9uID0gYm9keS5xdWVyeVNlbGVjdG9yKE9QRU5FUlMpO1xyXG5cclxuICBpZiAoYWN0aXZlICYmIGNsb3NlQnV0dG9uKSB7XHJcbiAgICAvLyBUaGUgbW9iaWxlIG5hdiB3YXMganVzdCBhY3RpdmF0ZWQsIHNvIGZvY3VzIG9uIHRoZSBjbG9zZSBidXR0b24sXHJcbiAgICAvLyB3aGljaCBpcyBqdXN0IGJlZm9yZSBhbGwgdGhlIG5hdiBlbGVtZW50cyBpbiB0aGUgdGFiIG9yZGVyLlxyXG4gICAgY2xvc2VCdXR0b24uZm9jdXMoKTtcclxuICB9IGVsc2UgaWYgKCFhY3RpdmUgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gY2xvc2VCdXR0b24gJiZcclxuICAgICAgICAgICAgIG1lbnVCdXR0b24pIHtcclxuICAgIC8vIFRoZSBtb2JpbGUgbmF2IHdhcyBqdXN0IGRlYWN0aXZhdGVkLCBhbmQgZm9jdXMgd2FzIG9uIHRoZSBjbG9zZVxyXG4gICAgLy8gYnV0dG9uLCB3aGljaCBpcyBubyBsb25nZXIgdmlzaWJsZS4gV2UgZG9uJ3Qgd2FudCB0aGUgZm9jdXMgdG9cclxuICAgIC8vIGRpc2FwcGVhciBpbnRvIHRoZSB2b2lkLCBzbyBmb2N1cyBvbiB0aGUgbWVudSBidXR0b24gaWYgaXQnc1xyXG4gICAgLy8gdmlzaWJsZSAodGhpcyBtYXkgaGF2ZSBiZWVuIHdoYXQgdGhlIHVzZXIgd2FzIGp1c3QgZm9jdXNlZCBvbixcclxuICAgIC8vIGlmIHRoZXkgdHJpZ2dlcmVkIHRoZSBtb2JpbGUgbmF2IGJ5IG1pc3Rha2UpLlxyXG4gICAgbWVudUJ1dHRvbi5mb2N1cygpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGFjdGl2ZTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE5hdmlnYXRpb247IiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBUT0dHTEVfQVRUUklCVVRFID0gJ2RhdGEtY29udHJvbHMnO1xyXG5cclxuLyoqXHJcbiAqIEFkZHMgY2xpY2sgZnVuY3Rpb25hbGl0eSB0byByYWRpb2J1dHRvbiBjb2xsYXBzZSBsaXN0XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lckVsZW1lbnQgXHJcbiAqL1xyXG5mdW5jdGlvbiBSYWRpb1RvZ2dsZUdyb3VwKGNvbnRhaW5lckVsZW1lbnQpe1xyXG4gICAgdGhpcy5yYWRpb0dyb3VwID0gY29udGFpbmVyRWxlbWVudDtcclxuICAgIHRoaXMucmFkaW9FbHMgPSBudWxsO1xyXG4gICAgdGhpcy50YXJnZXRFbCA9IG51bGw7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRzXHJcbiAqL1xyXG5SYWRpb1RvZ2dsZUdyb3VwLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCl7XHJcbiAgICB0aGlzLnJhZGlvRWxzID0gdGhpcy5yYWRpb0dyb3VwLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXScpO1xyXG4gICAgaWYodGhpcy5yYWRpb0Vscy5sZW5ndGggPT09IDApe1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gcmFkaW9idXR0b25zIGZvdW5kIGluIHJhZGlvYnV0dG9uIGdyb3VwLicpO1xyXG4gICAgfVxyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLnJhZGlvRWxzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICB2YXIgcmFkaW8gPSB0aGlzLnJhZGlvRWxzWyBpIF07XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmFkaW8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgYSA9IDA7IGEgPCB0aGF0LnJhZGlvRWxzLmxlbmd0aDsgYSsrICl7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnRvZ2dsZSh0aGF0LnJhZGlvRWxzWyBhIF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy50b2dnbGUocmFkaW8pO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogVG9nZ2xlIHJhZGlvYnV0dG9uIGNvbnRlbnRcclxuICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSByYWRpb0lucHV0RWxlbWVudCBcclxuICovXHJcblJhZGlvVG9nZ2xlR3JvdXAucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uIChyYWRpb0lucHV0RWxlbWVudCl7XHJcbiAgICB2YXIgY29udGVudElkID0gcmFkaW9JbnB1dEVsZW1lbnQuZ2V0QXR0cmlidXRlKFRPR0dMRV9BVFRSSUJVVEUpO1xyXG4gICAgaWYoY29udGVudElkICE9PSBudWxsICYmIGNvbnRlbnRJZCAhPT0gdW5kZWZpbmVkICYmIGNvbnRlbnRJZCAhPT0gXCJcIil7XHJcbiAgICAgICAgdmFyIGNvbnRlbnRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250ZW50SWQpO1xyXG4gICAgICAgIGlmKGNvbnRlbnRFbGVtZW50ID09PSBudWxsIHx8IGNvbnRlbnRFbGVtZW50ID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIHBhbmVsIGVsZW1lbnQuIFZlcmlmeSB2YWx1ZSBvZiBhdHRyaWJ1dGUgYCsgVE9HR0xFX0FUVFJJQlVURSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHJhZGlvSW5wdXRFbGVtZW50LmNoZWNrZWQpe1xyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZChyYWRpb0lucHV0RWxlbWVudCwgY29udGVudEVsZW1lbnQpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLmNvbGxhcHNlKHJhZGlvSW5wdXRFbGVtZW50LCBjb250ZW50RWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogRXhwYW5kIHJhZGlvIGJ1dHRvbiBjb250ZW50XHJcbiAqIEBwYXJhbSB7fSByYWRpb0lucHV0RWxlbWVudCBSYWRpbyBJbnB1dCBlbGVtZW50XHJcbiAqIEBwYXJhbSB7Kn0gY29udGVudEVsZW1lbnQgQ29udGVudCBlbGVtZW50XHJcbiAqL1xyXG5SYWRpb1RvZ2dsZUdyb3VwLnByb3RvdHlwZS5leHBhbmQgPSBmdW5jdGlvbiAocmFkaW9JbnB1dEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KXtcclxuICAgIGlmKHJhZGlvSW5wdXRFbGVtZW50ICE9PSBudWxsICYmIHJhZGlvSW5wdXRFbGVtZW50ICE9PSB1bmRlZmluZWQgJiYgY29udGVudEVsZW1lbnQgIT09IG51bGwgJiYgY29udGVudEVsZW1lbnQgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgcmFkaW9JbnB1dEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLWV4cGFuZGVkJywgJ3RydWUnKTtcclxuICAgICAgICBjb250ZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgbGV0IGV2ZW50T3BlbiA9IG5ldyBFdmVudCgnZmRzLnJhZGlvLmV4cGFuZGVkJyk7XHJcbiAgICAgICAgcmFkaW9JbnB1dEVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudE9wZW4pO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBDb2xsYXBzZSByYWRpbyBidXR0b24gY29udGVudFxyXG4gKiBAcGFyYW0ge30gcmFkaW9JbnB1dEVsZW1lbnQgUmFkaW8gSW5wdXQgZWxlbWVudFxyXG4gKiBAcGFyYW0geyp9IGNvbnRlbnRFbGVtZW50IENvbnRlbnQgZWxlbWVudFxyXG4gKi9cclxuUmFkaW9Ub2dnbGVHcm91cC5wcm90b3R5cGUuY29sbGFwc2UgPSBmdW5jdGlvbihyYWRpb0lucHV0RWxlbWVudCwgY29udGVudEVsZW1lbnQpe1xyXG4gICAgaWYocmFkaW9JbnB1dEVsZW1lbnQgIT09IG51bGwgJiYgcmFkaW9JbnB1dEVsZW1lbnQgIT09IHVuZGVmaW5lZCAmJiBjb250ZW50RWxlbWVudCAhPT0gbnVsbCAmJiBjb250ZW50RWxlbWVudCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICByYWRpb0lucHV0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuICAgICAgICBjb250ZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICBsZXQgZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLnJhZGlvLmNvbGxhcHNlZCcpO1xyXG4gICAgICAgIHJhZGlvSW5wdXRFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFJhZGlvVG9nZ2xlR3JvdXA7IiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBtb2RpZmllclN0YXRlID0ge1xyXG4gIHNoaWZ0OiBmYWxzZSxcclxuICBhbHQ6IGZhbHNlLFxyXG4gIGN0cmw6IGZhbHNlLFxyXG4gIGNvbW1hbmQ6IGZhbHNlXHJcbn07XHJcbi8qXHJcbiogUHJldmVudHMgdGhlIHVzZXIgZnJvbSBpbnB1dHRpbmcgYmFzZWQgb24gYSByZWdleC5cclxuKiBEb2VzIG5vdCB3b3JrIHRoZSBzYW1lIHdheSBhZiA8aW5wdXQgcGF0dGVybj1cIlwiPiwgdGhpcyBwYXR0ZXJuIGlzIG9ubHkgdXNlZCBmb3IgdmFsaWRhdGlvbiwgbm90IHRvIHByZXZlbnQgaW5wdXQuXHJcbiogVXNlY2FzZTogbnVtYmVyIGlucHV0IGZvciBkYXRlLWNvbXBvbmVudC5cclxuKiBFeGFtcGxlIC0gbnVtYmVyIG9ubHk6IDxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtaW5wdXQtcmVnZXg9XCJeXFxkKiRcIj5cclxuKi9cclxuY2xhc3MgSW5wdXRSZWdleE1hc2sge1xyXG4gIGNvbnN0cnVjdG9yIChlbGVtZW50KXtcclxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGFzdGUnLCByZWdleE1hc2spO1xyXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgcmVnZXhNYXNrKTtcclxuICB9XHJcbn1cclxudmFyIHJlZ2V4TWFzayA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gIGlmKG1vZGlmaWVyU3RhdGUuY3RybCB8fCBtb2RpZmllclN0YXRlLmNvbW1hbmQpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgdmFyIG5ld0NoYXIgPSBudWxsO1xyXG4gIGlmKHR5cGVvZiBldmVudC5rZXkgIT09ICd1bmRlZmluZWQnKXtcclxuICAgIGlmKGV2ZW50LmtleS5sZW5ndGggPT09IDEpe1xyXG4gICAgICBuZXdDaGFyID0gZXZlbnQua2V5O1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBpZighZXZlbnQuY2hhckNvZGUpe1xyXG4gICAgICBuZXdDaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShldmVudC5rZXlDb2RlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5ld0NoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGV2ZW50LmNoYXJDb2RlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciByZWdleFN0ciA9IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLWlucHV0LXJlZ2V4Jyk7XHJcblxyXG4gIGlmKGV2ZW50LnR5cGUgIT09IHVuZGVmaW5lZCAmJiBldmVudC50eXBlID09PSAncGFzdGUnKXtcclxuICAgIC8vY29uc29sZS5sb2coJ3Bhc3RlJyk7XHJcbiAgfSBlbHNle1xyXG4gICAgdmFyIGVsZW1lbnQgPSBudWxsO1xyXG4gICAgaWYoZXZlbnQudGFyZ2V0ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgfVxyXG4gICAgaWYobmV3Q2hhciAhPT0gbnVsbCAmJiBlbGVtZW50ICE9PSBudWxsKSB7XHJcbiAgICAgIGlmKG5ld0NoYXIubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgbGV0IG5ld1ZhbHVlID0gdGhpcy52YWx1ZTtcclxuICAgICAgICBpZihlbGVtZW50LnR5cGUgPT09ICdudW1iZXInKXtcclxuICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy52YWx1ZTsvL05vdGUgaW5wdXRbdHlwZT1udW1iZXJdIGRvZXMgbm90IGhhdmUgLnNlbGVjdGlvblN0YXJ0L0VuZCAoQ2hyb21lKS5cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy52YWx1ZS5zbGljZSgwLCBlbGVtZW50LnNlbGVjdGlvblN0YXJ0KSArIHRoaXMudmFsdWUuc2xpY2UoZWxlbWVudC5zZWxlY3Rpb25FbmQpICsgbmV3Q2hhcjsgLy9yZW1vdmVzIHRoZSBudW1iZXJzIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLCB0aGVuIGFkZHMgbmV3IGNoYXIuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgciA9IG5ldyBSZWdFeHAocmVnZXhTdHIpO1xyXG4gICAgICAgIGlmKHIuZXhlYyhuZXdWYWx1ZSkgPT09IG51bGwpe1xyXG4gICAgICAgICAgaWYgKGV2ZW50LnByZXZlbnREZWZhdWx0KSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IElucHV0UmVnZXhNYXNrOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBcclxuICogQHBhcmFtIHtIVE1MVGFibGVFbGVtZW50fSB0YWJsZSBUYWJsZSBFbGVtZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBUYWJsZVNlbGVjdGFibGVSb3dzICh0YWJsZSkge1xyXG4gIHRoaXMudGFibGUgPSB0YWJsZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEluaXRpYWxpemUgZXZlbnRsaXN0ZW5lcnMgZm9yIGNoZWNrYm94ZXMgaW4gdGFibGVcclxuICovXHJcblRhYmxlU2VsZWN0YWJsZVJvd3MucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xyXG4gIHRoaXMuZ3JvdXBDaGVja2JveCA9IHRoaXMuZ2V0R3JvdXBDaGVja2JveCgpO1xyXG4gIHRoaXMudGJvZHlDaGVja2JveExpc3QgPSB0aGlzLmdldENoZWNrYm94TGlzdCgpO1xyXG4gIGlmKHRoaXMudGJvZHlDaGVja2JveExpc3QubGVuZ3RoICE9PSAwKXtcclxuICAgIGZvcihsZXQgYyA9IDA7IGMgPCB0aGlzLnRib2R5Q2hlY2tib3hMaXN0Lmxlbmd0aDsgYysrKXtcclxuICAgICAgbGV0IGNoZWNrYm94ID0gdGhpcy50Ym9keUNoZWNrYm94TGlzdFtjXTtcclxuICAgICAgY2hlY2tib3gucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdXBkYXRlR3JvdXBDaGVjayk7XHJcbiAgICAgIGNoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHVwZGF0ZUdyb3VwQ2hlY2spO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZih0aGlzLmdyb3VwQ2hlY2tib3ggIT09IGZhbHNlKXtcclxuICAgIHRoaXMuZ3JvdXBDaGVja2JveC5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB1cGRhdGVDaGVja2JveExpc3QpO1xyXG4gICAgdGhpcy5ncm91cENoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHVwZGF0ZUNoZWNrYm94TGlzdCk7XHJcbiAgfVxyXG59XHJcbiAgXHJcbi8qKlxyXG4gKiBHZXQgZ3JvdXAgY2hlY2tib3ggaW4gdGFibGUgaGVhZGVyXHJcbiAqIEByZXR1cm5zIGVsZW1lbnQgb24gdHJ1ZSAtIGZhbHNlIGlmIG5vdCBmb3VuZFxyXG4gKi9cclxuVGFibGVTZWxlY3RhYmxlUm93cy5wcm90b3R5cGUuZ2V0R3JvdXBDaGVja2JveCA9IGZ1bmN0aW9uKCl7XHJcbiAgbGV0IGNoZWNrYm94ID0gdGhpcy50YWJsZS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGhlYWQnKVswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmb3JtLWNoZWNrYm94Jyk7XHJcbiAgaWYoY2hlY2tib3gubGVuZ3RoID09PSAwKXtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbiAgcmV0dXJuIGNoZWNrYm94WzBdO1xyXG59XHJcbi8qKlxyXG4gKiBHZXQgdGFibGUgYm9keSBjaGVja2JveGVzXHJcbiAqIEByZXR1cm5zIEhUTUxDb2xsZWN0aW9uXHJcbiAqL1xyXG5UYWJsZVNlbGVjdGFibGVSb3dzLnByb3RvdHlwZS5nZXRDaGVja2JveExpc3QgPSBmdW5jdGlvbigpe1xyXG4gIHJldHVybiB0aGlzLnRhYmxlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0Ym9keScpWzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Zvcm0tY2hlY2tib3gnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZSBjaGVja2JveGVzIGluIHRhYmxlIGJvZHkgd2hlbiBncm91cCBjaGVja2JveCBpcyBjaGFuZ2VkXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgXHJcbiAqL1xyXG5mdW5jdGlvbiB1cGRhdGVDaGVja2JveExpc3QoZSl7XHJcbiAgbGV0IGNoZWNrYm94ID0gZS50YXJnZXQ7XHJcbiAgY2hlY2tib3gucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWNoZWNrZWQnKTtcclxuICBsZXQgdGFibGUgPSBlLnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xyXG4gIGxldCB0YWJsZVNlbGVjdGFibGVSb3dzID0gbmV3IFRhYmxlU2VsZWN0YWJsZVJvd3ModGFibGUpO1xyXG4gIGxldCBjaGVja2JveExpc3QgPSB0YWJsZVNlbGVjdGFibGVSb3dzLmdldENoZWNrYm94TGlzdCgpO1xyXG4gIGxldCBjaGVja2VkTnVtYmVyID0gMDtcclxuICBpZihjaGVja2JveC5jaGVja2VkKXtcclxuICAgIGZvcihsZXQgYyA9IDA7IGMgPCBjaGVja2JveExpc3QubGVuZ3RoOyBjKyspe1xyXG4gICAgICBjaGVja2JveExpc3RbY10uY2hlY2tlZCA9IHRydWU7XHJcbiAgICAgIGNoZWNrYm94TGlzdFtjXS5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgndGFibGUtcm93LXNlbGVjdGVkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tlZE51bWJlciA9IGNoZWNrYm94TGlzdC5sZW5ndGg7XHJcbiAgfSBlbHNle1xyXG4gICAgZm9yKGxldCBjID0gMDsgYyA8IGNoZWNrYm94TGlzdC5sZW5ndGg7IGMrKyl7XHJcbiAgICAgIGNoZWNrYm94TGlzdFtjXS5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgIGNoZWNrYm94TGlzdFtjXS5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LnJlbW92ZSgndGFibGUtcm93LXNlbGVjdGVkJyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiZmRzLnRhYmxlLnNlbGVjdGFibGUudXBkYXRlZFwiLCB7XHJcbiAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgIGRldGFpbDoge2NoZWNrZWROdW1iZXJ9XHJcbiAgfSk7XHJcbiAgdGFibGUuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVcGRhdGUgZ3JvdXAgY2hlY2tib3ggd2hlbiBjaGVja2JveCBpbiB0YWJsZSBib2R5IGlzIGNoYW5nZWRcclxuICogQHBhcmFtIHtFdmVudH0gZSBcclxuICovXHJcbmZ1bmN0aW9uIHVwZGF0ZUdyb3VwQ2hlY2soZSl7XHJcbiAgLy8gdXBkYXRlIGxhYmVsIGZvciBldmVudCBjaGVja2JveFxyXG4gIGlmKGUudGFyZ2V0LmNoZWNrZWQpe1xyXG4gICAgZS50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3RhYmxlLXJvdy1zZWxlY3RlZCcpO1xyXG4gIH0gZWxzZXtcclxuICAgIGUudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QucmVtb3ZlKCd0YWJsZS1yb3ctc2VsZWN0ZWQnKTtcclxuICB9XHJcbiAgbGV0IHRhYmxlID0gZS50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZTtcclxuICBsZXQgdGFibGVTZWxlY3RhYmxlUm93cyA9IG5ldyBUYWJsZVNlbGVjdGFibGVSb3dzKHRhYmxlKTtcclxuICBsZXQgZ3JvdXBDaGVja2JveCA9IHRhYmxlU2VsZWN0YWJsZVJvd3MuZ2V0R3JvdXBDaGVja2JveCgpO1xyXG4gIGlmKGdyb3VwQ2hlY2tib3ggIT09IGZhbHNlKXtcclxuICAgIGxldCBjaGVja2JveExpc3QgPSB0YWJsZVNlbGVjdGFibGVSb3dzLmdldENoZWNrYm94TGlzdCgpO1xyXG5cclxuICAgIC8vIGhvdyBtYW55IHJvdyBoYXMgYmVlbiBzZWxlY3RlZFxyXG4gICAgbGV0IGNoZWNrZWROdW1iZXIgPSAwO1xyXG4gICAgZm9yKGxldCBjID0gMDsgYyA8IGNoZWNrYm94TGlzdC5sZW5ndGg7IGMrKyl7XHJcbiAgICAgIGxldCBsb29wZWRDaGVja2JveCA9IGNoZWNrYm94TGlzdFtjXTtcclxuICAgICAgaWYobG9vcGVkQ2hlY2tib3guY2hlY2tlZCl7XHJcbiAgICAgICAgY2hlY2tlZE51bWJlcisrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmKGNoZWNrZWROdW1iZXIgPT09IGNoZWNrYm94TGlzdC5sZW5ndGgpeyAvLyBpZiBhbGwgcm93cyBoYXMgYmVlbiBzZWxlY3RlZFxyXG4gICAgICBncm91cENoZWNrYm94LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJyk7XHJcbiAgICAgIGdyb3VwQ2hlY2tib3guY2hlY2tlZCA9IHRydWU7XHJcbiAgICB9IGVsc2UgaWYoY2hlY2tlZE51bWJlciA9PSAwKXsgLy8gaWYgbm8gcm93cyBoYXMgYmVlbiBzZWxlY3RlZFxyXG4gICAgICBncm91cENoZWNrYm94LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJyk7XHJcbiAgICAgIGdyb3VwQ2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgfSBlbHNleyAvLyBpZiBzb21lIGJ1dCBub3QgYWxsIHJvd3MgaGFzIGJlZW4gc2VsZWN0ZWRcclxuICAgICAgZ3JvdXBDaGVja2JveC5zZXRBdHRyaWJ1dGUoJ2FyaWEtY2hlY2tlZCcsICdtaXhlZCcpO1xyXG4gICAgICBncm91cENoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiZmRzLnRhYmxlLnNlbGVjdGFibGUudXBkYXRlZFwiLCB7XHJcbiAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICAgIGRldGFpbDoge2NoZWNrZWROdW1iZXJ9XHJcbiAgICB9KTtcclxuICAgIHRhYmxlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVGFibGVTZWxlY3RhYmxlUm93czsiLCJjb25zdCBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZGF0YS10aXRsZSBvbiBjZWxscywgd2hlcmUgdGhlIGF0dHJpYnV0ZSBpcyBtaXNzaW5nXHJcbiAqL1xyXG5jbGFzcyBSZXNwb25zaXZlVGFibGUge1xyXG4gICAgY29uc3RydWN0b3IodGFibGUpIHtcclxuICAgICAgICBpbnNlcnRIZWFkZXJBc0F0dHJpYnV0ZXModGFibGUpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQWRkIGRhdGEgYXR0cmlidXRlcyBuZWVkZWQgZm9yIHJlc3BvbnNpdmUgbW9kZS5cclxuICogQHBhcmFtIHtIVE1MVGFibGVFbGVtZW50fSB0YWJsZUVsIFRhYmxlIGVsZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIGluc2VydEhlYWRlckFzQXR0cmlidXRlcyh0YWJsZUVsKSB7XHJcbiAgICBpZiAoIXRhYmxlRWwpIHJldHVybjtcclxuXHJcbiAgICBsZXQgaGVhZGVyID0gdGFibGVFbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGhlYWQnKTtcclxuICAgIGlmIChoZWFkZXIubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgbGV0IGhlYWRlckNlbGxFbHMgPSBoZWFkZXJbMF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RoJyk7XHJcbiAgICAgICAgaWYgKGhlYWRlckNlbGxFbHMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgaGVhZGVyQ2VsbEVscyA9IGhlYWRlclswXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChoZWFkZXJDZWxsRWxzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgY29uc3QgYm9keVJvd0VscyA9IHNlbGVjdCgndGJvZHkgdHInLCB0YWJsZUVsKTtcclxuICAgICAgICAgICAgQXJyYXkuZnJvbShib2R5Um93RWxzKS5mb3JFYWNoKHJvd0VsID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBjZWxsRWxzID0gcm93RWwuY2hpbGRyZW47XHJcbiAgICAgICAgICAgICAgICBpZiAoY2VsbEVscy5sZW5ndGggPT09IGhlYWRlckNlbGxFbHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQXJyYXkuZnJvbShoZWFkZXJDZWxsRWxzKS5mb3JFYWNoKChoZWFkZXJDZWxsRWwsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gR3JhYiBoZWFkZXIgY2VsbCB0ZXh0IGFuZCB1c2UgaXQgYm9keSBjZWxsIGRhdGEgdGl0bGUuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY2VsbEVsc1tpXS5oYXNBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSAmJiBoZWFkZXJDZWxsRWwudGFnTmFtZSA9PT0gXCJUSFwiICYmICFoZWFkZXJDZWxsRWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwic3ItaGVhZGVyXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsRWxzW2ldLnNldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScsIGhlYWRlckNlbGxFbC50ZXh0Q29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSZXNwb25zaXZlVGFibGU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxubGV0IGJyZWFrcG9pbnRzID0ge1xyXG4gICd4cyc6IDAsXHJcbiAgJ3NtJzogNTc2LFxyXG4gICdtZCc6IDc2OCxcclxuICAnbGcnOiA5OTIsXHJcbiAgJ3hsJzogMTIwMFxyXG59O1xyXG5cclxuLy8gRm9yIGVhc3kgcmVmZXJlbmNlXHJcbnZhciBrZXlzID0ge1xyXG4gIGVuZDogMzUsXHJcbiAgaG9tZTogMzYsXHJcbiAgbGVmdDogMzcsXHJcbiAgdXA6IDM4LFxyXG4gIHJpZ2h0OiAzOSxcclxuICBkb3duOiA0MCxcclxuICBkZWxldGU6IDQ2XHJcbn07XHJcblxyXG4vLyBBZGQgb3Igc3Vic3RyYWN0IGRlcGVuZGluZyBvbiBrZXkgcHJlc3NlZFxyXG52YXIgZGlyZWN0aW9uID0ge1xyXG4gIDM3OiAtMSxcclxuICAzODogLTEsXHJcbiAgMzk6IDEsXHJcbiAgNDA6IDFcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgZnVuY3Rpb25hbGl0eSB0byB0YWJuYXYgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhYm5hdiBUYWJuYXYgY29udGFpbmVyXHJcbiAqL1xyXG5mdW5jdGlvbiBUYWJuYXYgKHRhYm5hdikge1xyXG4gIHRoaXMudGFibmF2ID0gdGFibmF2O1xyXG4gIHRoaXMudGFicyA9IHRoaXMudGFibmF2LnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi50YWJuYXYtaXRlbScpO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0IGV2ZW50IG9uIGNvbXBvbmVudFxyXG4gKi9cclxuVGFibmF2LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcclxuICBpZih0aGlzLnRhYnMubGVuZ3RoID09PSAwKXtcclxuICAgIHRocm93IG5ldyBFcnJvcihgVGFibmF2IEhUTUwgc2VlbXMgdG8gYmUgbWlzc2luZyB0YWJuYXYtaXRlbS4gQWRkIHRhYm5hdiBpdGVtcyB0byBlbnN1cmUgZWFjaCBwYW5lbCBoYXMgYSBidXR0b24gaW4gdGhlIHRhYm5hdnMgbmF2aWdhdGlvbi5gKTtcclxuICB9XHJcblxyXG4gIC8vIGlmIG5vIGhhc2ggaXMgc2V0IG9uIGxvYWQsIHNldCBhY3RpdmUgdGFiXHJcbiAgaWYgKCFzZXRBY3RpdmVIYXNoVGFiKCkpIHtcclxuICAgIC8vIHNldCBmaXJzdCB0YWIgYXMgYWN0aXZlXHJcbiAgICBsZXQgdGFiID0gdGhpcy50YWJzWyAwIF07XHJcblxyXG4gICAgLy8gY2hlY2sgbm8gb3RoZXIgdGFicyBhcyBiZWVuIHNldCBhdCBkZWZhdWx0XHJcbiAgICBsZXQgYWxyZWFkeUFjdGl2ZSA9IGdldEFjdGl2ZVRhYnModGhpcy50YWJuYXYpO1xyXG4gICAgaWYgKGFscmVhZHlBY3RpdmUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHRhYiA9IGFscmVhZHlBY3RpdmVbIDAgXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBhY3RpdmF0ZSBhbmQgZGVhY3RpdmF0ZSB0YWJzXHJcbiAgICB0aGlzLmFjdGl2YXRlVGFiKHRhYiwgZmFsc2UpO1xyXG4gIH1cclxuICBsZXQgJG1vZHVsZSA9IHRoaXM7XHJcbiAgLy8gYWRkIGV2ZW50bGlzdGVuZXJzIG9uIGJ1dHRvbnNcclxuICBmb3IobGV0IHQgPSAwOyB0IDwgdGhpcy50YWJzLmxlbmd0aDsgdCArKyl7XHJcbiAgICB0aGlzLnRhYnNbIHQgXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7JG1vZHVsZS5hY3RpdmF0ZVRhYih0aGlzLCBmYWxzZSl9KTtcclxuICAgIHRoaXMudGFic1sgdCBdLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBrZXlkb3duRXZlbnRMaXN0ZW5lcik7XHJcbiAgICB0aGlzLnRhYnNbIHQgXS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGtleXVwRXZlbnRMaXN0ZW5lcik7XHJcbiAgfVxyXG59XHJcblxyXG4vKioqXHJcbiAqIFNob3cgdGFiIGFuZCBoaWRlIG90aGVyc1xyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSB0YWIgYnV0dG9uIGVsZW1lbnRcclxuICogQHBhcmFtIHtib29sZWFufSBzZXRGb2N1cyBUcnVlIGlmIHRhYiBidXR0b24gc2hvdWxkIGJlIGZvY3VzZWRcclxuICovXHJcbiBUYWJuYXYucHJvdG90eXBlLmFjdGl2YXRlVGFiID0gZnVuY3Rpb24odGFiLCBzZXRGb2N1cykge1xyXG4gIGxldCB0YWJzID0gZ2V0QWxsVGFic0luTGlzdCh0YWIpO1xyXG5cclxuICAvLyBjbG9zZSBhbGwgdGFicyBleGNlcHQgc2VsZWN0ZWRcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudGFicy5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKHRhYnNbIGkgXSA9PT0gdGFiKSB7XHJcbiAgICAgIGNvbnRpbnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YWJzWyBpIF0uZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJykge1xyXG4gICAgICBsZXQgZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLnRhYm5hdi5jbG9zZScpO1xyXG4gICAgICB0YWJzWyBpIF0uZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgIH1cclxuXHJcbiAgICB0YWJzWyBpIF0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xyXG4gICAgdGFic1sgaSBdLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsICdmYWxzZScpO1xyXG4gICAgbGV0IHRhYnBhbmVsSUQgPSB0YWJzWyBpIF0uZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyk7XHJcbiAgICBsZXQgdGFicGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YWJwYW5lbElEKVxyXG4gICAgaWYodGFicGFuZWwgPT09IG51bGwpe1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIHRhYnBhbmVsLmApO1xyXG4gICAgfVxyXG4gICAgdGFicGFuZWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcbiAgfVxyXG4gIFxyXG4gIC8vIFNldCBzZWxlY3RlZCB0YWIgdG8gYWN0aXZlXHJcbiAgbGV0IHRhYnBhbmVsSUQgPSB0YWIuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyk7XHJcbiAgbGV0IHRhYnBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFicGFuZWxJRCk7XHJcbiAgaWYodGFicGFuZWwgPT09IG51bGwpe1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBhY2NvcmRpb24gcGFuZWwuYCk7XHJcbiAgfVxyXG5cclxuICB0YWIuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKTtcclxuICB0YWJwYW5lbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgdGFiLnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcclxuXHJcbiAgLy8gU2V0IGZvY3VzIHdoZW4gcmVxdWlyZWRcclxuICBpZiAoc2V0Rm9jdXMpIHtcclxuICAgIHRhYi5mb2N1cygpO1xyXG4gIH1cclxuXHJcbiAgbGV0IGV2ZW50Q2hhbmdlZCA9IG5ldyBFdmVudCgnZmRzLnRhYm5hdi5jaGFuZ2VkJyk7XHJcbiAgdGFiLnBhcmVudE5vZGUuZGlzcGF0Y2hFdmVudChldmVudENoYW5nZWQpO1xyXG5cclxuICBsZXQgZXZlbnRPcGVuID0gbmV3IEV2ZW50KCdmZHMudGFibmF2Lm9wZW4nKTtcclxuICB0YWIuZGlzcGF0Y2hFdmVudChldmVudE9wZW4pO1xyXG59XHJcblxyXG4vKipcclxuICogQWRkIGtleWRvd24gZXZlbnRzIHRvIHRhYm5hdiBjb21wb25lbnRcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCBcclxuICovXHJcbmZ1bmN0aW9uIGtleWRvd25FdmVudExpc3RlbmVyIChldmVudCkge1xyXG4gIGxldCBrZXkgPSBldmVudC5rZXlDb2RlO1xyXG5cclxuICBzd2l0Y2ggKGtleSkge1xyXG4gICAgY2FzZSBrZXlzLmVuZDpcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgLy8gQWN0aXZhdGUgbGFzdCB0YWJcclxuICAgICAgZm9jdXNMYXN0VGFiKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBrZXlzLmhvbWU6XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIC8vIEFjdGl2YXRlIGZpcnN0IHRhYlxyXG4gICAgICBmb2N1c0ZpcnN0VGFiKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgLy8gVXAgYW5kIGRvd24gYXJlIGluIGtleWRvd25cclxuICAgIC8vIGJlY2F1c2Ugd2UgbmVlZCB0byBwcmV2ZW50IHBhZ2Ugc2Nyb2xsID46KVxyXG4gICAgY2FzZSBrZXlzLnVwOlxyXG4gICAgY2FzZSBrZXlzLmRvd246XHJcbiAgICAgIGRldGVybWluZU9yaWVudGF0aW9uKGV2ZW50KTtcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQWRkIGtleXVwIGV2ZW50cyB0byB0YWJuYXYgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgXHJcbiAqL1xyXG5mdW5jdGlvbiBrZXl1cEV2ZW50TGlzdGVuZXIgKGV2ZW50KSB7XHJcbiAgbGV0IGtleSA9IGV2ZW50LmtleUNvZGU7XHJcblxyXG4gIHN3aXRjaCAoa2V5KSB7XHJcbiAgICBjYXNlIGtleXMubGVmdDpcclxuICAgIGNhc2Uga2V5cy5yaWdodDpcclxuICAgICAgZGV0ZXJtaW5lT3JpZW50YXRpb24oZXZlbnQpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2Uga2V5cy5kZWxldGU6XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBrZXlzLmVudGVyOlxyXG4gICAgY2FzZSBrZXlzLnNwYWNlOlxyXG4gICAgICBuZXcgVGFibmF2KGV2ZW50LnRhcmdldC5wYXJlbnROb2RlKS5hY3RpdmF0ZVRhYihldmVudC50YXJnZXQsIHRydWUpO1xyXG4gICAgICBicmVhaztcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBXaGVuIGEgdGFibGlzdCBhcmlhLW9yaWVudGF0aW9uIGlzIHNldCB0byB2ZXJ0aWNhbCxcclxuICogb25seSB1cCBhbmQgZG93biBhcnJvdyBzaG91bGQgZnVuY3Rpb24uXHJcbiAqIEluIGFsbCBvdGhlciBjYXNlcyBvbmx5IGxlZnQgYW5kIHJpZ2h0IGFycm93IGZ1bmN0aW9uLlxyXG4gKi9cclxuZnVuY3Rpb24gZGV0ZXJtaW5lT3JpZW50YXRpb24gKGV2ZW50KSB7XHJcbiAgbGV0IGtleSA9IGV2ZW50LmtleUNvZGU7XHJcblxyXG4gIGxldCB3PXdpbmRvdyxcclxuICAgIGQ9ZG9jdW1lbnQsXHJcbiAgICBlPWQuZG9jdW1lbnRFbGVtZW50LFxyXG4gICAgZz1kLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbIDAgXSxcclxuICAgIHg9dy5pbm5lcldpZHRofHxlLmNsaWVudFdpZHRofHxnLmNsaWVudFdpZHRoLFxyXG4gICAgeT13LmlubmVySGVpZ2h0fHxlLmNsaWVudEhlaWdodHx8Zy5jbGllbnRIZWlnaHQ7XHJcblxyXG4gIGxldCB2ZXJ0aWNhbCA9IHggPCBicmVha3BvaW50cy5tZDtcclxuICBsZXQgcHJvY2VlZCA9IGZhbHNlO1xyXG5cclxuICBpZiAodmVydGljYWwpIHtcclxuICAgIGlmIChrZXkgPT09IGtleXMudXAgfHwga2V5ID09PSBrZXlzLmRvd24pIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgcHJvY2VlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgaWYgKGtleSA9PT0ga2V5cy5sZWZ0IHx8IGtleSA9PT0ga2V5cy5yaWdodCkge1xyXG4gICAgICBwcm9jZWVkID0gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKHByb2NlZWQpIHtcclxuICAgIHN3aXRjaFRhYk9uQXJyb3dQcmVzcyhldmVudCk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogRWl0aGVyIGZvY3VzIHRoZSBuZXh0LCBwcmV2aW91cywgZmlyc3QsIG9yIGxhc3QgdGFiXHJcbiAqIGRlcGVuZGluZyBvbiBrZXkgcHJlc3NlZFxyXG4gKi9cclxuZnVuY3Rpb24gc3dpdGNoVGFiT25BcnJvd1ByZXNzIChldmVudCkge1xyXG4gIHZhciBwcmVzc2VkID0gZXZlbnQua2V5Q29kZTtcclxuICBpZiAoZGlyZWN0aW9uWyBwcmVzc2VkIF0pIHtcclxuICAgIGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XHJcbiAgICBsZXQgdGFicyA9IGdldEFsbFRhYnNJbkxpc3QodGFyZ2V0KTtcclxuICAgIGxldCBpbmRleCA9IGdldEluZGV4T2ZFbGVtZW50SW5MaXN0KHRhcmdldCwgdGFicyk7XHJcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgIGlmICh0YWJzWyBpbmRleCArIGRpcmVjdGlvblsgcHJlc3NlZCBdIF0pIHtcclxuICAgICAgICB0YWJzWyBpbmRleCArIGRpcmVjdGlvblsgcHJlc3NlZCBdIF0uZm9jdXMoKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChwcmVzc2VkID09PSBrZXlzLmxlZnQgfHwgcHJlc3NlZCA9PT0ga2V5cy51cCkge1xyXG4gICAgICAgIGZvY3VzTGFzdFRhYih0YXJnZXQpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKHByZXNzZWQgPT09IGtleXMucmlnaHQgfHwgcHJlc3NlZCA9PSBrZXlzLmRvd24pIHtcclxuICAgICAgICBmb2N1c0ZpcnN0VGFiKHRhcmdldCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgYWxsIGFjdGl2ZSB0YWJzIGluIGxpc3RcclxuICogQHBhcmFtIHRhYm5hdiBwYXJlbnQgLnRhYm5hdiBlbGVtZW50XHJcbiAqIEByZXR1cm5zIHJldHVybnMgbGlzdCBvZiBhY3RpdmUgdGFicyBpZiBhbnlcclxuICovXHJcbmZ1bmN0aW9uIGdldEFjdGl2ZVRhYnMgKHRhYm5hdikge1xyXG4gIHJldHVybiB0YWJuYXYucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uLnRhYm5hdi1pdGVtW2FyaWEtc2VsZWN0ZWQ9dHJ1ZV0nKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBhIGxpc3Qgb2YgYWxsIGJ1dHRvbiB0YWJzIGluIGN1cnJlbnQgdGFibGlzdFxyXG4gKiBAcGFyYW0gdGFiIEJ1dHRvbiB0YWIgZWxlbWVudFxyXG4gKiBAcmV0dXJucyB7Kn0gcmV0dXJuIGFycmF5IG9mIHRhYnNcclxuICovXHJcbmZ1bmN0aW9uIGdldEFsbFRhYnNJbkxpc3QgKHRhYikge1xyXG4gIGxldCBwYXJlbnROb2RlID0gdGFiLnBhcmVudE5vZGU7XHJcbiAgaWYgKHBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCd0YWJuYXYnKSkge1xyXG4gICAgcmV0dXJuIHBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uLnRhYm5hdi1pdGVtJyk7XHJcbiAgfVxyXG4gIHJldHVybiBbXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBpbmRleCBvZiBlbGVtZW50IGluIGxpc3RcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBcclxuICogQHBhcmFtIHtIVE1MQ29sbGVjdGlvbn0gbGlzdCBcclxuICogQHJldHVybnMge2luZGV4fVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0SW5kZXhPZkVsZW1lbnRJbkxpc3QgKGVsZW1lbnQsIGxpc3Qpe1xyXG4gIGxldCBpbmRleCA9IC0xO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKyApe1xyXG4gICAgaWYobGlzdFsgaSBdID09PSBlbGVtZW50KXtcclxuICAgICAgaW5kZXggPSBpO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBpbmRleDtcclxufVxyXG5cclxuLyoqXHJcbiAqIENoZWNrcyBpZiB0aGVyZSBpcyBhIHRhYiBoYXNoIGluIHRoZSB1cmwgYW5kIGFjdGl2YXRlcyB0aGUgdGFiIGFjY29yZGluZ2x5XHJcbiAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm5zIHRydWUgaWYgdGFiIGhhcyBiZWVuIHNldCAtIHJldHVybnMgZmFsc2UgaWYgbm8gdGFiIGhhcyBiZWVuIHNldCB0byBhY3RpdmVcclxuICovXHJcbmZ1bmN0aW9uIHNldEFjdGl2ZUhhc2hUYWIgKCkge1xyXG4gIGxldCBoYXNoID0gbG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjJywgJycpO1xyXG4gIGlmIChoYXNoICE9PSAnJykge1xyXG4gICAgbGV0IHRhYiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbi50YWJuYXYtaXRlbVthcmlhLWNvbnRyb2xzPVwiIycgKyBoYXNoICsgJ1wiXScpO1xyXG4gICAgaWYgKHRhYiAhPT0gbnVsbCkge1xyXG4gICAgICBhY3RpdmF0ZVRhYih0YWIsIGZhbHNlKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBmaXJzdCB0YWIgYnkgdGFiIGluIGxpc3RcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gdGFiIFxyXG4gKi9cclxuZnVuY3Rpb24gZm9jdXNGaXJzdFRhYiAodGFiKSB7XHJcbiAgZ2V0QWxsVGFic0luTGlzdCh0YWIpWyAwIF0uZm9jdXMoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBsYXN0IHRhYiBieSB0YWIgaW4gbGlzdFxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSB0YWIgXHJcbiAqL1xyXG5mdW5jdGlvbiBmb2N1c0xhc3RUYWIgKHRhYikge1xyXG4gIGxldCB0YWJzID0gZ2V0QWxsVGFic0luTGlzdCh0YWIpO1xyXG4gIHRhYnNbIHRhYnMubGVuZ3RoIC0gMSBdLmZvY3VzKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRhYm5hdjsiLCIndXNlIHN0cmljdCc7XHJcbi8qKlxyXG4gKiBTaG93L2hpZGUgdG9hc3QgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgXHJcbiAqL1xyXG5mdW5jdGlvbiBUb2FzdCAoZWxlbWVudCl7XHJcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG59XHJcblxyXG4vKipcclxuICogU2hvdyB0b2FzdFxyXG4gKi9cclxuVG9hc3QucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcclxuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzaG93aW5nJyk7XHJcbiAgICB0aGlzLmVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9hc3QtY2xvc2UnKVswXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgbGV0IHRvYXN0ID0gdGhpcy5wYXJlbnROb2RlLnBhcmVudE5vZGU7XHJcbiAgICAgICAgbmV3IFRvYXN0KHRvYXN0KS5oaWRlKCk7XHJcbiAgICB9KTtcclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShzaG93VG9hc3QpO1xyXG59XHJcblxyXG4vKipcclxuICogSGlkZSB0b2FzdFxyXG4gKi9cclxuVG9hc3QucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcclxuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7ICAgICAgICAgXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGRzIGNsYXNzZXMgdG8gbWFrZSBzaG93IGFuaW1hdGlvblxyXG4gKi9cclxuZnVuY3Rpb24gc2hvd1RvYXN0KCl7XHJcbiAgICBsZXQgdG9hc3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRvYXN0LnNob3dpbmcnKTtcclxuICAgIGZvcihsZXQgdCA9IDA7IHQgPCB0b2FzdHMubGVuZ3RoOyB0Kyspe1xyXG4gICAgICAgIGxldCB0b2FzdCA9IHRvYXN0c1t0XTtcclxuICAgICAgICB0b2FzdC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93aW5nJyk7XHJcbiAgICAgICAgdG9hc3QuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUb2FzdDsiLCIndXNlIHN0cmljdCc7XHJcbi8qKlxyXG4gKiBTZXQgdG9vbHRpcCBvbiBlbGVtZW50XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCB3aGljaCBoYXMgdG9vbHRpcFxyXG4gKi9cclxuZnVuY3Rpb24gVG9vbHRpcChlbGVtZW50KSB7XHJcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgaWYgKHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9vbHRpcCcpID09PSBudWxsKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUb29sdGlwIHRleHQgaXMgbWlzc2luZy4gQWRkIGF0dHJpYnV0ZSBkYXRhLXRvb2x0aXAgYW5kIHRoZSBjb250ZW50IG9mIHRoZSB0b29sdGlwIGFzIHZhbHVlLmApO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogU2V0IGV2ZW50bGlzdGVuZXJzXHJcbiAqL1xyXG5Ub29sdGlwLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IG1vZHVsZSA9IHRoaXM7XHJcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgbGV0IHRyaWdnZXIgPSBlLnRhcmdldDtcclxuICAgICAgICBpZiAodHJpZ2dlci5jbGFzc0xpc3QuY29udGFpbnMoJ3Rvb2x0aXAtaG92ZXInKSA9PT0gZmFsc2UgJiYgdHJpZ2dlci5jbGFzc0xpc3QuY29udGFpbnMoJ3Rvb2x0aXAtZm9jdXMnKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgY2xvc2VBbGxUb29sdGlwcyhlKTtcclxuICAgICAgICAgICAgdHJpZ2dlci5jbGFzc0xpc3QuYWRkKFwidG9vbHRpcC1ob3ZlclwiKTtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHJpZ2dlci5jbGFzc0xpc3QuY29udGFpbnMoJ3Rvb2x0aXAtaG92ZXInKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZS50YXJnZXQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpICE9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkVG9vbHRpcChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgMzAwKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgbGV0IHRyaWdnZXIgPSBlLnRhcmdldDtcclxuICAgICAgICBpZiAodHJpZ2dlci5jbGFzc0xpc3QuY29udGFpbnMoJ3Rvb2x0aXAtaG92ZXInKSkge1xyXG4gICAgICAgICAgICB0cmlnZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ3Rvb2x0aXAtaG92ZXInKTtcclxuICAgICAgICAgICAgdmFyIHRvb2x0aXBJZCA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICAgICAgICAgIGxldCB0b29sdGlwRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXBJZCk7XHJcbiAgICAgICAgICAgIGlmICh0b29sdGlwRWxlbWVudCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY2xvc2VIb3ZlclRvb2x0aXAodHJpZ2dlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICB2YXIga2V5ID0gZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZTtcclxuICAgICAgICBpZiAoa2V5ID09PSAyNykge1xyXG4gICAgICAgICAgICB2YXIgdG9vbHRpcCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICAgICAgICAgIGlmICh0b29sdGlwICE9PSBudWxsICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmICh0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAtdHJpZ2dlcicpID09PSAnY2xpY2snKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgdmFyIHRyaWdnZXIgPSBlLnRhcmdldDtcclxuICAgICAgICAgICAgY2xvc2VBbGxUb29sdGlwcyhlKTtcclxuICAgICAgICAgICAgdHJpZ2dlci5jbGFzc0xpc3QuYWRkKCd0b29sdGlwLWZvY3VzJyk7XHJcbiAgICAgICAgICAgIHRyaWdnZXIuY2xhc3NMaXN0LnJlbW92ZSgndG9vbHRpcC1ob3ZlcicpO1xyXG4gICAgICAgICAgICBpZiAodHJpZ2dlci5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKSAhPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBhZGRUb29sdGlwKHRyaWdnZXIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZUFsbFRvb2x0aXBzKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZUFsbFRvb2x0aXBzKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDbG9zZSBhbGwgdG9vbHRpcHNcclxuICovXHJcbmZ1bmN0aW9uIGNsb3NlQWxsKCkge1xyXG4gICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXRvb2x0aXBbYXJpYS1kZXNjcmliZWRieV0nKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgcG9wcGVyID0gZWxlbWVudHNbaV0uZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICAgICAgZWxlbWVudHNbaV0ucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwb3BwZXIpKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gYWRkVG9vbHRpcCh0cmlnZ2VyKSB7XHJcbiAgICB2YXIgcG9zID0gdHJpZ2dlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9vbHRpcC1wb3NpdGlvbicpIHx8ICd0b3AnO1xyXG5cclxuICAgIHZhciB0b29sdGlwID0gY3JlYXRlVG9vbHRpcCh0cmlnZ2VyLCBwb3MpO1xyXG5cclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodG9vbHRpcCk7XHJcblxyXG4gICAgcG9zaXRpb25BdCh0cmlnZ2VyLCB0b29sdGlwLCBwb3MpO1xyXG59XHJcblxyXG4vKipcclxuICogQ3JlYXRlIHRvb2x0aXAgZWxlbWVudFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IEVsZW1lbnQgd2hpY2ggdGhlIHRvb2x0aXAgaXMgYXR0YWNoZWRcclxuICogQHBhcmFtIHtzdHJpbmd9IHBvcyBQb3NpdGlvbiBvZiB0b29sdGlwICh0b3AgfCBib3R0b20pXHJcbiAqIEByZXR1cm5zIFxyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlVG9vbHRpcChlbGVtZW50LCBwb3MpIHtcclxuICAgIHZhciB0b29sdGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0b29sdGlwLmNsYXNzTmFtZSA9ICd0b29sdGlwLXBvcHBlcic7XHJcbiAgICB2YXIgcG9wcGVycyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rvb2x0aXAtcG9wcGVyJyk7XHJcbiAgICB2YXIgaWQgPSAndG9vbHRpcC0nICsgcG9wcGVycy5sZW5ndGggKyAxO1xyXG4gICAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpO1xyXG4gICAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndG9vbHRpcCcpO1xyXG4gICAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ3gtcGxhY2VtZW50JywgcG9zKTtcclxuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgaWQpO1xyXG5cclxuICAgIHZhciB0b29sdGlwSW5uZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRvb2x0aXBJbm5lci5jbGFzc05hbWUgPSAndG9vbHRpcCc7XHJcblxyXG4gICAgdmFyIHRvb2x0aXBBcnJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdG9vbHRpcEFycm93LmNsYXNzTmFtZSA9ICd0b29sdGlwLWFycm93JztcclxuICAgIHRvb2x0aXBJbm5lci5hcHBlbmRDaGlsZCh0b29sdGlwQXJyb3cpO1xyXG5cclxuICAgIHZhciB0b29sdGlwQ29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdG9vbHRpcENvbnRlbnQuY2xhc3NOYW1lID0gJ3Rvb2x0aXAtY29udGVudCc7XHJcbiAgICB0b29sdGlwQ29udGVudC5pbm5lckhUTUwgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10b29sdGlwJyk7XHJcbiAgICB0b29sdGlwSW5uZXIuYXBwZW5kQ2hpbGQodG9vbHRpcENvbnRlbnQpO1xyXG4gICAgdG9vbHRpcC5hcHBlbmRDaGlsZCh0b29sdGlwSW5uZXIpO1xyXG5cclxuICAgIHJldHVybiB0b29sdGlwO1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIFBvc2l0aW9ucyB0aGUgdG9vbHRpcC5cclxuICpcclxuICogQHBhcmFtIHtvYmplY3R9IHBhcmVudCAtIFRoZSB0cmlnZ2VyIG9mIHRoZSB0b29sdGlwLlxyXG4gKiBAcGFyYW0ge29iamVjdH0gdG9vbHRpcCAtIFRoZSB0b29sdGlwIGl0c2VsZi5cclxuICogQHBhcmFtIHtzdHJpbmd9IHBvc0hvcml6b250YWwgLSBEZXNpcmVkIGhvcml6b250YWwgcG9zaXRpb24gb2YgdGhlIHRvb2x0aXAgcmVsYXRpdmVseSB0byB0aGUgdHJpZ2dlciAobGVmdC9jZW50ZXIvcmlnaHQpXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwb3NWZXJ0aWNhbCAtIERlc2lyZWQgdmVydGljYWwgcG9zaXRpb24gb2YgdGhlIHRvb2x0aXAgcmVsYXRpdmVseSB0byB0aGUgdHJpZ2dlciAodG9wL2NlbnRlci9ib3R0b20pXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBwb3NpdGlvbkF0KHBhcmVudCwgdG9vbHRpcCwgcG9zKSB7XHJcbiAgICBsZXQgdHJpZ2dlciA9IHBhcmVudDtcclxuICAgIGxldCBhcnJvdyA9IHRvb2x0aXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1hcnJvdycpWzBdO1xyXG4gICAgbGV0IHRyaWdnZXJQb3NpdGlvbiA9IHBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICB2YXIgcGFyZW50Q29vcmRzID0gcGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCBsZWZ0LCB0b3A7XHJcblxyXG4gICAgdmFyIHRvb2x0aXBXaWR0aCA9IHRvb2x0aXAub2Zmc2V0V2lkdGg7XHJcblxyXG4gICAgdmFyIGRpc3QgPSAxMjtcclxuICAgIGxldCBhcnJvd0RpcmVjdGlvbiA9IFwiZG93blwiO1xyXG4gICAgbGVmdCA9IHBhcnNlSW50KHBhcmVudENvb3Jkcy5sZWZ0KSArICgocGFyZW50Lm9mZnNldFdpZHRoIC0gdG9vbHRpcC5vZmZzZXRXaWR0aCkgLyAyKTtcclxuXHJcbiAgICBzd2l0Y2ggKHBvcykge1xyXG4gICAgICAgIGNhc2UgJ2JvdHRvbSc6XHJcbiAgICAgICAgICAgIHRvcCA9IHBhcnNlSW50KHBhcmVudENvb3Jkcy5ib3R0b20pICsgZGlzdDtcclxuICAgICAgICAgICAgYXJyb3dEaXJlY3Rpb24gPSBcInVwXCI7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGNhc2UgJ3RvcCc6XHJcbiAgICAgICAgICAgIHRvcCA9IHBhcnNlSW50KHBhcmVudENvb3Jkcy50b3ApIC0gdG9vbHRpcC5vZmZzZXRIZWlnaHQgLSBkaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGlmIHRvb2x0aXAgaXMgb3V0IG9mIGJvdW5kcyBvbiBsZWZ0IHNpZGVcclxuICAgIGlmIChsZWZ0IDwgMCkge1xyXG4gICAgICAgIGxlZnQgPSBkaXN0O1xyXG4gICAgICAgIGxldCBlbmRQb3NpdGlvbk9uUGFnZSA9IHRyaWdnZXJQb3NpdGlvbi5sZWZ0ICsgKHRyaWdnZXIub2Zmc2V0V2lkdGggLyAyKTtcclxuICAgICAgICBsZXQgdG9vbHRpcEFycm93SGFsZldpZHRoID0gODtcclxuICAgICAgICBsZXQgYXJyb3dMZWZ0UG9zaXRpb24gPSBlbmRQb3NpdGlvbk9uUGFnZSAtIGRpc3QgLSB0b29sdGlwQXJyb3dIYWxmV2lkdGg7XHJcbiAgICAgICAgdG9vbHRpcC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0b29sdGlwLWFycm93JylbMF0uc3R5bGUubGVmdCA9IGFycm93TGVmdFBvc2l0aW9uICsgJ3B4JztcclxuICAgIH1cclxuXHJcbiAgICAvLyBpZiB0b29sdGlwIGlzIG91dCBvZiBib3VuZHMgb24gdGhlIGJvdHRvbSBvZiB0aGUgcGFnZVxyXG4gICAgaWYgKCh0b3AgKyB0b29sdGlwLm9mZnNldEhlaWdodCkgPj0gd2luZG93LmlubmVySGVpZ2h0KSB7XHJcbiAgICAgICAgdG9wID0gcGFyc2VJbnQocGFyZW50Q29vcmRzLnRvcCkgLSB0b29sdGlwLm9mZnNldEhlaWdodCAtIGRpc3Q7XHJcbiAgICAgICAgYXJyb3dEaXJlY3Rpb24gPSBcImRvd25cIjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBpZiB0b29sdGlwIGlzIG91dCBvZiBib3VuZHMgb24gdGhlIHRvcCBvZiB0aGUgcGFnZVxyXG4gICAgaWYgKHRvcCA8IDApIHtcclxuICAgICAgICB0b3AgPSBwYXJzZUludChwYXJlbnRDb29yZHMuYm90dG9tKSArIGRpc3Q7XHJcbiAgICAgICAgYXJyb3dEaXJlY3Rpb24gPSBcInVwXCI7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgKGxlZnQgKyB0b29sdGlwV2lkdGgpKSB7XHJcbiAgICAgICAgdG9vbHRpcC5zdHlsZS5yaWdodCA9IGRpc3QgKyAncHgnO1xyXG4gICAgICAgIGxldCBlbmRQb3NpdGlvbk9uUGFnZSA9IHRyaWdnZXJQb3NpdGlvbi5yaWdodCAtICh0cmlnZ2VyLm9mZnNldFdpZHRoIC8gMik7XHJcbiAgICAgICAgbGV0IHRvb2x0aXBBcnJvd0hhbGZXaWR0aCA9IDg7XHJcbiAgICAgICAgbGV0IGFycm93UmlnaHRQb3NpdGlvbiA9IHdpbmRvdy5pbm5lcldpZHRoIC0gZW5kUG9zaXRpb25PblBhZ2UgLSBkaXN0IC0gdG9vbHRpcEFycm93SGFsZldpZHRoO1xyXG4gICAgICAgIHRvb2x0aXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1hcnJvdycpWzBdLnN0eWxlLnJpZ2h0ID0gYXJyb3dSaWdodFBvc2l0aW9uICsgJ3B4JztcclxuICAgICAgICB0b29sdGlwLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rvb2x0aXAtYXJyb3cnKVswXS5zdHlsZS5sZWZ0ID0gJ2F1dG8nO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0b29sdGlwLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcclxuICAgIH1cclxuICAgIHRvb2x0aXAuc3R5bGUudG9wID0gdG9wICsgcGFnZVlPZmZzZXQgKyAncHgnO1xyXG4gICAgdG9vbHRpcC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0b29sdGlwLWFycm93JylbMF0uY2xhc3NMaXN0LmFkZChhcnJvd0RpcmVjdGlvbik7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBjbG9zZUFsbFRvb2x0aXBzKGV2ZW50LCBmb3JjZSA9IGZhbHNlKSB7XHJcbiAgICBpZiAoZm9yY2UgfHwgKCFldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdqcy10b29sdGlwJykgJiYgIWV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3Rvb2x0aXAnKSAmJiAhZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndG9vbHRpcC1jb250ZW50JykpKSB7XHJcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRvb2x0aXAtcG9wcGVyJyk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgdHJpZ2dlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1thcmlhLWRlc2NyaWJlZGJ5PScgKyBlbGVtZW50c1tpXS5nZXRBdHRyaWJ1dGUoJ2lkJykgKyAnXScpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS10b29sdGlwLWFjdGl2ZScpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ3Rvb2x0aXAtZm9jdXMnKTtcclxuICAgICAgICAgICAgdHJpZ2dlci5jbGFzc0xpc3QucmVtb3ZlKCd0b29sdGlwLWhvdmVyJyk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZWxlbWVudHNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY2xvc2VIb3ZlclRvb2x0aXAodHJpZ2dlcikge1xyXG4gICAgdmFyIHRvb2x0aXBJZCA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICBsZXQgdG9vbHRpcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwSWQpO1xyXG4gICAgdG9vbHRpcEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIG9uVG9vbHRpcEhvdmVyKTtcclxuICAgIHRvb2x0aXBFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBvblRvb2x0aXBIb3Zlcik7XHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsZXQgdG9vbHRpcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwSWQpO1xyXG4gICAgICAgIGlmICh0b29sdGlwRWxlbWVudCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoIXRyaWdnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKFwidG9vbHRpcC1ob3ZlclwiKSkge1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlVG9vbHRpcCh0cmlnZ2VyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sIDMwMCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uVG9vbHRpcEhvdmVyKGUpIHtcclxuICAgIGxldCB0b29sdGlwRWxlbWVudCA9IHRoaXM7XHJcblxyXG4gICAgbGV0IHRyaWdnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbYXJpYS1kZXNjcmliZWRieT0nICsgdG9vbHRpcEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpICsgJ10nKTtcclxuICAgIHRyaWdnZXIuY2xhc3NMaXN0LmFkZCgndG9vbHRpcC1ob3ZlcicpO1xyXG5cclxuICAgIHRvb2x0aXBFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbGV0IHRyaWdnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbYXJpYS1kZXNjcmliZWRieT0nICsgdG9vbHRpcEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpICsgJ10nKTtcclxuICAgICAgICBpZiAodHJpZ2dlciAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0cmlnZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ3Rvb2x0aXAtaG92ZXInKTtcclxuICAgICAgICAgICAgY2xvc2VIb3ZlclRvb2x0aXAodHJpZ2dlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZVRvb2x0aXAodHJpZ2dlcikge1xyXG4gICAgdmFyIHRvb2x0aXBJZCA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICBsZXQgdG9vbHRpcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwSWQpO1xyXG5cclxuICAgIGlmICh0b29sdGlwSWQgIT09IG51bGwgJiYgdG9vbHRpcEVsZW1lbnQgIT09IG51bGwpIHtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRvb2x0aXBFbGVtZW50KTtcclxuICAgIH1cclxuICAgIHRyaWdnZXIucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICB0cmlnZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ3Rvb2x0aXAtaG92ZXInKTtcclxuICAgIHRyaWdnZXIuY2xhc3NMaXN0LnJlbW92ZSgndG9vbHRpcC1mb2N1cycpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRvb2x0aXA7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIHByZWZpeDogJycsXHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuaW1wb3J0IEFjY29yZGlvbiBmcm9tICcuL2NvbXBvbmVudHMvYWNjb3JkaW9uJztcclxuaW1wb3J0IEFsZXJ0IGZyb20gJy4vY29tcG9uZW50cy9hbGVydCc7XHJcbmltcG9ydCBCYWNrVG9Ub3AgZnJvbSAnLi9jb21wb25lbnRzL2JhY2stdG8tdG9wJztcclxuaW1wb3J0IENoYXJhY3RlckxpbWl0IGZyb20gJy4vY29tcG9uZW50cy9jaGFyYWN0ZXItbGltaXQnO1xyXG5pbXBvcnQgQ2hlY2tib3hUb2dnbGVDb250ZW50IGZyb20gJy4vY29tcG9uZW50cy9jaGVja2JveC10b2dnbGUtY29udGVudCc7XHJcbmltcG9ydCBEcm9wZG93biBmcm9tICcuL2NvbXBvbmVudHMvZHJvcGRvd24nO1xyXG5pbXBvcnQgRHJvcGRvd25Tb3J0IGZyb20gJy4vY29tcG9uZW50cy9kcm9wZG93bi1zb3J0JztcclxuaW1wb3J0IEVycm9yU3VtbWFyeSBmcm9tICcuL2NvbXBvbmVudHMvZXJyb3Itc3VtbWFyeSc7XHJcbmltcG9ydCBJbnB1dFJlZ2V4TWFzayBmcm9tICcuL2NvbXBvbmVudHMvcmVnZXgtaW5wdXQtbWFzayc7XHJcbmltcG9ydCBNb2RhbCBmcm9tICcuL2NvbXBvbmVudHMvbW9kYWwnO1xyXG5pbXBvcnQgTmF2aWdhdGlvbiBmcm9tICcuL2NvbXBvbmVudHMvbmF2aWdhdGlvbic7XHJcbmltcG9ydCBSYWRpb1RvZ2dsZUdyb3VwIGZyb20gJy4vY29tcG9uZW50cy9yYWRpby10b2dnbGUtY29udGVudCc7XHJcbmltcG9ydCBSZXNwb25zaXZlVGFibGUgZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlJztcclxuaW1wb3J0IFRhYm5hdiBmcm9tICAnLi9jb21wb25lbnRzL3RhYm5hdic7XHJcbmltcG9ydCBUYWJsZVNlbGVjdGFibGVSb3dzIGZyb20gJy4vY29tcG9uZW50cy9zZWxlY3RhYmxlLXRhYmxlJztcclxuaW1wb3J0IFRvYXN0IGZyb20gJy4vY29tcG9uZW50cy90b2FzdCc7XHJcbmltcG9ydCBUb29sdGlwIGZyb20gJy4vY29tcG9uZW50cy90b29sdGlwJztcclxuY29uc3QgZGF0ZVBpY2tlciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9kYXRlLXBpY2tlcicpO1xyXG5cclxuaW1wb3J0IEZEU0FsZXJ0IGZyb20gJy4vY29tcG9uZW50cy9mZHMtYWxlcnQnO1xyXG5cclxuLyoqXHJcbiAqIFRoZSAncG9seWZpbGxzJyBkZWZpbmUga2V5IEVDTUFTY3JpcHQgNSBtZXRob2RzIHRoYXQgbWF5IGJlIG1pc3NpbmcgZnJvbVxyXG4gKiBvbGRlciBicm93c2Vycywgc28gbXVzdCBiZSBsb2FkZWQgZmlyc3QuXHJcbiAqL1xyXG5yZXF1aXJlKCcuL3BvbHlmaWxscycpO1xyXG5cclxuLyoqXHJcbiAqIEluaXQgYWxsIGNvbXBvbmVudHNcclxuICogQHBhcmFtIHtKU09OfSBvcHRpb25zIHtzY29wZTogSFRNTEVsZW1lbnR9IC0gSW5pdCBhbGwgY29tcG9uZW50cyB3aXRoaW4gc2NvcGUgKGRlZmF1bHQgaXMgZG9jdW1lbnQpXHJcbiAqL1xyXG52YXIgaW5pdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgLy8gU2V0IHRoZSBvcHRpb25zIHRvIGFuIGVtcHR5IG9iamVjdCBieSBkZWZhdWx0IGlmIG5vIG9wdGlvbnMgYXJlIHBhc3NlZC5cclxuICBvcHRpb25zID0gdHlwZW9mIG9wdGlvbnMgIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucyA6IHt9XHJcblxyXG4gIC8vIEFsbG93IHRoZSB1c2VyIHRvIGluaXRpYWxpc2UgRkRTIGluIG9ubHkgY2VydGFpbiBzZWN0aW9ucyBvZiB0aGUgcGFnZVxyXG4gIC8vIERlZmF1bHRzIHRvIHRoZSBlbnRpcmUgZG9jdW1lbnQgaWYgbm90aGluZyBpcyBzZXQuXHJcbiAgdmFyIHNjb3BlID0gdHlwZW9mIG9wdGlvbnMuc2NvcGUgIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucy5zY29wZSA6IGRvY3VtZW50XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgQWNjb3JkaW9uc1xyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RvckFjY29yZGlvbiA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2FjY29yZGlvbicpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yQWNjb3JkaW9uLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBBY2NvcmRpb24oanNTZWxlY3RvckFjY29yZGlvblsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG4gIGNvbnN0IGpzU2VsZWN0b3JBY2NvcmRpb25Cb3JkZXJlZCA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvcmRpb24tYm9yZGVyZWQ6bm90KC5hY2NvcmRpb24pJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JBY2NvcmRpb25Cb3JkZXJlZC5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgQWNjb3JkaW9uKGpzU2VsZWN0b3JBY2NvcmRpb25Cb3JkZXJlZFsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIEFsZXJ0c1xyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcblxyXG4gIGNvbnN0IGFsZXJ0c1dpdGhDbG9zZUJ1dHRvbiA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5hbGVydC5oYXMtY2xvc2UnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwgYWxlcnRzV2l0aENsb3NlQnV0dG9uLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBBbGVydChhbGVydHNXaXRoQ2xvc2VCdXR0b25bIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBCYWNrIHRvIHRvcCBidXR0b25cclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG5cclxuICBjb25zdCBiYWNrVG9Ub3BCdXR0b25zID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYmFjay10by10b3AtYnV0dG9uJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGJhY2tUb1RvcEJ1dHRvbnMubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IEJhY2tUb1RvcChiYWNrVG9Ub3BCdXR0b25zWyBjIF0pLmluaXQoKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgQ2hhcmFjdGVyIGxpbWl0XHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBqc0NoYXJhY3RlckxpbWl0ID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZm9ybS1saW1pdCcpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc0NoYXJhY3RlckxpbWl0Lmxlbmd0aDsgYysrKXtcclxuXHJcbiAgICBuZXcgQ2hhcmFjdGVyTGltaXQoanNDaGFyYWN0ZXJMaW1pdFsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG4gIFxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgQ2hlY2tib3ggY29sbGFwc2VcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JDaGVja2JveENvbGxhcHNlID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckNoZWNrYm94Q29sbGFwc2UubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IENoZWNrYm94VG9nZ2xlQ29udGVudChqc1NlbGVjdG9yQ2hlY2tib3hDb2xsYXBzZVsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIE92ZXJmbG93IG1lbnVcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JEcm9wZG93biA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWRyb3Bkb3duJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JEcm9wZG93bi5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgRHJvcGRvd24oanNTZWxlY3RvckRyb3Bkb3duWyBjIF0pLmluaXQoKTtcclxuICB9XHJcblxyXG4gIFxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgT3ZlcmZsb3cgbWVudSBzb3J0XHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBqc1NlbGVjdG9yRHJvcGRvd25Tb3J0ID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnb3ZlcmZsb3ctbWVudS0tc29ydCcpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yRHJvcGRvd25Tb3J0Lmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBEcm9wZG93blNvcnQoanNTZWxlY3RvckRyb3Bkb3duU29ydFsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIERhdGVwaWNrZXJcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGRhdGVQaWNrZXIub24oc2NvcGUpO1xyXG4gIFxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgRXJyb3Igc3VtbWFyeVxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgdmFyICRlcnJvclN1bW1hcnkgPSBzY29wZS5xdWVyeVNlbGVjdG9yKCdbZGF0YS1tb2R1bGU9XCJlcnJvci1zdW1tYXJ5XCJdJyk7XHJcbiAgbmV3IEVycm9yU3VtbWFyeSgkZXJyb3JTdW1tYXJ5KS5pbml0KCk7XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgSW5wdXQgUmVnZXggLSB1c2VkIG9uIGRhdGUgZmllbGRzXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBqc1NlbGVjdG9yUmVnZXggPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtkYXRhLWlucHV0LXJlZ2V4XScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yUmVnZXgubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IElucHV0UmVnZXhNYXNrKGpzU2VsZWN0b3JSZWdleFsgYyBdKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgTW9kYWxcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IG1vZGFscyA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5mZHMtbW9kYWwnKTtcclxuICBmb3IobGV0IGQgPSAwOyBkIDwgbW9kYWxzLmxlbmd0aDsgZCsrKSB7XHJcbiAgICBuZXcgTW9kYWwobW9kYWxzW2RdKS5pbml0KCk7XHJcbiAgfVxyXG4gIFxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgTmF2aWdhdGlvblxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgbmV3IE5hdmlnYXRpb24oKS5pbml0KCk7XHJcbiAgIFxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgUmFkaW9idXR0b24gZ3JvdXAgY29sbGFwc2VcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JSYWRpb0NvbGxhcHNlID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtcmFkaW8tdG9nZ2xlLWdyb3VwJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JSYWRpb0NvbGxhcHNlLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBSYWRpb1RvZ2dsZUdyb3VwKGpzU2VsZWN0b3JSYWRpb0NvbGxhcHNlWyBjIF0pLmluaXQoKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgUmVzcG9uc2l2ZSB0YWJsZXNcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JUYWJsZSA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RhYmxlLnRhYmxlLS1yZXNwb25zaXZlLWhlYWRlcnMsIHRhYmxlLnRhYmxlLXNtLXJlc3BvbnNpdmUtaGVhZGVycywgdGFibGUudGFibGUtbWQtcmVzcG9uc2l2ZS1oZWFkZXJzLCB0YWJsZS50YWJsZS1sZy1yZXNwb25zaXZlLWhlYWRlcnMnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvclRhYmxlLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBSZXNwb25zaXZlVGFibGUoanNTZWxlY3RvclRhYmxlWyBjIF0pO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBTZWxlY3RhYmxlIHJvd3MgaW4gdGFibGVcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0YWJsZVRhYmxlID0gc2NvcGUucXVlcnlTZWxlY3RvckFsbCgndGFibGUudGFibGUtLXNlbGVjdGFibGUnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RhYmxlVGFibGUubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IFRhYmxlU2VsZWN0YWJsZVJvd3MoanNTZWxlY3RhYmxlVGFibGVbIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBUYWJuYXZcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JUYWJuYXYgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0YWJuYXYnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvclRhYm5hdi5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgVGFibmF2KGpzU2VsZWN0b3JUYWJuYXZbIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBUb29sdGlwXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBqc1NlbGVjdG9yVG9vbHRpcCA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLXRvb2x0aXAnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvclRvb2x0aXAubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IFRvb2x0aXAoanNTZWxlY3RvclRvb2x0aXBbIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuICBcclxufTtcclxuXHJcbnZhciBpbml0Q3VzdG9tRWxlbWVudHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKGN1c3RvbUVsZW1lbnRzLmdldCgnZmRzLWFsZXJ0JykgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgd2luZG93LmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnZmRzLWFsZXJ0JywgRkRTQWxlcnQpO1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0geyBpbml0LCBBY2NvcmRpb24sIEFsZXJ0LCBCYWNrVG9Ub3AsIENoYXJhY3RlckxpbWl0LCBDaGVja2JveFRvZ2dsZUNvbnRlbnQsIERyb3Bkb3duLCBEcm9wZG93blNvcnQsIGRhdGVQaWNrZXIsIEVycm9yU3VtbWFyeSwgSW5wdXRSZWdleE1hc2ssIE1vZGFsLCBOYXZpZ2F0aW9uLCBSYWRpb1RvZ2dsZUdyb3VwLCBSZXNwb25zaXZlVGFibGUsIFRhYmxlU2VsZWN0YWJsZVJvd3MsIFRhYm5hdiwgVG9hc3QsIFRvb2x0aXAsIGluaXRDdXN0b21FbGVtZW50c307IiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgLy8gVGhpcyB1c2VkIHRvIGJlIGNvbmRpdGlvbmFsbHkgZGVwZW5kZW50IG9uIHdoZXRoZXIgdGhlXHJcbiAgLy8gYnJvd3NlciBzdXBwb3J0ZWQgdG91Y2ggZXZlbnRzOyBpZiBpdCBkaWQsIGBDTElDS2Agd2FzIHNldCB0b1xyXG4gIC8vIGB0b3VjaHN0YXJ0YC4gIEhvd2V2ZXIsIHRoaXMgaGFkIGRvd25zaWRlczpcclxuICAvL1xyXG4gIC8vICogSXQgcHJlLWVtcHRlZCBtb2JpbGUgYnJvd3NlcnMnIGRlZmF1bHQgYmVoYXZpb3Igb2YgZGV0ZWN0aW5nXHJcbiAgLy8gICB3aGV0aGVyIGEgdG91Y2ggdHVybmVkIGludG8gYSBzY3JvbGwsIHRoZXJlYnkgcHJldmVudGluZ1xyXG4gIC8vICAgdXNlcnMgZnJvbSB1c2luZyBzb21lIG9mIG91ciBjb21wb25lbnRzIGFzIHNjcm9sbCBzdXJmYWNlcy5cclxuICAvL1xyXG4gIC8vICogU29tZSBkZXZpY2VzLCBzdWNoIGFzIHRoZSBNaWNyb3NvZnQgU3VyZmFjZSBQcm8sIHN1cHBvcnQgKmJvdGgqXHJcbiAgLy8gICB0b3VjaCBhbmQgY2xpY2tzLiBUaGlzIG1lYW50IHRoZSBjb25kaXRpb25hbCBlZmZlY3RpdmVseSBkcm9wcGVkXHJcbiAgLy8gICBzdXBwb3J0IGZvciB0aGUgdXNlcidzIG1vdXNlLCBmcnVzdHJhdGluZyB1c2VycyB3aG8gcHJlZmVycmVkXHJcbiAgLy8gICBpdCBvbiB0aG9zZSBzeXN0ZW1zLlxyXG4gIENMSUNLOiAnY2xpY2snLFxyXG59O1xyXG4iLCJpbXBvcnQgJy4uLy4uL09iamVjdC9kZWZpbmVQcm9wZXJ0eSdcclxuXHJcbihmdW5jdGlvbih1bmRlZmluZWQpIHtcclxuICAvLyBEZXRlY3Rpb24gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vRmluYW5jaWFsLVRpbWVzL3BvbHlmaWxsLXNlcnZpY2UvYmxvYi9tYXN0ZXIvcGFja2FnZXMvcG9seWZpbGwtbGlicmFyeS9wb2x5ZmlsbHMvRnVuY3Rpb24vcHJvdG90eXBlL2JpbmQvZGV0ZWN0LmpzXHJcbiAgdmFyIGRldGVjdCA9ICdiaW5kJyBpbiBGdW5jdGlvbi5wcm90b3R5cGVcclxuXHJcbiAgaWYgKGRldGVjdCkgcmV0dXJuXHJcblxyXG4gIC8vIFBvbHlmaWxsIGZyb20gaHR0cHM6Ly9jZG4ucG9seWZpbGwuaW8vdjIvcG9seWZpbGwuanM/ZmVhdHVyZXM9RnVuY3Rpb24ucHJvdG90eXBlLmJpbmQmZmxhZ3M9YWx3YXlzXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZ1bmN0aW9uLnByb3RvdHlwZSwgJ2JpbmQnLCB7XHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBiaW5kKHRoYXQpIHsgLy8gLmxlbmd0aCBpcyAxXHJcbiAgICAgICAgICAvLyBhZGQgbmVjZXNzYXJ5IGVzNS1zaGltIHV0aWxpdGllc1xyXG4gICAgICAgICAgdmFyICRBcnJheSA9IEFycmF5O1xyXG4gICAgICAgICAgdmFyICRPYmplY3QgPSBPYmplY3Q7XHJcbiAgICAgICAgICB2YXIgT2JqZWN0UHJvdG90eXBlID0gJE9iamVjdC5wcm90b3R5cGU7XHJcbiAgICAgICAgICB2YXIgQXJyYXlQcm90b3R5cGUgPSAkQXJyYXkucHJvdG90eXBlO1xyXG4gICAgICAgICAgdmFyIEVtcHR5ID0gZnVuY3Rpb24gRW1wdHkoKSB7fTtcclxuICAgICAgICAgIHZhciB0b19zdHJpbmcgPSBPYmplY3RQcm90b3R5cGUudG9TdHJpbmc7XHJcbiAgICAgICAgICB2YXIgaGFzVG9TdHJpbmdUYWcgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnO1xyXG4gICAgICAgICAgdmFyIGlzQ2FsbGFibGU7IC8qIGlubGluZWQgZnJvbSBodHRwczovL25wbWpzLmNvbS9pcy1jYWxsYWJsZSAqLyB2YXIgZm5Ub1N0ciA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZywgdHJ5RnVuY3Rpb25PYmplY3QgPSBmdW5jdGlvbiB0cnlGdW5jdGlvbk9iamVjdCh2YWx1ZSkgeyB0cnkgeyBmblRvU3RyLmNhbGwodmFsdWUpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfSwgZm5DbGFzcyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsIGdlbkNsYXNzID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJzsgaXNDYWxsYWJsZSA9IGZ1bmN0aW9uIGlzQ2FsbGFibGUodmFsdWUpIHsgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Z1bmN0aW9uJykgeyByZXR1cm4gZmFsc2U7IH0gaWYgKGhhc1RvU3RyaW5nVGFnKSB7IHJldHVybiB0cnlGdW5jdGlvbk9iamVjdCh2YWx1ZSk7IH0gdmFyIHN0ckNsYXNzID0gdG9fc3RyaW5nLmNhbGwodmFsdWUpOyByZXR1cm4gc3RyQ2xhc3MgPT09IGZuQ2xhc3MgfHwgc3RyQ2xhc3MgPT09IGdlbkNsYXNzOyB9O1xyXG4gICAgICAgICAgdmFyIGFycmF5X3NsaWNlID0gQXJyYXlQcm90b3R5cGUuc2xpY2U7XHJcbiAgICAgICAgICB2YXIgYXJyYXlfY29uY2F0ID0gQXJyYXlQcm90b3R5cGUuY29uY2F0O1xyXG4gICAgICAgICAgdmFyIGFycmF5X3B1c2ggPSBBcnJheVByb3RvdHlwZS5wdXNoO1xyXG4gICAgICAgICAgdmFyIG1heCA9IE1hdGgubWF4O1xyXG4gICAgICAgICAgLy8gL2FkZCBuZWNlc3NhcnkgZXM1LXNoaW0gdXRpbGl0aWVzXHJcblxyXG4gICAgICAgICAgLy8gMS4gTGV0IFRhcmdldCBiZSB0aGUgdGhpcyB2YWx1ZS5cclxuICAgICAgICAgIHZhciB0YXJnZXQgPSB0aGlzO1xyXG4gICAgICAgICAgLy8gMi4gSWYgSXNDYWxsYWJsZShUYXJnZXQpIGlzIGZhbHNlLCB0aHJvdyBhIFR5cGVFcnJvciBleGNlcHRpb24uXHJcbiAgICAgICAgICBpZiAoIWlzQ2FsbGFibGUodGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Z1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGNhbGxlZCBvbiBpbmNvbXBhdGlibGUgJyArIHRhcmdldCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyAzLiBMZXQgQSBiZSBhIG5ldyAocG9zc2libHkgZW1wdHkpIGludGVybmFsIGxpc3Qgb2YgYWxsIG9mIHRoZVxyXG4gICAgICAgICAgLy8gICBhcmd1bWVudCB2YWx1ZXMgcHJvdmlkZWQgYWZ0ZXIgdGhpc0FyZyAoYXJnMSwgYXJnMiBldGMpLCBpbiBvcmRlci5cclxuICAgICAgICAgIC8vIFhYWCBzbGljZWRBcmdzIHdpbGwgc3RhbmQgaW4gZm9yIFwiQVwiIGlmIHVzZWRcclxuICAgICAgICAgIHZhciBhcmdzID0gYXJyYXlfc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpOyAvLyBmb3Igbm9ybWFsIGNhbGxcclxuICAgICAgICAgIC8vIDQuIExldCBGIGJlIGEgbmV3IG5hdGl2ZSBFQ01BU2NyaXB0IG9iamVjdC5cclxuICAgICAgICAgIC8vIDExLiBTZXQgdGhlIFtbUHJvdG90eXBlXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiB0byB0aGUgc3RhbmRhcmRcclxuICAgICAgICAgIC8vICAgYnVpbHQtaW4gRnVuY3Rpb24gcHJvdG90eXBlIG9iamVjdCBhcyBzcGVjaWZpZWQgaW4gMTUuMy4zLjEuXHJcbiAgICAgICAgICAvLyAxMi4gU2V0IHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIGFzIGRlc2NyaWJlZCBpblxyXG4gICAgICAgICAgLy8gICAxNS4zLjQuNS4xLlxyXG4gICAgICAgICAgLy8gMTMuIFNldCB0aGUgW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIGFzIGRlc2NyaWJlZCBpblxyXG4gICAgICAgICAgLy8gICAxNS4zLjQuNS4yLlxyXG4gICAgICAgICAgLy8gMTQuIFNldCB0aGUgW1tIYXNJbnN0YW5jZV1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgYXMgZGVzY3JpYmVkIGluXHJcbiAgICAgICAgICAvLyAgIDE1LjMuNC41LjMuXHJcbiAgICAgICAgICB2YXIgYm91bmQ7XHJcbiAgICAgICAgICB2YXIgYmluZGVyID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIGJvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vIDE1LjMuNC41LjIgW1tDb25zdHJ1Y3RdXVxyXG4gICAgICAgICAgICAgICAgICAvLyBXaGVuIHRoZSBbW0NvbnN0cnVjdF1dIGludGVybmFsIG1ldGhvZCBvZiBhIGZ1bmN0aW9uIG9iamVjdCxcclxuICAgICAgICAgICAgICAgICAgLy8gRiB0aGF0IHdhcyBjcmVhdGVkIHVzaW5nIHRoZSBiaW5kIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGFcclxuICAgICAgICAgICAgICAgICAgLy8gbGlzdCBvZiBhcmd1bWVudHMgRXh0cmFBcmdzLCB0aGUgZm9sbG93aW5nIHN0ZXBzIGFyZSB0YWtlbjpcclxuICAgICAgICAgICAgICAgICAgLy8gMS4gTGV0IHRhcmdldCBiZSB0aGUgdmFsdWUgb2YgRidzIFtbVGFyZ2V0RnVuY3Rpb25dXVxyXG4gICAgICAgICAgICAgICAgICAvLyAgIGludGVybmFsIHByb3BlcnR5LlxyXG4gICAgICAgICAgICAgICAgICAvLyAyLiBJZiB0YXJnZXQgaGFzIG5vIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgbWV0aG9kLCBhXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgVHlwZUVycm9yIGV4Y2VwdGlvbiBpcyB0aHJvd24uXHJcbiAgICAgICAgICAgICAgICAgIC8vIDMuIExldCBib3VuZEFyZ3MgYmUgdGhlIHZhbHVlIG9mIEYncyBbW0JvdW5kQXJnc11dIGludGVybmFsXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXHJcbiAgICAgICAgICAgICAgICAgIC8vIDQuIExldCBhcmdzIGJlIGEgbmV3IGxpc3QgY29udGFpbmluZyB0aGUgc2FtZSB2YWx1ZXMgYXMgdGhlXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgbGlzdCBib3VuZEFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIgZm9sbG93ZWQgYnkgdGhlIHNhbWVcclxuICAgICAgICAgICAgICAgICAgLy8gICB2YWx1ZXMgYXMgdGhlIGxpc3QgRXh0cmFBcmdzIGluIHRoZSBzYW1lIG9yZGVyLlxyXG4gICAgICAgICAgICAgICAgICAvLyA1LiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0NvbnN0cnVjdF1dIGludGVybmFsXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgbWV0aG9kIG9mIHRhcmdldCBwcm92aWRpbmcgYXJncyBhcyB0aGUgYXJndW1lbnRzLlxyXG5cclxuICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRhcmdldC5hcHBseShcclxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICBhcnJheV9jb25jYXQuY2FsbChhcmdzLCBhcnJheV9zbGljZS5jYWxsKGFyZ3VtZW50cykpXHJcbiAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgIGlmICgkT2JqZWN0KHJlc3VsdCkgPT09IHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgLy8gMTUuMy40LjUuMSBbW0NhbGxdXVxyXG4gICAgICAgICAgICAgICAgICAvLyBXaGVuIHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2Qgb2YgYSBmdW5jdGlvbiBvYmplY3QsIEYsXHJcbiAgICAgICAgICAgICAgICAgIC8vIHdoaWNoIHdhcyBjcmVhdGVkIHVzaW5nIHRoZSBiaW5kIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGFcclxuICAgICAgICAgICAgICAgICAgLy8gdGhpcyB2YWx1ZSBhbmQgYSBsaXN0IG9mIGFyZ3VtZW50cyBFeHRyYUFyZ3MsIHRoZSBmb2xsb3dpbmdcclxuICAgICAgICAgICAgICAgICAgLy8gc3RlcHMgYXJlIHRha2VuOlxyXG4gICAgICAgICAgICAgICAgICAvLyAxLiBMZXQgYm91bmRBcmdzIGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tCb3VuZEFyZ3NdXSBpbnRlcm5hbFxyXG4gICAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxyXG4gICAgICAgICAgICAgICAgICAvLyAyLiBMZXQgYm91bmRUaGlzIGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tCb3VuZFRoaXNdXSBpbnRlcm5hbFxyXG4gICAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxyXG4gICAgICAgICAgICAgICAgICAvLyAzLiBMZXQgdGFyZ2V0IGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tUYXJnZXRGdW5jdGlvbl1dIGludGVybmFsXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXHJcbiAgICAgICAgICAgICAgICAgIC8vIDQuIExldCBhcmdzIGJlIGEgbmV3IGxpc3QgY29udGFpbmluZyB0aGUgc2FtZSB2YWx1ZXMgYXMgdGhlXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgbGlzdCBib3VuZEFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIgZm9sbG93ZWQgYnkgdGhlIHNhbWVcclxuICAgICAgICAgICAgICAgICAgLy8gICB2YWx1ZXMgYXMgdGhlIGxpc3QgRXh0cmFBcmdzIGluIHRoZSBzYW1lIG9yZGVyLlxyXG4gICAgICAgICAgICAgICAgICAvLyA1LiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2RcclxuICAgICAgICAgICAgICAgICAgLy8gICBvZiB0YXJnZXQgcHJvdmlkaW5nIGJvdW5kVGhpcyBhcyB0aGUgdGhpcyB2YWx1ZSBhbmRcclxuICAgICAgICAgICAgICAgICAgLy8gICBwcm92aWRpbmcgYXJncyBhcyB0aGUgYXJndW1lbnRzLlxyXG5cclxuICAgICAgICAgICAgICAgICAgLy8gZXF1aXY6IHRhcmdldC5jYWxsKHRoaXMsIC4uLmJvdW5kQXJncywgLi4uYXJncylcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5hcHBseShcclxuICAgICAgICAgICAgICAgICAgICAgIHRoYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICBhcnJheV9jb25jYXQuY2FsbChhcmdzLCBhcnJheV9zbGljZS5jYWxsKGFyZ3VtZW50cykpXHJcbiAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIC8vIDE1LiBJZiB0aGUgW1tDbGFzc11dIGludGVybmFsIHByb3BlcnR5IG9mIFRhcmdldCBpcyBcIkZ1bmN0aW9uXCIsIHRoZW5cclxuICAgICAgICAgIC8vICAgICBhLiBMZXQgTCBiZSB0aGUgbGVuZ3RoIHByb3BlcnR5IG9mIFRhcmdldCBtaW51cyB0aGUgbGVuZ3RoIG9mIEEuXHJcbiAgICAgICAgICAvLyAgICAgYi4gU2V0IHRoZSBsZW5ndGggb3duIHByb3BlcnR5IG9mIEYgdG8gZWl0aGVyIDAgb3IgTCwgd2hpY2hldmVyIGlzXHJcbiAgICAgICAgICAvLyAgICAgICBsYXJnZXIuXHJcbiAgICAgICAgICAvLyAxNi4gRWxzZSBzZXQgdGhlIGxlbmd0aCBvd24gcHJvcGVydHkgb2YgRiB0byAwLlxyXG5cclxuICAgICAgICAgIHZhciBib3VuZExlbmd0aCA9IG1heCgwLCB0YXJnZXQubGVuZ3RoIC0gYXJncy5sZW5ndGgpO1xyXG5cclxuICAgICAgICAgIC8vIDE3LiBTZXQgdGhlIGF0dHJpYnV0ZXMgb2YgdGhlIGxlbmd0aCBvd24gcHJvcGVydHkgb2YgRiB0byB0aGUgdmFsdWVzXHJcbiAgICAgICAgICAvLyAgIHNwZWNpZmllZCBpbiAxNS4zLjUuMS5cclxuICAgICAgICAgIHZhciBib3VuZEFyZ3MgPSBbXTtcclxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm91bmRMZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgIGFycmF5X3B1c2guY2FsbChib3VuZEFyZ3MsICckJyArIGkpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIFhYWCBCdWlsZCBhIGR5bmFtaWMgZnVuY3Rpb24gd2l0aCBkZXNpcmVkIGFtb3VudCBvZiBhcmd1bWVudHMgaXMgdGhlIG9ubHlcclxuICAgICAgICAgIC8vIHdheSB0byBzZXQgdGhlIGxlbmd0aCBwcm9wZXJ0eSBvZiBhIGZ1bmN0aW9uLlxyXG4gICAgICAgICAgLy8gSW4gZW52aXJvbm1lbnRzIHdoZXJlIENvbnRlbnQgU2VjdXJpdHkgUG9saWNpZXMgZW5hYmxlZCAoQ2hyb21lIGV4dGVuc2lvbnMsXHJcbiAgICAgICAgICAvLyBmb3IgZXguKSBhbGwgdXNlIG9mIGV2YWwgb3IgRnVuY3Rpb24gY29zdHJ1Y3RvciB0aHJvd3MgYW4gZXhjZXB0aW9uLlxyXG4gICAgICAgICAgLy8gSG93ZXZlciBpbiBhbGwgb2YgdGhlc2UgZW52aXJvbm1lbnRzIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGV4aXN0c1xyXG4gICAgICAgICAgLy8gYW5kIHNvIHRoaXMgY29kZSB3aWxsIG5ldmVyIGJlIGV4ZWN1dGVkLlxyXG4gICAgICAgICAgYm91bmQgPSBGdW5jdGlvbignYmluZGVyJywgJ3JldHVybiBmdW5jdGlvbiAoJyArIGJvdW5kQXJncy5qb2luKCcsJykgKyAnKXsgcmV0dXJuIGJpbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9JykoYmluZGVyKTtcclxuXHJcbiAgICAgICAgICBpZiAodGFyZ2V0LnByb3RvdHlwZSkge1xyXG4gICAgICAgICAgICAgIEVtcHR5LnByb3RvdHlwZSA9IHRhcmdldC5wcm90b3R5cGU7XHJcbiAgICAgICAgICAgICAgYm91bmQucHJvdG90eXBlID0gbmV3IEVtcHR5KCk7XHJcbiAgICAgICAgICAgICAgLy8gQ2xlYW4gdXAgZGFuZ2xpbmcgcmVmZXJlbmNlcy5cclxuICAgICAgICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSBudWxsO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICAgIC8vIDE4LiBTZXQgdGhlIFtbRXh0ZW5zaWJsZV1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgdG8gdHJ1ZS5cclxuXHJcbiAgICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgICAvLyAxOS4gTGV0IHRocm93ZXIgYmUgdGhlIFtbVGhyb3dUeXBlRXJyb3JdXSBmdW5jdGlvbiBPYmplY3QgKDEzLjIuMykuXHJcbiAgICAgICAgICAvLyAyMC4gQ2FsbCB0aGUgW1tEZWZpbmVPd25Qcm9wZXJ0eV1dIGludGVybmFsIG1ldGhvZCBvZiBGIHdpdGhcclxuICAgICAgICAgIC8vICAgYXJndW1lbnRzIFwiY2FsbGVyXCIsIFByb3BlcnR5RGVzY3JpcHRvciB7W1tHZXRdXTogdGhyb3dlciwgW1tTZXRdXTpcclxuICAgICAgICAgIC8vICAgdGhyb3dlciwgW1tFbnVtZXJhYmxlXV06IGZhbHNlLCBbW0NvbmZpZ3VyYWJsZV1dOiBmYWxzZX0sIGFuZFxyXG4gICAgICAgICAgLy8gICBmYWxzZS5cclxuICAgICAgICAgIC8vIDIxLiBDYWxsIHRoZSBbW0RlZmluZU93blByb3BlcnR5XV0gaW50ZXJuYWwgbWV0aG9kIG9mIEYgd2l0aFxyXG4gICAgICAgICAgLy8gICBhcmd1bWVudHMgXCJhcmd1bWVudHNcIiwgUHJvcGVydHlEZXNjcmlwdG9yIHtbW0dldF1dOiB0aHJvd2VyLFxyXG4gICAgICAgICAgLy8gICBbW1NldF1dOiB0aHJvd2VyLCBbW0VudW1lcmFibGVdXTogZmFsc2UsIFtbQ29uZmlndXJhYmxlXV06IGZhbHNlfSxcclxuICAgICAgICAgIC8vICAgYW5kIGZhbHNlLlxyXG5cclxuICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICAgIC8vIE5PVEUgRnVuY3Rpb24gb2JqZWN0cyBjcmVhdGVkIHVzaW5nIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGRvIG5vdFxyXG4gICAgICAgICAgLy8gaGF2ZSBhIHByb3RvdHlwZSBwcm9wZXJ0eSBvciB0aGUgW1tDb2RlXV0sIFtbRm9ybWFsUGFyYW1ldGVyc11dLCBhbmRcclxuICAgICAgICAgIC8vIFtbU2NvcGVdXSBpbnRlcm5hbCBwcm9wZXJ0aWVzLlxyXG4gICAgICAgICAgLy8gWFhYIGNhbid0IGRlbGV0ZSBwcm90b3R5cGUgaW4gcHVyZS1qcy5cclxuXHJcbiAgICAgICAgICAvLyAyMi4gUmV0dXJuIEYuXHJcbiAgICAgICAgICByZXR1cm4gYm91bmQ7XHJcbiAgICAgIH1cclxuICB9KTtcclxufSlcclxuLmNhbGwoJ29iamVjdCcgPT09IHR5cGVvZiB3aW5kb3cgJiYgd2luZG93IHx8ICdvYmplY3QnID09PSB0eXBlb2Ygc2VsZiAmJiBzZWxmIHx8ICdvYmplY3QnID09PSB0eXBlb2YgZ2xvYmFsICYmIGdsb2JhbCB8fCB7fSk7XHJcbiIsIihmdW5jdGlvbih1bmRlZmluZWQpIHtcclxuXHJcbi8vIERldGVjdGlvbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9GaW5hbmNpYWwtVGltZXMvcG9seWZpbGwtc2VydmljZS9ibG9iL21hc3Rlci9wYWNrYWdlcy9wb2x5ZmlsbC1saWJyYXJ5L3BvbHlmaWxscy9PYmplY3QvZGVmaW5lUHJvcGVydHkvZGV0ZWN0LmpzXHJcbnZhciBkZXRlY3QgPSAoXHJcbiAgLy8gSW4gSUU4LCBkZWZpbmVQcm9wZXJ0eSBjb3VsZCBvbmx5IGFjdCBvbiBET00gZWxlbWVudHMsIHNvIGZ1bGwgc3VwcG9ydFxyXG4gIC8vIGZvciB0aGUgZmVhdHVyZSByZXF1aXJlcyB0aGUgYWJpbGl0eSB0byBzZXQgYSBwcm9wZXJ0eSBvbiBhbiBhcmJpdHJhcnkgb2JqZWN0XHJcbiAgJ2RlZmluZVByb3BlcnR5JyBpbiBPYmplY3QgJiYgKGZ1bmN0aW9uKCkge1xyXG4gIFx0dHJ5IHtcclxuICBcdFx0dmFyIGEgPSB7fTtcclxuICBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGEsICd0ZXN0Jywge3ZhbHVlOjQyfSk7XHJcbiAgXHRcdHJldHVybiB0cnVlO1xyXG4gIFx0fSBjYXRjaChlKSB7XHJcbiAgXHRcdHJldHVybiBmYWxzZVxyXG4gIFx0fVxyXG4gIH0oKSlcclxuKVxyXG5cclxuaWYgKGRldGVjdCkgcmV0dXJuXHJcblxyXG4vLyBQb2x5ZmlsbCBmcm9tIGh0dHBzOi8vY2RuLnBvbHlmaWxsLmlvL3YyL3BvbHlmaWxsLmpzP2ZlYXR1cmVzPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSZmbGFncz1hbHdheXNcclxuKGZ1bmN0aW9uIChuYXRpdmVEZWZpbmVQcm9wZXJ0eSkge1xyXG5cclxuXHR2YXIgc3VwcG9ydHNBY2Nlc3NvcnMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KCdfX2RlZmluZUdldHRlcl9fJyk7XHJcblx0dmFyIEVSUl9BQ0NFU1NPUlNfTk9UX1NVUFBPUlRFRCA9ICdHZXR0ZXJzICYgc2V0dGVycyBjYW5ub3QgYmUgZGVmaW5lZCBvbiB0aGlzIGphdmFzY3JpcHQgZW5naW5lJztcclxuXHR2YXIgRVJSX1ZBTFVFX0FDQ0VTU09SUyA9ICdBIHByb3BlcnR5IGNhbm5vdCBib3RoIGhhdmUgYWNjZXNzb3JzIGFuZCBiZSB3cml0YWJsZSBvciBoYXZlIGEgdmFsdWUnO1xyXG5cclxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5LCBkZXNjcmlwdG9yKSB7XHJcblxyXG5cdFx0Ly8gV2hlcmUgbmF0aXZlIHN1cHBvcnQgZXhpc3RzLCBhc3N1bWUgaXRcclxuXHRcdGlmIChuYXRpdmVEZWZpbmVQcm9wZXJ0eSAmJiAob2JqZWN0ID09PSB3aW5kb3cgfHwgb2JqZWN0ID09PSBkb2N1bWVudCB8fCBvYmplY3QgPT09IEVsZW1lbnQucHJvdG90eXBlIHx8IG9iamVjdCBpbnN0YW5jZW9mIEVsZW1lbnQpKSB7XHJcblx0XHRcdHJldHVybiBuYXRpdmVEZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5LCBkZXNjcmlwdG9yKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAob2JqZWN0ID09PSBudWxsIHx8ICEob2JqZWN0IGluc3RhbmNlb2YgT2JqZWN0IHx8IHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnKSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuZGVmaW5lUHJvcGVydHkgY2FsbGVkIG9uIG5vbi1vYmplY3QnKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIShkZXNjcmlwdG9yIGluc3RhbmNlb2YgT2JqZWN0KSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm9wZXJ0eSBkZXNjcmlwdGlvbiBtdXN0IGJlIGFuIG9iamVjdCcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBwcm9wZXJ0eVN0cmluZyA9IFN0cmluZyhwcm9wZXJ0eSk7XHJcblx0XHR2YXIgaGFzVmFsdWVPcldyaXRhYmxlID0gJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yIHx8ICd3cml0YWJsZScgaW4gZGVzY3JpcHRvcjtcclxuXHRcdHZhciBnZXR0ZXJUeXBlID0gJ2dldCcgaW4gZGVzY3JpcHRvciAmJiB0eXBlb2YgZGVzY3JpcHRvci5nZXQ7XHJcblx0XHR2YXIgc2V0dGVyVHlwZSA9ICdzZXQnIGluIGRlc2NyaXB0b3IgJiYgdHlwZW9mIGRlc2NyaXB0b3Iuc2V0O1xyXG5cclxuXHRcdC8vIGhhbmRsZSBkZXNjcmlwdG9yLmdldFxyXG5cdFx0aWYgKGdldHRlclR5cGUpIHtcclxuXHRcdFx0aWYgKGdldHRlclR5cGUgIT09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdHZXR0ZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFzdXBwb3J0c0FjY2Vzc29ycykge1xyXG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX0FDQ0VTU09SU19OT1RfU1VQUE9SVEVEKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoaGFzVmFsdWVPcldyaXRhYmxlKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihFUlJfVkFMVUVfQUNDRVNTT1JTKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRPYmplY3QuX19kZWZpbmVHZXR0ZXJfXy5jYWxsKG9iamVjdCwgcHJvcGVydHlTdHJpbmcsIGRlc2NyaXB0b3IuZ2V0KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdG9iamVjdFtwcm9wZXJ0eVN0cmluZ10gPSBkZXNjcmlwdG9yLnZhbHVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGhhbmRsZSBkZXNjcmlwdG9yLnNldFxyXG5cdFx0aWYgKHNldHRlclR5cGUpIHtcclxuXHRcdFx0aWYgKHNldHRlclR5cGUgIT09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdTZXR0ZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFzdXBwb3J0c0FjY2Vzc29ycykge1xyXG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX0FDQ0VTU09SU19OT1RfU1VQUE9SVEVEKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoaGFzVmFsdWVPcldyaXRhYmxlKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihFUlJfVkFMVUVfQUNDRVNTT1JTKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRPYmplY3QuX19kZWZpbmVTZXR0ZXJfXy5jYWxsKG9iamVjdCwgcHJvcGVydHlTdHJpbmcsIGRlc2NyaXB0b3Iuc2V0KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBPSyB0byBkZWZpbmUgdmFsdWUgdW5jb25kaXRpb25hbGx5IC0gaWYgYSBnZXR0ZXIgaGFzIGJlZW4gc3BlY2lmaWVkIGFzIHdlbGwsIGFuIGVycm9yIHdvdWxkIGJlIHRocm93biBhYm92ZVxyXG5cdFx0aWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikge1xyXG5cdFx0XHRvYmplY3RbcHJvcGVydHlTdHJpbmddID0gZGVzY3JpcHRvci52YWx1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gb2JqZWN0O1xyXG5cdH07XHJcbn0oT2JqZWN0LmRlZmluZVByb3BlcnR5KSk7XHJcbn0pXHJcbi5jYWxsKCdvYmplY3QnID09PSB0eXBlb2Ygd2luZG93ICYmIHdpbmRvdyB8fCAnb2JqZWN0JyA9PT0gdHlwZW9mIHNlbGYgJiYgc2VsZiB8fCAnb2JqZWN0JyA9PT0gdHlwZW9mIGdsb2JhbCAmJiBnbG9iYWwgfHwge30pO1xyXG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBjb25zaXN0ZW50LXJldHVybiAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBmdW5jLW5hbWVzICovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhbHNlO1xyXG5cclxuICBmdW5jdGlvbiBDdXN0b21FdmVudChldmVudCwgX3BhcmFtcykge1xyXG4gICAgY29uc3QgcGFyYW1zID0gX3BhcmFtcyB8fCB7XHJcbiAgICAgIGJ1YmJsZXM6IGZhbHNlLFxyXG4gICAgICBjYW5jZWxhYmxlOiBmYWxzZSxcclxuICAgICAgZGV0YWlsOiBudWxsLFxyXG4gICAgfTtcclxuICAgIGNvbnN0IGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiQ3VzdG9tRXZlbnRcIik7XHJcbiAgICBldnQuaW5pdEN1c3RvbUV2ZW50KFxyXG4gICAgICBldmVudCxcclxuICAgICAgcGFyYW1zLmJ1YmJsZXMsXHJcbiAgICAgIHBhcmFtcy5jYW5jZWxhYmxlLFxyXG4gICAgICBwYXJhbXMuZGV0YWlsXHJcbiAgICApO1xyXG4gICAgcmV0dXJuIGV2dDtcclxuICB9XHJcblxyXG4gIHdpbmRvdy5DdXN0b21FdmVudCA9IEN1c3RvbUV2ZW50O1xyXG59KSgpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IGVscHJvdG8gPSB3aW5kb3cuSFRNTEVsZW1lbnQucHJvdG90eXBlO1xyXG5jb25zdCBISURERU4gPSAnaGlkZGVuJztcclxuXHJcbmlmICghKEhJRERFTiBpbiBlbHByb3RvKSkge1xyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbHByb3RvLCBISURERU4sIHtcclxuICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoSElEREVOKTtcclxuICAgIH0sXHJcbiAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShISURERU4sICcnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZShISURERU4pO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0pO1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLy8gcG9seWZpbGxzIEhUTUxFbGVtZW50LnByb3RvdHlwZS5jbGFzc0xpc3QgYW5kIERPTVRva2VuTGlzdFxyXG5yZXF1aXJlKCdjbGFzc2xpc3QtcG9seWZpbGwnKTtcclxuLy8gcG9seWZpbGxzIEhUTUxFbGVtZW50LnByb3RvdHlwZS5oaWRkZW5cclxucmVxdWlyZSgnLi9lbGVtZW50LWhpZGRlbicpO1xyXG5cclxuLy8gcG9seWZpbGxzIE51bWJlci5pc05hTigpXHJcbnJlcXVpcmUoXCIuL251bWJlci1pcy1uYW5cIik7XHJcblxyXG4vLyBwb2x5ZmlsbHMgQ3VzdG9tRXZlbnRcclxucmVxdWlyZShcIi4vY3VzdG9tLWV2ZW50XCIpO1xyXG5cclxucmVxdWlyZSgnY29yZS1qcy9mbi9vYmplY3QvYXNzaWduJyk7XHJcbnJlcXVpcmUoJ2NvcmUtanMvZm4vYXJyYXkvZnJvbScpOyIsIk51bWJlci5pc05hTiA9XHJcbiAgTnVtYmVyLmlzTmFOIHx8XHJcbiAgZnVuY3Rpb24gaXNOYU4oaW5wdXQpIHtcclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcclxuICAgIHJldHVybiB0eXBlb2YgaW5wdXQgPT09IFwibnVtYmVyXCIgJiYgaW5wdXQgIT09IGlucHV0O1xyXG4gIH07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gKGh0bWxEb2N1bWVudCA9IGRvY3VtZW50KSA9PiBodG1sRG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcclxuIiwiY29uc3QgYXNzaWduID0gcmVxdWlyZShcIm9iamVjdC1hc3NpZ25cIik7XHJcbmNvbnN0IHJlY2VwdG9yID0gcmVxdWlyZShcInJlY2VwdG9yXCIpO1xyXG5cclxuLyoqXHJcbiAqIEBuYW1lIHNlcXVlbmNlXHJcbiAqIEBwYXJhbSB7Li4uRnVuY3Rpb259IHNlcSBhbiBhcnJheSBvZiBmdW5jdGlvbnNcclxuICogQHJldHVybiB7IGNsb3N1cmUgfSBjYWxsSG9va3NcclxuICovXHJcbi8vIFdlIHVzZSBhIG5hbWVkIGZ1bmN0aW9uIGhlcmUgYmVjYXVzZSB3ZSB3YW50IGl0IHRvIGluaGVyaXQgaXRzIGxleGljYWwgc2NvcGVcclxuLy8gZnJvbSB0aGUgYmVoYXZpb3IgcHJvcHMgb2JqZWN0LCBub3QgZnJvbSB0aGUgbW9kdWxlXHJcbmNvbnN0IHNlcXVlbmNlID0gKC4uLnNlcSkgPT5cclxuICBmdW5jdGlvbiBjYWxsSG9va3ModGFyZ2V0ID0gZG9jdW1lbnQuYm9keSkge1xyXG4gICAgc2VxLmZvckVhY2goKG1ldGhvZCkgPT4ge1xyXG4gICAgICBpZiAodHlwZW9mIHRoaXNbbWV0aG9kXSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgdGhpc1ttZXRob2RdLmNhbGwodGhpcywgdGFyZ2V0KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbi8qKlxyXG4gKiBAbmFtZSBiZWhhdmlvclxyXG4gKiBAcGFyYW0ge29iamVjdH0gZXZlbnRzXHJcbiAqIEBwYXJhbSB7b2JqZWN0P30gcHJvcHNcclxuICogQHJldHVybiB7cmVjZXB0b3IuYmVoYXZpb3J9XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IChldmVudHMsIHByb3BzKSA9PlxyXG4gIHJlY2VwdG9yLmJlaGF2aW9yKFxyXG4gICAgZXZlbnRzLFxyXG4gICAgYXNzaWduKFxyXG4gICAgICB7XHJcbiAgICAgICAgb246IHNlcXVlbmNlKFwiaW5pdFwiLCBcImFkZFwiKSxcclxuICAgICAgICBvZmY6IHNlcXVlbmNlKFwidGVhcmRvd25cIiwgXCJyZW1vdmVcIiksXHJcbiAgICAgIH0sXHJcbiAgICAgIHByb3BzXHJcbiAgICApXHJcbiAgKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5sZXQgYnJlYWtwb2ludHMgPSB7XHJcbiAgJ3hzJzogMCxcclxuICAnc20nOiA1NzYsXHJcbiAgJ21kJzogNzY4LFxyXG4gICdsZyc6IDk5MixcclxuICAneGwnOiAxMjAwXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGJyZWFrcG9pbnRzO1xyXG4iLCIvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNzU1NzQzM1xyXG5mdW5jdGlvbiBpc0VsZW1lbnRJblZpZXdwb3J0IChlbCwgd2luPXdpbmRvdyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jRWw9ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcbiAgdmFyIHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIHJlY3QudG9wID49IDAgJiZcclxuICAgIHJlY3QubGVmdCA+PSAwICYmXHJcbiAgICByZWN0LmJvdHRvbSA8PSAod2luLmlubmVySGVpZ2h0IHx8IGRvY0VsLmNsaWVudEhlaWdodCkgJiZcclxuICAgIHJlY3QucmlnaHQgPD0gKHdpbi5pbm5lcldpZHRoIHx8IGRvY0VsLmNsaWVudFdpZHRoKVxyXG4gICk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaXNFbGVtZW50SW5WaWV3cG9ydDtcclxuIiwiLy8gaU9TIGRldGVjdGlvbiBmcm9tOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS85MDM5ODg1LzE3NzcxMFxyXG5mdW5jdGlvbiBpc0lvc0RldmljZSgpIHtcclxuICByZXR1cm4gKFxyXG4gICAgdHlwZW9mIG5hdmlnYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJlxyXG4gICAgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goLyhpUG9kfGlQaG9uZXxpUGFkKS9nKSB8fFxyXG4gICAgICAobmF2aWdhdG9yLnBsYXRmb3JtID09PSBcIk1hY0ludGVsXCIgJiYgbmF2aWdhdG9yLm1heFRvdWNoUG9pbnRzID4gMSkpICYmXHJcbiAgICAhd2luZG93Lk1TU3RyZWFtXHJcbiAgKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBpc0lvc0RldmljZTtcclxuIiwiLyoqXHJcbiAqIEBuYW1lIGlzRWxlbWVudFxyXG4gKiBAZGVzYyByZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBhcmd1bWVudCBpcyBhIERPTSBlbGVtZW50LlxyXG4gKiBAcGFyYW0ge2FueX0gdmFsdWVcclxuICogQHJldHVybiB7Ym9vbGVhbn1cclxuICovXHJcbmNvbnN0IGlzRWxlbWVudCA9ICh2YWx1ZSkgPT5cclxuICB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUubm9kZVR5cGUgPT09IDE7XHJcblxyXG4vKipcclxuICogQG5hbWUgc2VsZWN0XHJcbiAqIEBkZXNjIHNlbGVjdHMgZWxlbWVudHMgZnJvbSB0aGUgRE9NIGJ5IGNsYXNzIHNlbGVjdG9yIG9yIElEIHNlbGVjdG9yLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgLSBUaGUgc2VsZWN0b3IgdG8gdHJhdmVyc2UgdGhlIERPTSB3aXRoLlxyXG4gKiBAcGFyYW0ge0RvY3VtZW50fEhUTUxFbGVtZW50P30gY29udGV4dCAtIFRoZSBjb250ZXh0IHRvIHRyYXZlcnNlIHRoZSBET01cclxuICogICBpbi4gSWYgbm90IHByb3ZpZGVkLCBpdCBkZWZhdWx0cyB0byB0aGUgZG9jdW1lbnQuXHJcbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50W119IC0gQW4gYXJyYXkgb2YgRE9NIG5vZGVzIG9yIGFuIGVtcHR5IGFycmF5LlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSAoc2VsZWN0b3IsIGNvbnRleHQpID0+IHtcclxuICBpZiAodHlwZW9mIHNlbGVjdG9yICE9PSBcInN0cmluZ1wiKSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICBpZiAoIWNvbnRleHQgfHwgIWlzRWxlbWVudChjb250ZXh0KSkge1xyXG4gICAgY29udGV4dCA9IHdpbmRvdy5kb2N1bWVudDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wYXJhbS1yZWFzc2lnblxyXG4gIH1cclxuXHJcbiAgY29uc3Qgc2VsZWN0aW9uID0gY29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoc2VsZWN0aW9uKTtcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBFWFBBTkRFRCA9ICdhcmlhLWV4cGFuZGVkJztcclxuY29uc3QgQ09OVFJPTFMgPSAnYXJpYS1jb250cm9scyc7XHJcbmNvbnN0IEhJRERFTiA9ICdhcmlhLWhpZGRlbic7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IChidXR0b24sIGV4cGFuZGVkKSA9PiB7XHJcblxyXG4gIGlmICh0eXBlb2YgZXhwYW5kZWQgIT09ICdib29sZWFuJykge1xyXG4gICAgZXhwYW5kZWQgPSBidXR0b24uZ2V0QXR0cmlidXRlKEVYUEFOREVEKSA9PT0gJ2ZhbHNlJztcclxuICB9XHJcbiAgYnV0dG9uLnNldEF0dHJpYnV0ZShFWFBBTkRFRCwgZXhwYW5kZWQpO1xyXG4gIGNvbnN0IGlkID0gYnV0dG9uLmdldEF0dHJpYnV0ZShDT05UUk9MUyk7XHJcbiAgY29uc3QgY29udHJvbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgaWYgKCFjb250cm9scykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAnTm8gdG9nZ2xlIHRhcmdldCBmb3VuZCB3aXRoIGlkOiBcIicgKyBpZCArICdcIidcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBjb250cm9scy5zZXRBdHRyaWJ1dGUoSElEREVOLCAhZXhwYW5kZWQpO1xyXG4gIHJldHVybiBleHBhbmRlZDtcclxufTtcclxuIl19
