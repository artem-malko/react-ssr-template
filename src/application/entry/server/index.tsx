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

import { getMetadata, defaultBaseMetadata } from './metadata/getMetadata';
import { UAParser } from './middlewares/UAParser';
import { fakeCRUDRouter } from './routes/fakeCrud';
import { onErrorFallbackHTML } from './utils/onErrorFallbackHTML';
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
  router: {
    parseURL,
    compileURL: compileAppURL,
    initialAppContext: {
      page: {
        name: 'root',
      },
      URLQueryParams: {},
    },
    allowedURLQueryKeys,
  },
  MainComp: (
    <CompileAppURLContext.Provider value={compileAppURL}>
      <RequesterContext.Provider value={request}>
        <Main />
      </RequesterContext.Provider>
    </CompileAppURLContext.Provider>
  ),
  clientApplicationConfig,
  serverApplicationConfig,
  appLogger,
  metadata: {
    get: getMetadata,
    defaultBaseMetadata,
  },
  onErrorFallbackHTML,
});

startServer({
  serverConfig,
  publicPath: serverApplicationConfig.publicPath,
  onErrorFallbackHTML,
  enhanceServer: (server) => {
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
