import { AppLogger } from 'framework/infrastructure/logger';
import { Requester } from 'framework/infrastructure/request/types';

import { FetchNewsResponse, FetchNewsItemResponse } from './types';

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
        withCredentials: false,
      });
    },

    getNewsItem(params: { id: number }) {
      return request<FetchNewsItemResponse>(`${config.apiURL}/item/${params.id}`, {
        withCredentials: false,
      });
    },
  };
};
export type HackerNewsService = ReturnType<typeof createHackerNewsService>;
