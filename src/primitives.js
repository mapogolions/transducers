'use strict'

const { nullary, unary } = require('./tools.js')

function arrayOf (...varargs) {
  if (nullary(varargs)) return []
  if (unary(varargs)) return varargs[0]
  const [acc, x] = varargs
  acc.push(x)
  return acc
}

function setOf (...varargs) {
  if (nullary(varargs)) return new Set()
  if (unary(varargs)) return varargs[0]
  const [acc, x] = varargs
  acc.add(x)
  return acc
}

function mapOf (...varargs) {
  if (nullary(varargs)) return new Map()
  if (unary(varargs)) return varargs[0]
  const [acc, [key, value]] = varargs
  acc.set(key, value)
  return acc
}

function assoc (...varargs) {
  if (nullary(varargs)) return {}
  if (unary(varargs)) return varargs[0]
  const [acc, [key, value]] = varargs
  acc[key] = value
  return acc
}

function stringOf (...varargs) {
  if (nullary(varargs)) return ''
  if (unary(varargs)) return varargs[0]
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
