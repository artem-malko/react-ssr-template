import { useCallback, useContext, useEffect, useRef } from 'react';

import { noopFunc } from 'lib/lodash';

import { GlassContext } from './context';

export const useToggleGlass = () => {
  const { showGlass } = useContext(GlassContext);
  const hideGlassFuncRef = useRef(noopFunc);

  return useCallback(
    (isLoading: boolean, glassName?: string) => {
      if (isLoading) {
        hideGlassFuncRef.current = showGlass(glassName);
      } else {
        hideGlassFuncRef.current();
      }
    },
    [showGlass],
  );
};

export const useGlassEffect = (needToShowGlass: boolean, glassName?: string) => {
  const { showGlass } = useContext(GlassContext);

  useEffect(() => {
    if (!needToShowGlass) {
      return;
    }

    const hideGlass = showGlass(glassName);

    return () => {
      hideGlass();
    };
  }, [needToShowGlass, glassName, showGlass]);
};
