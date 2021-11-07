import { useStyles } from 'infrastructure/css/hook';
import { memo } from 'react';
import { styles } from './index.css';

interface ZIndexLayoutProps {
  base: JSX.Element;
  middle?: JSX.Element;
  top?: JSX.Element;
}
export const ZIndexLayout = memo((props: ZIndexLayoutProps) => {
  const css = useStyles(styles);

  return (
    <>
      <div className={css('base')}>{props.base}</div>
      {props.middle ? <div className={css('middle')}>{props.middle}</div> : <></>}
      {props.top ? <div className={css('top')}>{props.top}</div> : <></>}
    </>
  );
});

ZIndexLayout.displayName = 'ZIndexLayout';
