import { RequestError } from '../error';
import { ParsedError } from '../types';
import { isRequestError } from './is';

export function processAnyAPIError(
  error: RequestError | Error,
  middleware?: (originalError: RequestError | Error, parsedError: ParsedError) => void,
): never {
  const parsedError = parseAnyAPIError(error);

  if (middleware) {
    middleware(error, parsedError);
  }

  throw parsedError;
}

function parseAnyAPIError(error: RequestError | Error): ParsedError {
  // Process any error, except Network errors
  if (!isRequestError(error)) {
    return {
      code: 500,
      data: {
        message: error.message,
      },
    };
  }

  // Just to handle a error, without responseBody
  // Or body was not decoded
  if (!error.parsedBody || !error.response.bodyUsed) {
    return {
      code: error.response.status,
      data: {
        message: error.response.statusText,
      },
    };
  }

  const contentType = error.response.headers.get('Content-Type');

  if (contentType && contentType.includes('application/json')) {
    // Server responded with a JSON in a body
    let parsedErrorData: Record<string, any> = {};

    try {
      parsedErrorData = JSON.parse(error.parsedBody);
    } catch (parseError) {
      return {
        code: 500,
        data: {
          message:
            'Response parse error. error.responseBody has incorrect JSON string: ' + error.parsedBody,
        },
      };
    }

    /**
     * Try to parse a predefined error format
     * {
     *   error: {
     *     code?: number;
     *     message?: string;
     *   }
     * }
     */
    if (!parsedErrorData.error) {
      return {
        code: error.response.status,
        data: {
          message: error.response.statusText,
          body: parsedErrorData,
        },
      };
    }

    return {
      code: parsedErrorData.error.code || error.response.status,
      data: {
        message: parsedErrorData.error.message || error.response.statusText,
        body: parsedErrorData.error,
      },
    };
  }

  return {
    code: error.response.status,
    data: {
      message: error.response.statusText,
      body: error.parsedBody,
    },
  };
}
