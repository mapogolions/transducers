'use strict';

const test = require('ava');
const { map,
        filter,
        arrayOf,
        setOf,
        mapOf,
        assoc,
        stringOf } = require('../reducer.js');


test('map transfomer', t => {
  const testCases = [
    {
      item: 1,
      fn: it => it + 1,
      reducer: arrayOf,
      expected: [2]
    },
    {
      item: 'a',
      fn: it => it.toUpperCase(),
      reducer: setOf,
      expected: new Set(['A'])
    },
    {
      item: 1,
      fn: it => [it, it > 0],
      reducer: mapOf,
      expected: new Map([[1, true]])
    },
    {
      item: true,
      fn: it => [it, !it],
      reducer: assoc,
      expected: { 'true': false }
    }
  ];

  testCases.forEach(({ item, fn, reducer, expected}) => {
    const xform = map(fn)(reducer());
    t.deepEqual(xform.step(xform.init(), item), expected);
  });

  const xform = map(it => it + 1)(arrayOf());
  t.deepEqual(xform.step([], 1), [2]);
});

// test basic reducers
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