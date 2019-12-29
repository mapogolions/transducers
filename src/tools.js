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

function transduce(xform, reducer, iterable) {
  const transformation = xform(reducer);
  return reduce(transformation.step, iterable, transformation.init());
}

function reduce(step, iterable, acc) {
  for (const item of iterable) {
    acc = step(acc, item);
    if (isReduced(acc))
      return acc.value();
  }
  return acc;
}

module.exports = {
  identity,
  isReduced,
  ensureReduced,
  unreduced,
  transduce,
  reduce,
};
