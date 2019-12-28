'use strict';


const REDUCED = Symbol('reduced value');

function identity(x) {
  return x;
}

function isReduced(obj) {
  return obj && obj[REDUCED] ? true : false;
}

function ensureReduced(obj) {
  if (isReduced(obj)) {
    return obj;
  }
  return {
    value() { return obj; },
    [REDUCED]: true
  };
}

function unreduced(obj) {
  return obj && obj[REDUCED] ? obj.value() : obj;
}

function transduce(transformer, reducer, iterable) {
  const xform = transformer(reducer);
  return reduce(xform.step, iterable, xform.init());
}

function reduce(step, iterable, acc) {
  for (const item of iterable) {
    acc = step(acc, item);
    if (isReduced(acc))
      return acc.value();
  }
  return acc;
}

// transducer : reducer -> reducer

function map(fn) {
  return function ({ init, step, done }) {
    const stepFn = (acc, x) => step(acc, fn(x));
    return { init, done, step: stepFn };
  };
}

function filter(predicate) {
  return function ({ init, step, done }) {
    const stepFn = (acc, x) => predicate(x) ? step(acc, x) : acc;
    return { init, done, step: stepFn };
  };
}

function take(n) {
  return function ({ init, step, done }) {
    const stepFn = (acc, x) => --n < 0 ? ensureReduced(acc) : step(acc, x);
    return { init, done, step: stepFn };
  };
}

// reducers
function arrayOf() {
  return {
    init: () => [],
    step: (acc, x) => { acc.push(x); return acc; },
    done: identity
  };
}

function setOf() {
  return {
    init: () => new Set(),
    step: (acc, x) => { acc.add(x); return acc; },
    done: identity
  };
}

function mapOf() {
  return {
    init: () => new Map(),
    step: (acc, [key, value]) => { acc.set(key, value); return acc; },
    done: identity
  };
}

function assoc() {
  return {
    init: () => ({}),
    step: (acc, [key, value]) => { acc[key] = value; return acc; },
    done: identity
  };
}

function stringOf(sep = '') {
  return {
    init: () => '',
    step: (acc, x) => `${acc}${sep}${x}`,
    done: identity
  };
}


module.exports = {
  map,
  filter,
  take,
  arrayOf,
  setOf,
  mapOf,
  assoc,
  stringOf,
  transduce,
  identity,
  isReduced,
  unreduced,
  ensureReduced,
};
