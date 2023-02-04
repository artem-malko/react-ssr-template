import { isBlob, isPlainObject, isURLSearchParameters } from './is';
import { RequestParams } from '../types';

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * @param {any} body Any options.body input
 * @returns {string | null}
 */
export const getRequestContentType = <T>(body?: RequestParams<T>['body']): string | null => {
  // Body is a string
  if (typeof body === 'string') {
    return 'text/plain;charset=UTF-8';
  }

  // Body is a URLSearchParams
  if (isURLSearchParameters(body)) {
    return 'application/x-www-form-urlencoded;charset=UTF-8';
  }

  // Body is a blob
  if (isBlob(body)) {
    return body.type || null;
  }

  // Body is a plain object
  if (isPlainObject(body)) {
    return 'application/json;charset=UTF-8';
  }

  // For all other cases let a browser to make a choice
  return null;
};
