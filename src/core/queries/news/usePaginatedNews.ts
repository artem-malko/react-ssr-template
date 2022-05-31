import { useAppQuery } from 'infrastructure/query/useAppQuery';

type UsePaginatedNewsParams = {
  page: number;
};
export const createUsePaginatedNewsKey = (params: UsePaginatedNewsParams) => {
  return ['paginated_news', ...Object.values(params)];
};
export const usePaginatedNews = (params: UsePaginatedNewsParams) => {
  return useAppQuery(createUsePaginatedNewsKey(params), async ({ services }) => {
    // Simple fake latency for the requests from server side
    await new Promise((resolve) => setTimeout(resolve, params.page % 2 ? 4000 : 0));

    return services.hackerNews.getNews({ page: params.page });
  });
};
