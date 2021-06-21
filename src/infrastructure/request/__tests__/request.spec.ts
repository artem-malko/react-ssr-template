import { expect } from 'chai';
import { patchUrl } from '../utils';
import { requestMock } from '../forTests';
import { createRequest } from '../';

describe('Request', () => {
  describe('patchUrl', () => {
    it('add http for protocol-less url', () => {
      const url = '//domain.com';
      const result = 'http://domain.com';

      expect(patchUrl(url)).to.be.eq(result);
    });

    it('nothing to change in url with protocol', () => {
      const url = 'https://domain.com';
      const result = 'https://domain.com';

      expect(patchUrl(url)).to.be.eq(result);
    });
  });

  describe('request wrapper', () => {
    const request = createRequest({ networkTimeout: 10000 });

    afterEach(() => {
      requestMock.reset();
    });

    it('Response with 200 status for success request', async () => {
      requestMock.onGet('test200').reply(200);

      await request('test200').then((response) => {
        expect(response.status).to.be.eq(200);
      });
    });

    it('Response with 200 status for success request with params', async () => {
      requestMock.onGet('test200WithParams', { params: { param: 1 } }).reply(200);

      await request('test200WithParams', { params: { param: 1 } }).then((response) => {
        expect(response.status).to.be.eq(200);
        expect(response.config.params).to.be.deep.eq({ param: 1 });
      });
    });

    it('Response with 500 status for error request', async () => {
      requestMock.onGet('test500').reply(500);

      await request('test500').catch((error) => {
        expect(error.response.status).to.be.eq(500);
      });
    });

    it('Error response is undefined for networkError', async () => {
      requestMock.onGet('testNetworkError').networkError();

      await request('testNetworkError').catch((error) => {
        expect(error.response).to.be.undefined;
      });
    });

    it('Error response is undefined for networkError', async () => {
      requestMock.onGet('testNetworkError').networkErrorOnce();

      await request('testNetworkError').catch((error) => {
        expect(error.response).to.be.undefined;
      });
    });

    it('Error code is ECONNABORTED for timeout Error', async () => {
      requestMock.onGet('testTimeoutError').timeoutOnce();

      await request('testTimeoutError').catch((error) => {
        expect(error.code).to.be.eq('ECONNABORTED');
      });
    });
  });
});
