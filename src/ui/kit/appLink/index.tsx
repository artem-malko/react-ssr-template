import { HTMLAttributeAnchorTarget, PropsWithChildren, memo } from 'react';
import { useDispatch } from 'react-redux';
import { openPage } from 'core/signals/page';
import { Page } from 'core/store/types';
import { compileAppURL } from 'ui/main/routing';
import { Link } from '../link';

/**
 * This is a wrapper around kit/Link which will create a link to any page inside the application
 */
export const AppLink = memo<
  PropsWithChildren<{
    page: Page;
    preventDefault?: boolean;
    target?: HTMLAttributeAnchorTarget;
  }>
>(({ page, children, preventDefault = true, target = '_self' }) => {
  const href = compileAppURL({
    page,
    URLQueryParams: {},
  });

  const dispatch = useDispatch();
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (preventDefault) {
      e.preventDefault();
    }

    dispatch(openPage(page));
  };

  return (
    <Link href={href} onClick={onClick} target={target}>
      {children}
    </Link>
  );
});
