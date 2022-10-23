import { applyMiddleware, legacy_createStore, Middleware, compose, StoreEnhancer, Store } from 'redux';
import { createSignalMiddleware } from 'framework/infrastructure/signal/middleware';
import { createNavigationMiddleware } from 'framework/infrastructure/router/redux/middlewares';
import { AnyAppContext, AnyAppState } from 'framework/infrastructure/router/types';
import { createReducer } from './reducer';

export function configureStore(params: {
  initialState: AnyAppState;
  middlewares: Middleware[];
  enhancers: StoreEnhancer[];
  compileAppURL: (appContext: AnyAppContext) => string;
}): Store<AnyAppState> {
  const { initialState, middlewares, enhancers, compileAppURL } = params;
  const appliedMiddlewares = applyMiddleware(
    createSignalMiddleware(),
    createNavigationMiddleware(compileAppURL),
    ...middlewares,
  );

  const finalEnhancer = compose(appliedMiddlewares, ...enhancers) as StoreEnhancer;

  return legacy_createStore(createReducer(initialState), initialState, finalEnhancer);
}
