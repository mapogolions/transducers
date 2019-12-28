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

const map = f => ({ init, step, done }) => {
  return {
    init,
    done,
    step: (acc, x) => step(acc, f(x))
  };
};

const filter = predicate => ({ init, step, done }) => {
  return {
    init,
    done,
    step: (acc, x) => predicate(x) ? step(acc, x) : acc
  };
};

const take = n => ({ init, step, done }) => {
  return {
    init,
    done,
    step: (acc, x) => --n < 0 ? ensureReduced(acc) : step(acc, x)
  };
};

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
