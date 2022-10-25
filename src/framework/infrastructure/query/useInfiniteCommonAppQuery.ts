import {
  hashQueryKey,
  QueryFunction,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import { ParsedError } from 'framework/infrastructure/request/types';

import { AnyCommonFrameworkQueryOptions } from './types';
import { useHydrateQuery } from './useHydrateQuery';
import { useResetCacheOnUnmount } from './useResetCacheOnUnmount';

type Params<TResult, TError> = {
  key: QueryKey;
  queryFunction: QueryFunction<TResult, QueryKey>;
  queryOptions?: Omit<UseInfiniteQueryOptions<TResult, TError>, 'queryKey' | 'queryFn'>;
  frameworkQueryOptions?: AnyCommonFrameworkQueryOptions;
};
/**
 * A tiny wrapper around useInfiniteQuery
 * Purpose:
 * 1. dehydrate a query state on client side in case of a stream rendering
 */
/** @TODO may be change type of the error?
 * What if an Error will be thrown during response parse? */
export const useInfiniteCommonAppQuery = <TResult, TError extends ParsedError>({
  key,
  queryFunction,
  queryOptions,
  frameworkQueryOptions,
}: Params<TResult, TError>) => {
  const queryId = hashQueryKey(key);

  useHydrateQuery(queryId);
  useResetCacheOnUnmount({
    key,
    queryId,
    isErrorCodeOkToResetCacheCheck: frameworkQueryOptions?.isErrorCodeOkToResetCache,
  });

  return useInfiniteQuery<TResult, TError>(key, queryFunction, queryOptions);
};
