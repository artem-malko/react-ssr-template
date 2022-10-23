import { useRef, useEffect } from 'react';

/**
 * Exec callback asynchronously after didMount of a component
 */
export const useOnDidMount = (callback: () => void) => {
  const mutableIsMounted = useRef<boolean>(false);

  useEffect(() => {
    if (!mutableIsMounted.current) {
      mutableIsMounted.current = true;
      callback();
    }
  }, [callback]);
};
