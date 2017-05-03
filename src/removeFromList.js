import castStringArray from './castStringArray';
import defaultOptions from './defaultOptions';

export default function removeFromList(actionOrActions) {
    const actions = castStringArray(actionOrActions);
    return function (state, action = {}, options = defaultOptions) {
        if (actions.includes(action.type) && typeof state.filter === 'function') {
            const data      = options.payloadStrategy(action);
            const dataArray = Array.isArray(data) ? data : [data];
            const newState  = state.filter(stateValue => !dataArray.some(dataValue => options.equalityCheck(stateValue, dataValue)));
            if (newState.length === state.length) {
                return state;
            } else {
                return newState;
            }
        }
        return state;
    };
}