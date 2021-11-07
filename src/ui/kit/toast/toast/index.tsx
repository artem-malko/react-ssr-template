import { memo, useRef, useState, useLayoutEffect, useCallback } from 'react';
import { Toast } from '../types';
import { styles } from './index.css';
import { Timer } from 'lib/timer';
import { useStyles } from 'infrastructure/css/hook';

const baseToastTimeLive = 4000;

type Props = {
  toast: Toast;
  remove: (toastId: string) => void;
};
export const ToastItem = memo<Props>((props) => {
  const { toast, remove } = props;
  const css = useStyles(styles);
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(baseToastTimeLive);
  const [animate, setAnimate] = useState(false);
  const onClose = useCallback(() => {
    remove(toast.id);
  }, [remove, toast.id]);
  const timerRef = useRef(new Timer(onClose, baseToastTimeLive));
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
  useLayoutEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden) {
        pauseTimer();
      } else {
        startTimer();
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
  }, [pauseTimer, startTimer]);

  return (
    <div
      className={css('item')}
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div className={css('close')} onClick={onClose}>
        ✖️
      </div>
      <div className={css('body')}>
        {toast.title}
        <br />
        toast type is: <strong>{toast.type}</strong>
      </div>

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
