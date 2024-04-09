import { UnknownAction, Dispatch, Middleware, isAction } from 'redux';

import {
  SIGNAL_ACTION,
  SEQUENCE_ACTION,
  PARALLEL_ACTION,
  WITH_SELECTORS_ACTION,
  NOOP_ACTION,
} from './constants';
import {
  isSignalActionWithActionInPayload,
  isSignalActionWithActionsInPayload,
  isSignalActionWithSelectorsInPayload,
} from './utils';

export function createSignalMiddleware(): Middleware<Record<string, unknown>> {
  return (store) => (next) => (action) => {
    if (!isAction(action)) {
      return next(action);
    }

    const { dispatch, getState } = store;

    switch (action.type) {
      case SIGNAL_ACTION:
        return isSignalActionWithActionInPayload(action) ? dispatch(action.payload) : next(action);
      case SEQUENCE_ACTION:
        return isSignalActionWithActionsInPayload(action)
          ? runSequence(action.payload, dispatch)
          : next(action);
      case PARALLEL_ACTION:
        return isSignalActionWithActionsInPayload(action)
          ? runParallel(action.payload, dispatch)
          : next(action);
      case WITH_SELECTORS_ACTION: {
        const state = getState();

        if (!isSignalActionWithSelectorsInPayload(action)) {
          return next(action);
        }

        const selectorsResult = Object.keys(action.selectors).reduce(
          (mutableRes: { [key: string]: any }, selectorLabel) => {
            mutableRes[selectorLabel] = action.selectors[selectorLabel]?.(state);
            return mutableRes;
          },
          {},
        );
        const withSelectorsAction = action.payload(selectorsResult);
        return dispatch(withSelectorsAction);
      }
      case NOOP_ACTION:
        return;
      default:
        return next(action);
    }
  };
}

function runSequence(actions: UnknownAction[], dispatch: Dispatch) {
  return actions.reduce<Promise<any>>((result, a) => result.then(() => dispatch(a)), Promise.resolve());
}

function runParallel(actions: UnknownAction[], dispatch: Dispatch) {
  return Promise.all(actions.map((a) => dispatch(a)));
}
