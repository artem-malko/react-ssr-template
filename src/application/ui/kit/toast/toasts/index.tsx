import { memo, useEffect, useRef, useState, useCallback, useContext } from 'react';

import { useStyles } from 'framework/infrastructure/css/hook';
import { useSession } from 'framework/infrastructure/session/hook';

import { ToastControllerContext } from '../infrastructure/context';
import { ToastItem } from '../toast';
import { Toast } from '../types';
import { styles } from './index.css';

/**
 * This compoment is used as a container for all toasts.
 * It controls:
 * — How many toasts will be rendered on the screen
 * — An animation of each toast
 */
export const Toasts = memo<{ gap?: number }>(({ gap = 20 }) => {
  const toastController = useContext(ToastControllerContext);
  const { isMobile } = useSession();
  const css = useStyles(styles);
  const [, rerender] = useState<number>(0);
  const toastsRef = useRef<Toast[]>([]);
  const toastElementsRef = useRef<Array<HTMLDivElement | null>>([]);
  const toastsToRender = toastsRef.current.slice(0, isMobile ? 1 : 5);

  /**
   * Rerender on each new toast in toastController
   */
  useEffect(() => {
    const unsubscribe = toastController.subscribeToAdd((toast) => {
      toastsRef.current = toastsRef.current.concat(toast);

      rerender(Math.random());
    });
    return () => {
      unsubscribe();
    };
  }, [toastController]);

  /**
   * Yes, with effect will be executed on each render
   * And it is ok, cause we need to have actual transform for each toast
   * on every render
   */
  useEffect(() => {
    let newToastTranslateY = 0;
    toastElementsRef.current.forEach((toastNode) => {
      if (toastNode) {
        const boundingClientRect = toastNode.getBoundingClientRect();
        // eslint-disable-next-line functional/immutable-data
        toastNode.style.transform = `translateY(${newToastTranslateY}px)`;
        newToastTranslateY += boundingClientRect.height + gap;
      }
    });
  });

  const remove = useCallback((toastId: string) => {
    const indexOfToast = toastsRef.current.findIndex((t) => t.id === toastId);

    if (indexOfToast !== -1) {
      toastsRef.current.splice(indexOfToast, 1);
    }

    rerender(Math.random());
  }, []);

  return (
    <>
      {toastsToRender.map((toast, i) => (
        <div ref={(el) => (toastElementsRef.current[i] = el)} key={toast.id} className={css('item')}>
          <ToastItem toast={toast} remove={remove} />
        </div>
      ))}
    </>
  );
});
Toasts.displayName = 'Toasts';
