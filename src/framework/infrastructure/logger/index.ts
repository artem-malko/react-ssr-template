import { logQueue } from './logQueue';
import { logger } from './init';
import { ErrorLogParams, InfoLogParams, PerformanceLogParams } from './types';
import { addAppVersion } from './utils';
import { isTest } from 'lib/browser';

/**
 * Can be used on server and client
 */
export function sendErrorLog(params: ErrorLogParams) {
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
    logQueue.addToQueue({ ...paramsWithVersion, level: 'error', environment: 'client' });
  }
}

/**
 * Can be used on server and client
 */
export function sendInfoLog(params: InfoLogParams) {
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
    logQueue.addToQueue({ ...paramsWithVersion, level: 'info', environment: 'client' });
  }
}

/**
 * Can be used on client only
 */
export function sendPerfomanceLog(params: PerformanceLogParams | undefined) {
  if (!params) {
    return;
  }

  if (process.env.APP_ENV === 'server') {
    return;
  }

  logQueue.addToQueue({
    ...params,
    ...addAppVersion(),
    level: 'performance',
    environment: 'client',
  });
}
