/* eslint-disable no-console */

import { server } from 'applications/server/server';
import { serverConfig } from 'config/generator/server';
import {
  logServerUncaughtException,
  logServerUnhandledRejection,
} from 'infrastructure/logger/serverLog';

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
