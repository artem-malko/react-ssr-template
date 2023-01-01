import { isServer } from 'lib/browser';

import { RequestParams } from '../types';
import { isBlob, isPlainObject, isURLSearchParameters } from './is';

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param {any} body Any options.body input
 * @returns {string | null}
 */
export const getRequestContentType = <T>(body?: RequestParams<T>['body']): string | null => {
  // Body is null or undefined
  if (!body || body === null) {
    return null;
  }

  // Body is string
  if (typeof body === 'string') {
    return 'text/plain;charset=UTF-8';
  }

  // Body is a URLSearchParams
  if (isURLSearchParameters(body)) {
    return 'application/x-www-form-urlencoded;charset=UTF-8';
  }

  // Body is blob
  if (isBlob(body)) {
    return body.type || null;
  }

  // Body is a Buffer (Buffer, ArrayBuffer or ArrayBufferView)
  if ((isServer && Buffer.isBuffer(body)) || ArrayBuffer.isView(body)) {
    return null;
  }

  // Browser or NodeJS is more clever than us to set correct headers here
  if (body instanceof FormData) {
    return null;
  }

  // Body is stream - can't really do much about this
  if (body instanceof ReadableStream) {
    return null;
  }

  if (isPlainObject(body)) {
    return 'application/json;charset=UTF-8';
  }

  // Body constructor defaults other things to string
  return 'text/plain;charset=UTF-8';
};
