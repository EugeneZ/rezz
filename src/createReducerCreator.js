import defaults from 'lodash.defaults';
import defaultOptions from './defaultOptions';

export default function createReducerCreator(options) {
    const opts = defaults({}, options, defaultOptions);

    return function (...reducers) {
        return function (state = opts.initialState, action) {
            return opts.combiner(reducers, opts)(state, action);
        };
    };
}