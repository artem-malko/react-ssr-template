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
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  theme?: 'default';
  [DATA_T_ATTRIBUTE_NAME]?: string;
};

type AppLinkProps = GeneralProps & {
  page: Page;
  href?: never;
  doNotPreventDefault?: boolean;
};
type BaseLinkProps = GeneralProps & {
  page?: never;
  href?: string;
};
type Props = BaseLinkProps | AppLinkProps;
/**
 * This is a component, which implements all types of any link
 * Depends on props, we can create an internal or external link.
 *
 * If a page is passed to a link, we can use out router to build an url for href param
 * Moreover, that link with the page prop opens that page without a browser reload by default.
 *
 * For an internal link you can switch off preventDefault (doNotPreventDefault),
 *
 * Such difference is used, cause preventDefault for the internal link is a default behaviour.
 */
export const Link = memo<React.PropsWithChildren<Props>>((props) => {
  if ('page' in props && !!props.page) {
    return <AppLink {...props} />;
  }

  return <BaseLink {...props} />;
});

Link.displayName = 'Link';

const AppLink = memo<PropsWithChildren<AppLinkProps>>((props) => {
  const { page, doNotPreventDefault, ...baseLinkProps } = props;
  const href = compileAppURL({
    page: props.page,
    URLQueryParams: {},
  });

  const dispatch = useDispatch();
  // @TODO use useEvent from React
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!doNotPreventDefault) {
      e.preventDefault();
    }

    if (props.onClick) {
      props.onClick(e);
    }

    dispatch(openPageSignal(page));
  };

  return (
    <BaseLink {...baseLinkProps} href={href} onClick={onClick}>
      {props.children}
    </BaseLink>
  );
});
AppLink.displayName = 'AppLink';

const BaseLink = memo<PropsWithChildren<BaseLinkProps>>((props) => {
  const { href, children, theme = 'default', tabIndex, inlineStyles, target, onClick } = props;
  const css = useStyles(styles);
  const dtValue = props[DATA_T_ATTRIBUTE_NAME];
  const onClickHandler = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (onClick) {
        onClick(event);
      }
    },
    [onClick],
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
