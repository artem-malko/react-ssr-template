import { isTest } from 'lib/browser';
import { Queue } from 'lib/queue';

import { createRequest } from '../request';
import { logger } from './init';
import { ErrorLogParams, FatalLogParams, InfoLogParams, PerformanceLogParams } from './types';
import { addAppVersion } from './utils';

type QueueLogParams = { environment: 'client'; level: 'info' | 'error' | 'fatal' | 'performance' } & (
  | ErrorLogParams
  | InfoLogParams
  | PerformanceLogParams
);

export type AppLogger = ReturnType<ReturnType<typeof createUniversalAppLoggerCreator>>;

type Params = {
  networkTimeout?: number;
};
export const createUniversalAppLoggerCreator =
  (path: string) =>
  ({ networkTimeout = 30 * 1000 }: Params) => {
    const request = createRequest({ networkTimeout });
    const action = (logParams: QueueLogParams) => {
      return request(path, {
        method: 'post',
        data: logParams,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    };

    const logQueue = new Queue({ action });

    return {
      /**
       * Can be used on server and client
       *
       * Send this level, if an application is totally broken
       */
      sendFatalErrorLog: (params: FatalLogParams) => {
        if (isTest) {
          return;
        }

        const paramsWithVersion = {
          message: 'sendFatalErrorLog default message',
          ...params,
          ...addAppVersion(),
        };

        if (process.env.APP_ENV === 'server') {
          logger.fatal({
            ...paramsWithVersion,
            level: 'fatal',
            environment: 'server',
          });
        } else {
          logQueue.addToQueue({
            ...paramsWithVersion,
            level: 'fatal',
            environment: 'client',
          });
        }
      },

      /**
       * Can be used on server and client
       *
       * Send this level, if there is an error, but an application is working
       */
      sendErrorLog: (params: ErrorLogParams) => {
        if (isTest) {
          return;
        }

        const paramsWithVersion = {
          message: 'sendErrorLog default message',
          ...params,
          ...addAppVersion(),
        };

        if (process.env.APP_ENV === 'server') {
          logger.error({
            ...paramsWithVersion,
            level: 'error',
            environment: 'server',
          });
        } else {
          logQueue.addToQueue({
            ...paramsWithVersion,
            level: 'error',
            environment: 'client',
          });
        }
      },

      /**
       * Can be used on server and client
       *
       * Send this log just to send any info
       */
      sendInfoLog: (params: InfoLogParams) => {
        const paramsWithVersion = {
          ...params,
          ...addAppVersion(),
        };

        if (process.env.APP_ENV === 'server') {
          logger.info({
            ...paramsWithVersion,
            level: 'info',
            environment: 'server',
          });
        } else {
          logQueue.addToQueue({
            ...paramsWithVersion,
            level: 'info',
            environment: 'client',
          });
        }
      },

      /**
       * Can be used on client only
       */
      sendPerfomanceLog: (params: PerformanceLogParams) => {
        if (process.env.APP_ENV === 'server') {
          return;
        }

        logQueue.addToQueue({
          ...params,
          ...addAppVersion(),
          level: 'performance',
          environment: 'client',
        });
      },
    };
  };
