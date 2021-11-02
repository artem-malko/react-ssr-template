import { Middleware } from 'redux';
import { startup } from './startup';
import { configureStore } from 'core/store/configureStore';
import { addStoreSubscribers } from '../utils/addStoreSubscribers';
import { ToastController } from 'ui/kit/toast/infrastructure/controller';
import { createToastsMiddleware } from 'ui/kit/toast/infrastructure/middleware';

export function restoreStore(params: { toastController: ToastController }) {
  const { toastController } = params;
  const initialState = window.__initialReduxState;
  const middlewares: Middleware[] = [createToastsMiddleware(toastController)];
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
  });

  addStoreSubscribers(store);

  return Promise.resolve(store.dispatch(startup())).then(() => store);
}
