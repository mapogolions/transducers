'use strict';

const { shapeFn } = require('./reducers.js');

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

function transduce(xform, reducer, iterable) {
  const transformation = xform(reducer);
  return reduce(transformation, iterable, xform());
}

function reduce(step, iterable, acc) {
  for (const item of iterable) {
    acc = step(acc, item);
    if (isReduced(acc))
      return acc.value();
  }
  return acc;
}

function map(fn) {
    return function (reducer) {
        const step = (acc, x) => reducer(acc, fn(x));
        return shapeFn(reducer(), step);
    };
}

function filter(pred) {
    return function (reducer) {
        const step = (acc, x) => pred(x) ? reducer(acc, x) : acc;
        return shapeFn(reducer(), step);
    };
}

function take(n) {
    return function (reducer) {
        const step = (acc, x) => --n < 0 ? ensureReduced(acc) : step(acc, x);
        return shapeFn(reducer(), step);
    };
}


module.exports = {
  map,
  filter,
  take,
};
