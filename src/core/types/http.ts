export type HttpCode = 200 | 400 | 403 | 404 | 500 | 503 | 599;

export type HttpErrorCode = Exclude<HttpCode, 200>;
