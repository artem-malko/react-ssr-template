import { createContext } from 'react';

import { noopFunc } from 'lib/lodash';

import { AppLogger } from '..';

export const AppLoggerContext = createContext<AppLogger>({
  sendErrorLog: noopFunc,
  sendInfoLog: noopFunc,
  sendPerfomanceLog: noopFunc,
});
