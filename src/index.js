'use strict'

const { isReduced } = require('./tools.js')

const DefaultInitial = Symbol('Default initial')

function transduce (xform, reducer, coll, initial = DefaultInitial) {
  const transformation = xform(reducer)
  const seed = initial === DefaultInitial ? transformation() : initial
  return reduce(transformation, coll, seed)
}

function reduce (step, coll, acc) {
  for (const item of coll) {
    acc = step(acc, item)
    if (isReduced(acc)) return acc.value()
  }
  return acc
}

module.exports = {
  reduce,
  transduce
}
