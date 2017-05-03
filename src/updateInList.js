import castArray from 'lodash.castarray';
import defaultOptions from './defaultOptions';
import addToList from './addToList';
import removeFromList from './removeFromList';

export default function updateInList(actionOrActions) {
    const actions = castArray(actionOrActions);
    return function (state, action = {}, options = defaultOptions) {
        const stateAfterRemoval = removeFromList(actions).apply(this, arguments);
        return addToList(actions)(stateAfterRemoval, action, options);
    };
}