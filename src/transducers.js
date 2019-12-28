'use strict';

const { ensureReduced } = require('./tools.js');


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


module.exports = {
  map,
  filter,
  take,
};
