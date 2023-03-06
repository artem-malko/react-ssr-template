import { QueryClient } from '@tanstack/react-query';
import { Response } from 'express';

type OnFinishHadlerCreatorParams = {
  res: Response;
  renderTimeoutId: NodeJS.Timeout | undefined;
  queryClient: QueryClient;
};
export const createOnFinishHadler = ({
  res,
  renderTimeoutId,
  queryClient,
}: OnFinishHadlerCreatorParams) => {
  return () => {
    if (renderTimeoutId) {
      clearTimeout(renderTimeoutId);
    }

    /**
     * In case you are creating the QueryClient for every request,
     * React Query creates the isolated cache for this client,
     * which is preserved in memory for the cacheTime period.
     * That may lead to high memory consumption on server
     * in case of high number of requests during that period.
     *
     * On the server, cacheTime defaults to Infinity
     *  which disables manual garbage collection and will automatically clear
     * memory once a request has finished.
     * If you are explicitly setting a non-Infinity cacheTime
     * then you will be responsible for clearing the cache early.
     * https://tanstack.com/query/v4/docs/guides/ssr#high-memory-consumption-on-server
     */
    queryClient.clear();

    /**
     * Actually, it is not necessary to call res.end manually,
     * cause React does this by itself
     *
     * But, if we have any wrapper on res, we can not be sure,
     * that wrapper implements all needed methods (especially _final)
     * So, the `end` method will be called manually, if writable has not been ended yet.
     */
    if (!res.writableEnded) {
      res.end();
    }
  };
};
