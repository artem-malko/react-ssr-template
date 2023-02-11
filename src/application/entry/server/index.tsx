import { Main } from 'application/entry/react';
import { routes } from 'application/pages/shared';
import {
  defaultClientApplicationConfig,
  defaultServerApplicationConfig,
} from 'application/shared/config/defaults/application';
import { defaultServerConfig } from 'application/shared/config/defaults/server';
import { CompileAppURLContext } from 'application/shared/kit/link/context';
import { createServices } from 'application/shared/services';
import { ServiceContext } from 'application/shared/services/shared/context';
import { createApplicationRouteHandler } from 'framework/public/server';
import { createURLParser } from 'framework/public/server';
import {
  buildClientApplicationConfig,
  buildServerApplicationConfig,
  buildServerConfig,
} from 'framework/public/server';
import { startServer } from 'framework/public/server';
import { createRequest, createAppLogger, createURLCompiler } from 'framework/public/universal';

import { UAParser } from './middlewares/UAParser';
import { fakeCRUDRouter } from './routes/fakeCrud';

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
const services = createServices({
  request,
  config: {
    hackerNewsApiUrl: serverApplicationConfig.hackerNewsApiUrl,
    fakeCrudApi: serverApplicationConfig.fakeCrudApi,
  },
  appLogger,
});
const compileAppURL = createURLCompiler(routes);

const renderApplicationRouteHandler = createApplicationRouteHandler({
  parseURL,
  compileAppURL,
  MainComp: (
    <CompileAppURLContext.Provider value={compileAppURL}>
      <ServiceContext.Provider value={services}>
        <Main />
      </ServiceContext.Provider>
    </CompileAppURLContext.Provider>
  ),
  clientApplicationConfig,
  serverApplicationConfig,
  initialAppContext: {
    page: {
      name: 'root',
    },
    URLQueryParams: undefined,
  },
  appLogger,
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
