import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { Provider as ReduxStoreProvider } from 'react-redux';

import { Shell } from 'framework/applications/shell';
import { getClientApplicationConfig } from 'framework/config/generator/client';
import { ConfigContext } from 'framework/config/react';
import { ApplicationContainerId } from 'framework/constants/application';
import { CSSProvider } from 'framework/infrastructure/css/provider';
import { CSSClientProviderStore } from 'framework/infrastructure/css/provider/clientStore';
import { createPlatformAPI } from 'framework/infrastructure/platform';
import { createCookieAPI } from 'framework/infrastructure/platform/cookie/client';
import { PlatformAPIContext } from 'framework/infrastructure/platform/shared/context';
import { createWindowApi } from 'framework/infrastructure/platform/window/client';
import { defaultQueryOptions } from 'framework/infrastructure/query/defaultOptions';
import { RouterReduxContext } from 'framework/infrastructure/router/redux/store/context';
import { AnyAppContext } from 'framework/infrastructure/router/types';
import { SessionContext } from 'framework/infrastructure/session/context';

import { restoreStore } from './store';
import { afterAppRendered } from './utils/afterAppRendered';
import { createClientSessionObject } from './utils/createClientSessionObject';

const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions,
});

const cssProviderStore = new CSSClientProviderStore();

const container = document.getElementById(ApplicationContainerId) as Element;

const config = getClientApplicationConfig();

const platformAPI = createPlatformAPI({
  envSpecificAPIs: {
    window: createWindowApi(window),
    cookies: createCookieAPI(),
  },
});
const session = createClientSessionObject();

type Params = {
  compileAppURL: (appContext: AnyAppContext) => string;
  onAppRendered?: () => void;
  onRecoverableError?: (args: unknown) => void;
  MainComp: React.ReactNode;
};
export const startClientApplication = ({
  onAppRendered,
  onRecoverableError,
  MainComp,
  compileAppURL,
}: Params) => {
  return restoreStore({ compileAppURL }).then((store) => {
    hydrateRoot(
      container,
      <StrictMode>
        <PlatformAPIContext.Provider value={platformAPI}>
          <SessionContext.Provider value={session}>
            <ReduxStoreProvider
              store={store}
              serverState={window.__initialReduxState}
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
                        afterAppRendered(config);
                        onAppRendered?.();
                      }}
                      mainComp={MainComp}
                    />
                  </QueryClientProvider>
                </ConfigContext.Provider>
              </CSSProvider>
            </ReduxStoreProvider>
          </SessionContext.Provider>
        </PlatformAPIContext.Provider>
      </StrictMode>,
      {
        onRecoverableError: (...args) => {
          onRecoverableError?.(...args);
          console.log('args: ', args);
        },
      },
    );
  });
};
