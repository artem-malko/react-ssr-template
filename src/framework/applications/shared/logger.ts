import { utilityRouterPath } from 'framework/constants/application';
import { createUniversalAppLoggerCreator } from 'framework/infrastructure/logger';

export const handleClientLogPath = '/log';

export const createAppLogger = createUniversalAppLoggerCreator(
  `${utilityRouterPath}${handleClientLogPath}`,
);
