import { openPage } from 'core/signals/page';
import { Page } from 'core/store/types';
import { HTMLAttributeAnchorTarget, memo } from 'react';
import { useDispatch } from 'react-redux';
import { compileAppURL } from 'ui/main/routing';

/**
 * @TODO it is just an experiment with the link component
 * There are a lot of things to improve:
 * - More options
 */
export const AppLink = memo<{
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
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (preventDefault) {
      e.preventDefault();
    }

    dispatch(openPage(page));
  };

  return (
    <a href={href} onClick={onClick} target={target}>
      {title}
    </a>
  );
});
