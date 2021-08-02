import { setQueryStringParams } from 'core/actions/appContext/setQueryStringParams';
import { selectPage } from 'core/selectors';
import { useAppSelector } from 'core/store/hooks';
import { Page } from 'core/store/types';
import React, { lazy, memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'ui/kit/link';
import { Preloader } from 'ui/kit/preloader';
import ErrorPage from 'ui/pages/error';

/**
 * Use renderCallback as described here https://github.com/reactwg/react-18/discussions/5
 */
type Props = {
  renderCallback: () => void;
};
export const App = memo<Props>(({ renderCallback }) => {
  const page = useAppSelector(selectPage);
  const queryString = useAppSelector((s) => s.appContext.URLQueryParams);
  const dispatch = useDispatch();
  // @JUST_FOR_TEST for a demo of problems with react-redux in the strict mode
  const patchQueryString = useCallback(() => {
    dispatch(
      setQueryStringParams({
        params: { test_strict_mode_attr: [new Date().toString()] },
      }),
    );
  }, [dispatch]);

  return (
    <div
      ref={renderCallback}
      style={{
        padding: 10,
        outline: '1px solid red',
      }}
    >
      <div style={{ padding: '20px 0' }}>
        Current page is: {JSON.stringify(page)}
        <br />
        QUeryString is: {JSON.stringify(queryString)}
        <br />
        <br />
        <Link
          title={'Link to the news page'}
          page={{
            name: 'news',
            params: {
              page: 1,
            },
          }}
        />
        <br />
        <Link
          title={'Link to the root page'}
          page={{
            name: 'root',
          }}
        />
        <br />
        <button onClick={patchQueryString}>Patch query string</button>
      </div>
      <React.Suspense fallback={<Preloader purpose="page" />}>
        <PageSwitcher page={page} />
      </React.Suspense>
      <br />
      <br />
      Simple template for a website with SSR and React 18 with a brand new API —
      https://github.com/reactwg/react-18/discussions
    </div>
  );
});

const RootPage = lazy(() => import(/* webpackChunkName: "rootPage" */ 'ui/pages/root'));
const NewsPage = lazy(() => import(/* webpackChunkName: "newsPage" */ 'ui/pages/news'));

const PageSwitcher = memo<{ page: Page }>(({ page }) => {
  switch (page.name) {
    case 'root':
      return <RootPage page={page} />;
    case 'news':
      return <NewsPage page={page} />;
    default:
      return <ErrorPage page={page} />;
  }
});
