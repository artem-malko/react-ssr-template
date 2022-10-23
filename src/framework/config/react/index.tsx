import { createContext, useContext } from 'react';

import { AnyConfig } from '../types';

export const ConfigContext = createContext({} as any);

export const useAnyConfig = <T extends AnyConfig>() => {
  const config = useContext(ConfigContext);

  return config as T;
};
