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

},{"../polyfills/Function/prototype/bind":93,"../utils/is-in-viewport":102,"../utils/toggle":105}],73:[function(require,module,exports){
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

},{"../polyfills/Function/prototype/bind":93}],77:[function(require,module,exports){
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

},{"../config":90,"../events":92,"../utils/active-element":99,"../utils/behavior":100,"../utils/is-ios-device":103,"../utils/select":104,"receptor":70}],78:[function(require,module,exports){
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

},{"../polyfills/Function/prototype/bind":93,"./dropdown":79}],79:[function(require,module,exports){
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

},{"../utils/breakpoints":101}],80:[function(require,module,exports){
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
    $backdrop === null || $backdrop === void 0 ? void 0 : $backdrop.parentNode.removeChild($backdrop);
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

},{}],82:[function(require,module,exports){
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

},{"../utils/select":104,"array-foreach":1}],83:[function(require,module,exports){
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

},{}],84:[function(require,module,exports){
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

},{}],85:[function(require,module,exports){
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

},{}],86:[function(require,module,exports){
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

},{"../utils/select":104}],87:[function(require,module,exports){
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

},{}],88:[function(require,module,exports){
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

},{}],89:[function(require,module,exports){
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

},{}],90:[function(require,module,exports){
"use strict";

module.exports = {
  prefix: ''
};

},{}],91:[function(require,module,exports){
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
  Tooltip: _tooltip["default"]
};

},{"./components/accordion":72,"./components/alert":73,"./components/back-to-top":74,"./components/character-limit":75,"./components/checkbox-toggle-content":76,"./components/date-picker":77,"./components/dropdown":79,"./components/dropdown-sort":78,"./components/error-summary":80,"./components/modal":81,"./components/navigation":82,"./components/radio-toggle-content":83,"./components/regex-input-mask":84,"./components/selectable-table":85,"./components/table":86,"./components/tabnav":87,"./components/toast":88,"./components/tooltip":89,"./polyfills":97}],92:[function(require,module,exports){
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

},{}],93:[function(require,module,exports){
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

},{"../../Object/defineProperty":94}],94:[function(require,module,exports){
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

},{}],95:[function(require,module,exports){
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

},{}],96:[function(require,module,exports){
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

},{}],97:[function(require,module,exports){
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

},{"./custom-event":95,"./element-hidden":96,"./number-is-nan":98,"classlist-polyfill":2,"core-js/fn/array/from":3,"core-js/fn/object/assign":4}],98:[function(require,module,exports){
"use strict";

Number.isNaN = Number.isNaN || function isNaN(input) {
  // eslint-disable-next-line no-self-compare
  return typeof input === "number" && input !== input;
};

},{}],99:[function(require,module,exports){
"use strict";

module.exports = function () {
  var htmlDocument = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  return htmlDocument.activeElement;
};

},{}],100:[function(require,module,exports){
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

},{"object-assign":63,"receptor":70}],101:[function(require,module,exports){
'use strict';

var breakpoints = {
  'xs': 0,
  'sm': 576,
  'md': 768,
  'lg': 992,
  'xl': 1200
};
module.exports = breakpoints;

},{}],102:[function(require,module,exports){
"use strict";

// https://stackoverflow.com/a/7557433
function isElementInViewport(el) {
  var win = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
  var docEl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.documentElement;
  var rect = el.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (win.innerHeight || docEl.clientHeight) && rect.right <= (win.innerWidth || docEl.clientWidth);
}
module.exports = isElementInViewport;

},{}],103:[function(require,module,exports){
"use strict";

// iOS detection from: http://stackoverflow.com/a/9039885/177710
function isIosDevice() {
  return typeof navigator !== "undefined" && (navigator.userAgent.match(/(iPod|iPhone|iPad)/g) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) && !window.MSStream;
}
module.exports = isIosDevice;

},{}],104:[function(require,module,exports){
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

},{}],105:[function(require,module,exports){
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

},{}]},{},[91])(91)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXJyYXktZm9yZWFjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzc2xpc3QtcG9seWZpbGwvc3JjL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvZm4vYXJyYXkvZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ZuL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jbGFzc29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NyZWF0ZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2N0eC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RlZmluZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19mdW5jdGlvbi10by1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oYXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LWl0ZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNhbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyYXRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19saWJyYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1waWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9rZXlib2FyZGV2ZW50LWtleS1wb2x5ZmlsbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXRjaGVzLXNlbGVjdG9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2JlaGF2aW9yLmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9jbG9zZXN0LmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9jb21wb3NlLmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9kZWxlZ2F0ZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9saWIvZGVsZWdhdGVBbGwuanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2lnbm9yZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2tleW1hcC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2FjY29yZGlvbi5qcyIsInNyYy9qcy9jb21wb25lbnRzL2FsZXJ0LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvYmFjay10by10b3AuanMiLCJzcmMvanMvY29tcG9uZW50cy9jaGFyYWN0ZXItbGltaXQuanMiLCJzcmMvanMvY29tcG9uZW50cy9jaGVja2JveC10b2dnbGUtY29udGVudC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2RhdGUtcGlja2VyLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZHJvcGRvd24tc29ydC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2Ryb3Bkb3duLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZXJyb3Itc3VtbWFyeS5qcyIsInNyYy9qcy9jb21wb25lbnRzL21vZGFsLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvbmF2aWdhdGlvbi5qcyIsInNyYy9qcy9jb21wb25lbnRzL3JhZGlvLXRvZ2dsZS1jb250ZW50LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvcmVnZXgtaW5wdXQtbWFzay5qcyIsInNyYy9qcy9jb21wb25lbnRzL3NlbGVjdGFibGUtdGFibGUuanMiLCJzcmMvanMvY29tcG9uZW50cy90YWJsZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RhYm5hdi5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RvYXN0LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvdG9vbHRpcC5qcyIsInNyYy9qcy9jb25maWcuanMiLCJzcmMvanMvZGtmZHMuanMiLCJzcmMvanMvZXZlbnRzLmpzIiwic3JjL2pzL3BvbHlmaWxscy9GdW5jdGlvbi9wcm90b3R5cGUvYmluZC5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvT2JqZWN0L2RlZmluZVByb3BlcnR5LmpzIiwic3JjL2pzL3BvbHlmaWxscy9jdXN0b20tZXZlbnQuanMiLCJzcmMvanMvcG9seWZpbGxzL2VsZW1lbnQtaGlkZGVuLmpzIiwic3JjL2pzL3BvbHlmaWxscy9pbmRleC5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvbnVtYmVyLWlzLW5hbi5qcyIsInNyYy9qcy91dGlscy9hY3RpdmUtZWxlbWVudC5qcyIsInNyYy9qcy91dGlscy9iZWhhdmlvci5qcyIsInNyYy9qcy91dGlscy9icmVha3BvaW50cy5qcyIsInNyYy9qcy91dGlscy9pcy1pbi12aWV3cG9ydC5qcyIsInNyYy9qcy91dGlscy9pcy1pb3MtZGV2aWNlLmpzIiwic3JjL2pzL3V0aWxzL3NlbGVjdC5qcyIsInNyYy9qcy91dGlscy90b2dnbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTs7QUFFWixNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMs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Q0FBQyxHQUFHLFNBQVM7SUFDL0MsSUFBSSxPQUFPLEdBQUcsS0FBSyxLQUFLLFNBQVM7SUFDakMsSUFBSSxLQUFLLEdBQUcsQ0FBQztJQUNiLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDekIsSUFBSSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRO0lBQ2xDLElBQUksT0FBTyxFQUFFLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDdkU7SUFDQSxJQUFJLE1BQU0sSUFBSSxTQUFTLElBQUksRUFBRSxDQUFDLElBQUksS0FBSyxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFO01BQy9ELEtBQUssUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUN6RixjQUFjLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7TUFDeEc7SUFDRixDQUFDLE1BQU07TUFDTCxNQUFNLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7TUFDM0IsS0FBSyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxHQUFHLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUNwRCxjQUFjLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMs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QUFBLEVBQUEsR0FBQSxRQUFBLEdBQUEsWUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsV0FBQSxDQUFBLE1BQUEsSUFBQSxPQUFBLEtBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLElBQUEsSUFBQSxDQUFBLENBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxVQUFBLElBQUE7QUFBQSxTQUFBLHNCQUFBLEdBQUEsRUFBQSxDQUFBLFFBQUEsRUFBQSxXQUFBLEdBQUEsZ0NBQUEsTUFBQSxJQUFBLEdBQUEsQ0FBQSxNQUFBLENBQUEsUUFBQSxLQUFBLEdBQUEsNEJBQUEsRUFBQSxRQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsaUJBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsSUFBQSxDQUFBLEdBQUEsR0FBQSxJQUFBLFFBQUEsQ0FBQSxRQUFBLE1BQUEsQ0FBQSxFQUFBLE1BQUEsRUFBQSxVQUFBLEVBQUEsdUJBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsSUFBQSxDQUFBLEVBQUEsR0FBQSxJQUFBLE1BQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLENBQUEsS0FBQSxHQUFBLElBQUEsQ0FBQSxNQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsaUJBQUEsR0FBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLEdBQUEsR0FBQSx5QkFBQSxFQUFBLFlBQUEsRUFBQSxlQUFBLEVBQUEsR0FBQSxFQUFBLGNBQUEsTUFBQSxDQUFBLEVBQUEsTUFBQSxFQUFBLDJCQUFBLEVBQUEsUUFBQSxFQUFBLGFBQUEsSUFBQTtBQUFBLFNBQUEsZ0JBQUEsR0FBQSxRQUFBLEtBQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxVQUFBLEdBQUE7QUFDaEMsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDO0FBQzdDLElBQU0sTUFB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QSxhQUFBLEdBQUEsa0JBQUEsR0FBQSxnQkFBQSxHQUFBLFdBQUEsR0FBQSx5QkFBQSxNQUFBLElBQUEsR0FBQSxDQUFBLFdBQUEsS0FBQSxNQUFBLElBQUEsR0FBQSxLQUFBLE1BQUEsQ0FBQSxTQUFBLHFCQUFBLEdBQUEsS0FBQSxPQUFBLENBQUEsR0FBQTtBQUFBLFNBQUEsZ0JBQUEsUUFBQSxFQUFBLFdBQUEsVUFBQSxRQUFBLFlBQUEsV0FBQSxlQUFBLFNBQUE7QUFBQSxTQUFBLGtCQUFBLE1BQUEsRUFBQSxLQUFBLGFBQUEsQ0FBQSxNQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsVUFBQSxVQUFBLEdBQUEsS0FBQSxDQUFBLENBQUEsR0FBQSxVQUFBLENBQUEsVUFBQSxHQUFBLFVBQUEsQ0FBQSxVQUFBLFdBQUEsVUFBQSxDQUFBLFlBQUEsd0JBQUEsVUFBQSxFQUFBLFVBQUEsQ0FBQSxRQUFBLFNBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxNQUFBLEVBQUEsY0FBQSxDQUFBLFVBQUEsQ0FBQSxHQUFBLEdBQUEsVUFBQTtBQUFBLFNBQUEsYUFBQSxXQUFBLEVBQUEsVUFBQSxFQUFBLFdBQUEsUUFBQSxVQUFBLEVBQUEsaUJBQUEsQ0FBQSxXQUFBLENBQUEsU0FBQSxFQUFBLFVBQUEsT0FBQSxXQUFBLEVBQUEsaUJBQUEsQ0FBQSxXQUFBLEVBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsV0FBQSxpQkFBQSxRQUFBLG1CQUFBLFdBQUE7QUFBQSxTQUFBLGVBQUEsR0FBQSxRQUFBLEdBQUEsR0FBQSxZQUFBLENBQUEsR0FBQSxvQkFBQSxPQUFBLENBQUEsR0FBQSxpQkFBQSxHQUFBLEdBQUEsTUFBQSxDQUFBLEdBQUE7QUFBQSxTQUFBLGFBQUEsS0FBQSxFQUFBLElBQUEsUUFBQSxPQUFBLENBQUEsS0FBQSxrQkFBQSxLQUFBLGtCQUFBLEtBQUEsTUFBQSxJQUFBLEdBQUEsS0FBQSxDQUFBLE1BQUEsQ0FBQSxXQUFBLE9BQUEsSUFBQSxLQUFBLFNBQUEsUUFB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RCxPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDOUMsQ0FBQzs7O0FDNUJELFlBQVk7O0FBQ1osSUFBTSxRQUFRLEdBQUcsZUFBZTtBQUNoQyxJQUFNLFFBQVEsR0FBRyxlQUFlO0FBQ2hDLElBQU0sTUFBTSxHQUFHLGFBQWE7QUFFNUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUs7RUFFckMsSUFBSSxPQUFPLFFBQVEsS0FBSyxTQUFTLEVBQUU7SUFDakMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssT0FBTztFQUN0RDtFQUNBLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQztFQUN2QyxJQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQztFQUN4QyxJQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQztFQUM1QyxJQUFJLENBQUMsUUFBUSxFQUFFO0lBQ2IsTUFBTSxJQUFJLEtBQUssQ0FDYixtQ0FBbUMsR0FBRyxFQUFFLEdBQUcsR0FDN0MsQ0FBQztFQUNIO0VBRUEsUUFBUSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUM7RUFDeEMsT0FBTyxRQUFRO0FBQ2pCLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIGFycmF5LWZvcmVhY2hcbiAqICAgQXJyYXkjZm9yRWFjaCBwb255ZmlsbCBmb3Igb2xkZXIgYnJvd3NlcnNcbiAqICAgKFBvbnlmaWxsOiBBIHBvbHlmaWxsIHRoYXQgZG9lc24ndCBvdmVyd3JpdGUgdGhlIG5hdGl2ZSBtZXRob2QpXG4gKiBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90d2FkYS9hcnJheS1mb3JlYWNoXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LTIwMTYgVGFrdXRvIFdhZGFcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqICAgaHR0cHM6Ly9naXRodWIuY29tL3R3YWRhL2FycmF5LWZvcmVhY2gvYmxvYi9tYXN0ZXIvTUlULUxJQ0VOU0VcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZvckVhY2ggKGFyeSwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBpZiAoYXJ5LmZvckVhY2gpIHtcbiAgICAgICAgYXJ5LmZvckVhY2goY2FsbGJhY2ssIHRoaXNBcmcpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJ5Lmxlbmd0aDsgaSs9MSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIGFyeVtpXSwgaSwgYXJ5KTtcbiAgICB9XG59O1xuIiwiLypcbiAqIGNsYXNzTGlzdC5qczogQ3Jvc3MtYnJvd3NlciBmdWxsIGVsZW1lbnQuY2xhc3NMaXN0IGltcGxlbWVudGF0aW9uLlxuICogMS4xLjIwMTcwNDI3XG4gKlxuICogQnkgRWxpIEdyZXksIGh0dHA6Ly9lbGlncmV5LmNvbVxuICogTGljZW5zZTogRGVkaWNhdGVkIHRvIHRoZSBwdWJsaWMgZG9tYWluLlxuICogICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvY2xhc3NMaXN0LmpzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWRcbiAqL1xuXG4vKmdsb2JhbCBzZWxmLCBkb2N1bWVudCwgRE9NRXhjZXB0aW9uICovXG5cbi8qISBAc291cmNlIGh0dHA6Ly9wdXJsLmVsaWdyZXkuY29tL2dpdGh1Yi9jbGFzc0xpc3QuanMvYmxvYi9tYXN0ZXIvY2xhc3NMaXN0LmpzICovXG5cbmlmIChcImRvY3VtZW50XCIgaW4gd2luZG93LnNlbGYpIHtcblxuLy8gRnVsbCBwb2x5ZmlsbCBmb3IgYnJvd3NlcnMgd2l0aCBubyBjbGFzc0xpc3Qgc3VwcG9ydFxuLy8gSW5jbHVkaW5nIElFIDwgRWRnZSBtaXNzaW5nIFNWR0VsZW1lbnQuY2xhc3NMaXN0XG5pZiAoIShcImNsYXNzTGlzdFwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJfXCIpKSBcblx0fHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TICYmICEoXCJjbGFzc0xpc3RcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwiZ1wiKSkpIHtcblxuKGZ1bmN0aW9uICh2aWV3KSB7XG5cblwidXNlIHN0cmljdFwiO1xuXG5pZiAoISgnRWxlbWVudCcgaW4gdmlldykpIHJldHVybjtcblxudmFyXG5cdCAgY2xhc3NMaXN0UHJvcCA9IFwiY2xhc3NMaXN0XCJcblx0LCBwcm90b1Byb3AgPSBcInByb3RvdHlwZVwiXG5cdCwgZWxlbUN0clByb3RvID0gdmlldy5FbGVtZW50W3Byb3RvUHJvcF1cblx0LCBvYmpDdHIgPSBPYmplY3Rcblx0LCBzdHJUcmltID0gU3RyaW5nW3Byb3RvUHJvcF0udHJpbSB8fCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgXCJcIik7XG5cdH1cblx0LCBhcnJJbmRleE9mID0gQXJyYXlbcHJvdG9Qcm9wXS5pbmRleE9mIHx8IGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0dmFyXG5cdFx0XHQgIGkgPSAwXG5cdFx0XHQsIGxlbiA9IHRoaXMubGVuZ3RoXG5cdFx0O1xuXHRcdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkge1xuXHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIC0xO1xuXHR9XG5cdC8vIFZlbmRvcnM6IHBsZWFzZSBhbGxvdyBjb250ZW50IGNvZGUgdG8gaW5zdGFudGlhdGUgRE9NRXhjZXB0aW9uc1xuXHQsIERPTUV4ID0gZnVuY3Rpb24gKHR5cGUsIG1lc3NhZ2UpIHtcblx0XHR0aGlzLm5hbWUgPSB0eXBlO1xuXHRcdHRoaXMuY29kZSA9IERPTUV4Y2VwdGlvblt0eXBlXTtcblx0XHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuXHR9XG5cdCwgY2hlY2tUb2tlbkFuZEdldEluZGV4ID0gZnVuY3Rpb24gKGNsYXNzTGlzdCwgdG9rZW4pIHtcblx0XHRpZiAodG9rZW4gPT09IFwiXCIpIHtcblx0XHRcdHRocm93IG5ldyBET01FeChcblx0XHRcdFx0ICBcIlNZTlRBWF9FUlJcIlxuXHRcdFx0XHQsIFwiQW4gaW52YWxpZCBvciBpbGxlZ2FsIHN0cmluZyB3YXMgc3BlY2lmaWVkXCJcblx0XHRcdCk7XG5cdFx0fVxuXHRcdGlmICgvXFxzLy50ZXN0KHRva2VuKSkge1xuXHRcdFx0dGhyb3cgbmV3IERPTUV4KFxuXHRcdFx0XHQgIFwiSU5WQUxJRF9DSEFSQUNURVJfRVJSXCJcblx0XHRcdFx0LCBcIlN0cmluZyBjb250YWlucyBhbiBpbnZhbGlkIGNoYXJhY3RlclwiXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRyZXR1cm4gYXJySW5kZXhPZi5jYWxsKGNsYXNzTGlzdCwgdG9rZW4pO1xuXHR9XG5cdCwgQ2xhc3NMaXN0ID0gZnVuY3Rpb24gKGVsZW0pIHtcblx0XHR2YXJcblx0XHRcdCAgdHJpbW1lZENsYXNzZXMgPSBzdHJUcmltLmNhbGwoZWxlbS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiKVxuXHRcdFx0LCBjbGFzc2VzID0gdHJpbW1lZENsYXNzZXMgPyB0cmltbWVkQ2xhc3Nlcy5zcGxpdCgvXFxzKy8pIDogW11cblx0XHRcdCwgaSA9IDBcblx0XHRcdCwgbGVuID0gY2xhc3Nlcy5sZW5ndGhcblx0XHQ7XG5cdFx0Zm9yICg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0dGhpcy5wdXNoKGNsYXNzZXNbaV0pO1xuXHRcdH1cblx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRlbGVtLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHRoaXMudG9TdHJpbmcoKSk7XG5cdFx0fTtcblx0fVxuXHQsIGNsYXNzTGlzdFByb3RvID0gQ2xhc3NMaXN0W3Byb3RvUHJvcF0gPSBbXVxuXHQsIGNsYXNzTGlzdEdldHRlciA9IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gbmV3IENsYXNzTGlzdCh0aGlzKTtcblx0fVxuO1xuLy8gTW9zdCBET01FeGNlcHRpb24gaW1wbGVtZW50YXRpb25zIGRvbid0IGFsbG93IGNhbGxpbmcgRE9NRXhjZXB0aW9uJ3MgdG9TdHJpbmcoKVxuLy8gb24gbm9uLURPTUV4Y2VwdGlvbnMuIEVycm9yJ3MgdG9TdHJpbmcoKSBpcyBzdWZmaWNpZW50IGhlcmUuXG5ET01FeFtwcm90b1Byb3BdID0gRXJyb3JbcHJvdG9Qcm9wXTtcbmNsYXNzTGlzdFByb3RvLml0ZW0gPSBmdW5jdGlvbiAoaSkge1xuXHRyZXR1cm4gdGhpc1tpXSB8fCBudWxsO1xufTtcbmNsYXNzTGlzdFByb3RvLmNvbnRhaW5zID0gZnVuY3Rpb24gKHRva2VuKSB7XG5cdHRva2VuICs9IFwiXCI7XG5cdHJldHVybiBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pICE9PSAtMTtcbn07XG5jbGFzc0xpc3RQcm90by5hZGQgPSBmdW5jdGlvbiAoKSB7XG5cdHZhclxuXHRcdCAgdG9rZW5zID0gYXJndW1lbnRzXG5cdFx0LCBpID0gMFxuXHRcdCwgbCA9IHRva2Vucy5sZW5ndGhcblx0XHQsIHRva2VuXG5cdFx0LCB1cGRhdGVkID0gZmFsc2Vcblx0O1xuXHRkbyB7XG5cdFx0dG9rZW4gPSB0b2tlbnNbaV0gKyBcIlwiO1xuXHRcdGlmIChjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pID09PSAtMSkge1xuXHRcdFx0dGhpcy5wdXNoKHRva2VuKTtcblx0XHRcdHVwZGF0ZWQgPSB0cnVlO1xuXHRcdH1cblx0fVxuXHR3aGlsZSAoKytpIDwgbCk7XG5cblx0aWYgKHVwZGF0ZWQpIHtcblx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUoKTtcblx0fVxufTtcbmNsYXNzTGlzdFByb3RvLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0dmFyXG5cdFx0ICB0b2tlbnMgPSBhcmd1bWVudHNcblx0XHQsIGkgPSAwXG5cdFx0LCBsID0gdG9rZW5zLmxlbmd0aFxuXHRcdCwgdG9rZW5cblx0XHQsIHVwZGF0ZWQgPSBmYWxzZVxuXHRcdCwgaW5kZXhcblx0O1xuXHRkbyB7XG5cdFx0dG9rZW4gPSB0b2tlbnNbaV0gKyBcIlwiO1xuXHRcdGluZGV4ID0gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKTtcblx0XHR3aGlsZSAoaW5kZXggIT09IC0xKSB7XG5cdFx0XHR0aGlzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHR1cGRhdGVkID0gdHJ1ZTtcblx0XHRcdGluZGV4ID0gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKTtcblx0XHR9XG5cdH1cblx0d2hpbGUgKCsraSA8IGwpO1xuXG5cdGlmICh1cGRhdGVkKSB7XG5cdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lKCk7XG5cdH1cbn07XG5jbGFzc0xpc3RQcm90by50b2dnbGUgPSBmdW5jdGlvbiAodG9rZW4sIGZvcmNlKSB7XG5cdHRva2VuICs9IFwiXCI7XG5cblx0dmFyXG5cdFx0ICByZXN1bHQgPSB0aGlzLmNvbnRhaW5zKHRva2VuKVxuXHRcdCwgbWV0aG9kID0gcmVzdWx0ID9cblx0XHRcdGZvcmNlICE9PSB0cnVlICYmIFwicmVtb3ZlXCJcblx0XHQ6XG5cdFx0XHRmb3JjZSAhPT0gZmFsc2UgJiYgXCJhZGRcIlxuXHQ7XG5cblx0aWYgKG1ldGhvZCkge1xuXHRcdHRoaXNbbWV0aG9kXSh0b2tlbik7XG5cdH1cblxuXHRpZiAoZm9yY2UgPT09IHRydWUgfHwgZm9yY2UgPT09IGZhbHNlKSB7XG5cdFx0cmV0dXJuIGZvcmNlO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiAhcmVzdWx0O1xuXHR9XG59O1xuY2xhc3NMaXN0UHJvdG8udG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB0aGlzLmpvaW4oXCIgXCIpO1xufTtcblxuaWYgKG9iakN0ci5kZWZpbmVQcm9wZXJ0eSkge1xuXHR2YXIgY2xhc3NMaXN0UHJvcERlc2MgPSB7XG5cdFx0ICBnZXQ6IGNsYXNzTGlzdEdldHRlclxuXHRcdCwgZW51bWVyYWJsZTogdHJ1ZVxuXHRcdCwgY29uZmlndXJhYmxlOiB0cnVlXG5cdH07XG5cdHRyeSB7XG5cdFx0b2JqQ3RyLmRlZmluZVByb3BlcnR5KGVsZW1DdHJQcm90bywgY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0UHJvcERlc2MpO1xuXHR9IGNhdGNoIChleCkgeyAvLyBJRSA4IGRvZXNuJ3Qgc3VwcG9ydCBlbnVtZXJhYmxlOnRydWVcblx0XHQvLyBhZGRpbmcgdW5kZWZpbmVkIHRvIGZpZ2h0IHRoaXMgaXNzdWUgaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvY2xhc3NMaXN0LmpzL2lzc3Vlcy8zNlxuXHRcdC8vIG1vZGVybmllIElFOC1NU1c3IG1hY2hpbmUgaGFzIElFOCA4LjAuNjAwMS4xODcwMiBhbmQgaXMgYWZmZWN0ZWRcblx0XHRpZiAoZXgubnVtYmVyID09PSB1bmRlZmluZWQgfHwgZXgubnVtYmVyID09PSAtMHg3RkY1RUM1NCkge1xuXHRcdFx0Y2xhc3NMaXN0UHJvcERlc2MuZW51bWVyYWJsZSA9IGZhbHNlO1xuXHRcdFx0b2JqQ3RyLmRlZmluZVByb3BlcnR5KGVsZW1DdHJQcm90bywgY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0UHJvcERlc2MpO1xuXHRcdH1cblx0fVxufSBlbHNlIGlmIChvYmpDdHJbcHJvdG9Qcm9wXS5fX2RlZmluZUdldHRlcl9fKSB7XG5cdGVsZW1DdHJQcm90by5fX2RlZmluZUdldHRlcl9fKGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdEdldHRlcik7XG59XG5cbn0od2luZG93LnNlbGYpKTtcblxufVxuXG4vLyBUaGVyZSBpcyBmdWxsIG9yIHBhcnRpYWwgbmF0aXZlIGNsYXNzTGlzdCBzdXBwb3J0LCBzbyBqdXN0IGNoZWNrIGlmIHdlIG5lZWRcbi8vIHRvIG5vcm1hbGl6ZSB0aGUgYWRkL3JlbW92ZSBhbmQgdG9nZ2xlIEFQSXMuXG5cbihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciB0ZXN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJfXCIpO1xuXG5cdHRlc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJjMVwiLCBcImMyXCIpO1xuXG5cdC8vIFBvbHlmaWxsIGZvciBJRSAxMC8xMSBhbmQgRmlyZWZveCA8MjYsIHdoZXJlIGNsYXNzTGlzdC5hZGQgYW5kXG5cdC8vIGNsYXNzTGlzdC5yZW1vdmUgZXhpc3QgYnV0IHN1cHBvcnQgb25seSBvbmUgYXJndW1lbnQgYXQgYSB0aW1lLlxuXHRpZiAoIXRlc3RFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImMyXCIpKSB7XG5cdFx0dmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uKG1ldGhvZCkge1xuXHRcdFx0dmFyIG9yaWdpbmFsID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZVttZXRob2RdO1xuXG5cdFx0XHRET01Ub2tlbkxpc3QucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih0b2tlbikge1xuXHRcdFx0XHR2YXIgaSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcblxuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdFx0XHR0b2tlbiA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdFx0XHRvcmlnaW5hbC5jYWxsKHRoaXMsIHRva2VuKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9O1xuXHRcdGNyZWF0ZU1ldGhvZCgnYWRkJyk7XG5cdFx0Y3JlYXRlTWV0aG9kKCdyZW1vdmUnKTtcblx0fVxuXG5cdHRlc3RFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJjM1wiLCBmYWxzZSk7XG5cblx0Ly8gUG9seWZpbGwgZm9yIElFIDEwIGFuZCBGaXJlZm94IDwyNCwgd2hlcmUgY2xhc3NMaXN0LnRvZ2dsZSBkb2VzIG5vdFxuXHQvLyBzdXBwb3J0IHRoZSBzZWNvbmQgYXJndW1lbnQuXG5cdGlmICh0ZXN0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJjM1wiKSkge1xuXHRcdHZhciBfdG9nZ2xlID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZS50b2dnbGU7XG5cblx0XHRET01Ub2tlbkxpc3QucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKHRva2VuLCBmb3JjZSkge1xuXHRcdFx0aWYgKDEgaW4gYXJndW1lbnRzICYmICF0aGlzLmNvbnRhaW5zKHRva2VuKSA9PT0gIWZvcmNlKSB7XG5cdFx0XHRcdHJldHVybiBmb3JjZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBfdG9nZ2xlLmNhbGwodGhpcywgdG9rZW4pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fVxuXG5cdHRlc3RFbGVtZW50ID0gbnVsbDtcbn0oKSk7XG5cbn1cbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuYXJyYXkuZnJvbScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuQXJyYXkuZnJvbTtcbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdC5hc3NpZ247XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIHRvQWJzb2x1dGVJbmRleCA9IHJlcXVpcmUoJy4vX3RvLWFic29sdXRlLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChJU19JTkNMVURFUykge1xuICByZXR1cm4gZnVuY3Rpb24gKCR0aGlzLCBlbCwgZnJvbUluZGV4KSB7XG4gICAgdmFyIE8gPSB0b0lPYmplY3QoJHRoaXMpO1xuICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgdmFyIGluZGV4ID0gdG9BYnNvbHV0ZUluZGV4KGZyb21JbmRleCwgbGVuZ3RoKTtcbiAgICB2YXIgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICBpZiAoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpIHdoaWxlIChsZW5ndGggPiBpbmRleCkge1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgICAgaWYgKHZhbHVlICE9IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBBcnJheSNpbmRleE9mIGlnbm9yZXMgaG9sZXMsIEFycmF5I2luY2x1ZGVzIC0gbm90XG4gICAgfSBlbHNlIGZvciAoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKSBpZiAoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTykge1xuICAgICAgaWYgKE9baW5kZXhdID09PSBlbCkgcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4IHx8IDA7XG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xuICB9O1xufTtcbiIsIi8vIGdldHRpbmcgdGFnIGZyb20gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG4vLyBFUzMgd3JvbmcgaGVyZVxudmFyIEFSRyA9IGNvZihmdW5jdGlvbiAoKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXRba2V5XTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgTywgVCwgQjtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKFQgPSB0cnlHZXQoTyA9IE9iamVjdChpdCksIFRBRykpID09ICdzdHJpbmcnID8gVFxuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQVJHID8gY29mKE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKEIgPSBjb2YoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiBCO1xufTtcbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTtcbiIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7IHZlcnNpb246ICcyLjYuMTInIH07XG5pZiAodHlwZW9mIF9fZSA9PSAnbnVtYmVyJykgX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgaW5kZXgsIHZhbHVlKSB7XG4gIGlmIChpbmRleCBpbiBvYmplY3QpICRkZWZpbmVQcm9wZXJ0eS5mKG9iamVjdCwgaW5kZXgsIGNyZWF0ZURlc2MoMCwgdmFsdWUpKTtcbiAgZWxzZSBvYmplY3RbaW5kZXhdID0gdmFsdWU7XG59O1xuIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIHRoYXQsIGxlbmd0aCkge1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZiAodGhhdCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZm47XG4gIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCA9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbi8vIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnIGluIG9sZCBJRVxudmFyIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG4iLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsdG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZidcbikuc3BsaXQoJywnKTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uICh0eXBlLCBuYW1lLCBzb3VyY2UpIHtcbiAgdmFyIElTX0ZPUkNFRCA9IHR5cGUgJiAkZXhwb3J0LkY7XG4gIHZhciBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HO1xuICB2YXIgSVNfU1RBVElDID0gdHlwZSAmICRleHBvcnQuUztcbiAgdmFyIElTX1BST1RPID0gdHlwZSAmICRleHBvcnQuUDtcbiAgdmFyIElTX0JJTkQgPSB0eXBlICYgJGV4cG9ydC5CO1xuICB2YXIgdGFyZ2V0ID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIHx8IChnbG9iYWxbbmFtZV0gPSB7fSkgOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdO1xuICB2YXIgZXhwb3J0cyA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pO1xuICB2YXIgZXhwUHJvdG8gPSBleHBvcnRzW1BST1RPVFlQRV0gfHwgKGV4cG9ydHNbUFJPVE9UWVBFXSA9IHt9KTtcbiAgdmFyIGtleSwgb3duLCBvdXQsIGV4cDtcbiAgaWYgKElTX0dMT0JBTCkgc291cmNlID0gbmFtZTtcbiAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IChvd24gPyB0YXJnZXQgOiBzb3VyY2UpW2tleV07XG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICBleHAgPSBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICAvLyBleHRlbmQgZ2xvYmFsXG4gICAgaWYgKHRhcmdldCkgcmVkZWZpbmUodGFyZ2V0LCBrZXksIG91dCwgdHlwZSAmICRleHBvcnQuVSk7XG4gICAgLy8gZXhwb3J0XG4gICAgaWYgKGV4cG9ydHNba2V5XSAhPSBvdXQpIGhpZGUoZXhwb3J0cywga2V5LCBleHApO1xuICAgIGlmIChJU19QUk9UTyAmJiBleHBQcm90b1trZXldICE9IG91dCkgZXhwUHJvdG9ba2V5XSA9IG91dDtcbiAgfVxufTtcbmdsb2JhbC5jb3JlID0gY29yZTtcbi8vIHR5cGUgYml0bWFwXG4kZXhwb3J0LkYgPSAxOyAgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgICAvLyBnbG9iYWxcbiRleHBvcnQuUyA9IDQ7ICAgLy8gc3RhdGljXG4kZXhwb3J0LlAgPSA4OyAgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgIC8vIGJpbmRcbiRleHBvcnQuVyA9IDMyOyAgLy8gd3JhcFxuJGV4cG9ydC5VID0gNjQ7ICAvLyBzYWZlXG4kZXhwb3J0LlIgPSAxMjg7IC8vIHJlYWwgcHJvdG8gbWV0aG9kIGZvciBgbGlicmFyeWBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ25hdGl2ZS1mdW5jdGlvbi10by1zdHJpbmcnLCBGdW5jdGlvbi50b1N0cmluZyk7XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5pZiAodHlwZW9mIF9fZyA9PSAnbnVtYmVyJykgX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCJ2YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59O1xuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIGRQLmYob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59O1xuIiwidmFyIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQ7XG5tb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiIsIm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnZGl2JyksICdhJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSkuYSAhPSA3O1xufSk7XG4iLCIvLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKSA/IE9iamVjdCA6IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59O1xuIiwiLy8gY2hlY2sgb24gZGVmYXVsdCBBcnJheSBpdGVyYXRvclxudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ICE9PSB1bmRlZmluZWQgJiYgKEl0ZXJhdG9ycy5BcnJheSA9PT0gaXQgfHwgQXJyYXlQcm90b1tJVEVSQVRPUl0gPT09IGl0KTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTtcbiIsIi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3JcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcykge1xuICB0cnkge1xuICAgIHJldHVybiBlbnRyaWVzID8gZm4oYW5PYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XG4gIC8vIDcuNC42IEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsIGNvbXBsZXRpb24pXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICAgIGlmIChyZXQgIT09IHVuZGVmaW5lZCkgYW5PYmplY3QocmV0LmNhbGwoaXRlcmF0b3IpKTtcbiAgICB0aHJvdyBlO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKTtcbnZhciBkZXNjcmlwdG9yID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuXG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faGlkZScpKEl0ZXJhdG9yUHJvdG90eXBlLCByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KSB7XG4gIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IGNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwgeyBuZXh0OiBkZXNjcmlwdG9yKDEsIG5leHQpIH0pO1xuICBzZXRUb1N0cmluZ1RhZyhDb25zdHJ1Y3RvciwgTkFNRSArICcgSXRlcmF0b3InKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgJGl0ZXJDcmVhdGUgPSByZXF1aXJlKCcuL19pdGVyLWNyZWF0ZScpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEJVR0dZID0gIShbXS5rZXlzICYmICduZXh0JyBpbiBbXS5rZXlzKCkpOyAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG52YXIgRkZfSVRFUkFUT1IgPSAnQEBpdGVyYXRvcic7XG52YXIgS0VZUyA9ICdrZXlzJztcbnZhciBWQUxVRVMgPSAndmFsdWVzJztcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRUQpIHtcbiAgJGl0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24gKGtpbmQpIHtcbiAgICBpZiAoIUJVR0dZICYmIGtpbmQgaW4gcHJvdG8pIHJldHVybiBwcm90b1traW5kXTtcbiAgICBzd2l0Y2ggKGtpbmQpIHtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICB9IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHID0gTkFNRSArICcgSXRlcmF0b3InO1xuICB2YXIgREVGX1ZBTFVFUyA9IERFRkFVTFQgPT0gVkFMVUVTO1xuICB2YXIgVkFMVUVTX0JVRyA9IGZhbHNlO1xuICB2YXIgcHJvdG8gPSBCYXNlLnByb3RvdHlwZTtcbiAgdmFyICRuYXRpdmUgPSBwcm90b1tJVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF07XG4gIHZhciAkZGVmYXVsdCA9ICRuYXRpdmUgfHwgZ2V0TWV0aG9kKERFRkFVTFQpO1xuICB2YXIgJGVudHJpZXMgPSBERUZBVUxUID8gIURFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZCgnZW50cmllcycpIDogdW5kZWZpbmVkO1xuICB2YXIgJGFueU5hdGl2ZSA9IE5BTUUgPT0gJ0FycmF5JyA/IHByb3RvLmVudHJpZXMgfHwgJG5hdGl2ZSA6ICRuYXRpdmU7XG4gIHZhciBtZXRob2RzLCBrZXksIEl0ZXJhdG9yUHJvdG90eXBlO1xuICAvLyBGaXggbmF0aXZlXG4gIGlmICgkYW55TmF0aXZlKSB7XG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZigkYW55TmF0aXZlLmNhbGwobmV3IEJhc2UoKSkpO1xuICAgIGlmIChJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSAmJiBJdGVyYXRvclByb3RvdHlwZS5uZXh0KSB7XG4gICAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAgIC8vIGZpeCBmb3Igc29tZSBvbGQgZW5naW5lc1xuICAgICAgaWYgKCFMSUJSQVJZICYmIHR5cGVvZiBJdGVyYXRvclByb3RvdHlwZVtJVEVSQVRPUl0gIT0gJ2Z1bmN0aW9uJykgaGlkZShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xuICAgIH1cbiAgfVxuICAvLyBmaXggQXJyYXkje3ZhbHVlcywgQEBpdGVyYXRvcn0ubmFtZSBpbiBWOCAvIEZGXG4gIGlmIChERUZfVkFMVUVTICYmICRuYXRpdmUgJiYgJG5hdGl2ZS5uYW1lICE9PSBWQUxVRVMpIHtcbiAgICBWQUxVRVNfQlVHID0gdHJ1ZTtcbiAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuICRuYXRpdmUuY2FsbCh0aGlzKTsgfTtcbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYgKCghTElCUkFSWSB8fCBGT1JDRUQpICYmIChCVUdHWSB8fCBWQUxVRVNfQlVHIHx8ICFwcm90b1tJVEVSQVRPUl0pKSB7XG4gICAgaGlkZShwcm90bywgSVRFUkFUT1IsICRkZWZhdWx0KTtcbiAgfVxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9ICRkZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSA9IHJldHVyblRoaXM7XG4gIGlmIChERUZBVUxUKSB7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiBJU19TRVQgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChLRVlTKSxcbiAgICAgIGVudHJpZXM6ICRlbnRyaWVzXG4gICAgfTtcbiAgICBpZiAoRk9SQ0VEKSBmb3IgKGtleSBpbiBtZXRob2RzKSB7XG4gICAgICBpZiAoIShrZXkgaW4gcHJvdG8pKSByZWRlZmluZShwcm90bywga2V5LCBtZXRob2RzW2tleV0pO1xuICAgIH0gZWxzZSAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChCVUdHWSB8fCBWQUxVRVNfQlVHKSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHM7XG59O1xuIiwidmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgU0FGRV9DTE9TSU5HID0gZmFsc2U7XG5cbnRyeSB7XG4gIHZhciByaXRlciA9IFs3XVtJVEVSQVRPUl0oKTtcbiAgcml0ZXJbJ3JldHVybiddID0gZnVuY3Rpb24gKCkgeyBTQUZFX0NMT1NJTkcgPSB0cnVlOyB9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdGhyb3ctbGl0ZXJhbFxuICBBcnJheS5mcm9tKHJpdGVyLCBmdW5jdGlvbiAoKSB7IHRocm93IDI7IH0pO1xufSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMsIHNraXBDbG9zaW5nKSB7XG4gIGlmICghc2tpcENsb3NpbmcgJiYgIVNBRkVfQ0xPU0lORykgcmV0dXJuIGZhbHNlO1xuICB2YXIgc2FmZSA9IGZhbHNlO1xuICB0cnkge1xuICAgIHZhciBhcnIgPSBbN107XG4gICAgdmFyIGl0ZXIgPSBhcnJbSVRFUkFUT1JdKCk7XG4gICAgaXRlci5uZXh0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4geyBkb25lOiBzYWZlID0gdHJ1ZSB9OyB9O1xuICAgIGFycltJVEVSQVRPUl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBpdGVyOyB9O1xuICAgIGV4ZWMoYXJyKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBzYWZlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge307XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZhbHNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gMTkuMS4yLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSwgLi4uKVxudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKTtcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcbnZhciBnT1BTID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKTtcbnZhciBwSUUgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpO1xudmFyICRhc3NpZ24gPSBPYmplY3QuYXNzaWduO1xuXG4vLyBzaG91bGQgd29yayB3aXRoIHN5bWJvbHMgYW5kIHNob3VsZCBoYXZlIGRldGVybWluaXN0aWMgcHJvcGVydHkgb3JkZXIgKFY4IGJ1Zylcbm1vZHVsZS5leHBvcnRzID0gISRhc3NpZ24gfHwgcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHZhciBBID0ge307XG4gIHZhciBCID0ge307XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICB2YXIgUyA9IFN5bWJvbCgpO1xuICB2YXIgSyA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdCc7XG4gIEFbU10gPSA3O1xuICBLLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7IEJba10gPSBrOyB9KTtcbiAgcmV0dXJuICRhc3NpZ24oe30sIEEpW1NdICE9IDcgfHwgT2JqZWN0LmtleXMoJGFzc2lnbih7fSwgQikpLmpvaW4oJycpICE9IEs7XG59KSA/IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIHZhciBUID0gdG9PYmplY3QodGFyZ2V0KTtcbiAgdmFyIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICB2YXIgaW5kZXggPSAxO1xuICB2YXIgZ2V0U3ltYm9scyA9IGdPUFMuZjtcbiAgdmFyIGlzRW51bSA9IHBJRS5mO1xuICB3aGlsZSAoYUxlbiA+IGluZGV4KSB7XG4gICAgdmFyIFMgPSBJT2JqZWN0KGFyZ3VtZW50c1tpbmRleCsrXSk7XG4gICAgdmFyIGtleXMgPSBnZXRTeW1ib2xzID8gZ2V0S2V5cyhTKS5jb25jYXQoZ2V0U3ltYm9scyhTKSkgOiBnZXRLZXlzKFMpO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgaiA9IDA7XG4gICAgdmFyIGtleTtcbiAgICB3aGlsZSAobGVuZ3RoID4gaikge1xuICAgICAga2V5ID0ga2V5c1tqKytdO1xuICAgICAgaWYgKCFERVNDUklQVE9SUyB8fCBpc0VudW0uY2FsbChTLCBrZXkpKSBUW2tleV0gPSBTW2tleV07XG4gICAgfVxuICB9IHJldHVybiBUO1xufSA6ICRhc3NpZ247XG4iLCIvLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGRQcyA9IHJlcXVpcmUoJy4vX29iamVjdC1kcHMnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcbnZhciBFbXB0eSA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIGNyZWF0ZURpY3QgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIFRocmFzaCwgd2FzdGUgYW5kIHNvZG9teTogSUUgR0MgYnVnXG4gIHZhciBpZnJhbWUgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2lmcmFtZScpO1xuICB2YXIgaSA9IGVudW1CdWdLZXlzLmxlbmd0aDtcbiAgdmFyIGx0ID0gJzwnO1xuICB2YXIgZ3QgPSAnPic7XG4gIHZhciBpZnJhbWVEb2N1bWVudDtcbiAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIHJlcXVpcmUoJy4vX2h0bWwnKS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zY3JpcHQtdXJsXG4gIC8vIGNyZWF0ZURpY3QgPSBpZnJhbWUuY29udGVudFdpbmRvdy5PYmplY3Q7XG4gIC8vIGh0bWwucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgaWZyYW1lRG9jdW1lbnQub3BlbigpO1xuICBpZnJhbWVEb2N1bWVudC53cml0ZShsdCArICdzY3JpcHQnICsgZ3QgKyAnZG9jdW1lbnQuRj1PYmplY3QnICsgbHQgKyAnL3NjcmlwdCcgKyBndCk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIGNyZWF0ZURpY3QgPSBpZnJhbWVEb2N1bWVudC5GO1xuICB3aGlsZSAoaS0tKSBkZWxldGUgY3JlYXRlRGljdFtQUk9UT1RZUEVdW2VudW1CdWdLZXlzW2ldXTtcbiAgcmV0dXJuIGNyZWF0ZURpY3QoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiBjcmVhdGUoTywgUHJvcGVydGllcykge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoTyAhPT0gbnVsbCkge1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBhbk9iamVjdChPKTtcbiAgICByZXN1bHQgPSBuZXcgRW1wdHkoKTtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gbnVsbDtcbiAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHBvbHlmaWxsXG4gICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XG4gIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBkUHMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbn07XG4iLCJ2YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJyk7XG52YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKTtcbnZhciBkUCA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblxuZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmIChJRThfRE9NX0RFRklORSkgdHJ5IHtcbiAgICByZXR1cm4gZFAoTywgUCwgQXR0cmlidXRlcyk7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICBpZiAoJ2dldCcgaW4gQXR0cmlidXRlcyB8fCAnc2V0JyBpbiBBdHRyaWJ1dGVzKSB0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICBpZiAoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKSBPW1BdID0gQXR0cmlidXRlcy52YWx1ZTtcbiAgcmV0dXJuIE87XG59O1xuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIHZhciBrZXlzID0gZ2V0S2V5cyhQcm9wZXJ0aWVzKTtcbiAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICB2YXIgaSA9IDA7XG4gIHZhciBQO1xuICB3aGlsZSAobGVuZ3RoID4gaSkgZFAuZihPLCBQID0ga2V5c1tpKytdLCBQcm9wZXJ0aWVzW1BdKTtcbiAgcmV0dXJuIE87XG59O1xuIiwiZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbiIsIi8vIDE5LjEuMi45IC8gMTUuMi4zLjIgT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pXG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcbnZhciBPYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIChPKSB7XG4gIE8gPSB0b09iamVjdChPKTtcbiAgaWYgKGhhcyhPLCBJRV9QUk9UTykpIHJldHVybiBPW0lFX1BST1RPXTtcbiAgaWYgKHR5cGVvZiBPLmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgTyBpbnN0YW5jZW9mIE8uY29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gTy5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH0gcmV0dXJuIE8gaW5zdGFuY2VvZiBPYmplY3QgPyBPYmplY3RQcm90byA6IG51bGw7XG59O1xuIiwidmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciBhcnJheUluZGV4T2YgPSByZXF1aXJlKCcuL19hcnJheS1pbmNsdWRlcycpKGZhbHNlKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBuYW1lcykge1xuICB2YXIgTyA9IHRvSU9iamVjdChvYmplY3QpO1xuICB2YXIgaSA9IDA7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gTykgaWYgKGtleSAhPSBJRV9QUk9UTykgaGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZSAobmFtZXMubGVuZ3RoID4gaSkgaWYgKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSkge1xuICAgIH5hcnJheUluZGV4T2YocmVzdWx0LCBrZXkpIHx8IHJlc3VsdC5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIvLyAxOS4xLjIuMTQgLyAxNS4yLjMuMTQgT2JqZWN0LmtleXMoTylcbnZhciAka2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ga2V5cyhPKSB7XG4gIHJldHVybiAka2V5cyhPLCBlbnVtQnVnS2V5cyk7XG59O1xuIiwiZXhwb3J0cy5mID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChiaXRtYXAsIHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZTogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGU6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWU6IHZhbHVlXG4gIH07XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgU1JDID0gcmVxdWlyZSgnLi9fdWlkJykoJ3NyYycpO1xudmFyICR0b1N0cmluZyA9IHJlcXVpcmUoJy4vX2Z1bmN0aW9uLXRvLXN0cmluZycpO1xudmFyIFRPX1NUUklORyA9ICd0b1N0cmluZyc7XG52YXIgVFBMID0gKCcnICsgJHRvU3RyaW5nKS5zcGxpdChUT19TVFJJTkcpO1xuXG5yZXF1aXJlKCcuL19jb3JlJykuaW5zcGVjdFNvdXJjZSA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gJHRvU3RyaW5nLmNhbGwoaXQpO1xufTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE8sIGtleSwgdmFsLCBzYWZlKSB7XG4gIHZhciBpc0Z1bmN0aW9uID0gdHlwZW9mIHZhbCA9PSAnZnVuY3Rpb24nO1xuICBpZiAoaXNGdW5jdGlvbikgaGFzKHZhbCwgJ25hbWUnKSB8fCBoaWRlKHZhbCwgJ25hbWUnLCBrZXkpO1xuICBpZiAoT1trZXldID09PSB2YWwpIHJldHVybjtcbiAgaWYgKGlzRnVuY3Rpb24pIGhhcyh2YWwsIFNSQykgfHwgaGlkZSh2YWwsIFNSQywgT1trZXldID8gJycgKyBPW2tleV0gOiBUUEwuam9pbihTdHJpbmcoa2V5KSkpO1xuICBpZiAoTyA9PT0gZ2xvYmFsKSB7XG4gICAgT1trZXldID0gdmFsO1xuICB9IGVsc2UgaWYgKCFzYWZlKSB7XG4gICAgZGVsZXRlIE9ba2V5XTtcbiAgICBoaWRlKE8sIGtleSwgdmFsKTtcbiAgfSBlbHNlIGlmIChPW2tleV0pIHtcbiAgICBPW2tleV0gPSB2YWw7XG4gIH0gZWxzZSB7XG4gICAgaGlkZShPLCBrZXksIHZhbCk7XG4gIH1cbi8vIGFkZCBmYWtlIEZ1bmN0aW9uI3RvU3RyaW5nIGZvciBjb3JyZWN0IHdvcmsgd3JhcHBlZCBtZXRob2RzIC8gY29uc3RydWN0b3JzIHdpdGggbWV0aG9kcyBsaWtlIExvRGFzaCBpc05hdGl2ZVxufSkoRnVuY3Rpb24ucHJvdG90eXBlLCBUT19TVFJJTkcsIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyAmJiB0aGlzW1NSQ10gfHwgJHRvU3RyaW5nLmNhbGwodGhpcyk7XG59KTtcbiIsInZhciBkZWYgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgdGFnLCBzdGF0KSB7XG4gIGlmIChpdCAmJiAhaGFzKGl0ID0gc3RhdCA/IGl0IDogaXQucHJvdG90eXBlLCBUQUcpKSBkZWYoaXQsIFRBRywgeyBjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWcgfSk7XG59O1xuIiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCdrZXlzJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIHNoYXJlZFtrZXldIHx8IChzaGFyZWRba2V5XSA9IHVpZChrZXkpKTtcbn07XG4iLCJ2YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJztcbnZhciBzdG9yZSA9IGdsb2JhbFtTSEFSRURdIHx8IChnbG9iYWxbU0hBUkVEXSA9IHt9KTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdmFsdWUgOiB7fSk7XG59KSgndmVyc2lvbnMnLCBbXSkucHVzaCh7XG4gIHZlcnNpb246IGNvcmUudmVyc2lvbixcbiAgbW9kZTogcmVxdWlyZSgnLi9fbGlicmFyeScpID8gJ3B1cmUnIDogJ2dsb2JhbCcsXG4gIGNvcHlyaWdodDogJ8KpIDIwMjAgRGVuaXMgUHVzaGthcmV2ICh6bG9pcm9jay5ydSknXG59KTtcbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbi8vIHRydWUgIC0+IFN0cmluZyNhdFxuLy8gZmFsc2UgLT4gU3RyaW5nI2NvZGVQb2ludEF0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChUT19TVFJJTkcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0aGF0LCBwb3MpIHtcbiAgICB2YXIgcyA9IFN0cmluZyhkZWZpbmVkKHRoYXQpKTtcbiAgICB2YXIgaSA9IHRvSW50ZWdlcihwb3MpO1xuICAgIHZhciBsID0gcy5sZW5ndGg7XG4gICAgdmFyIGEsIGI7XG4gICAgaWYgKGkgPCAwIHx8IGkgPj0gbCkgcmV0dXJuIFRPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbCB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcbiAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXG4gICAgICA6IFRPX1NUUklORyA/IHMuc2xpY2UoaSwgaSArIDIpIDogKGEgLSAweGQ4MDAgPDwgMTApICsgKGIgLSAweGRjMDApICsgMHgxMDAwMDtcbiAgfTtcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5kZXgsIGxlbmd0aCkge1xuICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xufTtcbiIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgPSBNYXRoLmNlaWw7XG52YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59O1xuIiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcbiIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59O1xuIiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgUykge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgcmV0dXJuIGl0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYgKFMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICh0eXBlb2YgKGZuID0gaXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07XG4iLCJ2YXIgaWQgPSAwO1xudmFyIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTtcbiIsInZhciBzdG9yZSA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCd3a3MnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbnZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5TeW1ib2w7XG52YXIgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcblxudmFyICRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZSkge1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBVU0VfU1lNQk9MICYmIFN5bWJvbFtuYW1lXSB8fCAoVVNFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTtcblxuJGV4cG9ydHMuc3RvcmUgPSBzdG9yZTtcbiIsInZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgIT0gdW5kZWZpbmVkKSByZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIGNhbGwgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKTtcbnZhciBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGNyZWF0ZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fY3JlYXRlLXByb3BlcnR5Jyk7XG52YXIgZ2V0SXRlckZuID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKShmdW5jdGlvbiAoaXRlcikgeyBBcnJheS5mcm9tKGl0ZXIpOyB9KSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjIuMSBBcnJheS5mcm9tKGFycmF5TGlrZSwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gIGZyb206IGZ1bmN0aW9uIGZyb20oYXJyYXlMaWtlIC8qICwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQgKi8pIHtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KGFycmF5TGlrZSk7XG4gICAgdmFyIEMgPSB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nID8gdGhpcyA6IEFycmF5O1xuICAgIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgbWFwZm4gPSBhTGVuID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgbWFwcGluZyA9IG1hcGZuICE9PSB1bmRlZmluZWQ7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgaXRlckZuID0gZ2V0SXRlckZuKE8pO1xuICAgIHZhciBsZW5ndGgsIHJlc3VsdCwgc3RlcCwgaXRlcmF0b3I7XG4gICAgaWYgKG1hcHBpbmcpIG1hcGZuID0gY3R4KG1hcGZuLCBhTGVuID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZCwgMik7XG4gICAgLy8gaWYgb2JqZWN0IGlzbid0IGl0ZXJhYmxlIG9yIGl0J3MgYXJyYXkgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yIC0gdXNlIHNpbXBsZSBjYXNlXG4gICAgaWYgKGl0ZXJGbiAhPSB1bmRlZmluZWQgJiYgIShDID09IEFycmF5ICYmIGlzQXJyYXlJdGVyKGl0ZXJGbikpKSB7XG4gICAgICBmb3IgKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoTyksIHJlc3VsdCA9IG5ldyBDKCk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgaW5kZXgrKykge1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gY2FsbChpdGVyYXRvciwgbWFwZm4sIFtzdGVwLnZhbHVlLCBpbmRleF0sIHRydWUpIDogc3RlcC52YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICAgIGZvciAocmVzdWx0ID0gbmV3IEMobGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IG1hcGZuKE9baW5kZXhdLCBpbmRleCkgOiBPW2luZGV4XSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5sZW5ndGggPSBpbmRleDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcbiIsIi8vIDE5LjEuMy4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiwgJ09iamVjdCcsIHsgYXNzaWduOiByZXF1aXJlKCcuL19vYmplY3QtYXNzaWduJykgfSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24gKGl0ZXJhdGVkKSB7XG4gIHRoaXMuX3QgPSBTdHJpbmcoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uICgpIHtcbiAgdmFyIE8gPSB0aGlzLl90O1xuICB2YXIgaW5kZXggPSB0aGlzLl9pO1xuICB2YXIgcG9pbnQ7XG4gIGlmIChpbmRleCA+PSBPLmxlbmd0aCkgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIHRoaXMuX2kgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4geyB2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlIH07XG59KTtcbiIsIi8qIGdsb2JhbCBkZWZpbmUsIEtleWJvYXJkRXZlbnQsIG1vZHVsZSAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXG4gIHZhciBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwgPSB7XG4gICAgcG9seWZpbGw6IHBvbHlmaWxsLFxuICAgIGtleXM6IHtcbiAgICAgIDM6ICdDYW5jZWwnLFxuICAgICAgNjogJ0hlbHAnLFxuICAgICAgODogJ0JhY2tzcGFjZScsXG4gICAgICA5OiAnVGFiJyxcbiAgICAgIDEyOiAnQ2xlYXInLFxuICAgICAgMTM6ICdFbnRlcicsXG4gICAgICAxNjogJ1NoaWZ0JyxcbiAgICAgIDE3OiAnQ29udHJvbCcsXG4gICAgICAxODogJ0FsdCcsXG4gICAgICAxOTogJ1BhdXNlJyxcbiAgICAgIDIwOiAnQ2Fwc0xvY2snLFxuICAgICAgMjc6ICdFc2NhcGUnLFxuICAgICAgMjg6ICdDb252ZXJ0JyxcbiAgICAgIDI5OiAnTm9uQ29udmVydCcsXG4gICAgICAzMDogJ0FjY2VwdCcsXG4gICAgICAzMTogJ01vZGVDaGFuZ2UnLFxuICAgICAgMzI6ICcgJyxcbiAgICAgIDMzOiAnUGFnZVVwJyxcbiAgICAgIDM0OiAnUGFnZURvd24nLFxuICAgICAgMzU6ICdFbmQnLFxuICAgICAgMzY6ICdIb21lJyxcbiAgICAgIDM3OiAnQXJyb3dMZWZ0JyxcbiAgICAgIDM4OiAnQXJyb3dVcCcsXG4gICAgICAzOTogJ0Fycm93UmlnaHQnLFxuICAgICAgNDA6ICdBcnJvd0Rvd24nLFxuICAgICAgNDE6ICdTZWxlY3QnLFxuICAgICAgNDI6ICdQcmludCcsXG4gICAgICA0MzogJ0V4ZWN1dGUnLFxuICAgICAgNDQ6ICdQcmludFNjcmVlbicsXG4gICAgICA0NTogJ0luc2VydCcsXG4gICAgICA0NjogJ0RlbGV0ZScsXG4gICAgICA0ODogWycwJywgJyknXSxcbiAgICAgIDQ5OiBbJzEnLCAnISddLFxuICAgICAgNTA6IFsnMicsICdAJ10sXG4gICAgICA1MTogWyczJywgJyMnXSxcbiAgICAgIDUyOiBbJzQnLCAnJCddLFxuICAgICAgNTM6IFsnNScsICclJ10sXG4gICAgICA1NDogWyc2JywgJ14nXSxcbiAgICAgIDU1OiBbJzcnLCAnJiddLFxuICAgICAgNTY6IFsnOCcsICcqJ10sXG4gICAgICA1NzogWyc5JywgJygnXSxcbiAgICAgIDkxOiAnT1MnLFxuICAgICAgOTM6ICdDb250ZXh0TWVudScsXG4gICAgICAxNDQ6ICdOdW1Mb2NrJyxcbiAgICAgIDE0NTogJ1Njcm9sbExvY2snLFxuICAgICAgMTgxOiAnVm9sdW1lTXV0ZScsXG4gICAgICAxODI6ICdWb2x1bWVEb3duJyxcbiAgICAgIDE4MzogJ1ZvbHVtZVVwJyxcbiAgICAgIDE4NjogWyc7JywgJzonXSxcbiAgICAgIDE4NzogWyc9JywgJysnXSxcbiAgICAgIDE4ODogWycsJywgJzwnXSxcbiAgICAgIDE4OTogWyctJywgJ18nXSxcbiAgICAgIDE5MDogWycuJywgJz4nXSxcbiAgICAgIDE5MTogWycvJywgJz8nXSxcbiAgICAgIDE5MjogWydgJywgJ34nXSxcbiAgICAgIDIxOTogWydbJywgJ3snXSxcbiAgICAgIDIyMDogWydcXFxcJywgJ3wnXSxcbiAgICAgIDIyMTogWyddJywgJ30nXSxcbiAgICAgIDIyMjogW1wiJ1wiLCAnXCInXSxcbiAgICAgIDIyNDogJ01ldGEnLFxuICAgICAgMjI1OiAnQWx0R3JhcGgnLFxuICAgICAgMjQ2OiAnQXR0bicsXG4gICAgICAyNDc6ICdDclNlbCcsXG4gICAgICAyNDg6ICdFeFNlbCcsXG4gICAgICAyNDk6ICdFcmFzZUVvZicsXG4gICAgICAyNTA6ICdQbGF5JyxcbiAgICAgIDI1MTogJ1pvb21PdXQnXG4gICAgfVxuICB9O1xuXG4gIC8vIEZ1bmN0aW9uIGtleXMgKEYxLTI0KS5cbiAgdmFyIGk7XG4gIGZvciAoaSA9IDE7IGkgPCAyNTsgaSsrKSB7XG4gICAga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsLmtleXNbMTExICsgaV0gPSAnRicgKyBpO1xuICB9XG5cbiAgLy8gUHJpbnRhYmxlIEFTQ0lJIGNoYXJhY3RlcnMuXG4gIHZhciBsZXR0ZXIgPSAnJztcbiAgZm9yIChpID0gNjU7IGkgPCA5MTsgaSsrKSB7XG4gICAgbGV0dGVyID0gU3RyaW5nLmZyb21DaGFyQ29kZShpKTtcbiAgICBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwua2V5c1tpXSA9IFtsZXR0ZXIudG9Mb3dlckNhc2UoKSwgbGV0dGVyLnRvVXBwZXJDYXNlKCldO1xuICB9XG5cbiAgZnVuY3Rpb24gcG9seWZpbGwgKCkge1xuICAgIGlmICghKCdLZXlib2FyZEV2ZW50JyBpbiB3aW5kb3cpIHx8XG4gICAgICAgICdrZXknIGluIEtleWJvYXJkRXZlbnQucHJvdG90eXBlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gUG9seWZpbGwgYGtleWAgb24gYEtleWJvYXJkRXZlbnRgLlxuICAgIHZhciBwcm90byA9IHtcbiAgICAgIGdldDogZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbC5rZXlzW3RoaXMud2hpY2ggfHwgdGhpcy5rZXlDb2RlXTtcblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShrZXkpKSB7XG4gICAgICAgICAga2V5ID0ga2V5Wyt0aGlzLnNoaWZ0S2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgICB9XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoS2V5Ym9hcmRFdmVudC5wcm90b3R5cGUsICdrZXknLCBwcm90byk7XG4gICAgcmV0dXJuIHByb3RvO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZSgna2V5Ym9hcmRldmVudC1rZXktcG9seWZpbGwnLCBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0ga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsO1xuICB9IGVsc2UgaWYgKHdpbmRvdykge1xuICAgIHdpbmRvdy5rZXlib2FyZGV2ZW50S2V5UG9seWZpbGwgPSBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGw7XG4gIH1cblxufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHByb3RvID0gdHlwZW9mIEVsZW1lbnQgIT09ICd1bmRlZmluZWQnID8gRWxlbWVudC5wcm90b3R5cGUgOiB7fTtcbnZhciB2ZW5kb3IgPSBwcm90by5tYXRjaGVzXG4gIHx8IHByb3RvLm1hdGNoZXNTZWxlY3RvclxuICB8fCBwcm90by53ZWJraXRNYXRjaGVzU2VsZWN0b3JcbiAgfHwgcHJvdG8ubW96TWF0Y2hlc1NlbGVjdG9yXG4gIHx8IHByb3RvLm1zTWF0Y2hlc1NlbGVjdG9yXG4gIHx8IHByb3RvLm9NYXRjaGVzU2VsZWN0b3I7XG5cbm1vZHVsZS5leHBvcnRzID0gbWF0Y2g7XG5cbi8qKlxuICogTWF0Y2ggYGVsYCB0byBgc2VsZWN0b3JgLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gbWF0Y2goZWwsIHNlbGVjdG9yKSB7XG4gIGlmICghZWwgfHwgZWwubm9kZVR5cGUgIT09IDEpIHJldHVybiBmYWxzZTtcbiAgaWYgKHZlbmRvcikgcmV0dXJuIHZlbmRvci5jYWxsKGVsLCBzZWxlY3Rvcik7XG4gIHZhciBub2RlcyA9IGVsLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAobm9kZXNbaV0gPT0gZWwpIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbiIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJjb25zdCBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5jb25zdCBkZWxlZ2F0ZSA9IHJlcXVpcmUoJy4vZGVsZWdhdGUnKTtcbmNvbnN0IGRlbGVnYXRlQWxsID0gcmVxdWlyZSgnLi9kZWxlZ2F0ZUFsbCcpO1xuXG5jb25zdCBERUxFR0FURV9QQVRURVJOID0gL14oLispOmRlbGVnYXRlXFwoKC4rKVxcKSQvO1xuY29uc3QgU1BBQ0UgPSAnICc7XG5cbmNvbnN0IGdldExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUsIGhhbmRsZXIpIHtcbiAgdmFyIG1hdGNoID0gdHlwZS5tYXRjaChERUxFR0FURV9QQVRURVJOKTtcbiAgdmFyIHNlbGVjdG9yO1xuICBpZiAobWF0Y2gpIHtcbiAgICB0eXBlID0gbWF0Y2hbMV07XG4gICAgc2VsZWN0b3IgPSBtYXRjaFsyXTtcbiAgfVxuXG4gIHZhciBvcHRpb25zO1xuICBpZiAodHlwZW9mIGhhbmRsZXIgPT09ICdvYmplY3QnKSB7XG4gICAgb3B0aW9ucyA9IHtcbiAgICAgIGNhcHR1cmU6IHBvcEtleShoYW5kbGVyLCAnY2FwdHVyZScpLFxuICAgICAgcGFzc2l2ZTogcG9wS2V5KGhhbmRsZXIsICdwYXNzaXZlJylcbiAgICB9O1xuICB9XG5cbiAgdmFyIGxpc3RlbmVyID0ge1xuICAgIHNlbGVjdG9yOiBzZWxlY3RvcixcbiAgICBkZWxlZ2F0ZTogKHR5cGVvZiBoYW5kbGVyID09PSAnb2JqZWN0JylcbiAgICAgID8gZGVsZWdhdGVBbGwoaGFuZGxlcilcbiAgICAgIDogc2VsZWN0b3JcbiAgICAgICAgPyBkZWxlZ2F0ZShzZWxlY3RvciwgaGFuZGxlcilcbiAgICAgICAgOiBoYW5kbGVyLFxuICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgfTtcblxuICBpZiAodHlwZS5pbmRleE9mKFNQQUNFKSA+IC0xKSB7XG4gICAgcmV0dXJuIHR5cGUuc3BsaXQoU1BBQ0UpLm1hcChmdW5jdGlvbihfdHlwZSkge1xuICAgICAgcmV0dXJuIGFzc2lnbih7dHlwZTogX3R5cGV9LCBsaXN0ZW5lcik7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgbGlzdGVuZXIudHlwZSA9IHR5cGU7XG4gICAgcmV0dXJuIFtsaXN0ZW5lcl07XG4gIH1cbn07XG5cbnZhciBwb3BLZXkgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICB2YXIgdmFsdWUgPSBvYmpba2V5XTtcbiAgZGVsZXRlIG9ialtrZXldO1xuICByZXR1cm4gdmFsdWU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJlaGF2aW9yKGV2ZW50cywgcHJvcHMpIHtcbiAgY29uc3QgbGlzdGVuZXJzID0gT2JqZWN0LmtleXMoZXZlbnRzKVxuICAgIC5yZWR1Y2UoZnVuY3Rpb24obWVtbywgdHlwZSkge1xuICAgICAgdmFyIGxpc3RlbmVycyA9IGdldExpc3RlbmVycyh0eXBlLCBldmVudHNbdHlwZV0pO1xuICAgICAgcmV0dXJuIG1lbW8uY29uY2F0KGxpc3RlbmVycyk7XG4gICAgfSwgW10pO1xuXG4gIHJldHVybiBhc3NpZ24oe1xuICAgIGFkZDogZnVuY3Rpb24gYWRkQmVoYXZpb3IoZWxlbWVudCkge1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgIGxpc3RlbmVyLnR5cGUsXG4gICAgICAgICAgbGlzdGVuZXIuZGVsZWdhdGUsXG4gICAgICAgICAgbGlzdGVuZXIub3B0aW9uc1xuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZUJlaGF2aW9yKGVsZW1lbnQpIHtcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3RlbmVyKSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBsaXN0ZW5lci50eXBlLFxuICAgICAgICAgIGxpc3RlbmVyLmRlbGVnYXRlLFxuICAgICAgICAgIGxpc3RlbmVyLm9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwgcHJvcHMpO1xufTtcbiIsImNvbnN0IG1hdGNoZXMgPSByZXF1aXJlKCdtYXRjaGVzLXNlbGVjdG9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZWxlbWVudCwgc2VsZWN0b3IpIHtcbiAgZG8ge1xuICAgIGlmIChtYXRjaGVzKGVsZW1lbnQsIHNlbGVjdG9yKSkge1xuICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuICB9IHdoaWxlICgoZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZSkgJiYgZWxlbWVudC5ub2RlVHlwZSA9PT0gMSk7XG59O1xuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbXBvc2UoZnVuY3Rpb25zKSB7XG4gIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9ucy5zb21lKGZ1bmN0aW9uKGZuKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBlKSA9PT0gZmFsc2U7XG4gICAgfSwgdGhpcyk7XG4gIH07XG59O1xuIiwiY29uc3QgY2xvc2VzdCA9IHJlcXVpcmUoJy4vY2xvc2VzdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlbGVnYXRlKHNlbGVjdG9yLCBmbikge1xuICByZXR1cm4gZnVuY3Rpb24gZGVsZWdhdGlvbihldmVudCkge1xuICAgIHZhciB0YXJnZXQgPSBjbG9zZXN0KGV2ZW50LnRhcmdldCwgc2VsZWN0b3IpO1xuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRhcmdldCwgZXZlbnQpO1xuICAgIH1cbiAgfVxufTtcbiIsImNvbnN0IGRlbGVnYXRlID0gcmVxdWlyZSgnLi9kZWxlZ2F0ZScpO1xuY29uc3QgY29tcG9zZSA9IHJlcXVpcmUoJy4vY29tcG9zZScpO1xuXG5jb25zdCBTUExBVCA9ICcqJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWxlZ2F0ZUFsbChzZWxlY3RvcnMpIHtcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHNlbGVjdG9ycylcblxuICAvLyBYWFggb3B0aW1pemF0aW9uOiBpZiB0aGVyZSBpcyBvbmx5IG9uZSBoYW5kbGVyIGFuZCBpdCBhcHBsaWVzIHRvXG4gIC8vIGFsbCBlbGVtZW50cyAodGhlIFwiKlwiIENTUyBzZWxlY3RvciksIHRoZW4ganVzdCByZXR1cm4gdGhhdFxuICAvLyBoYW5kbGVyXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMSAmJiBrZXlzWzBdID09PSBTUExBVCkge1xuICAgIHJldHVybiBzZWxlY3RvcnNbU1BMQVRdO1xuICB9XG5cbiAgY29uc3QgZGVsZWdhdGVzID0ga2V5cy5yZWR1Y2UoZnVuY3Rpb24obWVtbywgc2VsZWN0b3IpIHtcbiAgICBtZW1vLnB1c2goZGVsZWdhdGUoc2VsZWN0b3IsIHNlbGVjdG9yc1tzZWxlY3Rvcl0pKTtcbiAgICByZXR1cm4gbWVtbztcbiAgfSwgW10pO1xuICByZXR1cm4gY29tcG9zZShkZWxlZ2F0ZXMpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaWdub3JlKGVsZW1lbnQsIGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiBpZ25vcmFuY2UoZSkge1xuICAgIGlmIChlbGVtZW50ICE9PSBlLnRhcmdldCAmJiAhZWxlbWVudC5jb250YWlucyhlLnRhcmdldCkpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGUpO1xuICAgIH1cbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBiZWhhdmlvcjogcmVxdWlyZSgnLi9iZWhhdmlvcicpLFxuICBkZWxlZ2F0ZTogcmVxdWlyZSgnLi9kZWxlZ2F0ZScpLFxuICBkZWxlZ2F0ZUFsbDogcmVxdWlyZSgnLi9kZWxlZ2F0ZUFsbCcpLFxuICBpZ25vcmU6IHJlcXVpcmUoJy4vaWdub3JlJyksXG4gIGtleW1hcDogcmVxdWlyZSgnLi9rZXltYXAnKSxcbn07XG4iLCJyZXF1aXJlKCdrZXlib2FyZGV2ZW50LWtleS1wb2x5ZmlsbCcpO1xuXG4vLyB0aGVzZSBhcmUgdGhlIG9ubHkgcmVsZXZhbnQgbW9kaWZpZXJzIHN1cHBvcnRlZCBvbiBhbGwgcGxhdGZvcm1zLFxuLy8gYWNjb3JkaW5nIHRvIE1ETjpcbi8vIDxodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvS2V5Ym9hcmRFdmVudC9nZXRNb2RpZmllclN0YXRlPlxuY29uc3QgTU9ESUZJRVJTID0ge1xuICAnQWx0JzogICAgICAnYWx0S2V5JyxcbiAgJ0NvbnRyb2wnOiAgJ2N0cmxLZXknLFxuICAnQ3RybCc6ICAgICAnY3RybEtleScsXG4gICdTaGlmdCc6ICAgICdzaGlmdEtleSdcbn07XG5cbmNvbnN0IE1PRElGSUVSX1NFUEFSQVRPUiA9ICcrJztcblxuY29uc3QgZ2V0RXZlbnRLZXkgPSBmdW5jdGlvbihldmVudCwgaGFzTW9kaWZpZXJzKSB7XG4gIHZhciBrZXkgPSBldmVudC5rZXk7XG4gIGlmIChoYXNNb2RpZmllcnMpIHtcbiAgICBmb3IgKHZhciBtb2RpZmllciBpbiBNT0RJRklFUlMpIHtcbiAgICAgIGlmIChldmVudFtNT0RJRklFUlNbbW9kaWZpZXJdXSA9PT0gdHJ1ZSkge1xuICAgICAgICBrZXkgPSBbbW9kaWZpZXIsIGtleV0uam9pbihNT0RJRklFUl9TRVBBUkFUT1IpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4ga2V5O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBrZXltYXAoa2V5cykge1xuICBjb25zdCBoYXNNb2RpZmllcnMgPSBPYmplY3Qua2V5cyhrZXlzKS5zb21lKGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBrZXkuaW5kZXhPZihNT0RJRklFUl9TRVBBUkFUT1IpID4gLTE7XG4gIH0pO1xuICByZXR1cm4gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIga2V5ID0gZ2V0RXZlbnRLZXkoZXZlbnQsIGhhc01vZGlmaWVycyk7XG4gICAgcmV0dXJuIFtrZXksIGtleS50b0xvd2VyQ2FzZSgpXVxuICAgICAgLnJlZHVjZShmdW5jdGlvbihyZXN1bHQsIF9rZXkpIHtcbiAgICAgICAgaWYgKF9rZXkgaW4ga2V5cykge1xuICAgICAgICAgIHJlc3VsdCA9IGtleXNba2V5XS5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSwgdW5kZWZpbmVkKTtcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLk1PRElGSUVSUyA9IE1PRElGSUVSUztcbiIsIid1c2Ugc3RyaWN0JztcclxuaW1wb3J0ICcuLi9wb2x5ZmlsbHMvRnVuY3Rpb24vcHJvdG90eXBlL2JpbmQnO1xyXG5jb25zdCB0b2dnbGUgPSByZXF1aXJlKCcuLi91dGlscy90b2dnbGUnKTtcclxuY29uc3QgaXNFbGVtZW50SW5WaWV3cG9ydCA9IHJlcXVpcmUoJy4uL3V0aWxzL2lzLWluLXZpZXdwb3J0Jyk7XHJcbmNvbnN0IEJVVFRPTiA9IGAuYWNjb3JkaW9uLWJ1dHRvblthcmlhLWNvbnRyb2xzXWA7XHJcbmNvbnN0IEVYUEFOREVEID0gJ2FyaWEtZXhwYW5kZWQnO1xyXG5jb25zdCBCVUxLX0ZVTkNUSU9OX0FDVElPTl9BVFRSSUJVVEUgPSBcImRhdGEtYWNjb3JkaW9uLWJ1bGstZXhwYW5kXCI7XHJcbmNvbnN0IFRFWFRfQUNDT1JESU9OID0ge1xyXG4gICAgXCJvcGVuX2FsbFwiOiBcIsOFYm4gYWxsZVwiLFxyXG4gICAgXCJjbG9zZV9hbGxcIjogXCJMdWsgYWxsZVwiXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGRzIGNsaWNrIGZ1bmN0aW9uYWxpdHkgdG8gYWNjb3JkaW9uIGxpc3RcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gJGFjY29yZGlvbiB0aGUgYWNjb3JkaW9uIHVsIGVsZW1lbnRcclxuICogQHBhcmFtIHtKU09OfSBzdHJpbmdzIFRyYW5zbGF0ZSBsYWJlbHM6IHtcIm9wZW5fYWxsXCI6IFwiw4VibiBhbGxlXCIsIFwiY2xvc2VfYWxsXCI6IFwiTHVrIGFsbGVcIn1cclxuICovXHJcbmZ1bmN0aW9uIEFjY29yZGlvbigkYWNjb3JkaW9uLCBzdHJpbmdzID0gVEVYVF9BQ0NPUkRJT04pIHtcclxuICAgIGlmICghJGFjY29yZGlvbikge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBhY2NvcmRpb24gZ3JvdXAgZWxlbWVudGApO1xyXG4gICAgfVxyXG4gICAgdGhpcy5hY2NvcmRpb24gPSAkYWNjb3JkaW9uO1xyXG4gICAgdGhpcy50ZXh0ID0gc3RyaW5ncztcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCBldmVudGxpc3RlbmVycyBvbiBjbGljayBlbGVtZW50cyBpbiBhY2NvcmRpb24gbGlzdFxyXG4gKi9cclxuQWNjb3JkaW9uLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5idXR0b25zID0gdGhpcy5hY2NvcmRpb24ucXVlcnlTZWxlY3RvckFsbChCVVRUT04pO1xyXG4gICAgaWYgKHRoaXMuYnV0dG9ucy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBhY2NvcmRpb24gYnV0dG9uc2ApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGxvb3AgYnV0dG9ucyBpbiBsaXN0XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYnV0dG9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBjdXJyZW50QnV0dG9uID0gdGhpcy5idXR0b25zW2ldO1xyXG5cclxuICAgICAgICAvLyBWZXJpZnkgc3RhdGUgb24gYnV0dG9uIGFuZCBzdGF0ZSBvbiBwYW5lbFxyXG4gICAgICAgIGxldCBleHBhbmRlZCA9IGN1cnJlbnRCdXR0b24uZ2V0QXR0cmlidXRlKEVYUEFOREVEKSA9PT0gJ3RydWUnO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlQnV0dG9uKGN1cnJlbnRCdXR0b24sIGV4cGFuZGVkKTtcclxuXHJcbiAgICAgICAgLy8gU2V0IGNsaWNrIGV2ZW50IG9uIGFjY29yZGlvbiBidXR0b25zXHJcbiAgICAgICAgY3VycmVudEJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuZXZlbnRPbkNsaWNrLmJpbmQodGhpcywgY3VycmVudEJ1dHRvbiksIGZhbHNlKTtcclxuICAgICAgICBjdXJyZW50QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5ldmVudE9uQ2xpY2suYmluZCh0aGlzLCBjdXJyZW50QnV0dG9uKSwgZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgLy8gU2V0IGNsaWNrIGV2ZW50IG9uIGJ1bGsgYnV0dG9uIGlmIHByZXNlbnRcclxuICAgIGxldCBwcmV2U2libGluZyA9IHRoaXMuYWNjb3JkaW9uLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcbiAgICBpZiAocHJldlNpYmxpbmcgIT09IG51bGwgJiYgcHJldlNpYmxpbmcuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY2NvcmRpb24tYnVsay1idXR0b24nKSkge1xyXG4gICAgICAgIHRoaXMuYnVsa0Z1bmN0aW9uQnV0dG9uID0gcHJldlNpYmxpbmc7XHJcbiAgICAgICAgdGhpcy5idWxrRnVuY3Rpb25CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmJ1bGtFdmVudC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEJ1bGsgZXZlbnQgaGFuZGxlcjogVHJpZ2dlcmVkIHdoZW4gY2xpY2tpbmcgb24gLmFjY29yZGlvbi1idWxrLWJ1dHRvblxyXG4gKi9cclxuQWNjb3JkaW9uLnByb3RvdHlwZS5idWxrRXZlbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgJG1vZHVsZSA9IHRoaXM7XHJcbiAgICBpZiAoISRtb2R1bGUuYWNjb3JkaW9uLmNsYXNzTGlzdC5jb250YWlucygnYWNjb3JkaW9uJykpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGFjY29yZGlvbi5gKTtcclxuICAgIH1cclxuICAgIGlmICgkbW9kdWxlLmJ1dHRvbnMubGVuZ3RoID09IDApIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgYWNjb3JkaW9uIGJ1dHRvbnNgKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZXhwYW5kID0gdHJ1ZTtcclxuICAgIGlmICgkbW9kdWxlLmJ1bGtGdW5jdGlvbkJ1dHRvbi5nZXRBdHRyaWJ1dGUoQlVMS19GVU5DVElPTl9BQ1RJT05fQVRUUklCVVRFKSA9PT0gXCJmYWxzZVwiKSB7XHJcbiAgICAgICAgZXhwYW5kID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRtb2R1bGUuYnV0dG9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICRtb2R1bGUudG9nZ2xlQnV0dG9uKCRtb2R1bGUuYnV0dG9uc1tpXSwgZXhwYW5kLCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICAkbW9kdWxlLmJ1bGtGdW5jdGlvbkJ1dHRvbi5zZXRBdHRyaWJ1dGUoQlVMS19GVU5DVElPTl9BQ1RJT05fQVRUUklCVVRFLCAhZXhwYW5kKTtcclxuICAgIGlmICghZXhwYW5kID09PSB0cnVlKSB7XHJcbiAgICAgICAgJG1vZHVsZS5idWxrRnVuY3Rpb25CdXR0b24uaW5uZXJUZXh0ID0gdGhpcy50ZXh0Lm9wZW5fYWxsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAkbW9kdWxlLmJ1bGtGdW5jdGlvbkJ1dHRvbi5pbm5lclRleHQgPSB0aGlzLnRleHQuY2xvc2VfYWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQWNjb3JkaW9uIGJ1dHRvbiBldmVudCBoYW5kbGVyOiBUb2dnbGVzIGFjY29yZGlvblxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSAkYnV0dG9uIFxyXG4gKiBAcGFyYW0ge1BvaW50ZXJFdmVudH0gZSBcclxuICovXHJcbkFjY29yZGlvbi5wcm90b3R5cGUuZXZlbnRPbkNsaWNrID0gZnVuY3Rpb24gKCRidXR0b24sIGUpIHtcclxuICAgIHZhciAkbW9kdWxlID0gdGhpcztcclxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAkbW9kdWxlLnRvZ2dsZUJ1dHRvbigkYnV0dG9uKTtcclxuICAgIGlmICgkYnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICd0cnVlJykge1xyXG4gICAgICAgIC8vIFdlIHdlcmUganVzdCBleHBhbmRlZCwgYnV0IGlmIGFub3RoZXIgYWNjb3JkaW9uIHdhcyBhbHNvIGp1c3RcclxuICAgICAgICAvLyBjb2xsYXBzZWQsIHdlIG1heSBubyBsb25nZXIgYmUgaW4gdGhlIHZpZXdwb3J0LiBUaGlzIGVuc3VyZXNcclxuICAgICAgICAvLyB0aGF0IHdlIGFyZSBzdGlsbCB2aXNpYmxlLCBzbyB0aGUgdXNlciBpc24ndCBjb25mdXNlZC5cclxuICAgICAgICBpZiAoIWlzRWxlbWVudEluVmlld3BvcnQoJGJ1dHRvbikpICRidXR0b24uc2Nyb2xsSW50b1ZpZXcoKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFRvZ2dsZSBhIGJ1dHRvbidzIFwicHJlc3NlZFwiIHN0YXRlLCBvcHRpb25hbGx5IHByb3ZpZGluZyBhIHRhcmdldFxyXG4gKiBzdGF0ZS5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gYnV0dG9uXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbj99IGV4cGFuZGVkIElmIG5vIHN0YXRlIGlzIHByb3ZpZGVkLCB0aGUgY3VycmVudFxyXG4gKiBzdGF0ZSB3aWxsIGJlIHRvZ2dsZWQgKGZyb20gZmFsc2UgdG8gdHJ1ZSwgYW5kIHZpY2UtdmVyc2EpLlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSB0aGUgcmVzdWx0aW5nIHN0YXRlXHJcbiAqL1xyXG5BY2NvcmRpb24ucHJvdG90eXBlLnRvZ2dsZUJ1dHRvbiA9IGZ1bmN0aW9uIChidXR0b24sIGV4cGFuZGVkLCBidWxrID0gZmFsc2UpIHtcclxuICAgIGxldCBhY2NvcmRpb24gPSBudWxsO1xyXG4gICAgaWYgKGJ1dHRvbi5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY2NvcmRpb24nKSkge1xyXG4gICAgICAgIGFjY29yZGlvbiA9IGJ1dHRvbi5wYXJlbnROb2RlLnBhcmVudE5vZGU7XHJcbiAgICB9IGVsc2UgaWYgKGJ1dHRvbi5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjY29yZGlvbicpKSB7XHJcbiAgICAgICAgYWNjb3JkaW9uID0gYnV0dG9uLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xyXG4gICAgfVxyXG4gICAgZXhwYW5kZWQgPSB0b2dnbGUoYnV0dG9uLCBleHBhbmRlZCk7XHJcbiAgICBpZiAoZXhwYW5kZWQpIHtcclxuICAgICAgICBsZXQgZXZlbnRPcGVuID0gbmV3IEV2ZW50KCdmZHMuYWNjb3JkaW9uLm9wZW4nKTtcclxuICAgICAgICBidXR0b24uZGlzcGF0Y2hFdmVudChldmVudE9wZW4pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLmFjY29yZGlvbi5jbG9zZScpO1xyXG4gICAgICAgIGJ1dHRvbi5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChhY2NvcmRpb24gIT09IG51bGwpIHtcclxuICAgICAgICBsZXQgYnVsa0Z1bmN0aW9uID0gYWNjb3JkaW9uLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgaWYgKGJ1bGtGdW5jdGlvbiAhPT0gbnVsbCAmJiBidWxrRnVuY3Rpb24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY2NvcmRpb24tYnVsay1idXR0b24nKSkge1xyXG4gICAgICAgICAgICBsZXQgYnV0dG9ucyA9IGFjY29yZGlvbi5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTik7XHJcbiAgICAgICAgICAgIGlmIChidWxrID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJ1dHRvbnNPcGVuID0gYWNjb3JkaW9uLnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OICsgJ1thcmlhLWV4cGFuZGVkPVwidHJ1ZVwiXScpO1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld1N0YXR1cyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGJ1dHRvbnMubGVuZ3RoID09PSBidXR0b25zT3Blbi5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdTdGF0dXMgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBidWxrRnVuY3Rpb24uc2V0QXR0cmlidXRlKEJVTEtfRlVOQ1RJT05fQUNUSU9OX0FUVFJJQlVURSwgbmV3U3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIGlmIChuZXdTdGF0dXMgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBidWxrRnVuY3Rpb24uaW5uZXJUZXh0ID0gdGhpcy50ZXh0Lm9wZW5fYWxsO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBidWxrRnVuY3Rpb24uaW5uZXJUZXh0ID0gdGhpcy50ZXh0LmNsb3NlX2FsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEFjY29yZGlvbjsiLCIndXNlIHN0cmljdCc7XHJcbmZ1bmN0aW9uIEFsZXJ0KGFsZXJ0KXtcclxuICAgIHRoaXMuYWxlcnQgPSBhbGVydDtcclxufVxyXG5cclxuQWxlcnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xyXG4gICAgbGV0IGNsb3NlID0gdGhpcy5hbGVydC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhbGVydC1jbG9zZScpO1xyXG4gICAgaWYoY2xvc2UubGVuZ3RoID09PSAxKXtcclxuICAgICAgICBjbG9zZVswXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZS5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxufVxyXG5cclxuQWxlcnQucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5hbGVydC5jbGFzc0xpc3QuYWRkKCdkLW5vbmUnKTtcclxuICAgIGxldCBldmVudEhpZGUgPSBuZXcgRXZlbnQoJ2Zkcy5hbGVydC5oaWRlJyk7XHJcbiAgICB0aGlzLmFsZXJ0LmRpc3BhdGNoRXZlbnQoZXZlbnRIaWRlKTtcclxufTtcclxuXHJcbkFsZXJ0LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuYWxlcnQuY2xhc3NMaXN0LnJlbW92ZSgnZC1ub25lJyk7XHJcbiAgICBcclxuICAgIGxldCBldmVudFNob3cgPSBuZXcgRXZlbnQoJ2Zkcy5hbGVydC5zaG93Jyk7XHJcbiAgICB0aGlzLmFsZXJ0LmRpc3BhdGNoRXZlbnQoZXZlbnRTaG93KTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEFsZXJ0OyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmZ1bmN0aW9uIEJhY2tUb1RvcChiYWNrdG90b3Ape1xyXG4gICAgdGhpcy5iYWNrdG90b3AgPSBiYWNrdG90b3A7XHJcbn1cclxuXHJcbkJhY2tUb1RvcC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGJhY2t0b3RvcGJ1dHRvbiA9IHRoaXMuYmFja3RvdG9wO1xyXG5cclxuICAgIHVwZGF0ZUJhY2tUb1RvcEJ1dHRvbihiYWNrdG90b3BidXR0b24pO1xyXG5cclxuICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoIGxpc3QgPT4ge1xyXG4gICAgICAgIGNvbnN0IGV2dCA9IG5ldyBDdXN0b21FdmVudCgnZG9tLWNoYW5nZWQnLCB7ZGV0YWlsOiBsaXN0fSk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5kaXNwYXRjaEV2ZW50KGV2dClcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFdoaWNoIG11dGF0aW9ucyB0byBvYnNlcnZlXHJcbiAgICBsZXQgY29uZmlnID0ge1xyXG4gICAgICAgIGF0dHJpYnV0ZXMgICAgICAgICAgICA6IHRydWUsXHJcbiAgICAgICAgYXR0cmlidXRlT2xkVmFsdWUgICAgIDogZmFsc2UsXHJcbiAgICAgICAgY2hhcmFjdGVyRGF0YSAgICAgICAgIDogdHJ1ZSxcclxuICAgICAgICBjaGFyYWN0ZXJEYXRhT2xkVmFsdWUgOiBmYWxzZSxcclxuICAgICAgICBjaGlsZExpc3QgICAgICAgICAgICAgOiB0cnVlLFxyXG4gICAgICAgIHN1YnRyZWUgICAgICAgICAgICAgICA6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgLy8gRE9NIGNoYW5nZXNcclxuICAgIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwgY29uZmlnKTtcclxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignZG9tLWNoYW5nZWQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgdXBkYXRlQmFja1RvVG9wQnV0dG9uKGJhY2t0b3RvcGJ1dHRvbik7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBTY3JvbGwgYWN0aW9uc1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB1cGRhdGVCYWNrVG9Ub3BCdXR0b24oYmFja3RvdG9wYnV0dG9uKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFdpbmRvdyByZXNpemVzXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHVwZGF0ZUJhY2tUb1RvcEJ1dHRvbihiYWNrdG90b3BidXR0b24pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUJhY2tUb1RvcEJ1dHRvbihidXR0b24pIHtcclxuICAgIGxldCBkb2NCb2R5ID0gZG9jdW1lbnQuYm9keTtcclxuICAgIGxldCBkb2NFbGVtID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gICAgbGV0IGhlaWdodE9mVmlld3BvcnQgPSBNYXRoLm1heChkb2NFbGVtLmNsaWVudEhlaWdodCB8fCAwLCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMCk7XHJcbiAgICBsZXQgaGVpZ2h0T2ZQYWdlID0gTWF0aC5tYXgoZG9jQm9keS5zY3JvbGxIZWlnaHQsIGRvY0JvZHkub2Zmc2V0SGVpZ2h0LCBkb2NCb2R5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2NFbGVtLnNjcm9sbEhlaWdodCwgZG9jRWxlbS5vZmZzZXRIZWlnaHQsIGRvY0VsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0LCBkb2NFbGVtLmNsaWVudEhlaWdodCk7XHJcbiAgICBcclxuICAgIGxldCBsaW1pdCA9IGhlaWdodE9mVmlld3BvcnQgKiAyOyAvLyBUaGUgdGhyZXNob2xkIHNlbGVjdGVkIHRvIGRldGVybWluZSB3aGV0aGVyIGEgYmFjay10by10b3AtYnV0dG9uIHNob3VsZCBiZSBkaXNwbGF5ZWRcclxuICAgIFxyXG4gICAgLy8gTmV2ZXIgc2hvdyB0aGUgYnV0dG9uIGlmIHRoZSBwYWdlIGlzIHRvbyBzaG9ydFxyXG4gICAgaWYgKGxpbWl0ID4gaGVpZ2h0T2ZQYWdlKSB7XHJcbiAgICAgICAgaWYgKCFidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdkLW5vbmUnKSkge1xyXG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnZC1ub25lJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gSWYgdGhlIHBhZ2UgaXMgbG9uZywgY2FsY3VsYXRlIHdoZW4gdG8gc2hvdyB0aGUgYnV0dG9uXHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpZiAoYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnZC1ub25lJykpIHtcclxuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Qtbm9uZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGxhc3RLbm93blNjcm9sbFBvc2l0aW9uID0gd2luZG93LnNjcm9sbFk7XHJcbiAgICAgICAgbGV0IGZvb3RlciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiZm9vdGVyXCIpWzBdOyAvLyBJZiB0aGVyZSBhcmUgc2V2ZXJhbCBmb290ZXJzLCB0aGUgY29kZSBvbmx5IGFwcGxpZXMgdG8gdGhlIGZpcnN0IGZvb3RlclxyXG5cclxuICAgICAgICAvLyBTaG93IHRoZSBidXR0b24sIGlmIHRoZSB1c2VyIGhhcyBzY3JvbGxlZCB0b28gZmFyIGRvd25cclxuICAgICAgICBpZiAobGFzdEtub3duU2Nyb2xsUG9zaXRpb24gPj0gbGltaXQpIHtcclxuICAgICAgICAgICAgaWYgKCFpc0Zvb3RlclZpc2libGUoZm9vdGVyKSAmJiBidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdmb290ZXItc3RpY2t5JykpIHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdmb290ZXItc3RpY2t5Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaXNGb290ZXJWaXNpYmxlKGZvb3RlcikgJiYgIWJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvb3Rlci1zdGlja3knKSkge1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2Zvb3Rlci1zdGlja3knKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBJZiB0aGVyZSdzIGEgc2lkZW5hdiwgd2UgbWlnaHQgd2FudCB0byBzaG93IHRoZSBidXR0b24gYW55d2F5XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBzaWRlbmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNpZGVuYXYtbGlzdCcpOyAvLyBGaW5kcyBzaWRlIG5hdmlnYXRpb25zIChsZWZ0IG1lbnVzKSBhbmQgc3RlcCBndWlkZXNcclxuXHJcbiAgICAgICAgICAgIGlmIChzaWRlbmF2ICYmIHNpZGVuYXYub2Zmc2V0UGFyZW50ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBPbmx5IHJlYWN0IHRvIHNpZGVuYXZzLCB3aGljaCBhcmUgYWx3YXlzIHZpc2libGUgKGkuZS4gbm90IG9wZW5lZCBmcm9tIG92ZXJmbG93LW1lbnUgYnV0dG9ucylcclxuICAgICAgICAgICAgICAgIGlmICghKHNpZGVuYXYuY2xvc2VzdChcIi5vdmVyZmxvdy1tZW51LWlubmVyXCIpPy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nPy5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gXCJ0cnVlXCIgJiZcclxuICAgICAgICAgICAgICAgIHNpZGVuYXYuY2xvc2VzdChcIi5vdmVyZmxvdy1tZW51LWlubmVyXCIpPy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nPy5vZmZzZXRQYXJlbnQgIT09IG51bGwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlY3QgPSBzaWRlbmF2LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWN0LmJvdHRvbSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0Zvb3RlclZpc2libGUoZm9vdGVyKSAmJiBidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdmb290ZXItc3RpY2t5JykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdmb290ZXItc3RpY2t5Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoaXNGb290ZXJWaXNpYmxlKGZvb3RlcikgJiYgIWJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvb3Rlci1zdGlja3knKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2Zvb3Rlci1zdGlja3knKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdmb290ZXItc3RpY2t5JykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdmb290ZXItc3RpY2t5Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIFRoZXJlJ3Mgbm8gc2lkZW5hdiBhbmQgd2Uga25vdyB0aGUgdXNlciBoYXNuJ3QgcmVhY2hlZCB0aGUgc2Nyb2xsIGxpbWl0OiBFbnN1cmUgdGhlIGJ1dHRvbiBpcyBoaWRkZW5cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvb3Rlci1zdGlja3knKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdmb290ZXItc3RpY2t5Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBpc0Zvb3RlclZpc2libGUoZm9vdGVyRWxlbWVudCkge1xyXG4gICAgaWYgKGZvb3RlckVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJy5mb290ZXInKSkge1xyXG4gICAgICAgIGxldCByZWN0ID0gZm9vdGVyRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZm9vdGVyJykuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgICAgIC8vIEZvb3RlciBpcyB2aXNpYmxlIG9yIHBhcnRseSB2aXNpYmxlXHJcbiAgICAgICAgaWYgKChyZWN0LnRvcCA8IHdpbmRvdy5pbm5lckhlaWdodCB8fCByZWN0LnRvcCA8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBGb290ZXIgaXMgaGlkZGVuXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEJhY2tUb1RvcDsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBNQVhfTEVOR1RIID0gJ2RhdGEtbWF4bGVuZ3RoJztcclxuY29uc3QgVEVYVF9DSEFSQUNURVJMSU1JVCA9IHtcclxuICAgIFwiY2hhcmFjdGVyX3JlbWFpbmluZ1wiOiBcIkR1IGhhciB7dmFsdWV9IHRlZ24gdGlsYmFnZVwiLFxyXG4gICAgXCJjaGFyYWN0ZXJzX3JlbWFpbmluZ1wiOiBcIkR1IGhhciB7dmFsdWV9IHRlZ24gdGlsYmFnZVwiLFxyXG4gICAgXCJjaGFyYWN0ZXJfdG9vX21hbnlcIjogXCJEdSBoYXIge3ZhbHVlfSB0ZWduIGZvciBtZWdldFwiLFxyXG4gICAgXCJjaGFyYWN0ZXJzX3Rvb19tYW55XCI6IFwiRHUgaGFyIHt2YWx1ZX0gdGVnbiBmb3IgbWVnZXRcIlxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNob3cgbnVtYmVyIG9mIGNoYXJhY3RlcnMgbGVmdCBpbiBhIGZpZWxkXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lckVsZW1lbnQgXHJcbiAqIEBwYXJhbSB7SlNPTn0gc3RyaW5ncyBUcmFuc2xhdGUgbGFiZWxzOiB7XCJjaGFyYWN0ZXJfcmVtYWluaW5nXCI6IFwiRHUgaGFyIHt2YWx1ZX0gdGVnbiB0aWxiYWdlXCIsIFwiY2hhcmFjdGVyc19yZW1haW5pbmdcIjogXCJEdSBoYXIge3ZhbHVlfSB0ZWduIHRpbGJhZ2VcIiwgXCJjaGFyYWN0ZXJfdG9vX21hbnlcIjogXCJEdSBoYXIge3ZhbHVlfSB0ZWduIGZvciBtZWdldFwiLCBcImNoYXJhY3RlcnNfdG9vX21hbnlcIjogXCJEdSBoYXIge3ZhbHVlfSB0ZWduIGZvciBtZWdldFwifVxyXG4gKi9cclxuIGZ1bmN0aW9uIENoYXJhY3RlckxpbWl0KGNvbnRhaW5lckVsZW1lbnQsIHN0cmluZ3MgPSBURVhUX0NIQVJBQ1RFUkxJTUlUKSB7XHJcbiAgICBpZiAoIWNvbnRhaW5lckVsZW1lbnQpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgZm9ybS1saW1pdCBlbGVtZW50YCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lckVsZW1lbnQ7XHJcbiAgICB0aGlzLmlucHV0ID0gY29udGFpbmVyRWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmb3JtLWlucHV0JylbMF07XHJcbiAgICB0aGlzLm1heGxlbmd0aCA9IHRoaXMuY29udGFpbmVyLmdldEF0dHJpYnV0ZShNQVhfTEVOR1RIKTtcclxuICAgIHRoaXMudGV4dCA9IHN0cmluZ3M7XHJcblxyXG4gICAgbGV0IGxhc3RLZXlVcFRpbWVzdGFtcCA9IG51bGw7XHJcbiAgICBsZXQgb2xkVmFsdWUgPSB0aGlzLmlucHV0LnZhbHVlO1xyXG4gICAgbGV0IGludGVydmFsSUQgPSBudWxsO1xyXG5cclxuICAgIGxldCBoYW5kbGVLZXlVcCA9ICgpID0+IHtcclxuICAgICAgICB1cGRhdGVWaXNpYmxlTWVzc2FnZSh0aGlzKTtcclxuICAgICAgICBsYXN0S2V5VXBUaW1lc3RhbXAgPSBEYXRlLm5vdygpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBoYW5kbGVGb2N1cyA9ICgpID0+IHtcclxuICAgICAgICAvKiBSZXNldCB0aGUgc2NyZWVuIHJlYWRlciBtZXNzYWdlIG9uIGZvY3VzIHRvIGZvcmNlIGFuIHVwZGF0ZSBvZiB0aGUgbWVzc2FnZS5cclxuICAgICAgICBUaGlzIGVuc3VyZXMgdGhhdCBhIHNjcmVlbiByZWFkZXIgaW5mb3JtcyB0aGUgdXNlciBvZiBob3cgbWFueSBjaGFyYWN0ZXJzIHRoZXJlIGlzIGxlZnRcclxuICAgICAgICBvbiBmb2N1cyBhbmQgbm90IGp1c3Qgd2hhdCB0aGUgY2hhcmFjdGVyIGxpbWl0IGlzLiAqL1xyXG4gICAgICAgIGlmICh0aGlzLmlucHV0LnZhbHVlICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIGxldCBzcl9tZXNzYWdlID0gdGhpcy5jb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2hhcmFjdGVyLWxpbWl0LXNyLW9ubHknKVswXTtcclxuICAgICAgICAgICAgc3JfbWVzc2FnZS5pbm5lckhUTUwgPSAnJztcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICBpbnRlcnZhbElEID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvKiBEb24ndCB1cGRhdGUgdGhlIFNjcmVlbiBSZWFkZXIgbWVzc2FnZSB1bmxlc3MgaXQncyBiZWVuIGF3aGlsZVxyXG4gICAgICAgICAgICBzaW5jZSB0aGUgbGFzdCBrZXkgdXAgZXZlbnQuIE90aGVyd2lzZSwgdGhlIHVzZXIgd2lsbCBiZSBzcGFtbWVkXHJcbiAgICAgICAgICAgIHdpdGggYXVkaW8gbm90aWZpY2F0aW9ucyB3aGlsZSB0eXBpbmcuICovXHJcbiAgICAgICAgICAgIGlmICghbGFzdEtleVVwVGltZXN0YW1wIHx8IChEYXRlLm5vdygpIC0gNTAwKSA+PSBsYXN0S2V5VXBUaW1lc3RhbXApIHtcclxuICAgICAgICAgICAgICAgIGxldCBzcl9tZXNzYWdlID0gdGhpcy5jb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2hhcmFjdGVyLWxpbWl0LXNyLW9ubHknKVswXS5pbm5lckhUTUw7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmlzaWJsZV9tZXNzYWdlID0gdGhpcy5jb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2hhcmFjdGVyLWxpbWl0JylbMF0uaW5uZXJIVE1MOyAgICAgXHJcbiAgICBcclxuICAgICAgICAgICAgICAgIC8qIERvbid0IHVwZGF0ZSB0aGUgbWVzc2FnZXMgdW5sZXNzIHRoZSBpbnB1dCBoYXMgY2hhbmdlZCBvciBpZiB0aGVyZVxyXG4gICAgICAgICAgICAgICAgaXMgYSBtaXNtYXRjaCBiZXR3ZWVuIHRoZSB2aXNpYmxlIG1lc3NhZ2UgYW5kIHRoZSBzY3JlZW4gcmVhZGVyIG1lc3NhZ2UuICovXHJcbiAgICAgICAgICAgICAgICBpZiAob2xkVmFsdWUgIT09IHRoaXMuaW5wdXQudmFsdWUgfHwgc3JfbWVzc2FnZSAhPT0gdmlzaWJsZV9tZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2xkVmFsdWUgPSB0aGlzLmlucHV0LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlTWVzc2FnZXMoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0uYmluZCh0aGlzKSwgMTAwMCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGxldCBoYW5kbGVCbHVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxJRCk7XHJcbiAgICAgICAgLy8gRG9uJ3QgdXBkYXRlIHRoZSBtZXNzYWdlcyBvbiBibHVyIHVubGVzcyB0aGUgdmFsdWUgb2YgdGhlIHRleHRhcmVhL3RleHQgaW5wdXQgaGFzIGNoYW5nZWRcclxuICAgICAgICBpZiAob2xkVmFsdWUgIT09IHRoaXMuaW5wdXQudmFsdWUpIHtcclxuICAgICAgICAgICAgb2xkVmFsdWUgPSB0aGlzLmlucHV0LnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU1lc3NhZ2VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5tYXhsZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDaGFyYWN0ZXIgbGltaXQgaXMgbWlzc2luZyBhdHRyaWJ1dGUgJHtNQVhfTEVOR1RIfWApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBoYW5kbGVLZXlVcCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaGFuZGxlRm9jdXMoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaGFuZGxlQmx1cigpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvKiBJZiB0aGUgYnJvd3NlciBzdXBwb3J0cyB0aGUgcGFnZXNob3cgZXZlbnQsIHVzZSBpdCB0byB1cGRhdGUgdGhlIGNoYXJhY3RlciBsaW1pdFxyXG4gICAgICAgIG1lc3NhZ2UgYW5kIHNyLW1lc3NhZ2Ugb25jZSBhIHBhZ2UgaGFzIGxvYWRlZC4gU2Vjb25kIGJlc3QsIHVzZSB0aGUgRE9NQ29udGVudExvYWRlZCBldmVudC4gXHJcbiAgICAgICAgVGhpcyBlbnN1cmVzIHRoYXQgaWYgdGhlIHVzZXIgbmF2aWdhdGVzIHRvIGFub3RoZXIgcGFnZSBpbiB0aGUgYnJvd3NlciBhbmQgZ29lcyBiYWNrLCB0aGUgXHJcbiAgICAgICAgbWVzc2FnZSBhbmQgc3ItbWVzc2FnZSB3aWxsIHNob3cvdGVsbCB0aGUgY29ycmVjdCBhbW91bnQgb2YgY2hhcmFjdGVycyBsZWZ0LiAqL1xyXG4gICAgICAgIGlmICgnb25wYWdlc2hvdycgaW4gd2luZG93KSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwYWdlc2hvdycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlTWVzc2FnZXMoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZU1lc3NhZ2VzKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbkNoYXJhY3RlckxpbWl0LnByb3RvdHlwZS5jaGFyYWN0ZXJzTGVmdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBjdXJyZW50X2xlbmd0aCA9IHRoaXMuaW5wdXQudmFsdWUubGVuZ3RoO1xyXG4gICAgcmV0dXJuIHRoaXMubWF4bGVuZ3RoIC0gY3VycmVudF9sZW5ndGg7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoYXJhY3RlckxpbWl0TWVzc2FnZShmb3JtTGltaXQpIHtcclxuICAgIGxldCBjb3VudF9tZXNzYWdlID0gXCJcIjtcclxuICAgIGxldCBjaGFyYWN0ZXJzX2xlZnQgPSBmb3JtTGltaXQuY2hhcmFjdGVyc0xlZnQoKTtcclxuXHJcbiAgICBpZiAoY2hhcmFjdGVyc19sZWZ0ID09PSAtMSkge1xyXG4gICAgICAgIGxldCBleGNlZWRlZCA9IE1hdGguYWJzKGNoYXJhY3RlcnNfbGVmdCk7XHJcbiAgICAgICAgY291bnRfbWVzc2FnZSA9IGZvcm1MaW1pdC50ZXh0LmNoYXJhY3Rlcl90b29fbWFueS5yZXBsYWNlKC97dmFsdWV9LywgZXhjZWVkZWQpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoY2hhcmFjdGVyc19sZWZ0ID09PSAxKSB7XHJcbiAgICAgICAgY291bnRfbWVzc2FnZSA9IGZvcm1MaW1pdC50ZXh0LmNoYXJhY3Rlcl9yZW1haW5pbmcucmVwbGFjZSgve3ZhbHVlfS8sIGNoYXJhY3RlcnNfbGVmdCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChjaGFyYWN0ZXJzX2xlZnQgPj0gMCkge1xyXG4gICAgICAgIGNvdW50X21lc3NhZ2UgPSBmb3JtTGltaXQudGV4dC5jaGFyYWN0ZXJzX3JlbWFpbmluZy5yZXBsYWNlKC97dmFsdWV9LywgY2hhcmFjdGVyc19sZWZ0KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGxldCBleGNlZWRlZCA9IE1hdGguYWJzKGNoYXJhY3RlcnNfbGVmdCk7XHJcbiAgICAgICAgY291bnRfbWVzc2FnZSA9IGZvcm1MaW1pdC50ZXh0LmNoYXJhY3RlcnNfdG9vX21hbnkucmVwbGFjZSgve3ZhbHVlfS8sIGV4Y2VlZGVkKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY291bnRfbWVzc2FnZTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlVmlzaWJsZU1lc3NhZ2UoZm9ybUxpbWl0KSB7XHJcbiAgICBsZXQgY2hhcmFjdGVyc19sZWZ0ID0gZm9ybUxpbWl0LmNoYXJhY3RlcnNMZWZ0KCk7XHJcbiAgICBsZXQgY291bnRfbWVzc2FnZSA9IGNoYXJhY3RlckxpbWl0TWVzc2FnZShmb3JtTGltaXQpO1xyXG4gICAgbGV0IGNoYXJhY3Rlcl9sYWJlbCA9IGZvcm1MaW1pdC5jb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2hhcmFjdGVyLWxpbWl0JylbMF07XHJcblxyXG4gICAgaWYgKGNoYXJhY3RlcnNfbGVmdCA8IDApIHtcclxuICAgICAgICBpZiAoIWNoYXJhY3Rlcl9sYWJlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2xpbWl0LWV4Y2VlZGVkJykpIHtcclxuICAgICAgICAgICAgY2hhcmFjdGVyX2xhYmVsLmNsYXNzTGlzdC5hZGQoJ2xpbWl0LWV4Y2VlZGVkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZm9ybUxpbWl0LmlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZm9ybS1saW1pdC1lcnJvcicpKSB7XHJcbiAgICAgICAgICAgIGZvcm1MaW1pdC5pbnB1dC5jbGFzc0xpc3QuYWRkKCdmb3JtLWxpbWl0LWVycm9yJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKGNoYXJhY3Rlcl9sYWJlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2xpbWl0LWV4Y2VlZGVkJykpIHtcclxuICAgICAgICAgICAgY2hhcmFjdGVyX2xhYmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2xpbWl0LWV4Y2VlZGVkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChmb3JtTGltaXQuaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb3JtLWxpbWl0LWVycm9yJykpIHtcclxuICAgICAgICAgICAgZm9ybUxpbWl0LmlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ2Zvcm0tbGltaXQtZXJyb3InKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2hhcmFjdGVyX2xhYmVsLmlubmVySFRNTCA9IGNvdW50X21lc3NhZ2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVNjcmVlblJlYWRlck1lc3NhZ2UoZm9ybUxpbWl0KSB7XHJcbiAgICBsZXQgY291bnRfbWVzc2FnZSA9IGNoYXJhY3RlckxpbWl0TWVzc2FnZShmb3JtTGltaXQpO1xyXG4gICAgbGV0IGNoYXJhY3Rlcl9sYWJlbCA9IGZvcm1MaW1pdC5jb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2hhcmFjdGVyLWxpbWl0LXNyLW9ubHknKVswXTtcclxuICAgIGNoYXJhY3Rlcl9sYWJlbC5pbm5lckhUTUwgPSBjb3VudF9tZXNzYWdlO1xyXG59XHJcblxyXG5DaGFyYWN0ZXJMaW1pdC5wcm90b3R5cGUudXBkYXRlTWVzc2FnZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB1cGRhdGVWaXNpYmxlTWVzc2FnZSh0aGlzKTtcclxuICAgIHVwZGF0ZVNjcmVlblJlYWRlck1lc3NhZ2UodGhpcyk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENoYXJhY3RlckxpbWl0OyIsIid1c2Ugc3RyaWN0JztcclxuaW1wb3J0ICcuLi9wb2x5ZmlsbHMvRnVuY3Rpb24vcHJvdG90eXBlL2JpbmQnO1xyXG5cclxuY29uc3QgVE9HR0xFX1RBUkdFVF9BVFRSSUJVVEUgPSAnZGF0YS1hcmlhLWNvbnRyb2xzJztcclxuXHJcbi8qKlxyXG4gKiBBZGRzIGNsaWNrIGZ1bmN0aW9uYWxpdHkgdG8gY2hlY2tib3ggY29sbGFwc2UgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gY2hlY2tib3hFbGVtZW50IFxyXG4gKi9cclxuZnVuY3Rpb24gQ2hlY2tib3hUb2dnbGVDb250ZW50KGNoZWNrYm94RWxlbWVudCl7XHJcbiAgICB0aGlzLmNoZWNrYm94RWxlbWVudCA9IGNoZWNrYm94RWxlbWVudDtcclxuICAgIHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRzIG9uIGNoZWNrYm94IHN0YXRlIGNoYW5nZVxyXG4gKi9cclxuQ2hlY2tib3hUb2dnbGVDb250ZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuY2hlY2tib3hFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRoaXMudG9nZ2xlLmJpbmQodGhpcykpO1xyXG4gICAgdGhpcy50b2dnbGUoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFRvZ2dsZSBjaGVja2JveCBjb250ZW50XHJcbiAqL1xyXG5DaGVja2JveFRvZ2dsZUNvbnRlbnQucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgJG1vZHVsZSA9IHRoaXM7XHJcbiAgICB2YXIgdGFyZ2V0QXR0ciA9IHRoaXMuY2hlY2tib3hFbGVtZW50LmdldEF0dHJpYnV0ZShUT0dHTEVfVEFSR0VUX0FUVFJJQlVURSlcclxuICAgIHZhciB0YXJnZXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldEF0dHIpO1xyXG4gICAgaWYodGFyZ2V0RWwgPT09IG51bGwgfHwgdGFyZ2V0RWwgPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBwYW5lbCBlbGVtZW50LiBWZXJpZnkgdmFsdWUgb2YgYXR0cmlidXRlIGArIFRPR0dMRV9UQVJHRVRfQVRUUklCVVRFKTtcclxuICAgIH1cclxuICAgIGlmKHRoaXMuY2hlY2tib3hFbGVtZW50LmNoZWNrZWQpe1xyXG4gICAgICAgICRtb2R1bGUuZXhwYW5kKHRoaXMuY2hlY2tib3hFbGVtZW50LCB0YXJnZXRFbCk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICAkbW9kdWxlLmNvbGxhcHNlKHRoaXMuY2hlY2tib3hFbGVtZW50LCB0YXJnZXRFbCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBFeHBhbmQgY29udGVudFxyXG4gKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGNoZWNrYm94RWxlbWVudCBDaGVja2JveCBpbnB1dCBlbGVtZW50IFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250ZW50RWxlbWVudCBDb250ZW50IGNvbnRhaW5lciBlbGVtZW50IFxyXG4gKi9cclxuQ2hlY2tib3hUb2dnbGVDb250ZW50LnByb3RvdHlwZS5leHBhbmQgPSBmdW5jdGlvbihjaGVja2JveEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KXtcclxuICAgIGlmKGNoZWNrYm94RWxlbWVudCAhPT0gbnVsbCAmJiBjaGVja2JveEVsZW1lbnQgIT09IHVuZGVmaW5lZCAmJiBjb250ZW50RWxlbWVudCAhPT0gbnVsbCAmJiBjb250ZW50RWxlbWVudCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICBjaGVja2JveEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLWFyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xyXG4gICAgICAgIGNvbnRlbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgIGNvbnRlbnRFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICBsZXQgZXZlbnRPcGVuID0gbmV3IEV2ZW50KCdmZHMuY29sbGFwc2UuZXhwYW5kZWQnKTtcclxuICAgICAgICBjaGVja2JveEVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudE9wZW4pO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQ29sbGFwc2UgY29udGVudFxyXG4gKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGNoZWNrYm94RWxlbWVudCBDaGVja2JveCBpbnB1dCBlbGVtZW50IFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250ZW50RWxlbWVudCBDb250ZW50IGNvbnRhaW5lciBlbGVtZW50IFxyXG4gKi9cclxuQ2hlY2tib3hUb2dnbGVDb250ZW50LnByb3RvdHlwZS5jb2xsYXBzZSA9IGZ1bmN0aW9uKHRyaWdnZXJFbCwgdGFyZ2V0RWwpe1xyXG4gICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG4gICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMuY29sbGFwc2UuY29sbGFwc2VkJyk7XHJcbiAgICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENoZWNrYm94VG9nZ2xlQ29udGVudDtcclxuIiwiaW1wb3J0IHtrZXltYXB9IGZyb20gJ3JlY2VwdG9yJztcclxuY29uc3QgYmVoYXZpb3IgPSByZXF1aXJlKFwiLi4vdXRpbHMvYmVoYXZpb3JcIik7XHJcbmNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoXCIuLi91dGlscy9zZWxlY3RcIik7XHJcbmNvbnN0IHsgcHJlZml4OiBQUkVGSVggfSA9IHJlcXVpcmUoXCIuLi9jb25maWdcIik7XHJcbmNvbnN0IHsgQ0xJQ0sgfSA9IHJlcXVpcmUoXCIuLi9ldmVudHNcIik7XHJcbmNvbnN0IGFjdGl2ZUVsZW1lbnQgPSByZXF1aXJlKFwiLi4vdXRpbHMvYWN0aXZlLWVsZW1lbnRcIik7XHJcbmNvbnN0IGlzSW9zRGV2aWNlID0gcmVxdWlyZShcIi4uL3V0aWxzL2lzLWlvcy1kZXZpY2VcIik7XHJcblxyXG5jb25zdCBEQVRFX1BJQ0tFUl9DTEFTUyA9IGBkYXRlLXBpY2tlcmA7XHJcbmNvbnN0IERBVEVfUElDS0VSX1dSQVBQRVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU31fX3dyYXBwZXJgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9JTklUSUFMSVpFRF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfS0taW5pdGlhbGl6ZWRgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9BQ1RJVkVfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU30tLWFjdGl2ZWA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0lOVEVSTkFMX0lOUFVUX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X19pbnRlcm5hbC1pbnB1dGA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X19leHRlcm5hbC1pbnB1dGA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0JVVFRPTl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9fYnV0dG9uYDtcclxuY29uc3QgREFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU31fX2NhbGVuZGFyYDtcclxuY29uc3QgREFURV9QSUNLRVJfU1RBVFVTX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X19zdGF0dXNgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9HVUlERV9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9fZ3VpZGVgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19kYXRlYDtcclxuXHJcbmNvbnN0IERJQUxPR19XUkFQUEVSX0NMQVNTID0gYGRpYWxvZy13cmFwcGVyYDtcclxuY29uc3QgREFURV9QSUNLRVJfRElBTE9HX1dSQVBQRVIgPSBgLiR7RElBTE9HX1dSQVBQRVJfQ0xBU1N9YDtcclxuXHJcbmNvbnN0IENBTEVOREFSX0RBVEVfRk9DVVNFRF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1mb2N1c2VkYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9TRUxFQ1RFRF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1zZWxlY3RlZGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfUFJFVklPVVNfTU9OVEhfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tcHJldmlvdXMtbW9udGhgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX0NVUlJFTlRfTU9OVEhfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tY3VycmVudC1tb250aGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfTkVYVF9NT05USF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1uZXh0LW1vbnRoYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9SQU5HRV9EQVRFX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXJhbmdlLWRhdGVgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1RPREFZX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXRvZGF5YDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9SQU5HRV9EQVRFX1NUQVJUX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXJhbmdlLWRhdGUtc3RhcnRgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1JBTkdFX0RBVEVfRU5EX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXJhbmdlLWRhdGUtZW5kYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9XSVRISU5fUkFOR0VfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0td2l0aGluLXJhbmdlYDtcclxuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fcHJldmlvdXMteWVhcmA7XHJcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX01PTlRIX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19wcmV2aW91cy1tb250aGA7XHJcbmNvbnN0IENBTEVOREFSX05FWFRfWUVBUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbmV4dC15ZWFyYDtcclxuY29uc3QgQ0FMRU5EQVJfTkVYVF9NT05USF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbmV4dC1tb250aGA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX1NFTEVDVElPTl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbW9udGgtc2VsZWN0aW9uYDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9TRUxFQ1RJT05fQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3llYXItc2VsZWN0aW9uYDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX21vbnRoYDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRF9DTEFTUyA9IGAke0NBTEVOREFSX01PTlRIX0NMQVNTfS0tZm9jdXNlZGA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX1NFTEVDVEVEX0NMQVNTID0gYCR7Q0FMRU5EQVJfTU9OVEhfQ0xBU1N9LS1zZWxlY3RlZGA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3llYXJgO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX0ZPQ1VTRURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9ZRUFSX0NMQVNTfS0tZm9jdXNlZGA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfU0VMRUNURURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9ZRUFSX0NMQVNTfS0tc2VsZWN0ZWRgO1xyXG5jb25zdCBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19wcmV2aW91cy15ZWFyLWNodW5rYDtcclxuY29uc3QgQ0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19uZXh0LXllYXItY2h1bmtgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1BJQ0tFUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fZGF0ZS1waWNrZXJgO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9QSUNLRVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX21vbnRoLXBpY2tlcmA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfUElDS0VSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X195ZWFyLXBpY2tlcmA7XHJcbmNvbnN0IENBTEVOREFSX1RBQkxFX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X190YWJsZWA7XHJcbmNvbnN0IENBTEVOREFSX1JPV19DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fcm93YDtcclxuY29uc3QgQ0FMRU5EQVJfQ0VMTF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fY2VsbGA7XHJcbmNvbnN0IENBTEVOREFSX0NFTExfQ0VOVEVSX0lURU1TX0NMQVNTID0gYCR7Q0FMRU5EQVJfQ0VMTF9DTEFTU30tLWNlbnRlci1pdGVtc2A7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX0xBQkVMX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19tb250aC1sYWJlbGA7XHJcbmNvbnN0IENBTEVOREFSX0RBWV9PRl9XRUVLX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19kYXktb2Ytd2Vla2A7XHJcblxyXG5jb25zdCBEQVRFX1BJQ0tFUiA9IGAuJHtEQVRFX1BJQ0tFUl9DTEFTU31gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9CVVRUT04gPSBgLiR7REFURV9QSUNLRVJfQlVUVE9OX0NMQVNTfWA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0lOVEVSTkFMX0lOUFVUID0gYC4ke0RBVEVfUElDS0VSX0lOVEVSTkFMX0lOUFVUX0NMQVNTfWA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUID0gYC4ke0RBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUX0NMQVNTfWA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0NBTEVOREFSID0gYC4ke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfWA7XHJcbmNvbnN0IERBVEVfUElDS0VSX1NUQVRVUyA9IGAuJHtEQVRFX1BJQ0tFUl9TVEFUVVNfQ0xBU1N9YDtcclxuY29uc3QgREFURV9QSUNLRVJfR1VJREUgPSBgLiR7REFURV9QSUNLRVJfR1VJREVfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfREFURSA9IGAuJHtDQUxFTkRBUl9EQVRFX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfRk9DVVNFRCA9IGAuJHtDQUxFTkRBUl9EQVRFX0ZPQ1VTRURfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9DVVJSRU5UX01PTlRIID0gYC4ke0NBTEVOREFSX0RBVEVfQ1VSUkVOVF9NT05USF9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSID0gYC4ke0NBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfTU9OVEggPSBgLiR7Q0FMRU5EQVJfUFJFVklPVVNfTU9OVEhfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTkVYVF9ZRUFSID0gYC4ke0NBTEVOREFSX05FWFRfWUVBUl9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9ORVhUX01PTlRIID0gYC4ke0NBTEVOREFSX05FWFRfTU9OVEhfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9TRUxFQ1RJT04gPSBgLiR7Q0FMRU5EQVJfWUVBUl9TRUxFQ1RJT05fQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfU0VMRUNUSU9OID0gYC4ke0NBTEVOREFSX01PTlRIX1NFTEVDVElPTl9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USCA9IGAuJHtDQUxFTkRBUl9NT05USF9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSID0gYC4ke0NBTEVOREFSX1lFQVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOSyA9IGAuJHtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX05FWFRfWUVBUl9DSFVOSyA9IGAuJHtDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTktfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9QSUNLRVIgPSBgLiR7Q0FMRU5EQVJfREFURV9QSUNLRVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfUElDS0VSID0gYC4ke0NBTEVOREFSX01PTlRIX1BJQ0tFUl9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX1BJQ0tFUiA9IGAuJHtDQUxFTkRBUl9ZRUFSX1BJQ0tFUl9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9GT0NVU0VEID0gYC4ke0NBTEVOREFSX01PTlRIX0ZPQ1VTRURfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9GT0NVU0VEID0gYC4ke0NBTEVOREFSX1lFQVJfRk9DVVNFRF9DTEFTU31gO1xyXG5cclxubGV0IHRleHQgPSB7XHJcbiAgXCJvcGVuX2NhbGVuZGFyXCI6IFwiw4VibiBrYWxlbmRlclwiLFxyXG4gIFwiY2hvb3NlX2FfZGF0ZVwiOiBcIlbDpmxnIGVuIGRhdG9cIixcclxuICBcImNob29zZV9hX2RhdGVfYmV0d2VlblwiOiBcIlbDpmxnIGVuIGRhdG8gbWVsbGVtIHttaW5EYXl9LiB7bWluTW9udGhTdHJ9IHttaW5ZZWFyfSBvZyB7bWF4RGF5fS4ge21heE1vbnRoU3RyfSB7bWF4WWVhcn1cIixcclxuICBcImNob29zZV9hX2RhdGVfYmVmb3JlXCI6IFwiVsOmbGcgZW4gZGF0by4gRGVyIGthbiB2w6ZsZ2VzIGluZHRpbCB7bWF4RGF5fS4ge21heE1vbnRoU3RyfSB7bWF4WWVhcn0uXCIsXHJcbiAgXCJjaG9vc2VfYV9kYXRlX2FmdGVyXCI6IFwiVsOmbGcgZW4gZGF0by4gRGVyIGthbiB2w6ZsZ2VzIGZyYSB7bWluRGF5fS4ge21pbk1vbnRoU3RyfSB7bWluWWVhcn0gb2cgZnJlbWFkLlwiLFxyXG4gIFwiYXJpYV9sYWJlbF9kYXRlXCI6IFwie2RheVN0cn0gZGVuIHtkYXl9LiB7bW9udGhTdHJ9IHt5ZWFyfVwiLFxyXG4gIFwiY3VycmVudF9tb250aF9kaXNwbGF5ZWRcIjogXCJWaXNlciB7bW9udGhMYWJlbH0ge2ZvY3VzZWRZZWFyfVwiLFxyXG4gIFwiZmlyc3RfcG9zc2libGVfZGF0ZVwiOiBcIkbDuHJzdGUgdmFsZ2JhcmUgZGF0b1wiLFxyXG4gIFwibGFzdF9wb3NzaWJsZV9kYXRlXCI6IFwiU2lkc3RlIHZhbGdiYXJlIGRhdG9cIixcclxuICBcInByZXZpb3VzX3llYXJcIjogXCJOYXZpZ8OpciDDqXQgw6VyIHRpbGJhZ2VcIixcclxuICBcInByZXZpb3VzX21vbnRoXCI6IFwiTmF2aWfDqXIgw6luIG3DpW5lZCB0aWxiYWdlXCIsXHJcbiAgXCJuZXh0X21vbnRoXCI6IFwiTmF2aWfDqXIgw6luIG3DpW5lZCBmcmVtXCIsXHJcbiAgXCJuZXh0X3llYXJcIjogXCJOYXZpZ8OpciDDqXQgw6VyIGZyZW1cIixcclxuICBcInNlbGVjdF9tb250aFwiOiBcIlbDpmxnIG3DpW5lZFwiLFxyXG4gIFwic2VsZWN0X3llYXJcIjogXCJWw6ZsZyDDpXJcIixcclxuICBcInByZXZpb3VzX3llYXJzXCI6IFwiTmF2aWfDqXIge3llYXJzfSDDpXIgdGlsYmFnZVwiLFxyXG4gIFwibmV4dF95ZWFyc1wiOiBcIk5hdmlnw6lyIHt5ZWFyc30gw6VyIGZyZW1cIixcclxuICBcImd1aWRlXCI6IFwiTmF2aWdlcmVyIGR1IG1lZCB0YXN0YXR1ciwga2FuIGR1IHNraWZ0ZSBkYWcgbWVkIGjDuGpyZSBvZyB2ZW5zdHJlIHBpbGV0YXN0ZXIsIHVnZXIgbWVkIG9wIG9nIG5lZCBwaWxldGFzdGVyLCBtw6VuZWRlciBtZWQgcGFnZSB1cCBvZyBwYWdlIGRvd24tdGFzdGVybmUgb2cgw6VyIG1lZCBzaGlmdC10YXN0ZW4gcGx1cyBwYWdlIHVwIGVsbGVyIHBhZ2UgZG93bi4gSG9tZSBvZyBlbmQtdGFzdGVuIG5hdmlnZXJlciB0aWwgc3RhcnQgZWxsZXIgc2x1dG5pbmcgYWYgZW4gdWdlLlwiLFxyXG4gIFwibW9udGhzX2Rpc3BsYXllZFwiOiBcIlbDpmxnIGVuIG3DpW5lZFwiLFxyXG4gIFwieWVhcnNfZGlzcGxheWVkXCI6IFwiVmlzZXIgw6VyIHtzdGFydH0gdGlsIHtlbmR9LiBWw6ZsZyBldCDDpXIuXCIsXHJcbiAgXCJqYW51YXJ5XCI6IFwiamFudWFyXCIsXHJcbiAgXCJmZWJydWFyeVwiOiBcImZlYnJ1YXJcIixcclxuICBcIm1hcmNoXCI6IFwibWFydHNcIixcclxuICBcImFwcmlsXCI6IFwiYXByaWxcIixcclxuICBcIm1heVwiOiBcIm1halwiLFxyXG4gIFwianVuZVwiOiBcImp1bmlcIixcclxuICBcImp1bHlcIjogXCJqdWxpXCIsXHJcbiAgXCJhdWd1c3RcIjogXCJhdWd1c3RcIixcclxuICBcInNlcHRlbWJlclwiOiBcInNlcHRlbWJlclwiLFxyXG4gIFwib2N0b2JlclwiOiBcIm9rdG9iZXJcIixcclxuICBcIm5vdmVtYmVyXCI6IFwibm92ZW1iZXJcIixcclxuICBcImRlY2VtYmVyXCI6IFwiZGVjZW1iZXJcIixcclxuICBcIm1vbmRheVwiOiBcIm1hbmRhZ1wiLFxyXG4gIFwidHVlc2RheVwiOiBcInRpcnNkYWdcIixcclxuICBcIndlZG5lc2RheVwiOiBcIm9uc2RhZ1wiLFxyXG4gIFwidGh1cnNkYXlcIjogXCJ0b3JzZGFnXCIsXHJcbiAgXCJmcmlkYXlcIjogXCJmcmVkYWdcIixcclxuICBcInNhdHVyZGF5XCI6IFwibMO4cmRhZ1wiLFxyXG4gIFwic3VuZGF5XCI6IFwic8O4bmRhZ1wiXHJcbn1cclxuXHJcbmNvbnN0IFZBTElEQVRJT05fTUVTU0FHRSA9IFwiSW5kdGFzdCB2ZW5saWdzdCBlbiBneWxkaWcgZGF0b1wiO1xyXG5cclxubGV0IE1PTlRIX0xBQkVMUyA9IFtcclxuICB0ZXh0LmphbnVhcnksXHJcbiAgdGV4dC5mZWJydWFyeSxcclxuICB0ZXh0Lm1hcmNoLFxyXG4gIHRleHQuYXByaWwsXHJcbiAgdGV4dC5tYXksXHJcbiAgdGV4dC5qdW5lLFxyXG4gIHRleHQuanVseSxcclxuICB0ZXh0LmF1Z3VzdCxcclxuICB0ZXh0LnNlcHRlbWJlcixcclxuICB0ZXh0Lm9jdG9iZXIsXHJcbiAgdGV4dC5ub3ZlbWJlcixcclxuICB0ZXh0LmRlY2VtYmVyXHJcbl07XHJcblxyXG5sZXQgREFZX09GX1dFRUtfTEFCRUxTID0gW1xyXG4gIHRleHQubW9uZGF5LFxyXG4gIHRleHQudHVlc2RheSxcclxuICB0ZXh0LndlZG5lc2RheSxcclxuICB0ZXh0LnRodXJzZGF5LFxyXG4gIHRleHQuZnJpZGF5LFxyXG4gIHRleHQuc2F0dXJkYXksXHJcbiAgdGV4dC5zdW5kYXlcclxuXTtcclxuXHJcbmNvbnN0IEVOVEVSX0tFWUNPREUgPSAxMztcclxuXHJcbmNvbnN0IFlFQVJfQ0hVTksgPSAxMjtcclxuXHJcbmNvbnN0IERFRkFVTFRfTUlOX0RBVEUgPSBcIjAwMDAtMDEtMDFcIjtcclxuY29uc3QgREFURV9GT1JNQVRfT1BUSU9OXzEgPSBcIkREL01NL1lZWVlcIjtcclxuY29uc3QgREFURV9GT1JNQVRfT1BUSU9OXzIgPSBcIkRELU1NLVlZWVlcIjtcclxuY29uc3QgREFURV9GT1JNQVRfT1BUSU9OXzMgPSBcIkRELk1NLllZWVlcIjtcclxuY29uc3QgREFURV9GT1JNQVRfT1BUSU9OXzQgPSBcIkREIE1NIFlZWVlcIjtcclxuY29uc3QgREFURV9GT1JNQVRfT1BUSU9OXzUgPSBcIkREL01NLVlZWVlcIjtcclxuY29uc3QgSU5URVJOQUxfREFURV9GT1JNQVQgPSBcIllZWVktTU0tRERcIjtcclxuXHJcbmNvbnN0IE5PVF9ESVNBQkxFRF9TRUxFQ1RPUiA9IFwiOm5vdChbZGlzYWJsZWRdKVwiO1xyXG5cclxuY29uc3QgcHJvY2Vzc0ZvY3VzYWJsZVNlbGVjdG9ycyA9ICguLi5zZWxlY3RvcnMpID0+XHJcbiAgc2VsZWN0b3JzLm1hcCgocXVlcnkpID0+IHF1ZXJ5ICsgTk9UX0RJU0FCTEVEX1NFTEVDVE9SKS5qb2luKFwiLCBcIik7XHJcblxyXG5jb25zdCBEQVRFX1BJQ0tFUl9GT0NVU0FCTEUgPSBwcm9jZXNzRm9jdXNhYmxlU2VsZWN0b3JzKFxyXG4gIENBTEVOREFSX1BSRVZJT1VTX1lFQVIsXHJcbiAgQ0FMRU5EQVJfUFJFVklPVVNfTU9OVEgsXHJcbiAgQ0FMRU5EQVJfWUVBUl9TRUxFQ1RJT04sXHJcbiAgQ0FMRU5EQVJfTU9OVEhfU0VMRUNUSU9OLFxyXG4gIENBTEVOREFSX05FWFRfWUVBUixcclxuICBDQUxFTkRBUl9ORVhUX01PTlRILFxyXG4gIENBTEVOREFSX0RBVEVfRk9DVVNFRFxyXG4pO1xyXG5cclxuY29uc3QgTU9OVEhfUElDS0VSX0ZPQ1VTQUJMRSA9IHByb2Nlc3NGb2N1c2FibGVTZWxlY3RvcnMoXHJcbiAgQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRFxyXG4pO1xyXG5cclxuY29uc3QgWUVBUl9QSUNLRVJfRk9DVVNBQkxFID0gcHJvY2Vzc0ZvY3VzYWJsZVNlbGVjdG9ycyhcclxuICBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LLFxyXG4gIENBTEVOREFSX05FWFRfWUVBUl9DSFVOSyxcclxuICBDQUxFTkRBUl9ZRUFSX0ZPQ1VTRURcclxuKTtcclxuXHJcbi8vICNyZWdpb24gRGF0ZSBNYW5pcHVsYXRpb24gRnVuY3Rpb25zXHJcblxyXG4vKipcclxuICogS2VlcCBkYXRlIHdpdGhpbiBtb250aC4gTW9udGggd291bGQgb25seSBiZSBvdmVyIGJ5IDEgdG8gMyBkYXlzXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZVRvQ2hlY2sgdGhlIGRhdGUgb2JqZWN0IHRvIGNoZWNrXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCB0aGUgY29ycmVjdCBtb250aFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGRhdGUsIGNvcnJlY3RlZCBpZiBuZWVkZWRcclxuICovXHJcbmNvbnN0IGtlZXBEYXRlV2l0aGluTW9udGggPSAoZGF0ZVRvQ2hlY2ssIG1vbnRoKSA9PiB7XHJcbiAgaWYgKG1vbnRoICE9PSBkYXRlVG9DaGVjay5nZXRNb250aCgpKSB7XHJcbiAgICBkYXRlVG9DaGVjay5zZXREYXRlKDApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRhdGVUb0NoZWNrO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCBkYXRlIGZyb20gbW9udGggZGF5IHllYXJcclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IHllYXIgdGhlIHllYXIgdG8gc2V0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCB0aGUgbW9udGggdG8gc2V0ICh6ZXJvLWluZGV4ZWQpXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlIHRoZSBkYXRlIHRvIHNldFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIHNldCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzZXREYXRlID0gKHllYXIsIG1vbnRoLCBkYXRlKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKDApO1xyXG4gIG5ld0RhdGUuc2V0RnVsbFllYXIoeWVhciwgbW9udGgsIGRhdGUpO1xyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIHRvZGF5cyBkYXRlXHJcbiAqXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0b2RheXMgZGF0ZVxyXG4gKi9cclxuY29uc3QgdG9kYXkgPSAoKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgY29uc3QgZGF5ID0gbmV3RGF0ZS5nZXREYXRlKCk7XHJcbiAgY29uc3QgbW9udGggPSBuZXdEYXRlLmdldE1vbnRoKCk7XHJcbiAgY29uc3QgeWVhciA9IG5ld0RhdGUuZ2V0RnVsbFllYXIoKTtcclxuICByZXR1cm4gc2V0RGF0ZSh5ZWFyLCBtb250aCwgZGF5KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZGF0ZSB0byBmaXJzdCBkYXkgb2YgdGhlIG1vbnRoXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHN0YXJ0T2ZNb250aCA9IChkYXRlKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKDApO1xyXG4gIG5ld0RhdGUuc2V0RnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCksIDEpO1xyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCBkYXRlIHRvIGxhc3QgZGF5IG9mIHRoZSBtb250aFxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBsYXN0RGF5T2ZNb250aCA9IChkYXRlKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKDApO1xyXG4gIG5ld0RhdGUuc2V0RnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCkgKyAxLCAwKTtcclxuICByZXR1cm4gbmV3RGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgZGF5cyB0byBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1EYXlzIHRoZSBkaWZmZXJlbmNlIGluIGRheXNcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBhZGREYXlzID0gKF9kYXRlLCBudW1EYXlzKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKF9kYXRlLmdldFRpbWUoKSk7XHJcbiAgbmV3RGF0ZS5zZXREYXRlKG5ld0RhdGUuZ2V0RGF0ZSgpICsgbnVtRGF5cyk7XHJcbiAgcmV0dXJuIG5ld0RhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogU3VidHJhY3QgZGF5cyBmcm9tIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bURheXMgdGhlIGRpZmZlcmVuY2UgaW4gZGF5c1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHN1YkRheXMgPSAoX2RhdGUsIG51bURheXMpID0+IGFkZERheXMoX2RhdGUsIC1udW1EYXlzKTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgd2Vla3MgdG8gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtV2Vla3MgdGhlIGRpZmZlcmVuY2UgaW4gd2Vla3NcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBhZGRXZWVrcyA9IChfZGF0ZSwgbnVtV2Vla3MpID0+IGFkZERheXMoX2RhdGUsIG51bVdlZWtzICogNyk7XHJcblxyXG4vKipcclxuICogU3VidHJhY3Qgd2Vla3MgZnJvbSBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1XZWVrcyB0aGUgZGlmZmVyZW5jZSBpbiB3ZWVrc1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHN1YldlZWtzID0gKF9kYXRlLCBudW1XZWVrcykgPT4gYWRkV2Vla3MoX2RhdGUsIC1udW1XZWVrcyk7XHJcblxyXG4vKipcclxuICogU2V0IGRhdGUgdG8gdGhlIHN0YXJ0IG9mIHRoZSB3ZWVrIChNb25kYXkpXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc3RhcnRPZldlZWsgPSAoX2RhdGUpID0+IHtcclxuICBsZXQgZGF5T2ZXZWVrID0gX2RhdGUuZ2V0RGF5KCktMTtcclxuICBpZihkYXlPZldlZWsgPT09IC0xKXtcclxuICAgIGRheU9mV2VlayA9IDY7XHJcbiAgfVxyXG4gIHJldHVybiBzdWJEYXlzKF9kYXRlLCBkYXlPZldlZWspO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCBkYXRlIHRvIHRoZSBlbmQgb2YgdGhlIHdlZWsgKFN1bmRheSlcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bVdlZWtzIHRoZSBkaWZmZXJlbmNlIGluIHdlZWtzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgZW5kT2ZXZWVrID0gKF9kYXRlKSA9PiB7XHJcbiAgY29uc3QgZGF5T2ZXZWVrID0gX2RhdGUuZ2V0RGF5KCk7XHJcbiAgcmV0dXJuIGFkZERheXMoX2RhdGUsIDcgLSBkYXlPZldlZWspO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZCBtb250aHMgdG8gZGF0ZSBhbmQga2VlcCBkYXRlIHdpdGhpbiBtb250aFxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtTW9udGhzIHRoZSBkaWZmZXJlbmNlIGluIG1vbnRoc1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IGFkZE1vbnRocyA9IChfZGF0ZSwgbnVtTW9udGhzKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKF9kYXRlLmdldFRpbWUoKSk7XHJcblxyXG4gIGNvbnN0IGRhdGVNb250aCA9IChuZXdEYXRlLmdldE1vbnRoKCkgKyAxMiArIG51bU1vbnRocykgJSAxMjtcclxuICBuZXdEYXRlLnNldE1vbnRoKG5ld0RhdGUuZ2V0TW9udGgoKSArIG51bU1vbnRocyk7XHJcbiAga2VlcERhdGVXaXRoaW5Nb250aChuZXdEYXRlLCBkYXRlTW9udGgpO1xyXG5cclxuICByZXR1cm4gbmV3RGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTdWJ0cmFjdCBtb250aHMgZnJvbSBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1Nb250aHMgdGhlIGRpZmZlcmVuY2UgaW4gbW9udGhzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc3ViTW9udGhzID0gKF9kYXRlLCBudW1Nb250aHMpID0+IGFkZE1vbnRocyhfZGF0ZSwgLW51bU1vbnRocyk7XHJcblxyXG4vKipcclxuICogQWRkIHllYXJzIHRvIGRhdGUgYW5kIGtlZXAgZGF0ZSB3aXRoaW4gbW9udGhcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bVllYXJzIHRoZSBkaWZmZXJlbmNlIGluIHllYXJzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgYWRkWWVhcnMgPSAoX2RhdGUsIG51bVllYXJzKSA9PiBhZGRNb250aHMoX2RhdGUsIG51bVllYXJzICogMTIpO1xyXG5cclxuLyoqXHJcbiAqIFN1YnRyYWN0IHllYXJzIGZyb20gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtWWVhcnMgdGhlIGRpZmZlcmVuY2UgaW4geWVhcnNcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzdWJZZWFycyA9IChfZGF0ZSwgbnVtWWVhcnMpID0+IGFkZFllYXJzKF9kYXRlLCAtbnVtWWVhcnMpO1xyXG5cclxuLyoqXHJcbiAqIFNldCBtb250aHMgb2YgZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbW9udGggemVyby1pbmRleGVkIG1vbnRoIHRvIHNldFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHNldE1vbnRoID0gKF9kYXRlLCBtb250aCkgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZShfZGF0ZS5nZXRUaW1lKCkpO1xyXG5cclxuICBuZXdEYXRlLnNldE1vbnRoKG1vbnRoKTtcclxuICBrZWVwRGF0ZVdpdGhpbk1vbnRoKG5ld0RhdGUsIG1vbnRoKTtcclxuXHJcbiAgcmV0dXJuIG5ld0RhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IHllYXIgb2YgZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0geWVhciB0aGUgeWVhciB0byBzZXRcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzZXRZZWFyID0gKF9kYXRlLCB5ZWFyKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKF9kYXRlLmdldFRpbWUoKSk7XHJcblxyXG4gIGNvbnN0IG1vbnRoID0gbmV3RGF0ZS5nZXRNb250aCgpO1xyXG4gIG5ld0RhdGUuc2V0RnVsbFllYXIoeWVhcik7XHJcbiAga2VlcERhdGVXaXRoaW5Nb250aChuZXdEYXRlLCBtb250aCk7XHJcblxyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybiB0aGUgZWFybGllc3QgZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVBIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVCIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGVhcmxpZXN0IGRhdGVcclxuICovXHJcbmNvbnN0IG1pbiA9IChkYXRlQSwgZGF0ZUIpID0+IHtcclxuICBsZXQgbmV3RGF0ZSA9IGRhdGVBO1xyXG5cclxuICBpZiAoZGF0ZUIgPCBkYXRlQSkge1xyXG4gICAgbmV3RGF0ZSA9IGRhdGVCO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG5ldyBEYXRlKG5ld0RhdGUuZ2V0VGltZSgpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gdGhlIGxhdGVzdCBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUEgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUIgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgbGF0ZXN0IGRhdGVcclxuICovXHJcbmNvbnN0IG1heCA9IChkYXRlQSwgZGF0ZUIpID0+IHtcclxuICBsZXQgbmV3RGF0ZSA9IGRhdGVBO1xyXG5cclxuICBpZiAoZGF0ZUIgPiBkYXRlQSkge1xyXG4gICAgbmV3RGF0ZSA9IGRhdGVCO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG5ldyBEYXRlKG5ld0RhdGUuZ2V0VGltZSgpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyBhcmUgdGhlIGluIHRoZSBzYW1lIHllYXJcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSBkYXRlIHRvIGNvbXBhcmVcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQiBkYXRlIHRvIGNvbXBhcmVcclxuICogQHJldHVybnMge2Jvb2xlYW59IGFyZSBkYXRlcyBpbiB0aGUgc2FtZSB5ZWFyXHJcbiAqL1xyXG5jb25zdCBpc1NhbWVZZWFyID0gKGRhdGVBLCBkYXRlQikgPT4ge1xyXG4gIHJldHVybiBkYXRlQSAmJiBkYXRlQiAmJiBkYXRlQS5nZXRGdWxsWWVhcigpID09PSBkYXRlQi5nZXRGdWxsWWVhcigpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGRhdGVzIGFyZSB0aGUgaW4gdGhlIHNhbWUgbW9udGhcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSBkYXRlIHRvIGNvbXBhcmVcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQiBkYXRlIHRvIGNvbXBhcmVcclxuICogQHJldHVybnMge2Jvb2xlYW59IGFyZSBkYXRlcyBpbiB0aGUgc2FtZSBtb250aFxyXG4gKi9cclxuY29uc3QgaXNTYW1lTW9udGggPSAoZGF0ZUEsIGRhdGVCKSA9PiB7XHJcbiAgcmV0dXJuIGlzU2FtZVllYXIoZGF0ZUEsIGRhdGVCKSAmJiBkYXRlQS5nZXRNb250aCgpID09PSBkYXRlQi5nZXRNb250aCgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGRhdGVzIGFyZSB0aGUgc2FtZSBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUEgdGhlIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVCIHRoZSBkYXRlIHRvIGNvbXBhcmVcclxuICogQHJldHVybnMge2Jvb2xlYW59IGFyZSBkYXRlcyB0aGUgc2FtZSBkYXRlXHJcbiAqL1xyXG5jb25zdCBpc1NhbWVEYXkgPSAoZGF0ZUEsIGRhdGVCKSA9PiB7XHJcbiAgcmV0dXJuIGlzU2FtZU1vbnRoKGRhdGVBLCBkYXRlQikgJiYgZGF0ZUEuZ2V0RGF0ZSgpID09PSBkYXRlQi5nZXREYXRlKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogcmV0dXJuIGEgbmV3IGRhdGUgd2l0aGluIG1pbmltdW0gYW5kIG1heGltdW0gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgZGF0ZSB0byBjaGVja1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1pbkRhdGUgbWluaW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWF4RGF0ZSBtYXhpbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBkYXRlIGJldHdlZW4gbWluIGFuZCBtYXhcclxuICovXHJcbmNvbnN0IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heCA9IChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKSA9PiB7XHJcbiAgbGV0IG5ld0RhdGUgPSBkYXRlO1xyXG5cclxuICBpZiAoZGF0ZSA8IG1pbkRhdGUpIHtcclxuICAgIG5ld0RhdGUgPSBtaW5EYXRlO1xyXG4gIH0gZWxzZSBpZiAobWF4RGF0ZSAmJiBkYXRlID4gbWF4RGF0ZSkge1xyXG4gICAgbmV3RGF0ZSA9IG1heERhdGU7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbmV3IERhdGUobmV3RGF0ZS5nZXRUaW1lKCkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGRhdGVzIGlzIHZhbGlkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgZGF0ZSB0byBjaGVja1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1pbkRhdGUgbWluaW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWF4RGF0ZSBtYXhpbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHJldHVybiB7Ym9vbGVhbn0gaXMgdGhlcmUgYSBkYXkgd2l0aGluIHRoZSBtb250aCB3aXRoaW4gbWluIGFuZCBtYXggZGF0ZXNcclxuICovXHJcbmNvbnN0IGlzRGF0ZVdpdGhpbk1pbkFuZE1heCA9IChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKSA9PlxyXG4gIGRhdGUgPj0gbWluRGF0ZSAmJiAoIW1heERhdGUgfHwgZGF0ZSA8PSBtYXhEYXRlKTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyBtb250aCBpcyBpbnZhbGlkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgZGF0ZSB0byBjaGVja1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1pbkRhdGUgbWluaW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWF4RGF0ZSBtYXhpbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHJldHVybiB7Ym9vbGVhbn0gaXMgdGhlIG1vbnRoIG91dHNpZGUgbWluIG9yIG1heCBkYXRlc1xyXG4gKi9cclxuY29uc3QgaXNEYXRlc01vbnRoT3V0c2lkZU1pbk9yTWF4ID0gKGRhdGUsIG1pbkRhdGUsIG1heERhdGUpID0+IHtcclxuICByZXR1cm4gKFxyXG4gICAgbGFzdERheU9mTW9udGgoZGF0ZSkgPCBtaW5EYXRlIHx8IChtYXhEYXRlICYmIHN0YXJ0T2ZNb250aChkYXRlKSA+IG1heERhdGUpXHJcbiAgKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyB5ZWFyIGlzIGludmFsaWQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSBkYXRlIHRvIGNoZWNrXHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWluRGF0ZSBtaW5pbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHBhcmFtIHtEYXRlfSBtYXhEYXRlIG1heGltdW0gZGF0ZSB0byBhbGxvd1xyXG4gKiBAcmV0dXJuIHtib29sZWFufSBpcyB0aGUgbW9udGggb3V0c2lkZSBtaW4gb3IgbWF4IGRhdGVzXHJcbiAqL1xyXG5jb25zdCBpc0RhdGVzWWVhck91dHNpZGVNaW5Pck1heCA9IChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKSA9PiB7XHJcbiAgcmV0dXJuIChcclxuICAgIGxhc3REYXlPZk1vbnRoKHNldE1vbnRoKGRhdGUsIDExKSkgPCBtaW5EYXRlIHx8XHJcbiAgICAobWF4RGF0ZSAmJiBzdGFydE9mTW9udGgoc2V0TW9udGgoZGF0ZSwgMCkpID4gbWF4RGF0ZSlcclxuICApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFBhcnNlIGEgZGF0ZSB3aXRoIGZvcm1hdCBELU0tWVlcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGVTdHJpbmcgdGhlIGRhdGUgc3RyaW5nIHRvIHBhcnNlXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlRm9ybWF0IHRoZSBmb3JtYXQgb2YgdGhlIGRhdGUgc3RyaW5nXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYWRqdXN0RGF0ZSBzaG91bGQgdGhlIGRhdGUgYmUgYWRqdXN0ZWRcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBwYXJzZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgcGFyc2VEYXRlU3RyaW5nID0gKFxyXG4gIGRhdGVTdHJpbmcsXHJcbiAgZGF0ZUZvcm1hdCA9IElOVEVSTkFMX0RBVEVfRk9STUFULFxyXG4gIGFkanVzdERhdGUgPSBmYWxzZVxyXG4pID0+IHtcclxuICBsZXQgZGF0ZTtcclxuICBsZXQgbW9udGg7XHJcbiAgbGV0IGRheTtcclxuICBsZXQgeWVhcjtcclxuICBsZXQgcGFyc2VkO1xyXG5cclxuICBpZiAoZGF0ZVN0cmluZykge1xyXG4gICAgbGV0IG1vbnRoU3RyLCBkYXlTdHIsIHllYXJTdHI7XHJcbiAgICBpZiAoZGF0ZUZvcm1hdCA9PT0gREFURV9GT1JNQVRfT1BUSU9OXzEgfHwgZGF0ZUZvcm1hdCA9PT0gREFURV9GT1JNQVRfT1BUSU9OXzIgfHwgZGF0ZUZvcm1hdCA9PT0gREFURV9GT1JNQVRfT1BUSU9OXzMgfHwgZGF0ZUZvcm1hdCA9PT0gREFURV9GT1JNQVRfT1BUSU9OXzQgfHwgZGF0ZUZvcm1hdCA9PT0gREFURV9GT1JNQVRfT1BUSU9OXzUpIHtcclxuICAgICAgW2RheVN0ciwgbW9udGhTdHIsIHllYXJTdHJdID0gZGF0ZVN0cmluZy5zcGxpdCgvLXxcXC58XFwvfFxccy8pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgW3llYXJTdHIsIG1vbnRoU3RyLCBkYXlTdHJdID0gZGF0ZVN0cmluZy5zcGxpdChcIi1cIik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHllYXJTdHIpIHtcclxuICAgICAgcGFyc2VkID0gcGFyc2VJbnQoeWVhclN0ciwgMTApO1xyXG4gICAgICBpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB7XHJcbiAgICAgICAgeWVhciA9IHBhcnNlZDtcclxuICAgICAgICBpZiAoYWRqdXN0RGF0ZSkge1xyXG4gICAgICAgICAgeWVhciA9IE1hdGgubWF4KDAsIHllYXIpO1xyXG4gICAgICAgICAgaWYgKHllYXJTdHIubGVuZ3RoIDwgMykge1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50WWVhciA9IHRvZGF5KCkuZ2V0RnVsbFllYXIoKTtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudFllYXJTdHViID1cclxuICAgICAgICAgICAgICBjdXJyZW50WWVhciAtIChjdXJyZW50WWVhciAlIDEwICoqIHllYXJTdHIubGVuZ3RoKTtcclxuICAgICAgICAgICAgeWVhciA9IGN1cnJlbnRZZWFyU3R1YiArIHBhcnNlZDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobW9udGhTdHIpIHtcclxuICAgICAgcGFyc2VkID0gcGFyc2VJbnQobW9udGhTdHIsIDEwKTtcclxuICAgICAgaWYgKCFOdW1iZXIuaXNOYU4ocGFyc2VkKSkge1xyXG4gICAgICAgIG1vbnRoID0gcGFyc2VkO1xyXG4gICAgICAgIGlmIChhZGp1c3REYXRlKSB7XHJcbiAgICAgICAgICBtb250aCA9IE1hdGgubWF4KDEsIG1vbnRoKTtcclxuICAgICAgICAgIG1vbnRoID0gTWF0aC5taW4oMTIsIG1vbnRoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobW9udGggJiYgZGF5U3RyICYmIHllYXIgIT0gbnVsbCkge1xyXG4gICAgICBwYXJzZWQgPSBwYXJzZUludChkYXlTdHIsIDEwKTtcclxuICAgICAgaWYgKCFOdW1iZXIuaXNOYU4ocGFyc2VkKSkge1xyXG4gICAgICAgIGRheSA9IHBhcnNlZDtcclxuICAgICAgICBpZiAoYWRqdXN0RGF0ZSkge1xyXG4gICAgICAgICAgY29uc3QgbGFzdERheU9mVGhlTW9udGggPSBzZXREYXRlKHllYXIsIG1vbnRoLCAwKS5nZXREYXRlKCk7XHJcbiAgICAgICAgICBkYXkgPSBNYXRoLm1heCgxLCBkYXkpO1xyXG4gICAgICAgICAgZGF5ID0gTWF0aC5taW4obGFzdERheU9mVGhlTW9udGgsIGRheSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1vbnRoICYmIGRheSAmJiB5ZWFyICE9IG51bGwpIHtcclxuICAgICAgZGF0ZSA9IHNldERhdGUoeWVhciwgbW9udGggLSAxLCBkYXkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogRm9ybWF0IGEgZGF0ZSB0byBmb3JtYXQgREQtTU0tWVlZWVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgdGhlIGRhdGUgdG8gZm9ybWF0XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlRm9ybWF0IHRoZSBmb3JtYXQgb2YgdGhlIGRhdGUgc3RyaW5nXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBmb3JtYXR0ZWQgZGF0ZSBzdHJpbmdcclxuICovXHJcbmNvbnN0IGZvcm1hdERhdGUgPSAoZGF0ZSwgZGF0ZUZvcm1hdCA9IElOVEVSTkFMX0RBVEVfRk9STUFUKSA9PiB7XHJcbiAgY29uc3QgcGFkWmVyb3MgPSAodmFsdWUsIGxlbmd0aCkgPT4ge1xyXG4gICAgcmV0dXJuIGAwMDAwJHt2YWx1ZX1gLnNsaWNlKC1sZW5ndGgpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IG1vbnRoID0gZGF0ZS5nZXRNb250aCgpICsgMTtcclxuICBjb25zdCBkYXkgPSBkYXRlLmdldERhdGUoKTtcclxuICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xyXG5cclxuICBpZiAoZGF0ZUZvcm1hdCA9PT0gREFURV9GT1JNQVRfT1BUSU9OXzEpIHtcclxuICAgIHJldHVybiBbcGFkWmVyb3MoZGF5LCAyKSwgcGFkWmVyb3MobW9udGgsIDIpLCBwYWRaZXJvcyh5ZWFyLCA0KV0uam9pbihcIi9cIik7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKGRhdGVGb3JtYXQgPT09IERBVEVfRk9STUFUX09QVElPTl8yKSB7XHJcbiAgICByZXR1cm4gW3BhZFplcm9zKGRheSwgMiksIHBhZFplcm9zKG1vbnRoLCAyKSwgcGFkWmVyb3MoeWVhciwgNCldLmpvaW4oXCItXCIpO1xyXG4gIH1cclxuICBlbHNlIGlmIChkYXRlRm9ybWF0ID09PSBEQVRFX0ZPUk1BVF9PUFRJT05fMykge1xyXG4gICAgcmV0dXJuIFtwYWRaZXJvcyhkYXksIDIpLCBwYWRaZXJvcyhtb250aCwgMiksIHBhZFplcm9zKHllYXIsIDQpXS5qb2luKFwiLlwiKTtcclxuICB9XHJcbiAgZWxzZSBpZiAoZGF0ZUZvcm1hdCA9PT0gREFURV9GT1JNQVRfT1BUSU9OXzQpIHtcclxuICAgIHJldHVybiBbcGFkWmVyb3MoZGF5LCAyKSwgcGFkWmVyb3MobW9udGgsIDIpLCBwYWRaZXJvcyh5ZWFyLCA0KV0uam9pbihcIiBcIik7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKGRhdGVGb3JtYXQgPT09IERBVEVfRk9STUFUX09QVElPTl81KSB7XHJcbiAgICBsZXQgdGVtcERheU1vbnRoID0gW3BhZFplcm9zKGRheSwgMiksIHBhZFplcm9zKG1vbnRoLCAyKV0uam9pbihcIi9cIik7XHJcbiAgICByZXR1cm4gW3RlbXBEYXlNb250aCwgcGFkWmVyb3MoeWVhciwgNCldLmpvaW4oXCItXCIpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIFtwYWRaZXJvcyh5ZWFyLCA0KSwgcGFkWmVyb3MobW9udGgsIDIpLCBwYWRaZXJvcyhkYXksIDIpXS5qb2luKFwiLVwiKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gRGF0ZSBNYW5pcHVsYXRpb24gRnVuY3Rpb25zXHJcblxyXG4vKipcclxuICogQ3JlYXRlIGEgZ3JpZCBzdHJpbmcgZnJvbSBhbiBhcnJheSBvZiBodG1sIHN0cmluZ3NcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmdbXX0gaHRtbEFycmF5IHRoZSBhcnJheSBvZiBodG1sIGl0ZW1zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSByb3dTaXplIHRoZSBsZW5ndGggb2YgYSByb3dcclxuICogQHJldHVybnMge3N0cmluZ30gdGhlIGdyaWQgc3RyaW5nXHJcbiAqL1xyXG5jb25zdCBsaXN0VG9HcmlkSHRtbCA9IChodG1sQXJyYXksIHJvd1NpemUpID0+IHtcclxuICBjb25zdCBncmlkID0gW107XHJcbiAgbGV0IHJvdyA9IFtdO1xyXG5cclxuICBsZXQgaSA9IDA7XHJcbiAgd2hpbGUgKGkgPCBodG1sQXJyYXkubGVuZ3RoKSB7XHJcbiAgICByb3cgPSBbXTtcclxuICAgIHdoaWxlIChpIDwgaHRtbEFycmF5Lmxlbmd0aCAmJiByb3cubGVuZ3RoIDwgcm93U2l6ZSkge1xyXG4gICAgICByb3cucHVzaChgPHRkPiR7aHRtbEFycmF5W2ldfTwvdGQ+YCk7XHJcbiAgICAgIGkgKz0gMTtcclxuICAgIH1cclxuICAgIGdyaWQucHVzaChgPHRyPiR7cm93LmpvaW4oXCJcIil9PC90cj5gKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBncmlkLmpvaW4oXCJcIik7XHJcbn07XHJcblxyXG4vKipcclxuICogc2V0IHRoZSB2YWx1ZSBvZiB0aGUgZWxlbWVudCBhbmQgZGlzcGF0Y2ggYSBjaGFuZ2UgZXZlbnRcclxuICpcclxuICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSBlbCBUaGUgZWxlbWVudCB0byB1cGRhdGVcclxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFRoZSBuZXcgdmFsdWUgb2YgdGhlIGVsZW1lbnRcclxuICovXHJcbmNvbnN0IGNoYW5nZUVsZW1lbnRWYWx1ZSA9IChlbCwgdmFsdWUgPSBcIlwiKSA9PiB7XHJcbiAgY29uc3QgZWxlbWVudFRvQ2hhbmdlID0gZWw7XHJcbiAgZWxlbWVudFRvQ2hhbmdlLnZhbHVlID0gdmFsdWU7XHJcblxyXG5cclxuICB2YXIgZXZlbnQgPSBuZXcgRXZlbnQoJ2NoYW5nZScpO1xyXG4gIGVsZW1lbnRUb0NoYW5nZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgcHJvcGVydGllcyBhbmQgZWxlbWVudHMgd2l0aGluIHRoZSBkYXRlIHBpY2tlci5cclxuICogQHR5cGVkZWYge09iamVjdH0gRGF0ZVBpY2tlckNvbnRleHRcclxuICogQHByb3BlcnR5IHtIVE1MRGl2RWxlbWVudH0gY2FsZW5kYXJFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBkYXRlUGlja2VyRWxcclxuICogQHByb3BlcnR5IHtIVE1MRGl2RWxlbWVudH0gZGlhbG9nRWxcclxuICogQHByb3BlcnR5IHtIVE1MSW5wdXRFbGVtZW50fSBpbnRlcm5hbElucHV0RWxcclxuICogQHByb3BlcnR5IHtIVE1MSW5wdXRFbGVtZW50fSBleHRlcm5hbElucHV0RWxcclxuICogQHByb3BlcnR5IHtIVE1MRGl2RWxlbWVudH0gc3RhdHVzRWxcclxuICogQHByb3BlcnR5IHtIVE1MRGl2RWxlbWVudH0gZ3VpZGVFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxEaXZFbGVtZW50fSBmaXJzdFllYXJDaHVua0VsXHJcbiAqIEBwcm9wZXJ0eSB7RGF0ZX0gY2FsZW5kYXJEYXRlXHJcbiAqIEBwcm9wZXJ0eSB7RGF0ZX0gbWluRGF0ZVxyXG4gKiBAcHJvcGVydHkge0RhdGV9IG1heERhdGVcclxuICogQHByb3BlcnR5IHtEYXRlfSBzZWxlY3RlZERhdGVcclxuICogQHByb3BlcnR5IHtEYXRlfSByYW5nZURhdGVcclxuICogQHByb3BlcnR5IHtEYXRlfSBkZWZhdWx0RGF0ZVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBHZXQgYW4gb2JqZWN0IG9mIHRoZSBwcm9wZXJ0aWVzIGFuZCBlbGVtZW50cyBiZWxvbmdpbmcgZGlyZWN0bHkgdG8gdGhlIGdpdmVuXHJcbiAqIGRhdGUgcGlja2VyIGNvbXBvbmVudC5cclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgdGhlIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlclxyXG4gKiBAcmV0dXJucyB7RGF0ZVBpY2tlckNvbnRleHR9IGVsZW1lbnRzXHJcbiAqL1xyXG5jb25zdCBnZXREYXRlUGlja2VyQ29udGV4dCA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IGRhdGVQaWNrZXJFbCA9IGVsLmNsb3Nlc3QoREFURV9QSUNLRVIpO1xyXG5cclxuICBpZiAoIWRhdGVQaWNrZXJFbCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBFbGVtZW50IGlzIG1pc3Npbmcgb3V0ZXIgJHtEQVRFX1BJQ0tFUn1gKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGludGVybmFsSW5wdXRFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgREFURV9QSUNLRVJfSU5URVJOQUxfSU5QVVRcclxuICApO1xyXG4gIGNvbnN0IGV4dGVybmFsSW5wdXRFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRcclxuICApO1xyXG4gIGNvbnN0IGNhbGVuZGFyRWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihEQVRFX1BJQ0tFUl9DQUxFTkRBUik7XHJcbiAgY29uc3QgdG9nZ2xlQnRuRWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihEQVRFX1BJQ0tFUl9CVVRUT04pO1xyXG4gIGNvbnN0IHN0YXR1c0VsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoREFURV9QSUNLRVJfU1RBVFVTKTtcclxuICBjb25zdCBndWlkZUVsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoREFURV9QSUNLRVJfR1VJREUpO1xyXG4gIGNvbnN0IGZpcnN0WWVhckNodW5rRWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSKTtcclxuICBjb25zdCBkaWFsb2dFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKERBVEVfUElDS0VSX0RJQUxPR19XUkFQUEVSKTtcclxuXHJcbiAgLy8gU2V0IGRhdGUgZm9ybWF0XHJcbiAgbGV0IHNlbGVjdGVkRGF0ZUZvcm1hdCA9IERBVEVfRk9STUFUX09QVElPTl8xO1xyXG4gIGlmIChkYXRlUGlja2VyRWwuaGFzQXR0cmlidXRlKFwiZGF0YS1kYXRlZm9ybWF0XCIpKSB7XHJcbiAgICBzd2l0Y2ggKGRhdGVQaWNrZXJFbC5kYXRhc2V0LmRhdGVmb3JtYXQpIHtcclxuICAgICAgY2FzZSBEQVRFX0ZPUk1BVF9PUFRJT05fMTpcclxuICAgICAgICBzZWxlY3RlZERhdGVGb3JtYXQgPSBEQVRFX0ZPUk1BVF9PUFRJT05fMTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBEQVRFX0ZPUk1BVF9PUFRJT05fMjpcclxuICAgICAgICBzZWxlY3RlZERhdGVGb3JtYXQgPSBEQVRFX0ZPUk1BVF9PUFRJT05fMjtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBEQVRFX0ZPUk1BVF9PUFRJT05fMzpcclxuICAgICAgICBzZWxlY3RlZERhdGVGb3JtYXQgPSBEQVRFX0ZPUk1BVF9PUFRJT05fMztcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBEQVRFX0ZPUk1BVF9PUFRJT05fNDpcclxuICAgICAgICBzZWxlY3RlZERhdGVGb3JtYXQgPSBEQVRFX0ZPUk1BVF9PUFRJT05fNDtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBEQVRFX0ZPUk1BVF9PUFRJT05fNTpcclxuICAgICAgICBzZWxlY3RlZERhdGVGb3JtYXQgPSBEQVRFX0ZPUk1BVF9PUFRJT05fNTtcclxuICAgIH1cclxuICB9XHJcbiAgY29uc3QgZGF0ZUZvcm1hdE9wdGlvbiA9IHNlbGVjdGVkRGF0ZUZvcm1hdDsgXHJcblxyXG4gIGNvbnN0IGlucHV0RGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhcclxuICAgIGV4dGVybmFsSW5wdXRFbC52YWx1ZSxcclxuICAgIGRhdGVGb3JtYXRPcHRpb24sXHJcbiAgICB0cnVlXHJcbiAgKTtcclxuICBjb25zdCBzZWxlY3RlZERhdGUgPSBwYXJzZURhdGVTdHJpbmcoaW50ZXJuYWxJbnB1dEVsLnZhbHVlKTtcclxuXHJcbiAgY29uc3QgY2FsZW5kYXJEYXRlID0gcGFyc2VEYXRlU3RyaW5nKGNhbGVuZGFyRWwuZGF0YXNldC52YWx1ZSk7XHJcbiAgY29uc3QgbWluRGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhkYXRlUGlja2VyRWwuZGF0YXNldC5taW5EYXRlKTtcclxuICBjb25zdCBtYXhEYXRlID0gcGFyc2VEYXRlU3RyaW5nKGRhdGVQaWNrZXJFbC5kYXRhc2V0Lm1heERhdGUpO1xyXG4gIGNvbnN0IHJhbmdlRGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhkYXRlUGlja2VyRWwuZGF0YXNldC5yYW5nZURhdGUpO1xyXG4gIGNvbnN0IGRlZmF1bHREYXRlID0gcGFyc2VEYXRlU3RyaW5nKGRhdGVQaWNrZXJFbC5kYXRhc2V0LmRlZmF1bHREYXRlKTtcclxuXHJcbiAgaWYgKG1pbkRhdGUgJiYgbWF4RGF0ZSAmJiBtaW5EYXRlID4gbWF4RGF0ZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTWluaW11bSBkYXRlIGNhbm5vdCBiZSBhZnRlciBtYXhpbXVtIGRhdGVcIik7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgY2FsZW5kYXJEYXRlLFxyXG4gICAgbWluRGF0ZSxcclxuICAgIHRvZ2dsZUJ0bkVsLFxyXG4gICAgZGlhbG9nRWwsXHJcbiAgICBzZWxlY3RlZERhdGUsXHJcbiAgICBtYXhEYXRlLFxyXG4gICAgZmlyc3RZZWFyQ2h1bmtFbCxcclxuICAgIGRhdGVQaWNrZXJFbCxcclxuICAgIGlucHV0RGF0ZSxcclxuICAgIGludGVybmFsSW5wdXRFbCxcclxuICAgIGV4dGVybmFsSW5wdXRFbCxcclxuICAgIGNhbGVuZGFyRWwsXHJcbiAgICByYW5nZURhdGUsXHJcbiAgICBkZWZhdWx0RGF0ZSxcclxuICAgIHN0YXR1c0VsLFxyXG4gICAgZ3VpZGVFbCxcclxuICAgIGRhdGVGb3JtYXRPcHRpb25cclxuICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIERpc2FibGUgdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNhYmxlID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBleHRlcm5hbElucHV0RWwsIHRvZ2dsZUJ0bkVsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gIHRvZ2dsZUJ0bkVsLmRpc2FibGVkID0gdHJ1ZTtcclxuICBleHRlcm5hbElucHV0RWwuZGlzYWJsZWQgPSB0cnVlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEVuYWJsZSB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGVuYWJsZSA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgZXh0ZXJuYWxJbnB1dEVsLCB0b2dnbGVCdG5FbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICB0b2dnbGVCdG5FbC5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIGV4dGVybmFsSW5wdXRFbC5kaXNhYmxlZCA9IGZhbHNlO1xyXG59O1xyXG5cclxuLy8gI3JlZ2lvbiBWYWxpZGF0aW9uXHJcblxyXG4vKipcclxuICogVmFsaWRhdGUgdGhlIHZhbHVlIGluIHRoZSBpbnB1dCBhcyBhIHZhbGlkIGRhdGUgb2YgZm9ybWF0IEQvTS9ZWVlZXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGlzRGF0ZUlucHV0SW52YWxpZCA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgZXh0ZXJuYWxJbnB1dEVsLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gIGNvbnN0IGRhdGVTdHJpbmcgPSBleHRlcm5hbElucHV0RWwudmFsdWU7XHJcbiAgbGV0IGlzSW52YWxpZCA9IGZhbHNlO1xyXG5cclxuICBpZiAoZGF0ZVN0cmluZykge1xyXG4gICAgaXNJbnZhbGlkID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdCBkYXRlU3RyaW5nUGFydHMgPSBkYXRlU3RyaW5nLnNwbGl0KC8tfFxcLnxcXC98XFxzLyk7XHJcbiAgICBjb25zdCBbZGF5LCBtb250aCwgeWVhcl0gPSBkYXRlU3RyaW5nUGFydHMubWFwKChzdHIpID0+IHtcclxuICAgICAgbGV0IHZhbHVlO1xyXG4gICAgICBjb25zdCBwYXJzZWQgPSBwYXJzZUludChzdHIsIDEwKTtcclxuICAgICAgaWYgKCFOdW1iZXIuaXNOYU4ocGFyc2VkKSkgdmFsdWUgPSBwYXJzZWQ7XHJcbiAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChtb250aCAmJiBkYXkgJiYgeWVhciAhPSBudWxsKSB7XHJcbiAgICAgIGNvbnN0IGNoZWNrRGF0ZSA9IHNldERhdGUoeWVhciwgbW9udGggLSAxLCBkYXkpO1xyXG5cclxuICAgICAgaWYgKFxyXG4gICAgICAgIGNoZWNrRGF0ZS5nZXRNb250aCgpID09PSBtb250aCAtIDEgJiZcclxuICAgICAgICBjaGVja0RhdGUuZ2V0RGF0ZSgpID09PSBkYXkgJiZcclxuICAgICAgICBjaGVja0RhdGUuZ2V0RnVsbFllYXIoKSA9PT0geWVhciAmJlxyXG4gICAgICAgIGRhdGVTdHJpbmdQYXJ0c1syXS5sZW5ndGggPT09IDQgJiZcclxuICAgICAgICBpc0RhdGVXaXRoaW5NaW5BbmRNYXgoY2hlY2tEYXRlLCBtaW5EYXRlLCBtYXhEYXRlKVxyXG4gICAgICApIHtcclxuICAgICAgICBpc0ludmFsaWQgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGlzSW52YWxpZDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBWYWxpZGF0ZSB0aGUgdmFsdWUgaW4gdGhlIGlucHV0IGFzIGEgdmFsaWQgZGF0ZSBvZiBmb3JtYXQgTS9EL1lZWVlcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgdmFsaWRhdGVEYXRlSW5wdXQgPSAoZWwpID0+IHtcclxuICBjb25zdCB7IGV4dGVybmFsSW5wdXRFbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG4gIGNvbnN0IGlzSW52YWxpZCA9IGlzRGF0ZUlucHV0SW52YWxpZChleHRlcm5hbElucHV0RWwpO1xyXG5cclxuICBpZiAoaXNJbnZhbGlkICYmICFleHRlcm5hbElucHV0RWwudmFsaWRhdGlvbk1lc3NhZ2UpIHtcclxuICAgIGV4dGVybmFsSW5wdXRFbC5zZXRDdXN0b21WYWxpZGl0eShWQUxJREFUSU9OX01FU1NBR0UpO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFpc0ludmFsaWQgJiYgZXh0ZXJuYWxJbnB1dEVsLnZhbGlkYXRpb25NZXNzYWdlID09PSBWQUxJREFUSU9OX01FU1NBR0UpIHtcclxuICAgIGV4dGVybmFsSW5wdXRFbC5zZXRDdXN0b21WYWxpZGl0eShcIlwiKTtcclxuICB9XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIFZhbGlkYXRpb25cclxuXHJcbi8qKlxyXG4gKiBFbmFibGUgdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCByZWNvbmNpbGVJbnB1dFZhbHVlcyA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgaW50ZXJuYWxJbnB1dEVsLCBpbnB1dERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuICBsZXQgbmV3VmFsdWUgPSBcIlwiO1xyXG5cclxuICBpZiAoaW5wdXREYXRlICYmICFpc0RhdGVJbnB1dEludmFsaWQoZWwpKSB7XHJcbiAgICBuZXdWYWx1ZSA9IGZvcm1hdERhdGUoaW5wdXREYXRlKTtcclxuICB9XHJcblxyXG4gIGlmIChpbnRlcm5hbElucHV0RWwudmFsdWUgIT09IG5ld1ZhbHVlKSB7XHJcbiAgICBjaGFuZ2VFbGVtZW50VmFsdWUoaW50ZXJuYWxJbnB1dEVsLCBuZXdWYWx1ZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNlbGVjdCB0aGUgdmFsdWUgb2YgdGhlIGRhdGUgcGlja2VyIGlucHV0cy5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0ZVN0cmluZyBUaGUgZGF0ZSBzdHJpbmcgdG8gdXBkYXRlIGluIFlZWVktTU0tREQgZm9ybWF0XHJcbiAqL1xyXG5jb25zdCBzZXRDYWxlbmRhclZhbHVlID0gKGVsLCBkYXRlU3RyaW5nKSA9PiB7XHJcbiAgY29uc3QgcGFyc2VkRGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhkYXRlU3RyaW5nKTtcclxuXHJcbiAgaWYgKHBhcnNlZERhdGUpIHtcclxuICAgIFxyXG4gICAgY29uc3Qge1xyXG4gICAgICBkYXRlUGlja2VyRWwsXHJcbiAgICAgIGludGVybmFsSW5wdXRFbCxcclxuICAgICAgZXh0ZXJuYWxJbnB1dEVsLFxyXG4gICAgICBkYXRlRm9ybWF0T3B0aW9uXHJcbiAgICB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICAgIGNvbnN0IGZvcm1hdHRlZERhdGUgPSBmb3JtYXREYXRlKHBhcnNlZERhdGUsIGRhdGVGb3JtYXRPcHRpb24pO1xyXG5cclxuICAgIGNoYW5nZUVsZW1lbnRWYWx1ZShpbnRlcm5hbElucHV0RWwsIGRhdGVTdHJpbmcpO1xyXG4gICAgY2hhbmdlRWxlbWVudFZhbHVlKGV4dGVybmFsSW5wdXRFbCwgZm9ybWF0dGVkRGF0ZSk7XHJcblxyXG4gICAgdmFsaWRhdGVEYXRlSW5wdXQoZGF0ZVBpY2tlckVsKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogRW5oYW5jZSBhbiBpbnB1dCB3aXRoIHRoZSBkYXRlIHBpY2tlciBlbGVtZW50c1xyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBUaGUgaW5pdGlhbCB3cmFwcGluZyBlbGVtZW50IG9mIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGVuaGFuY2VEYXRlUGlja2VyID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgZGF0ZVBpY2tlckVsID0gZWwuY2xvc2VzdChEQVRFX1BJQ0tFUik7XHJcbiAgY29uc3QgZGVmYXVsdFZhbHVlID0gZGF0ZVBpY2tlckVsLmRhdGFzZXQuZGVmYXVsdFZhbHVlO1xyXG5cclxuICBjb25zdCBpbnRlcm5hbElucHV0RWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihgaW5wdXRgKTtcclxuXHJcbiAgaWYgKCFpbnRlcm5hbElucHV0RWwpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgJHtEQVRFX1BJQ0tFUn0gaXMgbWlzc2luZyBpbm5lciBpbnB1dGApO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgbWluRGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhcclxuICAgIGRhdGVQaWNrZXJFbC5kYXRhc2V0Lm1pbkRhdGUgfHwgaW50ZXJuYWxJbnB1dEVsLmdldEF0dHJpYnV0ZShcIm1pblwiKVxyXG4gICk7XHJcbiAgZGF0ZVBpY2tlckVsLmRhdGFzZXQubWluRGF0ZSA9IG1pbkRhdGVcclxuICAgID8gZm9ybWF0RGF0ZShtaW5EYXRlKVxyXG4gICAgOiBERUZBVUxUX01JTl9EQVRFO1xyXG5cclxuICBjb25zdCBtYXhEYXRlID0gcGFyc2VEYXRlU3RyaW5nKFxyXG4gICAgZGF0ZVBpY2tlckVsLmRhdGFzZXQubWF4RGF0ZSB8fCBpbnRlcm5hbElucHV0RWwuZ2V0QXR0cmlidXRlKFwibWF4XCIpXHJcbiAgKTtcclxuICBpZiAobWF4RGF0ZSkge1xyXG4gICAgZGF0ZVBpY2tlckVsLmRhdGFzZXQubWF4RGF0ZSA9IGZvcm1hdERhdGUobWF4RGF0ZSk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBjYWxlbmRhcldyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gIGNhbGVuZGFyV3JhcHBlci5jbGFzc0xpc3QuYWRkKERBVEVfUElDS0VSX1dSQVBQRVJfQ0xBU1MpO1xyXG4gIGNhbGVuZGFyV3JhcHBlci50YWJJbmRleCA9IFwiLTFcIjtcclxuXHJcbiAgY29uc3QgZXh0ZXJuYWxJbnB1dEVsID0gaW50ZXJuYWxJbnB1dEVsLmNsb25lTm9kZSgpO1xyXG4gIGV4dGVybmFsSW5wdXRFbC5jbGFzc0xpc3QuYWRkKERBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUX0NMQVNTKTtcclxuICBleHRlcm5hbElucHV0RWwudHlwZSA9IFwidGV4dFwiO1xyXG4gIGV4dGVybmFsSW5wdXRFbC5uYW1lID0gXCJcIjtcclxuXHJcbiAgbGV0IGRpYWxvZ1RpdGxlID0gdGV4dC5jaG9vc2VfYV9kYXRlO1xyXG4gIGNvbnN0IGhhc01pbkRhdGUgPSBtaW5EYXRlICE9PSB1bmRlZmluZWQgJiYgbWluRGF0ZSAhPT0gXCJcIjtcclxuICBjb25zdCBpc0RlZmF1bHRNaW5EYXRlID0gIG1pbkRhdGUgIT09IHVuZGVmaW5lZCAmJiBtaW5EYXRlICE9PSBcIlwiICYmIHBhcnNlRGF0ZVN0cmluZyhERUZBVUxUX01JTl9EQVRFKS5nZXRUaW1lKCkgPT09IG1pbkRhdGUuZ2V0VGltZSgpO1xyXG4gIGNvbnN0IGhhc01heERhdGUgPSBtYXhEYXRlICE9PSB1bmRlZmluZWQgJiYgbWF4RGF0ZSAhPT0gXCJcIjtcclxuICBcclxuICBpZiAoaGFzTWluRGF0ZSAmJiAhaXNEZWZhdWx0TWluRGF0ZSAmJiBoYXNNYXhEYXRlKSB7XHJcbiAgICBjb25zdCBtaW5EYXkgPSBtaW5EYXRlLmdldERhdGUoKTtcclxuICAgIGNvbnN0IG1pbk1vbnRoID0gbWluRGF0ZS5nZXRNb250aCgpO1xyXG4gICAgY29uc3QgbWluTW9udGhTdHIgPSBNT05USF9MQUJFTFNbbWluTW9udGhdO1xyXG4gICAgY29uc3QgbWluWWVhciA9IG1pbkRhdGUuZ2V0RnVsbFllYXIoKTtcclxuICAgIGNvbnN0IG1heERheSA9IG1heERhdGUuZ2V0RGF0ZSgpO1xyXG4gICAgY29uc3QgbWF4TW9udGggPSBtYXhEYXRlLmdldE1vbnRoKCk7XHJcbiAgICBjb25zdCBtYXhNb250aFN0ciA9IE1PTlRIX0xBQkVMU1ttYXhNb250aF07XHJcbiAgICBjb25zdCBtYXhZZWFyID0gbWF4RGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gICAgZGlhbG9nVGl0bGUgPSB0ZXh0LmNob29zZV9hX2RhdGVfYmV0d2Vlbi5yZXBsYWNlKC97bWluRGF5fS8sIG1pbkRheSkucmVwbGFjZSgve21pbk1vbnRoU3RyfS8sIG1pbk1vbnRoU3RyKS5yZXBsYWNlKC97bWluWWVhcn0vLCBtaW5ZZWFyKS5yZXBsYWNlKC97bWF4RGF5fS8sIG1heERheSkucmVwbGFjZSgve21heE1vbnRoU3RyfS8sIG1heE1vbnRoU3RyKS5yZXBsYWNlKC97bWF4WWVhcn0vLCBtYXhZZWFyKTtcclxuICB9XHJcbiAgZWxzZSBpZiAoaGFzTWluRGF0ZSAmJiAhaXNEZWZhdWx0TWluRGF0ZSAmJiAhaGFzTWF4RGF0ZSkge1xyXG4gICAgY29uc3QgbWluRGF5ID0gbWluRGF0ZS5nZXREYXRlKCk7XHJcbiAgICBjb25zdCBtaW5Nb250aCA9IG1pbkRhdGUuZ2V0TW9udGgoKTtcclxuICAgIGNvbnN0IG1pbk1vbnRoU3RyID0gTU9OVEhfTEFCRUxTW21pbk1vbnRoXTtcclxuICAgIGNvbnN0IG1pblllYXIgPSBtaW5EYXRlLmdldEZ1bGxZZWFyKCk7XHJcbiAgICBkaWFsb2dUaXRsZSA9IHRleHQuY2hvb3NlX2FfZGF0ZV9hZnRlci5yZXBsYWNlKC97bWluRGF5fS8sIG1pbkRheSkucmVwbGFjZSgve21pbk1vbnRoU3RyfS8sIG1pbk1vbnRoU3RyKS5yZXBsYWNlKC97bWluWWVhcn0vLCBtaW5ZZWFyKTtcclxuICB9XHJcbiAgZWxzZSBpZiAoaGFzTWF4RGF0ZSkge1xyXG4gICAgY29uc3QgbWF4RGF5ID0gbWF4RGF0ZS5nZXREYXRlKCk7XHJcbiAgICBjb25zdCBtYXhNb250aCA9IG1heERhdGUuZ2V0TW9udGgoKTtcclxuICAgIGNvbnN0IG1heE1vbnRoU3RyID0gTU9OVEhfTEFCRUxTW21heE1vbnRoXTtcclxuICAgIGNvbnN0IG1heFllYXIgPSBtYXhEYXRlLmdldEZ1bGxZZWFyKCk7XHJcbiAgICBkaWFsb2dUaXRsZSA9IHRleHQuY2hvb3NlX2FfZGF0ZV9iZWZvcmUucmVwbGFjZSgve21heERheX0vLCBtYXhEYXkpLnJlcGxhY2UoL3ttYXhNb250aFN0cn0vLCBtYXhNb250aFN0cikucmVwbGFjZSgve21heFllYXJ9LywgbWF4WWVhcik7XHJcbiAgfVxyXG5cclxuICBjb25zdCBndWlkZUlEID0gZXh0ZXJuYWxJbnB1dEVsLmdldEF0dHJpYnV0ZShcImlkXCIpICsgXCItZ3VpZGVcIjtcclxuXHJcbiAgY2FsZW5kYXJXcmFwcGVyLmFwcGVuZENoaWxkKGV4dGVybmFsSW5wdXRFbCk7XHJcbiAgY2FsZW5kYXJXcmFwcGVyLmluc2VydEFkamFjZW50SFRNTChcclxuICAgIFwiYmVmb3JlZW5kXCIsXHJcbiAgICBbXHJcbiAgICAgIGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIiR7REFURV9QSUNLRVJfQlVUVE9OX0NMQVNTfVwiIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCIgYXJpYS1sYWJlbD1cIiR7dGV4dC5vcGVuX2NhbGVuZGFyfVwiPiZuYnNwOzwvYnV0dG9uPmAsXHJcbiAgICAgIGA8ZGl2IGNsYXNzPVwiJHtESUFMT0dfV1JBUFBFUl9DTEFTU31cIiByb2xlPVwiZGlhbG9nXCIgYXJpYS1tb2RhbD1cInRydWVcIiBhcmlhLWxhYmVsPVwiJHtkaWFsb2dUaXRsZX1cIiBhcmlhLWRlc2NyaWJlZGJ5PVwiJHtndWlkZUlEfVwiIGhpZGRlbj48ZGl2IHJvbGU9XCJhcHBsaWNhdGlvblwiPjxkaXYgY2xhc3M9XCIke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfVwiIGhpZGRlbj48L2Rpdj48L2Rpdj48L2Rpdj5gLFxyXG4gICAgICBgPGRpdiBjbGFzcz1cInNyLW9ubHkgJHtEQVRFX1BJQ0tFUl9TVEFUVVNfQ0xBU1N9XCIgcm9sZT1cInN0YXR1c1wiIGFyaWEtbGl2ZT1cInBvbGl0ZVwiPjwvZGl2PmAsXHJcbiAgICAgIGA8ZGl2IGNsYXNzPVwic3Itb25seSAke0RBVEVfUElDS0VSX0dVSURFX0NMQVNTfVwiIGlkPVwiJHtndWlkZUlEfVwiIGhpZGRlbj4ke3RleHQuZ3VpZGV9PC9kaXY+YFxyXG4gICAgXS5qb2luKFwiXCIpXHJcbiAgKTtcclxuXHJcbiAgaW50ZXJuYWxJbnB1dEVsLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcclxuICBpbnRlcm5hbElucHV0RWwuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCItMVwiKTtcclxuICBpbnRlcm5hbElucHV0RWwuY2xhc3NMaXN0LmFkZChcclxuICAgIFwic3Itb25seVwiLFxyXG4gICAgREFURV9QSUNLRVJfSU5URVJOQUxfSU5QVVRfQ0xBU1NcclxuICApO1xyXG4gIGludGVybmFsSW5wdXRFbC5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7XHJcbiAgaW50ZXJuYWxJbnB1dEVsLnJlcXVpcmVkID0gZmFsc2U7XHJcblxyXG4gIGRhdGVQaWNrZXJFbC5hcHBlbmRDaGlsZChjYWxlbmRhcldyYXBwZXIpO1xyXG4gIGRhdGVQaWNrZXJFbC5jbGFzc0xpc3QuYWRkKERBVEVfUElDS0VSX0lOSVRJQUxJWkVEX0NMQVNTKTtcclxuXHJcbiAgaWYgKGRlZmF1bHRWYWx1ZSkge1xyXG4gICAgc2V0Q2FsZW5kYXJWYWx1ZShkYXRlUGlja2VyRWwsIGRlZmF1bHRWYWx1ZSk7XHJcbiAgfVxyXG5cclxuICBpZiAoaW50ZXJuYWxJbnB1dEVsLmRpc2FibGVkKSB7XHJcbiAgICBkaXNhYmxlKGRhdGVQaWNrZXJFbCk7XHJcbiAgICBpbnRlcm5hbElucHV0RWwuZGlzYWJsZWQgPSBmYWxzZTtcclxuICB9XHJcbiAgXHJcbiAgaWYgKGV4dGVybmFsSW5wdXRFbC52YWx1ZSkge1xyXG4gICAgdmFsaWRhdGVEYXRlSW5wdXQoZXh0ZXJuYWxJbnB1dEVsKTtcclxuICB9XHJcbn07XHJcblxyXG4vLyAjcmVnaW9uIENhbGVuZGFyIC0gRGF0ZSBTZWxlY3Rpb24gVmlld1xyXG5cclxuLyoqXHJcbiAqIHJlbmRlciB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZVRvRGlzcGxheSBhIGRhdGUgdG8gcmVuZGVyIG9uIHRoZSBjYWxlbmRhclxyXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IGEgcmVmZXJlbmNlIHRvIHRoZSBuZXcgY2FsZW5kYXIgZWxlbWVudFxyXG4gKi9cclxuY29uc3QgcmVuZGVyQ2FsZW5kYXIgPSAoZWwsIF9kYXRlVG9EaXNwbGF5KSA9PiB7XHJcbiAgY29uc3Qge1xyXG4gICAgZGF0ZVBpY2tlckVsLFxyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIHN0YXR1c0VsLFxyXG4gICAgc2VsZWN0ZWREYXRlLFxyXG4gICAgbWF4RGF0ZSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICByYW5nZURhdGUsXHJcbiAgICBkaWFsb2dFbCxcclxuICAgIGd1aWRlRWxcclxuICB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG4gIGNvbnN0IHRvZGF5c0RhdGUgPSB0b2RheSgpO1xyXG4gIGxldCBkYXRlVG9EaXNwbGF5ID0gX2RhdGVUb0Rpc3BsYXkgfHwgdG9kYXlzRGF0ZTtcclxuXHJcbiAgY29uc3QgY2FsZW5kYXJXYXNIaWRkZW4gPSBjYWxlbmRhckVsLmhpZGRlbjtcclxuXHJcbiAgY29uc3QgZm9jdXNlZERhdGUgPSBhZGREYXlzKGRhdGVUb0Rpc3BsYXksIDApO1xyXG4gIGNvbnN0IGZvY3VzZWRNb250aCA9IGRhdGVUb0Rpc3BsYXkuZ2V0TW9udGgoKTtcclxuICBjb25zdCBmb2N1c2VkWWVhciA9IGRhdGVUb0Rpc3BsYXkuZ2V0RnVsbFllYXIoKTtcclxuXHJcbiAgY29uc3QgcHJldk1vbnRoID0gc3ViTW9udGhzKGRhdGVUb0Rpc3BsYXksIDEpO1xyXG4gIGNvbnN0IG5leHRNb250aCA9IGFkZE1vbnRocyhkYXRlVG9EaXNwbGF5LCAxKTtcclxuXHJcbiAgY29uc3QgY3VycmVudEZvcm1hdHRlZERhdGUgPSBmb3JtYXREYXRlKGRhdGVUb0Rpc3BsYXkpO1xyXG5cclxuICBjb25zdCBmaXJzdE9mTW9udGggPSBzdGFydE9mTW9udGgoZGF0ZVRvRGlzcGxheSk7XHJcbiAgY29uc3QgcHJldkJ1dHRvbnNEaXNhYmxlZCA9IGlzU2FtZU1vbnRoKGRhdGVUb0Rpc3BsYXksIG1pbkRhdGUpO1xyXG4gIGNvbnN0IG5leHRCdXR0b25zRGlzYWJsZWQgPSBpc1NhbWVNb250aChkYXRlVG9EaXNwbGF5LCBtYXhEYXRlKTtcclxuXHJcbiAgY29uc3QgcmFuZ2VDb25jbHVzaW9uRGF0ZSA9IHNlbGVjdGVkRGF0ZSB8fCBkYXRlVG9EaXNwbGF5O1xyXG4gIGNvbnN0IHJhbmdlU3RhcnREYXRlID0gcmFuZ2VEYXRlICYmIG1pbihyYW5nZUNvbmNsdXNpb25EYXRlLCByYW5nZURhdGUpO1xyXG4gIGNvbnN0IHJhbmdlRW5kRGF0ZSA9IHJhbmdlRGF0ZSAmJiBtYXgocmFuZ2VDb25jbHVzaW9uRGF0ZSwgcmFuZ2VEYXRlKTtcclxuXHJcbiAgY29uc3Qgd2l0aGluUmFuZ2VTdGFydERhdGUgPSByYW5nZURhdGUgJiYgYWRkRGF5cyhyYW5nZVN0YXJ0RGF0ZSwgMSk7XHJcbiAgY29uc3Qgd2l0aGluUmFuZ2VFbmREYXRlID0gcmFuZ2VEYXRlICYmIHN1YkRheXMocmFuZ2VFbmREYXRlLCAxKTtcclxuXHJcbiAgY29uc3QgbW9udGhMYWJlbCA9IE1PTlRIX0xBQkVMU1tmb2N1c2VkTW9udGhdO1xyXG5cclxuICBjb25zdCBnZW5lcmF0ZURhdGVIdG1sID0gKGRhdGVUb1JlbmRlcikgPT4ge1xyXG4gICAgY29uc3QgY2xhc3NlcyA9IFtDQUxFTkRBUl9EQVRFX0NMQVNTXTtcclxuICAgIGNvbnN0IGRheSA9IGRhdGVUb1JlbmRlci5nZXREYXRlKCk7XHJcbiAgICBjb25zdCBtb250aCA9IGRhdGVUb1JlbmRlci5nZXRNb250aCgpO1xyXG4gICAgY29uc3QgeWVhciA9IGRhdGVUb1JlbmRlci5nZXRGdWxsWWVhcigpO1xyXG4gICAgbGV0IGRheU9mV2VlayA9IGRhdGVUb1JlbmRlci5nZXREYXkoKSAtIDE7XHJcbiAgICBpZiAoZGF5T2ZXZWVrID09PSAtMSkge1xyXG4gICAgICBkYXlPZldlZWsgPSA2O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGZvcm1hdHRlZERhdGUgPSBmb3JtYXREYXRlKGRhdGVUb1JlbmRlcik7XHJcblxyXG4gICAgbGV0IHRhYmluZGV4ID0gXCItMVwiO1xyXG5cclxuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSAhaXNEYXRlV2l0aGluTWluQW5kTWF4KGRhdGVUb1JlbmRlciwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgICBjb25zdCBpc1NlbGVjdGVkID0gaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgc2VsZWN0ZWREYXRlKTtcclxuXHJcbiAgICBpZiAoaXNTYW1lTW9udGgoZGF0ZVRvUmVuZGVyLCBwcmV2TW9udGgpKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1BSRVZJT1VTX01PTlRIX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNTYW1lTW9udGgoZGF0ZVRvUmVuZGVyLCBmb2N1c2VkRGF0ZSkpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfQ1VSUkVOVF9NT05USF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2FtZU1vbnRoKGRhdGVUb1JlbmRlciwgbmV4dE1vbnRoKSkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9ORVhUX01PTlRIX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNTZWxlY3RlZCkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9TRUxFQ1RFRF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2FtZURheShkYXRlVG9SZW5kZXIsIHRvZGF5c0RhdGUpKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1RPREFZX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocmFuZ2VEYXRlKSB7XHJcbiAgICAgIGlmIChpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCByYW5nZURhdGUpKSB7XHJcbiAgICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9DTEFTUyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCByYW5nZVN0YXJ0RGF0ZSkpIHtcclxuICAgICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9SQU5HRV9EQVRFX1NUQVJUX0NMQVNTKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGlzU2FtZURheShkYXRlVG9SZW5kZXIsIHJhbmdlRW5kRGF0ZSkpIHtcclxuICAgICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9SQU5HRV9EQVRFX0VORF9DTEFTUyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChcclxuICAgICAgICBpc0RhdGVXaXRoaW5NaW5BbmRNYXgoXHJcbiAgICAgICAgICBkYXRlVG9SZW5kZXIsXHJcbiAgICAgICAgICB3aXRoaW5SYW5nZVN0YXJ0RGF0ZSxcclxuICAgICAgICAgIHdpdGhpblJhbmdlRW5kRGF0ZVxyXG4gICAgICAgIClcclxuICAgICAgKSB7XHJcbiAgICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfV0lUSElOX1JBTkdFX0NMQVNTKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCBmb2N1c2VkRGF0ZSkpIHtcclxuICAgICAgdGFiaW5kZXggPSBcIjBcIjtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfRk9DVVNFRF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbW9udGhTdHIgPSBNT05USF9MQUJFTFNbbW9udGhdO1xyXG4gICAgY29uc3QgZGF5U3RyID0gREFZX09GX1dFRUtfTEFCRUxTW2RheU9mV2Vla107XHJcbiAgICBjb25zdCBhcmlhTGFiZWxEYXRlID0gdGV4dC5hcmlhX2xhYmVsX2RhdGUucmVwbGFjZSgve2RheVN0cn0vLCBkYXlTdHIpLnJlcGxhY2UoL3tkYXl9LywgZGF5KS5yZXBsYWNlKC97bW9udGhTdHJ9LywgbW9udGhTdHIpLnJlcGxhY2UoL3t5ZWFyfS8sIHllYXIpO1xyXG5cclxuICAgIHJldHVybiBgPGJ1dHRvblxyXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgdGFiaW5kZXg9XCIke3RhYmluZGV4fVwiXHJcbiAgICAgIGNsYXNzPVwiJHtjbGFzc2VzLmpvaW4oXCIgXCIpfVwiIFxyXG4gICAgICBkYXRhLWRheT1cIiR7ZGF5fVwiIFxyXG4gICAgICBkYXRhLW1vbnRoPVwiJHttb250aCArIDF9XCIgXHJcbiAgICAgIGRhdGEteWVhcj1cIiR7eWVhcn1cIiBcclxuICAgICAgZGF0YS12YWx1ZT1cIiR7Zm9ybWF0dGVkRGF0ZX1cIlxyXG4gICAgICBhcmlhLWxhYmVsPVwiJHthcmlhTGFiZWxEYXRlfVwiXHJcbiAgICAgIGFyaWEtY3VycmVudD1cIiR7aXNTZWxlY3RlZCA/IFwiZGF0ZVwiIDogXCJmYWxzZVwifVwiXHJcbiAgICAgICR7aXNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgID4ke2RheX08L2J1dHRvbj5gO1xyXG4gIH07XHJcbiAgLy8gc2V0IGRhdGUgdG8gZmlyc3QgcmVuZGVyZWQgZGF5XHJcbiAgZGF0ZVRvRGlzcGxheSA9IHN0YXJ0T2ZXZWVrKGZpcnN0T2ZNb250aCk7XHJcblxyXG4gIGNvbnN0IGRheXMgPSBbXTtcclxuXHJcbiAgd2hpbGUgKFxyXG4gICAgZGF5cy5sZW5ndGggPCAyOCB8fFxyXG4gICAgZGF0ZVRvRGlzcGxheS5nZXRNb250aCgpID09PSBmb2N1c2VkTW9udGggfHxcclxuICAgIGRheXMubGVuZ3RoICUgNyAhPT0gMFxyXG4gICkge1xyXG4gICAgZGF5cy5wdXNoKGdlbmVyYXRlRGF0ZUh0bWwoZGF0ZVRvRGlzcGxheSkpO1xyXG4gICAgZGF0ZVRvRGlzcGxheSA9IGFkZERheXMoZGF0ZVRvRGlzcGxheSwgMSk7ICAgIFxyXG4gIH1cclxuICBjb25zdCBkYXRlc0h0bWwgPSBsaXN0VG9HcmlkSHRtbChkYXlzLCA3KTtcclxuXHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBjYWxlbmRhckVsLmNsb25lTm9kZSgpO1xyXG4gIG5ld0NhbGVuZGFyLmRhdGFzZXQudmFsdWUgPSBjdXJyZW50Rm9ybWF0dGVkRGF0ZTtcclxuICBuZXdDYWxlbmRhci5zdHlsZS50b3AgPSBgJHtkYXRlUGlja2VyRWwub2Zmc2V0SGVpZ2h0fXB4YDtcclxuICBuZXdDYWxlbmRhci5oaWRkZW4gPSBmYWxzZTtcclxuICBsZXQgY29udGVudCA9IGA8ZGl2IHRhYmluZGV4PVwiLTFcIiBjbGFzcz1cIiR7Q0FMRU5EQVJfREFURV9QSUNLRVJfQ0xBU1N9XCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX1JPV19DTEFTU31cIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiJHtDQUxFTkRBUl9DRUxMX0NMQVNTfSAke0NBTEVOREFSX0NFTExfQ0VOVEVSX0lURU1TX0NMQVNTfVwiPlxyXG4gICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NMQVNTfVwiXHJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCIke3RleHQucHJldmlvdXNfeWVhcn1cIlxyXG4gICAgICAgICAgICAke3ByZXZCdXR0b25zRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICAgICAgICA+Jm5ic3A7PC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIiR7Q0FMRU5EQVJfQ0VMTF9DTEFTU30gJHtDQUxFTkRBUl9DRUxMX0NFTlRFUl9JVEVNU19DTEFTU31cIj5cclxuICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfUFJFVklPVVNfTU9OVEhfQ0xBU1N9XCJcclxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIiR7dGV4dC5wcmV2aW91c19tb250aH1cIlxyXG4gICAgICAgICAgICAke3ByZXZCdXR0b25zRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICAgICAgICA+Jm5ic3A7PC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIiR7Q0FMRU5EQVJfQ0VMTF9DTEFTU30gJHtDQUxFTkRBUl9NT05USF9MQUJFTF9DTEFTU31cIj5cclxuICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfTU9OVEhfU0VMRUNUSU9OX0NMQVNTfVwiIGFyaWEtbGFiZWw9XCIke21vbnRoTGFiZWx9LiAke3RleHQuc2VsZWN0X21vbnRofS5cIlxyXG4gICAgICAgICAgPiR7bW9udGhMYWJlbH08L2J1dHRvbj5cclxuICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfWUVBUl9TRUxFQ1RJT05fQ0xBU1N9XCIgYXJpYS1sYWJlbD1cIiR7Zm9jdXNlZFllYXJ9LiAke3RleHQuc2VsZWN0X3llYXJ9LlwiXHJcbiAgICAgICAgICA+JHtmb2N1c2VkWWVhcn08L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiJHtDQUxFTkRBUl9DRUxMX0NMQVNTfSAke0NBTEVOREFSX0NFTExfQ0VOVEVSX0lURU1TX0NMQVNTfVwiPlxyXG4gICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9ORVhUX01PTlRIX0NMQVNTfVwiXHJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCIke3RleHQubmV4dF9tb250aH1cIlxyXG4gICAgICAgICAgICAke25leHRCdXR0b25zRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICAgICAgICA+Jm5ic3A7PC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIiR7Q0FMRU5EQVJfQ0VMTF9DTEFTU30gJHtDQUxFTkRBUl9DRUxMX0NFTlRFUl9JVEVNU19DTEFTU31cIj5cclxuICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfTkVYVF9ZRUFSX0NMQVNTfVwiXHJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCIke3RleHQubmV4dF95ZWFyfVwiXHJcbiAgICAgICAgICAgICR7bmV4dEJ1dHRvbnNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDx0YWJsZSBjbGFzcz1cIiR7Q0FMRU5EQVJfVEFCTEVfQ0xBU1N9XCIgcm9sZT1cInByZXNlbnRhdGlvblwiPlxyXG4gICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgIDx0cj5gO1xyXG4gIGZvcihsZXQgZCBpbiBEQVlfT0ZfV0VFS19MQUJFTFMpe1xyXG4gICAgY29udGVudCArPSBgPHRoIGNsYXNzPVwiJHtDQUxFTkRBUl9EQVlfT0ZfV0VFS19DTEFTU31cIiBzY29wZT1cImNvbFwiIGFyaWEtbGFiZWw9XCIke0RBWV9PRl9XRUVLX0xBQkVMU1tkXX1cIj4ke0RBWV9PRl9XRUVLX0xBQkVMU1tkXS5jaGFyQXQoMCl9PC90aD5gO1xyXG4gIH1cclxuICBjb250ZW50ICs9IGA8L3RyPlxyXG4gICAgICAgIDwvdGhlYWQ+XHJcbiAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgJHtkYXRlc0h0bWx9XHJcbiAgICAgICAgPC90Ym9keT5cclxuICAgICAgPC90YWJsZT5cclxuICAgIDwvZGl2PmA7XHJcbiAgbmV3Q2FsZW5kYXIuaW5uZXJIVE1MID0gY29udGVudDtcclxuICBjYWxlbmRhckVsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0NhbGVuZGFyLCBjYWxlbmRhckVsKTtcclxuXHJcbiAgZGF0ZVBpY2tlckVsLmNsYXNzTGlzdC5hZGQoREFURV9QSUNLRVJfQUNUSVZFX0NMQVNTKTtcclxuICBpZiAoZGlhbG9nRWwuaGlkZGVuID09PSB0cnVlKSB7XHJcbiAgICBkaWFsb2dFbC5oaWRkZW4gPSBmYWxzZTtcclxuICAgIGlmIChndWlkZUVsLmhpZGRlbikge1xyXG4gICAgICBndWlkZUVsLmhpZGRlbiA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICBjb25zdCBzdGF0dXNlcyA9IFtdO1xyXG5cclxuICBpZiAoY2FsZW5kYXJXYXNIaWRkZW4pIHtcclxuICAgIHN0YXR1c0VsLnRleHRDb250ZW50ID0gXCJcIjtcclxuICB9IFxyXG4gIGVsc2UgaWYgKF9kYXRlVG9EaXNwbGF5LmdldFRpbWUoKSA9PT0gbWluRGF0ZS5nZXRUaW1lKCkpIHtcclxuICAgIHN0YXR1c2VzLnB1c2godGV4dC5maXJzdF9wb3NzaWJsZV9kYXRlKTtcclxuICB9XHJcbiAgZWxzZSBpZiAobWF4RGF0ZSAhPT0gdW5kZWZpbmVkICYmIG1heERhdGUgIT09IFwiXCIgJiYgX2RhdGVUb0Rpc3BsYXkuZ2V0VGltZSgpID09PSBtYXhEYXRlLmdldFRpbWUoKSkge1xyXG4gICAgc3RhdHVzZXMucHVzaCh0ZXh0Lmxhc3RfcG9zc2libGVfZGF0ZSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgc3RhdHVzZXMucHVzaCh0ZXh0LmN1cnJlbnRfbW9udGhfZGlzcGxheWVkLnJlcGxhY2UoL3ttb250aExhYmVsfS8sIG1vbnRoTGFiZWwpLnJlcGxhY2UoL3tmb2N1c2VkWWVhcn0vLCBmb2N1c2VkWWVhcikpO1xyXG4gIH1cclxuXHJcbiAgc3RhdHVzRWwudGV4dENvbnRlbnQgPSBzdGF0dXNlcy5qb2luKFwiLiBcIik7XHJcblxyXG4gIHJldHVybiBuZXdDYWxlbmRhcjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gX2J1dHRvbkVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlQcmV2aW91c1llYXIgPSAoX2J1dHRvbkVsKSA9PiB7XHJcbiAgaWYgKF9idXR0b25FbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIF9idXR0b25FbFxyXG4gICk7XHJcbiAgbGV0IGRhdGUgPSBzdWJZZWFycyhjYWxlbmRhckRhdGUsIDEpO1xyXG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcclxuXHJcbiAgbGV0IG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9QUkVWSU9VU19ZRUFSKTtcclxuICBpZiAobmV4dFRvRm9jdXMuZGlzYWJsZWQpIHtcclxuICAgIG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX1BJQ0tFUik7XHJcbiAgfVxyXG4gIG5leHRUb0ZvY3VzLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgbW9udGggYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBfYnV0dG9uRWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheVByZXZpb3VzTW9udGggPSAoX2J1dHRvbkVsKSA9PiB7XHJcbiAgaWYgKF9idXR0b25FbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIF9idXR0b25FbFxyXG4gICk7XHJcbiAgbGV0IGRhdGUgPSBzdWJNb250aHMoY2FsZW5kYXJEYXRlLCAxKTtcclxuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XHJcblxyXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfUFJFVklPVVNfTU9OVEgpO1xyXG4gIGlmIChuZXh0VG9Gb2N1cy5kaXNhYmxlZCkge1xyXG4gICAgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfUElDS0VSKTtcclxuICB9XHJcbiAgbmV4dFRvRm9jdXMuZm9jdXMoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IF9idXR0b25FbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNwbGF5TmV4dE1vbnRoID0gKF9idXR0b25FbCkgPT4ge1xyXG4gIGlmIChfYnV0dG9uRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBfYnV0dG9uRWxcclxuICApO1xyXG4gIGxldCBkYXRlID0gYWRkTW9udGhzKGNhbGVuZGFyRGF0ZSwgMSk7XHJcbiAgZGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGUpO1xyXG5cclxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX05FWFRfTU9OVEgpO1xyXG4gIGlmIChuZXh0VG9Gb2N1cy5kaXNhYmxlZCkge1xyXG4gICAgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfUElDS0VSKTtcclxuICB9XHJcbiAgbmV4dFRvRm9jdXMuZm9jdXMoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gX2J1dHRvbkVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlOZXh0WWVhciA9IChfYnV0dG9uRWwpID0+IHtcclxuICBpZiAoX2J1dHRvbkVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgX2J1dHRvbkVsXHJcbiAgKTtcclxuICBsZXQgZGF0ZSA9IGFkZFllYXJzKGNhbGVuZGFyRGF0ZSwgMSk7XHJcbiAgZGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGUpO1xyXG5cclxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX05FWFRfWUVBUik7XHJcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XHJcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9QSUNLRVIpO1xyXG4gIH1cclxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEhpZGUgdGhlIGNhbGVuZGFyIG9mIGEgZGF0ZSBwaWNrZXIgY29tcG9uZW50LlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBoaWRlQ2FsZW5kYXIgPSAoZWwpID0+IHtcclxuICBjb25zdCB7IGRhdGVQaWNrZXJFbCwgY2FsZW5kYXJFbCwgc3RhdHVzRWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgZGF0ZVBpY2tlckVsLmNsYXNzTGlzdC5yZW1vdmUoREFURV9QSUNLRVJfQUNUSVZFX0NMQVNTKTtcclxuICBjYWxlbmRhckVsLmhpZGRlbiA9IHRydWU7XHJcbiAgc3RhdHVzRWwudGV4dENvbnRlbnQgPSBcIlwiO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNlbGVjdCBhIGRhdGUgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGNhbGVuZGFyRGF0ZUVsIEEgZGF0ZSBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBzZWxlY3REYXRlID0gKGNhbGVuZGFyRGF0ZUVsKSA9PiB7XHJcbiAgaWYgKGNhbGVuZGFyRGF0ZUVsLmRpc2FibGVkKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IHsgZGF0ZVBpY2tlckVsLCBleHRlcm5hbElucHV0RWwsIGRpYWxvZ0VsLCBndWlkZUVsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIGNhbGVuZGFyRGF0ZUVsXHJcbiAgKTtcclxuICBzZXRDYWxlbmRhclZhbHVlKGNhbGVuZGFyRGF0ZUVsLCBjYWxlbmRhckRhdGVFbC5kYXRhc2V0LnZhbHVlKTtcclxuICBoaWRlQ2FsZW5kYXIoZGF0ZVBpY2tlckVsKTtcclxuICBkaWFsb2dFbC5oaWRkZW4gPSB0cnVlO1xyXG4gIGd1aWRlRWwuaGlkZGVuID0gdHJ1ZTtcclxuXHJcbiAgZXh0ZXJuYWxJbnB1dEVsLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogVG9nZ2xlIHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgdG9nZ2xlQ2FsZW5kYXIgPSAoZWwpID0+IHtcclxuICBpZiAoZWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7XHJcbiAgICBkaWFsb2dFbCxcclxuICAgIGNhbGVuZGFyRWwsXHJcbiAgICBpbnB1dERhdGUsXHJcbiAgICBtaW5EYXRlLFxyXG4gICAgbWF4RGF0ZSxcclxuICAgIGRlZmF1bHREYXRlLFxyXG4gICAgZ3VpZGVFbFxyXG4gIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gIGlmIChjYWxlbmRhckVsLmhpZGRlbikge1xyXG4gICAgY29uc3QgZGF0ZVRvRGlzcGxheSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChcclxuICAgICAgaW5wdXREYXRlIHx8IGRlZmF1bHREYXRlIHx8IHRvZGF5KCksXHJcbiAgICAgIG1pbkRhdGUsXHJcbiAgICAgIG1heERhdGVcclxuICAgICk7XHJcbiAgICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGVUb0Rpc3BsYXkpO1xyXG4gICAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGhpZGVDYWxlbmRhcihlbCk7XHJcbiAgICBkaWFsb2dFbC5oaWRkZW4gPSB0cnVlO1xyXG4gICAgZ3VpZGVFbC5oaWRkZW4gPSB0cnVlO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBVcGRhdGUgdGhlIGNhbGVuZGFyIHdoZW4gdmlzaWJsZS5cclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgYW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyXHJcbiAqL1xyXG5jb25zdCB1cGRhdGVDYWxlbmRhcklmVmlzaWJsZSA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgaW5wdXREYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcbiAgY29uc3QgY2FsZW5kYXJTaG93biA9ICFjYWxlbmRhckVsLmhpZGRlbjtcclxuXHJcbiAgaWYgKGNhbGVuZGFyU2hvd24gJiYgaW5wdXREYXRlKSB7XHJcbiAgICBjb25zdCBkYXRlVG9EaXNwbGF5ID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGlucHV0RGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgICByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlVG9EaXNwbGF5KTtcclxuICB9XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIENhbGVuZGFyIC0gRGF0ZSBTZWxlY3Rpb24gVmlld1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciAtIE1vbnRoIFNlbGVjdGlvbiBWaWV3XHJcbi8qKlxyXG4gKiBEaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuIGluIHRoZSBkYXRlIHBpY2tlci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IGEgcmVmZXJlbmNlIHRvIHRoZSBuZXcgY2FsZW5kYXIgZWxlbWVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheU1vbnRoU2VsZWN0aW9uID0gKGVsLCBtb250aFRvRGlzcGxheSkgPT4ge1xyXG4gIGNvbnN0IHtcclxuICAgIGNhbGVuZGFyRWwsXHJcbiAgICBzdGF0dXNFbCxcclxuICAgIGNhbGVuZGFyRGF0ZSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICBtYXhEYXRlLFxyXG4gIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gIGNvbnN0IHNlbGVjdGVkTW9udGggPSBjYWxlbmRhckRhdGUuZ2V0TW9udGgoKTtcclxuICBjb25zdCBmb2N1c2VkTW9udGggPSBtb250aFRvRGlzcGxheSA9PSBudWxsID8gc2VsZWN0ZWRNb250aCA6IG1vbnRoVG9EaXNwbGF5O1xyXG5cclxuICBjb25zdCBtb250aHMgPSBNT05USF9MQUJFTFMubWFwKChtb250aCwgaW5kZXgpID0+IHtcclxuICAgIGNvbnN0IG1vbnRoVG9DaGVjayA9IHNldE1vbnRoKGNhbGVuZGFyRGF0ZSwgaW5kZXgpO1xyXG5cclxuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSBpc0RhdGVzTW9udGhPdXRzaWRlTWluT3JNYXgoXHJcbiAgICAgIG1vbnRoVG9DaGVjayxcclxuICAgICAgbWluRGF0ZSxcclxuICAgICAgbWF4RGF0ZVxyXG4gICAgKTtcclxuXHJcbiAgICBsZXQgdGFiaW5kZXggPSBcIi0xXCI7XHJcblxyXG4gICAgY29uc3QgY2xhc3NlcyA9IFtDQUxFTkRBUl9NT05USF9DTEFTU107XHJcbiAgICBjb25zdCBpc1NlbGVjdGVkID0gaW5kZXggPT09IHNlbGVjdGVkTW9udGg7XHJcblxyXG4gICAgaWYgKGluZGV4ID09PSBmb2N1c2VkTW9udGgpIHtcclxuICAgICAgdGFiaW5kZXggPSBcIjBcIjtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX01PTlRIX0ZPQ1VTRURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NlbGVjdGVkKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9NT05USF9TRUxFQ1RFRF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGA8YnV0dG9uIFxyXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgIHRhYmluZGV4PVwiJHt0YWJpbmRleH1cIlxyXG4gICAgICAgIGNsYXNzPVwiJHtjbGFzc2VzLmpvaW4oXCIgXCIpfVwiIFxyXG4gICAgICAgIGRhdGEtdmFsdWU9XCIke2luZGV4fVwiXHJcbiAgICAgICAgZGF0YS1sYWJlbD1cIiR7bW9udGh9XCJcclxuICAgICAgICBhcmlhLWN1cnJlbnQ9XCIke2lzU2VsZWN0ZWQgPyBcInRydWVcIiA6IFwiZmFsc2VcIn1cIlxyXG4gICAgICAgICR7aXNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgPiR7bW9udGh9PC9idXR0b24+YDtcclxuICB9KTtcclxuXHJcbiAgY29uc3QgbW9udGhzSHRtbCA9IGA8ZGl2IHRhYmluZGV4PVwiLTFcIiBjbGFzcz1cIiR7Q0FMRU5EQVJfTU9OVEhfUElDS0VSX0NMQVNTfVwiPlxyXG4gICAgPHRhYmxlIGNsYXNzPVwiJHtDQUxFTkRBUl9UQUJMRV9DTEFTU31cIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgIDx0Ym9keT5cclxuICAgICAgICAke2xpc3RUb0dyaWRIdG1sKG1vbnRocywgMyl9XHJcbiAgICAgIDwvdGJvZHk+XHJcbiAgICA8L3RhYmxlPlxyXG4gIDwvZGl2PmA7XHJcblxyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gY2FsZW5kYXJFbC5jbG9uZU5vZGUoKTtcclxuICBuZXdDYWxlbmRhci5pbm5lckhUTUwgPSBtb250aHNIdG1sO1xyXG4gIGNhbGVuZGFyRWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3Q2FsZW5kYXIsIGNhbGVuZGFyRWwpO1xyXG5cclxuICBzdGF0dXNFbC50ZXh0Q29udGVudCA9IHRleHQubW9udGhzX2Rpc3BsYXllZDtcclxuXHJcbiAgcmV0dXJuIG5ld0NhbGVuZGFyO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNlbGVjdCBhIG1vbnRoIGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IG1vbnRoRWwgQW4gbW9udGggZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3Qgc2VsZWN0TW9udGggPSAobW9udGhFbCkgPT4ge1xyXG4gIGlmIChtb250aEVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgbW9udGhFbFxyXG4gICk7XHJcbiAgY29uc3Qgc2VsZWN0ZWRNb250aCA9IHBhcnNlSW50KG1vbnRoRWwuZGF0YXNldC52YWx1ZSwgMTApO1xyXG4gIGxldCBkYXRlID0gc2V0TW9udGgoY2FsZW5kYXJEYXRlLCBzZWxlY3RlZE1vbnRoKTtcclxuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XHJcbiAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIENhbGVuZGFyIC0gTW9udGggU2VsZWN0aW9uIFZpZXdcclxuXHJcbi8vICNyZWdpb24gQ2FsZW5kYXIgLSBZZWFyIFNlbGVjdGlvbiBWaWV3XHJcblxyXG4vKipcclxuICogRGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuIGluIHRoZSBkYXRlIHBpY2tlci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge251bWJlcn0geWVhclRvRGlzcGxheSB5ZWFyIHRvIGRpc3BsYXkgaW4geWVhciBzZWxlY3Rpb25cclxuICogQHJldHVybnMge0hUTUxFbGVtZW50fSBhIHJlZmVyZW5jZSB0byB0aGUgbmV3IGNhbGVuZGFyIGVsZW1lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlZZWFyU2VsZWN0aW9uID0gKGVsLCB5ZWFyVG9EaXNwbGF5KSA9PiB7XHJcbiAgY29uc3Qge1xyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIHN0YXR1c0VsLFxyXG4gICAgY2FsZW5kYXJEYXRlLFxyXG4gICAgbWluRGF0ZSxcclxuICAgIG1heERhdGUsXHJcbiAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgY29uc3Qgc2VsZWN0ZWRZZWFyID0gY2FsZW5kYXJEYXRlLmdldEZ1bGxZZWFyKCk7XHJcbiAgY29uc3QgZm9jdXNlZFllYXIgPSB5ZWFyVG9EaXNwbGF5ID09IG51bGwgPyBzZWxlY3RlZFllYXIgOiB5ZWFyVG9EaXNwbGF5O1xyXG5cclxuICBsZXQgeWVhclRvQ2h1bmsgPSBmb2N1c2VkWWVhcjtcclxuICB5ZWFyVG9DaHVuayAtPSB5ZWFyVG9DaHVuayAlIFlFQVJfQ0hVTks7XHJcbiAgeWVhclRvQ2h1bmsgPSBNYXRoLm1heCgwLCB5ZWFyVG9DaHVuayk7XHJcblxyXG4gIGNvbnN0IHByZXZZZWFyQ2h1bmtEaXNhYmxlZCA9IGlzRGF0ZXNZZWFyT3V0c2lkZU1pbk9yTWF4KFxyXG4gICAgc2V0WWVhcihjYWxlbmRhckRhdGUsIHllYXJUb0NodW5rIC0gMSksXHJcbiAgICBtaW5EYXRlLFxyXG4gICAgbWF4RGF0ZVxyXG4gICk7XHJcblxyXG4gIGNvbnN0IG5leHRZZWFyQ2h1bmtEaXNhYmxlZCA9IGlzRGF0ZXNZZWFyT3V0c2lkZU1pbk9yTWF4KFxyXG4gICAgc2V0WWVhcihjYWxlbmRhckRhdGUsIHllYXJUb0NodW5rICsgWUVBUl9DSFVOSyksXHJcbiAgICBtaW5EYXRlLFxyXG4gICAgbWF4RGF0ZVxyXG4gICk7XHJcblxyXG4gIGNvbnN0IHllYXJzID0gW107XHJcbiAgbGV0IHllYXJJbmRleCA9IHllYXJUb0NodW5rO1xyXG4gIHdoaWxlICh5ZWFycy5sZW5ndGggPCBZRUFSX0NIVU5LKSB7XHJcbiAgICBjb25zdCBpc0Rpc2FibGVkID0gaXNEYXRlc1llYXJPdXRzaWRlTWluT3JNYXgoXHJcbiAgICAgIHNldFllYXIoY2FsZW5kYXJEYXRlLCB5ZWFySW5kZXgpLFxyXG4gICAgICBtaW5EYXRlLFxyXG4gICAgICBtYXhEYXRlXHJcbiAgICApO1xyXG5cclxuICAgIGxldCB0YWJpbmRleCA9IFwiLTFcIjtcclxuXHJcbiAgICBjb25zdCBjbGFzc2VzID0gW0NBTEVOREFSX1lFQVJfQ0xBU1NdO1xyXG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IHllYXJJbmRleCA9PT0gc2VsZWN0ZWRZZWFyO1xyXG5cclxuICAgIGlmICh5ZWFySW5kZXggPT09IGZvY3VzZWRZZWFyKSB7XHJcbiAgICAgIHRhYmluZGV4ID0gXCIwXCI7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9ZRUFSX0ZPQ1VTRURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NlbGVjdGVkKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9ZRUFSX1NFTEVDVEVEX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICB5ZWFycy5wdXNoKFxyXG4gICAgICBgPGJ1dHRvbiBcclxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICB0YWJpbmRleD1cIiR7dGFiaW5kZXh9XCJcclxuICAgICAgICBjbGFzcz1cIiR7Y2xhc3Nlcy5qb2luKFwiIFwiKX1cIiBcclxuICAgICAgICBkYXRhLXZhbHVlPVwiJHt5ZWFySW5kZXh9XCJcclxuICAgICAgICBhcmlhLWN1cnJlbnQ9XCIke2lzU2VsZWN0ZWQgPyBcInRydWVcIiA6IFwiZmFsc2VcIn1cIlxyXG4gICAgICAgICR7aXNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgPiR7eWVhckluZGV4fTwvYnV0dG9uPmBcclxuICAgICk7XHJcbiAgICB5ZWFySW5kZXggKz0gMTtcclxuICB9XHJcblxyXG4gIGNvbnN0IHllYXJzSHRtbCA9IGxpc3RUb0dyaWRIdG1sKHllYXJzLCAzKTtcclxuICBjb25zdCBhcmlhTGFiZWxQcmV2aW91c1llYXJzID0gdGV4dC5wcmV2aW91c195ZWFycy5yZXBsYWNlKC97eWVhcnN9LywgWUVBUl9DSFVOSyk7XHJcbiAgY29uc3QgYXJpYUxhYmVsTmV4dFllYXJzID0gdGV4dC5uZXh0X3llYXJzLnJlcGxhY2UoL3t5ZWFyc30vLCBZRUFSX0NIVU5LKTtcclxuICBjb25zdCBhbm5vdW5jZVllYXJzID0gdGV4dC55ZWFyc19kaXNwbGF5ZWQucmVwbGFjZSgve3N0YXJ0fS8sIHllYXJUb0NodW5rKS5yZXBsYWNlKC97ZW5kfS8sIHllYXJUb0NodW5rICsgWUVBUl9DSFVOSyAtIDEpO1xyXG5cclxuICBjb25zdCBuZXdDYWxlbmRhciA9IGNhbGVuZGFyRWwuY2xvbmVOb2RlKCk7XHJcbiAgbmV3Q2FsZW5kYXIuaW5uZXJIVE1MID0gYDxkaXYgdGFiaW5kZXg9XCItMVwiIGNsYXNzPVwiJHtDQUxFTkRBUl9ZRUFSX1BJQ0tFUl9DTEFTU31cIj5cclxuICAgIDx0YWJsZSBjbGFzcz1cIiR7Q0FMRU5EQVJfVEFCTEVfQ0xBU1N9XCIgcm9sZT1cInByZXNlbnRhdGlvblwiPlxyXG4gICAgICAgIDx0Ym9keT5cclxuICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgPHRkPlxyXG4gICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0hVTktfQ0xBU1N9XCIgXHJcbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiJHthcmlhTGFiZWxQcmV2aW91c1llYXJzfVwiXHJcbiAgICAgICAgICAgICAgICAke3ByZXZZZWFyQ2h1bmtEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgICAgICAgICA+Jm5ic3A7PC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiM1wiPlxyXG4gICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cIiR7Q0FMRU5EQVJfVEFCTEVfQ0xBU1N9XCIgcm9sZT1cInByZXNlbnRhdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAgICAke3llYXJzSHRtbH1cclxuICAgICAgICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgPHRkPlxyXG4gICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX05FWFRfWUVBUl9DSFVOS19DTEFTU31cIiBcclxuICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCIke2FyaWFMYWJlbE5leHRZZWFyc31cIlxyXG4gICAgICAgICAgICAgICAgJHtuZXh0WWVhckNodW5rRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICAgICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgPC90cj5cclxuICAgICAgICA8L3Rib2R5PlxyXG4gICAgICA8L3RhYmxlPlxyXG4gICAgPC9kaXY+YDtcclxuICBjYWxlbmRhckVsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0NhbGVuZGFyLCBjYWxlbmRhckVsKTtcclxuXHJcbiAgc3RhdHVzRWwudGV4dENvbnRlbnQgPSBhbm5vdW5jZVllYXJzO1xyXG5cclxuICByZXR1cm4gbmV3Q2FsZW5kYXI7XHJcbn07XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBieSB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNwbGF5UHJldmlvdXNZZWFyQ2h1bmsgPSAoZWwpID0+IHtcclxuICBpZiAoZWwuZGlzYWJsZWQpIHJldHVybjtcclxuXHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgZWxcclxuICApO1xyXG4gIGNvbnN0IHllYXJFbCA9IGNhbGVuZGFyRWwucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX0ZPQ1VTRUQpO1xyXG4gIGNvbnN0IHNlbGVjdGVkWWVhciA9IHBhcnNlSW50KHllYXJFbC50ZXh0Q29udGVudCwgMTApO1xyXG5cclxuICBsZXQgYWRqdXN0ZWRZZWFyID0gc2VsZWN0ZWRZZWFyIC0gWUVBUl9DSFVOSztcclxuICBhZGp1c3RlZFllYXIgPSBNYXRoLm1heCgwLCBhZGp1c3RlZFllYXIpO1xyXG5cclxuICBjb25zdCBkYXRlID0gc2V0WWVhcihjYWxlbmRhckRhdGUsIGFkanVzdGVkWWVhcik7XHJcbiAgY29uc3QgY2FwcGVkRGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlZZWFyU2VsZWN0aW9uKFxyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIGNhcHBlZERhdGUuZ2V0RnVsbFllYXIoKVxyXG4gICk7XHJcblxyXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOSyk7XHJcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XHJcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9QSUNLRVIpO1xyXG4gIH1cclxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgYnkgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheU5leHRZZWFyQ2h1bmsgPSAoZWwpID0+IHtcclxuICBpZiAoZWwuZGlzYWJsZWQpIHJldHVybjtcclxuXHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgZWxcclxuICApO1xyXG4gIGNvbnN0IHllYXJFbCA9IGNhbGVuZGFyRWwucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX0ZPQ1VTRUQpO1xyXG4gIGNvbnN0IHNlbGVjdGVkWWVhciA9IHBhcnNlSW50KHllYXJFbC50ZXh0Q29udGVudCwgMTApO1xyXG5cclxuICBsZXQgYWRqdXN0ZWRZZWFyID0gc2VsZWN0ZWRZZWFyICsgWUVBUl9DSFVOSztcclxuICBhZGp1c3RlZFllYXIgPSBNYXRoLm1heCgwLCBhZGp1c3RlZFllYXIpO1xyXG5cclxuICBjb25zdCBkYXRlID0gc2V0WWVhcihjYWxlbmRhckRhdGUsIGFkanVzdGVkWWVhcik7XHJcbiAgY29uc3QgY2FwcGVkRGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlZZWFyU2VsZWN0aW9uKFxyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIGNhcHBlZERhdGUuZ2V0RnVsbFllYXIoKVxyXG4gICk7XHJcblxyXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LKTtcclxuICBpZiAobmV4dFRvRm9jdXMuZGlzYWJsZWQpIHtcclxuICAgIG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX1BJQ0tFUik7XHJcbiAgfVxyXG4gIG5leHRUb0ZvY3VzLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogU2VsZWN0IGEgeWVhciBpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50LlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSB5ZWFyRWwgQSB5ZWFyIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IHNlbGVjdFllYXIgPSAoeWVhckVsKSA9PiB7XHJcbiAgaWYgKHllYXJFbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIHllYXJFbFxyXG4gICk7XHJcbiAgY29uc3Qgc2VsZWN0ZWRZZWFyID0gcGFyc2VJbnQoeWVhckVsLmlubmVySFRNTCwgMTApO1xyXG4gIGxldCBkYXRlID0gc2V0WWVhcihjYWxlbmRhckRhdGUsIHNlbGVjdGVkWWVhcik7XHJcbiAgZGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGUpO1xyXG4gIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9GT0NVU0VEKS5mb2N1cygpO1xyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciAtIFllYXIgU2VsZWN0aW9uIFZpZXdcclxuXHJcbi8vICNyZWdpb24gQ2FsZW5kYXIgRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8qKlxyXG4gKiBIaWRlIHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRXNjYXBlRnJvbUNhbGVuZGFyID0gKGV2ZW50KSA9PiB7XHJcbiAgY29uc3QgeyBkYXRlUGlja2VyRWwsIGV4dGVybmFsSW5wdXRFbCwgZGlhbG9nRWwsIGd1aWRlRWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGV2ZW50LnRhcmdldCk7XHJcblxyXG4gIGhpZGVDYWxlbmRhcihkYXRlUGlja2VyRWwpO1xyXG4gIGRpYWxvZ0VsLmhpZGRlbiA9IHRydWU7XHJcbiAgZ3VpZGVFbC5oaWRkZW4gPSB0cnVlO1xyXG4gIGV4dGVybmFsSW5wdXRFbC5mb2N1cygpO1xyXG5cclxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciBFdmVudCBIYW5kbGluZ1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciBEYXRlIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vKipcclxuICogQWRqdXN0IHRoZSBkYXRlIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhciBpZiBuZWVkZWQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGFkanVzdERhdGVGbiBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IGFkanVzdENhbGVuZGFyID0gKGFkanVzdERhdGVGbikgPT4ge1xyXG4gIHJldHVybiAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgICAgZXZlbnQudGFyZ2V0XHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IGRhdGUgPSBhZGp1c3REYXRlRm4oY2FsZW5kYXJEYXRlKTtcclxuXHJcbiAgICBjb25zdCBjYXBwZWREYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gICAgaWYgKCFpc1NhbWVEYXkoY2FsZW5kYXJEYXRlLCBjYXBwZWREYXRlKSkge1xyXG4gICAgICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGNhcHBlZERhdGUpO1xyXG4gICAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcclxuICAgIH1cclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSB3ZWVrIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlVXBGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBzdWJXZWVrcyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgd2VlayBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZURvd25Gcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBhZGRXZWVrcyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgZGF5IGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlTGVmdEZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IHN1YkRheXMoZGF0ZSwgMSkpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIGRheSBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVJpZ2h0RnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gYWRkRGF5cyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIHN0YXJ0IG9mIHRoZSB3ZWVrIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlSG9tZUZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IHN0YXJ0T2ZXZWVrKGRhdGUpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgZW5kIG9mIHRoZSB3ZWVrIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRW5kRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gZW5kT2ZXZWVrKGRhdGUpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VEb3duRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gYWRkTW9udGhzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VVcEZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IHN1Yk1vbnRocyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVNoaWZ0UGFnZURvd25Gcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBhZGRZZWFycyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVNoaWZ0UGFnZVVwRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gc3ViWWVhcnMoZGF0ZSwgMSkpO1xyXG5cclxuLyoqXHJcbiAqIGRpc3BsYXkgdGhlIGNhbGVuZGFyIGZvciB0aGUgbW91c2Vtb3ZlIGRhdGUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgVGhlIG1vdXNlbW92ZSBldmVudFxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBkYXRlRWwgQSBkYXRlIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZU1vdXNlbW92ZUZyb21EYXRlID0gKGRhdGVFbCkgPT4ge1xyXG4gIGlmIChkYXRlRWwuZGlzYWJsZWQpIHJldHVybjtcclxuXHJcbiAgY29uc3QgY2FsZW5kYXJFbCA9IGRhdGVFbC5jbG9zZXN0KERBVEVfUElDS0VSX0NBTEVOREFSKTtcclxuXHJcbiAgY29uc3QgY3VycmVudENhbGVuZGFyRGF0ZSA9IGNhbGVuZGFyRWwuZGF0YXNldC52YWx1ZTtcclxuICBjb25zdCBob3ZlckRhdGUgPSBkYXRlRWwuZGF0YXNldC52YWx1ZTtcclxuXHJcbiAgaWYgKGhvdmVyRGF0ZSA9PT0gY3VycmVudENhbGVuZGFyRGF0ZSkgcmV0dXJuO1xyXG5cclxuICBjb25zdCBkYXRlVG9EaXNwbGF5ID0gcGFyc2VEYXRlU3RyaW5nKGhvdmVyRGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlVG9EaXNwbGF5KTtcclxuICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgRGF0ZSBFdmVudCBIYW5kbGluZ1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciBNb250aCBFdmVudCBIYW5kbGluZ1xyXG5cclxuLyoqXHJcbiAqIEFkanVzdCB0aGUgbW9udGggYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4gaWYgbmVlZGVkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBhZGp1c3RNb250aEZuIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgYWRqdXN0ZWQgbW9udGhcclxuICovXHJcbmNvbnN0IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuID0gKGFkanVzdE1vbnRoRm4pID0+IHtcclxuICByZXR1cm4gKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBtb250aEVsID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRNb250aCA9IHBhcnNlSW50KG1vbnRoRWwuZGF0YXNldC52YWx1ZSwgMTApO1xyXG4gICAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgICBtb250aEVsXHJcbiAgICApO1xyXG4gICAgY29uc3QgY3VycmVudERhdGUgPSBzZXRNb250aChjYWxlbmRhckRhdGUsIHNlbGVjdGVkTW9udGgpO1xyXG5cclxuICAgIGxldCBhZGp1c3RlZE1vbnRoID0gYWRqdXN0TW9udGhGbihzZWxlY3RlZE1vbnRoKTtcclxuICAgIGFkanVzdGVkTW9udGggPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxMSwgYWRqdXN0ZWRNb250aCkpO1xyXG5cclxuICAgIGNvbnN0IGRhdGUgPSBzZXRNb250aChjYWxlbmRhckRhdGUsIGFkanVzdGVkTW9udGgpO1xyXG4gICAgY29uc3QgY2FwcGVkRGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICAgIGlmICghaXNTYW1lTW9udGgoY3VycmVudERhdGUsIGNhcHBlZERhdGUpKSB7XHJcbiAgICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheU1vbnRoU2VsZWN0aW9uKFxyXG4gICAgICAgIGNhbGVuZGFyRWwsXHJcbiAgICAgICAgY2FwcGVkRGF0ZS5nZXRNb250aCgpXHJcbiAgICAgICk7XHJcbiAgICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRCkuZm9jdXMoKTtcclxuICAgIH1cclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIHRocmVlIG1vbnRocyBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlVXBGcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigobW9udGgpID0+IG1vbnRoIC0gMyk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCB0aHJlZSBtb250aHMgYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZURvd25Gcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigobW9udGgpID0+IG1vbnRoICsgMyk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgbW9udGggYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUxlZnRGcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigobW9udGgpID0+IG1vbnRoIC0gMSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgbW9udGggYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVJpZ2h0RnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oKG1vbnRoKSA9PiBtb250aCArIDEpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBzdGFydCBvZiB0aGUgcm93IG9mIG1vbnRocyBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlSG9tZUZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKFxyXG4gIChtb250aCkgPT4gbW9udGggLSAobW9udGggJSAzKVxyXG4pO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBlbmQgb2YgdGhlIHJvdyBvZiBtb250aHMgYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUVuZEZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKFxyXG4gIChtb250aCkgPT4gbW9udGggKyAyIC0gKG1vbnRoICUgMylcclxuKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgbGFzdCBtb250aCAoRGVjZW1iZXIpIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVQYWdlRG93bkZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKCgpID0+IDExKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgZmlyc3QgbW9udGggKEphbnVhcnkpIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVQYWdlVXBGcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigoKSA9PiAwKTtcclxuXHJcbi8qKlxyXG4gKiB1cGRhdGUgdGhlIGZvY3VzIG9uIGEgbW9udGggd2hlbiB0aGUgbW91c2UgbW92ZXMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgVGhlIG1vdXNlbW92ZSBldmVudFxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBtb250aEVsIEEgbW9udGggZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlTW91c2Vtb3ZlRnJvbU1vbnRoID0gKG1vbnRoRWwpID0+IHtcclxuICBpZiAobW9udGhFbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGlmIChtb250aEVsLmNsYXNzTGlzdC5jb250YWlucyhDQUxFTkRBUl9NT05USF9GT0NVU0VEX0NMQVNTKSkgcmV0dXJuO1xyXG5cclxuICBjb25zdCBmb2N1c01vbnRoID0gcGFyc2VJbnQobW9udGhFbC5kYXRhc2V0LnZhbHVlLCAxMCk7XHJcblxyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheU1vbnRoU2VsZWN0aW9uKG1vbnRoRWwsIGZvY3VzTW9udGgpO1xyXG4gIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRCkuZm9jdXMoKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgTW9udGggRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8vICNyZWdpb24gQ2FsZW5kYXIgWWVhciBFdmVudCBIYW5kbGluZ1xyXG5cclxuLyoqXHJcbiAqIEFkanVzdCB0aGUgeWVhciBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuIGlmIG5lZWRlZC5cclxuICpcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gYWRqdXN0WWVhckZuIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgYWRqdXN0ZWQgeWVhclxyXG4gKi9cclxuY29uc3QgYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbiA9IChhZGp1c3RZZWFyRm4pID0+IHtcclxuICByZXR1cm4gKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCB5ZWFyRWwgPSBldmVudC50YXJnZXQ7XHJcbiAgICBjb25zdCBzZWxlY3RlZFllYXIgPSBwYXJzZUludCh5ZWFyRWwuZGF0YXNldC52YWx1ZSwgMTApO1xyXG4gICAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgICB5ZWFyRWxcclxuICAgICk7XHJcbiAgICBjb25zdCBjdXJyZW50RGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBzZWxlY3RlZFllYXIpO1xyXG5cclxuICAgIGxldCBhZGp1c3RlZFllYXIgPSBhZGp1c3RZZWFyRm4oc2VsZWN0ZWRZZWFyKTtcclxuICAgIGFkanVzdGVkWWVhciA9IE1hdGgubWF4KDAsIGFkanVzdGVkWWVhcik7XHJcblxyXG4gICAgY29uc3QgZGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBhZGp1c3RlZFllYXIpO1xyXG4gICAgY29uc3QgY2FwcGVkRGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICAgIGlmICghaXNTYW1lWWVhcihjdXJyZW50RGF0ZSwgY2FwcGVkRGF0ZSkpIHtcclxuICAgICAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbihcclxuICAgICAgICBjYWxlbmRhckVsLFxyXG4gICAgICAgIGNhcHBlZERhdGUuZ2V0RnVsbFllYXIoKVxyXG4gICAgICApO1xyXG4gICAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfRk9DVVNFRCkuZm9jdXMoKTtcclxuICAgIH1cclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIHRocmVlIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVVwRnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKCh5ZWFyKSA9PiB5ZWFyIC0gMyk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCB0aHJlZSB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVEb3duRnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKCh5ZWFyKSA9PiB5ZWFyICsgMyk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVMZWZ0RnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKCh5ZWFyKSA9PiB5ZWFyIC0gMSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVSaWdodEZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbigoeWVhcikgPT4geWVhciArIDEpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBzdGFydCBvZiB0aGUgcm93IG9mIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUhvbWVGcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oXHJcbiAgKHllYXIpID0+IHllYXIgLSAoeWVhciAlIDMpXHJcbik7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIGVuZCBvZiB0aGUgcm93IG9mIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUVuZEZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbihcclxuICAoeWVhcikgPT4geWVhciArIDIgLSAoeWVhciAlIDMpXHJcbik7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gYmFjayAxMiB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVQYWdlVXBGcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oXHJcbiAgKHllYXIpID0+IHllYXIgLSBZRUFSX0NIVU5LXHJcbik7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCAxMiB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVQYWdlRG93bkZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbihcclxuICAoeWVhcikgPT4geWVhciArIFlFQVJfQ0hVTktcclxuKTtcclxuXHJcbi8qKlxyXG4gKiB1cGRhdGUgdGhlIGZvY3VzIG9uIGEgeWVhciB3aGVuIHRoZSBtb3VzZSBtb3Zlcy5cclxuICpcclxuICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCBUaGUgbW91c2Vtb3ZlIGV2ZW50XHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGRhdGVFbCBBIHllYXIgZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlTW91c2Vtb3ZlRnJvbVllYXIgPSAoeWVhckVsKSA9PiB7XHJcbiAgaWYgKHllYXJFbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGlmICh5ZWFyRWwuY2xhc3NMaXN0LmNvbnRhaW5zKENBTEVOREFSX1lFQVJfRk9DVVNFRF9DTEFTUykpIHJldHVybjtcclxuXHJcbiAgY29uc3QgZm9jdXNZZWFyID0gcGFyc2VJbnQoeWVhckVsLmRhdGFzZXQudmFsdWUsIDEwKTtcclxuXHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbih5ZWFyRWwsIGZvY3VzWWVhcik7XHJcbiAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIENhbGVuZGFyIFllYXIgRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8vICNyZWdpb24gRm9jdXMgSGFuZGxpbmcgRXZlbnQgSGFuZGxpbmdcclxuXHJcbmNvbnN0IHRhYkhhbmRsZXIgPSAoZm9jdXNhYmxlKSA9PiB7XHJcbiAgY29uc3QgZ2V0Rm9jdXNhYmxlQ29udGV4dCA9IChlbCkgPT4ge1xyXG4gICAgY29uc3QgeyBjYWxlbmRhckVsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcbiAgICBjb25zdCBmb2N1c2FibGVFbGVtZW50cyA9IHNlbGVjdChmb2N1c2FibGUsIGNhbGVuZGFyRWwpO1xyXG5cclxuICAgIGNvbnN0IGZpcnN0VGFiSW5kZXggPSAwO1xyXG4gICAgY29uc3QgbGFzdFRhYkluZGV4ID0gZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMTtcclxuICAgIGNvbnN0IGZpcnN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzW2ZpcnN0VGFiSW5kZXhdO1xyXG4gICAgY29uc3QgbGFzdFRhYlN0b3AgPSBmb2N1c2FibGVFbGVtZW50c1tsYXN0VGFiSW5kZXhdO1xyXG4gICAgY29uc3QgZm9jdXNJbmRleCA9IGZvY3VzYWJsZUVsZW1lbnRzLmluZGV4T2YoYWN0aXZlRWxlbWVudCgpKTtcclxuXHJcbiAgICBjb25zdCBpc0xhc3RUYWIgPSBmb2N1c0luZGV4ID09PSBsYXN0VGFiSW5kZXg7XHJcbiAgICBjb25zdCBpc0ZpcnN0VGFiID0gZm9jdXNJbmRleCA9PT0gZmlyc3RUYWJJbmRleDtcclxuICAgIGNvbnN0IGlzTm90Rm91bmQgPSBmb2N1c0luZGV4ID09PSAtMTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBmb2N1c2FibGVFbGVtZW50cyxcclxuICAgICAgaXNOb3RGb3VuZCxcclxuICAgICAgZmlyc3RUYWJTdG9wLFxyXG4gICAgICBpc0ZpcnN0VGFiLFxyXG4gICAgICBsYXN0VGFiU3RvcCxcclxuICAgICAgaXNMYXN0VGFiLFxyXG4gICAgfTtcclxuICB9O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdGFiQWhlYWQoZXZlbnQpIHtcclxuICAgICAgY29uc3QgeyBmaXJzdFRhYlN0b3AsIGlzTGFzdFRhYiwgaXNOb3RGb3VuZCB9ID0gZ2V0Rm9jdXNhYmxlQ29udGV4dChcclxuICAgICAgICBldmVudC50YXJnZXRcclxuICAgICAgKTtcclxuXHJcbiAgICAgIGlmIChpc0xhc3RUYWIgfHwgaXNOb3RGb3VuZCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB0YWJCYWNrKGV2ZW50KSB7XHJcbiAgICAgIGNvbnN0IHsgbGFzdFRhYlN0b3AsIGlzRmlyc3RUYWIsIGlzTm90Rm91bmQgfSA9IGdldEZvY3VzYWJsZUNvbnRleHQoXHJcbiAgICAgICAgZXZlbnQudGFyZ2V0XHJcbiAgICAgICk7XHJcblxyXG4gICAgICBpZiAoaXNGaXJzdFRhYiB8fCBpc05vdEZvdW5kKSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBsYXN0VGFiU3RvcC5mb2N1cygpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCBkYXRlUGlja2VyVGFiRXZlbnRIYW5kbGVyID0gdGFiSGFuZGxlcihEQVRFX1BJQ0tFUl9GT0NVU0FCTEUpO1xyXG5jb25zdCBtb250aFBpY2tlclRhYkV2ZW50SGFuZGxlciA9IHRhYkhhbmRsZXIoTU9OVEhfUElDS0VSX0ZPQ1VTQUJMRSk7XHJcbmNvbnN0IHllYXJQaWNrZXJUYWJFdmVudEhhbmRsZXIgPSB0YWJIYW5kbGVyKFlFQVJfUElDS0VSX0ZPQ1VTQUJMRSk7XHJcblxyXG4vLyAjZW5kcmVnaW9uIEZvY3VzIEhhbmRsaW5nIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vLyAjcmVnaW9uIERhdGUgUGlja2VyIEV2ZW50IERlbGVnYXRpb24gUmVnaXN0cmF0aW9uIC8gQ29tcG9uZW50XHJcblxyXG5jb25zdCBkYXRlUGlja2VyRXZlbnRzID0ge1xyXG4gIFtDTElDS106IHtcclxuICAgIFtEQVRFX1BJQ0tFUl9CVVRUT05dKCkge1xyXG4gICAgICB0b2dnbGVDYWxlbmRhcih0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfREFURV0oKSB7XHJcbiAgICAgIHNlbGVjdERhdGUodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX01PTlRIXSgpIHtcclxuICAgICAgc2VsZWN0TW9udGgodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX1lFQVJdKCkge1xyXG4gICAgICBzZWxlY3RZZWFyKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9QUkVWSU9VU19NT05USF0oKSB7XHJcbiAgICAgIGRpc3BsYXlQcmV2aW91c01vbnRoKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9ORVhUX01PTlRIXSgpIHtcclxuICAgICAgZGlzcGxheU5leHRNb250aCh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl0oKSB7XHJcbiAgICAgIGRpc3BsYXlQcmV2aW91c1llYXIodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX05FWFRfWUVBUl0oKSB7XHJcbiAgICAgIGRpc3BsYXlOZXh0WWVhcih0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOS10oKSB7XHJcbiAgICAgIGRpc3BsYXlQcmV2aW91c1llYXJDaHVuayh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LXSgpIHtcclxuICAgICAgZGlzcGxheU5leHRZZWFyQ2h1bmsodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX01PTlRIX1NFTEVDVElPTl0oKSB7XHJcbiAgICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheU1vbnRoU2VsZWN0aW9uKHRoaXMpO1xyXG4gICAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX01PTlRIX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX1lFQVJfU0VMRUNUSU9OXSgpIHtcclxuICAgICAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbih0aGlzKTtcclxuICAgICAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAga2V5dXA6IHtcclxuICAgIFtEQVRFX1BJQ0tFUl9DQUxFTkRBUl0oZXZlbnQpIHtcclxuICAgICAgY29uc3Qga2V5ZG93biA9IHRoaXMuZGF0YXNldC5rZXlkb3duS2V5Q29kZTtcclxuICAgICAgaWYgKGAke2V2ZW50LmtleUNvZGV9YCAhPT0ga2V5ZG93bikge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxuICBrZXlkb3duOiB7XHJcbiAgICBbREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRdKGV2ZW50KSB7XHJcbiAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSBFTlRFUl9LRVlDT0RFKSB7XHJcbiAgICAgICAgdmFsaWRhdGVEYXRlSW5wdXQodGhpcyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfREFURV06IGtleW1hcCh7XHJcbiAgICAgIFVwOiBoYW5kbGVVcEZyb21EYXRlLFxyXG4gICAgICBBcnJvd1VwOiBoYW5kbGVVcEZyb21EYXRlLFxyXG4gICAgICBEb3duOiBoYW5kbGVEb3duRnJvbURhdGUsXHJcbiAgICAgIEFycm93RG93bjogaGFuZGxlRG93bkZyb21EYXRlLFxyXG4gICAgICBMZWZ0OiBoYW5kbGVMZWZ0RnJvbURhdGUsXHJcbiAgICAgIEFycm93TGVmdDogaGFuZGxlTGVmdEZyb21EYXRlLFxyXG4gICAgICBSaWdodDogaGFuZGxlUmlnaHRGcm9tRGF0ZSxcclxuICAgICAgQXJyb3dSaWdodDogaGFuZGxlUmlnaHRGcm9tRGF0ZSxcclxuICAgICAgSG9tZTogaGFuZGxlSG9tZUZyb21EYXRlLFxyXG4gICAgICBFbmQ6IGhhbmRsZUVuZEZyb21EYXRlLFxyXG4gICAgICBQYWdlRG93bjogaGFuZGxlUGFnZURvd25Gcm9tRGF0ZSxcclxuICAgICAgUGFnZVVwOiBoYW5kbGVQYWdlVXBGcm9tRGF0ZSxcclxuICAgICAgXCJTaGlmdCtQYWdlRG93blwiOiBoYW5kbGVTaGlmdFBhZ2VEb3duRnJvbURhdGUsXHJcbiAgICAgIFwiU2hpZnQrUGFnZVVwXCI6IGhhbmRsZVNoaWZ0UGFnZVVwRnJvbURhdGUsXHJcbiAgICB9KSxcclxuICAgIFtDQUxFTkRBUl9EQVRFX1BJQ0tFUl06IGtleW1hcCh7XHJcbiAgICAgIFRhYjogZGF0ZVBpY2tlclRhYkV2ZW50SGFuZGxlci50YWJBaGVhZCxcclxuICAgICAgXCJTaGlmdCtUYWJcIjogZGF0ZVBpY2tlclRhYkV2ZW50SGFuZGxlci50YWJCYWNrLFxyXG4gICAgfSksXHJcbiAgICBbQ0FMRU5EQVJfTU9OVEhdOiBrZXltYXAoe1xyXG4gICAgICBVcDogaGFuZGxlVXBGcm9tTW9udGgsXHJcbiAgICAgIEFycm93VXA6IGhhbmRsZVVwRnJvbU1vbnRoLFxyXG4gICAgICBEb3duOiBoYW5kbGVEb3duRnJvbU1vbnRoLFxyXG4gICAgICBBcnJvd0Rvd246IGhhbmRsZURvd25Gcm9tTW9udGgsXHJcbiAgICAgIExlZnQ6IGhhbmRsZUxlZnRGcm9tTW9udGgsXHJcbiAgICAgIEFycm93TGVmdDogaGFuZGxlTGVmdEZyb21Nb250aCxcclxuICAgICAgUmlnaHQ6IGhhbmRsZVJpZ2h0RnJvbU1vbnRoLFxyXG4gICAgICBBcnJvd1JpZ2h0OiBoYW5kbGVSaWdodEZyb21Nb250aCxcclxuICAgICAgSG9tZTogaGFuZGxlSG9tZUZyb21Nb250aCxcclxuICAgICAgRW5kOiBoYW5kbGVFbmRGcm9tTW9udGgsXHJcbiAgICAgIFBhZ2VEb3duOiBoYW5kbGVQYWdlRG93bkZyb21Nb250aCxcclxuICAgICAgUGFnZVVwOiBoYW5kbGVQYWdlVXBGcm9tTW9udGgsXHJcbiAgICB9KSxcclxuICAgIFtDQUxFTkRBUl9NT05USF9QSUNLRVJdOiBrZXltYXAoe1xyXG4gICAgICBUYWI6IG1vbnRoUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkFoZWFkLFxyXG4gICAgICBcIlNoaWZ0K1RhYlwiOiBtb250aFBpY2tlclRhYkV2ZW50SGFuZGxlci50YWJCYWNrLFxyXG4gICAgfSksXHJcbiAgICBbQ0FMRU5EQVJfWUVBUl06IGtleW1hcCh7XHJcbiAgICAgIFVwOiBoYW5kbGVVcEZyb21ZZWFyLFxyXG4gICAgICBBcnJvd1VwOiBoYW5kbGVVcEZyb21ZZWFyLFxyXG4gICAgICBEb3duOiBoYW5kbGVEb3duRnJvbVllYXIsXHJcbiAgICAgIEFycm93RG93bjogaGFuZGxlRG93bkZyb21ZZWFyLFxyXG4gICAgICBMZWZ0OiBoYW5kbGVMZWZ0RnJvbVllYXIsXHJcbiAgICAgIEFycm93TGVmdDogaGFuZGxlTGVmdEZyb21ZZWFyLFxyXG4gICAgICBSaWdodDogaGFuZGxlUmlnaHRGcm9tWWVhcixcclxuICAgICAgQXJyb3dSaWdodDogaGFuZGxlUmlnaHRGcm9tWWVhcixcclxuICAgICAgSG9tZTogaGFuZGxlSG9tZUZyb21ZZWFyLFxyXG4gICAgICBFbmQ6IGhhbmRsZUVuZEZyb21ZZWFyLFxyXG4gICAgICBQYWdlRG93bjogaGFuZGxlUGFnZURvd25Gcm9tWWVhcixcclxuICAgICAgUGFnZVVwOiBoYW5kbGVQYWdlVXBGcm9tWWVhcixcclxuICAgIH0pLFxyXG4gICAgW0NBTEVOREFSX1lFQVJfUElDS0VSXToga2V5bWFwKHtcclxuICAgICAgVGFiOiB5ZWFyUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkFoZWFkLFxyXG4gICAgICBcIlNoaWZ0K1RhYlwiOiB5ZWFyUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkJhY2ssXHJcbiAgICB9KSxcclxuICAgIFtEQVRFX1BJQ0tFUl9DQUxFTkRBUl0oZXZlbnQpIHtcclxuICAgICAgdGhpcy5kYXRhc2V0LmtleWRvd25LZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcclxuICAgIH0sXHJcbiAgICBbREFURV9QSUNLRVJdKGV2ZW50KSB7XHJcbiAgICAgIGNvbnN0IGtleU1hcCA9IGtleW1hcCh7XHJcbiAgICAgICAgRXNjYXBlOiBoYW5kbGVFc2NhcGVGcm9tQ2FsZW5kYXIsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAga2V5TWFwKGV2ZW50KTtcclxuICAgIH0sXHJcbiAgfSxcclxuICBmb2N1c291dDoge1xyXG4gICAgW0RBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUXSgpIHtcclxuICAgICAgdmFsaWRhdGVEYXRlSW5wdXQodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0RBVEVfUElDS0VSXShldmVudCkge1xyXG4gICAgICBpZiAoIXRoaXMuY29udGFpbnMoZXZlbnQucmVsYXRlZFRhcmdldCkpIHtcclxuICAgICAgICBoaWRlQ2FsZW5kYXIodGhpcyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxuICBpbnB1dDoge1xyXG4gICAgW0RBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUXSgpIHtcclxuICAgICAgcmVjb25jaWxlSW5wdXRWYWx1ZXModGhpcyk7XHJcbiAgICAgIHVwZGF0ZUNhbGVuZGFySWZWaXNpYmxlKHRoaXMpO1xyXG4gICAgfSxcclxuICB9LFxyXG59O1xyXG5cclxuaWYgKCFpc0lvc0RldmljZSgpKSB7XHJcbiAgZGF0ZVBpY2tlckV2ZW50cy5tb3VzZW1vdmUgPSB7XHJcbiAgICBbQ0FMRU5EQVJfREFURV9DVVJSRU5UX01PTlRIXSgpIHtcclxuICAgICAgaGFuZGxlTW91c2Vtb3ZlRnJvbURhdGUodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX01PTlRIXSgpIHtcclxuICAgICAgaGFuZGxlTW91c2Vtb3ZlRnJvbU1vbnRoKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9ZRUFSXSgpIHtcclxuICAgICAgaGFuZGxlTW91c2Vtb3ZlRnJvbVllYXIodGhpcyk7XHJcbiAgICB9LFxyXG4gIH07XHJcbn1cclxuXHJcbmNvbnN0IGRhdGVQaWNrZXIgPSBiZWhhdmlvcihkYXRlUGlja2VyRXZlbnRzLCB7XHJcbiAgaW5pdChyb290KSB7XHJcbiAgICBzZWxlY3QoREFURV9QSUNLRVIsIHJvb3QpLmZvckVhY2goKGRhdGVQaWNrZXJFbCkgPT4ge1xyXG4gICAgICBpZighZGF0ZVBpY2tlckVsLmNsYXNzTGlzdC5jb250YWlucyhEQVRFX1BJQ0tFUl9JTklUSUFMSVpFRF9DTEFTUykpe1xyXG4gICAgICAgIGVuaGFuY2VEYXRlUGlja2VyKGRhdGVQaWNrZXJFbCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgc2V0TGFuZ3VhZ2Uoc3RyaW5ncykge1xyXG4gICAgdGV4dCA9IHN0cmluZ3M7XHJcbiAgICBNT05USF9MQUJFTFMgPSBbXHJcbiAgICAgIHRleHQuamFudWFyeSxcclxuICAgICAgdGV4dC5mZWJydWFyeSxcclxuICAgICAgdGV4dC5tYXJjaCxcclxuICAgICAgdGV4dC5hcHJpbCxcclxuICAgICAgdGV4dC5tYXksXHJcbiAgICAgIHRleHQuanVuZSxcclxuICAgICAgdGV4dC5qdWx5LFxyXG4gICAgICB0ZXh0LmF1Z3VzdCxcclxuICAgICAgdGV4dC5zZXB0ZW1iZXIsXHJcbiAgICAgIHRleHQub2N0b2JlcixcclxuICAgICAgdGV4dC5ub3ZlbWJlcixcclxuICAgICAgdGV4dC5kZWNlbWJlclxyXG4gICAgXTtcclxuICAgIERBWV9PRl9XRUVLX0xBQkVMUyA9IFtcclxuICAgICAgdGV4dC5tb25kYXksXHJcbiAgICAgIHRleHQudHVlc2RheSxcclxuICAgICAgdGV4dC53ZWRuZXNkYXksXHJcbiAgICAgIHRleHQudGh1cnNkYXksXHJcbiAgICAgIHRleHQuZnJpZGF5LFxyXG4gICAgICB0ZXh0LnNhdHVyZGF5LFxyXG4gICAgICB0ZXh0LnN1bmRheVxyXG4gICAgXTtcclxuICB9LFxyXG4gIGdldERhdGVQaWNrZXJDb250ZXh0LFxyXG4gIGRpc2FibGUsXHJcbiAgZW5hYmxlLFxyXG4gIGlzRGF0ZUlucHV0SW52YWxpZCxcclxuICBzZXRDYWxlbmRhclZhbHVlLFxyXG4gIHZhbGlkYXRlRGF0ZUlucHV0LFxyXG4gIHJlbmRlckNhbGVuZGFyLFxyXG4gIHVwZGF0ZUNhbGVuZGFySWZWaXNpYmxlXHJcbn0pO1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBEYXRlIFBpY2tlciBFdmVudCBEZWxlZ2F0aW9uIFJlZ2lzdHJhdGlvbiAvIENvbXBvbmVudFxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBkYXRlUGlja2VyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmltcG9ydCBEcm9wZG93biBmcm9tICcuL2Ryb3Bkb3duJztcclxuaW1wb3J0ICcuLi9wb2x5ZmlsbHMvRnVuY3Rpb24vcHJvdG90eXBlL2JpbmQnO1xyXG5cclxuLyoqXHJcbiAqIEFkZCBmdW5jdGlvbmFsaXR5IHRvIHNvcnRpbmcgdmFyaWFudCBvZiBPdmVyZmxvdyBtZW51IGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXIgLm92ZXJmbG93LW1lbnUgZWxlbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gRHJvcGRvd25Tb3J0IChjb250YWluZXIpe1xyXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICB0aGlzLmJ1dHRvbiA9IGNvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdidXR0b24tb3ZlcmZsb3ctbWVudScpWzBdO1xyXG5cclxuICAgIC8vIGlmIG5vIHZhbHVlIGlzIHNlbGVjdGVkLCBjaG9vc2UgZmlyc3Qgb3B0aW9uXHJcbiAgICBpZighdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignLm92ZXJmbG93LWxpc3QgbGkgYnV0dG9uW2FyaWEtY3VycmVudD1cInRydWVcIl0nKSl7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLm92ZXJmbG93LWxpc3QgbGkgYnV0dG9uJylbMF0uc2V0QXR0cmlidXRlKCdhcmlhLWN1cnJlbnQnLCBcInRydWVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy51cGRhdGVTZWxlY3RlZFZhbHVlKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGQgY2xpY2sgZXZlbnRzIG9uIG92ZXJmbG93IG1lbnUgYW5kIG9wdGlvbnMgaW4gbWVudVxyXG4gKi9cclxuRHJvcGRvd25Tb3J0LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMub3ZlcmZsb3dNZW51ID0gbmV3IERyb3Bkb3duKHRoaXMuYnV0dG9uKS5pbml0KCk7XHJcblxyXG4gICAgbGV0IHNvcnRpbmdPcHRpb25zID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLm92ZXJmbG93LWxpc3QgbGkgYnV0dG9uJyk7XHJcbiAgICBmb3IobGV0IHMgPSAwOyBzIDwgc29ydGluZ09wdGlvbnMubGVuZ3RoOyBzKyspe1xyXG4gICAgICAgIGxldCBvcHRpb24gPSBzb3J0aW5nT3B0aW9uc1tzXTtcclxuICAgICAgICBvcHRpb24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uT3B0aW9uQ2xpY2suYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVcGRhdGUgYnV0dG9uIHRleHQgdG8gc2VsZWN0ZWQgdmFsdWVcclxuICovXHJcbkRyb3Bkb3duU29ydC5wcm90b3R5cGUudXBkYXRlU2VsZWN0ZWRWYWx1ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICBsZXQgc2VsZWN0ZWRJdGVtID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignLm92ZXJmbG93LWxpc3QgbGkgYnV0dG9uW2FyaWEtY3VycmVudD1cInRydWVcIl0nKTtcclxuICAgIHRoaXMuY29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2J1dHRvbi1vdmVyZmxvdy1tZW51JylbMF0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2VsZWN0ZWQtdmFsdWUnKVswXS5pbm5lclRleHQgPSBzZWxlY3RlZEl0ZW0uaW5uZXJUZXh0O1xyXG59XHJcblxyXG4vKipcclxuICogVHJpZ2dlcnMgd2hlbiBjaG9vc2luZyBvcHRpb24gaW4gbWVudVxyXG4gKiBAcGFyYW0ge1BvaW50ZXJFdmVudH0gZVxyXG4gKi9cclxuRHJvcGRvd25Tb3J0LnByb3RvdHlwZS5vbk9wdGlvbkNsaWNrID0gZnVuY3Rpb24oZSl7XHJcbiAgICBsZXQgbGkgPSBlLnRhcmdldC5wYXJlbnROb2RlO1xyXG4gICAgbGkucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKCdsaSBidXR0b25bYXJpYS1jdXJyZW50PVwidHJ1ZVwiXScpLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1jdXJyZW50Jyk7XHJcbiAgICBsaS5xdWVyeVNlbGVjdG9yQWxsKCcub3ZlcmZsb3ctbGlzdCBsaSBidXR0b24nKVswXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtY3VycmVudCcsICd0cnVlJyk7XHJcblxyXG4gICAgbGV0IGJ1dHRvbiA9IGxpLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2J1dHRvbi1vdmVyZmxvdy1tZW51JylbMF07XHJcbiAgICBsZXQgZXZlbnRTZWxlY3RlZCA9IG5ldyBFdmVudCgnZmRzLmRyb3Bkb3duLnNlbGVjdGVkJyk7XHJcbiAgICBldmVudFNlbGVjdGVkLmRldGFpbCA9IHRoaXMudGFyZ2V0O1xyXG4gICAgYnV0dG9uLmRpc3BhdGNoRXZlbnQoZXZlbnRTZWxlY3RlZCk7XHJcbiAgICB0aGlzLnVwZGF0ZVNlbGVjdGVkVmFsdWUoKTtcclxuXHJcbiAgICAvLyBoaWRlIG1lbnVcclxuICAgIGxldCBvdmVyZmxvd01lbnUgPSBuZXcgRHJvcGRvd24oYnV0dG9uKTtcclxuICAgIG92ZXJmbG93TWVudS5oaWRlKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IERyb3Bkb3duU29ydDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBicmVha3BvaW50cyA9IHJlcXVpcmUoJy4uL3V0aWxzL2JyZWFrcG9pbnRzJyk7XHJcbmNvbnN0IEJVVFRPTiA9ICcuYnV0dG9uLW92ZXJmbG93LW1lbnUnO1xyXG5jb25zdCBqc0Ryb3Bkb3duQ29sbGFwc2VNb2RpZmllciA9ICdqcy1kcm9wZG93bi0tcmVzcG9uc2l2ZS1jb2xsYXBzZSc7IC8vb3B0aW9uOiBtYWtlIGRyb3Bkb3duIGJlaGF2ZSBhcyB0aGUgY29sbGFwc2UgY29tcG9uZW50IHdoZW4gb24gc21hbGwgc2NyZWVucyAodXNlZCBieSBzdWJtZW51cyBpbiB0aGUgaGVhZGVyIGFuZCBzdGVwLWRyb3Bkb3duKS5cclxuY29uc3QgVEFSR0VUID0gJ2RhdGEtanMtdGFyZ2V0JztcclxuXHJcbi8qKlxyXG4gKiBBZGQgZnVuY3Rpb25hbGl0eSB0byBvdmVyZmxvdyBtZW51IGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBidXR0b25FbGVtZW50IE92ZXJmbG93IG1lbnUgYnV0dG9uXHJcbiAqL1xyXG5mdW5jdGlvbiBEcm9wZG93biAoYnV0dG9uRWxlbWVudCkge1xyXG4gIHRoaXMuYnV0dG9uRWxlbWVudCA9IGJ1dHRvbkVsZW1lbnQ7XHJcbiAgdGhpcy50YXJnZXRFbCA9IG51bGw7XHJcbiAgdGhpcy5yZXNwb25zaXZlTGlzdENvbGxhcHNlRW5hYmxlZCA9IGZhbHNlO1xyXG5cclxuICBpZih0aGlzLmJ1dHRvbkVsZW1lbnQgPT09IG51bGwgfHx0aGlzLmJ1dHRvbkVsZW1lbnQgPT09IHVuZGVmaW5lZCl7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGJ1dHRvbiBmb3Igb3ZlcmZsb3cgbWVudSBjb21wb25lbnQuYCk7XHJcbiAgfVxyXG4gIGxldCB0YXJnZXRBdHRyID0gdGhpcy5idXR0b25FbGVtZW50LmdldEF0dHJpYnV0ZShUQVJHRVQpO1xyXG4gIGlmKHRhcmdldEF0dHIgPT09IG51bGwgfHwgdGFyZ2V0QXR0ciA9PT0gdW5kZWZpbmVkKXtcclxuICAgIHRocm93IG5ldyBFcnJvcignQXR0cmlidXRlIGNvdWxkIG5vdCBiZSBmb3VuZCBvbiBvdmVyZmxvdyBtZW51IGNvbXBvbmVudDogJytUQVJHRVQpO1xyXG4gIH1cclxuICBsZXQgdGFyZ2V0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRBdHRyLnJlcGxhY2UoJyMnLCAnJykpO1xyXG4gIGlmKHRhcmdldEVsID09PSBudWxsIHx8IHRhcmdldEVsID09PSB1bmRlZmluZWQpe1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdQYW5lbCBmb3Igb3ZlcmZsb3cgbWVudSBjb21wb25lbnQgY291bGQgbm90IGJlIGZvdW5kLicpO1xyXG4gIH1cclxuICB0aGlzLnRhcmdldEVsID0gdGFyZ2V0RWw7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgY2xpY2sgZXZlbnRzXHJcbiAqL1xyXG5Ecm9wZG93bi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpe1xyXG4gIGlmKHRoaXMuYnV0dG9uRWxlbWVudCAhPT0gbnVsbCAmJiB0aGlzLmJ1dHRvbkVsZW1lbnQgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnRhcmdldEVsICE9PSBudWxsICYmIHRoaXMudGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XHJcblxyXG4gICAgaWYodGhpcy5idXR0b25FbGVtZW50LnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1tZC1uby1yZXNwb25zaXZlJykgfHwgdGhpcy5idXR0b25FbGVtZW50LnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1sZy1uby1yZXNwb25zaXZlJykpe1xyXG4gICAgICB0aGlzLnJlc3BvbnNpdmVMaXN0Q29sbGFwc2VFbmFibGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvL0NsaWNrZWQgb3V0c2lkZSBkcm9wZG93biAtPiBjbG9zZSBpdFxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVsgMCBdLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3V0c2lkZUNsb3NlKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbIDAgXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG91dHNpZGVDbG9zZSk7XHJcbiAgICAvL0NsaWNrZWQgb24gZHJvcGRvd24gb3BlbiBidXR0b24gLS0+IHRvZ2dsZSBpdFxyXG4gICAgdGhpcy5idXR0b25FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlRHJvcGRvd24pO1xyXG4gICAgdGhpcy5idXR0b25FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlRHJvcGRvd24pO1xyXG4gICAgbGV0ICRtb2R1bGUgPSB0aGlzO1xyXG4gICAgLy8gc2V0IGFyaWEtaGlkZGVuIGNvcnJlY3RseSBmb3Igc2NyZWVucmVhZGVycyAoVHJpbmd1aWRlIHJlc3BvbnNpdmUpXHJcbiAgICBpZih0aGlzLnJlc3BvbnNpdmVMaXN0Q29sbGFwc2VFbmFibGVkKSB7XHJcbiAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5idXR0b25FbGVtZW50O1xyXG4gICAgICBpZiAod2luZG93LkludGVyc2VjdGlvbk9ic2VydmVyKSB7XHJcbiAgICAgICAgLy8gdHJpZ2dlciBldmVudCB3aGVuIGJ1dHRvbiBjaGFuZ2VzIHZpc2liaWxpdHlcclxuICAgICAgICBsZXQgb2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKGVudHJpZXMpIHtcclxuICAgICAgICAgIC8vIGJ1dHRvbiBpcyB2aXNpYmxlXHJcbiAgICAgICAgICBpZiAoZW50cmllc1sgMCBdLmludGVyc2VjdGlvblJhdGlvKSB7XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAnZmFsc2UnKSB7XHJcbiAgICAgICAgICAgICAgJG1vZHVsZS50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gYnV0dG9uIGlzIG5vdCB2aXNpYmxlXHJcbiAgICAgICAgICAgIGlmICgkbW9kdWxlLnRhcmdldEVsLmdldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKSA9PT0gJ3RydWUnKSB7XHJcbiAgICAgICAgICAgICAgJG1vZHVsZS50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICByb290OiBkb2N1bWVudC5ib2R5XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShlbGVtZW50KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBJRTogSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgaXMgbm90IHN1cHBvcnRlZCwgc28gd2UgbGlzdGVuIGZvciB3aW5kb3cgcmVzaXplIGFuZCBncmlkIGJyZWFrcG9pbnQgaW5zdGVhZFxyXG4gICAgICAgIGlmIChkb1Jlc3BvbnNpdmVDb2xsYXBzZSgkbW9kdWxlLnRyaWdnZXJFbCkpIHtcclxuICAgICAgICAgIC8vIHNtYWxsIHNjcmVlblxyXG4gICAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICdmYWxzZScpIHtcclxuICAgICAgICAgICAgJG1vZHVsZS50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICAgIH0gZWxzZXtcclxuICAgICAgICAgICAgJG1vZHVsZS50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIExhcmdlIHNjcmVlblxyXG4gICAgICAgICAgJG1vZHVsZS50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBpZiAoZG9SZXNwb25zaXZlQ29sbGFwc2UoJG1vZHVsZS50cmlnZ2VyRWwpKSB7XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAnZmFsc2UnKSB7XHJcbiAgICAgICAgICAgICAgJG1vZHVsZS50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBjbG9zZU9uRXNjYXBlKTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgY2xvc2VPbkVzY2FwZSk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogSGlkZSBvdmVyZmxvdyBtZW51XHJcbiAqL1xyXG5Ecm9wZG93bi5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdG9nZ2xlKHRoaXMuYnV0dG9uRWxlbWVudCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTaG93IG92ZXJmbG93IG1lbnVcclxuICovXHJcbkRyb3Bkb3duLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oKXtcclxuICB0b2dnbGUodGhpcy5idXR0b25FbGVtZW50KTtcclxufVxyXG5cclxubGV0IGNsb3NlT25Fc2NhcGUgPSBmdW5jdGlvbihldmVudCl7XHJcbiAgdmFyIGtleSA9IGV2ZW50LndoaWNoIHx8IGV2ZW50LmtleUNvZGU7XHJcbiAgaWYgKGtleSA9PT0gMjcpIHtcclxuICAgIGNsb3NlQWxsKGV2ZW50KTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IGFuIEFycmF5IG9mIGJ1dHRvbiBlbGVtZW50cyBiZWxvbmdpbmcgZGlyZWN0bHkgdG8gdGhlIGdpdmVuXHJcbiAqIGFjY29yZGlvbiBlbGVtZW50LlxyXG4gKiBAcGFyYW0gcGFyZW50IGFjY29yZGlvbiBlbGVtZW50XHJcbiAqIEByZXR1cm5zIHtOb2RlTGlzdE9mPFNWR0VsZW1lbnRUYWdOYW1lTWFwW1tzdHJpbmddXT4gfCBOb2RlTGlzdE9mPEhUTUxFbGVtZW50VGFnTmFtZU1hcFtbc3RyaW5nXV0+IHwgTm9kZUxpc3RPZjxFbGVtZW50Pn1cclxuICovXHJcbmxldCBnZXRCdXR0b25zID0gZnVuY3Rpb24gKHBhcmVudCkge1xyXG4gIHJldHVybiBwYXJlbnQucXVlcnlTZWxlY3RvckFsbChCVVRUT04pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENsb3NlIGFsbCBvdmVyZmxvdyBtZW51c1xyXG4gKiBAcGFyYW0ge2V2ZW50fSBldmVudCBkZWZhdWx0IGlzIG51bGxcclxuICovXHJcbmxldCBjbG9zZUFsbCA9IGZ1bmN0aW9uIChldmVudCA9IG51bGwpe1xyXG4gIGxldCBjaGFuZ2VkID0gZmFsc2U7XHJcbiAgY29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcclxuXHJcbiAgbGV0IG92ZXJmbG93TWVudUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnb3ZlcmZsb3ctbWVudScpO1xyXG4gIGZvciAobGV0IG9pID0gMDsgb2kgPCBvdmVyZmxvd01lbnVFbC5sZW5ndGg7IG9pKyspIHtcclxuICAgIGxldCBjdXJyZW50T3ZlcmZsb3dNZW51RUwgPSBvdmVyZmxvd01lbnVFbFsgb2kgXTtcclxuICAgIGxldCB0cmlnZ2VyRWwgPSBjdXJyZW50T3ZlcmZsb3dNZW51RUwucXVlcnlTZWxlY3RvcihCVVRUT04rJ1thcmlhLWV4cGFuZGVkPVwidHJ1ZVwiXScpO1xyXG4gICAgaWYodHJpZ2dlckVsICE9PSBudWxsKXtcclxuICAgICAgY2hhbmdlZCA9IHRydWU7XHJcbiAgICAgIGxldCB0YXJnZXRFbCA9IGN1cnJlbnRPdmVyZmxvd01lbnVFTC5xdWVyeVNlbGVjdG9yKCcjJyt0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKFRBUkdFVCkucmVwbGFjZSgnIycsICcnKSk7XHJcblxyXG4gICAgICAgIGlmICh0YXJnZXRFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IG51bGwpIHtcclxuICAgICAgICAgIGlmKGRvUmVzcG9uc2l2ZUNvbGxhcHNlKHRyaWdnZXJFbCkpe1xyXG4gICAgICAgICAgICBpZih0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09IHRydWUpe1xyXG4gICAgICAgICAgICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMuZHJvcGRvd24uY2xvc2UnKTtcclxuICAgICAgICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZihjaGFuZ2VkICYmIGV2ZW50ICE9PSBudWxsKXtcclxuICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gIH1cclxufTtcclxubGV0IG9mZnNldCA9IGZ1bmN0aW9uIChlbCkge1xyXG4gIGxldCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXHJcbiAgICBzY3JvbGxMZWZ0ID0gd2luZG93LnBhZ2VYT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0LFxyXG4gICAgc2Nyb2xsVG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XHJcbiAgcmV0dXJuIHsgdG9wOiByZWN0LnRvcCArIHNjcm9sbFRvcCwgbGVmdDogcmVjdC5sZWZ0ICsgc2Nyb2xsTGVmdCB9O1xyXG59O1xyXG5cclxubGV0IHRvZ2dsZURyb3Bkb3duID0gZnVuY3Rpb24gKGV2ZW50LCBmb3JjZUNsb3NlID0gZmFsc2UpIHtcclxuICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICB0b2dnbGUodGhpcywgZm9yY2VDbG9zZSk7XHJcblxyXG59O1xyXG5cclxubGV0IHRvZ2dsZSA9IGZ1bmN0aW9uKGJ1dHRvbiwgZm9yY2VDbG9zZSA9IGZhbHNlKXtcclxuICBsZXQgdHJpZ2dlckVsID0gYnV0dG9uO1xyXG4gIGxldCB0YXJnZXRFbCA9IG51bGw7XHJcbiAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkKXtcclxuICAgIGxldCB0YXJnZXRBdHRyID0gdHJpZ2dlckVsLmdldEF0dHJpYnV0ZShUQVJHRVQpO1xyXG4gICAgaWYodGFyZ2V0QXR0ciAhPT0gbnVsbCAmJiB0YXJnZXRBdHRyICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICB0YXJnZXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldEF0dHIucmVwbGFjZSgnIycsICcnKSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcclxuICAgIC8vY2hhbmdlIHN0YXRlXHJcblxyXG4gICAgdGFyZ2V0RWwuc3R5bGUubGVmdCA9IG51bGw7XHJcbiAgICB0YXJnZXRFbC5zdHlsZS5yaWdodCA9IG51bGw7XHJcblxyXG4gICAgaWYodHJpZ2dlckVsLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAndHJ1ZScgfHwgZm9yY2VDbG9zZSl7XHJcbiAgICAgIC8vY2xvc2VcclxuICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG4gICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcclxuICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7ICAgICAgXHJcbiAgICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMuZHJvcGRvd24uY2xvc2UnKTtcclxuICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgXHJcbiAgICAgIGlmKCFkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmNsYXNzTGlzdC5jb250YWlucygnbW9iaWxlX25hdi1hY3RpdmUnKSl7XHJcbiAgICAgICAgY2xvc2VBbGwoKTtcclxuICAgICAgfVxyXG4gICAgICAvL29wZW5cclxuICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XHJcbiAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgIGxldCBldmVudE9wZW4gPSBuZXcgRXZlbnQoJ2Zkcy5kcm9wZG93bi5vcGVuJyk7XHJcbiAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50T3Blbik7XHJcbiAgICAgIGxldCB0YXJnZXRPZmZzZXQgPSBvZmZzZXQodGFyZ2V0RWwpO1xyXG5cclxuICAgICAgaWYodGFyZ2V0T2Zmc2V0LmxlZnQgPCAwKXtcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJzBweCc7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUucmlnaHQgPSAnYXV0byc7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHJpZ2h0ID0gdGFyZ2V0T2Zmc2V0LmxlZnQgKyB0YXJnZXRFbC5vZmZzZXRXaWR0aDtcclxuICAgICAgaWYocmlnaHQgPiB3aW5kb3cuaW5uZXJXaWR0aCl7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUubGVmdCA9ICdhdXRvJztcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5yaWdodCA9ICcwcHgnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgb2Zmc2V0QWdhaW4gPSBvZmZzZXQodGFyZ2V0RWwpO1xyXG5cclxuICAgICAgaWYob2Zmc2V0QWdhaW4ubGVmdCA8IDApe1xyXG5cclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJzBweCc7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUucmlnaHQgPSAnYXV0byc7XHJcbiAgICAgIH1cclxuICAgICAgcmlnaHQgPSBvZmZzZXRBZ2Fpbi5sZWZ0ICsgdGFyZ2V0RWwub2Zmc2V0V2lkdGg7XHJcbiAgICAgIGlmKHJpZ2h0ID4gd2luZG93LmlubmVyV2lkdGgpe1xyXG5cclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJ2F1dG8nO1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gJzBweCc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgfVxyXG59XHJcblxyXG5sZXQgaGFzUGFyZW50ID0gZnVuY3Rpb24gKGNoaWxkLCBwYXJlbnRUYWdOYW1lKXtcclxuICBpZihjaGlsZC5wYXJlbnROb2RlLnRhZ05hbWUgPT09IHBhcmVudFRhZ05hbWUpe1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfSBlbHNlIGlmKHBhcmVudFRhZ05hbWUgIT09ICdCT0RZJyAmJiBjaGlsZC5wYXJlbnROb2RlLnRhZ05hbWUgIT09ICdCT0RZJyl7XHJcbiAgICByZXR1cm4gaGFzUGFyZW50KGNoaWxkLnBhcmVudE5vZGUsIHBhcmVudFRhZ05hbWUpO1xyXG4gIH1lbHNle1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuXHJcbmxldCBvdXRzaWRlQ2xvc2UgPSBmdW5jdGlvbiAoZXZ0KXtcclxuICBpZighZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5jbGFzc0xpc3QuY29udGFpbnMoJ21vYmlsZV9uYXYtYWN0aXZlJykpe1xyXG4gICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keS5tb2JpbGVfbmF2LWFjdGl2ZScpID09PSBudWxsICYmICFldnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYnV0dG9uLW1lbnUtY2xvc2UnKSkge1xyXG4gICAgICBsZXQgb3BlbkRyb3Bkb3ducyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKydbYXJpYS1leHBhbmRlZD10cnVlXScpO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wZW5Ecm9wZG93bnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgdHJpZ2dlckVsID0gb3BlbkRyb3Bkb3duc1tpXTtcclxuICAgICAgICBsZXQgdGFyZ2V0RWwgPSBudWxsO1xyXG4gICAgICAgIGxldCB0YXJnZXRBdHRyID0gdHJpZ2dlckVsLmdldEF0dHJpYnV0ZShUQVJHRVQpO1xyXG4gICAgICAgIGlmICh0YXJnZXRBdHRyICE9PSBudWxsICYmIHRhcmdldEF0dHIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgaWYodGFyZ2V0QXR0ci5pbmRleE9mKCcjJykgIT09IC0xKXtcclxuICAgICAgICAgICAgdGFyZ2V0QXR0ciA9IHRhcmdldEF0dHIucmVwbGFjZSgnIycsICcnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRhcmdldEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0QXR0cik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkb1Jlc3BvbnNpdmVDb2xsYXBzZSh0cmlnZ2VyRWwpIHx8IChoYXNQYXJlbnQodHJpZ2dlckVsLCAnSEVBREVSJykgJiYgIWV2dC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVybGF5JykpKSB7XHJcbiAgICAgICAgICAvL2Nsb3NlcyBkcm9wZG93biB3aGVuIGNsaWNrZWQgb3V0c2lkZVxyXG4gICAgICAgICAgaWYgKGV2dC50YXJnZXQgIT09IHRyaWdnZXJFbCkge1xyXG4gICAgICAgICAgICAvL2NsaWNrZWQgb3V0c2lkZSB0cmlnZ2VyLCBmb3JjZSBjbG9zZVxyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTsgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMuZHJvcGRvd24uY2xvc2UnKTtcclxuICAgICAgICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxubGV0IGRvUmVzcG9uc2l2ZUNvbGxhcHNlID0gZnVuY3Rpb24gKHRyaWdnZXJFbCl7XHJcbiAgaWYoIXRyaWdnZXJFbC5jbGFzc0xpc3QuY29udGFpbnMoanNEcm9wZG93bkNvbGxhcHNlTW9kaWZpZXIpKXtcclxuICAgIC8vIG5vdCBuYXYgb3ZlcmZsb3cgbWVudVxyXG4gICAgaWYodHJpZ2dlckVsLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1tZC1uby1yZXNwb25zaXZlJykgfHwgdHJpZ2dlckVsLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1sZy1uby1yZXNwb25zaXZlJykpIHtcclxuICAgICAgLy8gdHJpbmluZGlrYXRvciBvdmVyZmxvdyBtZW51XHJcbiAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8PSBnZXRUcmluZ3VpZGVCcmVha3BvaW50KHRyaWdnZXJFbCkpIHtcclxuICAgICAgICAvLyBvdmVyZmxvdyBtZW51IHDDpSByZXNwb25zaXYgdHJpbmd1aWRlIGFrdGl2ZXJldFxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2V7XHJcbiAgICAgIC8vIG5vcm1hbCBvdmVyZmxvdyBtZW51XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxubGV0IGdldFRyaW5ndWlkZUJyZWFrcG9pbnQgPSBmdW5jdGlvbiAoYnV0dG9uKXtcclxuICBpZihidXR0b24ucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLW1kLW5vLXJlc3BvbnNpdmUnKSl7XHJcbiAgICByZXR1cm4gYnJlYWtwb2ludHMubWQ7XHJcbiAgfVxyXG4gIGlmKGJ1dHRvbi5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbGctbm8tcmVzcG9uc2l2ZScpKXtcclxuICAgIHJldHVybiBicmVha3BvaW50cy5sZztcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEcm9wZG93bjsiLCIndXNlIHN0cmljdCc7XHJcbi8qKlxyXG4gKiBIYW5kbGUgZm9jdXMgb24gaW5wdXQgZWxlbWVudHMgdXBvbiBjbGlja2luZyBsaW5rIGluIGVycm9yIG1lc3NhZ2VcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBFcnJvciBzdW1tYXJ5IGVsZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIEVycm9yU3VtbWFyeSAoZWxlbWVudCkge1xyXG4gIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRzIG9uIGxpbmtzIGluIGVycm9yIHN1bW1hcnlcclxuICovXHJcbkVycm9yU3VtbWFyeS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICBpZiAoIXRoaXMuZWxlbWVudCkge1xyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG4gIHRoaXMuZWxlbWVudC5mb2N1cygpXHJcblxyXG4gIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKSlcclxufVxyXG5cclxuLyoqXHJcbiogQ2xpY2sgZXZlbnQgaGFuZGxlclxyXG4qXHJcbiogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCAtIENsaWNrIGV2ZW50XHJcbiovXHJcbkVycm9yU3VtbWFyeS5wcm90b3R5cGUuaGFuZGxlQ2xpY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0XHJcbiAgaWYgKHRoaXMuZm9jdXNUYXJnZXQodGFyZ2V0KSkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEZvY3VzIHRoZSB0YXJnZXQgZWxlbWVudFxyXG4gKlxyXG4gKiBCeSBkZWZhdWx0LCB0aGUgYnJvd3NlciB3aWxsIHNjcm9sbCB0aGUgdGFyZ2V0IGludG8gdmlldy4gQmVjYXVzZSBvdXIgbGFiZWxzXHJcbiAqIG9yIGxlZ2VuZHMgYXBwZWFyIGFib3ZlIHRoZSBpbnB1dCwgdGhpcyBtZWFucyB0aGUgdXNlciB3aWxsIGJlIHByZXNlbnRlZCB3aXRoXHJcbiAqIGFuIGlucHV0IHdpdGhvdXQgYW55IGNvbnRleHQsIGFzIHRoZSBsYWJlbCBvciBsZWdlbmQgd2lsbCBiZSBvZmYgdGhlIHRvcCBvZlxyXG4gKiB0aGUgc2NyZWVuLlxyXG4gKlxyXG4gKiBNYW51YWxseSBoYW5kbGluZyB0aGUgY2xpY2sgZXZlbnQsIHNjcm9sbGluZyB0aGUgcXVlc3Rpb24gaW50byB2aWV3IGFuZCB0aGVuXHJcbiAqIGZvY3Vzc2luZyB0aGUgZWxlbWVudCBzb2x2ZXMgdGhpcy5cclxuICpcclxuICogVGhpcyBhbHNvIHJlc3VsdHMgaW4gdGhlIGxhYmVsIGFuZC9vciBsZWdlbmQgYmVpbmcgYW5ub3VuY2VkIGNvcnJlY3RseSBpblxyXG4gKiBOVkRBIChhcyB0ZXN0ZWQgaW4gMjAxOC4zLjIpIC0gd2l0aG91dCB0aGlzIG9ubHkgdGhlIGZpZWxkIHR5cGUgaXMgYW5ub3VuY2VkXHJcbiAqIChlLmcuIFwiRWRpdCwgaGFzIGF1dG9jb21wbGV0ZVwiKS5cclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gJHRhcmdldCAtIEV2ZW50IHRhcmdldFxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdGFyZ2V0IHdhcyBhYmxlIHRvIGJlIGZvY3Vzc2VkXHJcbiAqL1xyXG5FcnJvclN1bW1hcnkucHJvdG90eXBlLmZvY3VzVGFyZ2V0ID0gZnVuY3Rpb24gKCR0YXJnZXQpIHtcclxuICAvLyBJZiB0aGUgZWxlbWVudCB0aGF0IHdhcyBjbGlja2VkIHdhcyBub3QgYSBsaW5rLCByZXR1cm4gZWFybHlcclxuICBpZiAoJHRhcmdldC50YWdOYW1lICE9PSAnQScgfHwgJHRhcmdldC5ocmVmID09PSBmYWxzZSkge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICB2YXIgaW5wdXRJZCA9IHRoaXMuZ2V0RnJhZ21lbnRGcm9tVXJsKCR0YXJnZXQuaHJlZilcclxuICB2YXIgJGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW5wdXRJZClcclxuICBpZiAoISRpbnB1dCkge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICB2YXIgJGxlZ2VuZE9yTGFiZWwgPSB0aGlzLmdldEFzc29jaWF0ZWRMZWdlbmRPckxhYmVsKCRpbnB1dClcclxuICBpZiAoISRsZWdlbmRPckxhYmVsKSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcblxyXG4gIC8vIFNjcm9sbCB0aGUgbGVnZW5kIG9yIGxhYmVsIGludG8gdmlldyAqYmVmb3JlKiBjYWxsaW5nIGZvY3VzIG9uIHRoZSBpbnB1dCB0b1xyXG4gIC8vIGF2b2lkIGV4dHJhIHNjcm9sbGluZyBpbiBicm93c2VycyB0aGF0IGRvbid0IHN1cHBvcnQgYHByZXZlbnRTY3JvbGxgICh3aGljaFxyXG4gIC8vIGF0IHRpbWUgb2Ygd3JpdGluZyBpcyBtb3N0IG9mIHRoZW0uLi4pXHJcbiAgJGxlZ2VuZE9yTGFiZWwuc2Nyb2xsSW50b1ZpZXcoKVxyXG4gICRpbnB1dC5mb2N1cyh7IHByZXZlbnRTY3JvbGw6IHRydWUgfSlcclxuXHJcbiAgcmV0dXJuIHRydWVcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBmcmFnbWVudCBmcm9tIFVSTFxyXG4gKlxyXG4gKiBFeHRyYWN0IHRoZSBmcmFnbWVudCAoZXZlcnl0aGluZyBhZnRlciB0aGUgaGFzaCkgZnJvbSBhIFVSTCwgYnV0IG5vdCBpbmNsdWRpbmdcclxuICogdGhlIGhhc2guXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBVUkxcclxuICogQHJldHVybnMge3N0cmluZ30gRnJhZ21lbnQgZnJvbSBVUkwsIHdpdGhvdXQgdGhlIGhhc2hcclxuICovXHJcbkVycm9yU3VtbWFyeS5wcm90b3R5cGUuZ2V0RnJhZ21lbnRGcm9tVXJsID0gZnVuY3Rpb24gKHVybCkge1xyXG4gIGlmICh1cmwuaW5kZXhPZignIycpID09PSAtMSkge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICByZXR1cm4gdXJsLnNwbGl0KCcjJykucG9wKClcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBhc3NvY2lhdGVkIGxlZ2VuZCBvciBsYWJlbFxyXG4gKlxyXG4gKiBSZXR1cm5zIHRoZSBmaXJzdCBlbGVtZW50IHRoYXQgZXhpc3RzIGZyb20gdGhpcyBsaXN0OlxyXG4gKlxyXG4gKiAtIFRoZSBgPGxlZ2VuZD5gIGFzc29jaWF0ZWQgd2l0aCB0aGUgY2xvc2VzdCBgPGZpZWxkc2V0PmAgYW5jZXN0b3IsIGFzIGxvbmdcclxuICogICBhcyB0aGUgdG9wIG9mIGl0IGlzIG5vIG1vcmUgdGhhbiBoYWxmIGEgdmlld3BvcnQgaGVpZ2h0IGF3YXkgZnJvbSB0aGVcclxuICogICBib3R0b20gb2YgdGhlIGlucHV0XHJcbiAqIC0gVGhlIGZpcnN0IGA8bGFiZWw+YCB0aGF0IGlzIGFzc29jaWF0ZWQgd2l0aCB0aGUgaW5wdXQgdXNpbmcgZm9yPVwiaW5wdXRJZFwiXHJcbiAqIC0gVGhlIGNsb3Nlc3QgcGFyZW50IGA8bGFiZWw+YFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAkaW5wdXQgLSBUaGUgaW5wdXRcclxuICogQHJldHVybnMge0hUTUxFbGVtZW50fSBBc3NvY2lhdGVkIGxlZ2VuZCBvciBsYWJlbCwgb3IgbnVsbCBpZiBubyBhc3NvY2lhdGVkXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgbGVnZW5kIG9yIGxhYmVsIGNhbiBiZSBmb3VuZFxyXG4gKi9cclxuRXJyb3JTdW1tYXJ5LnByb3RvdHlwZS5nZXRBc3NvY2lhdGVkTGVnZW5kT3JMYWJlbCA9IGZ1bmN0aW9uICgkaW5wdXQpIHtcclxuICB2YXIgJGZpZWxkc2V0ID0gJGlucHV0LmNsb3Nlc3QoJ2ZpZWxkc2V0JylcclxuXHJcbiAgaWYgKCRmaWVsZHNldCkge1xyXG4gICAgdmFyIGxlZ2VuZHMgPSAkZmllbGRzZXQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xlZ2VuZCcpXHJcblxyXG4gICAgaWYgKGxlZ2VuZHMubGVuZ3RoKSB7XHJcbiAgICAgIHZhciAkY2FuZGlkYXRlTGVnZW5kID0gbGVnZW5kc1swXVxyXG5cclxuICAgICAgLy8gSWYgdGhlIGlucHV0IHR5cGUgaXMgcmFkaW8gb3IgY2hlY2tib3gsIGFsd2F5cyB1c2UgdGhlIGxlZ2VuZCBpZiB0aGVyZVxyXG4gICAgICAvLyBpcyBvbmUuXHJcbiAgICAgIGlmICgkaW5wdXQudHlwZSA9PT0gJ2NoZWNrYm94JyB8fCAkaW5wdXQudHlwZSA9PT0gJ3JhZGlvJykge1xyXG4gICAgICAgIHJldHVybiAkY2FuZGlkYXRlTGVnZW5kXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEZvciBvdGhlciBpbnB1dCB0eXBlcywgb25seSBzY3JvbGwgdG8gdGhlIGZpZWxkc2V04oCZcyBsZWdlbmQgKGluc3RlYWQgb2ZcclxuICAgICAgLy8gdGhlIGxhYmVsIGFzc29jaWF0ZWQgd2l0aCB0aGUgaW5wdXQpIGlmIHRoZSBpbnB1dCB3b3VsZCBlbmQgdXAgaW4gdGhlXHJcbiAgICAgIC8vIHRvcCBoYWxmIG9mIHRoZSBzY3JlZW4uXHJcbiAgICAgIC8vXHJcbiAgICAgIC8vIFRoaXMgc2hvdWxkIGF2b2lkIHNpdHVhdGlvbnMgd2hlcmUgdGhlIGlucHV0IGVpdGhlciBlbmRzIHVwIG9mZiB0aGVcclxuICAgICAgLy8gc2NyZWVuLCBvciBvYnNjdXJlZCBieSBhIHNvZnR3YXJlIGtleWJvYXJkLlxyXG4gICAgICB2YXIgbGVnZW5kVG9wID0gJGNhbmRpZGF0ZUxlZ2VuZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3BcclxuICAgICAgdmFyIGlucHV0UmVjdCA9ICRpbnB1dC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG5cclxuICAgICAgLy8gSWYgdGhlIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0XHJcbiAgICAgIC8vIG9yIHdpbmRvdy5pbm5lckhlaWdodCAobGlrZSBJRTgpLCBiYWlsIGFuZCBqdXN0IGxpbmsgdG8gdGhlIGxhYmVsLlxyXG4gICAgICBpZiAoaW5wdXRSZWN0LmhlaWdodCAmJiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcclxuICAgICAgICB2YXIgaW5wdXRCb3R0b20gPSBpbnB1dFJlY3QudG9wICsgaW5wdXRSZWN0LmhlaWdodFxyXG5cclxuICAgICAgICBpZiAoaW5wdXRCb3R0b20gLSBsZWdlbmRUb3AgPCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSB7XHJcbiAgICAgICAgICByZXR1cm4gJGNhbmRpZGF0ZUxlZ2VuZFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJsYWJlbFtmb3I9J1wiICsgJGlucHV0LmdldEF0dHJpYnV0ZSgnaWQnKSArIFwiJ11cIikgfHxcclxuICAgICRpbnB1dC5jbG9zZXN0KCdsYWJlbCcpXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEVycm9yU3VtbWFyeTsiLCIndXNlIHN0cmljdCc7XHJcbi8qKlxyXG4gKiBBZGRzIGNsaWNrIGZ1bmN0aW9uYWxpdHkgdG8gbW9kYWxcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gJG1vZGFsIE1vZGFsIGVsZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIE1vZGFsICgkbW9kYWwpIHtcclxuICAgIHRoaXMuJG1vZGFsID0gJG1vZGFsO1xyXG4gICAgbGV0IGlkID0gdGhpcy4kbW9kYWwuZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG4gICAgdGhpcy50cmlnZ2VycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW1vZHVsZT1cIm1vZGFsXCJdW2RhdGEtdGFyZ2V0PVwiJytpZCsnXCJdJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRzXHJcbiAqL1xyXG5Nb2RhbC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgdHJpZ2dlcnMgPSB0aGlzLnRyaWdnZXJzO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdHJpZ2dlcnMubGVuZ3RoOyBpKyspe1xyXG4gICAgbGV0IHRyaWdnZXIgPSB0cmlnZ2Vyc1sgaSBdO1xyXG4gICAgdHJpZ2dlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuc2hvdy5iaW5kKHRoaXMpKTtcclxuICB9XHJcbiAgbGV0IGNsb3NlcnMgPSB0aGlzLiRtb2RhbC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2RhbC1jbG9zZV0nKTtcclxuICBmb3IgKGxldCBjID0gMDsgYyA8IGNsb3NlcnMubGVuZ3RoOyBjKyspe1xyXG4gICAgbGV0IGNsb3NlciA9IGNsb3NlcnNbIGMgXTtcclxuICAgIGNsb3Nlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZS5iaW5kKHRoaXMpKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogSGlkZSBtb2RhbFxyXG4gKi9cclxuTW9kYWwucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKXtcclxuICBsZXQgbW9kYWxFbGVtZW50ID0gdGhpcy4kbW9kYWw7XHJcbiAgaWYobW9kYWxFbGVtZW50ICE9PSBudWxsKXtcclxuICAgIG1vZGFsRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuXHJcbiAgICBsZXQgZXZlbnRDbG9zZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG4gICAgZXZlbnRDbG9zZS5pbml0RXZlbnQoJ2Zkcy5tb2RhbC5oaWRkZW4nLCB0cnVlLCB0cnVlKTtcclxuICAgIG1vZGFsRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG5cclxuICAgIGxldCAkYmFja2Ryb3AgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbW9kYWwtYmFja2Ryb3AnKTtcclxuICAgICRiYWNrZHJvcD8ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCgkYmFja2Ryb3ApO1xyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtb3BlbicpO1xyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRyYXBGb2N1cywgdHJ1ZSk7XHJcblxyXG4gICAgaWYoIWhhc0ZvcmNlZEFjdGlvbihtb2RhbEVsZW1lbnQpKXtcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVFc2NhcGUpO1xyXG4gICAgfVxyXG4gICAgbGV0IGRhdGFNb2RhbE9wZW5lciA9IG1vZGFsRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbW9kYWwtb3BlbmVyJyk7XHJcbiAgICBpZihkYXRhTW9kYWxPcGVuZXIgIT09IG51bGwpe1xyXG4gICAgICBsZXQgb3BlbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZGF0YU1vZGFsT3BlbmVyKVxyXG4gICAgICBpZihvcGVuZXIgIT09IG51bGwpe1xyXG4gICAgICAgIG9wZW5lci5mb2N1cygpO1xyXG4gICAgICB9XHJcbiAgICAgIG1vZGFsRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtbW9kYWwtb3BlbmVyJyk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNob3cgbW9kYWxcclxuICovXHJcbk1vZGFsLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKGUgPSBudWxsKXtcclxuICBsZXQgbW9kYWxFbGVtZW50ID0gdGhpcy4kbW9kYWw7XHJcbiAgaWYobW9kYWxFbGVtZW50ICE9PSBudWxsKXtcclxuICAgIGlmKGUgIT09IG51bGwpe1xyXG4gICAgICBsZXQgb3BlbmVySWQgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcbiAgICAgIGlmKG9wZW5lcklkID09PSBudWxsKXtcclxuICAgICAgICBvcGVuZXJJZCA9ICdtb2RhbC1vcGVuZXItJytNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoOTk5OSAtIDEwMDAgKyAxKSArIDEwMDApO1xyXG4gICAgICAgIGUudGFyZ2V0LnNldEF0dHJpYnV0ZSgnaWQnLCBvcGVuZXJJZClcclxuICAgICAgfVxyXG4gICAgICBtb2RhbEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLW1vZGFsLW9wZW5lcicsIG9wZW5lcklkKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBIaWRlIG9wZW4gbW9kYWxzIC0gRkRTIGRvIG5vdCByZWNvbW1lbmQgbW9yZSB0aGFuIG9uZSBvcGVuIG1vZGFsIGF0IGEgdGltZVxyXG4gICAgbGV0IGFjdGl2ZU1vZGFscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5mZHMtbW9kYWxbYXJpYS1oaWRkZW49ZmFsc2VdJyk7XHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYWN0aXZlTW9kYWxzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgbmV3IE1vZGFsKGFjdGl2ZU1vZGFsc1tpXSkuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG1vZGFsRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICBtb2RhbEVsZW1lbnQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xyXG5cclxuICAgIGxldCBldmVudE9wZW4gPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICAgIGV2ZW50T3Blbi5pbml0RXZlbnQoJ2Zkcy5tb2RhbC5zaG93bicsIHRydWUsIHRydWUpO1xyXG4gICAgbW9kYWxFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRPcGVuKTtcclxuXHJcbiAgICBsZXQgJGJhY2tkcm9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAkYmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnbW9kYWwtYmFja2Ryb3AnKTtcclxuICAgICRiYWNrZHJvcC5zZXRBdHRyaWJ1dGUoJ2lkJywgXCJtb2RhbC1iYWNrZHJvcFwiKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQoJGJhY2tkcm9wKTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmNsYXNzTGlzdC5hZGQoJ21vZGFsLW9wZW4nKTtcclxuXHJcbiAgICBtb2RhbEVsZW1lbnQuZm9jdXMoKTtcclxuXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdHJhcEZvY3VzLCB0cnVlKTtcclxuICAgIGlmKCFoYXNGb3JjZWRBY3Rpb24obW9kYWxFbGVtZW50KSl7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlRXNjYXBlKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENsb3NlIG1vZGFsIHdoZW4gaGl0dGluZyBFU0NcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCBcclxuICovXHJcbmxldCBoYW5kbGVFc2NhcGUgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICB2YXIga2V5ID0gZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZTtcclxuICBsZXQgbW9kYWxFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZkcy1tb2RhbFthcmlhLWhpZGRlbj1mYWxzZV0nKTtcclxuICBsZXQgY3VycmVudE1vZGFsID0gbmV3IE1vZGFsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mZHMtbW9kYWxbYXJpYS1oaWRkZW49ZmFsc2VdJykpO1xyXG4gIGlmIChrZXkgPT09IDI3KXtcclxuICAgIGxldCBwb3NzaWJsZU92ZXJmbG93TWVudXMgPSBtb2RhbEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJ1dHRvbi1vdmVyZmxvdy1tZW51W2FyaWEtZXhwYW5kZWQ9XCJ0cnVlXCJdJyk7XHJcbiAgICBpZihwb3NzaWJsZU92ZXJmbG93TWVudXMubGVuZ3RoID09PSAwKXtcclxuICAgICAgY3VycmVudE1vZGFsLmhpZGUoKTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogVHJhcCBmb2N1cyBpbiBtb2RhbCB3aGVuIG9wZW5cclxuICogQHBhcmFtIHtQb2ludGVyRXZlbnR9IGVcclxuICovXHJcbiBmdW5jdGlvbiB0cmFwRm9jdXMoZSl7XHJcbiAgdmFyIGN1cnJlbnREaWFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmRzLW1vZGFsW2FyaWEtaGlkZGVuPWZhbHNlXScpO1xyXG4gIGlmKGN1cnJlbnREaWFsb2cgIT09IG51bGwpe1xyXG4gICAgdmFyIGZvY3VzYWJsZUVsZW1lbnRzID0gY3VycmVudERpYWxvZy5xdWVyeVNlbGVjdG9yQWxsKCdhW2hyZWZdOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuPXRydWVdKSwgYnV0dG9uOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuPXRydWVdKSwgdGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pLCBpbnB1dDpub3QoW3R5cGU9aGlkZGVuXSk6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pLCBzZWxlY3Q6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pLCBkZXRhaWxzOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuPXRydWVdKSwgW3RhYmluZGV4XTpub3QoW3RhYmluZGV4PVwiLTFcIl0pOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuPXRydWVdKScpO1xyXG4gICAgXHJcbiAgICB2YXIgZmlyc3RGb2N1c2FibGVFbGVtZW50ID0gZm9jdXNhYmxlRWxlbWVudHNbMF07XHJcbiAgICB2YXIgbGFzdEZvY3VzYWJsZUVsZW1lbnQgPSBmb2N1c2FibGVFbGVtZW50c1tmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxXTtcclxuXHJcbiAgICB2YXIgaXNUYWJQcmVzc2VkID0gKGUua2V5ID09PSAnVGFiJyB8fCBlLmtleUNvZGUgPT09IDkpO1xyXG5cclxuICAgIGlmICghaXNUYWJQcmVzc2VkKSB7IFxyXG4gICAgICByZXR1cm47IFxyXG4gICAgfVxyXG5cclxuICAgIGlmICggZS5zaGlmdEtleSApIC8qIHNoaWZ0ICsgdGFiICovIHtcclxuICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGZpcnN0Rm9jdXNhYmxlRWxlbWVudCkge1xyXG4gICAgICAgIGxhc3RGb2N1c2FibGVFbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSAvKiB0YWIgKi8ge1xyXG4gICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gbGFzdEZvY3VzYWJsZUVsZW1lbnQpIHtcclxuICAgICAgICBmaXJzdEZvY3VzYWJsZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbmZ1bmN0aW9uIGhhc0ZvcmNlZEFjdGlvbiAobW9kYWwpe1xyXG4gIGlmKG1vZGFsLmdldEF0dHJpYnV0ZSgnZGF0YS1tb2RhbC1mb3JjZWQtYWN0aW9uJykgPT09IG51bGwpe1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuICByZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTW9kYWw7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgZm9yRWFjaCA9IHJlcXVpcmUoJ2FycmF5LWZvcmVhY2gnKTtcclxuY29uc3Qgc2VsZWN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvc2VsZWN0Jyk7XHJcblxyXG5jb25zdCBOQVYgPSBgLm5hdmA7XHJcbmNvbnN0IE5BVl9MSU5LUyA9IGAke05BVn0gYWA7XHJcbmNvbnN0IE9QRU5FUlMgPSBgLmpzLW1lbnUtb3BlbmA7XHJcbmNvbnN0IENMT1NFX0JVVFRPTiA9IGAuanMtbWVudS1jbG9zZWA7XHJcbmNvbnN0IE9WRVJMQVkgPSBgLm92ZXJsYXlgO1xyXG5jb25zdCBDTE9TRVJTID0gYCR7Q0xPU0VfQlVUVE9OfSwgLm92ZXJsYXlgO1xyXG5jb25zdCBUT0dHTEVTID0gWyBOQVYsIE9WRVJMQVkgXS5qb2luKCcsICcpO1xyXG5cclxuY29uc3QgQUNUSVZFX0NMQVNTID0gJ21vYmlsZV9uYXYtYWN0aXZlJztcclxuY29uc3QgVklTSUJMRV9DTEFTUyA9ICdpcy12aXNpYmxlJztcclxuXHJcbi8qKlxyXG4gKiBBZGQgbW9iaWxlIG1lbnUgZnVuY3Rpb25hbGl0eVxyXG4gKi9cclxuY2xhc3MgTmF2aWdhdGlvbiB7XHJcbiAgLyoqXHJcbiAgICogU2V0IGV2ZW50c1xyXG4gICAqL1xyXG4gIGluaXQgKCkge1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIG1vYmlsZU1lbnUsIGZhbHNlKTtcclxuICAgIG1vYmlsZU1lbnUoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZSBldmVudHNcclxuICAgKi9cclxuICB0ZWFyZG93biAoKSB7XHJcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgbW9iaWxlTWVudSwgZmFsc2UpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZCBmdW5jdGlvbmFsaXR5IHRvIG1vYmlsZSBtZW51XHJcbiAqL1xyXG5jb25zdCBtb2JpbGVNZW51ID0gZnVuY3Rpb24oKSB7XHJcbiAgbGV0IG1vYmlsZSA9IGZhbHNlO1xyXG4gIGxldCBvcGVuZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChPUEVORVJTKTtcclxuICBmb3IobGV0IG8gPSAwOyBvIDwgb3BlbmVycy5sZW5ndGg7IG8rKykge1xyXG4gICAgaWYod2luZG93LmdldENvbXB1dGVkU3R5bGUob3BlbmVyc1tvXSwgbnVsbCkuZGlzcGxheSAhPT0gJ25vbmUnKSB7XHJcbiAgICAgIG9wZW5lcnNbb10uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVOYXYpO1xyXG4gICAgICBtb2JpbGUgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gaWYgbW9iaWxlXHJcbiAgaWYobW9iaWxlKXtcclxuICAgIGxldCBjbG9zZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChDTE9TRVJTKTtcclxuICAgIGZvcihsZXQgYyA9IDA7IGMgPCBjbG9zZXJzLmxlbmd0aDsgYysrKSB7XHJcbiAgICAgIGNsb3NlcnNbIGMgXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZU5hdik7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG5hdkxpbmtzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChOQVZfTElOS1MpO1xyXG4gICAgZm9yKGxldCBuID0gMDsgbiA8IG5hdkxpbmtzLmxlbmd0aDsgbisrKSB7XHJcbiAgICAgIG5hdkxpbmtzWyBuIF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIC8vIEEgbmF2aWdhdGlvbiBsaW5rIGhhcyBiZWVuIGNsaWNrZWQhIFdlIHdhbnQgdG8gY29sbGFwc2UgYW55XHJcbiAgICAgICAgLy8gaGllcmFyY2hpY2FsIG5hdmlnYXRpb24gVUkgaXQncyBhIHBhcnQgb2YsIHNvIHRoYXQgdGhlIHVzZXJcclxuICAgICAgICAvLyBjYW4gZm9jdXMgb24gd2hhdGV2ZXIgdGhleSd2ZSBqdXN0IHNlbGVjdGVkLlxyXG5cclxuICAgICAgICAvLyBTb21lIG5hdmlnYXRpb24gbGlua3MgYXJlIGluc2lkZSBkcm9wZG93bnM7IHdoZW4gdGhleSdyZVxyXG4gICAgICAgIC8vIGNsaWNrZWQsIHdlIHdhbnQgdG8gY29sbGFwc2UgdGhvc2UgZHJvcGRvd25zLlxyXG5cclxuXHJcbiAgICAgICAgLy8gSWYgdGhlIG1vYmlsZSBuYXZpZ2F0aW9uIG1lbnUgaXMgYWN0aXZlLCB3ZSB3YW50IHRvIGhpZGUgaXQuXHJcbiAgICAgICAgaWYgKGlzQWN0aXZlKCkpIHtcclxuICAgICAgICAgIHRvZ2dsZU5hdi5jYWxsKHRoaXMsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRyYXBDb250YWluZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChOQVYpO1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRyYXBDb250YWluZXJzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgZm9jdXNUcmFwID0gX2ZvY3VzVHJhcCh0cmFwQ29udGFpbmVyc1tpXSk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgY29uc3QgY2xvc2VyID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKENMT1NFX0JVVFRPTik7XHJcblxyXG4gIGlmIChpc0FjdGl2ZSgpICYmIGNsb3NlciAmJiBjbG9zZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggPT09IDApIHtcclxuICAgIC8vIFRoZSBtb2JpbGUgbmF2IGlzIGFjdGl2ZSwgYnV0IHRoZSBjbG9zZSBib3ggaXNuJ3QgdmlzaWJsZSwgd2hpY2hcclxuICAgIC8vIG1lYW5zIHRoZSB1c2VyJ3Mgdmlld3BvcnQgaGFzIGJlZW4gcmVzaXplZCBzbyB0aGF0IGl0IGlzIG5vIGxvbmdlclxyXG4gICAgLy8gaW4gbW9iaWxlIG1vZGUuIExldCdzIG1ha2UgdGhlIHBhZ2Ugc3RhdGUgY29uc2lzdGVudCBieVxyXG4gICAgLy8gZGVhY3RpdmF0aW5nIHRoZSBtb2JpbGUgbmF2LlxyXG4gICAgdG9nZ2xlTmF2LmNhbGwoY2xvc2VyLCBmYWxzZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIG1vYmlsZSBtZW51IGlzIGFjdGl2ZVxyXG4gKiBAcmV0dXJucyB0cnVlIGlmIG1vYmlsZSBtZW51IGlzIGFjdGl2ZSBhbmQgZmFsc2UgaWYgbm90IGFjdGl2ZVxyXG4gKi9cclxuY29uc3QgaXNBY3RpdmUgPSAoKSA9PiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhBQ1RJVkVfQ0xBU1MpO1xyXG5cclxuLyoqXHJcbiAqIFRyYXAgZm9jdXMgaW4gbW9iaWxlIG1lbnUgaWYgYWN0aXZlXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRyYXBDb250YWluZXIgXHJcbiAqL1xyXG5jb25zdCBfZm9jdXNUcmFwID0gKHRyYXBDb250YWluZXIpID0+IHtcclxuXHJcbiAgLy8gRmluZCBhbGwgZm9jdXNhYmxlIGNoaWxkcmVuXHJcbiAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcgPSAnYVtocmVmXSwgYXJlYVtocmVmXSwgaW5wdXQ6bm90KFtkaXNhYmxlZF0pLCBzZWxlY3Q6bm90KFtkaXNhYmxlZF0pLCB0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSksIGJ1dHRvbjpub3QoW2Rpc2FibGVkXSksIGlmcmFtZSwgb2JqZWN0LCBlbWJlZCwgW3RhYmluZGV4PVwiMFwiXSwgW2NvbnRlbnRlZGl0YWJsZV0nO1xyXG4gIGxldCBmb2N1c2FibGVFbGVtZW50cyA9IHRyYXBDb250YWluZXIucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGVFbGVtZW50c1N0cmluZyk7XHJcbiAgbGV0IGZpcnN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzWyAwIF07XHJcblxyXG4gIGZ1bmN0aW9uIHRyYXBUYWJLZXkgKGUpIHtcclxuICAgIHZhciBrZXkgPSBldmVudC53aGljaCB8fCBldmVudC5rZXlDb2RlO1xyXG4gICAgLy8gQ2hlY2sgZm9yIFRBQiBrZXkgcHJlc3NcclxuICAgIGlmIChrZXkgPT09IDkpIHtcclxuXHJcbiAgICAgIGxldCBsYXN0VGFiU3RvcCA9IG51bGw7XHJcbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgbGV0IG51bWJlciA9IGZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBmb2N1c2FibGVFbGVtZW50c1sgbnVtYmVyIC0gaSBdO1xyXG4gICAgICAgIGlmIChlbGVtZW50Lm9mZnNldFdpZHRoID4gMCAmJiBlbGVtZW50Lm9mZnNldEhlaWdodCA+IDApIHtcclxuICAgICAgICAgIGxhc3RUYWJTdG9wID0gZWxlbWVudDtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gU0hJRlQgKyBUQUJcclxuICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcclxuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZmlyc3RUYWJTdG9wKSB7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBsYXN0VGFiU3RvcC5mb2N1cygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRBQlxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBsYXN0VGFiU3RvcCkge1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRVNDQVBFXHJcbiAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7XHJcbiAgICAgIHRvZ2dsZU5hdi5jYWxsKHRoaXMsIGZhbHNlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBlbmFibGUgKCkge1xyXG4gICAgICAgIC8vIEZvY3VzIGZpcnN0IGNoaWxkXHJcbiAgICAgICAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgIC8vIExpc3RlbiBmb3IgYW5kIHRyYXAgdGhlIGtleWJvYXJkXHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwVGFiS2V5KTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVsZWFzZSAoKSB7XHJcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwVGFiS2V5KTtcclxuICAgIH0sXHJcbiAgfTtcclxufTtcclxuXHJcbmxldCBmb2N1c1RyYXA7XHJcblxyXG5jb25zdCB0b2dnbGVOYXYgPSBmdW5jdGlvbiAoYWN0aXZlKSB7XHJcbiAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcbiAgaWYgKHR5cGVvZiBhY3RpdmUgIT09ICdib29sZWFuJykge1xyXG4gICAgYWN0aXZlID0gIWlzQWN0aXZlKCk7XHJcbiAgfVxyXG4gIGJvZHkuY2xhc3NMaXN0LnRvZ2dsZShBQ1RJVkVfQ0xBU1MsIGFjdGl2ZSk7XHJcblxyXG4gIGZvckVhY2goc2VsZWN0KFRPR0dMRVMpLCBlbCA9PiB7XHJcbiAgICBlbC5jbGFzc0xpc3QudG9nZ2xlKFZJU0lCTEVfQ0xBU1MsIGFjdGl2ZSk7XHJcbiAgfSk7XHJcbiAgaWYgKGFjdGl2ZSkge1xyXG4gICAgZm9jdXNUcmFwLmVuYWJsZSgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBmb2N1c1RyYXAucmVsZWFzZSgpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgY2xvc2VCdXR0b24gPSBib2R5LnF1ZXJ5U2VsZWN0b3IoQ0xPU0VfQlVUVE9OKTtcclxuICBjb25zdCBtZW51QnV0dG9uID0gYm9keS5xdWVyeVNlbGVjdG9yKE9QRU5FUlMpO1xyXG5cclxuICBpZiAoYWN0aXZlICYmIGNsb3NlQnV0dG9uKSB7XHJcbiAgICAvLyBUaGUgbW9iaWxlIG5hdiB3YXMganVzdCBhY3RpdmF0ZWQsIHNvIGZvY3VzIG9uIHRoZSBjbG9zZSBidXR0b24sXHJcbiAgICAvLyB3aGljaCBpcyBqdXN0IGJlZm9yZSBhbGwgdGhlIG5hdiBlbGVtZW50cyBpbiB0aGUgdGFiIG9yZGVyLlxyXG4gICAgY2xvc2VCdXR0b24uZm9jdXMoKTtcclxuICB9IGVsc2UgaWYgKCFhY3RpdmUgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gY2xvc2VCdXR0b24gJiZcclxuICAgICAgICAgICAgIG1lbnVCdXR0b24pIHtcclxuICAgIC8vIFRoZSBtb2JpbGUgbmF2IHdhcyBqdXN0IGRlYWN0aXZhdGVkLCBhbmQgZm9jdXMgd2FzIG9uIHRoZSBjbG9zZVxyXG4gICAgLy8gYnV0dG9uLCB3aGljaCBpcyBubyBsb25nZXIgdmlzaWJsZS4gV2UgZG9uJ3Qgd2FudCB0aGUgZm9jdXMgdG9cclxuICAgIC8vIGRpc2FwcGVhciBpbnRvIHRoZSB2b2lkLCBzbyBmb2N1cyBvbiB0aGUgbWVudSBidXR0b24gaWYgaXQnc1xyXG4gICAgLy8gdmlzaWJsZSAodGhpcyBtYXkgaGF2ZSBiZWVuIHdoYXQgdGhlIHVzZXIgd2FzIGp1c3QgZm9jdXNlZCBvbixcclxuICAgIC8vIGlmIHRoZXkgdHJpZ2dlcmVkIHRoZSBtb2JpbGUgbmF2IGJ5IG1pc3Rha2UpLlxyXG4gICAgbWVudUJ1dHRvbi5mb2N1cygpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGFjdGl2ZTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE5hdmlnYXRpb247IiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBUT0dHTEVfQVRUUklCVVRFID0gJ2RhdGEtY29udHJvbHMnO1xyXG5cclxuLyoqXHJcbiAqIEFkZHMgY2xpY2sgZnVuY3Rpb25hbGl0eSB0byByYWRpb2J1dHRvbiBjb2xsYXBzZSBsaXN0XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lckVsZW1lbnQgXHJcbiAqL1xyXG5mdW5jdGlvbiBSYWRpb1RvZ2dsZUdyb3VwKGNvbnRhaW5lckVsZW1lbnQpe1xyXG4gICAgdGhpcy5yYWRpb0dyb3VwID0gY29udGFpbmVyRWxlbWVudDtcclxuICAgIHRoaXMucmFkaW9FbHMgPSBudWxsO1xyXG4gICAgdGhpcy50YXJnZXRFbCA9IG51bGw7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRzXHJcbiAqL1xyXG5SYWRpb1RvZ2dsZUdyb3VwLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCl7XHJcbiAgICB0aGlzLnJhZGlvRWxzID0gdGhpcy5yYWRpb0dyb3VwLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXScpO1xyXG4gICAgaWYodGhpcy5yYWRpb0Vscy5sZW5ndGggPT09IDApe1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gcmFkaW9idXR0b25zIGZvdW5kIGluIHJhZGlvYnV0dG9uIGdyb3VwLicpO1xyXG4gICAgfVxyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLnJhZGlvRWxzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICB2YXIgcmFkaW8gPSB0aGlzLnJhZGlvRWxzWyBpIF07XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmFkaW8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgYSA9IDA7IGEgPCB0aGF0LnJhZGlvRWxzLmxlbmd0aDsgYSsrICl7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnRvZ2dsZSh0aGF0LnJhZGlvRWxzWyBhIF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy50b2dnbGUocmFkaW8pO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogVG9nZ2xlIHJhZGlvYnV0dG9uIGNvbnRlbnRcclxuICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSByYWRpb0lucHV0RWxlbWVudCBcclxuICovXHJcblJhZGlvVG9nZ2xlR3JvdXAucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uIChyYWRpb0lucHV0RWxlbWVudCl7XHJcbiAgICB2YXIgY29udGVudElkID0gcmFkaW9JbnB1dEVsZW1lbnQuZ2V0QXR0cmlidXRlKFRPR0dMRV9BVFRSSUJVVEUpO1xyXG4gICAgaWYoY29udGVudElkICE9PSBudWxsICYmIGNvbnRlbnRJZCAhPT0gdW5kZWZpbmVkICYmIGNvbnRlbnRJZCAhPT0gXCJcIil7XHJcbiAgICAgICAgdmFyIGNvbnRlbnRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250ZW50SWQpO1xyXG4gICAgICAgIGlmKGNvbnRlbnRFbGVtZW50ID09PSBudWxsIHx8IGNvbnRlbnRFbGVtZW50ID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIHBhbmVsIGVsZW1lbnQuIFZlcmlmeSB2YWx1ZSBvZiBhdHRyaWJ1dGUgYCsgVE9HR0xFX0FUVFJJQlVURSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHJhZGlvSW5wdXRFbGVtZW50LmNoZWNrZWQpe1xyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZChyYWRpb0lucHV0RWxlbWVudCwgY29udGVudEVsZW1lbnQpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLmNvbGxhcHNlKHJhZGlvSW5wdXRFbGVtZW50LCBjb250ZW50RWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogRXhwYW5kIHJhZGlvIGJ1dHRvbiBjb250ZW50XHJcbiAqIEBwYXJhbSB7fSByYWRpb0lucHV0RWxlbWVudCBSYWRpbyBJbnB1dCBlbGVtZW50XHJcbiAqIEBwYXJhbSB7Kn0gY29udGVudEVsZW1lbnQgQ29udGVudCBlbGVtZW50XHJcbiAqL1xyXG5SYWRpb1RvZ2dsZUdyb3VwLnByb3RvdHlwZS5leHBhbmQgPSBmdW5jdGlvbiAocmFkaW9JbnB1dEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KXtcclxuICAgIGlmKHJhZGlvSW5wdXRFbGVtZW50ICE9PSBudWxsICYmIHJhZGlvSW5wdXRFbGVtZW50ICE9PSB1bmRlZmluZWQgJiYgY29udGVudEVsZW1lbnQgIT09IG51bGwgJiYgY29udGVudEVsZW1lbnQgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgcmFkaW9JbnB1dEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLWV4cGFuZGVkJywgJ3RydWUnKTtcclxuICAgICAgICBjb250ZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgbGV0IGV2ZW50T3BlbiA9IG5ldyBFdmVudCgnZmRzLnJhZGlvLmV4cGFuZGVkJyk7XHJcbiAgICAgICAgcmFkaW9JbnB1dEVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudE9wZW4pO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBDb2xsYXBzZSByYWRpbyBidXR0b24gY29udGVudFxyXG4gKiBAcGFyYW0ge30gcmFkaW9JbnB1dEVsZW1lbnQgUmFkaW8gSW5wdXQgZWxlbWVudFxyXG4gKiBAcGFyYW0geyp9IGNvbnRlbnRFbGVtZW50IENvbnRlbnQgZWxlbWVudFxyXG4gKi9cclxuUmFkaW9Ub2dnbGVHcm91cC5wcm90b3R5cGUuY29sbGFwc2UgPSBmdW5jdGlvbihyYWRpb0lucHV0RWxlbWVudCwgY29udGVudEVsZW1lbnQpe1xyXG4gICAgaWYocmFkaW9JbnB1dEVsZW1lbnQgIT09IG51bGwgJiYgcmFkaW9JbnB1dEVsZW1lbnQgIT09IHVuZGVmaW5lZCAmJiBjb250ZW50RWxlbWVudCAhPT0gbnVsbCAmJiBjb250ZW50RWxlbWVudCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICByYWRpb0lucHV0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuICAgICAgICBjb250ZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICBsZXQgZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLnJhZGlvLmNvbGxhcHNlZCcpO1xyXG4gICAgICAgIHJhZGlvSW5wdXRFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFJhZGlvVG9nZ2xlR3JvdXA7IiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBtb2RpZmllclN0YXRlID0ge1xyXG4gIHNoaWZ0OiBmYWxzZSxcclxuICBhbHQ6IGZhbHNlLFxyXG4gIGN0cmw6IGZhbHNlLFxyXG4gIGNvbW1hbmQ6IGZhbHNlXHJcbn07XHJcbi8qXHJcbiogUHJldmVudHMgdGhlIHVzZXIgZnJvbSBpbnB1dHRpbmcgYmFzZWQgb24gYSByZWdleC5cclxuKiBEb2VzIG5vdCB3b3JrIHRoZSBzYW1lIHdheSBhZiA8aW5wdXQgcGF0dGVybj1cIlwiPiwgdGhpcyBwYXR0ZXJuIGlzIG9ubHkgdXNlZCBmb3IgdmFsaWRhdGlvbiwgbm90IHRvIHByZXZlbnQgaW5wdXQuXHJcbiogVXNlY2FzZTogbnVtYmVyIGlucHV0IGZvciBkYXRlLWNvbXBvbmVudC5cclxuKiBFeGFtcGxlIC0gbnVtYmVyIG9ubHk6IDxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtaW5wdXQtcmVnZXg9XCJeXFxkKiRcIj5cclxuKi9cclxuY2xhc3MgSW5wdXRSZWdleE1hc2sge1xyXG4gIGNvbnN0cnVjdG9yIChlbGVtZW50KXtcclxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGFzdGUnLCByZWdleE1hc2spO1xyXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgcmVnZXhNYXNrKTtcclxuICB9XHJcbn1cclxudmFyIHJlZ2V4TWFzayA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gIGlmKG1vZGlmaWVyU3RhdGUuY3RybCB8fCBtb2RpZmllclN0YXRlLmNvbW1hbmQpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgdmFyIG5ld0NoYXIgPSBudWxsO1xyXG4gIGlmKHR5cGVvZiBldmVudC5rZXkgIT09ICd1bmRlZmluZWQnKXtcclxuICAgIGlmKGV2ZW50LmtleS5sZW5ndGggPT09IDEpe1xyXG4gICAgICBuZXdDaGFyID0gZXZlbnQua2V5O1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBpZighZXZlbnQuY2hhckNvZGUpe1xyXG4gICAgICBuZXdDaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShldmVudC5rZXlDb2RlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5ld0NoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGV2ZW50LmNoYXJDb2RlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciByZWdleFN0ciA9IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLWlucHV0LXJlZ2V4Jyk7XHJcblxyXG4gIGlmKGV2ZW50LnR5cGUgIT09IHVuZGVmaW5lZCAmJiBldmVudC50eXBlID09PSAncGFzdGUnKXtcclxuICAgIC8vY29uc29sZS5sb2coJ3Bhc3RlJyk7XHJcbiAgfSBlbHNle1xyXG4gICAgdmFyIGVsZW1lbnQgPSBudWxsO1xyXG4gICAgaWYoZXZlbnQudGFyZ2V0ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgfVxyXG4gICAgaWYobmV3Q2hhciAhPT0gbnVsbCAmJiBlbGVtZW50ICE9PSBudWxsKSB7XHJcbiAgICAgIGlmKG5ld0NoYXIubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgbGV0IG5ld1ZhbHVlID0gdGhpcy52YWx1ZTtcclxuICAgICAgICBpZihlbGVtZW50LnR5cGUgPT09ICdudW1iZXInKXtcclxuICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy52YWx1ZTsvL05vdGUgaW5wdXRbdHlwZT1udW1iZXJdIGRvZXMgbm90IGhhdmUgLnNlbGVjdGlvblN0YXJ0L0VuZCAoQ2hyb21lKS5cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy52YWx1ZS5zbGljZSgwLCBlbGVtZW50LnNlbGVjdGlvblN0YXJ0KSArIHRoaXMudmFsdWUuc2xpY2UoZWxlbWVudC5zZWxlY3Rpb25FbmQpICsgbmV3Q2hhcjsgLy9yZW1vdmVzIHRoZSBudW1iZXJzIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLCB0aGVuIGFkZHMgbmV3IGNoYXIuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgciA9IG5ldyBSZWdFeHAocmVnZXhTdHIpO1xyXG4gICAgICAgIGlmKHIuZXhlYyhuZXdWYWx1ZSkgPT09IG51bGwpe1xyXG4gICAgICAgICAgaWYgKGV2ZW50LnByZXZlbnREZWZhdWx0KSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IElucHV0UmVnZXhNYXNrOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBcclxuICogQHBhcmFtIHtIVE1MVGFibGVFbGVtZW50fSB0YWJsZSBUYWJsZSBFbGVtZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBUYWJsZVNlbGVjdGFibGVSb3dzICh0YWJsZSkge1xyXG4gIHRoaXMudGFibGUgPSB0YWJsZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEluaXRpYWxpemUgZXZlbnRsaXN0ZW5lcnMgZm9yIGNoZWNrYm94ZXMgaW4gdGFibGVcclxuICovXHJcblRhYmxlU2VsZWN0YWJsZVJvd3MucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xyXG4gIHRoaXMuZ3JvdXBDaGVja2JveCA9IHRoaXMuZ2V0R3JvdXBDaGVja2JveCgpO1xyXG4gIHRoaXMudGJvZHlDaGVja2JveExpc3QgPSB0aGlzLmdldENoZWNrYm94TGlzdCgpO1xyXG4gIGlmKHRoaXMudGJvZHlDaGVja2JveExpc3QubGVuZ3RoICE9PSAwKXtcclxuICAgIGZvcihsZXQgYyA9IDA7IGMgPCB0aGlzLnRib2R5Q2hlY2tib3hMaXN0Lmxlbmd0aDsgYysrKXtcclxuICAgICAgbGV0IGNoZWNrYm94ID0gdGhpcy50Ym9keUNoZWNrYm94TGlzdFtjXTtcclxuICAgICAgY2hlY2tib3gucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdXBkYXRlR3JvdXBDaGVjayk7XHJcbiAgICAgIGNoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHVwZGF0ZUdyb3VwQ2hlY2spO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZih0aGlzLmdyb3VwQ2hlY2tib3ggIT09IGZhbHNlKXtcclxuICAgIHRoaXMuZ3JvdXBDaGVja2JveC5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB1cGRhdGVDaGVja2JveExpc3QpO1xyXG4gICAgdGhpcy5ncm91cENoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHVwZGF0ZUNoZWNrYm94TGlzdCk7XHJcbiAgfVxyXG59XHJcbiAgXHJcbi8qKlxyXG4gKiBHZXQgZ3JvdXAgY2hlY2tib3ggaW4gdGFibGUgaGVhZGVyXHJcbiAqIEByZXR1cm5zIGVsZW1lbnQgb24gdHJ1ZSAtIGZhbHNlIGlmIG5vdCBmb3VuZFxyXG4gKi9cclxuVGFibGVTZWxlY3RhYmxlUm93cy5wcm90b3R5cGUuZ2V0R3JvdXBDaGVja2JveCA9IGZ1bmN0aW9uKCl7XHJcbiAgbGV0IGNoZWNrYm94ID0gdGhpcy50YWJsZS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGhlYWQnKVswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmb3JtLWNoZWNrYm94Jyk7XHJcbiAgaWYoY2hlY2tib3gubGVuZ3RoID09PSAwKXtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbiAgcmV0dXJuIGNoZWNrYm94WzBdO1xyXG59XHJcbi8qKlxyXG4gKiBHZXQgdGFibGUgYm9keSBjaGVja2JveGVzXHJcbiAqIEByZXR1cm5zIEhUTUxDb2xsZWN0aW9uXHJcbiAqL1xyXG5UYWJsZVNlbGVjdGFibGVSb3dzLnByb3RvdHlwZS5nZXRDaGVja2JveExpc3QgPSBmdW5jdGlvbigpe1xyXG4gIHJldHVybiB0aGlzLnRhYmxlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0Ym9keScpWzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Zvcm0tY2hlY2tib3gnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZSBjaGVja2JveGVzIGluIHRhYmxlIGJvZHkgd2hlbiBncm91cCBjaGVja2JveCBpcyBjaGFuZ2VkXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgXHJcbiAqL1xyXG5mdW5jdGlvbiB1cGRhdGVDaGVja2JveExpc3QoZSl7XHJcbiAgbGV0IGNoZWNrYm94ID0gZS50YXJnZXQ7XHJcbiAgY2hlY2tib3gucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWNoZWNrZWQnKTtcclxuICBsZXQgdGFibGUgPSBlLnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xyXG4gIGxldCB0YWJsZVNlbGVjdGFibGVSb3dzID0gbmV3IFRhYmxlU2VsZWN0YWJsZVJvd3ModGFibGUpO1xyXG4gIGxldCBjaGVja2JveExpc3QgPSB0YWJsZVNlbGVjdGFibGVSb3dzLmdldENoZWNrYm94TGlzdCgpO1xyXG4gIGxldCBjaGVja2VkTnVtYmVyID0gMDtcclxuICBpZihjaGVja2JveC5jaGVja2VkKXtcclxuICAgIGZvcihsZXQgYyA9IDA7IGMgPCBjaGVja2JveExpc3QubGVuZ3RoOyBjKyspe1xyXG4gICAgICBjaGVja2JveExpc3RbY10uY2hlY2tlZCA9IHRydWU7XHJcbiAgICAgIGNoZWNrYm94TGlzdFtjXS5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgndGFibGUtcm93LXNlbGVjdGVkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tlZE51bWJlciA9IGNoZWNrYm94TGlzdC5sZW5ndGg7XHJcbiAgfSBlbHNle1xyXG4gICAgZm9yKGxldCBjID0gMDsgYyA8IGNoZWNrYm94TGlzdC5sZW5ndGg7IGMrKyl7XHJcbiAgICAgIGNoZWNrYm94TGlzdFtjXS5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgIGNoZWNrYm94TGlzdFtjXS5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LnJlbW92ZSgndGFibGUtcm93LXNlbGVjdGVkJyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiZmRzLnRhYmxlLnNlbGVjdGFibGUudXBkYXRlZFwiLCB7XHJcbiAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgIGRldGFpbDoge2NoZWNrZWROdW1iZXJ9XHJcbiAgfSk7XHJcbiAgdGFibGUuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVcGRhdGUgZ3JvdXAgY2hlY2tib3ggd2hlbiBjaGVja2JveCBpbiB0YWJsZSBib2R5IGlzIGNoYW5nZWRcclxuICogQHBhcmFtIHtFdmVudH0gZSBcclxuICovXHJcbmZ1bmN0aW9uIHVwZGF0ZUdyb3VwQ2hlY2soZSl7XHJcbiAgLy8gdXBkYXRlIGxhYmVsIGZvciBldmVudCBjaGVja2JveFxyXG4gIGlmKGUudGFyZ2V0LmNoZWNrZWQpe1xyXG4gICAgZS50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3RhYmxlLXJvdy1zZWxlY3RlZCcpO1xyXG4gIH0gZWxzZXtcclxuICAgIGUudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QucmVtb3ZlKCd0YWJsZS1yb3ctc2VsZWN0ZWQnKTtcclxuICB9XHJcbiAgbGV0IHRhYmxlID0gZS50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZTtcclxuICBsZXQgdGFibGVTZWxlY3RhYmxlUm93cyA9IG5ldyBUYWJsZVNlbGVjdGFibGVSb3dzKHRhYmxlKTtcclxuICBsZXQgZ3JvdXBDaGVja2JveCA9IHRhYmxlU2VsZWN0YWJsZVJvd3MuZ2V0R3JvdXBDaGVja2JveCgpO1xyXG4gIGlmKGdyb3VwQ2hlY2tib3ggIT09IGZhbHNlKXtcclxuICAgIGxldCBjaGVja2JveExpc3QgPSB0YWJsZVNlbGVjdGFibGVSb3dzLmdldENoZWNrYm94TGlzdCgpO1xyXG5cclxuICAgIC8vIGhvdyBtYW55IHJvdyBoYXMgYmVlbiBzZWxlY3RlZFxyXG4gICAgbGV0IGNoZWNrZWROdW1iZXIgPSAwO1xyXG4gICAgZm9yKGxldCBjID0gMDsgYyA8IGNoZWNrYm94TGlzdC5sZW5ndGg7IGMrKyl7XHJcbiAgICAgIGxldCBsb29wZWRDaGVja2JveCA9IGNoZWNrYm94TGlzdFtjXTtcclxuICAgICAgaWYobG9vcGVkQ2hlY2tib3guY2hlY2tlZCl7XHJcbiAgICAgICAgY2hlY2tlZE51bWJlcisrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmKGNoZWNrZWROdW1iZXIgPT09IGNoZWNrYm94TGlzdC5sZW5ndGgpeyAvLyBpZiBhbGwgcm93cyBoYXMgYmVlbiBzZWxlY3RlZFxyXG4gICAgICBncm91cENoZWNrYm94LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJyk7XHJcbiAgICAgIGdyb3VwQ2hlY2tib3guY2hlY2tlZCA9IHRydWU7XHJcbiAgICB9IGVsc2UgaWYoY2hlY2tlZE51bWJlciA9PSAwKXsgLy8gaWYgbm8gcm93cyBoYXMgYmVlbiBzZWxlY3RlZFxyXG4gICAgICBncm91cENoZWNrYm94LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJyk7XHJcbiAgICAgIGdyb3VwQ2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgfSBlbHNleyAvLyBpZiBzb21lIGJ1dCBub3QgYWxsIHJvd3MgaGFzIGJlZW4gc2VsZWN0ZWRcclxuICAgICAgZ3JvdXBDaGVja2JveC5zZXRBdHRyaWJ1dGUoJ2FyaWEtY2hlY2tlZCcsICdtaXhlZCcpO1xyXG4gICAgICBncm91cENoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiZmRzLnRhYmxlLnNlbGVjdGFibGUudXBkYXRlZFwiLCB7XHJcbiAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICAgIGRldGFpbDoge2NoZWNrZWROdW1iZXJ9XHJcbiAgICB9KTtcclxuICAgIHRhYmxlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVGFibGVTZWxlY3RhYmxlUm93czsiLCJjb25zdCBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZGF0YS10aXRsZSBvbiBjZWxscywgd2hlcmUgdGhlIGF0dHJpYnV0ZSBpcyBtaXNzaW5nXHJcbiAqL1xyXG5jbGFzcyBSZXNwb25zaXZlVGFibGUge1xyXG4gICAgY29uc3RydWN0b3IodGFibGUpIHtcclxuICAgICAgICBpbnNlcnRIZWFkZXJBc0F0dHJpYnV0ZXModGFibGUpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQWRkIGRhdGEgYXR0cmlidXRlcyBuZWVkZWQgZm9yIHJlc3BvbnNpdmUgbW9kZS5cclxuICogQHBhcmFtIHtIVE1MVGFibGVFbGVtZW50fSB0YWJsZUVsIFRhYmxlIGVsZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIGluc2VydEhlYWRlckFzQXR0cmlidXRlcyh0YWJsZUVsKSB7XHJcbiAgICBpZiAoIXRhYmxlRWwpIHJldHVybjtcclxuXHJcbiAgICBsZXQgaGVhZGVyID0gdGFibGVFbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGhlYWQnKTtcclxuICAgIGlmIChoZWFkZXIubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgbGV0IGhlYWRlckNlbGxFbHMgPSBoZWFkZXJbMF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RoJyk7XHJcbiAgICAgICAgaWYgKGhlYWRlckNlbGxFbHMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgaGVhZGVyQ2VsbEVscyA9IGhlYWRlclswXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChoZWFkZXJDZWxsRWxzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgY29uc3QgYm9keVJvd0VscyA9IHNlbGVjdCgndGJvZHkgdHInLCB0YWJsZUVsKTtcclxuICAgICAgICAgICAgQXJyYXkuZnJvbShib2R5Um93RWxzKS5mb3JFYWNoKHJvd0VsID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBjZWxsRWxzID0gcm93RWwuY2hpbGRyZW47XHJcbiAgICAgICAgICAgICAgICBpZiAoY2VsbEVscy5sZW5ndGggPT09IGhlYWRlckNlbGxFbHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQXJyYXkuZnJvbShoZWFkZXJDZWxsRWxzKS5mb3JFYWNoKChoZWFkZXJDZWxsRWwsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gR3JhYiBoZWFkZXIgY2VsbCB0ZXh0IGFuZCB1c2UgaXQgYm9keSBjZWxsIGRhdGEgdGl0bGUuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY2VsbEVsc1tpXS5oYXNBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSAmJiBoZWFkZXJDZWxsRWwudGFnTmFtZSA9PT0gXCJUSFwiICYmICFoZWFkZXJDZWxsRWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwic3ItaGVhZGVyXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsRWxzW2ldLnNldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScsIGhlYWRlckNlbGxFbC50ZXh0Q29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSZXNwb25zaXZlVGFibGU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxubGV0IGJyZWFrcG9pbnRzID0ge1xyXG4gICd4cyc6IDAsXHJcbiAgJ3NtJzogNTc2LFxyXG4gICdtZCc6IDc2OCxcclxuICAnbGcnOiA5OTIsXHJcbiAgJ3hsJzogMTIwMFxyXG59O1xyXG5cclxuLy8gRm9yIGVhc3kgcmVmZXJlbmNlXHJcbnZhciBrZXlzID0ge1xyXG4gIGVuZDogMzUsXHJcbiAgaG9tZTogMzYsXHJcbiAgbGVmdDogMzcsXHJcbiAgdXA6IDM4LFxyXG4gIHJpZ2h0OiAzOSxcclxuICBkb3duOiA0MCxcclxuICBkZWxldGU6IDQ2XHJcbn07XHJcblxyXG4vLyBBZGQgb3Igc3Vic3RyYWN0IGRlcGVuZGluZyBvbiBrZXkgcHJlc3NlZFxyXG52YXIgZGlyZWN0aW9uID0ge1xyXG4gIDM3OiAtMSxcclxuICAzODogLTEsXHJcbiAgMzk6IDEsXHJcbiAgNDA6IDFcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgZnVuY3Rpb25hbGl0eSB0byB0YWJuYXYgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhYm5hdiBUYWJuYXYgY29udGFpbmVyXHJcbiAqL1xyXG5mdW5jdGlvbiBUYWJuYXYgKHRhYm5hdikge1xyXG4gIHRoaXMudGFibmF2ID0gdGFibmF2O1xyXG4gIHRoaXMudGFicyA9IHRoaXMudGFibmF2LnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi50YWJuYXYtaXRlbScpO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0IGV2ZW50IG9uIGNvbXBvbmVudFxyXG4gKi9cclxuVGFibmF2LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcclxuICBpZih0aGlzLnRhYnMubGVuZ3RoID09PSAwKXtcclxuICAgIHRocm93IG5ldyBFcnJvcihgVGFibmF2IEhUTUwgc2VlbXMgdG8gYmUgbWlzc2luZyB0YWJuYXYtaXRlbS4gQWRkIHRhYm5hdiBpdGVtcyB0byBlbnN1cmUgZWFjaCBwYW5lbCBoYXMgYSBidXR0b24gaW4gdGhlIHRhYm5hdnMgbmF2aWdhdGlvbi5gKTtcclxuICB9XHJcblxyXG4gIC8vIGlmIG5vIGhhc2ggaXMgc2V0IG9uIGxvYWQsIHNldCBhY3RpdmUgdGFiXHJcbiAgaWYgKCFzZXRBY3RpdmVIYXNoVGFiKCkpIHtcclxuICAgIC8vIHNldCBmaXJzdCB0YWIgYXMgYWN0aXZlXHJcbiAgICBsZXQgdGFiID0gdGhpcy50YWJzWyAwIF07XHJcblxyXG4gICAgLy8gY2hlY2sgbm8gb3RoZXIgdGFicyBhcyBiZWVuIHNldCBhdCBkZWZhdWx0XHJcbiAgICBsZXQgYWxyZWFkeUFjdGl2ZSA9IGdldEFjdGl2ZVRhYnModGhpcy50YWJuYXYpO1xyXG4gICAgaWYgKGFscmVhZHlBY3RpdmUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHRhYiA9IGFscmVhZHlBY3RpdmVbIDAgXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBhY3RpdmF0ZSBhbmQgZGVhY3RpdmF0ZSB0YWJzXHJcbiAgICB0aGlzLmFjdGl2YXRlVGFiKHRhYiwgZmFsc2UpO1xyXG4gIH1cclxuICBsZXQgJG1vZHVsZSA9IHRoaXM7XHJcbiAgLy8gYWRkIGV2ZW50bGlzdGVuZXJzIG9uIGJ1dHRvbnNcclxuICBmb3IobGV0IHQgPSAwOyB0IDwgdGhpcy50YWJzLmxlbmd0aDsgdCArKyl7XHJcbiAgICB0aGlzLnRhYnNbIHQgXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7JG1vZHVsZS5hY3RpdmF0ZVRhYih0aGlzLCBmYWxzZSl9KTtcclxuICAgIHRoaXMudGFic1sgdCBdLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBrZXlkb3duRXZlbnRMaXN0ZW5lcik7XHJcbiAgICB0aGlzLnRhYnNbIHQgXS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGtleXVwRXZlbnRMaXN0ZW5lcik7XHJcbiAgfVxyXG59XHJcblxyXG4vKioqXHJcbiAqIFNob3cgdGFiIGFuZCBoaWRlIG90aGVyc1xyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSB0YWIgYnV0dG9uIGVsZW1lbnRcclxuICogQHBhcmFtIHtib29sZWFufSBzZXRGb2N1cyBUcnVlIGlmIHRhYiBidXR0b24gc2hvdWxkIGJlIGZvY3VzZWRcclxuICovXHJcbiBUYWJuYXYucHJvdG90eXBlLmFjdGl2YXRlVGFiID0gZnVuY3Rpb24odGFiLCBzZXRGb2N1cykge1xyXG4gIGxldCB0YWJzID0gZ2V0QWxsVGFic0luTGlzdCh0YWIpO1xyXG5cclxuICAvLyBjbG9zZSBhbGwgdGFicyBleGNlcHQgc2VsZWN0ZWRcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudGFicy5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKHRhYnNbIGkgXSA9PT0gdGFiKSB7XHJcbiAgICAgIGNvbnRpbnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YWJzWyBpIF0uZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJykge1xyXG4gICAgICBsZXQgZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLnRhYm5hdi5jbG9zZScpO1xyXG4gICAgICB0YWJzWyBpIF0uZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgIH1cclxuXHJcbiAgICB0YWJzWyBpIF0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xyXG4gICAgdGFic1sgaSBdLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsICdmYWxzZScpO1xyXG4gICAgbGV0IHRhYnBhbmVsSUQgPSB0YWJzWyBpIF0uZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyk7XHJcbiAgICBsZXQgdGFicGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YWJwYW5lbElEKVxyXG4gICAgaWYodGFicGFuZWwgPT09IG51bGwpe1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIHRhYnBhbmVsLmApO1xyXG4gICAgfVxyXG4gICAgdGFicGFuZWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcbiAgfVxyXG4gIFxyXG4gIC8vIFNldCBzZWxlY3RlZCB0YWIgdG8gYWN0aXZlXHJcbiAgbGV0IHRhYnBhbmVsSUQgPSB0YWIuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyk7XHJcbiAgbGV0IHRhYnBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFicGFuZWxJRCk7XHJcbiAgaWYodGFicGFuZWwgPT09IG51bGwpe1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBhY2NvcmRpb24gcGFuZWwuYCk7XHJcbiAgfVxyXG5cclxuICB0YWIuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKTtcclxuICB0YWJwYW5lbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgdGFiLnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcclxuXHJcbiAgLy8gU2V0IGZvY3VzIHdoZW4gcmVxdWlyZWRcclxuICBpZiAoc2V0Rm9jdXMpIHtcclxuICAgIHRhYi5mb2N1cygpO1xyXG4gIH1cclxuXHJcbiAgbGV0IGV2ZW50Q2hhbmdlZCA9IG5ldyBFdmVudCgnZmRzLnRhYm5hdi5jaGFuZ2VkJyk7XHJcbiAgdGFiLnBhcmVudE5vZGUuZGlzcGF0Y2hFdmVudChldmVudENoYW5nZWQpO1xyXG5cclxuICBsZXQgZXZlbnRPcGVuID0gbmV3IEV2ZW50KCdmZHMudGFibmF2Lm9wZW4nKTtcclxuICB0YWIuZGlzcGF0Y2hFdmVudChldmVudE9wZW4pO1xyXG59XHJcblxyXG4vKipcclxuICogQWRkIGtleWRvd24gZXZlbnRzIHRvIHRhYm5hdiBjb21wb25lbnRcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCBcclxuICovXHJcbmZ1bmN0aW9uIGtleWRvd25FdmVudExpc3RlbmVyIChldmVudCkge1xyXG4gIGxldCBrZXkgPSBldmVudC5rZXlDb2RlO1xyXG5cclxuICBzd2l0Y2ggKGtleSkge1xyXG4gICAgY2FzZSBrZXlzLmVuZDpcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgLy8gQWN0aXZhdGUgbGFzdCB0YWJcclxuICAgICAgZm9jdXNMYXN0VGFiKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBrZXlzLmhvbWU6XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIC8vIEFjdGl2YXRlIGZpcnN0IHRhYlxyXG4gICAgICBmb2N1c0ZpcnN0VGFiKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgLy8gVXAgYW5kIGRvd24gYXJlIGluIGtleWRvd25cclxuICAgIC8vIGJlY2F1c2Ugd2UgbmVlZCB0byBwcmV2ZW50IHBhZ2Ugc2Nyb2xsID46KVxyXG4gICAgY2FzZSBrZXlzLnVwOlxyXG4gICAgY2FzZSBrZXlzLmRvd246XHJcbiAgICAgIGRldGVybWluZU9yaWVudGF0aW9uKGV2ZW50KTtcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQWRkIGtleXVwIGV2ZW50cyB0byB0YWJuYXYgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgXHJcbiAqL1xyXG5mdW5jdGlvbiBrZXl1cEV2ZW50TGlzdGVuZXIgKGV2ZW50KSB7XHJcbiAgbGV0IGtleSA9IGV2ZW50LmtleUNvZGU7XHJcblxyXG4gIHN3aXRjaCAoa2V5KSB7XHJcbiAgICBjYXNlIGtleXMubGVmdDpcclxuICAgIGNhc2Uga2V5cy5yaWdodDpcclxuICAgICAgZGV0ZXJtaW5lT3JpZW50YXRpb24oZXZlbnQpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2Uga2V5cy5kZWxldGU6XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBrZXlzLmVudGVyOlxyXG4gICAgY2FzZSBrZXlzLnNwYWNlOlxyXG4gICAgICBuZXcgVGFibmF2KGV2ZW50LnRhcmdldC5wYXJlbnROb2RlKS5hY3RpdmF0ZVRhYihldmVudC50YXJnZXQsIHRydWUpO1xyXG4gICAgICBicmVhaztcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBXaGVuIGEgdGFibGlzdCBhcmlhLW9yaWVudGF0aW9uIGlzIHNldCB0byB2ZXJ0aWNhbCxcclxuICogb25seSB1cCBhbmQgZG93biBhcnJvdyBzaG91bGQgZnVuY3Rpb24uXHJcbiAqIEluIGFsbCBvdGhlciBjYXNlcyBvbmx5IGxlZnQgYW5kIHJpZ2h0IGFycm93IGZ1bmN0aW9uLlxyXG4gKi9cclxuZnVuY3Rpb24gZGV0ZXJtaW5lT3JpZW50YXRpb24gKGV2ZW50KSB7XHJcbiAgbGV0IGtleSA9IGV2ZW50LmtleUNvZGU7XHJcblxyXG4gIGxldCB3PXdpbmRvdyxcclxuICAgIGQ9ZG9jdW1lbnQsXHJcbiAgICBlPWQuZG9jdW1lbnRFbGVtZW50LFxyXG4gICAgZz1kLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbIDAgXSxcclxuICAgIHg9dy5pbm5lcldpZHRofHxlLmNsaWVudFdpZHRofHxnLmNsaWVudFdpZHRoLFxyXG4gICAgeT13LmlubmVySGVpZ2h0fHxlLmNsaWVudEhlaWdodHx8Zy5jbGllbnRIZWlnaHQ7XHJcblxyXG4gIGxldCB2ZXJ0aWNhbCA9IHggPCBicmVha3BvaW50cy5tZDtcclxuICBsZXQgcHJvY2VlZCA9IGZhbHNlO1xyXG5cclxuICBpZiAodmVydGljYWwpIHtcclxuICAgIGlmIChrZXkgPT09IGtleXMudXAgfHwga2V5ID09PSBrZXlzLmRvd24pIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgcHJvY2VlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgaWYgKGtleSA9PT0ga2V5cy5sZWZ0IHx8IGtleSA9PT0ga2V5cy5yaWdodCkge1xyXG4gICAgICBwcm9jZWVkID0gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKHByb2NlZWQpIHtcclxuICAgIHN3aXRjaFRhYk9uQXJyb3dQcmVzcyhldmVudCk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogRWl0aGVyIGZvY3VzIHRoZSBuZXh0LCBwcmV2aW91cywgZmlyc3QsIG9yIGxhc3QgdGFiXHJcbiAqIGRlcGVuZGluZyBvbiBrZXkgcHJlc3NlZFxyXG4gKi9cclxuZnVuY3Rpb24gc3dpdGNoVGFiT25BcnJvd1ByZXNzIChldmVudCkge1xyXG4gIHZhciBwcmVzc2VkID0gZXZlbnQua2V5Q29kZTtcclxuICBpZiAoZGlyZWN0aW9uWyBwcmVzc2VkIF0pIHtcclxuICAgIGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XHJcbiAgICBsZXQgdGFicyA9IGdldEFsbFRhYnNJbkxpc3QodGFyZ2V0KTtcclxuICAgIGxldCBpbmRleCA9IGdldEluZGV4T2ZFbGVtZW50SW5MaXN0KHRhcmdldCwgdGFicyk7XHJcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgIGlmICh0YWJzWyBpbmRleCArIGRpcmVjdGlvblsgcHJlc3NlZCBdIF0pIHtcclxuICAgICAgICB0YWJzWyBpbmRleCArIGRpcmVjdGlvblsgcHJlc3NlZCBdIF0uZm9jdXMoKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChwcmVzc2VkID09PSBrZXlzLmxlZnQgfHwgcHJlc3NlZCA9PT0ga2V5cy51cCkge1xyXG4gICAgICAgIGZvY3VzTGFzdFRhYih0YXJnZXQpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKHByZXNzZWQgPT09IGtleXMucmlnaHQgfHwgcHJlc3NlZCA9PSBrZXlzLmRvd24pIHtcclxuICAgICAgICBmb2N1c0ZpcnN0VGFiKHRhcmdldCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgYWxsIGFjdGl2ZSB0YWJzIGluIGxpc3RcclxuICogQHBhcmFtIHRhYm5hdiBwYXJlbnQgLnRhYm5hdiBlbGVtZW50XHJcbiAqIEByZXR1cm5zIHJldHVybnMgbGlzdCBvZiBhY3RpdmUgdGFicyBpZiBhbnlcclxuICovXHJcbmZ1bmN0aW9uIGdldEFjdGl2ZVRhYnMgKHRhYm5hdikge1xyXG4gIHJldHVybiB0YWJuYXYucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uLnRhYm5hdi1pdGVtW2FyaWEtc2VsZWN0ZWQ9dHJ1ZV0nKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBhIGxpc3Qgb2YgYWxsIGJ1dHRvbiB0YWJzIGluIGN1cnJlbnQgdGFibGlzdFxyXG4gKiBAcGFyYW0gdGFiIEJ1dHRvbiB0YWIgZWxlbWVudFxyXG4gKiBAcmV0dXJucyB7Kn0gcmV0dXJuIGFycmF5IG9mIHRhYnNcclxuICovXHJcbmZ1bmN0aW9uIGdldEFsbFRhYnNJbkxpc3QgKHRhYikge1xyXG4gIGxldCBwYXJlbnROb2RlID0gdGFiLnBhcmVudE5vZGU7XHJcbiAgaWYgKHBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCd0YWJuYXYnKSkge1xyXG4gICAgcmV0dXJuIHBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uLnRhYm5hdi1pdGVtJyk7XHJcbiAgfVxyXG4gIHJldHVybiBbXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBpbmRleCBvZiBlbGVtZW50IGluIGxpc3RcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBcclxuICogQHBhcmFtIHtIVE1MQ29sbGVjdGlvbn0gbGlzdCBcclxuICogQHJldHVybnMge2luZGV4fVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0SW5kZXhPZkVsZW1lbnRJbkxpc3QgKGVsZW1lbnQsIGxpc3Qpe1xyXG4gIGxldCBpbmRleCA9IC0xO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKyApe1xyXG4gICAgaWYobGlzdFsgaSBdID09PSBlbGVtZW50KXtcclxuICAgICAgaW5kZXggPSBpO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBpbmRleDtcclxufVxyXG5cclxuLyoqXHJcbiAqIENoZWNrcyBpZiB0aGVyZSBpcyBhIHRhYiBoYXNoIGluIHRoZSB1cmwgYW5kIGFjdGl2YXRlcyB0aGUgdGFiIGFjY29yZGluZ2x5XHJcbiAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm5zIHRydWUgaWYgdGFiIGhhcyBiZWVuIHNldCAtIHJldHVybnMgZmFsc2UgaWYgbm8gdGFiIGhhcyBiZWVuIHNldCB0byBhY3RpdmVcclxuICovXHJcbmZ1bmN0aW9uIHNldEFjdGl2ZUhhc2hUYWIgKCkge1xyXG4gIGxldCBoYXNoID0gbG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjJywgJycpO1xyXG4gIGlmIChoYXNoICE9PSAnJykge1xyXG4gICAgbGV0IHRhYiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbi50YWJuYXYtaXRlbVthcmlhLWNvbnRyb2xzPVwiIycgKyBoYXNoICsgJ1wiXScpO1xyXG4gICAgaWYgKHRhYiAhPT0gbnVsbCkge1xyXG4gICAgICBhY3RpdmF0ZVRhYih0YWIsIGZhbHNlKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBmaXJzdCB0YWIgYnkgdGFiIGluIGxpc3RcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gdGFiIFxyXG4gKi9cclxuZnVuY3Rpb24gZm9jdXNGaXJzdFRhYiAodGFiKSB7XHJcbiAgZ2V0QWxsVGFic0luTGlzdCh0YWIpWyAwIF0uZm9jdXMoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBsYXN0IHRhYiBieSB0YWIgaW4gbGlzdFxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSB0YWIgXHJcbiAqL1xyXG5mdW5jdGlvbiBmb2N1c0xhc3RUYWIgKHRhYikge1xyXG4gIGxldCB0YWJzID0gZ2V0QWxsVGFic0luTGlzdCh0YWIpO1xyXG4gIHRhYnNbIHRhYnMubGVuZ3RoIC0gMSBdLmZvY3VzKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRhYm5hdjsiLCIndXNlIHN0cmljdCc7XHJcbi8qKlxyXG4gKiBTaG93L2hpZGUgdG9hc3QgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgXHJcbiAqL1xyXG5mdW5jdGlvbiBUb2FzdCAoZWxlbWVudCl7XHJcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG59XHJcblxyXG4vKipcclxuICogU2hvdyB0b2FzdFxyXG4gKi9cclxuVG9hc3QucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcclxuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzaG93aW5nJyk7XHJcbiAgICB0aGlzLmVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9hc3QtY2xvc2UnKVswXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgbGV0IHRvYXN0ID0gdGhpcy5wYXJlbnROb2RlLnBhcmVudE5vZGU7XHJcbiAgICAgICAgbmV3IFRvYXN0KHRvYXN0KS5oaWRlKCk7XHJcbiAgICB9KTtcclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShzaG93VG9hc3QpO1xyXG59XHJcblxyXG4vKipcclxuICogSGlkZSB0b2FzdFxyXG4gKi9cclxuVG9hc3QucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcclxuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7ICAgICAgICAgXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGRzIGNsYXNzZXMgdG8gbWFrZSBzaG93IGFuaW1hdGlvblxyXG4gKi9cclxuZnVuY3Rpb24gc2hvd1RvYXN0KCl7XHJcbiAgICBsZXQgdG9hc3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRvYXN0LnNob3dpbmcnKTtcclxuICAgIGZvcihsZXQgdCA9IDA7IHQgPCB0b2FzdHMubGVuZ3RoOyB0Kyspe1xyXG4gICAgICAgIGxldCB0b2FzdCA9IHRvYXN0c1t0XTtcclxuICAgICAgICB0b2FzdC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93aW5nJyk7XHJcbiAgICAgICAgdG9hc3QuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUb2FzdDsiLCIndXNlIHN0cmljdCc7XHJcbi8qKlxyXG4gKiBTZXQgdG9vbHRpcCBvbiBlbGVtZW50XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCB3aGljaCBoYXMgdG9vbHRpcFxyXG4gKi9cclxuZnVuY3Rpb24gVG9vbHRpcChlbGVtZW50KSB7XHJcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgaWYgKHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9vbHRpcCcpID09PSBudWxsKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUb29sdGlwIHRleHQgaXMgbWlzc2luZy4gQWRkIGF0dHJpYnV0ZSBkYXRhLXRvb2x0aXAgYW5kIHRoZSBjb250ZW50IG9mIHRoZSB0b29sdGlwIGFzIHZhbHVlLmApO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogU2V0IGV2ZW50bGlzdGVuZXJzXHJcbiAqL1xyXG5Ub29sdGlwLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IG1vZHVsZSA9IHRoaXM7XHJcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgbGV0IHRyaWdnZXIgPSBlLnRhcmdldDtcclxuICAgICAgICBpZiAodHJpZ2dlci5jbGFzc0xpc3QuY29udGFpbnMoJ3Rvb2x0aXAtaG92ZXInKSA9PT0gZmFsc2UgJiYgdHJpZ2dlci5jbGFzc0xpc3QuY29udGFpbnMoJ3Rvb2x0aXAtZm9jdXMnKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgY2xvc2VBbGxUb29sdGlwcyhlKTtcclxuICAgICAgICAgICAgdHJpZ2dlci5jbGFzc0xpc3QuYWRkKFwidG9vbHRpcC1ob3ZlclwiKTtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHJpZ2dlci5jbGFzc0xpc3QuY29udGFpbnMoJ3Rvb2x0aXAtaG92ZXInKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZS50YXJnZXQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpICE9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkVG9vbHRpcChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgMzAwKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgbGV0IHRyaWdnZXIgPSBlLnRhcmdldDtcclxuICAgICAgICBpZiAodHJpZ2dlci5jbGFzc0xpc3QuY29udGFpbnMoJ3Rvb2x0aXAtaG92ZXInKSkge1xyXG4gICAgICAgICAgICB0cmlnZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ3Rvb2x0aXAtaG92ZXInKTtcclxuICAgICAgICAgICAgdmFyIHRvb2x0aXBJZCA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICAgICAgICAgIGxldCB0b29sdGlwRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXBJZCk7XHJcbiAgICAgICAgICAgIGlmICh0b29sdGlwRWxlbWVudCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY2xvc2VIb3ZlclRvb2x0aXAodHJpZ2dlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICB2YXIga2V5ID0gZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZTtcclxuICAgICAgICBpZiAoa2V5ID09PSAyNykge1xyXG4gICAgICAgICAgICB2YXIgdG9vbHRpcCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICAgICAgICAgIGlmICh0b29sdGlwICE9PSBudWxsICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmICh0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAtdHJpZ2dlcicpID09PSAnY2xpY2snKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgdmFyIHRyaWdnZXIgPSBlLnRhcmdldDtcclxuICAgICAgICAgICAgY2xvc2VBbGxUb29sdGlwcyhlKTtcclxuICAgICAgICAgICAgdHJpZ2dlci5jbGFzc0xpc3QuYWRkKCd0b29sdGlwLWZvY3VzJyk7XHJcbiAgICAgICAgICAgIHRyaWdnZXIuY2xhc3NMaXN0LnJlbW92ZSgndG9vbHRpcC1ob3ZlcicpO1xyXG4gICAgICAgICAgICBpZiAodHJpZ2dlci5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKSAhPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBhZGRUb29sdGlwKHRyaWdnZXIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZUFsbFRvb2x0aXBzKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZUFsbFRvb2x0aXBzKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDbG9zZSBhbGwgdG9vbHRpcHNcclxuICovXHJcbmZ1bmN0aW9uIGNsb3NlQWxsKCkge1xyXG4gICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXRvb2x0aXBbYXJpYS1kZXNjcmliZWRieV0nKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgcG9wcGVyID0gZWxlbWVudHNbaV0uZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICAgICAgZWxlbWVudHNbaV0ucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwb3BwZXIpKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gYWRkVG9vbHRpcCh0cmlnZ2VyKSB7XHJcbiAgICB2YXIgcG9zID0gdHJpZ2dlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9vbHRpcC1wb3NpdGlvbicpIHx8ICd0b3AnO1xyXG5cclxuICAgIHZhciB0b29sdGlwID0gY3JlYXRlVG9vbHRpcCh0cmlnZ2VyLCBwb3MpO1xyXG5cclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodG9vbHRpcCk7XHJcblxyXG4gICAgcG9zaXRpb25BdCh0cmlnZ2VyLCB0b29sdGlwLCBwb3MpO1xyXG59XHJcblxyXG4vKipcclxuICogQ3JlYXRlIHRvb2x0aXAgZWxlbWVudFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IEVsZW1lbnQgd2hpY2ggdGhlIHRvb2x0aXAgaXMgYXR0YWNoZWRcclxuICogQHBhcmFtIHtzdHJpbmd9IHBvcyBQb3NpdGlvbiBvZiB0b29sdGlwICh0b3AgfCBib3R0b20pXHJcbiAqIEByZXR1cm5zIFxyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlVG9vbHRpcChlbGVtZW50LCBwb3MpIHtcclxuICAgIHZhciB0b29sdGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0b29sdGlwLmNsYXNzTmFtZSA9ICd0b29sdGlwLXBvcHBlcic7XHJcbiAgICB2YXIgcG9wcGVycyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rvb2x0aXAtcG9wcGVyJyk7XHJcbiAgICB2YXIgaWQgPSAndG9vbHRpcC0nICsgcG9wcGVycy5sZW5ndGggKyAxO1xyXG4gICAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpO1xyXG4gICAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndG9vbHRpcCcpO1xyXG4gICAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ3gtcGxhY2VtZW50JywgcG9zKTtcclxuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgaWQpO1xyXG5cclxuICAgIHZhciB0b29sdGlwSW5uZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRvb2x0aXBJbm5lci5jbGFzc05hbWUgPSAndG9vbHRpcCc7XHJcblxyXG4gICAgdmFyIHRvb2x0aXBBcnJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdG9vbHRpcEFycm93LmNsYXNzTmFtZSA9ICd0b29sdGlwLWFycm93JztcclxuICAgIHRvb2x0aXBJbm5lci5hcHBlbmRDaGlsZCh0b29sdGlwQXJyb3cpO1xyXG5cclxuICAgIHZhciB0b29sdGlwQ29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdG9vbHRpcENvbnRlbnQuY2xhc3NOYW1lID0gJ3Rvb2x0aXAtY29udGVudCc7XHJcbiAgICB0b29sdGlwQ29udGVudC5pbm5lckhUTUwgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10b29sdGlwJyk7XHJcbiAgICB0b29sdGlwSW5uZXIuYXBwZW5kQ2hpbGQodG9vbHRpcENvbnRlbnQpO1xyXG4gICAgdG9vbHRpcC5hcHBlbmRDaGlsZCh0b29sdGlwSW5uZXIpO1xyXG5cclxuICAgIHJldHVybiB0b29sdGlwO1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIFBvc2l0aW9ucyB0aGUgdG9vbHRpcC5cclxuICpcclxuICogQHBhcmFtIHtvYmplY3R9IHBhcmVudCAtIFRoZSB0cmlnZ2VyIG9mIHRoZSB0b29sdGlwLlxyXG4gKiBAcGFyYW0ge29iamVjdH0gdG9vbHRpcCAtIFRoZSB0b29sdGlwIGl0c2VsZi5cclxuICogQHBhcmFtIHtzdHJpbmd9IHBvc0hvcml6b250YWwgLSBEZXNpcmVkIGhvcml6b250YWwgcG9zaXRpb24gb2YgdGhlIHRvb2x0aXAgcmVsYXRpdmVseSB0byB0aGUgdHJpZ2dlciAobGVmdC9jZW50ZXIvcmlnaHQpXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwb3NWZXJ0aWNhbCAtIERlc2lyZWQgdmVydGljYWwgcG9zaXRpb24gb2YgdGhlIHRvb2x0aXAgcmVsYXRpdmVseSB0byB0aGUgdHJpZ2dlciAodG9wL2NlbnRlci9ib3R0b20pXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBwb3NpdGlvbkF0KHBhcmVudCwgdG9vbHRpcCwgcG9zKSB7XHJcbiAgICBsZXQgdHJpZ2dlciA9IHBhcmVudDtcclxuICAgIGxldCBhcnJvdyA9IHRvb2x0aXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1hcnJvdycpWzBdO1xyXG4gICAgbGV0IHRyaWdnZXJQb3NpdGlvbiA9IHBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICB2YXIgcGFyZW50Q29vcmRzID0gcGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCBsZWZ0LCB0b3A7XHJcblxyXG4gICAgdmFyIHRvb2x0aXBXaWR0aCA9IHRvb2x0aXAub2Zmc2V0V2lkdGg7XHJcblxyXG4gICAgdmFyIGRpc3QgPSAxMjtcclxuICAgIGxldCBhcnJvd0RpcmVjdGlvbiA9IFwiZG93blwiO1xyXG4gICAgbGVmdCA9IHBhcnNlSW50KHBhcmVudENvb3Jkcy5sZWZ0KSArICgocGFyZW50Lm9mZnNldFdpZHRoIC0gdG9vbHRpcC5vZmZzZXRXaWR0aCkgLyAyKTtcclxuXHJcbiAgICBzd2l0Y2ggKHBvcykge1xyXG4gICAgICAgIGNhc2UgJ2JvdHRvbSc6XHJcbiAgICAgICAgICAgIHRvcCA9IHBhcnNlSW50KHBhcmVudENvb3Jkcy5ib3R0b20pICsgZGlzdDtcclxuICAgICAgICAgICAgYXJyb3dEaXJlY3Rpb24gPSBcInVwXCI7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGNhc2UgJ3RvcCc6XHJcbiAgICAgICAgICAgIHRvcCA9IHBhcnNlSW50KHBhcmVudENvb3Jkcy50b3ApIC0gdG9vbHRpcC5vZmZzZXRIZWlnaHQgLSBkaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGlmIHRvb2x0aXAgaXMgb3V0IG9mIGJvdW5kcyBvbiBsZWZ0IHNpZGVcclxuICAgIGlmIChsZWZ0IDwgMCkge1xyXG4gICAgICAgIGxlZnQgPSBkaXN0O1xyXG4gICAgICAgIGxldCBlbmRQb3NpdGlvbk9uUGFnZSA9IHRyaWdnZXJQb3NpdGlvbi5sZWZ0ICsgKHRyaWdnZXIub2Zmc2V0V2lkdGggLyAyKTtcclxuICAgICAgICBsZXQgdG9vbHRpcEFycm93SGFsZldpZHRoID0gODtcclxuICAgICAgICBsZXQgYXJyb3dMZWZ0UG9zaXRpb24gPSBlbmRQb3NpdGlvbk9uUGFnZSAtIGRpc3QgLSB0b29sdGlwQXJyb3dIYWxmV2lkdGg7XHJcbiAgICAgICAgdG9vbHRpcC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0b29sdGlwLWFycm93JylbMF0uc3R5bGUubGVmdCA9IGFycm93TGVmdFBvc2l0aW9uICsgJ3B4JztcclxuICAgIH1cclxuXHJcbiAgICAvLyBpZiB0b29sdGlwIGlzIG91dCBvZiBib3VuZHMgb24gdGhlIGJvdHRvbSBvZiB0aGUgcGFnZVxyXG4gICAgaWYgKCh0b3AgKyB0b29sdGlwLm9mZnNldEhlaWdodCkgPj0gd2luZG93LmlubmVySGVpZ2h0KSB7XHJcbiAgICAgICAgdG9wID0gcGFyc2VJbnQocGFyZW50Q29vcmRzLnRvcCkgLSB0b29sdGlwLm9mZnNldEhlaWdodCAtIGRpc3Q7XHJcbiAgICAgICAgYXJyb3dEaXJlY3Rpb24gPSBcImRvd25cIjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBpZiB0b29sdGlwIGlzIG91dCBvZiBib3VuZHMgb24gdGhlIHRvcCBvZiB0aGUgcGFnZVxyXG4gICAgaWYgKHRvcCA8IDApIHtcclxuICAgICAgICB0b3AgPSBwYXJzZUludChwYXJlbnRDb29yZHMuYm90dG9tKSArIGRpc3Q7XHJcbiAgICAgICAgYXJyb3dEaXJlY3Rpb24gPSBcInVwXCI7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgKGxlZnQgKyB0b29sdGlwV2lkdGgpKSB7XHJcbiAgICAgICAgdG9vbHRpcC5zdHlsZS5yaWdodCA9IGRpc3QgKyAncHgnO1xyXG4gICAgICAgIGxldCBlbmRQb3NpdGlvbk9uUGFnZSA9IHRyaWdnZXJQb3NpdGlvbi5yaWdodCAtICh0cmlnZ2VyLm9mZnNldFdpZHRoIC8gMik7XHJcbiAgICAgICAgbGV0IHRvb2x0aXBBcnJvd0hhbGZXaWR0aCA9IDg7XHJcbiAgICAgICAgbGV0IGFycm93UmlnaHRQb3NpdGlvbiA9IHdpbmRvdy5pbm5lcldpZHRoIC0gZW5kUG9zaXRpb25PblBhZ2UgLSBkaXN0IC0gdG9vbHRpcEFycm93SGFsZldpZHRoO1xyXG4gICAgICAgIHRvb2x0aXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1hcnJvdycpWzBdLnN0eWxlLnJpZ2h0ID0gYXJyb3dSaWdodFBvc2l0aW9uICsgJ3B4JztcclxuICAgICAgICB0b29sdGlwLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rvb2x0aXAtYXJyb3cnKVswXS5zdHlsZS5sZWZ0ID0gJ2F1dG8nO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0b29sdGlwLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcclxuICAgIH1cclxuICAgIHRvb2x0aXAuc3R5bGUudG9wID0gdG9wICsgcGFnZVlPZmZzZXQgKyAncHgnO1xyXG4gICAgdG9vbHRpcC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0b29sdGlwLWFycm93JylbMF0uY2xhc3NMaXN0LmFkZChhcnJvd0RpcmVjdGlvbik7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBjbG9zZUFsbFRvb2x0aXBzKGV2ZW50LCBmb3JjZSA9IGZhbHNlKSB7XHJcbiAgICBpZiAoZm9yY2UgfHwgKCFldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdqcy10b29sdGlwJykgJiYgIWV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3Rvb2x0aXAnKSAmJiAhZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndG9vbHRpcC1jb250ZW50JykpKSB7XHJcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRvb2x0aXAtcG9wcGVyJyk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgdHJpZ2dlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1thcmlhLWRlc2NyaWJlZGJ5PScgKyBlbGVtZW50c1tpXS5nZXRBdHRyaWJ1dGUoJ2lkJykgKyAnXScpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS10b29sdGlwLWFjdGl2ZScpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ3Rvb2x0aXAtZm9jdXMnKTtcclxuICAgICAgICAgICAgdHJpZ2dlci5jbGFzc0xpc3QucmVtb3ZlKCd0b29sdGlwLWhvdmVyJyk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZWxlbWVudHNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY2xvc2VIb3ZlclRvb2x0aXAodHJpZ2dlcikge1xyXG4gICAgdmFyIHRvb2x0aXBJZCA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICBsZXQgdG9vbHRpcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwSWQpO1xyXG4gICAgdG9vbHRpcEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIG9uVG9vbHRpcEhvdmVyKTtcclxuICAgIHRvb2x0aXBFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBvblRvb2x0aXBIb3Zlcik7XHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsZXQgdG9vbHRpcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwSWQpO1xyXG4gICAgICAgIGlmICh0b29sdGlwRWxlbWVudCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoIXRyaWdnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKFwidG9vbHRpcC1ob3ZlclwiKSkge1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlVG9vbHRpcCh0cmlnZ2VyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sIDMwMCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uVG9vbHRpcEhvdmVyKGUpIHtcclxuICAgIGxldCB0b29sdGlwRWxlbWVudCA9IHRoaXM7XHJcblxyXG4gICAgbGV0IHRyaWdnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbYXJpYS1kZXNjcmliZWRieT0nICsgdG9vbHRpcEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpICsgJ10nKTtcclxuICAgIHRyaWdnZXIuY2xhc3NMaXN0LmFkZCgndG9vbHRpcC1ob3ZlcicpO1xyXG5cclxuICAgIHRvb2x0aXBFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbGV0IHRyaWdnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbYXJpYS1kZXNjcmliZWRieT0nICsgdG9vbHRpcEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpICsgJ10nKTtcclxuICAgICAgICBpZiAodHJpZ2dlciAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0cmlnZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ3Rvb2x0aXAtaG92ZXInKTtcclxuICAgICAgICAgICAgY2xvc2VIb3ZlclRvb2x0aXAodHJpZ2dlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZVRvb2x0aXAodHJpZ2dlcikge1xyXG4gICAgdmFyIHRvb2x0aXBJZCA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICBsZXQgdG9vbHRpcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwSWQpO1xyXG5cclxuICAgIGlmICh0b29sdGlwSWQgIT09IG51bGwgJiYgdG9vbHRpcEVsZW1lbnQgIT09IG51bGwpIHtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRvb2x0aXBFbGVtZW50KTtcclxuICAgIH1cclxuICAgIHRyaWdnZXIucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICB0cmlnZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ3Rvb2x0aXAtaG92ZXInKTtcclxuICAgIHRyaWdnZXIuY2xhc3NMaXN0LnJlbW92ZSgndG9vbHRpcC1mb2N1cycpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRvb2x0aXA7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIHByZWZpeDogJycsXHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuaW1wb3J0IEFjY29yZGlvbiBmcm9tICcuL2NvbXBvbmVudHMvYWNjb3JkaW9uJztcclxuaW1wb3J0IEFsZXJ0IGZyb20gJy4vY29tcG9uZW50cy9hbGVydCc7XHJcbmltcG9ydCBCYWNrVG9Ub3AgZnJvbSAnLi9jb21wb25lbnRzL2JhY2stdG8tdG9wJztcclxuaW1wb3J0IENoYXJhY3RlckxpbWl0IGZyb20gJy4vY29tcG9uZW50cy9jaGFyYWN0ZXItbGltaXQnO1xyXG5pbXBvcnQgQ2hlY2tib3hUb2dnbGVDb250ZW50IGZyb20gJy4vY29tcG9uZW50cy9jaGVja2JveC10b2dnbGUtY29udGVudCc7XHJcbmltcG9ydCBEcm9wZG93biBmcm9tICcuL2NvbXBvbmVudHMvZHJvcGRvd24nO1xyXG5pbXBvcnQgRHJvcGRvd25Tb3J0IGZyb20gJy4vY29tcG9uZW50cy9kcm9wZG93bi1zb3J0JztcclxuaW1wb3J0IEVycm9yU3VtbWFyeSBmcm9tICcuL2NvbXBvbmVudHMvZXJyb3Itc3VtbWFyeSc7XHJcbmltcG9ydCBJbnB1dFJlZ2V4TWFzayBmcm9tICcuL2NvbXBvbmVudHMvcmVnZXgtaW5wdXQtbWFzayc7XHJcbmltcG9ydCBNb2RhbCBmcm9tICcuL2NvbXBvbmVudHMvbW9kYWwnO1xyXG5pbXBvcnQgTmF2aWdhdGlvbiBmcm9tICcuL2NvbXBvbmVudHMvbmF2aWdhdGlvbic7XHJcbmltcG9ydCBSYWRpb1RvZ2dsZUdyb3VwIGZyb20gJy4vY29tcG9uZW50cy9yYWRpby10b2dnbGUtY29udGVudCc7XHJcbmltcG9ydCBSZXNwb25zaXZlVGFibGUgZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlJztcclxuaW1wb3J0IFRhYm5hdiBmcm9tICAnLi9jb21wb25lbnRzL3RhYm5hdic7XHJcbmltcG9ydCBUYWJsZVNlbGVjdGFibGVSb3dzIGZyb20gJy4vY29tcG9uZW50cy9zZWxlY3RhYmxlLXRhYmxlJztcclxuaW1wb3J0IFRvYXN0IGZyb20gJy4vY29tcG9uZW50cy90b2FzdCc7XHJcbmltcG9ydCBUb29sdGlwIGZyb20gJy4vY29tcG9uZW50cy90b29sdGlwJztcclxuY29uc3QgZGF0ZVBpY2tlciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9kYXRlLXBpY2tlcicpO1xyXG4vKipcclxuICogVGhlICdwb2x5ZmlsbHMnIGRlZmluZSBrZXkgRUNNQVNjcmlwdCA1IG1ldGhvZHMgdGhhdCBtYXkgYmUgbWlzc2luZyBmcm9tXHJcbiAqIG9sZGVyIGJyb3dzZXJzLCBzbyBtdXN0IGJlIGxvYWRlZCBmaXJzdC5cclxuICovXHJcbnJlcXVpcmUoJy4vcG9seWZpbGxzJyk7XHJcblxyXG4vKipcclxuICogSW5pdCBhbGwgY29tcG9uZW50c1xyXG4gKiBAcGFyYW0ge0pTT059IG9wdGlvbnMge3Njb3BlOiBIVE1MRWxlbWVudH0gLSBJbml0IGFsbCBjb21wb25lbnRzIHdpdGhpbiBzY29wZSAoZGVmYXVsdCBpcyBkb2N1bWVudClcclxuICovXHJcbnZhciBpbml0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAvLyBTZXQgdGhlIG9wdGlvbnMgdG8gYW4gZW1wdHkgb2JqZWN0IGJ5IGRlZmF1bHQgaWYgbm8gb3B0aW9ucyBhcmUgcGFzc2VkLlxyXG4gIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9ucyAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zIDoge31cclxuXHJcbiAgLy8gQWxsb3cgdGhlIHVzZXIgdG8gaW5pdGlhbGlzZSBGRFMgaW4gb25seSBjZXJ0YWluIHNlY3Rpb25zIG9mIHRoZSBwYWdlXHJcbiAgLy8gRGVmYXVsdHMgdG8gdGhlIGVudGlyZSBkb2N1bWVudCBpZiBub3RoaW5nIGlzIHNldC5cclxuICB2YXIgc2NvcGUgPSB0eXBlb2Ygb3B0aW9ucy5zY29wZSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLnNjb3BlIDogZG9jdW1lbnRcclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBBY2NvcmRpb25zXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBqc1NlbGVjdG9yQWNjb3JkaW9uID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYWNjb3JkaW9uJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JBY2NvcmRpb24ubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IEFjY29yZGlvbihqc1NlbGVjdG9yQWNjb3JkaW9uWyBjIF0pLmluaXQoKTtcclxuICB9XHJcbiAgY29uc3QganNTZWxlY3RvckFjY29yZGlvbkJvcmRlcmVkID0gc2NvcGUucXVlcnlTZWxlY3RvckFsbCgnLmFjY29yZGlvbi1ib3JkZXJlZDpub3QoLmFjY29yZGlvbiknKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckFjY29yZGlvbkJvcmRlcmVkLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBBY2NvcmRpb24oanNTZWxlY3RvckFjY29yZGlvbkJvcmRlcmVkWyBjIF0pLmluaXQoKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgQWxlcnRzXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuXHJcbiAgY29uc3QgYWxlcnRzV2l0aENsb3NlQnV0dG9uID0gc2NvcGUucXVlcnlTZWxlY3RvckFsbCgnLmFsZXJ0Lmhhcy1jbG9zZScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBhbGVydHNXaXRoQ2xvc2VCdXR0b24ubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IEFsZXJ0KGFsZXJ0c1dpdGhDbG9zZUJ1dHRvblsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIEJhY2sgdG8gdG9wIGJ1dHRvblxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcblxyXG4gIGNvbnN0IGJhY2tUb1RvcEJ1dHRvbnMgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdiYWNrLXRvLXRvcC1idXR0b24nKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwgYmFja1RvVG9wQnV0dG9ucy5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgQmFja1RvVG9wKGJhY2tUb1RvcEJ1dHRvbnNbIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBDaGFyYWN0ZXIgbGltaXRcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzQ2hhcmFjdGVyTGltaXQgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmb3JtLWxpbWl0Jyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzQ2hhcmFjdGVyTGltaXQubGVuZ3RoOyBjKyspe1xyXG5cclxuICAgIG5ldyBDaGFyYWN0ZXJMaW1pdChqc0NoYXJhY3RlckxpbWl0WyBjIF0pLmluaXQoKTtcclxuICB9XHJcbiAgXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBDaGVja2JveCBjb2xsYXBzZVxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RvckNoZWNrYm94Q29sbGFwc2UgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1jaGVja2JveC10b2dnbGUtY29udGVudCcpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yQ2hlY2tib3hDb2xsYXBzZS5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgQ2hlY2tib3hUb2dnbGVDb250ZW50KGpzU2VsZWN0b3JDaGVja2JveENvbGxhcHNlWyBjIF0pLmluaXQoKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgT3ZlcmZsb3cgbWVudVxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RvckRyb3Bkb3duID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtZHJvcGRvd24nKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckRyb3Bkb3duLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBEcm9wZG93bihqc1NlbGVjdG9yRHJvcGRvd25bIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBPdmVyZmxvdyBtZW51IHNvcnRcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JEcm9wZG93blNvcnQgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdvdmVyZmxvdy1tZW51LS1zb3J0Jyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JEcm9wZG93blNvcnQubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IERyb3Bkb3duU29ydChqc1NlbGVjdG9yRHJvcGRvd25Tb3J0WyBjIF0pLmluaXQoKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgRGF0ZXBpY2tlclxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgZGF0ZVBpY2tlci5vbihzY29wZSk7XHJcbiAgXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBFcnJvciBzdW1tYXJ5XHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICB2YXIgJGVycm9yU3VtbWFyeSA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW1vZHVsZT1cImVycm9yLXN1bW1hcnlcIl0nKTtcclxuICBuZXcgRXJyb3JTdW1tYXJ5KCRlcnJvclN1bW1hcnkpLmluaXQoKTtcclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBJbnB1dCBSZWdleCAtIHVzZWQgb24gZGF0ZSBmaWVsZHNcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JSZWdleCA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W2RhdGEtaW5wdXQtcmVnZXhdJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JSZWdleC5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgSW5wdXRSZWdleE1hc2soanNTZWxlY3RvclJlZ2V4WyBjIF0pO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBNb2RhbFxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QgbW9kYWxzID0gc2NvcGUucXVlcnlTZWxlY3RvckFsbCgnLmZkcy1tb2RhbCcpO1xyXG4gIGZvcihsZXQgZCA9IDA7IGQgPCBtb2RhbHMubGVuZ3RoOyBkKyspIHtcclxuICAgIG5ldyBNb2RhbChtb2RhbHNbZF0pLmluaXQoKTtcclxuICB9XHJcbiAgXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBOYXZpZ2F0aW9uXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBuZXcgTmF2aWdhdGlvbigpLmluaXQoKTtcclxuICAgXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBSYWRpb2J1dHRvbiBncm91cCBjb2xsYXBzZVxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RvclJhZGlvQ29sbGFwc2UgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1yYWRpby10b2dnbGUtZ3JvdXAnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvclJhZGlvQ29sbGFwc2UubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IFJhZGlvVG9nZ2xlR3JvdXAoanNTZWxlY3RvclJhZGlvQ29sbGFwc2VbIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBSZXNwb25zaXZlIHRhYmxlc1xyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RvclRhYmxlID0gc2NvcGUucXVlcnlTZWxlY3RvckFsbCgndGFibGUudGFibGUtLXJlc3BvbnNpdmUtaGVhZGVycywgdGFibGUudGFibGUtc20tcmVzcG9uc2l2ZS1oZWFkZXJzLCB0YWJsZS50YWJsZS1tZC1yZXNwb25zaXZlLWhlYWRlcnMsIHRhYmxlLnRhYmxlLWxnLXJlc3BvbnNpdmUtaGVhZGVycycpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVGFibGUubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IFJlc3BvbnNpdmVUYWJsZShqc1NlbGVjdG9yVGFibGVbIGMgXSk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIFNlbGVjdGFibGUgcm93cyBpbiB0YWJsZVxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RhYmxlVGFibGUgPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKCd0YWJsZS50YWJsZS0tc2VsZWN0YWJsZScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdGFibGVUYWJsZS5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgVGFibGVTZWxlY3RhYmxlUm93cyhqc1NlbGVjdGFibGVUYWJsZVsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIFRhYm5hdlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RvclRhYm5hdiA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhYm5hdicpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVGFibmF2Lmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBUYWJuYXYoanNTZWxlY3RvclRhYm5hdlsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIFRvb2x0aXBcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JUb29sdGlwID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtdG9vbHRpcCcpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVG9vbHRpcC5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgVG9vbHRpcChqc1NlbGVjdG9yVG9vbHRpcFsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG4gIFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7IGluaXQsIEFjY29yZGlvbiwgQWxlcnQsIEJhY2tUb1RvcCwgQ2hhcmFjdGVyTGltaXQsIENoZWNrYm94VG9nZ2xlQ29udGVudCwgRHJvcGRvd24sIERyb3Bkb3duU29ydCwgZGF0ZVBpY2tlciwgRXJyb3JTdW1tYXJ5LCBJbnB1dFJlZ2V4TWFzaywgTW9kYWwsIE5hdmlnYXRpb24sIFJhZGlvVG9nZ2xlR3JvdXAsIFJlc3BvbnNpdmVUYWJsZSwgVGFibGVTZWxlY3RhYmxlUm93cywgVGFibmF2LCBUb2FzdCwgVG9vbHRpcH07IiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgLy8gVGhpcyB1c2VkIHRvIGJlIGNvbmRpdGlvbmFsbHkgZGVwZW5kZW50IG9uIHdoZXRoZXIgdGhlXHJcbiAgLy8gYnJvd3NlciBzdXBwb3J0ZWQgdG91Y2ggZXZlbnRzOyBpZiBpdCBkaWQsIGBDTElDS2Agd2FzIHNldCB0b1xyXG4gIC8vIGB0b3VjaHN0YXJ0YC4gIEhvd2V2ZXIsIHRoaXMgaGFkIGRvd25zaWRlczpcclxuICAvL1xyXG4gIC8vICogSXQgcHJlLWVtcHRlZCBtb2JpbGUgYnJvd3NlcnMnIGRlZmF1bHQgYmVoYXZpb3Igb2YgZGV0ZWN0aW5nXHJcbiAgLy8gICB3aGV0aGVyIGEgdG91Y2ggdHVybmVkIGludG8gYSBzY3JvbGwsIHRoZXJlYnkgcHJldmVudGluZ1xyXG4gIC8vICAgdXNlcnMgZnJvbSB1c2luZyBzb21lIG9mIG91ciBjb21wb25lbnRzIGFzIHNjcm9sbCBzdXJmYWNlcy5cclxuICAvL1xyXG4gIC8vICogU29tZSBkZXZpY2VzLCBzdWNoIGFzIHRoZSBNaWNyb3NvZnQgU3VyZmFjZSBQcm8sIHN1cHBvcnQgKmJvdGgqXHJcbiAgLy8gICB0b3VjaCBhbmQgY2xpY2tzLiBUaGlzIG1lYW50IHRoZSBjb25kaXRpb25hbCBlZmZlY3RpdmVseSBkcm9wcGVkXHJcbiAgLy8gICBzdXBwb3J0IGZvciB0aGUgdXNlcidzIG1vdXNlLCBmcnVzdHJhdGluZyB1c2VycyB3aG8gcHJlZmVycmVkXHJcbiAgLy8gICBpdCBvbiB0aG9zZSBzeXN0ZW1zLlxyXG4gIENMSUNLOiAnY2xpY2snLFxyXG59O1xyXG4iLCJpbXBvcnQgJy4uLy4uL09iamVjdC9kZWZpbmVQcm9wZXJ0eSdcclxuXHJcbihmdW5jdGlvbih1bmRlZmluZWQpIHtcclxuICAvLyBEZXRlY3Rpb24gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vRmluYW5jaWFsLVRpbWVzL3BvbHlmaWxsLXNlcnZpY2UvYmxvYi9tYXN0ZXIvcGFja2FnZXMvcG9seWZpbGwtbGlicmFyeS9wb2x5ZmlsbHMvRnVuY3Rpb24vcHJvdG90eXBlL2JpbmQvZGV0ZWN0LmpzXHJcbiAgdmFyIGRldGVjdCA9ICdiaW5kJyBpbiBGdW5jdGlvbi5wcm90b3R5cGVcclxuXHJcbiAgaWYgKGRldGVjdCkgcmV0dXJuXHJcblxyXG4gIC8vIFBvbHlmaWxsIGZyb20gaHR0cHM6Ly9jZG4ucG9seWZpbGwuaW8vdjIvcG9seWZpbGwuanM/ZmVhdHVyZXM9RnVuY3Rpb24ucHJvdG90eXBlLmJpbmQmZmxhZ3M9YWx3YXlzXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZ1bmN0aW9uLnByb3RvdHlwZSwgJ2JpbmQnLCB7XHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBiaW5kKHRoYXQpIHsgLy8gLmxlbmd0aCBpcyAxXHJcbiAgICAgICAgICAvLyBhZGQgbmVjZXNzYXJ5IGVzNS1zaGltIHV0aWxpdGllc1xyXG4gICAgICAgICAgdmFyICRBcnJheSA9IEFycmF5O1xyXG4gICAgICAgICAgdmFyICRPYmplY3QgPSBPYmplY3Q7XHJcbiAgICAgICAgICB2YXIgT2JqZWN0UHJvdG90eXBlID0gJE9iamVjdC5wcm90b3R5cGU7XHJcbiAgICAgICAgICB2YXIgQXJyYXlQcm90b3R5cGUgPSAkQXJyYXkucHJvdG90eXBlO1xyXG4gICAgICAgICAgdmFyIEVtcHR5ID0gZnVuY3Rpb24gRW1wdHkoKSB7fTtcclxuICAgICAgICAgIHZhciB0b19zdHJpbmcgPSBPYmplY3RQcm90b3R5cGUudG9TdHJpbmc7XHJcbiAgICAgICAgICB2YXIgaGFzVG9TdHJpbmdUYWcgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnO1xyXG4gICAgICAgICAgdmFyIGlzQ2FsbGFibGU7IC8qIGlubGluZWQgZnJvbSBodHRwczovL25wbWpzLmNvbS9pcy1jYWxsYWJsZSAqLyB2YXIgZm5Ub1N0ciA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZywgdHJ5RnVuY3Rpb25PYmplY3QgPSBmdW5jdGlvbiB0cnlGdW5jdGlvbk9iamVjdCh2YWx1ZSkgeyB0cnkgeyBmblRvU3RyLmNhbGwodmFsdWUpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfSwgZm5DbGFzcyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsIGdlbkNsYXNzID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJzsgaXNDYWxsYWJsZSA9IGZ1bmN0aW9uIGlzQ2FsbGFibGUodmFsdWUpIHsgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Z1bmN0aW9uJykgeyByZXR1cm4gZmFsc2U7IH0gaWYgKGhhc1RvU3RyaW5nVGFnKSB7IHJldHVybiB0cnlGdW5jdGlvbk9iamVjdCh2YWx1ZSk7IH0gdmFyIHN0ckNsYXNzID0gdG9fc3RyaW5nLmNhbGwodmFsdWUpOyByZXR1cm4gc3RyQ2xhc3MgPT09IGZuQ2xhc3MgfHwgc3RyQ2xhc3MgPT09IGdlbkNsYXNzOyB9O1xyXG4gICAgICAgICAgdmFyIGFycmF5X3NsaWNlID0gQXJyYXlQcm90b3R5cGUuc2xpY2U7XHJcbiAgICAgICAgICB2YXIgYXJyYXlfY29uY2F0ID0gQXJyYXlQcm90b3R5cGUuY29uY2F0O1xyXG4gICAgICAgICAgdmFyIGFycmF5X3B1c2ggPSBBcnJheVByb3RvdHlwZS5wdXNoO1xyXG4gICAgICAgICAgdmFyIG1heCA9IE1hdGgubWF4O1xyXG4gICAgICAgICAgLy8gL2FkZCBuZWNlc3NhcnkgZXM1LXNoaW0gdXRpbGl0aWVzXHJcblxyXG4gICAgICAgICAgLy8gMS4gTGV0IFRhcmdldCBiZSB0aGUgdGhpcyB2YWx1ZS5cclxuICAgICAgICAgIHZhciB0YXJnZXQgPSB0aGlzO1xyXG4gICAgICAgICAgLy8gMi4gSWYgSXNDYWxsYWJsZShUYXJnZXQpIGlzIGZhbHNlLCB0aHJvdyBhIFR5cGVFcnJvciBleGNlcHRpb24uXHJcbiAgICAgICAgICBpZiAoIWlzQ2FsbGFibGUodGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Z1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGNhbGxlZCBvbiBpbmNvbXBhdGlibGUgJyArIHRhcmdldCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyAzLiBMZXQgQSBiZSBhIG5ldyAocG9zc2libHkgZW1wdHkpIGludGVybmFsIGxpc3Qgb2YgYWxsIG9mIHRoZVxyXG4gICAgICAgICAgLy8gICBhcmd1bWVudCB2YWx1ZXMgcHJvdmlkZWQgYWZ0ZXIgdGhpc0FyZyAoYXJnMSwgYXJnMiBldGMpLCBpbiBvcmRlci5cclxuICAgICAgICAgIC8vIFhYWCBzbGljZWRBcmdzIHdpbGwgc3RhbmQgaW4gZm9yIFwiQVwiIGlmIHVzZWRcclxuICAgICAgICAgIHZhciBhcmdzID0gYXJyYXlfc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpOyAvLyBmb3Igbm9ybWFsIGNhbGxcclxuICAgICAgICAgIC8vIDQuIExldCBGIGJlIGEgbmV3IG5hdGl2ZSBFQ01BU2NyaXB0IG9iamVjdC5cclxuICAgICAgICAgIC8vIDExLiBTZXQgdGhlIFtbUHJvdG90eXBlXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiB0byB0aGUgc3RhbmRhcmRcclxuICAgICAgICAgIC8vICAgYnVpbHQtaW4gRnVuY3Rpb24gcHJvdG90eXBlIG9iamVjdCBhcyBzcGVjaWZpZWQgaW4gMTUuMy4zLjEuXHJcbiAgICAgICAgICAvLyAxMi4gU2V0IHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIGFzIGRlc2NyaWJlZCBpblxyXG4gICAgICAgICAgLy8gICAxNS4zLjQuNS4xLlxyXG4gICAgICAgICAgLy8gMTMuIFNldCB0aGUgW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIGFzIGRlc2NyaWJlZCBpblxyXG4gICAgICAgICAgLy8gICAxNS4zLjQuNS4yLlxyXG4gICAgICAgICAgLy8gMTQuIFNldCB0aGUgW1tIYXNJbnN0YW5jZV1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgYXMgZGVzY3JpYmVkIGluXHJcbiAgICAgICAgICAvLyAgIDE1LjMuNC41LjMuXHJcbiAgICAgICAgICB2YXIgYm91bmQ7XHJcbiAgICAgICAgICB2YXIgYmluZGVyID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIGJvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vIDE1LjMuNC41LjIgW1tDb25zdHJ1Y3RdXVxyXG4gICAgICAgICAgICAgICAgICAvLyBXaGVuIHRoZSBbW0NvbnN0cnVjdF1dIGludGVybmFsIG1ldGhvZCBvZiBhIGZ1bmN0aW9uIG9iamVjdCxcclxuICAgICAgICAgICAgICAgICAgLy8gRiB0aGF0IHdhcyBjcmVhdGVkIHVzaW5nIHRoZSBiaW5kIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGFcclxuICAgICAgICAgICAgICAgICAgLy8gbGlzdCBvZiBhcmd1bWVudHMgRXh0cmFBcmdzLCB0aGUgZm9sbG93aW5nIHN0ZXBzIGFyZSB0YWtlbjpcclxuICAgICAgICAgICAgICAgICAgLy8gMS4gTGV0IHRhcmdldCBiZSB0aGUgdmFsdWUgb2YgRidzIFtbVGFyZ2V0RnVuY3Rpb25dXVxyXG4gICAgICAgICAgICAgICAgICAvLyAgIGludGVybmFsIHByb3BlcnR5LlxyXG4gICAgICAgICAgICAgICAgICAvLyAyLiBJZiB0YXJnZXQgaGFzIG5vIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgbWV0aG9kLCBhXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgVHlwZUVycm9yIGV4Y2VwdGlvbiBpcyB0aHJvd24uXHJcbiAgICAgICAgICAgICAgICAgIC8vIDMuIExldCBib3VuZEFyZ3MgYmUgdGhlIHZhbHVlIG9mIEYncyBbW0JvdW5kQXJnc11dIGludGVybmFsXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXHJcbiAgICAgICAgICAgICAgICAgIC8vIDQuIExldCBhcmdzIGJlIGEgbmV3IGxpc3QgY29udGFpbmluZyB0aGUgc2FtZSB2YWx1ZXMgYXMgdGhlXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgbGlzdCBib3VuZEFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIgZm9sbG93ZWQgYnkgdGhlIHNhbWVcclxuICAgICAgICAgICAgICAgICAgLy8gICB2YWx1ZXMgYXMgdGhlIGxpc3QgRXh0cmFBcmdzIGluIHRoZSBzYW1lIG9yZGVyLlxyXG4gICAgICAgICAgICAgICAgICAvLyA1LiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0NvbnN0cnVjdF1dIGludGVybmFsXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgbWV0aG9kIG9mIHRhcmdldCBwcm92aWRpbmcgYXJncyBhcyB0aGUgYXJndW1lbnRzLlxyXG5cclxuICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRhcmdldC5hcHBseShcclxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICBhcnJheV9jb25jYXQuY2FsbChhcmdzLCBhcnJheV9zbGljZS5jYWxsKGFyZ3VtZW50cykpXHJcbiAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgIGlmICgkT2JqZWN0KHJlc3VsdCkgPT09IHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgLy8gMTUuMy40LjUuMSBbW0NhbGxdXVxyXG4gICAgICAgICAgICAgICAgICAvLyBXaGVuIHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2Qgb2YgYSBmdW5jdGlvbiBvYmplY3QsIEYsXHJcbiAgICAgICAgICAgICAgICAgIC8vIHdoaWNoIHdhcyBjcmVhdGVkIHVzaW5nIHRoZSBiaW5kIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGFcclxuICAgICAgICAgICAgICAgICAgLy8gdGhpcyB2YWx1ZSBhbmQgYSBsaXN0IG9mIGFyZ3VtZW50cyBFeHRyYUFyZ3MsIHRoZSBmb2xsb3dpbmdcclxuICAgICAgICAgICAgICAgICAgLy8gc3RlcHMgYXJlIHRha2VuOlxyXG4gICAgICAgICAgICAgICAgICAvLyAxLiBMZXQgYm91bmRBcmdzIGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tCb3VuZEFyZ3NdXSBpbnRlcm5hbFxyXG4gICAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxyXG4gICAgICAgICAgICAgICAgICAvLyAyLiBMZXQgYm91bmRUaGlzIGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tCb3VuZFRoaXNdXSBpbnRlcm5hbFxyXG4gICAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxyXG4gICAgICAgICAgICAgICAgICAvLyAzLiBMZXQgdGFyZ2V0IGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tUYXJnZXRGdW5jdGlvbl1dIGludGVybmFsXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXHJcbiAgICAgICAgICAgICAgICAgIC8vIDQuIExldCBhcmdzIGJlIGEgbmV3IGxpc3QgY29udGFpbmluZyB0aGUgc2FtZSB2YWx1ZXMgYXMgdGhlXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgbGlzdCBib3VuZEFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIgZm9sbG93ZWQgYnkgdGhlIHNhbWVcclxuICAgICAgICAgICAgICAgICAgLy8gICB2YWx1ZXMgYXMgdGhlIGxpc3QgRXh0cmFBcmdzIGluIHRoZSBzYW1lIG9yZGVyLlxyXG4gICAgICAgICAgICAgICAgICAvLyA1LiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2RcclxuICAgICAgICAgICAgICAgICAgLy8gICBvZiB0YXJnZXQgcHJvdmlkaW5nIGJvdW5kVGhpcyBhcyB0aGUgdGhpcyB2YWx1ZSBhbmRcclxuICAgICAgICAgICAgICAgICAgLy8gICBwcm92aWRpbmcgYXJncyBhcyB0aGUgYXJndW1lbnRzLlxyXG5cclxuICAgICAgICAgICAgICAgICAgLy8gZXF1aXY6IHRhcmdldC5jYWxsKHRoaXMsIC4uLmJvdW5kQXJncywgLi4uYXJncylcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5hcHBseShcclxuICAgICAgICAgICAgICAgICAgICAgIHRoYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICBhcnJheV9jb25jYXQuY2FsbChhcmdzLCBhcnJheV9zbGljZS5jYWxsKGFyZ3VtZW50cykpXHJcbiAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIC8vIDE1LiBJZiB0aGUgW1tDbGFzc11dIGludGVybmFsIHByb3BlcnR5IG9mIFRhcmdldCBpcyBcIkZ1bmN0aW9uXCIsIHRoZW5cclxuICAgICAgICAgIC8vICAgICBhLiBMZXQgTCBiZSB0aGUgbGVuZ3RoIHByb3BlcnR5IG9mIFRhcmdldCBtaW51cyB0aGUgbGVuZ3RoIG9mIEEuXHJcbiAgICAgICAgICAvLyAgICAgYi4gU2V0IHRoZSBsZW5ndGggb3duIHByb3BlcnR5IG9mIEYgdG8gZWl0aGVyIDAgb3IgTCwgd2hpY2hldmVyIGlzXHJcbiAgICAgICAgICAvLyAgICAgICBsYXJnZXIuXHJcbiAgICAgICAgICAvLyAxNi4gRWxzZSBzZXQgdGhlIGxlbmd0aCBvd24gcHJvcGVydHkgb2YgRiB0byAwLlxyXG5cclxuICAgICAgICAgIHZhciBib3VuZExlbmd0aCA9IG1heCgwLCB0YXJnZXQubGVuZ3RoIC0gYXJncy5sZW5ndGgpO1xyXG5cclxuICAgICAgICAgIC8vIDE3LiBTZXQgdGhlIGF0dHJpYnV0ZXMgb2YgdGhlIGxlbmd0aCBvd24gcHJvcGVydHkgb2YgRiB0byB0aGUgdmFsdWVzXHJcbiAgICAgICAgICAvLyAgIHNwZWNpZmllZCBpbiAxNS4zLjUuMS5cclxuICAgICAgICAgIHZhciBib3VuZEFyZ3MgPSBbXTtcclxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm91bmRMZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgIGFycmF5X3B1c2guY2FsbChib3VuZEFyZ3MsICckJyArIGkpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIFhYWCBCdWlsZCBhIGR5bmFtaWMgZnVuY3Rpb24gd2l0aCBkZXNpcmVkIGFtb3VudCBvZiBhcmd1bWVudHMgaXMgdGhlIG9ubHlcclxuICAgICAgICAgIC8vIHdheSB0byBzZXQgdGhlIGxlbmd0aCBwcm9wZXJ0eSBvZiBhIGZ1bmN0aW9uLlxyXG4gICAgICAgICAgLy8gSW4gZW52aXJvbm1lbnRzIHdoZXJlIENvbnRlbnQgU2VjdXJpdHkgUG9saWNpZXMgZW5hYmxlZCAoQ2hyb21lIGV4dGVuc2lvbnMsXHJcbiAgICAgICAgICAvLyBmb3IgZXguKSBhbGwgdXNlIG9mIGV2YWwgb3IgRnVuY3Rpb24gY29zdHJ1Y3RvciB0aHJvd3MgYW4gZXhjZXB0aW9uLlxyXG4gICAgICAgICAgLy8gSG93ZXZlciBpbiBhbGwgb2YgdGhlc2UgZW52aXJvbm1lbnRzIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGV4aXN0c1xyXG4gICAgICAgICAgLy8gYW5kIHNvIHRoaXMgY29kZSB3aWxsIG5ldmVyIGJlIGV4ZWN1dGVkLlxyXG4gICAgICAgICAgYm91bmQgPSBGdW5jdGlvbignYmluZGVyJywgJ3JldHVybiBmdW5jdGlvbiAoJyArIGJvdW5kQXJncy5qb2luKCcsJykgKyAnKXsgcmV0dXJuIGJpbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9JykoYmluZGVyKTtcclxuXHJcbiAgICAgICAgICBpZiAodGFyZ2V0LnByb3RvdHlwZSkge1xyXG4gICAgICAgICAgICAgIEVtcHR5LnByb3RvdHlwZSA9IHRhcmdldC5wcm90b3R5cGU7XHJcbiAgICAgICAgICAgICAgYm91bmQucHJvdG90eXBlID0gbmV3IEVtcHR5KCk7XHJcbiAgICAgICAgICAgICAgLy8gQ2xlYW4gdXAgZGFuZ2xpbmcgcmVmZXJlbmNlcy5cclxuICAgICAgICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSBudWxsO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICAgIC8vIDE4LiBTZXQgdGhlIFtbRXh0ZW5zaWJsZV1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgdG8gdHJ1ZS5cclxuXHJcbiAgICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgICAvLyAxOS4gTGV0IHRocm93ZXIgYmUgdGhlIFtbVGhyb3dUeXBlRXJyb3JdXSBmdW5jdGlvbiBPYmplY3QgKDEzLjIuMykuXHJcbiAgICAgICAgICAvLyAyMC4gQ2FsbCB0aGUgW1tEZWZpbmVPd25Qcm9wZXJ0eV1dIGludGVybmFsIG1ldGhvZCBvZiBGIHdpdGhcclxuICAgICAgICAgIC8vICAgYXJndW1lbnRzIFwiY2FsbGVyXCIsIFByb3BlcnR5RGVzY3JpcHRvciB7W1tHZXRdXTogdGhyb3dlciwgW1tTZXRdXTpcclxuICAgICAgICAgIC8vICAgdGhyb3dlciwgW1tFbnVtZXJhYmxlXV06IGZhbHNlLCBbW0NvbmZpZ3VyYWJsZV1dOiBmYWxzZX0sIGFuZFxyXG4gICAgICAgICAgLy8gICBmYWxzZS5cclxuICAgICAgICAgIC8vIDIxLiBDYWxsIHRoZSBbW0RlZmluZU93blByb3BlcnR5XV0gaW50ZXJuYWwgbWV0aG9kIG9mIEYgd2l0aFxyXG4gICAgICAgICAgLy8gICBhcmd1bWVudHMgXCJhcmd1bWVudHNcIiwgUHJvcGVydHlEZXNjcmlwdG9yIHtbW0dldF1dOiB0aHJvd2VyLFxyXG4gICAgICAgICAgLy8gICBbW1NldF1dOiB0aHJvd2VyLCBbW0VudW1lcmFibGVdXTogZmFsc2UsIFtbQ29uZmlndXJhYmxlXV06IGZhbHNlfSxcclxuICAgICAgICAgIC8vICAgYW5kIGZhbHNlLlxyXG5cclxuICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICAgIC8vIE5PVEUgRnVuY3Rpb24gb2JqZWN0cyBjcmVhdGVkIHVzaW5nIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGRvIG5vdFxyXG4gICAgICAgICAgLy8gaGF2ZSBhIHByb3RvdHlwZSBwcm9wZXJ0eSBvciB0aGUgW1tDb2RlXV0sIFtbRm9ybWFsUGFyYW1ldGVyc11dLCBhbmRcclxuICAgICAgICAgIC8vIFtbU2NvcGVdXSBpbnRlcm5hbCBwcm9wZXJ0aWVzLlxyXG4gICAgICAgICAgLy8gWFhYIGNhbid0IGRlbGV0ZSBwcm90b3R5cGUgaW4gcHVyZS1qcy5cclxuXHJcbiAgICAgICAgICAvLyAyMi4gUmV0dXJuIEYuXHJcbiAgICAgICAgICByZXR1cm4gYm91bmQ7XHJcbiAgICAgIH1cclxuICB9KTtcclxufSlcclxuLmNhbGwoJ29iamVjdCcgPT09IHR5cGVvZiB3aW5kb3cgJiYgd2luZG93IHx8ICdvYmplY3QnID09PSB0eXBlb2Ygc2VsZiAmJiBzZWxmIHx8ICdvYmplY3QnID09PSB0eXBlb2YgZ2xvYmFsICYmIGdsb2JhbCB8fCB7fSk7XHJcbiIsIihmdW5jdGlvbih1bmRlZmluZWQpIHtcclxuXHJcbi8vIERldGVjdGlvbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9GaW5hbmNpYWwtVGltZXMvcG9seWZpbGwtc2VydmljZS9ibG9iL21hc3Rlci9wYWNrYWdlcy9wb2x5ZmlsbC1saWJyYXJ5L3BvbHlmaWxscy9PYmplY3QvZGVmaW5lUHJvcGVydHkvZGV0ZWN0LmpzXHJcbnZhciBkZXRlY3QgPSAoXHJcbiAgLy8gSW4gSUU4LCBkZWZpbmVQcm9wZXJ0eSBjb3VsZCBvbmx5IGFjdCBvbiBET00gZWxlbWVudHMsIHNvIGZ1bGwgc3VwcG9ydFxyXG4gIC8vIGZvciB0aGUgZmVhdHVyZSByZXF1aXJlcyB0aGUgYWJpbGl0eSB0byBzZXQgYSBwcm9wZXJ0eSBvbiBhbiBhcmJpdHJhcnkgb2JqZWN0XHJcbiAgJ2RlZmluZVByb3BlcnR5JyBpbiBPYmplY3QgJiYgKGZ1bmN0aW9uKCkge1xyXG4gIFx0dHJ5IHtcclxuICBcdFx0dmFyIGEgPSB7fTtcclxuICBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGEsICd0ZXN0Jywge3ZhbHVlOjQyfSk7XHJcbiAgXHRcdHJldHVybiB0cnVlO1xyXG4gIFx0fSBjYXRjaChlKSB7XHJcbiAgXHRcdHJldHVybiBmYWxzZVxyXG4gIFx0fVxyXG4gIH0oKSlcclxuKVxyXG5cclxuaWYgKGRldGVjdCkgcmV0dXJuXHJcblxyXG4vLyBQb2x5ZmlsbCBmcm9tIGh0dHBzOi8vY2RuLnBvbHlmaWxsLmlvL3YyL3BvbHlmaWxsLmpzP2ZlYXR1cmVzPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSZmbGFncz1hbHdheXNcclxuKGZ1bmN0aW9uIChuYXRpdmVEZWZpbmVQcm9wZXJ0eSkge1xyXG5cclxuXHR2YXIgc3VwcG9ydHNBY2Nlc3NvcnMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KCdfX2RlZmluZUdldHRlcl9fJyk7XHJcblx0dmFyIEVSUl9BQ0NFU1NPUlNfTk9UX1NVUFBPUlRFRCA9ICdHZXR0ZXJzICYgc2V0dGVycyBjYW5ub3QgYmUgZGVmaW5lZCBvbiB0aGlzIGphdmFzY3JpcHQgZW5naW5lJztcclxuXHR2YXIgRVJSX1ZBTFVFX0FDQ0VTU09SUyA9ICdBIHByb3BlcnR5IGNhbm5vdCBib3RoIGhhdmUgYWNjZXNzb3JzIGFuZCBiZSB3cml0YWJsZSBvciBoYXZlIGEgdmFsdWUnO1xyXG5cclxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5LCBkZXNjcmlwdG9yKSB7XHJcblxyXG5cdFx0Ly8gV2hlcmUgbmF0aXZlIHN1cHBvcnQgZXhpc3RzLCBhc3N1bWUgaXRcclxuXHRcdGlmIChuYXRpdmVEZWZpbmVQcm9wZXJ0eSAmJiAob2JqZWN0ID09PSB3aW5kb3cgfHwgb2JqZWN0ID09PSBkb2N1bWVudCB8fCBvYmplY3QgPT09IEVsZW1lbnQucHJvdG90eXBlIHx8IG9iamVjdCBpbnN0YW5jZW9mIEVsZW1lbnQpKSB7XHJcblx0XHRcdHJldHVybiBuYXRpdmVEZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5LCBkZXNjcmlwdG9yKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAob2JqZWN0ID09PSBudWxsIHx8ICEob2JqZWN0IGluc3RhbmNlb2YgT2JqZWN0IHx8IHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnKSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuZGVmaW5lUHJvcGVydHkgY2FsbGVkIG9uIG5vbi1vYmplY3QnKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIShkZXNjcmlwdG9yIGluc3RhbmNlb2YgT2JqZWN0KSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm9wZXJ0eSBkZXNjcmlwdGlvbiBtdXN0IGJlIGFuIG9iamVjdCcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBwcm9wZXJ0eVN0cmluZyA9IFN0cmluZyhwcm9wZXJ0eSk7XHJcblx0XHR2YXIgaGFzVmFsdWVPcldyaXRhYmxlID0gJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yIHx8ICd3cml0YWJsZScgaW4gZGVzY3JpcHRvcjtcclxuXHRcdHZhciBnZXR0ZXJUeXBlID0gJ2dldCcgaW4gZGVzY3JpcHRvciAmJiB0eXBlb2YgZGVzY3JpcHRvci5nZXQ7XHJcblx0XHR2YXIgc2V0dGVyVHlwZSA9ICdzZXQnIGluIGRlc2NyaXB0b3IgJiYgdHlwZW9mIGRlc2NyaXB0b3Iuc2V0O1xyXG5cclxuXHRcdC8vIGhhbmRsZSBkZXNjcmlwdG9yLmdldFxyXG5cdFx0aWYgKGdldHRlclR5cGUpIHtcclxuXHRcdFx0aWYgKGdldHRlclR5cGUgIT09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdHZXR0ZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFzdXBwb3J0c0FjY2Vzc29ycykge1xyXG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX0FDQ0VTU09SU19OT1RfU1VQUE9SVEVEKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoaGFzVmFsdWVPcldyaXRhYmxlKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihFUlJfVkFMVUVfQUNDRVNTT1JTKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRPYmplY3QuX19kZWZpbmVHZXR0ZXJfXy5jYWxsKG9iamVjdCwgcHJvcGVydHlTdHJpbmcsIGRlc2NyaXB0b3IuZ2V0KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdG9iamVjdFtwcm9wZXJ0eVN0cmluZ10gPSBkZXNjcmlwdG9yLnZhbHVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGhhbmRsZSBkZXNjcmlwdG9yLnNldFxyXG5cdFx0aWYgKHNldHRlclR5cGUpIHtcclxuXHRcdFx0aWYgKHNldHRlclR5cGUgIT09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdTZXR0ZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFzdXBwb3J0c0FjY2Vzc29ycykge1xyXG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX0FDQ0VTU09SU19OT1RfU1VQUE9SVEVEKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoaGFzVmFsdWVPcldyaXRhYmxlKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihFUlJfVkFMVUVfQUNDRVNTT1JTKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRPYmplY3QuX19kZWZpbmVTZXR0ZXJfXy5jYWxsKG9iamVjdCwgcHJvcGVydHlTdHJpbmcsIGRlc2NyaXB0b3Iuc2V0KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBPSyB0byBkZWZpbmUgdmFsdWUgdW5jb25kaXRpb25hbGx5IC0gaWYgYSBnZXR0ZXIgaGFzIGJlZW4gc3BlY2lmaWVkIGFzIHdlbGwsIGFuIGVycm9yIHdvdWxkIGJlIHRocm93biBhYm92ZVxyXG5cdFx0aWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikge1xyXG5cdFx0XHRvYmplY3RbcHJvcGVydHlTdHJpbmddID0gZGVzY3JpcHRvci52YWx1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gb2JqZWN0O1xyXG5cdH07XHJcbn0oT2JqZWN0LmRlZmluZVByb3BlcnR5KSk7XHJcbn0pXHJcbi5jYWxsKCdvYmplY3QnID09PSB0eXBlb2Ygd2luZG93ICYmIHdpbmRvdyB8fCAnb2JqZWN0JyA9PT0gdHlwZW9mIHNlbGYgJiYgc2VsZiB8fCAnb2JqZWN0JyA9PT0gdHlwZW9mIGdsb2JhbCAmJiBnbG9iYWwgfHwge30pO1xyXG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBjb25zaXN0ZW50LXJldHVybiAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBmdW5jLW5hbWVzICovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhbHNlO1xyXG5cclxuICBmdW5jdGlvbiBDdXN0b21FdmVudChldmVudCwgX3BhcmFtcykge1xyXG4gICAgY29uc3QgcGFyYW1zID0gX3BhcmFtcyB8fCB7XHJcbiAgICAgIGJ1YmJsZXM6IGZhbHNlLFxyXG4gICAgICBjYW5jZWxhYmxlOiBmYWxzZSxcclxuICAgICAgZGV0YWlsOiBudWxsLFxyXG4gICAgfTtcclxuICAgIGNvbnN0IGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiQ3VzdG9tRXZlbnRcIik7XHJcbiAgICBldnQuaW5pdEN1c3RvbUV2ZW50KFxyXG4gICAgICBldmVudCxcclxuICAgICAgcGFyYW1zLmJ1YmJsZXMsXHJcbiAgICAgIHBhcmFtcy5jYW5jZWxhYmxlLFxyXG4gICAgICBwYXJhbXMuZGV0YWlsXHJcbiAgICApO1xyXG4gICAgcmV0dXJuIGV2dDtcclxuICB9XHJcblxyXG4gIHdpbmRvdy5DdXN0b21FdmVudCA9IEN1c3RvbUV2ZW50O1xyXG59KSgpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IGVscHJvdG8gPSB3aW5kb3cuSFRNTEVsZW1lbnQucHJvdG90eXBlO1xyXG5jb25zdCBISURERU4gPSAnaGlkZGVuJztcclxuXHJcbmlmICghKEhJRERFTiBpbiBlbHByb3RvKSkge1xyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbHByb3RvLCBISURERU4sIHtcclxuICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoSElEREVOKTtcclxuICAgIH0sXHJcbiAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShISURERU4sICcnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZShISURERU4pO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0pO1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLy8gcG9seWZpbGxzIEhUTUxFbGVtZW50LnByb3RvdHlwZS5jbGFzc0xpc3QgYW5kIERPTVRva2VuTGlzdFxyXG5yZXF1aXJlKCdjbGFzc2xpc3QtcG9seWZpbGwnKTtcclxuLy8gcG9seWZpbGxzIEhUTUxFbGVtZW50LnByb3RvdHlwZS5oaWRkZW5cclxucmVxdWlyZSgnLi9lbGVtZW50LWhpZGRlbicpO1xyXG5cclxuLy8gcG9seWZpbGxzIE51bWJlci5pc05hTigpXHJcbnJlcXVpcmUoXCIuL251bWJlci1pcy1uYW5cIik7XHJcblxyXG4vLyBwb2x5ZmlsbHMgQ3VzdG9tRXZlbnRcclxucmVxdWlyZShcIi4vY3VzdG9tLWV2ZW50XCIpO1xyXG5cclxucmVxdWlyZSgnY29yZS1qcy9mbi9vYmplY3QvYXNzaWduJyk7XHJcbnJlcXVpcmUoJ2NvcmUtanMvZm4vYXJyYXkvZnJvbScpOyIsIk51bWJlci5pc05hTiA9XHJcbiAgTnVtYmVyLmlzTmFOIHx8XHJcbiAgZnVuY3Rpb24gaXNOYU4oaW5wdXQpIHtcclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcclxuICAgIHJldHVybiB0eXBlb2YgaW5wdXQgPT09IFwibnVtYmVyXCIgJiYgaW5wdXQgIT09IGlucHV0O1xyXG4gIH07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gKGh0bWxEb2N1bWVudCA9IGRvY3VtZW50KSA9PiBodG1sRG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcclxuIiwiY29uc3QgYXNzaWduID0gcmVxdWlyZShcIm9iamVjdC1hc3NpZ25cIik7XHJcbmNvbnN0IHJlY2VwdG9yID0gcmVxdWlyZShcInJlY2VwdG9yXCIpO1xyXG5cclxuLyoqXHJcbiAqIEBuYW1lIHNlcXVlbmNlXHJcbiAqIEBwYXJhbSB7Li4uRnVuY3Rpb259IHNlcSBhbiBhcnJheSBvZiBmdW5jdGlvbnNcclxuICogQHJldHVybiB7IGNsb3N1cmUgfSBjYWxsSG9va3NcclxuICovXHJcbi8vIFdlIHVzZSBhIG5hbWVkIGZ1bmN0aW9uIGhlcmUgYmVjYXVzZSB3ZSB3YW50IGl0IHRvIGluaGVyaXQgaXRzIGxleGljYWwgc2NvcGVcclxuLy8gZnJvbSB0aGUgYmVoYXZpb3IgcHJvcHMgb2JqZWN0LCBub3QgZnJvbSB0aGUgbW9kdWxlXHJcbmNvbnN0IHNlcXVlbmNlID0gKC4uLnNlcSkgPT5cclxuICBmdW5jdGlvbiBjYWxsSG9va3ModGFyZ2V0ID0gZG9jdW1lbnQuYm9keSkge1xyXG4gICAgc2VxLmZvckVhY2goKG1ldGhvZCkgPT4ge1xyXG4gICAgICBpZiAodHlwZW9mIHRoaXNbbWV0aG9kXSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgdGhpc1ttZXRob2RdLmNhbGwodGhpcywgdGFyZ2V0KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbi8qKlxyXG4gKiBAbmFtZSBiZWhhdmlvclxyXG4gKiBAcGFyYW0ge29iamVjdH0gZXZlbnRzXHJcbiAqIEBwYXJhbSB7b2JqZWN0P30gcHJvcHNcclxuICogQHJldHVybiB7cmVjZXB0b3IuYmVoYXZpb3J9XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IChldmVudHMsIHByb3BzKSA9PlxyXG4gIHJlY2VwdG9yLmJlaGF2aW9yKFxyXG4gICAgZXZlbnRzLFxyXG4gICAgYXNzaWduKFxyXG4gICAgICB7XHJcbiAgICAgICAgb246IHNlcXVlbmNlKFwiaW5pdFwiLCBcImFkZFwiKSxcclxuICAgICAgICBvZmY6IHNlcXVlbmNlKFwidGVhcmRvd25cIiwgXCJyZW1vdmVcIiksXHJcbiAgICAgIH0sXHJcbiAgICAgIHByb3BzXHJcbiAgICApXHJcbiAgKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5sZXQgYnJlYWtwb2ludHMgPSB7XHJcbiAgJ3hzJzogMCxcclxuICAnc20nOiA1NzYsXHJcbiAgJ21kJzogNzY4LFxyXG4gICdsZyc6IDk5MixcclxuICAneGwnOiAxMjAwXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGJyZWFrcG9pbnRzO1xyXG4iLCIvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNzU1NzQzM1xyXG5mdW5jdGlvbiBpc0VsZW1lbnRJblZpZXdwb3J0IChlbCwgd2luPXdpbmRvdyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jRWw9ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcbiAgdmFyIHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIHJlY3QudG9wID49IDAgJiZcclxuICAgIHJlY3QubGVmdCA+PSAwICYmXHJcbiAgICByZWN0LmJvdHRvbSA8PSAod2luLmlubmVySGVpZ2h0IHx8IGRvY0VsLmNsaWVudEhlaWdodCkgJiZcclxuICAgIHJlY3QucmlnaHQgPD0gKHdpbi5pbm5lcldpZHRoIHx8IGRvY0VsLmNsaWVudFdpZHRoKVxyXG4gICk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaXNFbGVtZW50SW5WaWV3cG9ydDtcclxuIiwiLy8gaU9TIGRldGVjdGlvbiBmcm9tOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS85MDM5ODg1LzE3NzcxMFxyXG5mdW5jdGlvbiBpc0lvc0RldmljZSgpIHtcclxuICByZXR1cm4gKFxyXG4gICAgdHlwZW9mIG5hdmlnYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJlxyXG4gICAgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goLyhpUG9kfGlQaG9uZXxpUGFkKS9nKSB8fFxyXG4gICAgICAobmF2aWdhdG9yLnBsYXRmb3JtID09PSBcIk1hY0ludGVsXCIgJiYgbmF2aWdhdG9yLm1heFRvdWNoUG9pbnRzID4gMSkpICYmXHJcbiAgICAhd2luZG93Lk1TU3RyZWFtXHJcbiAgKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBpc0lvc0RldmljZTtcclxuIiwiLyoqXHJcbiAqIEBuYW1lIGlzRWxlbWVudFxyXG4gKiBAZGVzYyByZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBhcmd1bWVudCBpcyBhIERPTSBlbGVtZW50LlxyXG4gKiBAcGFyYW0ge2FueX0gdmFsdWVcclxuICogQHJldHVybiB7Ym9vbGVhbn1cclxuICovXHJcbmNvbnN0IGlzRWxlbWVudCA9ICh2YWx1ZSkgPT5cclxuICB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUubm9kZVR5cGUgPT09IDE7XHJcblxyXG4vKipcclxuICogQG5hbWUgc2VsZWN0XHJcbiAqIEBkZXNjIHNlbGVjdHMgZWxlbWVudHMgZnJvbSB0aGUgRE9NIGJ5IGNsYXNzIHNlbGVjdG9yIG9yIElEIHNlbGVjdG9yLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgLSBUaGUgc2VsZWN0b3IgdG8gdHJhdmVyc2UgdGhlIERPTSB3aXRoLlxyXG4gKiBAcGFyYW0ge0RvY3VtZW50fEhUTUxFbGVtZW50P30gY29udGV4dCAtIFRoZSBjb250ZXh0IHRvIHRyYXZlcnNlIHRoZSBET01cclxuICogICBpbi4gSWYgbm90IHByb3ZpZGVkLCBpdCBkZWZhdWx0cyB0byB0aGUgZG9jdW1lbnQuXHJcbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50W119IC0gQW4gYXJyYXkgb2YgRE9NIG5vZGVzIG9yIGFuIGVtcHR5IGFycmF5LlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSAoc2VsZWN0b3IsIGNvbnRleHQpID0+IHtcclxuICBpZiAodHlwZW9mIHNlbGVjdG9yICE9PSBcInN0cmluZ1wiKSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICBpZiAoIWNvbnRleHQgfHwgIWlzRWxlbWVudChjb250ZXh0KSkge1xyXG4gICAgY29udGV4dCA9IHdpbmRvdy5kb2N1bWVudDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wYXJhbS1yZWFzc2lnblxyXG4gIH1cclxuXHJcbiAgY29uc3Qgc2VsZWN0aW9uID0gY29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoc2VsZWN0aW9uKTtcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBFWFBBTkRFRCA9ICdhcmlhLWV4cGFuZGVkJztcclxuY29uc3QgQ09OVFJPTFMgPSAnYXJpYS1jb250cm9scyc7XHJcbmNvbnN0IEhJRERFTiA9ICdhcmlhLWhpZGRlbic7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IChidXR0b24sIGV4cGFuZGVkKSA9PiB7XHJcblxyXG4gIGlmICh0eXBlb2YgZXhwYW5kZWQgIT09ICdib29sZWFuJykge1xyXG4gICAgZXhwYW5kZWQgPSBidXR0b24uZ2V0QXR0cmlidXRlKEVYUEFOREVEKSA9PT0gJ2ZhbHNlJztcclxuICB9XHJcbiAgYnV0dG9uLnNldEF0dHJpYnV0ZShFWFBBTkRFRCwgZXhwYW5kZWQpO1xyXG4gIGNvbnN0IGlkID0gYnV0dG9uLmdldEF0dHJpYnV0ZShDT05UUk9MUyk7XHJcbiAgY29uc3QgY29udHJvbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgaWYgKCFjb250cm9scykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAnTm8gdG9nZ2xlIHRhcmdldCBmb3VuZCB3aXRoIGlkOiBcIicgKyBpZCArICdcIidcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBjb250cm9scy5zZXRBdHRyaWJ1dGUoSElEREVOLCAhZXhwYW5kZWQpO1xyXG4gIHJldHVybiBleHBhbmRlZDtcclxufTtcclxuIl19
