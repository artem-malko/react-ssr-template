import {
  DefaultOptions as DefaultReactQueryOptions,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { Provider as ReduxStoreProvider } from 'react-redux';

import { Shell } from 'framework/applications/shell';
import { getClientApplicationConfig } from 'framework/config/generator/client';
import { ConfigContext } from 'framework/config/react';
import { applicationContainerId } from 'framework/constants/application';
import { CSSProvider } from 'framework/infrastructure/css/provider';
import { CSSClientProviderStore } from 'framework/infrastructure/css/provider/clientStore';
import { AppLogger } from 'framework/infrastructure/logger';
import { createClientGlobalErrorHandlers } from 'framework/infrastructure/logger/clientLog';
import { AppLoggerContext } from 'framework/infrastructure/logger/react/context';
import { createPlatformAPI } from 'framework/infrastructure/platform';
import { createCookieAPI } from 'framework/infrastructure/platform/cookie/client';
import { PlatformAPIContext } from 'framework/infrastructure/platform/shared/context';
import { createWindowApi } from 'framework/infrastructure/platform/window/client';
import { defaultQueryOptions } from 'framework/infrastructure/query/defaultOptions';
import { RouterReduxContext } from 'framework/infrastructure/router/redux/store/context';
import { AnyPage, ClientRouter } from 'framework/infrastructure/router/types';
import { SessionContext } from 'framework/infrastructure/session/context';

import { devConsoleLog } from 'lib/console/devConsole';

import { restoreStore } from './store';
import { GetTitle } from './types';
import { afterAppRendered } from './utils/afterAppRendered';
import { createClientSessionObject } from './utils/createClientSessionObject';
const cssProviderStore = new CSSClientProviderStore();

const container = document.getElementById(applicationContainerId) as Element;

const config = getClientApplicationConfig();

const platformAPI = createPlatformAPI({
  envSpecificAPIs: {
    window: createWindowApi(window),
    cookies: createCookieAPI(),
  },
});
const session = createClientSessionObject();

type Params<Page extends AnyPage<string>> = {
  /**
   * All methods and configs for a router on a client side
   */
  router: ClientRouter;
  /**
   * React entry point
   */
  MainComp: React.ReactNode;
  /**
   * Just a logger, which follows AppLogger interface
   */
  appLogger: AppLogger;
  /**
   * On a client side we need to update only a title of a page
   */
  getTitle: GetTitle<Page>;
  /**
   * A callback which is executed on the first render of an application
   * Caution, the first render doesn't mean, that this render was finished
   * This callback can be executed during this process, but only once.
   */
  onAppRenderedHandler?: () => void;
  /**
   * A callback, which is executed on a error "content mismatch"
   */
  onRecoverableErrorHandler?: (args: unknown) => void;
  /**
   * Default options for react-query
   */
  defaultReactQueryOptions?: DefaultReactQueryOptions;
};
/**
 * An entry point for a client application
 */
export const startClientApplication = <Page extends AnyPage<string>>({
  MainComp,
  router,
  appLogger,
  onAppRenderedHandler,
  onRecoverableErrorHandler,
  defaultReactQueryOptions,
  getTitle,
}: Params<Page>) => {
  const { logClientUncaughtException, logClientUnhandledRejection } =
    createClientGlobalErrorHandlers(appLogger);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        ...defaultQueryOptions.queries,
        ...defaultReactQueryOptions?.queries,
      },
      mutations: {
        ...defaultQueryOptions.mutations,
        ...defaultReactQueryOptions?.mutations,
      },
    },
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;

    if (reason instanceof Error) {
      logClientUnhandledRejection(reason);
      return;
    }

    const stringifiedReason = typeof reason === 'object' ? JSON.stringify(reason) : reason.toString();

    logClientUnhandledRejection(new Error(stringifiedReason));
  });

  window.addEventListener('error', ({ error }) => {
    logClientUncaughtException(error);
  });

  return restoreStore<Page>({
    compileAppURL: router.compileURL,
    createReducerOptions: {
      allowedURLQueryKeys: router.allowedURLQueryKeys,
    },
    queryClient,
    windowApi: platformAPI.window,
    getTitle,
  }).then((store) => {
    hydrateRoot(
      container,
      <StrictMode>
        <AppLoggerContext.Provider value={appLogger}>
          <PlatformAPIContext.Provider value={platformAPI}>
            <SessionContext.Provider value={session}>
              <ReduxStoreProvider
                store={store}
                serverState={window.__initialRouterState}
                context={RouterReduxContext}
              >
                <CSSProvider cssProviderStore={cssProviderStore}>
                  <ConfigContext.Provider value={config}>
                    <QueryClientProvider client={queryClient}>
                      <Shell
                        assets={window.__staticResourcesPathMapping}
                        publicPath={config.publicPath}
                        session={session}
                        state={store.getState()}
                        clientApplicationConfig={config}
                        onRender={() => {
                          afterAppRendered({ config, logger: appLogger });
                          onAppRenderedHandler?.();

                          const appContext = store.getState().appContext;

                          platformAPI.window.setTitle(
                            getTitle({
                              queryClient,
                              page: appContext.page,
                              URLQueryParams: appContext.URLQueryParams,
                            }),
                          );
                        }}
                        mainComp={MainComp}
                      />
                    </QueryClientProvider>
                  </ConfigContext.Provider>
                </CSSProvider>
              </ReduxStoreProvider>
            </SessionContext.Provider>
          </PlatformAPIContext.Provider>
        </AppLoggerContext.Provider>
      </StrictMode>,
      {
        onRecoverableError: (...args) => {
          onRecoverableErrorHandler?.(...args);
          devConsoleLog('onRecoverableError', args);
        },
      },
    );
  });
};
