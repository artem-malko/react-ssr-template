import { applyMiddleware, legacy_createStore, Middleware, compose, StoreEnhancer, Store } from 'redux';

import { createNavigationMiddleware } from 'framework/infrastructure/router/redux/middlewares';
import { AnyAppContext, AnyAppState } from 'framework/infrastructure/router/types';
import { createSignalMiddleware } from 'framework/infrastructure/signal/middleware';

import { createReducer, CreateReducerOptions } from './reducer';

export function configureStore(params: {
  initialState: AnyAppState;
  middlewares: Middleware[];
  enhancers: StoreEnhancer[];
  compileAppURL: (appContext: AnyAppContext) => string;
  createReducerOptions: CreateReducerOptions;
}): Store<AnyAppState> {
  const { initialState, middlewares, enhancers, compileAppURL, createReducerOptions } = params;
  const appliedMiddlewares = applyMiddleware(
    createSignalMiddleware(),
    createNavigationMiddleware(compileAppURL),
    ...middlewares,
  );

  const finalEnhancer = compose(appliedMiddlewares, ...enhancers) as StoreEnhancer;

  return legacy_createStore(
    createReducer(initialState, createReducerOptions),
    initialState,
    finalEnhancer,
  );
}
