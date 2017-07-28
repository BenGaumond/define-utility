'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = define;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/******************************************************************************/
// Data
/******************************************************************************/

var defineProperty = Object.defineProperty;


var ENUM = Symbol('enum');
var CONFIG = Symbol('config');

/******************************************************************************/
// Helper
/******************************************************************************/

function smartaccess() {

  var definition = {};

  var key = null,
      backingKey = null,
      backingValue = void 0; // eslint-disable-line one-var

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = args[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var arg = _step.value;

      var isKey = typeof arg === 'string' || (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'symbol';
      var isFunc = typeof arg === 'function';

      // if it's a key and a key hasn't been defined yet
      if (isKey && key === null) key = arg;

      // if it's a backing key and a backing key hasn't been
      else if (isKey && backingKey === null) backingKey = arg;

        // if it's a function and a getter hasn't been defined yet
        else if (isFunc && !definition.get) definition.get = arg;

          // if it's a function and a setter hasn't been defined yet
          else if (isFunc && !definition.set) definition.set = arg;

            // if we've gotten here, whatever value left over can be used as the backing field default value
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

  this.property(key, definition);

  if (backingKey !== null) this.let(backingKey, backingValue);

  // if the key and the setter were properly defined, we'll use the setter to
  // filter the backing value, in case the setter mutates it.
  if (key !== null && definition.set && backingKey !== null && backingValue !== undefined) this.target[key] = backingValue;

  return this;
}

/******************************************************************************/
// Main
/******************************************************************************/

var DefineInterface = function () {
  function DefineInterface(target) {
    _classCallCheck(this, DefineInterface);

    if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object' || target === null) throw new Error('Can only define properties on objects.');

    defineProperty(this, 'target', { value: target });
    defineProperty(this, ENUM, { value: false, writable: true });
    defineProperty(this, CONFIG, { value: false, writable: true });
  }

  _createClass(DefineInterface, [{
    key: 'property',
    value: function property(key) {
      var definition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


      if (definition.enumerable === undefined) definition.enumerable = this[ENUM];

      if (definition.configurable === undefined) definition.configurable = this[CONFIG];

      this[ENUM] = false;
      this[CONFIG] = false;

      defineProperty(this.target, key, definition);
      return this;
    }
  }, {
    key: 'const',
    value: function _const(key, value) {
      return this.property(key, { value: value });
    }
  }, {
    key: 'let',
    value: function _let(key, value) {
      return this.property(key, { value: value, writable: true });
    }
  }, {
    key: 'get',
    value: function get(key, _get) {
      return this.property(key, { get: _get });
    }
  }, {
    key: 'set',
    value: function set(key, _set) {
      return this.property(key, { set: _set });
    }
  }, {
    key: 'access',
    value: function access() {
      return smartaccess.call.apply(smartaccess, [this].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: 'enum',
    get: function get() {
      if (this[ENUM]) throw new Error('Next property will already be enumerable.');

      this[ENUM] = true;
      return this;
    }
  }, {
    key: 'config',
    get: function get() {
      if (this[CONFIG]) throw new Error('Next property will already be configurable.');

      this[CONFIG] = true;
      return this;
    }
  }]);

  return DefineInterface;
}();

/******************************************************************************/
// Exports
/******************************************************************************/

function define(obj) {

  if (this instanceof define) throw new Error('Define cannot be instanced.');

  var target = this || obj;
  if (target === undefined || target === null) target = Object.create(null);

  return new DefineInterface(target);
}