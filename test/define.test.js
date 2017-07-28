import { assert, expect } from 'chai'

import Define from '../src'

/* globals describe it */

describe('Define static function', () => {

  it('Can be called with an input or called from an input', () => {

    const obj = {}

    expect(() => Define(obj)).to.not.throw(Error)
    expect(() => obj::Define()).to.not.throw(Error)

  })

  it('Adds property definitions to an object.', () => {

    const obj = {}
    Define(obj)
      .const('foo', 'bar')

    assert(obj.foo === 'bar')

  })

  it('const property are read only. { value }', () => {

    const obj = {}
    Define(obj)
      .const('PI', Math.PI)

    expect(() => { obj.PI = 5 }).to.throw(Error)
    assert(obj.PI === Math.PI)

  })

  it('let properties are writable. { value, writable: true }', () => {

    const obj = {}
    Define(obj)
      .let('mass', 1000)

    expect(() => { obj.mass -= 900 }).to.not.throw(Error)
    assert(obj.mass === 100)

  })

  it('get, set properties are supported, and access property for both. { get, set }', () => {
    const g = {}, s = {}, a = {}, FIELD = Symbol('field') // eslint-disable-line one-var

    let flag = false

    Define(g)
      .get('five', () => 5)

    Define(s)
      .set('flag', value => { flag = value })

    Define(a)
      .let(FIELD, 0)
      .access('field', () => a[FIELD], value => { a[FIELD] = value })

    assert(g.five === 5)

    s.flag = true
    assert(flag === true)

    a.field = 10

    assert(a.field === 10)
    assert(a[FIELD] === 10)

  })

  it('access can be used to create backing properties', () => {

    const obj = {}, MASS = '_mass' // eslint-disable-line one-var

    Define(obj)
      .access('mass',
        () => obj[MASS],
        v => { obj[MASS] = v > 0 ? v : 0 },

        MASS,
        1000
      )

    assert(obj.mass === 1000)

    obj.mass = 500
    assert(obj.mass === 500)

    obj.mass = -100
    assert(obj.mass === 0)

  })

  it('target property contains target', () => {

    const obj = {}

    const target = Define(obj).target

    assert(obj === target)

  })

  it('enum syntax to make properties enumerable', () => {

    const obj = {}

    Define(obj)
      .enum.const('foo', 'bar')

    let key = null

    for (const i in obj)
      key = i

    assert(key === 'foo')
    assert(obj.foo === 'bar')

  })

  it('cant enum twice', () => {

    const obj = {}

    expect(() => Define(obj)
      .enum.enum.const('soft', 1000)).to.throw('Next property will already be enumerable.')

  })

  it('config syntax to make properties configurable', () => {

    const obj = {}

    Define(obj)
      .const('hard', 1000)
      .config.const('soft', 1000)

    expect(() => delete obj.hard).to.throw(Error)
    expect(() => delete obj.soft).to.not.throw(Error)

  })

  it('cant config twice', () => {

    const obj = {}

    expect(() => Define(obj)
      .config.config.const('soft', 1000)).to.throw('Next property will already be configurable.')
  })

  it('Define cannot be instanced.', () => {
    expect(() => new Define()).to.throw('Define cannot be instanced.')
  })

})
