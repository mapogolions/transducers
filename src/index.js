'use strict'

const { isReduced } = require('./tools.js')

function transduce (xform, reducer, iterable) {
  const transformation = xform(reducer)
  return reduce(transformation, iterable, transformation())
}

function reduce (step, iterable, acc) {
  for (const item of iterable) {
    acc = step(acc, item)
    if (isReduced(acc)) { return acc.value() }
  }
  return acc
}

module.exports = {
  reduce,
  transduce
}
