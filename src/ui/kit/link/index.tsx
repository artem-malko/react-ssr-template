import { useCallback, memo, HTMLAttributeAnchorTarget, PropsWithChildren } from 'react';
import { styles } from './index.css';
import { dt, DATA_T_ATTRIBUTE_NAME } from 'tests/dom/dt';
import { useStyles } from 'infrastructure/css/hook';
import { AllowedInlineStyle } from 'infrastructure/css/types';
import { Page } from 'core/store/types';
import { compileAppURL } from 'ui/main/routing';
import { useDispatch } from 'react-redux';
import { openPageSignal } from 'core/signals/page';

type GeneralProps = {
  target?: HTMLAttributeAnchorTarget;
  tabIndex?: number;
  inlineStyles?: AllowedInlineStyle;
  doNotPreventDefault?: boolean;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  [DATA_T_ATTRIBUTE_NAME]?: string;
};

type Props =
  | (GeneralProps & {
      page?: never;
      href?: string;
      theme?: 'default';
    })
  | (GeneralProps & {
      page: Page;
    });
export const Link = memo<React.PropsWithChildren<Props>>((props) => {
  if ('page' in props && !!props.page) {
    return <AppLink {...props} />;
  }

  return <BaseLink {...props} />;
});

Link.displayName = 'Link';

const AppLink = memo<
  PropsWithChildren<
    GeneralProps & {
      page: Page;
    }
  >
>((props) => {
  const href = compileAppURL({
    page: props.page,
    URLQueryParams: {},
  });

  const dispatch = useDispatch();
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!props.doNotPreventDefault) {
      e.preventDefault();
    }

    if (props.onClick) {
      props.onClick(e);
    }

    dispatch(openPageSignal(props.page));
  };

  return (
    <BaseLink {...props} href={href} onClick={onClick}>
      {props.children}
    </BaseLink>
  );
});
AppLink.displayName = 'AppLink';

const BaseLink = memo<
  PropsWithChildren<
    GeneralProps & {
      href?: string;
      theme?: 'default';
    }
  >
>((props) => {
  const {
    href,
    children,
    theme = 'default',
    tabIndex,
    inlineStyles,
    target,
    onClick,
    doNotPreventDefault,
  } = props;
  const css = useStyles(styles);
  const dtValue = props[DATA_T_ATTRIBUTE_NAME];
  const onClickHandler = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (!doNotPreventDefault) {
        event.preventDefault();
      }

      if (onClick) {
        onClick(event);
      }
    },
    [onClick, doNotPreventDefault],
  );
  if (!props.href) {
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
BaseLink.displayName = 'BaseLink';
