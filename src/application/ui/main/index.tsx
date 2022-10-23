import { lazy, memo, Suspense } from 'react';
import { Page } from 'application/main/types';
import { useStyles } from 'framework/infrastructure/css/hook';
import { Preloader } from 'application/ui/kit/preloader';
import { Toasts } from 'application/ui/kit/toast/toasts';
import ErrorPage from 'application/ui/pages/error';
import { styles as globalStyles } from 'application/ui/styles/global.css';
import { styles } from './index.css';
import { Popup } from 'application/ui/kit/popup/popup';
import { ZIndexLayout } from 'application/ui/kit/zIndex';
import { DevMenu } from 'application/ui/components/development/devMenu';
import { ErrorBoundary } from 'react-error-boundary';
import { popoverContainerId } from '../kit/popover/shared';
import { useActivePage } from 'application/main/hooks/useActivePage';

export const Main = memo(() => {
  useStyles(globalStyles)(':global');
  const css = useStyles(styles);
  const page = useActivePage();

  return (
    <>
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

              {/* @TODO fix hardcode of the error page's params */}
              <ErrorBoundary
                // If we are here, it means, where is something happen with request for a chunck
                fallback={
                  <ErrorPage
                    page={{
                      name: 'error',
                      params: { code: 500 },
                    }}
                  />
                }
              >
                <Suspense fallback={<Preloader purpose={`page with name ${page.name}`} />}>
                  <Page page={page} />
                </Suspense>
              </ErrorBoundary>
            </div>
          }
        />
      </div>
      <div
        id={popoverContainerId}
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          minHeight: '100%',
          top: 0,
          left: 0,
          right: 0,
        }}
      />
    </>
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
