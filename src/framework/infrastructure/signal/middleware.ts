import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux';

import {
  SIGNAL_ACTION,
  SEQUENCE_ACTION,
  PARALLEL_ACTION,
  WITH_SELECTORS_ACTION,
  NOOP_ACTION,
} from './constants';

export function createSignalMiddleware(): Middleware<Record<string, unknown>> {
  return (store: MiddlewareAPI<Dispatch>) => (next: Dispatch) => (action: AnyAction) => {
    const { dispatch, getState } = store;
    switch (action.type) {
      case SIGNAL_ACTION:
        return dispatch(action.payload);
      case SEQUENCE_ACTION:
        return runSequence(action.payload, dispatch);
      case PARALLEL_ACTION:
        return runParallel(action.payload, dispatch);
      case WITH_SELECTORS_ACTION: {
        const state = getState();
        const selectorsResult = Object.keys(action.selectors).reduce(
          (mutableRes: { [key: string]: any }, selectorLabel) => {
            mutableRes[selectorLabel] = action.selectors[selectorLabel](state);
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

function runSequence(actions: AnyAction[], dispatch: Dispatch) {
  return actions.reduce<Promise<any>>((result, a) => result.then(() => dispatch(a)), Promise.resolve());
}

function runParallel(actions: AnyAction[], dispatch: Dispatch) {
  return Promise.all(actions.map((a) => dispatch(a)));
}
