import { ErrorInfo, lazy, memo, Suspense, useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { DevMenu } from 'application/features/development/devMenu';
import ErrorPage from 'application/pages/error';
import { Page } from 'application/pages/shared';
import { useActivePage } from 'application/shared/hooks/useActivePage';
import { RootGlassBoundaryName } from 'application/shared/kit/glass/constants';
import { GlassBoundary } from 'application/shared/kit/glass/context';
import { PopoverContainer } from 'application/shared/kit/popover/container';
import { Popup } from 'application/shared/kit/popup/popup';
import { Preloader } from 'application/shared/kit/preloader';
import { Toasts } from 'application/shared/kit/toast/toasts';
import { ZIndexLayout } from 'application/shared/kit/zIndex';
import { styles as globalStyles } from 'application/shared/styles/global.css';
import { useStyles } from 'framework/public/styles';
import { useAppLogger } from 'framework/public/universal';

import { styles } from './index.css';

export const Main = memo(() => {
  useStyles(globalStyles)(':global');
  const css = useStyles(styles);
  const page = useActivePage();
  const { sendFatalErrorLog } = useAppLogger();
  const onErrorHandler = useCallback(
    (error: Error, errorInfo: ErrorInfo) => {
      sendFatalErrorLog({
        id: 'main-error-boundary',
        message: error.message,
        stack: error.stack,
        data: {
          componentStack: errorInfo.componentStack,
        },
      });
    },
    [sendFatalErrorLog],
  );

  return (
    <ErrorBoundary
      onError={onErrorHandler}
      fallback={
        <ErrorPage
          page={{
            name: 'error',
            params: { code: 500 },
          }}
        />
      }
    >
      <GlassBoundary name={RootGlassBoundaryName}>
        <div>
          <ZIndexLayout
            top={
              <>
                <div className={css('toastContainer')}>
                  <Toasts />
                </div>
                <div className={css('popupContainer')}>
                  <Popup />
                </div>
              </>
            }
            base={
              <div style={{ padding: 10 }}>
                <div style={{ margin: '-10px -10px 0' }}>
                  <DevMenu />
                </div>
                <Suspense fallback={<Preloader purpose={`page with name ${page.name}`} />}>
                  <Page page={page} />
                </Suspense>
              </div>
            }
          />
        </div>
        <PopoverContainer />
      </GlassBoundary>
    </ErrorBoundary>
  );
});
Main.displayName = 'Main';

const RootPage = lazy(() => import(/* webpackChunkName: "rootPage" */ 'application/pages/root'));
const NewsPage = lazy(() => import(/* webpackChunkName: "newsPage" */ 'application/pages/news'));
const NewsItemPage = lazy(
  () => import(/* webpackChunkName: "newsItemPage" */ 'application/pages/newsItem'),
);
const UsersPage = lazy(() => import(/* webpackChunkName: "usersPage" */ 'application/pages/users'));

const Page = memo<{ page: Page }>(({ page }) => {
  switch (page.name) {
    case 'root':
      return <RootPage page={page} />;
    case 'news':
      return <NewsPage page={page} />;
    case 'newsItem':
      return <NewsItemPage page={page} />;
    case 'users':
      return <UsersPage page={page} />;
    default:
      return <ErrorPage page={page} />;
  }
});
