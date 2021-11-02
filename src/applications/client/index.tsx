import ReactDOM from 'react-dom';
import { Provider as ReduxStoreProvider } from 'react-redux';
import { App } from 'ui/main/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { FC, StrictMode } from 'react';
import { ConfigContext } from 'config/react';
import { getClientApplicationConfig } from 'config/generator/client';
import { restoreStore } from './store';
import { createServices } from 'core/services';
import { createRequest } from 'infrastructure/request';
import { ServiceContext } from 'core/services/shared/context';
import { createWindowApi } from 'core/platform/window/client';
import { createCookieAPI } from 'core/platform/cookie/client';
import { createPlatformAPI } from 'core/platform';
import { PlatformAPIContext } from 'core/platform/shared/context';
import { defaultQueryOptions } from 'infrastructure/query/defaultOptions';
import { Store } from 'redux';
import { AppState } from 'core/store/types';
import { CSSClientProviderStore } from 'infrastructure/css/provider/clientStore';
import { CSSProvider } from 'infrastructure/css/provider';
import { afterAppRendered } from './utils/afterAppRendered';
import { SessionContext } from 'core/session/context';
import { createClientSessionObject } from './utils/createClientSessionObject';
import { ToastController } from 'ui/kit/toast/infrastructure/controller';
import { ToastControllerContext } from 'ui/kit/toast/infrastructure/context';

const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions,
});

const cssProviderStore = new CSSClientProviderStore();

// @TODO_AFTER_REACT_18_RELEASE remove as any
const container = document.getElementById('app');

const config = getClientApplicationConfig();

const requester = createRequest({
  networkTimeout: config.networkTimeout,
});
const services = createServices({
  requester,
  config: {
    hackerNewsAPIURL: config.hackerNewsAPIURL,
  },
});
const platformAPI = createPlatformAPI({
  envSpecificAPIs: {
    window: createWindowApi(window),
    cookies: createCookieAPI(),
  },
});
const session = createClientSessionObject();
const toastController = new ToastController();

const Application: FC<{ store: Store<AppState> }> = ({ store }) => (
  <PlatformAPIContext.Provider value={platformAPI}>
    <SessionContext.Provider value={session}>
      <ServiceContext.Provider value={services}>
        <ReduxStoreProvider store={store}>
          <ConfigContext.Provider value={config}>
            <QueryClientProvider client={queryClient}>
              <CSSProvider cssProviderStore={cssProviderStore}>
                <ToastControllerContext.Provider value={toastController}>
                  <App renderCallback={() => afterAppRendered(config)} />
                </ToastControllerContext.Provider>
              </CSSProvider>
            </QueryClientProvider>
          </ConfigContext.Provider>
        </ReduxStoreProvider>
      </ServiceContext.Provider>
    </SessionContext.Provider>
  </PlatformAPIContext.Provider>
);

// @TODO just for a strict mode testing
if (location.search.includes('strict')) {
  restoreStore({ toastController }).then((store) => {
    (ReactDOM as any).hydrateRoot(
      container,
      <StrictMode>
        <Application store={store} />
      </StrictMode>,
    );
  });
} else {
  restoreStore({ toastController }).then((store) => {
    (ReactDOM as any).hydrateRoot(container, <Application store={store} />);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded');
});
