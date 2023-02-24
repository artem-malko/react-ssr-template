import { useCallback } from 'react';

import { commonWithSelectors, sequence } from 'framework/infrastructure/signal';

import { setQueryStringParamsAction } from '../redux/actions/appContext/setQueryStringParams';
import { historyReplace, historyPush } from '../redux/actions/router';
import { useRouterReduxSelector, useRouterReduxDispatch } from '../redux/hooks';
import { AnyAppState, URLQueryParams } from '../types';

const selectURLQueryParams = (state: AnyAppState) => state.appContext.URLQueryParams;

export const useURLQuery = () => {
  const URLQueryParams = useRouterReduxSelector(selectURLQueryParams);
  const dispatch = useRouterReduxDispatch();

  const setURLQueryParams = useCallback(
    (params: {
      queryParams: (currentURLQueryParams: URLQueryParams) => URLQueryParams;
      useReplace?: boolean;
    }) => {
      const { queryParams, useReplace = false } = params;

      dispatch(
        sequence(
          commonWithSelectors(
            { currentURLQueryParams: selectURLQueryParams },
            ({ currentURLQueryParams }) =>
              setQueryStringParamsAction(queryParams(currentURLQueryParams)),
          ),
          useReplace ? historyReplace() : historyPush(),
        ),
      );
    },
    [dispatch],
  );

  return {
    URLQueryParams,
    setURLQueryParams,
  };
};
