import { Services } from 'core/services';
import { useServices } from 'core/services/shared/context';
import {
  hashQueryKey,
  hydrate,
  QueryFunctionContext,
  QueryFunctionData,
  QueryKey,
  useQueryClient,
} from 'react-query';
import { getDehydratedQueryStateFromDom } from './getDehydratedQueryStateFromDom';

/**
 * Purposes:
 * 1. Add an appliaction services to a queryFunction args
 * 2. dehydrate a query state on client side in case of a stream rendering
 */
export const useQueryEnhancer = <TResult>(
  queryKey: QueryKey,
  queryFunction: (params: {
    services: Services;
    context: QueryFunctionContext<QueryKey>;
  }) => QueryFunctionData<TResult> | Promise<QueryFunctionData<TResult>>,
) => {
  const queryClient = useQueryClient();
  const services = useServices();
  /**
   * queryId is used as an id for a div with data for a dehydration process
   * The data will be there after react-component, which uses current query,
   * was rendered and was streamed to a client
   *
   * For more info checkout ReactStreamRenderEnhancer
   */
  const queryId = hashQueryKey(queryKey);
  const dehydratedQueryState = getDehydratedQueryStateFromDom(queryId);

  if (dehydratedQueryState) {
    hydrate(queryClient, dehydratedQueryState);
  }

  const queryFunctionWithServices = (context: QueryFunctionContext<QueryKey>) =>
    queryFunction({ services, context });

  return { queryFunctionWithServices };
};
