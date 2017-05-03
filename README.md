# rezz
Composable, chainable reducer toolkit for redux

## Installation

```npm install --save rezz```

or

```yarn add rezz```

## Introduction

`rezz` is a toolkit that creates functions that are chainable, composable, and accept
`redux`-style arguments: state and action. `rezz` never mutates any data, allowing
you to know if state has been modified with a simple equality check.

`rezz` is primarily intended to be used with `redux`, though it's not required. Use
it like this:
 
```
import createReducerCreator from 'rezz/createReducerCreator';
import addToList from 'rezz/addToList';
import removeFromList from 'rezz/removeFromList';
  
export default createReducerCreator()(
    addToList('ADD_TO_LIST'),
    removeFromList('REMOVE_FROM_LIST')
);    
```

This reducer will listen for actions with `ADD_TO_LIST` type and add the data to a
list, and listen for `REMOVE_FROM_LIST` and remove from that list. Import this reducer
and use it as normal with `redux` or elsewhere. There are three primary types of
functions available:

* `createReducerCreator` allows you to combine multiple reducers together with a
common set of options.
* *Combiners* are methods that accept a list of reducers and return a reducer that
combine those reducers in some way, such as chaining them together, or prioritizing
one over another.
* *Operators* are reducer creators that perform actual, simple, low-level operations
based on a state and action. They accept a string or array determining what type
actions to activate on.

## API

### `createReducerCreator(options: ReducerOptions) => ReducerCreator`
A simple wrapper that returns a reducer creator and provides the options to all the
reducers.

#### ReducerOptions
These options determine how all the reducers passed to the reducer creator act.

```
{
    initialState: any,
    combiner: Combiner,
    equalityCheck: <T>(a: T, b: T) => boolean,
    payloadStrategy: (action: Action) => any,
    keyStrategy: (action: Action) => any,
}
```

* `initialState` (default `null`): The state the reducer starts with. 
* `combiner` (default `chainCombiner`): A function that accepts a list of reducers and
options, and returns a single reducer that combines the list of reducers. By default,
it uses `chainCombiner` that simply runs the reducers one after another.
* `equalityCheck` (default `(a, b)=>a===b`): A function that is used when a reducer
needs to determine if two items in a list or collection are equal.
* `payloadStrategy` (default `action => action.payload`): A function that takes a
`redux`-like action and returns the relevant payload.
* `keyStrategy` (default `action => action.key`): A function that takes a
`redux`-like action and returns the relevant key.

#### ReducerCreator(...reducers: Reducer) => Reducer
Each argument is a reducer that will be combined into a single reducer.

### Combiners

#### `chainCombiner(Array<Reducer>, options: ReducerOptions) => Reducer`
Combines the provided reducers by running them one after another in the provided
order.

### Operators
Operators create simple reducers. The first argument to an operator is either an array
of strings, or a string. If it's not either, the `toString` method will be called on it,
so you can pass actions created by `redux-actions` for example.

#### Array Operators

##### `addToList`

Adds the provided data to the state using Array's `concat` method, so the data can be
an array or a single item. If the state is not currently an array, then the data
becomes the state.
 
##### `removeFromList`
Removes the provided data from the list if present, using the `equailityCheck` option
to determine what to remove.

##### `updateInList`
Shorthand for `removeFromList` followed by `addToList`.

#### Object/Collection Operators

##### `set`
Sets a property on the state to a value. The property being set is determined by
`options.keyStrategy`. The value is determined by `options.valueStrategy`. 

##### `assign`
Assigns the state to the value determined by `options.valueStrategy`.