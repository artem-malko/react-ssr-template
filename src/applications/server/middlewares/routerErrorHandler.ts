import express from 'express';
import { sendErrorLog } from 'infrastructure/logger';
import { getMessageAndStackParamsFromError } from 'infrastructure/logger/utils';

export function createRouterErrorHandlerMiddleware(): express.ErrorRequestHandler {
  return (error, _req, res, _next) => {
    const { message, stack } = getMessageAndStackParamsFromError(error, {
      defaultMessage: 'Express router error',
      stackSize: 1024,
    });

    sendErrorLog({
      'error.type': 'router',
      id: 'vzowo',
      message,
      'error.stack': stack,
    });

    // @TODO add 500 page render
    res.status(500).send('500 error');
  };
}
