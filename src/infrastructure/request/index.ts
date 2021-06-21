import axios, { AxiosPromise, AxiosError, AxiosRequestConfig } from 'axios';
import { Requester } from './types';
import { patchUrl } from './utils';

/**
 * A little wrapper for axios
 */
const createRequest = (params: { networkTimeout: number }): Requester => {
  const { networkTimeout } = params;

  return <T>(url: string, requestConfig: Exclude<AxiosRequestConfig, 'url'> = {}): AxiosPromise<T> => {
    const axiosConfig = {
      method: 'get' as const,
      withCredentials: true,
      transformResponse: [(data: unknown) => data],
      timeout: networkTimeout,
      ...requestConfig,
      url: patchUrl(url),
    };

    return axios.request(axiosConfig).catch((error: AxiosError) => {
      throw error;
    });
  };
};

export { createRequest };
