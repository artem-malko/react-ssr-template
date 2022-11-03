import { useAnyConfig } from 'framework/config/react';

import { ApplicationConfig } from './types';

export const useConfig = () => {
  return useAnyConfig<ApplicationConfig>();
};
