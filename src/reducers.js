'use strict';


function zeroArity(args) {
  return args && (args.length === 0);
}

function oneArity(args) {
  return args.length === 1;
}

function shapeFn(initial, fn) {
  return function (...varargs) {
    if (zeroArity(varargs)) return initial;
    if (oneArity(varargs)) return varargs[0];
    return fn(...varargs);
  };
}

function arrayOf() {
  return shapeFn([], (acc, x) => {
    acc.push(x);
    return acc;
  });
}

function setOf() {
  return shapeFn(new Set(), (acc, x) => {
    acc.add(x);
    return acc;
  });
}

function mapOf() {
  return shapeFn(new Map(), (acc, [key, value]) => {
    acc.set(key, value);
    return acc;
  });
}

function assoc() {
  return shapeFn({}, (acc, [key, value]) => {
    acc[key] = value;
    return acc;
  });
}

function stringOf(sep = '') {
  return shapeFn('', (acc, x) => `${acc}${sep}${x}`);
}


module.exports = {
  arrayOf,
  setOf,
  mapOf,
  stringOf,
  assoc,
};
