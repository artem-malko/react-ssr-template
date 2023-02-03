import { hashQueryKey, QueryFunction, QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { ParsedError } from 'framework/infrastructure/request/types';

import { AnyCommonFrameworkQueryOptions } from './types';
import { useHydrateQuery } from './useHydrateQuery';
import { useResetCacheOnUnmount } from './useResetCacheOnUnmount';

type Params<TResult, TError, QKey extends QueryKey> = {
  key: QKey;
  queryFunction: QueryFunction<TResult, QKey>;
  queryOptions?: Omit<UseQueryOptions<TResult, TError, QKey>, 'queryKey' | 'queryFn'>;
  frameworkQueryOptions?: AnyCommonFrameworkQueryOptions;
};
/**
 * A tiny wrapper around useInfiniteQuery
 * Purpose:
 * 1. dehydrate a query state on client side in case of a stream rendering
 */
/** @TODO may be change type of the error?
 * What if an Error will be thrown during response parse? */
export const useCommonAppQuery = <TResult, TError extends ParsedError, QKey extends QueryKey>({
  key,
  queryFunction,
  queryOptions,
  frameworkQueryOptions,
}: Params<TResult, TError, QKey>) => {
  const queryId = hashQueryKey(key);

  useHydrateQuery(queryId);
  useResetCacheOnUnmount({
    key,
    queryId,
    isErrorCodeOkToResetCacheCheck: frameworkQueryOptions?.isErrorCodeOkToResetCache,
  });

  return useQuery<TResult, TError, TResult, QKey>({
    ...(queryOptions as any),
    queryKey: key,
    queryFn: queryFunction,
  });
};
