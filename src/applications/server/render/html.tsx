import { clientApplicationConfig, serverApplicationConfig } from 'config/generator/server';
import { Provider as ReduxStoreProvider } from 'react-redux';
import { APPLICATION_CONFIG_VAR_NAME } from 'config/generator/shared';
import { App } from 'ui/main/app';
import { AssetsData } from '../utils/assets';
import { getFullPath } from './utils';
import { QueryClient, QueryClientProvider } from 'react-query';
import { StrictMode } from 'react';
import { ConfigContext } from 'config/react';
import { AppState } from 'core/store/types';
import { Store } from 'redux';

const publicPath = serverApplicationConfig.publicPath;

type Props = {
  store: Store<AppState>;
  assets: AssetsData;
  polyfillsSourceCode: string;
};
export function Html(props: Props) {
  const { assets, polyfillsSourceCode, store } = props;
  const inlineScript = `
    var ${APPLICATION_CONFIG_VAR_NAME} = ${JSON.stringify(clientApplicationConfig)};\
    var initialState = ${JSON.stringify(store.getState())
      // http://timelessrepo.com/json-isnt-a-javascript-subset
      .replace(/\u2028|\u2029/g, (c) => (c === '\u2028' ? '\\u2028' : '\\u2029'))
      // https://github.com/reduxjs/redux/blob/master/docs/recipes/ServerRendering.md#security-considerations
      .replace(/</g, '\\u003c')};\
    ${props.assets.inlineContent}
  `;
  const reactPath = getFullPath({
    pathMapping: assets.pathMapping,
    chunkName: 'react',
    resourceType: 'js',
    publicPath,
  });
  const appPath = getFullPath({
    pathMapping: assets.pathMapping,
    chunkName: 'app',
    resourceType: 'js',
    publicPath,
  });
  const vendorPath = getFullPath({
    pathMapping: assets.pathMapping,
    chunkName: 'vendor',
    resourceType: 'js',
    publicPath,
  });
  const infrastructurePath = getFullPath({
    pathMapping: assets.pathMapping,
    chunkName: 'infrastructure',
    resourceType: 'js',
    publicPath,
  });
  const libPath = getFullPath({
    pathMapping: assets.pathMapping,
    chunkName: 'lib',
    resourceType: 'js',
    publicPath,
  });
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        suspense: true,
      },
    },
  });
  // const dehydratedQueryClientState = dehydrate(queryClient);

  return (
    <html lang="en" dir="ltr" style={{ height: '100%' }}>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>
        <div id="app">
          <StrictMode>
            <ReduxStoreProvider store={store}>
              <ConfigContext.Provider value={serverApplicationConfig}>
                <QueryClientProvider client={queryClient}>
                  <App renderCallback={() => console.log('renderered')} />
                </QueryClientProvider>
              </ConfigContext.Provider>
            </ReduxStoreProvider>
          </StrictMode>
        </div>
        {/**
         * Actually, there should be a hydration process for react-query like
         * <HydrateReactQuery state={state_from_render}><App /></HydrateReactQuery>
         * <script
         *  dangerouslySetInnerHTML={{ __html: `var prefetched_data = ${JSON.stringify(state_from_render}`)}}
         * />
         *
         * But, with the React 18 streaming API we can not get it from the render process,
         * cause current HTML component will be send by chuncks.
         *
         * So, will be waiting for any ideas from the React team.
         */}
        <script dangerouslySetInnerHTML={{ __html: inlineScript }} />
        <script dangerouslySetInnerHTML={{ __html: polyfillsSourceCode }} />
        <script src={reactPath} />
        <script src={appPath} />
        <script src={infrastructurePath} />
        <script src={libPath} />
        <script src={vendorPath} />
      </body>
    </html>
  );
}
