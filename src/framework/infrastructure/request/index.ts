import { RequestError } from './error';
import { Requester, RequestParams } from './types';
import {
  createCombinedAbortController,
  getStatusFromAbortReason,
  getStatusTextFromAbortReason,
} from './utils/abortController';
import { patchUrlProtocol } from './utils/patchUrlProtocol';
import { prepareFetchParams } from './utils/prepareFetchParams';
import { processAnyAPIError } from './utils/processAnyAPIError';
import { createResponse } from './utils/response';

/**
 * A little wrapper for native fetch
 */
const createRequest = (params: { networkTimeout: number }): Requester => {
  const { networkTimeout } = params;

  return async <SuccessResponseBody>(
    url: string,
    requestParams: RequestParams<SuccessResponseBody>,
  ): Promise<SuccessResponseBody> => {
    const { signal, cancelTimeoutAbort } = createCombinedAbortController(
      // If networkTimeout is 0 or undefined — lets wait for a response forever
      Math.abs(requestParams?.networkTimeout || networkTimeout || Number.MAX_SAFE_INTEGER),
      requestParams?.signal,
    );

    const fetchParams = prepareFetchParams(url, requestParams);

    try {
      const response = await fetch(patchUrlProtocol(url), {
        ...fetchParams.requestParams,
        signal,
      });

      cancelTimeoutAbort();

      // Process a response with an error
      if (!response.ok) {
        const parsedBody = await response.text();

        throw new RequestError({ response, parsedBody });
      }

      if (requestParams.parser) {
        const result = await requestParams.parser(response);

        return result;
      }

      // Default response parser is .json
      const parsedResponse = await response.json();

      return parsedResponse;
    } catch (error: any) {
      if (signal.aborted) {
        return processAnyAPIError(
          new RequestError({
            response: createResponse({
              status: getStatusFromAbortReason(signal.reason, 599),
              statusText: getStatusTextFromAbortReason(signal.reason, 'Aborted request'),
              headers: {
                'Content-Type': 'text/html; charset=utf-8;',
              },
            }),
            originalError: error,
          }),
          requestParams?.errorProcessingMiddleware,
        );
      }

      /**
       * All reasons of TypeError in fetch
       * https://developer.mozilla.org/en-US/docs/Web/API/fetch#typeerror
       */
      if (error instanceof TypeError) {
        return processAnyAPIError(
          new RequestError({
            response: createResponse({
              status: 500,
              statusText: error.message,
              headers: {
                'Content-Type': 'text/html; charset=utf-8;',
              },
            }),
            originalError: error,
          }),
          requestParams?.errorProcessingMiddleware,
        );
      }

      return processAnyAPIError(error, requestParams?.errorProcessingMiddleware);
    } finally {
      /**
       * Yeah, we have that cancelation before
       * This cancelation is here just for sure
       */
      cancelTimeoutAbort();
    }
  };
};

export { createRequest };
