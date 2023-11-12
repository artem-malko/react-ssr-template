import { UseSuspenseQueryResult } from '@tanstack/react-query';

/**
 * Returns TData of the passed query or queryCreator function
 */
export type UnwrapQueryData<
  UseQueryCreatorOrUseQuery extends
    | ((params: any) => UseSuspenseQueryResult<any, any>)
    | UseSuspenseQueryResult<any, any>,
> = UseQueryCreatorOrUseQuery extends (params: any) => UseSuspenseQueryResult<infer TData, any>
  ? TData
  : UseQueryCreatorOrUseQuery extends UseSuspenseQueryResult<infer TData>
  ? TData
  : never;

/**
 * Returns TResult of any fetcher for any query
 */
export type FetcherResult<T extends (args: any) => (args: any) => Promise<any>> = Awaited<
  ReturnType<ReturnType<T>>
>;
