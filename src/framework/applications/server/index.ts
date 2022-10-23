/* eslint-disable no-console */
import { Express } from 'express';

import { serverConfig } from 'config/generator/server';
import { server } from 'framework/applications/server/server';
import {
  logServerUncaughtException,
  logServerUnhandledRejection,
} from 'framework/infrastructure/logger/serverLog';
import { isServer } from 'lib/browser';

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

type Params = {
  enhanceServer: (server: Express) => Express;
};
export const startServer = ({ enhanceServer }: Params) => {
  enhanceServer(server);

  server.listen(serverConfig.port, '0.0.0.0', () => {
    console.log(`Server started at ${serverConfig.port} port!`);
  });
};
