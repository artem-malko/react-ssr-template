import { createApi } from 'application/shared/lib/api/createApi';

import { NewsItem } from '../types';

type ApiParams = { page: number };

type ApiResponse = NewsItem[];

export const getNewsListApi = createApi<ApiParams, ApiResponse>(({ page }, { config, request }) => {
  const url = `${config.hackerNewsApiUrl}/news?page=${page}`;

  return request(url, {
    method: 'get',
  });
});
