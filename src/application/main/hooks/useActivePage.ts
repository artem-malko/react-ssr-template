import { useAnyPage } from 'framework/infrastructure/router/hooks/useAnyPage';

import { Page } from '../types';


export const useActivePage = () => {
  return useAnyPage<Page>();
};
