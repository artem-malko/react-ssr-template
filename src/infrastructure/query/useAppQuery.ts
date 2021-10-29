import { Services } from 'core/services';
import { useServices } from 'core/services/shared/context';
import { AnyServiceParsedError } from 'infrastructure/request/types';
import {
  hashQueryKey,
  hydrate,
  QueryFunctionContext,
  QueryKey,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from 'react-query';
import { getDehydratedQueryStateFromDom } from './getDehydratedQueryStateFromDom';

/**
 * A tiny wrapper around useQuery
 * Purposes:
 * 1. Add an appliaction services to a queryFunction args
 * 2. dehydrate a query state on client side in case of a stream rendering
 */
export const useAppQuery = <TResult, TError extends AnyServiceParsedError>(
  key: QueryKey,
  queryFunction: (params: {
    services: Services;
    context: QueryFunctionContext<QueryKey>;
  }) => TResult | Promise<TResult>,
  options?: Omit<UseQueryOptions<TResult, TError>, 'queryKey' | 'queryFn'>,
) => {
  const queryClient = useQueryClient();
  const services = useServices();
  /**
   * queryId is used as an id for a div with data for a dehydration process
   * The data will be there after react-component, which uses current query,
   * was rendered and was streamed to a client
   *
   * For more info checkout queryDehydrator.ts
   */
  const queryId = hashQueryKey(key);
  const dehydratedQueryState = getDehydratedQueryStateFromDom(queryId);

  if (dehydratedQueryState) {
    hydrate(queryClient, dehydratedQueryState);
  }

  const patchedQueryFunction = (context: QueryFunctionContext<QueryKey>) =>
    queryFunction({ services, context });

  return useQuery<TResult, TError>(key, patchedQueryFunction, options);
};
