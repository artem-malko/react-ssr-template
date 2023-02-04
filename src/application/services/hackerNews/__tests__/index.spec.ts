import { expect } from 'chai';
import { mock, SinonMock } from 'sinon';

import { appLoggerStub, createJsonResponse, createOkJsonResponse } from 'framework/public/tests';
import { createRequest } from 'framework/public/universal';

import { createHackerNewsService } from '..';
import { mocks } from '../mocks';

describe('Hacker news service', () => {
  const request = createRequest({ networkTimeout: 10000 });
  const hackerNews = createHackerNewsService({
    request,
    config: {
      apiURL: '',
    },
    appLogger: appLoggerStub,
  });
  let stubedFetch: SinonMock;

  beforeEach(() => {
    stubedFetch = mock(global);
  });

  afterEach(() => {
    stubedFetch.restore();
  });

  describe('getNews method', () => {
    it('Return parsed response with one news item for success request', async () => {
      stubedFetch
        .expects('fetch')
        .withArgs('/news?page=1')
        .returns(
          createOkJsonResponse(
            '[{ "id": 2, "time": 2, "title": "title", "user": "user", "time_ago": "time", "url": "url" }]',
          ),
        );

      await hackerNews.getNews({ page: 1 }).then((response) => {
        expect(response).to.deep.eq(mocks.getNewsListWithOneItem);
      });
    });

    it('Return parsed error for 404 response', async () => {
      stubedFetch
        .expects('fetch')
        .withArgs('/news?page=1')
        .returns(
          createJsonResponse({
            body: '',
            status: 404,
            statusText: 'Request failed with status code 404',
          }),
        );

      await hackerNews.getNews({ page: 1 }).catch((error) => {
        expect(error).to.deep.eq(mocks.getNewsNotFoundError);
      });
    });
  });
});
