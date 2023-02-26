import { useCallback } from 'react';

import { commonWithSelectors, sequence } from 'framework/infrastructure/signal';

import { ValidateStructure } from 'lib/types';

import { setQueryStringParamsAction } from '../redux/actions/appContext/setQueryStringParams';
import { historyReplace, historyPush } from '../redux/actions/router';
import { useRouterReduxSelector, useRouterReduxDispatch } from '../redux/hooks';
import { AnyAppState, URLQueryParams } from '../types';

const selectURLQueryParams = (state: AnyAppState) => state.appContext.URLQueryParams;

export const useCommonURLQuery = <QueryKeys extends string>() => {
  const URLQueryParams: URLQueryParams<QueryKeys> = useRouterReduxSelector(selectURLQueryParams);
  const dispatch = useRouterReduxDispatch();

  const setURLQueryParams = useCallback(
    <Res>(params: {
      queryParams: (
        currentURLQueryParams: URLQueryParams<QueryKeys>,
      ) => ValidateStructure<Res, URLQueryParams<QueryKeys>>;
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
