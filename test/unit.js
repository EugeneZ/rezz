import test from 'tape';
import createReducerCreator from '../src/createReducerCreator';
import chainCombiner from '../src/chainCombiner';
import addToList from '../src/addToList';
import removeFromList from '../src/removeFromList';
import set from '../src/set';
import assign from '../src/assign';

test('createReducerCreator', t => {
    t.plan(8);

    const reducerCreator = createReducerCreator();
    t.equals(typeof reducerCreator, 'function', 'reducerCreator is a function');
    t.equals(typeof reducerCreator(), 'function', 'reducer is a function');
    t.equals(reducerCreator()(), null, 'default reducer return null');
    t.equals(reducerCreator()(5), 5, 'is a no-op when nothing is passed');

    reducerCreator(
        (a, b, options) => {
            const obj = {};
            t.equals(options.equalityCheck(obj, obj), true, 'default equalityCheck is an identity check');
            t.equals(options.valueStrategy({ data: true }), true, 'default valueStrategy uses data prop');
            t.equals(options.keyStrategy({ key: true }), true, 'default keyStrategy uses data prop');
            t.equals(options.combiner, chainCombiner, 'default combiner is chainCombiner');
        }
    )();

    t.end();
});

test('example', t => {
    t.plan(3);

    t.doesNotThrow(() => {
        const reducer = createReducerCreator({
            valueStrategy: action => action.v,
            initialState: [1, 2, 3]
        })(
            addToList('ADD'),
            removeFromList('REMOVE')
        );

        let state = reducer(undefined, { type: 'ADD', v: [4, 5, 6] });
        t.deepEquals(state, [1, 2, 3, 4, 5, 6], 'so far so good');

        state = reducer(state, { type: 'REMOVE', v: [1, 2, 3] });
        t.deepEquals(state, [4, 5, 6], 'still good');
    });

    t.end();
});

test('chainCombiner', t => {
    t.plan(5);

    const options = {}, action = {}, state = {};
    let ranFirst = false;
    chainCombiner([
        state => {
            ranFirst = true;
            return state;
        },
        state => {
            t.equals(ranFirst, true, 'runs reducers in order');
            return state;
        },
        (stateIn, actionIn, optionsIn) => {
            t.equals(stateIn, state, 'passes state');
            t.equals(actionIn, action, 'passes action');
            t.equals(optionsIn, options, 'passes options');
        }
    ], options)(state, action);

    t.equals(ranFirst, true, 'runs reducers synchronously');

    t.end();
});

test('addToList', t => {
    t.plan(7);

    const listAdder = addToList('TEST'), state = [];
    let newState;

    t.equals(listAdder(state), state, 'returns state when not triggered');
    t.equals(listAdder(state).length, 0, 'returns state when not triggered');

    newState = listAdder(state, { type: 'TEST', data: [5] });
    t.deepEquals(newState, [5], 'returns data value when triggered');

    newState = listAdder(newState, { type: 'TEST', data: [6, 7] });
    t.deepEquals(newState, [5, 6, 7], 'can add arrays to the list');

    newState = listAdder(newState, { type: 'TEST', data: 8 });
    t.deepEquals(newState, [5, 6, 7, 8], 'can add non-arrays list');

    newState = listAdder(newState, { type: 'TEST', data2: 9 }, { valueStrategy: action => action.data2 });
    t.deepEquals(newState, [5, 6, 7, 8, 9], 'listens to valueStrategy');

    t.equals(state.length, 0, 'does not mutate state');

    t.end();
});

test('removeFromList', t => {
    t.plan(8);

    const someObj = {};
    const listRemover = removeFromList('TEST'), state = [5, 6, 7, 8, 9, someObj];

    let newState;

    t.equals(listRemover(state), state, 'returns state when not triggered');
    t.equals(listRemover(state).length, 6, 'returns state when not triggered');

    newState = listRemover(state, { type: 'TEST', data: [6, 7] });
    t.deepEquals(newState, [5, 8, 9, someObj], 'can remove arrays from the list');

    newState = listRemover(newState, { type: 'TEST', data: 8 });
    t.deepEquals(newState, [5, 9, someObj], 'can remove non-arrays list');

    newState = listRemover(newState, { type: 'TEST', data: someObj });
    t.deepEquals(newState, [5, 9], 'default equality is identity check');

    newState = listRemover(newState, { type: 'TEST', data2: 9 }, {
        valueStrategy: action => action.data2,
        equalityCheck: (a, b) => a === b
    });
    t.deepEquals(newState, [5], 'listens to valueStrategy');

    newState = listRemover(newState, { type: 'TEST', data2: 9 }, {
        valueStrategy: action => action.data2,
        equalityCheck: (a, b) => b > a
    });
    t.deepEquals(newState, [], 'listens to equalityCheck');

    t.equals(state.length, 6, 'does not mutate state');

    t.end();
});

test('assign', t => {
    t.plan(3);

    const assigner = assign('ASSIGN'), someObj = {}, anotherObj = {};

    t.equals(assigner(someObj), someObj, 'does nothing when not triggered');
    t.equals(assigner(someObj, { type: 'ASSIGN', data: anotherObj}), anotherObj, 'returns value when triggered');
    t.equals(assigner(someObj, { type: 'ASSIGN', data: null}), null, 'can unset the state');

    t.end();
});

test('set', t => {
    t.plan(4);

    const setter = set('SET'), someObj = {}, someValue = {};

    t.equals(setter(someObj), someObj, 'does nothing when not triggered');
    t.deepEquals(setter(null, { type: 'SET', data: someValue, key: 'test' }), { test: someValue }, 'sets a value when triggered even on a nonexistent state');
    t.deepEquals(setter(someObj, { type: 'SET', data: someValue, key: 'test' }), { test: someValue }, 'sets a value when triggered');
    t.equals(Object.keys(someObj).length, 0, 'does not mutate the state');

    t.end();
});