import { createContext, useContext } from 'react';

import { BaseApplicationConfig } from '../types';

export const ConfigContext = createContext({} as any);

export const useAnyConfig = <T extends BaseApplicationConfig>() => {
  const config = useContext(ConfigContext);

  return config as T;
};
