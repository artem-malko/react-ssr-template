import { HttpErrorCode } from 'framework/types/http';

/**
 * Creates a store, which store an error code, which is raised during current render
 */
export const createRaiseErrorStore = () => {
  let raisedError: HttpErrorCode | undefined = undefined;

  const raiseError = (httpCode: HttpErrorCode) => {
    raisedError = httpCode;
  };

  const getRaisedError = () => {
    return raisedError;
  };

  return {
    raiseError,
    getRaisedError,
  };
};
