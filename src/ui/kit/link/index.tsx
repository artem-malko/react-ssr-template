import { openPage } from 'core/actions/appContext/openPage';
import { Page } from 'core/store/types';
import { historyPush } from 'infrastructure/router/actions';
import { sequence } from 'infrastructure/signal';
import { HTMLAttributeAnchorTarget, memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { compileAppURL } from 'ui/main/routing';

/**
 * @TODO it is just an experiment with the link component
 * There are a lot of things to improve:
 * - More options
 * - Better typings for page (like to=PageName and spread props for Page['params'])
 */
export const Link = memo<{
  page: Page;
  title: string;
  preventDefault?: boolean;
  target?: HTMLAttributeAnchorTarget;
}>(({ page, title, preventDefault = true, target = '_self' }) => {
  const href = compileAppURL({
    page,
    URLQueryParams: {},
  });
  const dispatch = useDispatch();
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (preventDefault) {
        e.preventDefault();
      }

      dispatch(sequence(openPage(page), historyPush()));
    },
    [dispatch, page, preventDefault],
  );

  return (
    <a href={href} onClick={onClick} target={target}>
      {title}
    </a>
  );
});
