import { useCommonNavigate } from 'framework/public/universal';

import { Page } from 'application/pages/shared';

/**
 * Just a wrapper around useCommonNavigate with a binded Page type
 */
export const useNavigate = () => {
  return useCommonNavigate<Page>();
};
