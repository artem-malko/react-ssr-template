import { lazy, memo, Suspense } from 'react';
import { selectPage } from 'core/selectors';
import { useAppSelector } from 'core/store/hooks';
import { Page } from 'core/store/types';
import { useStyles } from 'infrastructure/css/hook';
import { Preloader } from 'ui/kit/preloader';
import { Toasts } from 'ui/kit/toast/toasts';
import ErrorPage from 'ui/pages/error';
import { styles as globalStyles } from 'ui/styles/global.css';
import { styles } from './index.css';
import { Popup } from 'ui/kit/popup/popup';
import { ZIndexLayout } from 'ui/kit/zIndex';
import { DevMenu } from 'ui/components/development/devMenu';
import { ErrorBoundary } from 'react-error-boundary';

/**
 * Use renderCallback as described here https://github.com/reactwg/react-18/discussions/5
 */
type Props = {
  renderCallback: () => void;
};
export const Main = memo<Props>(({ renderCallback }) => {
  useStyles(globalStyles)(':global');
  const css = useStyles(styles);
  const page = useAppSelector(selectPage);

  return (
    <div ref={renderCallback}>
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
            <div style={{ margin: '-10px -10px 0', position: 'sticky', top: 0 }}>
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
  );
});
Main.displayName = 'Main';

const RootPage = lazy(() => import(/* webpackChunkName: "rootPage" */ 'ui/pages/root'));
const NewsPage = lazy(() => import(/* webpackChunkName: "newsPage" */ 'ui/pages/news'));
const NewsItemPage = lazy(() => import(/* webpackChunkName: "newsItemPage" */ 'ui/pages/newsItem'));
const UsersPage = lazy(() => import(/* webpackChunkName: "usersPage" */ 'ui/pages/users'));

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
