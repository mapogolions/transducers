'use strict'

const test = require('ava')
const { unreduced } = require('../src/tools.js')
const { transduce, reduce } = require('../src/index.js')
const { map, filter, take, takeWhile } = require('../src/transducers.js')
const { arrayOf, setOf, mapOf, stringOf, assoc } = require('../src/primitives.js')

test('Should be compatible with traditional reducers', t => {
  const testCases = [
    {
      message: 'Should return sum of elements',
      coll: [1, 2, 3, 4],
      reducer: (acc, x) => acc + x,
      seed: 0,
      expected: 10
    },
    {
      message: 'Should return product of elements',
      coll: [1, 2, 3, 4],
      reducer: (acc, x) => acc * x,
      seed: 1,
      expected: 24
    }
  ]

  testCases.forEach(({ coll, reducer, seed, message, expected }) => {
    const actual = transduce(it => it, reducer, coll, seed)
    t.is(actual, expected, message)
  })
})

test('Should apply passed initial value instead of reducers value by default', t => {
  const coll = [1, 2, 3]
  const actual = transduce(map(it => it), arrayOf, coll, [-1, 0])
  t.deepEqual(actual, [-1, 0, ...coll])
})

test('take while', t => {
  const testCases = [
    {
      message: 'Should take 0 elements from array',
      transformer: takeWhile(it => it < 0),
      reducer: arrayOf,
      coll: [2, 2, 3],
      assert: t.deepEqual,
      expected: []
    },
    {
      message: 'Should copy all collection',
      transformer: takeWhile(_ => true),
      reducer: stringOf,
      coll: 'epfl',
      assert: t.is,
      expected: 'epfl'
    },
    {
      message: 'Should take elements until negative numbers appear',
      transformer: takeWhile(it => it > 0),
      reducer: setOf,
      coll: new Set([1, 2, -1, 4]),
      assert: t.deepEqual,
      expected: new Set([1, 2])
    }
  ]

  testCases.forEach(({ transformer, reducer, coll, expected, assert, message }) => {
    const actual = transduce(transformer, reducer, coll)
    assert(actual, expected, message)
  })
})

test('take N elements transducer', t => {
  const testCases = [
    {
      message: 'Should take 2 elements from string',
      transformer: take(2),
      reducer: stringOf,
      coll: 'fake',
      expected: 'fa',
      assert: t.is
    },
    {
      message: 'Should take 0 elements from non-empty arrray',
      transformer: take(0),
      reducer: arrayOf,
      coll: [1, 2, 3],
      expected: [],
      assert: t.deepEqual
    },
    {
      message: 'Should take 0 elements when N is a negative number',
      transformer: take(-1),
      reducer: stringOf,
      coll: 'fake',
      expected: '',
      assert: t.is
    },
    {
      message: 'Should take all elements from source when N is greater than length of source',
      transformer: take(10),
      reducer: stringOf,
      coll: 'fake',
      expected: 'fake',
      assert: t.is
    }
  ]

  testCases.forEach(({ transformer, reducer, coll, expected, assert, message }) => {
    const actual = transduce(transformer, reducer, coll)
    assert(actual, expected, message)
  })
})

test('should return plain js-object', t => {
  const actual = transduce(map(it => it), assoc, [[1, 2], [3, 4]])
  t.deepEqual(actual, { 1: 2, 3: 4 })
})

test('should return elements of array increased by one', t => {
  const actual = transduce(map(it => it + 1), arrayOf, [1, 2, 3])
  t.deepEqual(actual, [2, 3, 4])
})

test('should glue elements of array', t => {
  const actual = transduce(map(it => it), stringOf, [1, 2, 3])
  t.is(actual, '123')
})

test('take-n tranformer should return Reduced when n equal to zero', t => {
  const transformation = take(0)(arrayOf)
  const actual = transformation([1, 2], 3)
  t.deepEqual(unreduced(actual), [1, 2])
})

test('take-n tranformer should return Reduced when n is less than zero', t => {
  const transformation = take(-1)(arrayOf)
  const actual = transformation([1, 2], 3)
  t.deepEqual(unreduced(actual), [1, 2])
})

test('take-n tranformer should push item when n is greater than zero', t => {
  const transformation = take(2)(arrayOf)
  const actual = transformation([1, 2], 3)
  t.deepEqual(actual, [1, 2, 3])
})

test('filter transfomer', t => {
  const testCases = [
    {
      item: 1,
      pred: it => it > 0,
      reducer: arrayOf,
      expected: [1]
    },
    {
      item: true,
      pred: it => !it,
      reducer: setOf,
      expected: new Set()
    },
    {
      item: [true, 1],
      pred: ([_, value]) => value > 0,
      reducer: mapOf,
      expected: new Map([[true, 1]])
    },
    {
      item: [true, false],
      pred: ([key, _]) => key,
      reducer: assoc,
      expected: { true: false }
    }
  ]

  testCases.forEach(({ item, pred, reducer, expected }) => {
    const transformer = filter(pred)
    const transformation = transformer(reducer)
    const seed = transformation()
    t.deepEqual(transformation(seed, item), expected)
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
    const transformer = map(fn)
    const transformation = transformer(reducer)
    const seed = transformation()
    t.deepEqual(transformation(seed, item), expected)
  })
})
