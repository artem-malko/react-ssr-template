import { Request, Response } from 'express';
import { AnyAction, Middleware } from 'redux';

import { configureStore } from 'framework/infrastructure/router/redux/store/configureStore';
import { AnyAppContext } from 'framework/infrastructure/router/types';

import { logger } from '../utils/reduxLogger';
import { startup } from './startup';

type Params = {
  req: Request;
  res: Response;
  parseURL: (URL: string) => AnyAction[];
  compileAppURL: (appContext: AnyAppContext) => string;
  initialAppContext: AnyAppContext;
};
export async function restoreStore({ parseURL, compileAppURL, req, initialAppContext }: Params) {
  const middlewares: Middleware[] = process.env.NODE_ENV !== 'production' ? [logger] : [];
  const routerActions = parseURL(req.url);
  const store = configureStore({
    initialState: {
      appContext: initialAppContext,
    },
    middlewares,
    enhancers: [],
    compileAppURL,
  });

  return Promise.resolve(store.dispatch(startup({ routerActions }))).then(() => store);
}
