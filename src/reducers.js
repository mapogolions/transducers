'use strict';

const { identity } = require('./tools.js');


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
  arrayOf,
  setOf,
  mapOf,
  stringOf,
  assoc,
};
