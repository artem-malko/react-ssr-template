import { useAppQuery } from 'application/main/query';

import { newsQueryKeys } from '../common';

export type UsePaginatedNewsParams = {
  page: number;
};

export const usePaginatedNews = (params: UsePaginatedNewsParams) => {
  return useAppQuery(newsQueryKeys.paginatedListByParams(params), async ({ services }) => {
    // Simple fake latency for the requests from server side
    await new Promise((resolve) => setTimeout(resolve, params.page % 2 ? 4000 : 0));

    return services.hackerNews.getNews({ page: params.page });
  });
};
