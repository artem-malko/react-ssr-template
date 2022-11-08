import { AppLogger } from '.';
import { getMessageAndStackParamsFromError } from './utils';

export const createWindowErrorHandlers = (appLogger: AppLogger) => {
  return {
    logClientUncaughtException(error: Error) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('logClientUncaughtException error: ', error);
      }

      const { message, stack } = getMessageAndStackParamsFromError(error);

      appLogger.sendErrorLog({
        message: message || 'logServerUncaughtException default error message',
        id: 'ujbvfg',
        source: 'windowerror',
        stack,
      });
    },

    logClientUnhandledRejection(error?: Error) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('logServerUnhandledRejection error: ', error);
      }

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
