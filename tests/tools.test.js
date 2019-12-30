'use strict'

const test = require('ava')
const { unreduced, ensureReduced, isReduced } = require('../src/tools.js')

test('should unreduce value', t => {
  t.is(unreduced(1), 1)
  t.deepEqual(unreduced([]), [])
  t.deepEqual(unreduced(ensureReduced({})), {})
  t.is(unreduced(false), false)
  t.is(unreduced(ensureReduced('')), '')
})

test('should check whether value is Reduced', t => {
  const testCases = [
    { input: false, expected: false },
    { input: 1, expected: false },
    { input: ensureReduced(null), expected: true },
    { input: ensureReduced(undefined), expected: true },
    { input: ensureReduced(false), expected: true },
    { input: undefined, expected: false },
    { input: Symbol(1), expected: false },
    { input: x => x, expected: false },
    { input: [], expected: false },
    { input: {}, expected: false }
  ]

  testCases.forEach(it => t.false(isReduced(it)))
})
