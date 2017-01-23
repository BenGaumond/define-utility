'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = function (obj) {

  if (arguments.length > 1) throw new Error('Define only takes a single argument.');

  if (obj instanceof Object === false && STATIC) throw new TypeError('Object expected.');

  if (this !== undefined) return new Define(obj || this);

  STATIC_TARGET = obj;

  return STATIC;
};

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/******************************************************************************/
// Data
/******************************************************************************/

var defineProperty = Object.defineProperty,
    freeze = Object.freeze;


var writable = true,
    configurable = true,
    enumerable = true;

var STATIC = null,
    STATIC_TARGET = null;

/******************************************************************************/
// Helper
/******************************************************************************/

function smartaccess(that, target, definition) {

  var key = null,
      backingKey = null,
      backingValue = undefined;

  for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = args[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var arg = _step.value;

      var isKey = typeof arg === 'string' || (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'symbol';
      var isFunc = arg instanceof Function;

      //if it's a key and a key hasn't been defined yet
      if (isKey && key === null) key = arg;

      //if it's a backing key and a backing key hasn't been
      else if (isKey && backingKey === null) backingKey = arg;

        //if it's a function and a getter hasn't been defined yet
        else if (isFunc && !definition.get) definition.get = arg;

          //if it's a function and a setter hasn't been defined yet
          else if (isFunc && !definition.set) definition.set = arg;

            //if we've gotten here, whatever value left over can be used as the backing field default value
            else backingValue = arg;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  that.property(key, definition);

  if (backingKey !== null) that.let(backingKey, backingValue);

  //if the key and the setter were properly defined, we'll use the setter to
  //filter the backing value, in case the setter mutates it.
  if (key !== null && definition.set && backingKey !== null && backingValue !== null) target[key] = backingValue;

  return that;
}

/******************************************************************************/
// Define Instnace
/******************************************************************************/

var Define = function Define(obj) {
  var _this = this;

  _classCallCheck(this, Define);

  var target = function target() {
    return _this === STATIC ? STATIC_TARGET : obj;
  };

  this.property = function (key, definition) {
    defineProperty(target(), key, definition);
    return _this;
  };

  this.const = function (key, value) {
    return _this.property(key, { value: value });
  };
  this.const.enum = function (key, value) {
    return _this.property(key, { value: value, enumerable: enumerable });
  };
  this.const.config = function (key, value) {
    return _this.property(key, { value: value, configurable: configurable });
  };
  this.const.enum.config = function (key, value) {
    return _this.property(key, { value: value, configurable: configurable, enumerable: enumerable });
  };
  this.const.config.enum = this.const.enum.config;

  this.let = function (key, value) {
    return _this.property(key, { value: value, writable: writable });
  };
  this.let.enum = function (key, value) {
    return _this.property(key, { value: value, writable: writable, enumerable: enumerable });
  };
  this.let.config = function (key, value) {
    return _this.property(key, { value: value, writable: writable, configurable: configurable });
  };
  this.let.enum.config = function (key, value) {
    return _this.property(key, { value: value, writable: writable, configurable: configurable, enumerable: enumerable });
  };
  this.let.config.enum = this.let.enum.config;

  this.get = function (key, get) {
    return _this.property(key, { get: get });
  };
  this.get.enum = function (key, get) {
    return _this.property(key, { get: get, enumerable: enumerable });
  };
  this.get.config = function (key, get) {
    return _this.property(key, { get: get, configurable: configurable });
  };
  this.get.enum.config = function (key, get) {
    return _this.property(key, { get: get, configurable: configurable, enumerable: enumerable });
  };
  this.get.config.enum = this.get.enum.config;

  this.set = function (key, set) {
    return _this.property(key, { set: set });
  };
  this.set.enum = function (key, set) {
    return _this.property(key, { set: set, enumerable: enumerable });
  };
  this.set.config = function (key, set) {
    return _this.property(key, { set: set, configurable: configurable });
  };
  this.set.enum.config = function (key, set) {
    return _this.property(key, { set: set, configurable: configurable, enumerable: enumerable });
  };
  this.set.config.enum = this.set.enum.config;

  this.access = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return smartaccess.apply(undefined, [_this, target(), {}].concat(args));
  };
  this.access.enum = function () {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return smartaccess.apply(undefined, [_this, target(), { enumerable: enumerable }].concat(args));
  };
  this.access.config = function () {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return smartaccess.apply(undefined, [_this, target(), { configurable: configurable }].concat(args));
  };
  this.access.enum.config = function () {
    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    return smartaccess.apply(undefined, [_this, target(), { enumerable: enumerable, configurable: configurable }].concat(args));
  };
  this.access.config.enum = this.access.enum.config;

  freeze(this);
};

/******************************************************************************/
// Create static instance
/******************************************************************************/

STATIC = new Define();

/******************************************************************************/
// Exports
/******************************************************************************/