import { createApi } from 'application/shared/lib/api/createApi';

import { NewsItem } from '../types';

type ApiParams = { id: number };

type ApiResponse = NewsItem;

export const getNewsItemByIdApi = createApi<ApiParams, ApiResponse>(({ id }, { config, request }) => {
  const url = `${config.hackerNewsApiUrl}/item/${id}`;

  return request(url, {
    method: 'get',
  });
});
