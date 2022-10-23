import { Request } from 'express';

import { logger } from 'framework/infrastructure/logger/init';
import { addAppVersion, getMessageAndStackParamsFromError } from 'framework/infrastructure/logger/utils';
import { isObject } from 'lib/lodash';

/**
 * Only server log methods
 */
export function handleLogFromClient(
  req: Request,
  {
    sidCookieName,
    userCookieName,
  }: {
    sidCookieName: string;
    userCookieName: string;
  },
) {
  const commonLogData = {
    sid: req.cookies[sidCookieName],
    user: req.cookies[userCookieName],
    clientIp: req.clientIp,
    userAgent: req.get('User-Agent'),
    requestedUrl: req.get('Referer'),
  };

  if (!isObject(req.body)) {
    logger.error({
      level: 'error',
      message: 'incorrect log message',
      id: '3ft6v',
      ...commonLogData,
      body: req.body,
    });
    return;
  }

  const { level, ...params } = req.body;

  switch (level) {
    case 'error':
      logger.error({
        level: 'error',
        message: 'logFromClient default error message',
        ...commonLogData,
        ...params,
      });
      break;
    case 'warn':
      logger.warn({
        level: 'warn',
        message: 'logFromClient default warn message',
        ...commonLogData,
        ...params,
      });
      break;
    case 'info':
      logger.info({
        level: 'info',
        message: 'logFromClient info',
        ...commonLogData,
        ...params,
      });
      break;
    case 'performance':
      logger.info({
        level: 'performance',
        message: 'logFromClient performance',
        ...commonLogData,
        ...params,
      });
      break;
    default: // do nothing
  }
}

export function logServerUncaughtException(error: Error) {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('logServerUncaughtException error: ', error);
  }

  const { message, stack } = getMessageAndStackParamsFromError(error);

  logger.error({
    level: 'error',
    message: 'logServerUncaughtException default error message',
    environment: 'server',
    id: 'cy6ek',
    'error.type': 'uncaughtException',
    'error.message': message,
    'error.stack': stack,
    ...addAppVersion(),
  });
}

export function logServerUnhandledRejection(error?: Error) {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('logServerUnhandledRejection error: ', error);
  }

  if (!error) {
    logger.error({
      level: 'error',
      environment: 'server',
      id: 'k6b2w',
      message: 'logServerUnhandledRejection default error message',
      'error.type': 'unhandledRejection',
      'error.message': 'No reason in UnhandledRejection',
      'error.stack': '',
      ...addAppVersion(),
    });
    return;
  }

  const { message, stack } = getMessageAndStackParamsFromError(error);

  logger.error({
    level: 'error',
    environment: 'server',
    id: '3c67e',
    message: 'logServerUnhandledRejection default error message',
    'error.type': 'unhandledRejection',
    'error.message': message,
    'error.stack': stack,
    ...addAppVersion(),
  });
}
