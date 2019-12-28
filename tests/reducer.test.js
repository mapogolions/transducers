'use strict';

const test = require('ava');
const { arrayOf } = require('../reducer.js');

test('arrayOf reducer', t => {
  const reducer = arrayOf();
  t.deepEqual(reducer.init(), []);
  t.deepEqual(reducer.step([], 1), [1]);
  t.is(reducer.done(1), 1);
});
