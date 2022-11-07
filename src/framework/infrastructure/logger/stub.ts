import { stub } from 'sinon';

import { AppLogger } from '.';

export const appLoggerStub: AppLogger = {
  sendErrorLog: stub(),
  sendInfoLog: stub(),
  sendPerfomanceLog: stub(),
};
