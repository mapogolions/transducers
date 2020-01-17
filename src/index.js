'use strict'

const { isReduced } = require('./tools.js')
const { zeroArity, oneArity } = require('./tools.js')

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
    if (zeroArity(varargs)) throw Error()
    if (oneArity(varargs)) return varargs[0]
    const [acc, x] = varargs
    return step(acc, x)
  }
}


module.exports = {
  wrap,
  reduce,
  transduce
}
