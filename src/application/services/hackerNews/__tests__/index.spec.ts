import { expect } from 'chai';

import { createRequest } from 'framework/infrastructure/request';
import { requestMock } from 'framework/infrastructure/request/forTests';

import { createHackerNewsService } from '..';
import { mocks } from '../mocks';


describe('Hacker news service', () => {
  const request = createRequest({ networkTimeout: 10000 });
  const hackerNews = createHackerNewsService(request, {
    apiURL: '',
  });

  afterEach(() => {
    requestMock.reset();
  });

  describe('getNews method', () => {
    it('Return parsed response with one news item for success request', async () => {
      requestMock
        .onGet('/news?page=1')
        .reply(
          200,
          '[{ "id": 2, "time": 2, "title": "title", "user": "user", "time_ago": "time", "url": "url" }]',
        );

      await hackerNews.getNews({ page: 1 }).then((response) => {
        expect(requestMock.history.get!.length).to.eq(1);
        expect(response).to.deep.eq(mocks.getNewsListWithOneItem);
      });
    });

    it('Return parsed error for 404 response', async () => {
      requestMock.onGet('/news?page=1').reply(404);

      await hackerNews.getNews({ page: 1 }).catch((error) => {
        expect(error).to.deep.eq(mocks.getNewsNotFoundError);
      });
    });

    it('Return parsed error for network error', async () => {
      requestMock.onGet('/news?page=1').networkError();

      await hackerNews.getNews({ page: 1 }).catch((error) => {
        expect(error).to.deep.eq(mocks.getNewsTimeoutError);
      });
    });

    it('Return parsed error for response parse error', async () => {
      requestMock.onGet('/news?page=1').reply(200, 'incorrectJson');

      await hackerNews.getNews({ page: 1 }).catch((error) => {
        expect(error).to.deep.eq(mocks.getNewsResponseParseError);
      });
    });
  });
});
