import { logger } from 'framework/infrastructure/logger/init';
import { addAppVersion, getMessageAndStackParamsFromError } from 'framework/infrastructure/logger/utils';

import { devConsoleLog } from 'lib/console/devConsole';

export function logServerUnhandledRejection(error?: Error) {
  devConsoleLog('logServerUnhandledRejection error: ', error);

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
