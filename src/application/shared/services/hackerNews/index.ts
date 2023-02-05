import type { FetchNewsResponse, FetchNewsItemResponse } from './types';
import type { AppLogger, Requester } from 'framework/public/types';

type Config = {
  apiURL: string;
};
type CreateHackerNewsServiceParams = {
  request: Requester;
  config: Config;
  appLogger: AppLogger;
};
export const createHackerNewsService = ({ request, config }: CreateHackerNewsServiceParams) => {
  return {
    getNews(params: { page: number }) {
      return request<FetchNewsResponse>(`${config.apiURL}/news?page=${params.page}`, {
        method: 'get',
      });
    },

    getNewsItem(params: { id: number }) {
      return request<FetchNewsItemResponse>(`${config.apiURL}/item/${params.id}`, {
        method: 'get',
      });
    },
  };
};
export type HackerNewsService = ReturnType<typeof createHackerNewsService>;
