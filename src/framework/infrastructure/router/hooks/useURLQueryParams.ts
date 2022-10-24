import { useCallback } from 'react';

import { sequence } from 'framework/infrastructure/signal';

import { setQueryStringParamsAction } from '../redux/actions/appContext/setQueryStringParams';
import { historyReplace, historyPush } from '../redux/actions/router';
import { useRouterReduxSelector } from '../redux/hooks';
import { useRouterReduxDispatch } from '../redux/hooks';
import { AnyAppState, URLQueryParams } from '../types';

const selectURLQueryParams = (state: AnyAppState) => state.appContext.URLQueryParams;

export const useURLQuery = () => {
  const URLQueryParams = useRouterReduxSelector(selectURLQueryParams);
  const dispatch = useRouterReduxDispatch();

  const updateURLQuery = useCallback(
    (params: { queryParams: URLQueryParams; useReplace?: boolean }) => {
      const { queryParams, useReplace = false } = params;

      dispatch(
        sequence(setQueryStringParamsAction(queryParams), useReplace ? historyReplace() : historyPush()),
      );
    },
    [dispatch],
  );

  return {
    URLQueryParams,
    updateURLQuery,
  };
};
