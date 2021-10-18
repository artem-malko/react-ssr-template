import { useEffect } from 'react';

type Params = {
  sourceEl: HTMLDivElement | null;
  isShown: boolean;
  hide: () => void;
  // Can be used for popover, for example
  additionalRef?: React.MutableRefObject<HTMLDivElement | null>;
};

/**
 * Used to handle click outside of the rootRef to hide its content, if it was shown.
 * For example, you can use it to handle click to hide a dropdown content.
 *
 * @example
 *
 * const Comp = () => {
 *   const [isShown, setIsShown] = useState(false);
 *   const rootRef = useRef(null);
 *   const toggle = useCallback(() => {
 *     setIsShown((cur) => !cur);
 *   }, []);
 *   useOutsideClick({
 *     hide: toggle,
 *     isShown,
 *     sourceEl: rootRef.current,
 *   });
 *   return (
 *     <>
 *       <h2>click here to hide shown content</h2>
 *       <button onClick={toggle}>show/hide</button>
 *       <div ref={rootRef} style={{ display: isShown ? 'block' : 'none' }}>
 *         hidden content
 *       </div>
 *     </>
 *   );
 * }
 */
export const useOutsideClick = ({ sourceEl, additionalRef, isShown, hide }: Params) => {
  useEffect(() => {
    const onOutSideClick = (e: Event) => {
      if (!sourceEl) {
        return;
      }

      const target = e.target as HTMLElement;

      if (isShown && e.type !== 'touchend') {
        e.preventDefault();
      }

      if (
        sourceEl &&
        !sourceEl.contains(target) &&
        !additionalRef?.current?.contains(target) &&
        isShown
      ) {
        hide();
      }
    };

    window.addEventListener('click', onOutSideClick, true);
    window.addEventListener('touchend', onOutSideClick, true);

    return () => {
      window.removeEventListener('click', onOutSideClick, true);
      window.removeEventListener('touchend', onOutSideClick, true);
    };
  }, [isShown, sourceEl, additionalRef, hide]);
};
