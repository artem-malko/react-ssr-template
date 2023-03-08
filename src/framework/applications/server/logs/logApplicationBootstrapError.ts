import { AppLogger } from 'framework/infrastructure/logger';
import { getMessageAndStackParamsFromError } from 'framework/infrastructure/logger/utils';

import { devConsoleLog } from 'lib/console/devConsole';

type Params = {
  error: Error;
  appLogger: AppLogger;
  sourceName: 'getMetaData' | 'onShellError' | 'onError' | 'InfrastructurePromisesError';
};
export const logApplicationBootstrapError = ({ error, appLogger, sourceName }: Params) => {
  const { message, stack } = getMessageAndStackParamsFromError(error, {
    defaultMessage: `${sourceName} default error message`,
  });

  devConsoleLog(message, error);

  let id = 'qqqqqq';

  switch (sourceName) {
    case 'InfrastructurePromisesError':
      id = 'cv6gga';
      break;
    case 'getMetaData':
      id = 'vg555a';
      break;
    case 'onError':
      id = '7uu2dc';
      break;
    case 'onShellError':
      id = 'bn2f899';
      break;
  }

  appLogger.sendErrorLog({
    id,
    source: 'application_bootstrap',
    message,
    stack,
  });
};
