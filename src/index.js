'use strict'

const { isReduced } = require('./tools.js')
const { nullary, unary } = require('./tools.js')
const { arrayOf, mapOf, setOf, stringOf, assoc } = require('./primitives.js')

const DefaultInitial = Symbol('Default initial')

function transduce (transformer, reducer, coll, initial = DefaultInitial) {
  const transformation = transformer(reducer)
  const seed = initial === DefaultInitial ? transformation() : initial
  return reduce(transformation, coll, seed)
}

function reduce (reducer, coll, acc) {
  for (const item of coll) {
    acc = reducer(acc, item)
    if (isReduced(acc)) return reducer(acc.value())
  }
  return reducer(acc)
}

function wrap (step) {
  return function (...varargs) {
    if (nullary(varargs)) throw Error()
    if (unary(varargs)) return varargs[0]
    const [acc, x] = varargs
    return step(acc, x)
  }
}

function into (initial, transfomer, coll) {
  if (Array.isArray(coll)) return transduce(transformer, arrayOf, coll, initial)
  if (typeof coll === 'string') return transduce(transfomer, stringOf, coll, initial)
  if (coll instanceof Map) return transduce(transformer, mapOf, coll, initial)
  if (coll instanceof Set) return transduce(transformer, setOf, coll, initial)
  if (typeof coll === 'object') return transduce(transfomer, assoc, coll, initial)
  throw new Error(`Invalid typeof ${coll}`)
}

module.exports = {
  wrap,
  reduce,
  into,
  transduce
}
