import { useAnyConfig } from 'framework/public/universal';

import { ApplicationConfig } from './types';

export const useConfig = () => {
  return useAnyConfig<ApplicationConfig>();
};
