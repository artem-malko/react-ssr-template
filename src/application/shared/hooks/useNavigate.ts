import { Page } from 'application/pages/shared';
import { useCommonNavigate } from 'framework/public/universal';

export const useNavigate = () => {
  return useCommonNavigate<Page>();
};
