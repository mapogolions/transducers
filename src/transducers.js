'use strict'

const { zeroArity, oneArity, ensureReduced } = require('./tools.js')

function map (fn) {
  return function (reducer) {
    return function (...varargs) {
      if (zeroArity(varargs)) return reducer()
      if (oneArity(varargs)) return reducer(varargs[0])
      const [acc, x] = varargs
      return reducer(acc, fn(x))
    }
  }
}

function filter (pred) {
  return function (reducer) {
    return function (...varargs) {
      if (zeroArity(varargs)) return reducer()
      if (oneArity(varargs)) return reducer(varargs[0])
      const [acc, x] = varargs
      return pred(x) ? reducer(acc, x) : acc
    }
  }
}

function take (n) {
  return function (reducer) {
    return function (...varargs) {
      if (zeroArity(varargs)) return reducer()
      if (oneArity(varargs)) return reducer(varargs[0])
      const [acc, x] = varargs
      return --n < 0 ? ensureReduced(acc) : reducer(acc, x)
    }
  }
}

module.exports = {
  map,
  filter,
  take
}
