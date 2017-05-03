import castStringArray from './castStringArray';
import defaultOptions from './defaultOptions';

export default function assign(actionOrActions) {
    const actions = castStringArray(actionOrActions);
    return function (state, action = {}, options = defaultOptions) {
        if (actions.includes(action.type)) {
            return options.payloadStrategy(action);
        }
        return state;
    };
}