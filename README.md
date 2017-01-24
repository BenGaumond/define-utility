M# Define Utility
___

## Why?

- You'd like to create special properties on Objects with a better syntax than Object.defineProperty
- You're creating an API that you'd like to be more dummy proof.
- You like dot notation.
- Your project *doesn't have enough* dependencies.

___

## Usage

Filthy es5 casual:

```js
const Define = require('define-utility');
```

es6 master race:

```js
import Define from 'define-utility'
```


Now that it's in your project, instead of doing this:
```js
const obj = {}

Object.defineProperty(obj, 'foo', { value: 'bar' })
Object.defineProperty(obj, 'ace', { value: 'base' })
```

You can do this:
```js
const obj = {}

Define(obj)
  .property('foo', { value: 'bar'})
  .property('ace', { value: 'base'})
```

Since a property definition with just a value equates to a read-only, or constant property, you can also shorten it even further, to this:

```js
const obj = {}

Define(obj)
  .const('foo', 'bar')
  .const('ace', 'base')

```

Or you could define a writable property:

```js
const obj = {}

Define(obj)
  .let('mass', 1000)

obj.mass = 500
```

Also getters and setters:

```js

const obj = {}

Define(obj)
  .let('sqrMagnitude', 10)
  .get('magnitude', () => Math.sqrt(obj.magnitude))
  .set('throttle', m => m > obj.magnitude ? obj.magnitude : m < 0 ? 0 : m)

//or use .access to set both on the same property at once:

Define(obj)
  .let('_mass', 1000)
  .access('mass',
    () => obj._mass,
    v => obj._mass = v > 0 ? v : 0)

```

You can use the access method to set backing fields:

```js
  const obj = {}

  const PERCENT = Symbol('percent') //i like using symbols for backing fields

  Define(obj)
    .access('percent', //first string or symbol is the fields
      () => `${this[PERCENT] || 0} %`, //first function is the getter          
      v => this[PERCENT] = v < 0 ? 0 : v > 100 ? 100 : v, //second function is the setter        
      PERCENT, //second string or symbol is the backing field
      50) //any value defined after will be used as the backing fields default value

  // Equivalent to
  Define(obj)
    .access('percent',
      () => `${this[PERCENT] || 0} %`,
      v => this[PERCENT] = v < 0 ? 0 : v > 100 ? 100 : v,
    ),
    .let(PERCENT, 50)



```

Any of the shortcuts can be made enumerable or configurable:

```js

  const obj = {}

  Define(obj)
    .const('id', 0) // { value: 0}
    .const.enum('attribute', 'HEAT') // { value: 'HEAT', enumerable: true }
    .let.enum('celsius', 32 ) // { value: 32, writable: true, enumerable: true }
    .get.enum('fahrenheit', () => (obj.celsius * 9 + (32 * 5)) / 5) // { get: [Function], enumerable: true }
    .const.enum.config('name', 'Thermometer') // { value: 'name', enumerable: true, configurable: true }

  // you CAN also do
    .let.config.enum('place', 'Ocean') // { value: 'Ocean', writable: true, configurable: true, enumerable: true }

  // but that's the same as
  obj.place = 'Ocean'
  // so that would be silly

```

## Class properties

Define works great for classes:

```js

const X = Symbol('x'), Y = Symbol('y')

class Vector {

  constructor(initialX = 0, initialY = 0) {

    Define(this)
      .access.enum('x', X, () => this[X], v => this[X] = isFinite(v) ? v : this[X], initialX)
      .access.enum('y', Y, () => this[Y], v => this[Y] = isFinite(v) ? v : this[Y], initialY)
      .get.enum('magnitude', () => Math.sqrt(this.x ** 2, this.y ** 2))
      .get.enum('angle', () => Math.atan2(this.y, this.x) * 180 / Math.PI)

  }

  //why not use the standard getter syntax?
  //I generally always do, but the descriptor for a standard getter
  //is { get: [Function], set: undefined, enumerable: false, configurable: true }
  //so, if you'd like different modifiers than that, use Define()
  get xPlusY() {
    return this.x + this.y
  }

  copy() {
    return new Vector(this.x, this.y)
  }

}

```

You can define accessors on the prototype of a class, as well, just make sure you use the ``` function() {} ``` expression, instead of the ``` () => {} ``` expression:

```js
  class Person {
    constructor(first, last, age) {

      Define(this)
        .const('first', first)
        .const('last', last)
        .let.enum('age', age)

    }
  }

  Define(Person.prototype)
    //function(){} expression required here
    .get.enum('fullName', function() { return this.first + ' ' + this.last })
```

## Special Considerations

Define is generally used as a static function, but it does maintain an internal state;
the object it's making definitions on. As a result, the internal state changes every time
you call define:

```js

const one = {}, two = {}

const oneDefine = Define(one)

oneDefine.const('prop', 'value') //one.prop === 'value'

Define(two)

oneDefine.const('foo', 'bar') //two.foo === 'bar'

```

For most cases, this doesn't matter because you're generally only going to be making
definitions synchronously inside the constructor of an object, by chaining .statments.

HOWEVER; If you'd like to cache a Define interface, for whatever reason, and be safe
from worries of asynchronous code or use of generators, you can create an instance:

```js

  const one = {}, two = {}

  const oneDefine = new Define(one)

  Define(two)
    .let('cool', true) // two.cool = true

  oneDefine
    .let('badass', true) // one.badass = true

```
