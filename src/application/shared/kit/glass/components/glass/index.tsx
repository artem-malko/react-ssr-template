import { memo, PropsWithChildren } from 'react';

import { useStyles } from 'framework/public/styles';

import { styles } from './index.css';

type Props = {
  isShown: boolean;
};
export const DefaultGlassUI = memo<PropsWithChildren<Props>>(({ isShown, children }) => {
  const css = useStyles(styles);

  return (
    <div className={css('root')}>
      <div className={css('content')}>{children}</div>
      <div className={css('glass', isShown ? ['_shown'] : [])} />
    </div>
  );
});
DefaultGlassUI.displayName = 'DefaultGlassUI';
