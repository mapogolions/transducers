'use strict'

const test = require('ava')
const {
  arrayOf,
  setOf,
  mapOf,
  assoc,
  stringOf
} = require('../src/reducers.js')

test('should prevent shared reference when initial value is a mutable reference type', t => {
  const testCases = [
    { reducer: arrayOf(), expected: false },
    { reducer: mapOf(), expected: false },
    { reducer: setOf(), expected: false },
    { reducer: assoc(), expected: false },
    { reducer: stringOf(), expected: true }, // immutable data
  ]

  testCases.forEach(({ reducer, expected }) => {
    const actual = reducer() === reducer()
    t.is(actual, expected)
  })
})

test('stringOf reducer', t => {
  const reducer = stringOf('-')
  t.is(reducer(), '')
  t.is(reducer('', '1'), '-1')
  t.is(reducer(1), 1)
})

test('assoc reducer', t => {
  const reducer = assoc()
  t.deepEqual(reducer(), {})
  t.deepEqual(reducer({}, [1, 1]), { 1: 1 })
  t.is(reducer(1), 1)
})

test('setOf reducer', t => {
  const reducer = setOf()
  t.deepEqual(reducer(), new Set())
  t.deepEqual(reducer(new Set(), 1), new Set([1]))
  t.is(reducer(1), 1)
})

test('mapOf reducer', t => {
  const reducer = mapOf()
  t.deepEqual(reducer(), new Map())
  t.deepEqual(reducer(new Map(), ['one', 1]), new Map([['one', 1]]))
  t.is(reducer(1), 1)
})

test('arrayOf reducer', t => {
  const reducer = arrayOf()
  t.deepEqual(reducer(), [])
  t.deepEqual(reducer([], 1), [1])
  t.is(reducer(1), 1)
})
