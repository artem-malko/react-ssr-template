import { useAnyActivePage } from 'framework/public/universal';

import { Page } from 'application/pages/shared';

/**
 * Returns an active page, just a wrapper around useAnyActivePage with a binded Page type
 */
export const useActivePage = () => {
  return useAnyActivePage<Page>();
};
