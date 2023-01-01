import { createContext, useContext } from 'react';

export const RaiseErrorContext = createContext({
  raiseError: (_errorCode: number) => {
    /** */
  },
});

/**
 * Returns the `raiseError` function, that allows to raise an error code to the res.status
 * from render of any component.
 */
export const useRaiseError = () => useContext(RaiseErrorContext);
