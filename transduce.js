'use strict';

const { Reduced } = require('./reducer.js');

const DefaultInitial = Symbol('Default initial value');

function transduce(transformer, reducer, iterable, initail = DefaultInitial) {
    const transformation = transformer(reducer);
    let acc = initail === DefaultInitial ? transformation.init() : initail;
    for (const item of iterable) {
        acc = transformation.step(acc, item);
        if (acc instanceof Reduced) {
            acc = acc.unbox();
            break;
        }
    }
    return transformation.complete(acc);
}

module.exports = transduce;
