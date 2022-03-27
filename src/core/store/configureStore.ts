import { applyMiddleware, createStore, Middleware, compose, StoreEnhancer, Store } from 'redux';
import { mainReducer } from './reducer';
import { createSignalMiddleware } from 'infrastructure/signal/middleware';
import { createNavigationMiddleware } from 'infrastructure/router/middlewares';
import { AppState } from './types';
// @TODO move to configureStore params
import { compileAppURL } from 'ui/main/routing';

export function configureStore(params: {
  initialState: AppState | undefined;
  middlewares: Middleware[];
  enhancers: StoreEnhancer[];
}): Store<AppState> {
  const { initialState, middlewares, enhancers } = params;
  const appliedMiddlewares = applyMiddleware(
    createSignalMiddleware(),
    createNavigationMiddleware(compileAppURL),
    ...middlewares,
  );

  const finalEnhancer = compose(appliedMiddlewares, ...enhancers);

  return createStore(mainReducer, initialState as AppState, finalEnhancer as StoreEnhancer<AppState>);
}
