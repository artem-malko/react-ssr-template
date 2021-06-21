import { AxiosPromise, AxiosRequestConfig } from 'axios';

export type Requester = <T>(url: string, config?: AxiosRequestConfig) => AxiosPromise<T>;
