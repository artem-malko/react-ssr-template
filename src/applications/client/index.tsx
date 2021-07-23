import ReactDOM from 'react-dom';
import { App } from 'ui/main/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { StrictMode } from 'react';
import { ConfigContext } from 'config/react';
import { getClientApplicationConfig } from 'config/generator/client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      suspense: true,
    },
  },
});

// @TODO_AFTER_REACT_18_RELEASE remove as any
const container = document.getElementById('app');
const root = (ReactDOM as any).hydrateRoot(container);

const config = getClientApplicationConfig();

/**
 * Actually, there should be a rehydration process for react-query like
 * <RehydrateReactQuery state={state_from_html}><App /></RehydrateReactQuery>
 *
 * But, with the React 18 streaming API we can not get it from HTML,
 * cause we can not prepare in on the server side.
 * So, will be waiting for any ideas from the React team.
 */
root.render(
  <StrictMode>
    <ConfigContext.Provider value={config}>
      <QueryClientProvider client={queryClient}>
        <App renderCallback={() => console.log('WOOOW, renderered')} />
      </QueryClientProvider>
    </ConfigContext.Provider>
  </StrictMode>,
);
