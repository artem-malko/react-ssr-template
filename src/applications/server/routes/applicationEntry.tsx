import { Writable } from 'node:stream';
import express from 'express';
import { Store } from 'redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppState } from 'core/store/types';
import { compileAppURL } from 'ui/main/routing';
import { restoreStore } from '../store';
import { AssetsData, readAssetsInfo, readPageDependenciesStats } from '../utils/assets';
import { getAllPolyfillsSourceCode } from '../utils/getPolyfills';
import { createRequest } from 'infrastructure/request';
import { createServices } from 'core/services';
import { createWindowApi } from 'core/platform/window/server';
import { createCookieAPI } from 'core/platform/cookie/server';
import { clientApplicationConfig, serverApplicationConfig } from 'config/generator/server';
import { createPlatformAPI } from 'core/platform';
import { defaultQueryOptions } from 'infrastructure/query/defaultOptions';
import { CSSServerProviderStore } from 'infrastructure/css/provider/serverStore';
import { ReactStreamRenderEnhancer } from '../utils/reactStreamRenderEnhancer';
import { createJSResourcePathGetter } from 'infrastructure/webpack/getFullPathForStaticResource';
import { createServerSessionObject } from '../utils/createServerSessionObject';
import { StrictMode } from 'react';
import { PlatformAPIContext } from 'core/platform/shared/context';
import { SessionContext } from 'core/session/context';
import { ServiceContext } from 'core/services/shared/context';
import { Provider as ReduxStoreProvider } from 'react-redux';
import { ConfigContext } from 'config/react';
import { CSSProvider } from 'infrastructure/css/provider';
import { Application } from 'applications/application';
import { ApplicationContainerId } from 'config/constants';
import { generateHead } from '../utils/generateHead';

// @TODO_AFTER_REACT_18_RELEASE move to correct import
// All code is based on https://github.com/facebook/react/blob/master/packages/react-dom/src/server/ReactDOMFizzServerNode.js
// And https://github.com/reactwg/react-18/discussions/37
const { renderToPipeableStream } = require('react-dom/server');

const assetsInfoPromise = readAssetsInfo();
const pageDependenciesStatsPromise = readPageDependenciesStats();

const SERVER_RENDER_ABORT_TIMEOUT = 10000;

