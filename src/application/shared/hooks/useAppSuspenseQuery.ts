import { QueryKey } from '@tanstack/react-query';

import type { ParsedError } from 'framework/public/types';
import { UseAnyAppSuspenseQueryOptions, useAnyAppSuspenseQuery } from 'framework/public/universal';

/**
 * Just a wrapper around useAnyAppSuspenseQuery, which binds TError type
 */
export const useAppSuspenseQuery = <TResult, TError extends ParsedError, QKey extends QueryKey>(
  queryOptions: UseAnyAppSuspenseQueryOptions<TResult, TError, QKey>,
) => useAnyAppSuspenseQuery(queryOptions);
