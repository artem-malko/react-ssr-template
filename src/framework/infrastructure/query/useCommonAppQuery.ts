import {
  hashQueryKey,
  InvalidateOptions,
  InvalidateQueryFilters,
  QueryFunction,
  QueryKey,
  RefetchOptions,
  RefetchQueryFilters,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useEffect } from 'react';

import { ParsedError } from 'framework/infrastructure/request/types';

import { useHydrateQuery } from './useHydrateQuery';

/**
 * A tiny wrapper around useInfiniteQuery
 * Purpose:
 * 1. dehydrate a query state on client side in case of a stream rendering
 */
/** @TODO may be change type of the error?
 * What if an Error will be thrown during response parse? */
export const useCommonAppQuery = <TResult, TError extends ParsedError>(
  key: QueryKey,
  queryFunction: QueryFunction<TResult, QueryKey>,
  options?: Omit<UseQueryOptions<TResult, TError>, 'queryKey' | 'queryFn'>,
) => {
  const queryClient = useQueryClient();
  const queryId = hashQueryKey(key);

  useHydrateQuery(queryId);

  /**
   * Reset cache for a query, if it is in a error state
   */
  useEffect(() => {
    return () => {
      const queryState = queryClient.getQueryState<TResult, TError>(key, { exact: true });
      const errorCode = queryState?.error && queryState?.error.code;
      /**
       * It's quite useless to retry a request with 404 response
       */
      const isErrorCodeOkToResetCache = errorCode ? errorCode >= 500 : true;

      if (queryState?.status === 'error' && isErrorCodeOkToResetCache) {
        queryClient.getQueryCache().find(key, { exact: true })?.reset();
      }
    };
    // We use queryId as compiled key here,
    // cause key is a new array every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, queryId]);

  return {
    queryResult: useQuery<TResult, TError>(key, queryFunction, options),
    refetchQuery: (params?: {
      refetchQueryFilters?: RefetchQueryFilters<TResult>;
      refetchQueryOptions?: RefetchOptions;
    }) =>
      queryClient.refetchQueries(
        key,
        params?.refetchQueryFilters || { exact: true },
        params?.refetchQueryOptions,
      ),
    invalidateQuery: (params?: {
      invalidateQueryFilters?: InvalidateQueryFilters<TResult>;
      invalidateOptions?: InvalidateOptions;
    }) =>
      queryClient.invalidateQueries(
        key,
        params?.invalidateQueryFilters || { exact: true },
        params?.invalidateOptions,
      ),
  };
};
