import { createMethodStubber } from 'tests/stub';

import { HackerNewsService } from '..';
import { mocks } from '../mocks';

export const createStubedHackerNewsService = () => {
  const stubMethod = createMethodStubber('hackerNews');

  return {
    getNews: stubMethod<HackerNewsService['getNews']>('getNews'),
    getNewsItem: stubMethod<HackerNewsService['getNewsItem']>('getNewsItem'),
    mocks,
  };
};
