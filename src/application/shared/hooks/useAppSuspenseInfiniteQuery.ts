import { QueryKey } from '@tanstack/react-query';

import type { ParsedError } from 'framework/public/types';
import {
  useAnyAppSuspenseInfiniteQuery,
  UseAnyAppSuspenseInfiniteQueryOptions,
} from 'framework/public/universal';

/**
 * Just a wrapper around useAnyAppSuspenseInfiniteQuery,
 * which binds TError type
 */
export const useAppSuspenseInfiniteQuery = <
  TResult,
  TError extends ParsedError,
  QKey extends QueryKey,
  TPageParam,
>(
  queryOptions: UseAnyAppSuspenseInfiniteQueryOptions<TResult, TError, QKey, TPageParam>,
) => useAnyAppSuspenseInfiniteQuery(queryOptions);
