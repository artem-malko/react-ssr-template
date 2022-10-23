import { Requester } from 'framework/infrastructure/request/types';
import { FetchNewsResponse, FetchNewsItemResponse } from './types';

type Config = {
  apiURL: string;
};
export const createHackerNewsService = (request: Requester, config: Config) => {
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
