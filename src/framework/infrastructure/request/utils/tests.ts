import { createResponse } from './response';

type CreateJsonResponseParams = {
  status: number;
  body: string;
  statusText?: string;
  headers?: Record<string, string>;
};
export function createJsonResponse({ status, statusText, body, headers }: CreateJsonResponseParams) {
  return Promise.resolve(
    createResponse({
      status,
      statusText: statusText || 'Default status text',
      body,
      headers: {
        'Content-Type': 'application/json;  charset=utf-8;',
        ...headers,
      },
    }),
  );
}

export function createOkJsonResponse(body: string) {
  return createJsonResponse({
    status: 200,
    body,
  });
}
