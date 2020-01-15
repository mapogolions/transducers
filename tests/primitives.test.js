'use strict'

const test = require('ava')
const {
  arrayOf,
  setOf,
  mapOf,
  assoc,
  stringOf
} = require('../src/primitives.js')

test('stringOf reducer', t => {
  t.is(stringOf(), '')
  t.is(stringOf('', '1'), '1')
  t.is(stringOf(1), 1)
})

test('assoc reducer', t => {
  t.deepEqual(assoc(), {})
  t.deepEqual(assoc({}, [1, 1]), { 1: 1 })
  t.is(assoc(1), 1)
})

test('setOf reducer', t => {
  t.deepEqual(setOf(), new Set())
  t.deepEqual(setOf(new Set(), 1), new Set([1]))
  t.is(setOf(1), 1)
})

test('mapOf reducer', t => {
  t.deepEqual(mapOf(), new Map())
  t.deepEqual(mapOf(new Map(), ['one', 1]), new Map([['one', 1]]))
  t.is(mapOf(1), 1)
})

test('arrayOf reducer', t => {
  t.deepEqual(arrayOf(), [])
  t.deepEqual(arrayOf([], 1), [1])
  t.is(arrayOf(1), 1)
})
