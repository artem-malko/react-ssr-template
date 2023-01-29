import { devConsoleLog } from 'lib/console/devConsole';

import { AppLogger } from '.';
import { getMessageAndStackParamsFromError } from './utils';

export const createClientGlobalErrorHandlers = (appLogger: AppLogger) => {
  return {
    logClientUncaughtException(error: Error) {
      devConsoleLog('logClientUncaughtException error: ', error);

      const { message, stack } = getMessageAndStackParamsFromError(error);

      appLogger.sendErrorLog({
        message: message || 'logClientUncaughtException default error message',
        id: 'ujbvfg',
        source: 'windowerror',
        stack,
      });
    },

    logClientUnhandledRejection(error?: Error) {
      devConsoleLog('logClientUnhandledRejection error: ', error);

      if (!error) {
        appLogger.sendErrorLog({
          id: 'huemld',
          message: 'No reason in UnhandledRejection',
          source: 'unhandledrejection',
        });
        return;
      }

      const { message, stack } = getMessageAndStackParamsFromError(error);

      appLogger.sendErrorLog({
        id: 'vhthav',
        message: message || 'logClientUnhandledRejection default error message',
        stack,
        source: 'unhandledrejection',
      });
    },
  };
};
