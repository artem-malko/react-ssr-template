type CreateRequesteErrorParams = {
  response: Response;
  originalError?: Error;
  parsedBody?: string;
};

export class RequestError extends Error {
  static isRequestError = true;

  public response: Response;
  public originalError?: Error;
  public parsedBody?: string;

  constructor({ response, originalError, parsedBody }: CreateRequesteErrorParams) {
    super();

    this.response = response;
    this.originalError = originalError;
    this.parsedBody = parsedBody;
  }
}
