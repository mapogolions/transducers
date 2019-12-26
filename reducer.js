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

class Join extends Reducer {
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

class MapOf extends Reducer {
    init () {
        return new Map();
    }

    step(acc, item) {
        // or maybe const { key, value } = item
        const [key, value] = item;
        acc.set(key, value);
        return acc;
    }
}

class Reduced {
    constructor(value) {
        this._value = value;
    }

    unbox() {
        return this._value;
    }
}

class SingleResult extends Reducer {
    step(acc, item) {
        return new Reduced(item);
    }

    complete(acc) {
        if (acc instanceof SingleResult) {
            return acc.unbox();
        }
        return acc;
    }
}

class MapReducer extends Reducer {
    constructor(reducer, fn) {
        this._reducer = reducer;
        this._fn = fn;
    }

    step(acc, item) {
        return this._reducer(acc, this._fn(item));
    }
}

class FilterReducer extends Reducer {
    constructor(reducer, predicate) {
        this._reducer = reducer;
        this._predicate = predicate;
    }

    step(acc, item) {
        return this._predicate(item) ? this._reducer(acc, item) : acc;
    }
}

module.exports = {
    Reducer,
    ArrayOf,
    Join,
    SetOf,
    Reduced,
    SingleResult,
    MapReducer,
    FilterReducer,
    MapOf,
};
