import { QueryKey, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { ParsedError } from '../request/types';

type Params = {
  key: QueryKey;
  queryId: string;
  isErrorCodeOkToResetCacheCheck?: (errorCode: ParsedError['code']) => boolean;
};
/**
 * Reset cache for a query, if it is in a error state on a component unmount
 */
export const useResetCacheOnUnmount = <TResult, TError extends ParsedError>({
  key,
  queryId,
  isErrorCodeOkToResetCacheCheck,
}: Params) => {
  const queryClient = useQueryClient();
  const isErrorCodeOkToResetCacheChecker =
    isErrorCodeOkToResetCacheCheck || defaultIsErrorCodeOkToResetCacheCheck;

  useEffect(() => {
    return () => {
      const queryState = queryClient.getQueryState<TResult, TError>(key);

      if (queryState?.status !== 'error') {
        return;
      }

      const errorCode = queryState?.error && queryState?.error.code;
      const isErrorCodeOkToResetCache = errorCode ? isErrorCodeOkToResetCacheChecker(errorCode) : true;

      if (isErrorCodeOkToResetCache) {
        queryClient.getQueryCache().find({ exact: true, queryKey: key })?.reset();
      }
    };
    // We use queryId as compiled key here,
    // cause key is a new array every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, queryId, isErrorCodeOkToResetCacheChecker]);
};

/**
 * It's quite useless to retry a request with 404 response
 */
const defaultIsErrorCodeOkToResetCacheCheck = (errorCode: ParsedError['code']) => {
  return errorCode !== 404;
};
