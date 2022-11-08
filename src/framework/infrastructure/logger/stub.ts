import { stub } from 'sinon';

import { AppLogger } from '.';

export const appLoggerStub: AppLogger = {
  sendFatalErrorLog: stub(),
  sendErrorLog: stub(),
  sendInfoLog: stub(),
  sendPerfomanceLog: stub(),
};
