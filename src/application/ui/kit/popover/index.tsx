import {
  memo,
  useRef,
  useMemo,
  useCallback,
  useEffect,
  useState,
  isValidElement,
  useLayoutEffect,
} from 'react';
import { createPortal } from 'react-dom';

import { useOutsideClick } from 'application/ui/hooks/useOutsideClick';
import { useResizeObserver } from 'application/ui/hooks/useResizeObserver';

import { FadeIn } from '../fadeIn';
import { popoverContainerId } from './shared';
import { getPositionViewAttrs } from './utils';

export type Placement = 'top' | 'end' | 'bottom' | 'start';
export type Alignment = 'start' | 'center' | 'end';

const defaultView = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto',
  width: 0,
  transform: 'none',
};

type Props = {
  targetRef: React.RefObject<HTMLElement>;
  isShown: boolean;
  hide: () => void;
  placement?: Placement;
  alignment?: Alignment;
  width?: number;
  horizontalOffset?: number;
  verticalOffset?: number;
  animationDuration?: number;
  animationDelay?: number;
  children:
    | React.ReactNode
    | ((params: { placement: Placement; alignment: Alignment }) => React.ReactNode);
  isRTL?: boolean;
};
/**
 * The popover component allows to show any content, near other element
 *
 * @example
 * const popoverTargetRef = useRef(null);
 * const [isPopoverShown, setIsPopoverShown] = useState(false);
 * const hide = useCallback(() => { setIsPopoverShown(false); }, []);
 *
 * return (
 *   <>
 *     <button onClick={() => setIsPopoverShown(true)} ref={popoverTargetRef}>
 *       Show popover
 *     </button>
 *     <Popover
 *      hide={hide}
 *      targetRef={popoverTargetRef}
 *      isShown={isPopoverShown}
 *      alignment="center"
 *      width={150}
 *      verticalOffset={4}
 *     >
 *       Hidden Content
 *     </Popover>
 *   </>
 * );
 *
 */
export const Popover = memo<Props>(
  ({
    targetRef,
    isShown,
    hide,
    children,
    horizontalOffset = 0,
    verticalOffset = 0,
    placement = 'bottom',
    alignment = 'center',
    width = 0,
    animationDuration = 200,
    animationDelay = 0,
    isRTL = false,
  }) => {
    const popoverContainerRef = useRef<HTMLDivElement | null>(null);
    const popoverContentRef = useRef<HTMLDivElement | null>(null);
    const bodyElRef = useRef<HTMLElement | null>(null);
    const [popoverContentDOMRect, setPopoverContentDOMRect] = useState<DOMRect | undefined>(undefined);

    useLayoutEffect(() => {
      popoverContainerRef.current = document.querySelector(`#${popoverContainerId}`);
      bodyElRef.current = document.body;
    }, []);

    useLayoutEffect(() => {
      /**
       * Prevent popover hiding on case of useOutsideClick execution
       * In useOutsideClick we have mousedown and touchstart event handlers
       * Right here we prevent propogation of these events, if click was in a popoverContainer
       */
      const eventListener = (event: MouseEvent | TouchEvent) => {
        event.stopPropagation();
      };

      popoverContainerRef.current?.addEventListener('mousedown', eventListener, true);
      popoverContainerRef.current?.addEventListener('touchstart', eventListener, true);

      return () => {
        popoverContainerRef.current?.removeEventListener('mousedown', eventListener, true);
        popoverContainerRef.current?.removeEventListener('touchstart', eventListener, true);
      };
    }, []);

    useOutsideClick({
      sourceRef: targetRef,
      isShown,
      hide,
    });

    const onResizeHandler = useCallback(() => {
      // We need to hide popover conent as fast as possible to prevent any glitches
      if (popoverContentRef.current) {
        popoverContentRef.current.style.display = 'none';
      }

      hide();
    }, [hide]);
    useResizeObserver(bodyElRef, onResizeHandler);

    /**
     * After render, we can get all demensions of a popover
     */
    useEffect(() => {
      if (isShown) {
        setPopoverContentDOMRect(popoverContentRef.current?.getBoundingClientRect());
      }
    }, [isShown]);

    const view = useMemo(() => {
      /**
       * isShown is used to recalculate position
       * in case of hide/show switch cause of resizeObserver
       */
      if (!targetRef.current || !isShown) {
        return defaultView;
      }

      const targetElBoundingRect = targetRef.current.getBoundingClientRect();
      const popoverWidth = width || targetElBoundingRect.width;

      /**
       * Let's try to render a popover somewhere to get its size
       */
      if (!popoverContentDOMRect) {
        return {
          ...defaultView,
          width: popoverWidth,
        };
      }

      return {
        ...defaultView,
        ...getPositionViewAttrs({
          horizontalOffset,
          verticalOffset,
          placement,
          popoverWidth,
          targetElBoundingRect,
          popoverContentDOMRect,
          alignment,
          isRTL,
        }),
        width: popoverWidth,
      };
    }, [
      popoverContentDOMRect,
      isShown,
      targetRef,
      width,
      horizontalOffset,
      verticalOffset,
      placement,
      alignment,
      isRTL,
    ]);

    if (!isShown || !popoverContainerRef.current) {
      return null;
    }

    const childrenToRender = isValidElement(children)
      ? children
      : typeof children === 'function'
      ? children({
          alignment,
          placement,
        })
      : children;

    return createPortal(
      <div
        style={{
          position: 'absolute',
          pointerEvents: 'auto',
          top: `${view.top}px`,
          right: `${view.right}px`,
          bottom: `${view.bottom}px`,
          left: `${view.left}px`,
          width: `${view.width}px`,
          transform: view.transform,
          // We have to render a popover with its all demensions
          // So, we need to use a visibility property
          visibility: !!popoverContentDOMRect && !!popoverContentDOMRect.height ? 'visible' : 'hidden',
        }}
        ref={popoverContentRef}
      >
        <FadeIn
          isShown
          isInitiallyShown={animationDuration <= 0}
          transitionDuration={animationDuration}
          transitionDelay={animationDelay}
        >
          {childrenToRender}
        </FadeIn>
      </div>,
      popoverContainerRef.current,
    );
  },
);
Popover.displayName = 'Popover';
