'use strict'

const { isReduced } = require('./tools.js')


function transduce (xform, reducer, coll) {
  const transformation = xform(reducer)
  return reduce(transformation, coll, transformation())
}

function reduce (step, coll, acc) {
  for (const item of coll) {
    acc = step(acc, item)
    if (isReduced(acc)) { return acc.value() }
  }
  return acc
}

module.exports = {
  reduce,
  transduce
}
