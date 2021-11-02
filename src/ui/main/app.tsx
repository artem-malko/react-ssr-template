import { setQueryStringParams } from 'core/actions/appContext/setQueryStringParams';
import { selectPage } from 'core/selectors';
import { useAppSelector } from 'core/store/hooks';
import { AppState, Page } from 'core/store/types';
import { useStyles } from 'infrastructure/css/hook';
import { historyPush } from 'infrastructure/router/actions';
import { sequence } from 'infrastructure/signal';
import React, { lazy, memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'ui/kit/link';
import { Preloader } from 'ui/kit/preloader';
import { Toasts } from 'ui/kit/toast/toasts';
import ErrorPage from 'ui/pages/error';
import { styles as globalStyles } from 'ui/styles/global.css';
import { styles } from './appStyles.css';

/**
 * Use renderCallback as described here https://github.com/reactwg/react-18/discussions/5
 */
type Props = {
  renderCallback: () => void;
};
export const App = memo<Props>(({ renderCallback }) => {
  useStyles(globalStyles)(':global');
  const css = useStyles(styles);
  const page = useAppSelector(selectPage);
  const dispatch = useDispatch();
  // @JUST_FOR_TEST for a demo of problems with react-redux in the strict mode
  const patchQueryString = useCallback(() => {
    dispatch(
      sequence(
        setQueryStringParams({
          params: { test_strict_mode_attr: [new Date().toString()] },
        }),
        historyPush(),
      ),
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
      <div className={css('toastsContainer')}>
        <Toasts />
      </div>
      <div style={{ padding: '20px 0' }}>
        React Version is: <strong>18.0.0-alpha-a0d991fe6-20211031</strong>
        <br />
        Current page is: {JSON.stringify(page)}
        <br />
        <QueryStringComp />
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
const NewsItemPage = lazy(() => import(/* webpackChunkName: "newsItemPage" */ 'ui/pages/newsItem'));

const PageSwitcher = memo<{ page: Page }>(({ page }) => {
  switch (page.name) {
    case 'root':
      return <RootPage page={page} />;
    case 'news':
      return <NewsPage page={page} />;
    case 'newsItem':
      return <NewsItemPage page={page} />;
    default:
      return <ErrorPage page={page} />;
  }
});

const QueryStringComp = memo(() => {
  const queryString = useAppSelector((s: AppState) => s.appContext.URLQueryParams);

  return <div>QUeryString is: {JSON.stringify(queryString)}</div>;
});
