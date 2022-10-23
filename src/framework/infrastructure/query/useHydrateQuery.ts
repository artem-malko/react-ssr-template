import { hydrate, useQueryClient } from '@tanstack/react-query';
import { getDehydratedQueryStateFromDom } from './getDehydratedQueryStateFromDom';

/**
 * Purposes:
 * 1. dehydrate a query state on client side in case of a stream rendering
 */
export const useHydrateQuery = (queryId: string) => {
  const queryClient = useQueryClient();
  /**
   * queryId is used as an id for a div with data for a dehydration process
   * The data will be there after react-component, which uses current query,
   * was rendered and was streamed to a client
   *
   * For more info checkout ReactStreamRenderEnhancer
   */
  const dehydratedQueryState = getDehydratedQueryStateFromDom(queryId);

  if (dehydratedQueryState) {
    hydrate(queryClient, dehydratedQueryState);
  }
};
