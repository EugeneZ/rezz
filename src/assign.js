import castArray from 'lodash.castarray';
import defaultOptions from './defaultOptions';

export default function assign(actionOrActions) {
    const actions = castArray(actionOrActions);
    return function (state, action = {}, options = defaultOptions) {
        if (actions.includes(action.type)) {
            return options.payloadStrategy(action);
        }
        return state;
    }
}