import { createContext, useContext } from 'react';

import { HttpErrorCode } from 'framework/types/http';

export const RaiseErrorContext = createContext({
  raiseError: (_errorCode: HttpErrorCode) => {
    /** */
  },
});

/**
 * Returns the `raiseError` function, that allows to raise an error code to the res.status
 * from render of any component.
 */
export const useRaiseError = () => useContext(RaiseErrorContext);
