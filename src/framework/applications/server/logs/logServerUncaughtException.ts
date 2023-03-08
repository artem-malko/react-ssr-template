import { logger } from 'framework/infrastructure/logger/init';
import { addAppVersion, getMessageAndStackParamsFromError } from 'framework/infrastructure/logger/utils';

import { devConsoleLog } from 'lib/console/devConsole';

export function logServerUncaughtException(error: Error) {
  devConsoleLog('logServerUncaughtException error: ', error);

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
