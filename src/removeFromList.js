import castArray from 'lodash.castarray';
import defaultOptions from './defaultOptions';

export default function removeFromList(actionOrActions) {
    const actions = castArray(actionOrActions);
    return function (state, action = {}, options = defaultOptions) {
        if (actions.includes(action.type) && typeof state.filter === 'function') {
            const data = castArray(options.valueStrategy(action));
            const newState = state.filter(stateValue => !data.some(dataValue => options.equalityCheck(stateValue, dataValue)));
            if (newState.length === state.length) {
                return state;
            } else {
                return newState;
            }
        }
        return state;
    }
}