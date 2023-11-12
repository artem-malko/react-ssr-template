import { hashKey, QueryKey, useSuspenseQuery, UseSuspenseQueryOptions } from '@tanstack/react-query';

import { ParsedError } from 'framework/infrastructure/request/types';

import { AnyCommonFrameworkQueryOptions } from './types';
import { useHydrateQuery } from './useHydrateQuery';
import { useResetCacheOnUnmount } from './useResetCacheOnUnmount';

export type UseAnyAppSuspenseQueryOptions<
  TResult,
  TError extends ParsedError,
  QKey extends QueryKey,
> = UseSuspenseQueryOptions<TResult, TError, TResult, QKey> & {
  frameworkQueryOptions?: AnyCommonFrameworkQueryOptions;
};
/**
 * A tiny wrapper around useSuspenseQuery
 * Purpose:
 * 1. dehydrate a query state on client side in case of a stream rendering
 */
/** @TODO may be change type of the error?
 * What if an Error will be thrown during response parse? */
export const useAnyAppSuspenseQuery = <TResult, TError extends ParsedError, QKey extends QueryKey>(
  queryOptions: UseAnyAppSuspenseQueryOptions<TResult, TError, QKey>,
) => {
  const { queryKey, frameworkQueryOptions } = queryOptions;
  const queryId = hashKey(queryKey);

  useHydrateQuery(queryId);
  useResetCacheOnUnmount({
    key: queryKey,
    queryId,
    isErrorCodeOkToResetCacheCheck: frameworkQueryOptions?.isErrorCodeOkToResetCache,
  });

  return useSuspenseQuery<TResult, TError, TResult, QKey>(queryOptions);
};
