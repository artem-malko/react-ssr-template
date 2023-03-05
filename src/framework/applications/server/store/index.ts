import { Request, Response } from 'express';
import { AnyAction, Middleware } from 'redux';

import { configureStore } from 'framework/infrastructure/router/redux/store/configureStore';
import { CreateReducerOptions } from 'framework/infrastructure/router/redux/store/reducer';
import { AnyAppContext, AnyPage } from 'framework/infrastructure/router/types';

import { startup } from './startup';
import { logger } from '../utils/reduxLogger';

type Params = {
  req: Request;
  res: Response;
  parseURL: (URL: string) => AnyAction[];
  compileAppURL: (appContext: AnyAppContext) => string;
  initialAppContext: AnyAppContext;
  createReducerOptions: CreateReducerOptions;
};
export async function restoreStore<Page extends AnyPage<string>>({
  parseURL,
  compileAppURL,
  req,
  initialAppContext,
  createReducerOptions,
}: Params) {
  const middlewares: Middleware[] = process.env.NODE_ENV !== 'production' ? [logger] : [];
  const routerActions = parseURL(req.url);
  const store = configureStore<Page>({
    initialState: {
      appContext: initialAppContext,
    },
    middlewares,
    enhancers: [],
    compileAppURL,
    createReducerOptions,
  });

  return Promise.resolve(store.dispatch(startup({ routerActions }))).then(() => store);
}
