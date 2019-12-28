'use strict';

const test = require('ava');
const { arrayOf,
        setOf,
        mapOf,
        assoc,
        stringOf } = require('../src/reducers.js');


test('stringOf reducer', t => {
  const reducer = stringOf('-');
  t.is(reducer.init(), '');
  t.is(reducer.step('', '1'), '-1');
  t.is(reducer.done(1), 1);
});

test('assoc reducer', t => {
  const reducer = assoc();
  t.deepEqual(reducer.init(), {});
  t.deepEqual(reducer.step({}, [1, 1]), {'1': 1});
  t.is(reducer.done(1), 1);
});

test('setOf reducer', t => {
  const reducer = setOf();
  t.deepEqual(reducer.init(), new Set());
  t.deepEqual(reducer.step(new Set(), 1), new Set([1]));
  t.is(reducer.done(1), 1);
});

test('mapOf reducer', t => {
  const reducer = mapOf();
  t.deepEqual(reducer.init(), new Map());
  t.deepEqual(reducer.step(new Map(), ['one', 1]), new Map([['one', 1]]));
  t.is(reducer.done(1), 1);
});

test('arrayOf reducer', t => {
  const reducer = arrayOf();
  t.deepEqual(reducer.init(), []);
  t.deepEqual(reducer.step([], 1), [1]);
  t.is(reducer.done(1), 1);
});
