'use strict'

const test = require('ava')
const { unreduced } = require('../src/tools.js')
const { transduce } = require('../src/index.js')
const { map, filter, take, takeWhile } = require('../src/transducers.js')
const { arrayOf, setOf, mapOf, stringOf, assoc } = require('../src/reducers.js')

test('take while', t => {
  const testCases = [
    {
      message: 'Should take 0 elements from array',
      xform: takeWhile(it => it < 0),
      reducer: arrayOf(),
      coll: [2, 2, 3],
      assert: t.deepEqual,
      expected: []
    },
    {
      message: 'Should copy all collection',
      xform: takeWhile(_ => true),
      reducer: stringOf(),
      coll: 'epfl',
      assert: t.is,
      expected: 'epfl'
    },
    {
      message: 'Should take elements until negative numbers appear',
      xform: takeWhile(it => it > 0),
      reducer: setOf(),
      coll: new Set([1, 2, -1, 4]),
      assert: t.deepEqual,
      expected: new Set([1, 2])
    }
  ]

  testCases.forEach(({ xform, reducer, coll, expected, assert, message }) => {
    const actual = transduce(xform, reducer, coll)
    assert(actual, expected, message)
  })
})

test('take N elements transducer', t => {
  const testCases = [
    {
      message: 'Should take 2 elements from string',
      xform: take(2),
      reducer: stringOf('-'),
      coll: 'fake',
      expected: '-f-a',
      assert: t.is
    },
    {
      message: 'Should take 0 elements from non-empty arrray',
      xform: take(0),
      reducer: arrayOf(),
      coll: [1, 2, 3],
      expected: [],
      assert: t.deepEqual
    },
    {
      message: 'Should take 0 elements when N is a negative number',
      xform: take(-1),
      reducer: stringOf(),
      coll: 'fake',
      expected: '',
      assert: t.is
    },
    {
      message: 'Should take all elements from source when N is greater than length of source',
      xform: take(10),
      reducer: stringOf(),
      coll: 'fake',
      expected: 'fake',
      assert: t.is
    }
  ]

  testCases.forEach(({ xform, reducer, coll, expected, assert, message }) => {
    const actual = transduce(xform, reducer, coll)
    assert(actual, expected, message)
  })
})

test('should return plain js-object', t => {
  const actual = transduce(map(it => it), assoc(), [[1, 2], [3, 4]])
  t.deepEqual(actual, { 1: 2, 3: 4 })
})

test('should return elements of array increased by one', t => {
  const actual = transduce(map(it => it + 1), arrayOf(), [1, 2, 3])
  t.deepEqual(actual, [2, 3, 4])
})

test('should glue elements of array', t => {
  const actual = transduce(map(it => it), stringOf(), [1, 2, 3])
  t.is(actual, '123')
})

test('take-n tranformer should return Reduced when n equal to zero', t => {
  const xf = take(0)(arrayOf())
  const actual = xf([1, 2], 3)
  t.deepEqual(unreduced(actual), [1, 2])
})

test('take-n tranformer should return Reduced when n is less than zero', t => {
  const xf = take(-1)(arrayOf())
  const actual = xf([1, 2], 3)
  t.deepEqual(unreduced(actual), [1, 2])
})

test('take-n tranformer should push item when n is greater than zero', t => {
  const xf = take(2)(arrayOf())
  const actual = xf([1, 2], 3)
  t.deepEqual(actual, [1, 2, 3])
})

test('filter transfomer', t => {
  const testCases = [
    {
      item: 1,
      predicate: it => it > 0,
      reducer: arrayOf,
      expected: [1]
    },
    {
      item: true,
      predicate: it => !it,
      reducer: setOf,
      expected: new Set()
    },
    {
      item: [true, 1],
      predicate: ([_, value]) => value > 0,
      reducer: mapOf,
      expected: new Map([[true, 1]])
    },
    {
      item: [true, false],
      predicate: ([key, _]) => key,
      reducer: assoc,
      expected: { true: false }
    }
  ]

  testCases.forEach(({ item, predicate, reducer, expected }) => {
    const xf = filter(predicate)(reducer())
    const acc = xf()
    t.deepEqual(xf(acc, item), expected)
  })
})

test('map transfomer', t => {
  const testCases = [
    {
      item: 1,
      fn: it => it + 1,
      reducer: arrayOf,
      expected: [2]
    },
    {
      item: 'a',
      fn: it => it.toUpperCase(),
      reducer: setOf,
      expected: new Set(['A'])
    },
    {
      item: 1,
      fn: it => [it, it > 0],
      reducer: mapOf,
      expected: new Map([[1, true]])
    },
    {
      item: true,
      fn: it => [it, !it],
      reducer: assoc,
      expected: { true: false }
    }
  ]

  testCases.forEach(({ item, fn, reducer, expected }) => {
    const xf = map(fn)(reducer())
    const acc = xf()
    t.deepEqual(xf(acc, item), expected)
  })
})
