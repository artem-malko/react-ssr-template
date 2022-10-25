import { UseQueryResult } from '@tanstack/react-query';

import { ParsedError } from 'framework/infrastructure/request/types';

export type QueryDataResult<
  T extends (params: any) => { queryResult: UseQueryResult<any, ParsedError> },
> = NonNullable<ReturnType<T>['queryResult']['data']>;

/**
 * This are some additional options,
 * which are useful for the react-query wrapper of the framework
 */
export type AnyCommonFrameworkQueryOptions = {
  /**
   * Checkout `useResetCacheOnUnmount.ts` for more details
   * Be carefull! You have to set with function in options only one time
   * during a query lifetime
   */
  isErrorCodeOkToResetCache?: (errorCode: ParsedError['code']) => boolean;
};
