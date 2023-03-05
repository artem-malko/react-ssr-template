import { QueryClient } from '@tanstack/react-query';

import { PlatformAPI } from 'framework/infrastructure/platform';
import { configureStore } from 'framework/infrastructure/router/redux/store/configureStore';
import { CreateReducerOptions } from 'framework/infrastructure/router/redux/store/reducer';
import { AnyAppContext, AnyPage } from 'framework/infrastructure/router/types';

import { createTitleMiddleware } from './middleware/title';
import { startup } from './startup';
import { GetTitle } from '../types';
import { addStoreSubscribers } from '../utils/addStoreSubscribers';

type Params<Page extends AnyPage<string>> = {
  compileAppURL: (appContext: AnyAppContext) => string;
  createReducerOptions: CreateReducerOptions;
  queryClient: QueryClient;
  windowApi: PlatformAPI['window'];
  getTitle: GetTitle<Page>;
};
export function restoreStore<Page extends AnyPage<string>>({
  compileAppURL,
  createReducerOptions,
  queryClient,
  windowApi,
  getTitle,
}: Params<Page>) {
  const initialState = window.__initialRouterState;
  const mutableEnhancers = [];

  if (process.env.NODE_ENV === 'development') {
    if (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') {
      mutableEnhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
    }
  }

  const store = configureStore<Page>({
    initialState,
    middlewares: [
      createTitleMiddleware({
        queryClient,
        windowApi,
        getTitle,
      }),
    ],
    enhancers: mutableEnhancers,
    compileAppURL,
    createReducerOptions,
  });

  addStoreSubscribers(store);

  return Promise.resolve(store.dispatch(startup())).then(() => store);
}
