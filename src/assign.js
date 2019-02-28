import castStringArray from './castStringArray';
import defaultOptions from './defaultOptions';

export default function assign(actionOrActions) {
    const actions = castStringArray(actionOrActions);
    return function (state, action = {}, options = defaultOptions) {
        if (actions.includes(action.type)) {
            const payload = options.payloadStrategy(action);

            // The payload may be undefined, but a reducer must never return
            // `undefined`. We could ask users to only handle actions with
            // assign that never have an `undefined` payload. We should still
            // handle that case. We can assume the intent was to "unset" the
            // state.
            return typeof payload === 'undefined' ? null : payload;
        }
        return state;
    };
}