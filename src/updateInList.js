import castStringArray from './castStringArray';
import defaultOptions from './defaultOptions';
import addToList from './addToList';
import removeFromList from './removeFromList';

export default function updateInList(actionOrActions) {
    const actions = castStringArray(actionOrActions);
    return function (state, action = {}, options = defaultOptions) {
        const stateAfterRemoval = removeFromList(actions).apply(this, arguments);
        return addToList(actions)(stateAfterRemoval, action, options);
    };
}