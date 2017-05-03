import castStringArray from './castStringArray';
import defaultOptions from './defaultOptions';

export default function addToList(actionOrActions) {
    const actions = castStringArray(actionOrActions);
    return function (state, action = {}, options = defaultOptions) {
        if (actions.includes(action.type)) {
            const data = options.payloadStrategy(action);
            return state && typeof state.concat === 'function' ? state.concat(data) : data;
        }
        return state;
    }
}