'use strict';

const test = require('ava');
const { map,
        filter,
        take,
        arrayOf,
        setOf,
        mapOf,
        assoc,
        stringOf,
        unreduced,
        transduce } = require('../reducer.js');

test('should return plain js-object', t => {
  const actual = transduce(map(it => it), assoc(), [[1, 2], [3, 4]]);
  t.deepEqual(actual, { '1': 2, '3': 4 });
});

test('should return elements of array increased by one', t => {
  const actual = transduce(map(it => it + 1), arrayOf(), [1, 2, 3]);
  t.deepEqual(actual, [2, 3, 4]);
});

test('should glue elements of array', t => {
  const actual = transduce(map(it => it), stringOf(), [1, 2, 3]);
  t.is(actual, '123');
});

test('take-n tranformer should return Reduced when n equal to zero', t => {
  const xform = take(0)(arrayOf());
  const actual = xform.step([1, 2], 3);
  t.deepEqual(unreduced(actual), [1, 2]);
});

test('take-n tranformer should return Reduced when n is less than zero', t => {
  const xform = take(-1)(arrayOf());
  const actual = xform.step([1, 2], 3);
  t.deepEqual(unreduced(actual), [1, 2]);
});

test('take-n tranformer should push item when n is greater than zero', t => {
  const xform = take(2)(arrayOf());
  const actual = xform.step([1, 2], 3);
  t.deepEqual(actual, [1, 2, 3]);
});


test('filter transfomer', t => {
  const testCases = [
    {
      item: 1,
      predicate: it => it > 0,
      reducer: arrayOf,
      expected: [1]
    },
    {
      item: true,
      predicate: it => !it,
      reducer: setOf,
      expected: new Set()
    },
    {
      item: [true, 1],
      predicate: ([_, value]) => value > 0,
      reducer: mapOf,
      expected: new Map([[true, 1]])
    },
    {
      item: [true, false],
      predicate: ([key, _]) => key,
      reducer: assoc,
      expected: { 'true': false }
    }
  ];

  testCases.forEach(({ item, predicate, reducer, expected}) => {
    const xform = filter(predicate)(reducer());
    t.deepEqual(xform.step(xform.init(), item), expected);
  });
});

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
