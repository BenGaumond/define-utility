/******************************************************************************/
// Data
/******************************************************************************/

const { defineProperty, freeze } = Object

const writable = true, configurable = true, enumerable = true

let STATIC = null, STATIC_TARGET = null

/******************************************************************************/
// Helper
/******************************************************************************/

function smartaccess(that, target, definition, ...args) {

  let key = null, backingKey = null, backingValue = undefined

  for (const arg of args) {
    const isKey = typeof arg === 'string' || typeof arg === 'symbol'
    const isFunc = arg instanceof Function

    //if it's a key and a key hasn't been defined yet
    if (isKey && key === null)
      key = arg

    //if it's a backing key and a backing key hasn't been
    else if (isKey && backingKey === null)
      backingKey = arg

    //if it's a function and a getter hasn't been defined yet
    else if (isFunc && !definition.get)
      definition.get = arg

    //if it's a function and a setter hasn't been defined yet
    else if (isFunc && !definition.set)
      definition.set = arg

    //if we've gotten here, whatever value left over can be used as the backing field default value
    else
      backingValue = arg

  }

  that.property(key, definition)

  if (backingKey !== null)
    that.let(backingKey, backingValue)

  //if the key and the setter were properly defined, we'll use the setter to
  //filter the backing value, in case the setter mutates it.
  if (key !== null && definition.set && backingKey !== null && backingValue !== null)
    target[key] = backingValue

  return that

}

/******************************************************************************/
// Define Instnace
/******************************************************************************/

class Define {

  constructor(obj) {

    const target = () => this === STATIC ? STATIC_TARGET : obj

    this.property = (key, definition) => {
      defineProperty(target(), key, definition)
      return this
    }

    this.const             = (key, value) => this.property(key, { value })
    this.const.enum        = (key, value) => this.property(key, { value, enumerable })
    this.const.config      = (key, value) => this.property(key, { value, configurable })
    this.const.enum.config = (key, value) => this.property(key, { value, configurable, enumerable })
    this.const.config.enum = this.const.enum.config

    this.let             = (key, value) => this.property(key, { value, writable })
    this.let.enum        = (key, value) => this.property(key, { value, writable , enumerable })
    this.let.config      = (key, value) => this.property(key, { value, writable , configurable })
    this.let.enum.config = (key, value) => this.property(key, { value, writable , configurable, enumerable })
    this.let.config.enum = this.let.enum.config

    this.get             = (key, get) => this.property(key, { get })
    this.get.enum        = (key, get) => this.property(key, { get, enumerable })
    this.get.config      = (key, get) => this.property(key, { get, configurable })
    this.get.enum.config = (key, get) => this.property(key, { get, configurable, enumerable })
    this.get.config.enum = this.get.enum.config

    this.set             = (key, set) => this.property(key, { set })
    this.set.enum        = (key, set) => this.property(key, { set, enumerable })
    this.set.config      = (key, set) => this.property(key, { set, configurable })
    this.set.enum.config = (key, set) => this.property(key, { set, configurable, enumerable })
    this.set.config.enum = this.set.enum.config

    this.access             = (...args) => smartaccess(this, target(), {}, ...args)
    this.access.enum        = (...args) => smartaccess(this, target(), { enumerable }, ...args)
    this.access.config      = (...args) => smartaccess(this, target(), { configurable }, ...args)
    this.access.enum.config = (...args) => smartaccess(this, target(), { enumerable, configurable }, ...args)
    this.access.config.enum = this.access.enum.config

    freeze(this)
  }

}

/******************************************************************************/
// Create static instance
/******************************************************************************/

STATIC = new Define()

/******************************************************************************/
// Exports
/******************************************************************************/

export default function(obj) {

  if (arguments.length > 1)
    throw new Error('Define only takes a single argument.')

  if (obj instanceof Object === false && STATIC)
    throw new TypeError('Object expected.')

  if (this !== undefined)
    return new Define(obj || this)

  STATIC_TARGET = obj

  return STATIC

}
