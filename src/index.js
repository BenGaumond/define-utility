/******************************************************************************/
// Data
/******************************************************************************/

const { defineProperty, freeze } = Object

const writable = true, configurable = true, enumerable = true

const INSTANCE_TARGET = Symbol()

let STATIC = null, STATIC_TARGET = null

/******************************************************************************/
// this
/******************************************************************************/

class Define {

  constructor(obj) {

    if (obj instanceof Object === false && STATIC)
      throw new TypeError('Object expected.')

    if (STATIC) {

      this[INSTANCE_TARGET] = obj
      this.property = (key, definition) => {
        defineProperty(this[INSTANCE_TARGET], key, definition)
        return this
      }

    } else this.property = (key, definition) => {
      defineProperty(STATIC_TARGET, key, definition)
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

    this.access             = (key, get, set) => this.property(key, { get, set })
    this.access.enum        = (key, get, set) => this.property(key, { get, set, enumerable })
    this.access.config      = (key, get, set) => this.property(key, { get, set, configurable })
    this.access.enum.config = (key, get, set) => this.property(key, { get, set, configurable, enumerable })
    this.access.config.enum = this.access.enum.config

  }

}

STATIC = freeze(new Define())

/******************************************************************************/
// Exports
/******************************************************************************/

export default function(obj) {

  if (this !== undefined)
    return new Define(obj || this)

  STATIC_TARGET = obj

  return STATIC

}
