export default function chainCombiner(reducers, options) {
    return function(state, action) {
        reducers.forEach(reducer => {
            state = reducer(state, action, options);
        });
        return state;
    }
}