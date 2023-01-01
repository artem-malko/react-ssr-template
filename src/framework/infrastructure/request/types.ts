import { URLSearchParams } from 'url';

import { RequestError } from './error';

export type Requester = <SuccessResponseBody>(
  url: string,
  config: RequestParams<SuccessResponseBody>,
) => Promise<SuccessResponseBody>;

export interface ParsedError {
  code: number;
  data: {
    message: string;
    body?: unknown;
  };
}

export type RequestMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'head'
  | 'options'
  | 'connect'
  | 'trace';

export type RequestParams<SuccessResponseBody> = Omit<RequestInit, 'method' | 'body'> & {
  errorProcessingMiddleware?: (originalError: RequestError | Error, parsedError: ParsedError) => void;
  networkTimeout?: number;
  parser?: (response: Response) => Promise<SuccessResponseBody>;
} & (RequestWithGetParams | RequestWithGetParamsOrBody);

/**
 * The HEAD method is similar to the GET method.
 * But it doesn’t have any response body,
 * so if it mistakenly returns the response body, it must be ignored.
 * For example, the [GET] /customers endpoint
 * returns a list of customers in its response body.
 * Also, the [HEAD] /customers do the same, but it doesn’t return a list of customers.
 * Before requesting the GET endpoint,
 * we can make a HEAD request to determine
 * the size (Content-length) of the file or data that we are downloading.
 * Therefore, the HEAD method is safe and idempotent.
 *
 * We use OPTIONS method to get information
 * about the possible communication options (Permitted HTTP methods)
 * for the given URL in the server or an asterisk to refer to the entire server.
 * This method is safe and idempotent.
 *
 * The CONNECT method is for making end-to-end connections between a client and a server.
 * It makes a two-way connection like a tunnel between them.
 * For example, we can use this method to safely transfer a large file between the client and the server.
 *
 * The TRACE method is for diagnosis purposes.
 * It creates a loop-back test with the same request body
 * that the client sent to the server before, and the successful response code is 200 OK.
 * The TRACE method is safe and idempotent.
 */
type RequestWithGetParams = {
  method: 'get' | 'delete' | 'head' | 'options' | 'connect' | 'trace';
  body?: URLSearchParams | Record<string, number | boolean | string | null>;
};

/**
 * Only POST, PATCH and PUT HTTP-methods accepts request body safty
 * DELETE method may have a request body, but this body can be ingnored by a server
 *
 * What is the difference between POST and PUT?
 *
 * The PUT method modifies an existing resource,
 * but the POST HTTP method creates a new resource.
 * Therefore, the PUT method is safe and idempotent,
 * while the POST method is neither safe nor idempotent.
 *
 *
 * What is the difference between PUT and PATCH?
 *
 * The PUT method updates the resource by replacing the whole data,
 * while the PATCH method partially updates the resource.
 * Thus, The PUT method is safe and idempotent,
 * but the PATCH method is neither safe nor idempotent.
 */
type RequestWithGetParamsOrBody = {
  method: 'post' | 'put' | 'patch';
  body?: RequestInit['body'] | object;
};
