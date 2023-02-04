import { Page } from 'application/main/types';
import { useCommonNavigate } from 'framework/public/universal';

export const useNavigate = () => {
  return useCommonNavigate<Page, Page>();
};
