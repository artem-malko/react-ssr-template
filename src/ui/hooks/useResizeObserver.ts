import { MutableRefObject, useEffect } from 'react';

/**
 * Creates ResizeObserver instance on an elRef with a callback
 * https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
 *
 * @example
 *
 * const handleResize = (() => {
 *   console.log('resized');
 * });
 *
 * useResizeObserver(ref, handleResize);
 */
export const useResizeObserver = (
  elRef: MutableRefObject<HTMLElement | null>,
  callback: ResizeObserverCallback,
) => {
  useEffect(() => {
    if (!elRef.current || typeof ResizeObserver === 'undefined') {
      return;
    }

    const resizeObserver = new ResizeObserver(callback);
    resizeObserver.observe(elRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [callback, elRef]);
};
