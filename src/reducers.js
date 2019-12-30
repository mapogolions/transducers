'use strict';

const { zeroArity, oneArity } = require('./tools.js');


function arrayOf() {
  return function (...varargs) {
    if (zeroArity(varargs)) return [];
    if (oneArity(varargs)) return varargs[0];
    const [acc, x] = varargs;
    acc.push(x);
    return acc;
  };
}

function setOf() {
  return function (...varargs) {
    if (zeroArity(varargs)) return new Set();
    if (oneArity(varargs)) return varargs[0];
    const [acc, x] = varargs;
    acc.add(x);
    return acc;
  };
}

function mapOf() {
  return function (...varargs) {
    if (zeroArity(varargs)) return new Map();
    if (oneArity(varargs)) return varargs[0];
    const [acc, [key, value]] = varargs;
    acc.set(key, value);
    return acc;
  };
}

function assoc() {
  return function (...varargs) {
    if (zeroArity(varargs)) return {};
    if (oneArity(varargs)) return varargs[0];
    const [acc, [key, value]] = varargs;
    acc[key] = value;
    return acc;
  };
}

function stringOf(sep = '') {
  return function (...varargs) {
    if (zeroArity(varargs)) return '';
    if (oneArity(varargs)) return varargs[0];
    const [acc, x] = varargs;
    return `${acc}${sep}${x}`;
  };
}


module.exports = {
  arrayOf,
  setOf,
  mapOf,
  stringOf,
  assoc,
};
