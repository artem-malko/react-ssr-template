/**
 * Is.js
 *
 * Object type checks.
 */

import { URLSearchParams } from 'url';

import { RequestError } from '../error';

const NAME = Symbol.toStringTag;

/**
 * Check if `obj` is a URLSearchParams object
 * ref: https://github.com/node-fetch/node-fetch/issues/296#issuecomment-307598143
 * @param {*} object - Object to check for
 * @return {boolean}
 */
export const isURLSearchParameters = (object: any): object is URLSearchParams => {
  return (
    typeof object === 'object' &&
    typeof object.append === 'function' &&
    typeof object.delete === 'function' &&
    typeof object.get === 'function' &&
    typeof object.getAll === 'function' &&
    typeof object.has === 'function' &&
    typeof object.set === 'function' &&
    typeof object.sort === 'function' &&
    object[NAME] === 'URLSearchParams'
  );
};

/**
 * Check if `object` is a W3C `Blob` object (which `File` inherits from)
 * @param {*} object - Object to check for
 * @return {boolean}
 */
export const isBlob = (object: any): object is Blob => {
  return (
    object &&
    typeof object === 'object' &&
    typeof object.arrayBuffer === 'function' &&
    typeof object.type === 'string' &&
    typeof object.stream === 'function' &&
    typeof object.constructor === 'function' &&
    /^(Blob|File)$/.test(object[NAME])
  );
};

export const isPlainObject = (obj: any): obj is object => {
  if (typeof obj !== 'object') {
    return false;
  }

  const prototype = Object.getPrototypeOf(obj);

  return (
    (prototype === null ||
      prototype === Object.prototype ||
      Object.getPrototypeOf(prototype) === null) &&
    !(Symbol.toStringTag in obj) &&
    !(Symbol.iterator in obj)
  );
};

export function isRequestError(error: Error): error is RequestError {
  if (error instanceof RequestError) {
    return true;
  }

  return false;
}
