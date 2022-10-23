import { useRouterReduxSelector } from '../redux/hooks';
import { AnyAppState } from '../types';

const selectURLQueryParams = (state: AnyAppState) => state.appContext.URLQueryParams;

export const useURLQueryParams = () => {
  const URLQueryParams = useRouterReduxSelector(selectURLQueryParams);

  return {
    URLQueryParams,
  };
};
