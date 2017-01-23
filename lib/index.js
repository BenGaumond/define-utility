'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var INSTANCE_TARGET = Symbol();

var STATIC = null,
    STATIC_TARGET = null;

/******************************************************************************/
// this
/******************************************************************************/

var Define = function Define(obj) {
  var _this = this;

  _classCallCheck(this, Define);

  if (STATIC) {

    this[INSTANCE_TARGET] = obj;
    this.property = function (key, definition) {
      defineProperty(_this[INSTANCE_TARGET], key, definition);
      return _this;
    };
  } else this.property = function (key, definition) {
    defineProperty(STATIC_TARGET, key, definition);
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

  this.access = function (key, get, set) {
    return _this.property(key, { get: get, set: set });
  };
  this.access.enum = function (key, get, set) {
    return _this.property(key, { get: get, set: set, enumerable: enumerable });
  };
  this.access.config = function (key, get, set) {
    return _this.property(key, { get: get, set: set, configurable: configurable });
  };
  this.access.enum.config = function (key, get, set) {
    return _this.property(key, { get: get, set: set, configurable: configurable, enumerable: enumerable });
  };
  this.access.config.enum = this.access.enum.config;

  freeze(this);
};

STATIC = new Define();

/******************************************************************************/
// Exports
/******************************************************************************/