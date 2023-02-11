import { createContext } from 'react';

import { AnyAppContext } from 'framework/public/types';

export const CompileAppURLContext = createContext<(appContext: AnyAppContext) => string>(() => {
  return '/';
});
