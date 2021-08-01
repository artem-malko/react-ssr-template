import { Request, Response } from 'express';
import { openPage } from 'core/actions/appContext/openPage';
import { setQueryStringParams } from 'core/actions/appContext/setQueryStringParams';
import { configureStore } from 'core/store/configureStore';
import { logger } from '../utils/reduxLogger';
import { createURLParser } from 'infrastructure/router/parseURL';
import { Middleware } from 'redux';
import { routes } from 'ui/main/routing';
import { startup } from './startup';

const parseURL = createURLParser(routes, {
  onError404Action: openPage({
    name: 'error',
    params: {
      code: 404,
    },
    errorCode: 404,
  }),
  setQueryStringParams,
});

export async function restoreStore(req: Request, _: Response) {
  const middlewares: Middleware[] = process.env.NODE_ENV !== 'production' ? [logger] : [];
  const routerActions = parseURL(req.url);
  const store = configureStore({
    initialState: undefined,
    middlewares,
    enhancers: [],
    routes,
  });

  return Promise.resolve(store.dispatch(startup({ routerActions }))).then(() => store);
}
