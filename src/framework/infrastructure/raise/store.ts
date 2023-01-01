/**
 * Creates a store, which store an error code, which is raised during current render
 */
export const createRaiseErrorStore = () => {
  let raisedError: number | undefined = undefined;

  const raiseError = (httpCode: number) => {
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
