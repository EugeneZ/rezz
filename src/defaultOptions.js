import chainCombiner from './chainCombiner';

export default {
    initialState: null,
    combiner: chainCombiner,
    equalityCheck: (a, b) => a === b,
    valueStrategy: (action) => action.data,
    keyStrategy: (action) => action.key,
};