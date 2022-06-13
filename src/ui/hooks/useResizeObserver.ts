import { MutableRefObject, useEffect, useLayoutEffect, useRef } from 'react';

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
export const useResizeObserver = (elRef: MutableRefObject<HTMLElement | null>, callback: () => void) => {
  /**
   * We have to manually fire callback on resize, cause (from spec):
   * — Observation will fire when watched Element is inserted/removed from DOM.
   * — Observation will fire when watched Element display gets set to none.
   * — Observation will fire when observation starts if Element is being rendered,
   * and Element’s size is not 0,0.
   */
  const sizeRef = useRef({
    width: 0,
    height: 0,
  });

  useLayoutEffect(() => {
    if (!elRef.current) {
      return;
    }

    const sizes = elRef.current.getBoundingClientRect();

    sizeRef.current = {
      width: sizes.width,
      height: sizes.height,
    };
  }, [elRef]);

  useEffect(() => {
    if (!elRef.current || typeof ResizeObserver === 'undefined') {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const contentBoxSize = entry.contentBoxSize[0];

        if (!contentBoxSize) {
          return;
        }

        if (
          contentBoxSize.blockSize !== sizeRef.current.height ||
          contentBoxSize.inlineSize !== sizeRef.current.width
        ) {
          callback();
        }

        sizeRef.current = {
          width: contentBoxSize.inlineSize,
          height: contentBoxSize.blockSize,
        };
      }
    });
    resizeObserver.observe(elRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [callback, elRef]);
};
