import { useAnyPage } from 'framework/public/universal';

import { Page } from '../types';

export const useActivePage = () => {
  return useAnyPage<Page>();
};
