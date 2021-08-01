import { applyMiddleware, createStore, Middleware, compose, StoreEnhancer, Store } from 'redux';
import { mainReducer } from './reducer';
import { createSignalMiddleware } from 'infrastructure/signal/middleware';
import { createNavigationMiddleware } from 'infrastructure/router/middlewares';
import { AppState } from './types';
import { AppRoutes } from 'ui/main/routing';

export function configureStore(params: {
  initialState: AppState | undefined;
  middlewares: Middleware[];
  enhancers: StoreEnhancer[];
  routes: AppRoutes;
}): Store<AppState> {
  const { initialState, middlewares, enhancers, routes } = params;
  const appliedMiddlewares = applyMiddleware(
    createSignalMiddleware(),
    createNavigationMiddleware(routes),
    ...middlewares,
  );

  const finalEnhancer = compose(appliedMiddlewares, ...enhancers);

  return createStore(mainReducer, initialState as AppState, finalEnhancer as StoreEnhancer<AppState>);
}
