import { Request, Response } from 'express';
import { AnyAction, Middleware } from 'redux';

import { configureStore } from 'framework/infrastructure/router/redux/store/configureStore';
import { AnyAppContext } from 'framework/infrastructure/router/types';

import { logger } from '../utils/reduxLogger';
import { startup } from './startup';


type Params = {
  parseURL: (URL: string) => AnyAction[];
  compileAppURL: (appContext: AnyAppContext) => string;
  req: Request;
  res: Response;
};
export async function restoreStore({ parseURL, compileAppURL, req }: Params) {
  const middlewares: Middleware[] = process.env.NODE_ENV !== 'production' ? [logger] : [];
  const routerActions = parseURL(req.url);
  const store = configureStore({
    // @TODO_FRAMEWORK
    initialState: {
      appContext: {
        page: { name: 'root' },
        URLQueryParams: undefined,
      },
    },
    middlewares,
    enhancers: [],
    compileAppURL,
  });

  return Promise.resolve(store.dispatch(startup({ routerActions }))).then(() => store);
}
