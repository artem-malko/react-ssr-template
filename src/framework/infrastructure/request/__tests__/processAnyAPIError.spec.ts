import { expect } from 'chai';
import { spy } from 'sinon';

import { RequestError } from '../error';
import { processAnyAPIError } from '../utils/processAnyAPIError';
import { createResponse } from '../utils/response';

describe('processAnyAPIError', () => {
  describe('NOT Network error processing', () => {
    it('Returns default 500 error, if there is no Network Error', () => {
      const error = new Error('test');

      try {
        processAnyAPIError(error);
      } catch (e) {
        expect(e).to.deep.eq({
          code: 500,
          data: {
            message: 'test',
          },
        });
      }
    });

    it(`
        Returns default 500 error, if there is no Network Error
        Calls passed middleware, without original error mutations`, () => {
      const error = new Error('test');
      const clonedError = new Error('test');
      const middleware = spy();

      try {
        processAnyAPIError(error, middleware);
      } catch (e) {
        const parsedError = {
          code: 500,
          data: {
            message: 'test',
          },
        };

        expect(e, 'The error has to be parssed correctly').to.deep.eq(parsedError);
        expect(
          middleware.calledOnceWithExactly(error, parsedError),
          'The middleware has to be called once with exact params',
        ).to.be.true;
        expect(error, 'The original error was not mutated by the middleware').to.deep.eq(clonedError);
      }
    });
  });

  describe('Network error processing', () => {
    it('Returns a 599 error cause of timeout', () => {
      try {
        processAnyAPIError(
          new RequestError({
            response: createResponse({
              status: 599,
              statusText: 'Network connect timeout error',
            }),
          }),
        );
      } catch (e) {
        expect(e).to.deep.eq({
          code: 599,
          data: {
            message: 'Network connect timeout error',
          },
        });
      }
    });

    it('Returns a parsed error for a error without body', () => {
      try {
        processAnyAPIError(
          new RequestError({
            response: createResponse({
              status: 500,
              statusText: 'Custom status',
            }),
          }),
        );
      } catch (e) {
        expect(e).to.deep.eq({
          code: 500,
          data: {
            message: 'Custom status',
          },
        });
      }
    });

    it('Returns a parsed error for an error with Content-Type different from application/json', () => {
      try {
        processAnyAPIError(
          new RequestError({
            response: createResponse({
              status: 500,
              statusText: 'Custom status',
              headers: {
                'Content-Type': 'text/html',
              },
            }),
            parsedBody: 'Parsed body',
          }),
        );
      } catch (e) {
        expect(e).to.deep.eq({
          code: 500,
          data: {
            body: 'Parsed body',
            message: 'Custom status',
          },
        });
      }
    });
    it('Returns a JSON-response parse error, incorrect JSON in a response ', () => {
      const requestError = new RequestError({
        response: createResponse({
          status: 404,
          statusText: 'Custom status',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
        parsedBody: "{name:'Name'}",
      });

      try {
        processAnyAPIError(requestError);
      } catch (e: any) {
        expect(e).to.deep.eq({
          code: 500,
          data: {
            message: `Response parse error. error.responseBody has incorrect JSON string: {name:'Name'}`,
          },
        });
        expect(e.code, 'parsed error has its own status').to.not.eq(requestError.response.status);
      }
    });
    it('Returns parsed error in JSON body for correct JSON, but default status and statusText', () => {
      const requestError = new RequestError({
        response: createResponse({
          status: 404,
          statusText: 'Custom statusText',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
        parsedBody: '{"name":"Ann"}',
      });

      try {
        processAnyAPIError(requestError);
      } catch (e: any) {
        expect(e).to.deep.eq({
          code: 404,
          data: {
            message: 'Custom statusText',
            body: {
              name: 'Ann',
            },
          },
        });
      }
    });
    it('Returns a parsed API error with the predefined format (has all properties)', () => {
      const requestError = new RequestError({
        response: createResponse({
          status: 404,
          statusText: 'Custom statusText',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
        parsedBody: '{"error":{"code":501,"message":"Message from body"}}',
      });

      try {
        processAnyAPIError(requestError);
      } catch (e: any) {
        expect(e).to.deep.eq({
          code: 501,
          data: {
            message: 'Message from body',
            body: {
              code: 501,
              message: 'Message from body',
            },
          },
        });
        expect(e.code, 'parsed error has its own status').to.not.eq(requestError.response.status);
        expect(e.statusText, 'parsed error has its own statusText').to.not.eq(
          requestError.response.statusText,
        );
      }
    });
  });
});
