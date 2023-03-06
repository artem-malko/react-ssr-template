import express from 'express';

import { logger } from 'framework/infrastructure/logger/init';
import { addAppVersion, getMessageAndStackParamsFromError } from 'framework/infrastructure/logger/utils';

type Params = {
  onErrorFallbackHTML: (error?: Error) => string;
};
export function createRouterErrorHandlerMiddleware({
  onErrorFallbackHTML,
}: Params): express.ErrorRequestHandler {
  return (error, _req, res, _next) => {
    const { message, stack } = getMessageAndStackParamsFromError(error, {
      defaultMessage: 'Express router error',
      stackSize: 1024,
    });

    logger.error({
      level: 'error',
      environment: 'server',
      id: 'vzowo',
      'error.type': 'router',
      'error.message': message,
      'error.stack': stack,
      ...addAppVersion(),
    });

    res.status(500).send(onErrorFallbackHTML(error));
  };
}
