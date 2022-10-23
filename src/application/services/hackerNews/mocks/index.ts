import { ParsedError } from 'framework/infrastructure/request/types';

import { FetchNewsResponse } from '../types';


const getNewsListWithOneItem: FetchNewsResponse = [
  { id: 2, time: 2, title: 'title', user: 'user', time_ago: 'time', url: 'url' },
];
const getNewsTimeoutError: ParsedError = {
  code: 503,
  message: 'Service is not available',
};
const getNewsResponseParseError: ParsedError = {
  code: 500,
  message: 'Response parse error: Unexpected token i in JSON at position 0',
};
const getNewsNotFoundError: ParsedError = {
  code: 404,
  message: 'Request failed with status code 404',
};

export const mocks = {
  getNewsListWithOneItem,
  createGetNewsItemResponse: (newsId: number) => ({
    id: newsId,
    time: 2,
    title: 'title',
    user: 'user',
    time_ago: 'time',
    url: 'url',
  }),
  getNewsTimeoutError,
  getNewsNotFoundError,
  getNewsResponseParseError,
};
