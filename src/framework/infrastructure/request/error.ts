export class RequestError extends Error {
  static isRequestError = true;

  constructor(public response: Response, public parsedBody?: string) {
    super();
  }
}
