import { configureStore } from 'framework/infrastructure/router/redux/store/configureStore';
import { CreateReducerOptions } from 'framework/infrastructure/router/redux/store/reducer';
import { AnyAppContext } from 'framework/infrastructure/router/types';

import { startup } from './startup';
import { addStoreSubscribers } from '../utils/addStoreSubscribers';

type Params = {
  compileAppURL: (appContext: AnyAppContext) => string;
  createReducerOptions: CreateReducerOptions;
};
export function restoreStore({ compileAppURL, createReducerOptions }: Params) {
  const initialState = window.__initialRouterState;
  const mutableEnhancers = [];

  if (process.env.NODE_ENV === 'development') {
    if (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') {
      mutableEnhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
    }
  }

  const store = configureStore({
    initialState,
    middlewares: [],
    enhancers: mutableEnhancers,
    compileAppURL,
    createReducerOptions,
  });

  addStoreSubscribers(store);

  return Promise.resolve(store.dispatch(startup())).then(() => store);
}
