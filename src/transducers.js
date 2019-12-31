'use strict'

const { zeroArity, oneArity, ensureReduced } = require('./tools.js')

function shapeFn (reducer, step) {
  return function (...varargs) {
    if (zeroArity(varargs)) return reducer()
    if (oneArity(varargs)) return reducer(varargs[0])
    const [acc, x] = varargs
    return step(acc, x)
  }
}

function map (fn) {
  return function (reducer) {
    const step = (acc, x) => reducer(acc, fn(x))
    return shapeFn(reducer, step)
  }
}

function filter (pred) {
  return function (reducer) {
    const step = (acc, x) => pred(x) ? reducer(acc, x) : acc
    return shapeFn(reducer, step)
  }
}

function take (n) {
  return function (reducer) {
    const step = (acc, x) => --n < 0 ? ensureReduced(acc) : reducer(acc, x)
    return shapeFn(reducer, step)
  }
}

function takeWhile (pred) {
  return function (reducer) {
    const step = (acc, x) => pred(x) ? reducer(acc, x) : ensureReduced(acc)
    return shapeFn(reducer, step)
  }
}

function drop (n) {
  return function (reducer) {
    const step = (acc, x) => --n < 0 ? reducer(acc, x) : acc
    return shapeFn(reducer, step)
  }
}

function dropWhile (pred) {
  return function (reducer) {
    const step = (acc, x) => pred(x) ? acc : reducer(acc, x)
    return shapeFn(reducer, step)
  }
}

module.exports = {
  map,
  filter,
  take,
  takeWhile,
  drop,
  dropWhile
}
