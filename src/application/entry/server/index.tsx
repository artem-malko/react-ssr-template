import {
  defaultClientApplicationConfig,
  defaultServerApplicationConfig,
} from 'application/config/defaults/application';
import { defaultServerConfig } from 'application/config/defaults/server';
import { compileAppURL, routes } from 'application/main/routing';
import { createServices } from 'application/services';
import { ServiceContext } from 'application/services/shared/context';
import { Main } from 'application/ui/main';
import { startServer } from 'framework/applications/server';
import { createApplicationRouteHandler } from 'framework/applications/server/createApplicationRouteHandler';
import { UAParser } from 'framework/applications/server/middlewares/uaParser';
import {
  buildClientApplicationConfig,
  buildServerApplicationConfig,
  buildServerConfig,
} from 'framework/config/generator/server';
import { createRequest } from 'framework/infrastructure/request';
import { createURLParser } from 'framework/infrastructure/router/parseURL';

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

const requester = createRequest({
  networkTimeout: serverApplicationConfig.networkTimeout,
});
const services = createServices({
  requester,
  config: {
    hackerNewsApiUrl: serverApplicationConfig.hackerNewsApiUrl,
    fakeCrudApi: serverApplicationConfig.fakeCrudApi,
  },
});

const renderApplicationRouteHandler = createApplicationRouteHandler({
  parseURL,
  compileAppURL,
  MainComp: (
    <ServiceContext.Provider value={services}>
      <Main />
    </ServiceContext.Provider>
  ),
  clientApplicationConfig,
  serverApplicationConfig,
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
