import { memo, useRef, useState, useCallback, useEffect } from 'react';

import { useStyles } from 'framework/public/styles';
import { noopFunc } from 'lib/lodash';
import { Timer } from 'lib/timer';

import { styles } from './index.css';
import { Toast } from '../types';

const baseToastOptions: Required<Toast['options']> = {
  hideOnClick: true,
  freezeOnHover: true,
  freezeOnVisibilitychange: true,
  toastLiveTime: 4000,
};

type Props = {
  toast: Toast;
  remove: (toastId: string) => void;
};
export const ToastItem = memo<Props>((props) => {
  const { toast, remove } = props;
  const options: Required<Toast['options']> = {
    freezeOnHover: toast?.options?.freezeOnHover ?? baseToastOptions.freezeOnHover,
    hideOnClick: toast?.options?.hideOnClick ?? baseToastOptions.hideOnClick,
    freezeOnVisibilitychange:
      toast?.options?.freezeOnVisibilitychange ?? baseToastOptions.freezeOnVisibilitychange,
    toastLiveTime: toast?.options?.toastLiveTime ?? baseToastOptions.toastLiveTime,
  };
  const css = useStyles(styles);
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(options.toastLiveTime);
  const [animate, setAnimate] = useState(false);
  const onClose = useCallback(() => {
    remove(toast.id);
  }, [remove, toast.id]);
  const timerRef = useRef(new Timer(onClose, options.toastLiveTime));
  const barElRef = useRef<HTMLDivElement | null>(null);

  const pauseTimer = useCallback(() => {
    timerRef.current.pause();
    setAnimate(false);
  }, []);
  const startTimer = useCallback(() => {
    timerRef.current.start();
    setTimeLeft(timerRef.current.getTimeLeft());
    setAnimate(true);
  }, []);

  // Pause toast removing when the window loses focus
  // Start timer and show toast
  useEffect(() => {
    function handleVisibilityChange() {
      if (options?.freezeOnVisibilitychange) {
        if (document.hidden) {
          pauseTimer();
        } else {
          startTimer();
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange, false);

    const startTimeoutId = setTimeout(() => {
      timerRef.current.start();
      setIsVisible(true);
      setAnimate(true);
    }, 100);

    return () => {
      if (startTimeoutId) {
        clearTimeout(startTimeoutId);
      }

      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pauseTimer, startTimer, options?.freezeOnVisibilitychange]);

  return (
    <div
      className={css('item')}
      onMouseEnter={options.freezeOnHover ? pauseTimer : noopFunc}
      onMouseLeave={options.freezeOnHover ? startTimer : noopFunc}
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div className={css('close')} onClick={options.hideOnClick ? onClose : noopFunc}>
        ✖️
      </div>
      <div className={css('body')}>{toast.body({ hideToast: onClose })}</div>

      <div
        className={css('bar')}
        ref={barElRef}
        style={{
          transitionDuration: `${timeLeft}ms`,
          width: animate ? 0 : barElRef.current?.getBoundingClientRect().width || '100%',
        }}
      ></div>
    </div>
  );
});
ToastItem.displayName = 'ToastItem';
