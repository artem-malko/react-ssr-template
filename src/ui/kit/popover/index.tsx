import { memo, PropsWithChildren, useRef, useLayoutEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useOutsideClick } from 'ui/hooks/useOutsideClick';
import { useResizeObserver } from 'ui/hooks/useResizeObserver';
import { Fade } from '../fade';
import { popoverContainerId } from './shared';
import { getPositionStyles } from './utils';

export type Placement = 'top' | 'right' | 'bottom' | 'left';
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
  targetEl: HTMLDivElement | null;
  isShown: boolean;
  hide: () => void;
  placement?: Placement;
  alignment?: Alignment;
  width?: number;
  horizontalOffset?: number;
  verticalOffset?: number;
  animationDuration?: number;
  animationDelay?: number;
};
export const Popover = memo<PropsWithChildren<Props>>(
  ({
    targetEl,
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
  }) => {
    const popoverContainerRef = useRef<HTMLDivElement | null>(null);
    const popoverConentRef = useRef<HTMLDivElement | null>(null);
    const bodyElRef = useRef<HTMLElement | null>(null);

    useOutsideClick({
      sourceEl: targetEl,
      isShown,
      hide,
      additionalRef: popoverContainerRef,
    });

    useLayoutEffect(() => {
      popoverContainerRef.current = document.querySelector(`#${popoverContainerId}`);
      bodyElRef.current = document.body;
    }, []);

    const onResizeHandler = useCallback(() => {
      hide();

      // We need to hide popover conent as fast as possible to prevent any glitches
      if (popoverConentRef.current) {
        popoverConentRef.current.style.display = 'none';
      }
    }, [hide]);

    useResizeObserver(bodyElRef, onResizeHandler);

    /**
     * Get more info about calculation of the view in getPositionStyles function
     */
    const view = useMemo(() => {
      /**
       * isShown is used to recalculate position in case of hide/show switch cause of resizeObserver
       */
      if (!targetEl || !isShown) {
        return defaultView;
      }

      const targetElBoundingRect = targetEl.getBoundingClientRect();
      const popoverWidth = width || targetElBoundingRect.width;

      return {
        ...defaultView,
        ...getPositionStyles({
          horizontalOffset: horizontalOffset,
          verticalOffset: verticalOffset,
          placement,
          popoverWidth,
          targetElBoundingRect,
          alignment: alignment,
        }),
        width: width || targetElBoundingRect.width,
      };
    }, [isShown, targetEl, width, horizontalOffset, verticalOffset, placement, alignment]);

    if (!isShown || !popoverContainerRef.current) {
      return null;
    }

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
        }}
        ref={popoverConentRef}
      >
        <Fade
          isShown
          // If animationDuration <= 0, it means, we do not have to animate
          isInitiallyShown={animationDuration <= 0}
          transitionDuration={animationDuration}
          transitionDelay={animationDelay}
        >
          {children}
        </Fade>
      </div>,
      popoverContainerRef.current,
    );
  },
);
Popover.displayName = 'Dropdown';
