import { ErrorInfo, lazy, memo, Suspense, useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { useActivePage } from 'application/main/hooks/useActivePage';
import { Page } from 'application/main/types';
import { DevMenu } from 'application/ui/components/development/devMenu';
import { Popup } from 'application/ui/kit/popup/popup';
import { Preloader } from 'application/ui/kit/preloader';
import { Toasts } from 'application/ui/kit/toast/toasts';
import { ZIndexLayout } from 'application/ui/kit/zIndex';
import ErrorPage from 'application/ui/pages/error';
import { styles as globalStyles } from 'application/ui/styles/global.css';
import { useStyles } from 'framework/infrastructure/css/hook';
import { useAppLogger } from 'framework/infrastructure/logger/react/hook';
import { getMessageAndStackParamsFromError } from 'framework/infrastructure/logger/utils';

import { styles } from './index.css';
import { RootGlassBoundaryName } from '../kit/glass/constants';
import { GlassBoundary } from '../kit/glass/context';
import { PopoverContainer } from '../kit/popover/container';

export const Main = memo(() => {
  useStyles(globalStyles)(':global');
  const css = useStyles(styles);
  const page = useActivePage();
  const { sendFatalErrorLog } = useAppLogger();
  const onErrorHandler = useCallback(
    (error: Error, errorInfo: ErrorInfo) => {
      const { message, stack } = getMessageAndStackParamsFromError(error);

      sendFatalErrorLog({
        id: 'main-error-boundary',
        message,
        stack,
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

const RootPage = lazy(() => import(/* webpackChunkName: "rootPage" */ 'application/ui/pages/root'));
const NewsPage = lazy(() => import(/* webpackChunkName: "newsPage" */ 'application/ui/pages/news'));
const NewsItemPage = lazy(
  () => import(/* webpackChunkName: "newsItemPage" */ 'application/ui/pages/newsItem'),
);
const UsersPage = lazy(() => import(/* webpackChunkName: "usersPage" */ 'application/ui/pages/users'));

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
