import chainCombiner from './chainCombiner';

export default {
    initialState:    null,
    combiner:        chainCombiner,
    equalityCheck:   (a, b) => a === b,
    payloadStrategy: (action) => action.payload,
    keyStrategy:     (action) => action.key,
};