'use strict';

class Reducer {
    init() {}
    step(acc, item) {}
    complete(acc) {
        return acc;
    }
}

class ArrayOf extends Reducer {
    init() {
        return [];
    }

    step(acc, item) {
        acc.push(item);
        return acc;
    }
}

class StringOf extends Reducer {
    constructor(sep) {
        this._sep = sep;
    }

    init() {
        return '';
    }

    step(acc, item) {
        return `${acc}${sep}${item}`;
    }
}

class SetOf extends Reducer {
    init() {
        return new Set();
    }

    step(acc, item) {
        acc.add(item);
        return acc;
    }
}

module.exports = {
    Reducer,
    ArrayOf,
    StringOf,
    SetOf,
};
