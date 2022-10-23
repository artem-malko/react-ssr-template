import { Main } from 'application/ui/main';
import { startServer } from 'framework/applications/server';
import { UAParser } from 'framework/applications/server/middlewares/uaParser';
import { createApplicationRouteHandler } from 'framework/applications/server/routes/applicationEntry';
import { compileAppURL, routes } from 'application/main/routing';
import { createURLParser } from 'framework/infrastructure/router/parseURL';
import { fakeCRUDRouter } from './routes/fakeCrud';
import { createRequest } from 'framework/infrastructure/request';
import { createServices } from 'application/services';
import { ServiceContext } from 'application/services/shared/context';
import { serverApplicationConfig } from 'config/generator/server';

const parseURL = createURLParser({
  routes,
  handle404Error: () => ({
    name: 'error',
    params: {
      code: 404,
    },
  }),
});

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

startServer({
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
    server.use(UAParser).get(
      '*',
      createApplicationRouteHandler({
        parseURL,
        compileAppURL,
        MainComp: (
          <ServiceContext.Provider value={services}>
            <Main />
          </ServiceContext.Provider>
        ),
      }),
    );

    return server;
  },
});
