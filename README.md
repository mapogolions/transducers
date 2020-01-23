### Transducers

[![Build Status](https://travis-ci.org/mapogolions/transducers.svg?branch=master)](https://travis-ci.org/mapogolions/transducers)

#### Status: in progress

```
val step : 'a -> 'b -> 'a

val reducer : unit -> 'a
val reducer : 'a -> 'b -> 'a
val reducer : 'a -> 'b

val transformer : reducer -> reducer
```
