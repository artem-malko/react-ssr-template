import { startup } from './startup';
import { configureStore } from 'framework/infrastructure/router/redux/store/configureStore';
import { addStoreSubscribers } from '../utils/addStoreSubscribers';
import { AnyAppContext } from 'framework/infrastructure/router/types';

type Params = {
  compileAppURL: (appContext: AnyAppContext) => string;
};
export function restoreStore({ compileAppURL }: Params) {
  const initialState = window.__initialReduxState;
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
