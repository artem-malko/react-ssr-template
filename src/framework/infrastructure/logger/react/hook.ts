import { useContext } from 'react';

import { AppLoggerContext } from './context';

export const useAppLogger = () => {
  return useContext(AppLoggerContext);
};
