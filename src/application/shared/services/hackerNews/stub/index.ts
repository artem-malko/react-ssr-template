import { createMethodStubber } from 'framework/public/tests';

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
