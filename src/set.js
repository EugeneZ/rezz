import castArray from 'lodash.castarray';
import defaultOptions from './defaultOptions';

export default function set(actionOrActions) {
    const actions = castArray(actionOrActions);
    return function (state, action = {}, options = defaultOptions) {
        if (actions.includes(action.type)) {
            const data = options.valueStrategy(action);
            const key = options.keyStrategy(action);

            return {
                ...state,
                [key]: data,
            };
        }
        return state;
    }
}