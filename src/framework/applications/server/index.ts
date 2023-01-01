/* eslint-disable no-console */
import path from 'node:path';

import cookieParser from 'cookie-parser';
import express from 'express';

import { BaseApplicationConfig, BaseServerConfig } from 'framework/config/types';
import { utilityRouterPath } from 'framework/constants/application';
import {
  logServerUncaughtException,
  logServerUnhandledRejection,
} from 'framework/infrastructure/logger/serverLog';
import { isServer } from 'lib/browser';

import { clientIp } from './middlewares/clientIP';
import { createRouterErrorHandlerMiddleware } from './middlewares/routerErrorHandler';
import { isSearchBot } from './middlewares/searchBots';
import { utilityRouter } from './routes/utility';

/**
 * Remove logs from about useLayoutEffect usage on a server side
 * It's just a useless warning in our case
 */
if (isServer && process.env.NODE_ENV !== 'production') {
  // @ts-ignore
  // eslint-disable-next-line functional/immutable-data
  React.useLayoutEffect = () => {
    /** */
  };
}

process.on('uncaughtException', (err: Error) => logServerUncaughtException(err));
process.on('unhandledRejection', (reason: any) => {
  if (reason instanceof Error) {
    logServerUnhandledRejection(reason);
    return;
  }

  const stringifiedReason = typeof reason === 'object' ? JSON.stringify(reason) : reason;

  logServerUnhandledRejection(new Error(stringifiedReason));
});

const server = express();

type Params = {
  enhanceServer: (server: express.Express) => express.Express;
  serverConfig: BaseServerConfig;
  serverApplicationConfig: BaseApplicationConfig;
};
export const startServer = ({ enhanceServer, serverConfig, serverApplicationConfig }: Params) => {
  const publicPath = serverApplicationConfig.publicPath;
  const ONE_MONTH = 2592000000;

  if (process.env.NODE_ENV !== 'production') {
    server.use(
      require('morgan')('dev', {
        // Skip all requests for static files
        skip: (req: express.Request) => {
          return req.originalUrl.includes(publicPath) && req.method === 'GET';
        },
      }),
    );
  }

  // Remove header, which will mark our server as express-server
  // Used to prevent special attacks for express servers
  server.disable('x-powered-by');

  // It parses incoming requests with JSON payloads
  server.use(express.json());
  // Parse URL-encoded bodies
  server.use(
    express.urlencoded({
      extended: true,
    }),
  );
  // It parses incoming requests with Buffer payloads
  server.use(express.raw());
  // It parses incoming requests with text payloads
  server.use(express.text());
  // Add a client IP-address to the req
  server.use(clientIp);
  // Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
  server.use(cookieParser());
  // Check, that current client is a search bot
  server.use(isSearchBot);

  server.use(
    publicPath,
    express.static(path.resolve(process.cwd(), 'build', 'public'), {
      maxAge: ONE_MONTH,
      fallthrough: false,
    }),
  );

  /**
   * Utility routes, like log, healthcheck and so on
   */
  server.use(utilityRouterPath, utilityRouter);

  // robots.txt has to be in the root for search bots
  server.get('/robots.txt', (_req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'build', 'public') + '/robots.txt');
  });

  server.get('/favicon.ico', (_req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'build', 'public') + '/favicon.ico');
  });

  server.use(createRouterErrorHandlerMiddleware());

  enhanceServer(server);

  server.listen(serverConfig.port, '0.0.0.0', () => {
    console.log(`Server started at ${serverConfig.port} port!`);
  });
};
