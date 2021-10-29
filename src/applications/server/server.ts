import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import { serverApplicationConfig } from 'config/generator/server';
import { clientIp } from './middlewares/clientIP';
import { isSearchBot } from './middlewares/searchBots';
import { createRouterErrorHandlerMiddleware } from './middlewares/routerErrorHandler';
import { createApplicationRouter } from './routes/application';
import { UAParser } from './middlewares/uaParser';
import { utilityRouter } from './routes/utility';

const publicPath = serverApplicationConfig.publicPath;
const ONE_MONTH = 2592000000;

const server = express();

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

// @JUST_FOR_TEST JUST FOR TEST
server.use((req, _, next) => {
  if (req.url.includes('newsList')) {
    // Artificially delay serving JS
    // to demonstrate streaming HTML.
    // I'd like to remove it from dev process
    setTimeout(next, process.env.NODE_ENV !== 'production' ? 100 : 10000);
  } else {
    next();
  }
});

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
server.use('/_', utilityRouter);

// robots.txt has to be in the root for search bots
server.get('/robots.txt', (_req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'build', 'public') + '/robots.txt');
});

server.get('/favicon.ico', (_req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'build', 'public') + '/favicon.ico');
});

/**
 * Application route handler
 *
 * All services/static/etc routes have to be handled before with route
 * UAParse is used to have a parsed info about User Agent
 */
server.use(UAParser).get('*', createApplicationRouter());

server.use(createRouterErrorHandlerMiddleware());

export { server };
