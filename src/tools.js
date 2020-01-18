'use strict'

const arity = args => args.length
const nullary = args => arity(args) === 0
const unary = args => arity(args) === 1

const REDUCED = Symbol('reduced value')

function isReduced (obj) {
  return !!(obj && obj[REDUCED])
}

function ensureReduced (obj) {
  if (isReduced(obj)) {
    return obj
  }
  return {
    value () { return obj },
    [REDUCED]: true
  }
}

function unreduced (obj) {
  return obj && obj[REDUCED] ? obj.value() : obj
}

module.exports = {
  arity,
  nullary,
  unary,
  isReduced,
  ensureReduced,
  unreduced
}
