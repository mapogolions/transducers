'use strict'

const { zeroArity, oneArity } = require('./tools.js')

function arrayOf (...varargs) {
  if (zeroArity(varargs)) return []
  if (oneArity(varargs)) return varargs[0]
  const [acc, x] = varargs
  acc.push(x)
  return acc
}

function setOf (...varargs) {
  if (zeroArity(varargs)) return new Set()
  if (oneArity(varargs)) return varargs[0]
  const [acc, x] = varargs
  acc.add(x)
  return acc
}

function mapOf (...varargs) {
  if (zeroArity(varargs)) return new Map()
  if (oneArity(varargs)) return varargs[0]
  const [acc, [key, value]] = varargs
  acc.set(key, value)
  return acc
}

function assoc (...varargs) {
  if (zeroArity(varargs)) return {}
  if (oneArity(varargs)) return varargs[0]
  const [acc, [key, value]] = varargs
  acc[key] = value
  return acc
}

function stringOf (...varargs) {
  if (zeroArity(varargs)) return ''
  if (oneArity(varargs)) return varargs[0]
  const [acc, x] = varargs
  return `${acc}${x}`
}

module.exports = {
  arrayOf,
  setOf,
  mapOf,
  stringOf,
  assoc
}
