'use strict'

const { isReduced } = require('./tools.js')

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

module.exports = {
  reduce,
  transduce
}
