import { createContext, useContext } from 'react';

import { defaultApplicationConfig } from '../defaults/application';

export const ConfigContext = createContext(defaultApplicationConfig);

export const useConfig = () => {
  const config = useContext(ConfigContext);

  return config;
};
