import { Page } from 'application/pages/shared';
import { useAnyPage } from 'framework/public/universal';

export const useActivePage = () => {
  return useAnyPage<Page>();
};
