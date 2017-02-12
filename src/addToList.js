import castArray from 'lodash.castarray';
import defaultOptions from './defaultOptions';

export default function addToList(actionOrActions) {
    const actions = castArray(actionOrActions);
    return function (state, action = {}, options = defaultOptions) {
        if (actions.includes(action.type)) {
            const data = options.valueStrategy(action);
            return state && typeof state.concat === 'function' ? state.concat(data) : data;
        }
        return state;
    }
}