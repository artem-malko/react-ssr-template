import { debounce } from 'lib/lodash';
import { memo, PropsWithChildren, useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { useOutsideClick } from 'ui/hooks/useOutsideClick';
import { popoverContainerId } from './shared';
import { getPositionStyles } from './utils';

export type Placement = 'top' | 'right' | 'bottom' | 'left';
export type Alignment = 'start' | 'center' | 'end';

type Props = {
  targetEl: HTMLDivElement | null;
  isShown: boolean;
  hide: () => void;
  placement?: Placement;
  alignment?: Alignment;
  width?: number;
  horizontalOffset?: number;
  verticalOffset?: number;
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
  }) => {
    const [view, setView] = useState({
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      left: 'auto',
      width: 0,
      transform: 'none',
    });
    const [isVisible, setIsVisible] = useState(isShown);
    const popoverContainerRef = useRef<HTMLDivElement | null>(null);

    useOutsideClick({
      sourceEl: targetEl,
      isShown,
      hide,
      additionalRef: popoverContainerRef,
    });

    useEffect(() => {
      const onResize = debounce(() => {
        hide();
      }, 100);

      window.addEventListener('resize', onResize);

      return () => {
        window.removeEventListener('resize', onResize);
      };
    }, [hide]);

    useEffect(() => {
      if (typeof ResizeObserver === 'undefined') {
        return;
      }

      // create an Observer instance
      const resizeObserver = new ResizeObserver(() => {
        // @TODO recalculate position
        hide();
      });
      resizeObserver.observe(document.body);

      return () => {
        resizeObserver.disconnect();
      };
    }, [hide]);

    useEffect(() => {
      if (!targetEl) {
        return;
      }

      if (!isShown) {
        setIsVisible(false);
        return;
      }

      const targetElBoundingRect = targetEl.getBoundingClientRect();
      const popoverWidth = width || targetElBoundingRect.width;

      setView({
        ...getPositionStyles({
          horizontalOffset: horizontalOffset,
          verticalOffset: verticalOffset,
          placement,
          popoverWidth,
          targetElBoundingRect,
          alignment: alignment,
        }),
        width: width || targetElBoundingRect.width,
      });
      setIsVisible(true);
    }, [isShown, targetEl, width, horizontalOffset, verticalOffset, placement, alignment]);

    useLayoutEffect(() => {
      popoverContainerRef.current = document.querySelector(`#${popoverContainerId}`);
    }, []);

    if (!isShown || !isVisible || !popoverContainerRef.current) {
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
      >
        {children}
      </div>,
      popoverContainerRef.current,
    );
  },
);
Popover.displayName = 'Dropdown';
