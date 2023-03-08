import { Request } from 'express';

import { logger } from 'framework/infrastructure/logger/init';

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
    case 'fatal':
      logger.fatal({
        level: 'fatal',
        message: 'logFromClient default fatal message',
        ...commonLogData,
        ...params,
      });
      break;
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
