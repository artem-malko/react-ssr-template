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

const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions,
});

const cssProviderStore = new CSSClientProviderStore();

// @TODO_AFTER_REACT_18_RELEASE remove as any
const container = document.getElementById('app');

const config = getClientApplicationConfig();

/**
 * Actually, there should be a rehydration process for react-query like
 * <RehydrateReactQuery state={state_from_html}><App /></RehydrateReactQuery>
 *
 * But, with the React 18 streaming API we can not get it from HTML,
 * cause we can not prepare in on the server side.
 * So, will be waiting for any ideas from the React team.
 */

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

const Application: FC<{ store: Store<AppState> }> = ({ store }) => (
  <PlatformAPIContext.Provider value={platformAPI}>
    <ServiceContext.Provider value={services}>
      <ReduxStoreProvider store={store}>
        <ConfigContext.Provider value={config}>
          <QueryClientProvider client={queryClient}>
            <CSSProvider cssProviderStore={cssProviderStore}>
              <App renderCallback={() => afterAppRendered(config)} />
            </CSSProvider>
          </QueryClientProvider>
        </ConfigContext.Provider>
      </ReduxStoreProvider>
    </ServiceContext.Provider>
  </PlatformAPIContext.Provider>
);

if (location.search.includes('strict')) {
  restoreStore().then((store) => {
    (ReactDOM as any).hydrateRoot(
      container,
      <StrictMode>
        <Application store={store} />
      </StrictMode>,
    );
  });
} else {
  restoreStore().then((store) => {
    (ReactDOM as any).hydrateRoot(container, <Application store={store} />);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('ONLOSD');
});
