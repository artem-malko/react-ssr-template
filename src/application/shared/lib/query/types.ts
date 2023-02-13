import { UseQueryResult } from '@tanstack/react-query';

/**
 * Returns TData of the passed query or queryCreator function
 */
export type UnwrapQueryData<
  UseQueryCreatorOrUseQuery extends (params: any) => UseQueryResult<any, any> | UseQueryResult<any, any>,
> = UseQueryCreatorOrUseQuery extends (params: any) => UseQueryResult<any, any>
  ? ReturnType<UseQueryCreatorOrUseQuery> extends UseQueryResult<infer TData>
    ? TData
    : never
  : UseQueryCreatorOrUseQuery extends UseQueryResult<infer TData>
  ? TData
  : never;
