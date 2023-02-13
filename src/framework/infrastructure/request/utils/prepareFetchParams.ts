import { keysOf } from 'lib/lodash';

import { getRequestContentType } from './getRequestContentType';
import { isPlainObject, isURLSearchParameters } from './is';
import { patchUrlProtocol } from './patchUrlProtocol';
import { RequestParams } from '../types';

type Result = {
  url: string;
  requestParams?: RequestInit;
};
export function prepareFetchParams<T>(url: string, requestParams: RequestParams<T>): Result {
  const urlWithPatchedProtocol = patchUrlProtocol(url);
  const contentType =
    extractContentTypeFromHeaders(requestParams.headers) || getRequestContentType(requestParams.body);
  const preparedBody = prepareBody(requestParams);

  return {
    url: urlWithPatchedProtocol,
    requestParams: {
      ...requestParams,
      method: requestParams.method.toUpperCase(),
      headers: {
        ...requestParams.headers,
        ...(contentType && { 'Content-Type': contentType }),
      },
      body: preparedBody,
    },
  };
}

function prepareBody<T>(requestParams: RequestParams<T>): RequestInit['body'] {
  switch (requestParams.method) {
    case 'get':
    case 'delete':
    case 'connect':
    case 'head':
    case 'options':
    case 'trace': {
      if (!requestParams.body) {
        return;
      }

      if (isURLSearchParameters(requestParams.body)) {
        return requestParams.body;
      }

      const mutableStringifiedBodyObject: Record<string, string> = {};

      for (const key of Object.keys(requestParams.body)) {
        mutableStringifiedBodyObject[key] = requestParams.body[key]!.toString();
      }

      return new URLSearchParams(mutableStringifiedBodyObject);
    }
    case 'patch':
    case 'put':
    case 'post': {
      if (isPlainObject(requestParams.body)) {
        return JSON.stringify(requestParams.body);
      }

      return requestParams.body;
    }
  }
}

const contentTypeHeaderName = 'content-type';
function extractContentTypeFromHeaders<T>(headers: RequestParams<T>['headers']) {
  if (!headers) {
    return;
  }

  if (Array.isArray(headers)) {
    const contentTypeHeaderWithValue = headers.find((h) => h[0].toLowerCase() === contentTypeHeaderName);

    return contentTypeHeaderWithValue && contentTypeHeaderWithValue[0];
  }

  if (headers instanceof Headers) {
    return headers.get('Content-Type');
  }

  const contentTypeFromHeadersObjectKey = keysOf(headers).find(
    (k) => k.toLowerCase() === contentTypeHeaderName,
  );

  if (contentTypeFromHeadersObjectKey) {
    return headers[contentTypeFromHeadersObjectKey];
  }

  return;
}
