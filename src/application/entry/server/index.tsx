import {
  startServer,
  createApplicationRouteHandler,
  buildClientApplicationConfig,
  buildServerApplicationConfig,
  buildServerConfig,
  createURLParser,
} from 'framework/public/server';
import { createRequest, createAppLogger, createURLCompiler } from 'framework/public/universal';

import { routes } from 'application/pages/shared';

import { CompileAppURLContext, allowedURLQueryKeys } from 'application/entities/ui/navigation';

import {
  defaultClientApplicationConfig,
  defaultServerApplicationConfig,
  defaultServerConfig,
} from 'application/shared/config';
import { RequesterContext } from 'application/shared/lib/request';

import { UAParser } from './middlewares/UAParser';
import { fakeCRUDRouter } from './routes/fakeCrud';
import { Main } from '../common/react';

const parseURL = createURLParser({
  routes,
  handle404Error: () => ({
    name: 'error',
    params: {
      code: 404,
    },
  }),
});

const serverApplicationConfig = buildServerApplicationConfig(defaultServerApplicationConfig);
const clientApplicationConfig = buildClientApplicationConfig(defaultClientApplicationConfig);
const serverConfig = buildServerConfig(defaultServerConfig);

const request = createRequest({
  networkTimeout: serverApplicationConfig.networkTimeout,
});
const appLogger = createAppLogger({
  networkTimeout: serverApplicationConfig.networkTimeout,
});
const compileAppURL = createURLCompiler(routes);

const renderApplicationRouteHandler = createApplicationRouteHandler({
  parseURL,
  compileAppURL,
  MainComp: (
    <CompileAppURLContext.Provider value={compileAppURL}>
      <RequesterContext.Provider value={request}>
        <Main />
      </RequesterContext.Provider>
    </CompileAppURLContext.Provider>
  ),
  clientApplicationConfig,
  serverApplicationConfig,
  initialAppContext: {
    page: {
      name: 'root',
    },
    URLQueryParams: {},
  },
  appLogger,
  allowedURLQueryKeys,
});

startServer({
  serverApplicationConfig,
  serverConfig,
  enhanceServer: (server) => {
    // @JUST_FOR_TEST JUST FOR TEST
    server.use((req, _res, next) => {
      // Artificially delay serving JS
      // to demonstrate streaming HTML
      if (req.url.includes('newsList.')) {
        setTimeout(next, process.env.NODE_ENV === 'production' ? 2000 : 1000);
      } else {
        next();
      }
    });

    server.use('/api/fakecrud', fakeCRUDRouter);

    /**
     * Application route handler
     *
     * All services/static/etc routes have to be handled before with route
     * UAParse is used to have a parsed info about User Agent
     */
    server.use(UAParser).get('*', renderApplicationRouteHandler);

    return server;
  },
});
