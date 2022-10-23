import { Page } from 'application/main/types';
import { useCommonNavigate } from 'framework/infrastructure/router/hooks/useCommonNavigate';

export const useNavigate = () => {
  return useCommonNavigate<Page, Page>();
};
