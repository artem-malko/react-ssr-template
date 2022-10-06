/* eslint-disable no-console */

import { server } from 'applications/server/server';
import { serverConfig } from 'config/generator/server';
import {
  logServerUncaughtException,
  logServerUnhandledRejection,
} from 'infrastructure/logger/serverLog';

/**
 * Remove logs from about useLayoutEffect usage on a server side
 * It's just a useless warning in our case
 */
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
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

server.listen(serverConfig.port, '0.0.0.0', () => {
  console.log(`Server started at ${serverConfig.port} port!`);
});
