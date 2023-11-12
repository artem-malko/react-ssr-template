import {
  hashKey,
  QueryKey,
  UseSuspenseInfiniteQueryOptions,
  useSuspenseInfiniteQuery,
  InfiniteData,
} from '@tanstack/react-query';

import { ParsedError } from 'framework/infrastructure/request/types';

import { AnyCommonFrameworkQueryOptions } from './types';
import { useHydrateQuery } from './useHydrateQuery';
import { useResetCacheOnUnmount } from './useResetCacheOnUnmount';

export type UseAnyAppSuspenseInfiniteQueryOptions<
  TResult,
  TError extends ParsedError,
  QKey extends QueryKey,
  TPageParam,
> = UseSuspenseInfiniteQueryOptions<
  TResult,
  TError,
  InfiniteData<TResult>,
  TResult,
  QKey,
  TPageParam
> & {
  frameworkQueryOptions?: AnyCommonFrameworkQueryOptions;
};

/**
 * A tiny wrapper around useSuspenseInfiniteQuery
 * Purpose:
 * 1. dehydrate a query state on client side in case of a stream rendering
 */
/** @TODO may be change type of the error?
 * What if an Error will be thrown during response parse? */
export const useAnyAppSuspenseInfiniteQuery = <
  TResult,
  TError extends ParsedError,
  QKey extends QueryKey,
  TPageParam,
>(
  queryOptions: UseAnyAppSuspenseInfiniteQueryOptions<TResult, TError, QKey, TPageParam>,
) => {
  const { frameworkQueryOptions } = queryOptions;
  const queryId = hashKey(queryOptions.queryKey);

  useHydrateQuery(queryId);
  useResetCacheOnUnmount({
    key: queryOptions.queryKey,
    queryId,
    isErrorCodeOkToResetCacheCheck: frameworkQueryOptions?.isErrorCodeOkToResetCache,
  });

  return useSuspenseInfiniteQuery<TResult, TError, InfiniteData<TResult>, QKey, TPageParam>(
    queryOptions,
  );
};
