'use strict';

const DEFAULT_INIT = Symbol('Default init');

class Reduced {
  constructor(value) {
    this._value = value;
  }

  value() {
    return this._value;
  }
}

// glue
function identity(x) {
  return x;
}

function unreduced(it) {
  return it instanceof Reduced ? it.value() : it;
}

function transduce(transformer, step, iterable, init = DEFAULT_INIT) {
  // const transformation = transformer(step);
}

const map = f => ({ init, step, done }) => {
  return { init,
           done,
           step: (acc, x) => step(acc, f(x)) };
};

const filter = predicate => ({ init, step, done }) => {
  return { init,
           done,
           step: (acc, x) => predicate(x) ? step(acc, x) : acc };
};

// reducers collection
function arrayOf() {
  return { init: [],
           step: (acc, x) => { acc.push(x); return acc; },
           done: identity };
}

function setOf() {
  return { init: new Set(),
           step: (acc, x) => { acc.add(x); return acc; },
           done: identity };
}

function mapOf() {
  return { init: new Map(),
           step: (acc, [key, value]) => { acc.set(key, value); return acc; },
           done: identity };
}

function assoc() {
  return { init: {},
           step: (acc, [key, value]) => { acc[key] = value; return acc; },
           done: identity };
}

function join(sep) {
  return { init: [],
           step: (acc, x) = `${acc}${sep}${x}`,
           done: identity };
}
