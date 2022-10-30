import { configureStore } from 'framework/infrastructure/router/redux/store/configureStore';
import { AnyAppContext } from 'framework/infrastructure/router/types';

import { addStoreSubscribers } from '../utils/addStoreSubscribers';
import { startup } from './startup';

type Params = {
  compileAppURL: (appContext: AnyAppContext) => string;
};
export function restoreStore({ compileAppURL }: Params) {
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
  });

  addStoreSubscribers(store);

  return Promise.resolve(store.dispatch(startup())).then(() => store);
}
