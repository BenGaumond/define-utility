import { assert, expect } from 'chai'

import Define from '../src'

/* globals describe it */

describe('Define static function', () => {


  it('Should only take a single object as a parameter', () => {

    const obj = {}

    expect(() => Define(obj)).to.not.throw(Error)
    expect(() => Define()).to.throw('Object expected.')

  })

  it('Adds property definitions to an object.', () => {

    const obj = {}
    Define(obj)
      .const('foo', 'bar')

    assert(obj.foo == 'bar')

  })

  it('const property are read only. { value }', () => {

    const obj = {}
    Define(obj)
      .const('PI', Math.PI)

    expect(() => obj.PI = 5).to.throw(Error)
    assert(obj.PI == Math.PI)

  })

  it('let properties are writable. { value, writable: true }', () => {

    const obj = {}
    Define(obj)
      .let('mass', 1000)

    expect(() => obj.mass -= 900).to.not.throw(Error)
    assert(obj.mass == 100)

  })

  it('get, set properties are supported, and access property for both. { get, set }', () => {
    const g = {}, s = {}, a = {}, FIELD = Symbol('field')

    let flag = false

    Define(g)
      .get('five', () => 5)

    Define(s)
      .set('flag', value => flag = value)

    Define(a)
      .let(FIELD, 0)
      .access('field', () => a[FIELD], value => a[FIELD] = value)

    assert(g.five == 5)

    s.flag = true
    assert(flag == true)

    a.field = 10

    assert(a.field == 10)
    assert(a[FIELD] == 10)

  })

  it('access can be used to create backing properties', () => {

    const obj = {}, MASS = '_mass'//Symbol('mass')

    Define(obj)
      .access('mass',
        () => obj[MASS],
        v => obj[MASS] = v > 0 ? v : 0,

        MASS,
        1000
      )

    assert(obj.mass == 1000)

    obj.mass = 500
    assert(obj.mass == 500)

    obj.mass = -100
    assert(obj.mass == 0)

  })

  it('enum syntax to make properties enumerable', () => {

    const obj = {}

    Define(obj)
      .const.enum('foo', 'bar')

    let key = null

    for(const i in obj)
      key = i

    assert(key == 'foo')
    assert(obj.foo == 'bar')

  })

  it('config syntax to make properties configurable', () => {

    const obj = {}

    Define(obj)
      .const('hard', 1000)
      .const.config('soft', 1000)

    expect(() => delete obj.hard).to.throw(Error)
    expect(() => delete obj.soft).to.not.throw(Error)

  })

  it('Define can be instanced to prevent scope form changing.', () => {

    const stat = {}, dyn = {}

    const iDefine = new Define(dyn)

    Define(stat)
      .const('foo', 'bar')

    iDefine
      .const('foo', 'better')

    assert(dyn.foo == 'better')

  })



})
