import { useCallback, memo, HTMLAttributeAnchorTarget } from 'react';
import { styles } from './index.css';
import { dt, DATA_T_ATTRIBUTE_NAME } from 'tests/dom/dt';
import { useStyles } from 'infrastructure/css/hook';
import { AllowedInlineStyle } from 'infrastructure/css/types';

type Props = {
  href: string | undefined;
  theme?: 'default';
  target?: HTMLAttributeAnchorTarget;
  tabIndex?: number;
  inlineStyles?: AllowedInlineStyle;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  [DATA_T_ATTRIBUTE_NAME]?: string;
};
export const Link = memo<React.PropsWithChildren<Props>>((props) => {
  const { href, children, theme = 'default', tabIndex, inlineStyles, target, onClick } = props;
  const css = useStyles(styles);
  const dtValue = props[DATA_T_ATTRIBUTE_NAME];
  const onClickHandler = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (onClick) {
        event.preventDefault();
        onClick(event);
      }
    },
    [onClick],
  );

  if (!href) {
    return (
      <span
        className={css('link', [`_t_${theme}`, '_no_link'])}
        style={inlineStyles}
        onClick={onClickHandler}
        {...(dtValue ? dt(dtValue) : {})}
      >
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      target={target}
      className={css('link', [`_t_${theme}`])}
      tabIndex={tabIndex}
      style={inlineStyles}
      onClick={onClickHandler}
      {...(dtValue ? dt(dtValue) : {})}
    >
      {children}
    </a>
  );
});

Link.displayName = 'Link';
