/******************************************************************************/
// Data
/******************************************************************************/

const { defineProperty } = Object

const ENUM = Symbol('enum')
const CONFIG = Symbol('config')

/******************************************************************************/
// Helper
/******************************************************************************/

function smartaccess (...args) {

  const definition = { }

  let key = null, backingKey = null, backingValue // eslint-disable-line one-var

  for (const arg of args) {
    const isKey = typeof arg === 'string' || typeof arg === 'symbol'
    const isFunc = typeof arg === 'function'

    // if it's a key and a key hasn't been defined yet
    if (isKey && key === null)
      key = arg

    // if it's a backing key and a backing key hasn't been
    else if (isKey && backingKey === null)
      backingKey = arg

    // if it's a function and a getter hasn't been defined yet
    else if (isFunc && !definition.get)
      definition.get = arg

    // if it's a function and a setter hasn't been defined yet
    else if (isFunc && !definition.set)
      definition.set = arg

    // if we've gotten here, whatever value left over can be used as the backing field default value
    else
      backingValue = arg

  }

  this.property(key, definition)

  if (backingKey !== null)
    this.let(backingKey, backingValue)

  // if the key and the setter were properly defined, we'll use the setter to
  // filter the backing value, in case the setter mutates it.
  if (key !== null && definition.set && backingKey !== null && backingValue !== undefined)
    this.target[key] = backingValue

  return this

}

/******************************************************************************/
// Main
/******************************************************************************/

class DefineInterface {

  constructor (target) {

    if (typeof target !== 'object' || target === null)
      throw new Error('Can only define properties on objects.')

    defineProperty(this, 'target', { value: target })
    defineProperty(this, ENUM, { value: false, writable: true })
    defineProperty(this, CONFIG, { value: false, writable: true })
  }

  get enum () {
    if (this[ENUM])
      throw new Error('Next property will already be enumerable.')

    this[ENUM] = true
    return this
  }

  get config () {
    if (this[CONFIG])
      throw new Error('Next property will already be configurable.')

    this[CONFIG] = true
    return this
  }

  property (key, definition = {}) {

    if (definition.enumerable === undefined)
      definition.enumerable = this[ENUM]

    if (definition.configurable === undefined)
      definition.configurable = this[CONFIG]

    this[ENUM] = false
    this[CONFIG] = false

    defineProperty(this.target, key, definition)
    return this

  }

  const (key, value) {
    return this.property(key, { value })
  }

  let (key, value) {
    return this.property(key, { value, writable: true })
  }

  get (key, get) {
    return this.property(key, { get })
  }

  set (key, set) {
    return this.property(key, { set })
  }

  access (...args) {
    return this::smartaccess(...args)
  }

}

/******************************************************************************/
// Exports
/******************************************************************************/

export default function define (obj) {

  if (this instanceof define)
    throw new Error('Define cannot be instanced.')

  let target = this || obj
  if (target === undefined || target === null)
    target = Object.create(null)

  return new DefineInterface(target)

}
