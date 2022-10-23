import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { ParsedError, Requester } from './types';
import { patchUrl, processAnyAPIError } from './utils';

/**
 * A little wrapper for axios
 */
const createRequest = (params: { networkTimeout: number }): Requester => {
  const { networkTimeout } = params;

  return <T>(
    url: string,
    requestConfig: Exclude<AxiosRequestConfig, 'url'> & {
      errorProcessingMiddleware?: (originalError: AxiosError | Error, parsedError: ParsedError) => void;
    } = {},
  ): Promise<T> => {
    const axiosConfig = {
      method: 'get' as const,
      withCredentials: true,
      timeout: networkTimeout,
      ...requestConfig,
      url: patchUrl(url),
    };

    return (
      // @TODO try to move to builtin fetch in NodeJS 18
      axios
        .request<T>(axiosConfig)
        // We need only response data, without any axios features
        .then((response) => response.data)
        .catch((error: AxiosError) => processAnyAPIError(error, requestConfig.errorProcessingMiddleware))
    );
  };
};

export { createRequest };
