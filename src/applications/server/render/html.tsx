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
import { Services } from 'core/services';
import { ServiceContext } from 'core/services/shared/context';
import { PlatformAPI } from 'core/platform';
import { PlatformAPIContext } from 'core/platform/shared/context';
import { popoverContainerId } from 'ui/kit/popover/shared';

const publicPath = serverApplicationConfig.publicPath;

type Props = {
  store: Store<AppState>;
  assets: AssetsData;
  polyfillsSourceCode: string;
  services: Services;
  platformAPI: PlatformAPI;
  queryClient: QueryClient;
};
export function Html(props: Props) {
  const { assets, polyfillsSourceCode, store, services, platformAPI, queryClient } = props;
  const inlineScript = `
    var ${APPLICATION_CONFIG_VAR_NAME} = ${JSON.stringify(clientApplicationConfig)};\
    var initialState = ${JSON.stringify(store.getState())
      // http://timelessrepo.com/json-isnt-a-javascript-subset
      .replace(/\u2028|\u2029/g, (c) => (c === '\u2028' ? '\\u2028' : '\\u2029'))
      // https://github.com/reduxjs/redux/blob/master/docs/recipes/ServerRendering.md#security-considerations
      .replace(/</g, '\\u003c')};\
    ${props.assets.inlineContent}
  `;
  // @EXPERIMENT_REACT_bootstrapScripts
  // const reactPath = getFullPath({
  //   pathMapping: assets.pathMapping,
  //   chunkName: 'react',
  //   resourceType: 'js',
  //   publicPath,
  // });
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

  return (
    // @TODO add correct lang
    <html lang="en" dir="ltr" style={{ height: '100%' }}>
      <head>
        <meta charSet="utf-8" />
        <style
          dangerouslySetInnerHTML={{
            __html: `html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0;min-height:100vh;min-height:-webkit-fill-available;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Ubuntu,sans-serif;min-width:360px;width:100%}h1,h2,h3,h4{margin:0}@supports(-webkit-touch-callout:none){body{height:-webkit-fill-available}}body,button,html,input{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,hr,input{overflow:visible}button,select{text-transform:none}[type=button],[type=submit],button{-webkit-appearance:button}fieldset{border:none;margin:0;padding:0}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}[hidden],template{display:none}`,
          }}
        />
      </head>
      <body style={{ position: 'relative' }}>
        <div id="app">
          <StrictMode>
            <PlatformAPIContext.Provider value={platformAPI}>
              <ServiceContext.Provider value={services}>
                <ReduxStoreProvider store={store}>
                  <ConfigContext.Provider value={serverApplicationConfig}>
                    <QueryClientProvider client={queryClient}>
                      <App renderCallback={() => console.log('renderered')} />
                    </QueryClientProvider>
                  </ConfigContext.Provider>
                </ReduxStoreProvider>
              </ServiceContext.Provider>
            </PlatformAPIContext.Provider>
          </StrictMode>
        </div>
        <div
          id={popoverContainerId}
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            width: '100vw',
            minHeight: '100%',
            top: 0,
            left: 0,
          }}
        />

        <script dangerouslySetInnerHTML={{ __html: inlineScript }} />
        <script dangerouslySetInnerHTML={{ __html: polyfillsSourceCode }} />
        {/* @EXPERIMENT_REACT_bootstrapScripts React is fetched by react itself via bootstrapScripts */}
        {/* <script src={reactPath} async /> */}
        <script src={appPath} async />
        <script src={infrastructurePath} async />
        <script src={libPath} async />
        <script src={vendorPath} async />
      </body>
    </html>
  );
}
