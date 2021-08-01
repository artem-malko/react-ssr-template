import { Middleware } from 'redux';
import { startup } from './startup';
import { configureStore } from 'core/store/configureStore';
import { addStoreSubscribers } from '../utils/addStoreSubscribers';
import { routes } from 'ui/main/routing';

export function restoreStore() {
  const initialState = window.initialState;
  const middlewares: Middleware[] = [];
  const mutableEnhancers = [];

  if (process.env.NODE_ENV === 'development') {
    if (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') {
      mutableEnhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
    }
  }

  const store = configureStore({
    initialState,
    middlewares,
    enhancers: mutableEnhancers,
    routes,
  });

  addStoreSubscribers(store);

  return Promise.resolve(store.dispatch(startup())).then(() => store);
}
