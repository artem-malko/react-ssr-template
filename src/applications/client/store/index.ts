import { Middleware } from 'redux';
import { startup } from './startup';
import { configureStore } from 'core/store/configureStore';
import { addStoreSubscribers } from '../utils/addStoreSubscribers';
import { ToastController } from 'ui/kit/toast/infrastructure/controller';
import { createToastsMiddleware } from 'ui/kit/toast/infrastructure/middleware';
import { PopupController } from 'ui/kit/popup/infrastructure/controller';
import { createPopupMiddleware } from 'ui/kit/popup/infrastructure/middleware';

export function restoreStore(params: {
  toastController: ToastController;
  popupController: PopupController;
}) {
  const { toastController, popupController } = params;
  const initialState = window.__initialReduxState;
  const middlewares: Middleware[] = [
    createToastsMiddleware(toastController),
    createPopupMiddleware(popupController),
  ];
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
