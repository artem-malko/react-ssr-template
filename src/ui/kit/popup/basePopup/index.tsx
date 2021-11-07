import { useStyles } from 'infrastructure/css/hook';
import { memo, PropsWithChildren, useCallback } from 'react';
import { ZIndexLayout } from 'ui/kit/zIndex';
import { usePopup } from '../infrastructure/hook';
import { styles } from './index.css';

type Props = {
  hideCloseButton?: boolean;
  popupId: string;
};
export const BasePopup = memo<PropsWithChildren<Props>>(({ children, hideCloseButton, popupId }) => {
  const css = useStyles(styles);
  const { closePopupById } = usePopup();
  const onCloseClick = useCallback(() => {
    closePopupById(popupId);
  }, [closePopupById, popupId]);

  return (
    <div className={css('root')}>
      <ZIndexLayout
        top={
          !hideCloseButton ? (
            <div className={css('closeWrapper')}>
              <div onClick={onCloseClick} className={css('closeButton')}>
                ✖️
              </div>
            </div>
          ) : (
            <></>
          )
        }
        base={<div className={css('body')}>{children}</div>}
      />
    </div>
  );
});
