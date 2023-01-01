type Params = {
  status: number;
  statusText?: string;
  body?: any;
  headers?: Record<string, string>;
};
export function createResponse(params: Params) {
  return new global.Response(params.body, {
    status: params.status,
    statusText: params.statusText || 'Unknonwn error',
    headers: params.headers,
  });
}