export const createApplicationRouter: () => express.Handler = () => (req, res) => {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-XSS-Protection', '1');
  res.set('X-Frame-Options', 'deny');

  const polyfillsSourceCode = getAllPolyfillsSourceCode(req);

  // @TODO
  res.socket?.on('error', (error) => {
    // Log fatal errors
    console.error('Fatal', error);
  });

  let didError = false;

  // @JUST_FOR_TEST
  const forcedToUseOnComplete = req.query['render'] === 'useOnComplete';

  /**
   * For SEO specifically, where the correct status code is extra important,
   * you can use onCompleteAll instead of onReadyToStream as the place
   * where you flush the stream. By that point, you'll definitely know if it errored or not.
   * However, that also delays when you start giving content to the bot,
   * and giving it earlier may give you better rankings due to perf.
   */
  const onCompleteAll = req.isSearchBot;
  const reactSSRMethodName =
    forcedToUseOnComplete || onCompleteAll ? 'onCompleteAll' : 'onCompleteShell';

  const storePromise = restoreStore(req, res);

  Promise.all<
    [Promise<Store<AppState>>, Promise<AssetsData>, Promise<{ [pageChunkName: string]: string[] }>]
  >([storePromise, assetsInfoPromise, pageDependenciesStatsPromise]).then(
    ([store, assetsInfo, dependencyStats]) => {
      const state = store.getState();
      const compiledUrl = compileAppURL(state.appContext);
      const status = state.appContext.page.errorCode ? state.appContext.page.errorCode : 200;

      if (status === 200 && req.url !== '/' && compiledUrl !== req.url.replace(/\/$/, '')) {
        if (process.env.NODE_ENV === 'development') {
          console.log('--------');
          console.log('REDIRECT');
          console.log('Requested  URL: ', req.url.replace(/\/$/, ''));
          console.log('Compiled   URL: ', compiledUrl);
          console.log('New appContext: ', state.appContext);
          console.log('--------');
        }
        res.redirect(301, compiledUrl);
      } else {
        const requester = createRequest({
          networkTimeout: serverApplicationConfig.networkTimeout,
        });
        const services = createServices({
          requester,
          config: {
            hackerNewsAPIURL: serverApplicationConfig.hackerNewsAPIURL,
          },
        });
        const platformAPI = createPlatformAPI({
          envSpecificAPIs: {
            cookies: createCookieAPI(req, res),
            window: createWindowApi(),
          },
        });
        const publicPath = serverApplicationConfig.publicPath;

        /**
         * Required assets for the application start
         */
        const getFullPathForJSFile = createJSResourcePathGetter({
          staticResourcesPathMapping: assetsInfo.pathMapping,
          publicPath,
        });
        const reactPath = getFullPathForJSFile('react');
        const appPath = getFullPathForJSFile('app');
        const vendorPath = getFullPathForJSFile('vendor');
        const infrastructurePath = getFullPathForJSFile('infrastructure');
        const libPath = getFullPathForJSFile('lib');
        const rarelyPath = getFullPathForJSFile('rarely');

        const queryClient = new QueryClient({
          defaultOptions: defaultQueryOptions,
        });
        const cssProviderStore = new CSSServerProviderStore();
        const session = createServerSessionObject(req);

        /**
         * Each page has its own components, which can be loaded via dynamic import and React.lazy
         * These components can have its own children, which are loaded via dynamic import too.
         * So, you wait for the first import(), the next import() inside the first one will be delayed.
         * And so on.
         * The result will be like this:
         * comp loading ---- finished
         *                            childComp loading ----- finished
         *                                                             granChildComp loading ----- finished
         * As you can see, we had to wait to much time to load the last dynamic component.
         * To prevent this, all dependencies of the current page will be preloaded via async script
         *
         * As a result you will see something like this:
         * comp loading ---- finished
         * childComp loading ----- finished
         * granChildComp loading ----- finished
         *
         * Much better!
         * More info is here https://github.com/reactwg/react-18/discussions/114
         */
        const pageDependencies = dependencyStats[`${state.appContext.page.name}Page`] || [];
        const pageDependenciesScriptTags = pageDependencies
          .map(
            /**
             * onerror is used to fix a bug with webpack and async preloading of dynamic JS-files
             * More info: https://github.com/webpack/webpack/issues/14874
             */
            (depPath) => `<script src="${publicPath}${depPath}" async onerror="this.remove()"></script>`,
          )
          .join('');

        let renderTimeoutId: NodeJS.Timeout | undefined = undefined;

        const pipeableStream = renderToPipeableStream(
          <StrictMode>
            <PlatformAPIContext.Provider value={platformAPI}>
              <SessionContext.Provider value={session}>
                <ServiceContext.Provider value={services}>
                  <ReduxStoreProvider store={store}>
                    <ConfigContext.Provider value={serverApplicationConfig}>
                      <QueryClientProvider client={queryClient}>
                        <CSSProvider cssProviderStore={cssProviderStore}>
                          <Application
                            polyfillsSourceCode={polyfillsSourceCode}
                            publicPath={publicPath}
                            assets={{
                              inlineContent: assetsInfo.inlineContent,
                              pathMapping: assetsInfo.pathMapping,
                            }}
                            store={store}
                            session={session}
                            clientApplicationConfig={clientApplicationConfig}
                          />
                        </CSSProvider>
                      </QueryClientProvider>
                    </ConfigContext.Provider>
                  </ReduxStoreProvider>
                </ServiceContext.Provider>
              </SessionContext.Provider>
            </PlatformAPIContext.Provider>
          </StrictMode>,
          {
            bootstrapScripts: [reactPath, appPath, vendorPath, infrastructurePath, libPath, rarelyPath],
            [reactSSRMethodName]() {
              // If something errored before we started streaming, we set the error code appropriately.
              res.status(didError ? 500 : 200);
              res.setHeader('Content-type', 'text/html');
              // We will send main shell like html>head+body before react starts to stream
              // to allow adding styles and scripts to the existed dom
              res.write(
                `<!DOCTYPE html><html lang="en" dir="ltr" style="height:100%">${generateHead()}<body style="position:relative">${pageDependenciesScriptTags}<div id="${ApplicationContainerId}">`,
              );

              /**
               * onCompleteAll will be used for search bots only in the future
               * They can not execute any JS, so, there is no any reason to send
               * dehydrated data and critical css (which is in a JS wrapper)
               */
              const stream: Writable =
                reactSSRMethodName === 'onCompleteAll'
                  ? pipeableStream.pipe(res)
                  : pipeableStream.pipe(
                      new ReactStreamRenderEnhancer(res, queryClient, cssProviderStore),
                    );

              stream.once('finish', () => {
                if (renderTimeoutId) {
                  clearTimeout(renderTimeoutId);
                }

                /**
                 * Actually, it is not necessary to call res.end manually,
                 * cause React does this by itself
                 *
                 * But, if we have any wrapper on res, we can not be sure,
                 * that wrapper implements all needed methods (especially _final)
                 * So, the `end` method will be called manually, if writable has not been ended yet.
                 */
                if (!res.writableEnded) {
                  res.end();
                }
              });
            },

            // @TODO looks quite silly, need to refactor it
            onError(error: Error) {
              didError = true;
              console.error(error);
              pipeableStream.abort();

              if (renderTimeoutId) {
                clearTimeout(renderTimeoutId);
              }
            },
          },
        );

        /**
         * Abort current pipeableStream and switch to client rendering
         * if enough time passed but server rendering has not been finished yet
         */
        renderTimeoutId = setTimeout(() => {
          pipeableStream.abort();
        }, SERVER_RENDER_ABORT_TIMEOUT);
      }
    },
  );
};
