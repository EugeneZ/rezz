import castStringArray from './castStringArray';
import defaultOptions from './defaultOptions';

export default function set(actionOrActions) {
    const actions = castStringArray(actionOrActions);
    return function (state, action = {}, options = defaultOptions) {
        if (actions.includes(action.type)) {
            const data = options.payloadStrategy(action);
            const key  = options.keyStrategy(action);

            return {
                ...state,
                [key]: data,
            };
        }
        return state;
    };
}