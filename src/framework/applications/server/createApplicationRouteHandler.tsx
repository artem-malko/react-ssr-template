import { Writable } from 'node:stream';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import express from 'express';
import { StrictMode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { Provider as ReduxStoreProvider } from 'react-redux';
import { AnyAction, Store } from 'redux';

import { Shell } from 'framework/applications/shell';
import { ConfigContext } from 'framework/config/react';
import { BaseApplicationConfig } from 'framework/config/types';
import { ApplicationContainerId } from 'framework/constants/application';
import { CSSProvider } from 'framework/infrastructure/css/provider';
import { CSSServerProviderStore } from 'framework/infrastructure/css/provider/serverStore';
import { defaultQueryOptions } from 'framework/infrastructure/query/defaultOptions';
import { RaiseErrorContext } from 'framework/infrastructure/raise/react/context';
import { createRaiseErrorStore } from 'framework/infrastructure/raise/store';
import { RouterReduxContext } from 'framework/infrastructure/router/redux/store/context';
import { AnyAppContext, AnyAppState } from 'framework/infrastructure/router/types';
import { createJSResourcePathGetter } from 'framework/infrastructure/webpack/getFullPathForStaticResource';
import { createPlatformAPI } from 'framework/platform';
import { createCookieAPI } from 'framework/platform/cookie/server';
import { PlatformAPIContext } from 'framework/platform/shared/context';
import { createWindowApi } from 'framework/platform/window/server';
import { SessionContext } from 'framework/session/context';

import { restoreStore } from './store';
import { AssetsData, readAssetsInfo, readPageDependenciesStats } from './utils/assets';
import { createServerSessionObject } from './utils/createServerSessionObject';
import { generateHead } from './utils/generateHead';
import { ReactStreamRenderEnhancer } from './utils/reactStreamRenderEnhancer';

const assetsInfoPromise = readAssetsInfo();
const pageDependenciesStatsPromise = readPageDependenciesStats();

const SERVER_RENDER_ABORT_TIMEOUT = 10000;

/**
 * All code is based on https://github.com/facebook/react/blob/master/packages/react-dom/src/server/ReactDOMFizzServerNode.js
 * And https://github.com/reactwg/react-18/discussions/37
 */
type Params = {
  parseURL: (URL: string) => AnyAction[];
  compileAppURL: (appContext: AnyAppContext) => string;
  MainComp: React.ReactNode;
  serverApplicationConfig: BaseApplicationConfig;
  clientApplicationConfig: BaseApplicationConfig;
  initialAppContext: AnyAppContext;
};
export const createApplicationRouteHandler: (params: Params) => express.Handler =
  ({
    parseURL,
    compileAppURL,
    MainComp,
    serverApplicationConfig,
    clientApplicationConfig,
    initialAppContext,
  }) =>
  (req, res) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-XSS-Protection', '1');
    res.set('X-Frame-Options', 'deny');

    // @TODO
    res.socket?.on('error', (error) => {
      // Log fatal errors
      console.error('Fatal', error);
    });

    let didError = false;

    // @JUST_FOR_TEST
    const forcedToOnAllReadyRender = req.query['render'] === 'onAllReady';

    /**
     * For SEO specifically, where the correct status code is extra important,
     * you can use onAllReady instead of onReadyToStream as the place
     * where you flush the stream. By that point, you'll definitely know if it errored or not.
     * However, that also delays when you start giving content to the bot,
     * and giving it earlier may give you better rankings due to perf.
     */
    const useOnAllReadyRender = req.isSearchBot;
    const reactSSRMethodName =
      forcedToOnAllReadyRender || useOnAllReadyRender ? 'onAllReady' : 'onShellReady';

    const storePromise = restoreStore({ req, res, compileAppURL, parseURL, initialAppContext });

    Promise.all<
      [Promise<Store<AnyAppState>>, Promise<AssetsData>, Promise<{ [pageChunkName: string]: string[] }>]
    >([storePromise, assetsInfoPromise, pageDependenciesStatsPromise]).then(
      ([store, assetsInfo, dependencyStats]) => {
        const state = store.getState();
        const compiledUrl = compileAppURL(state.appContext);

        if (req.url !== '/' && compiledUrl !== req.url.replace(/\/$/, '')) {
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
          const errorRiseStore = createRaiseErrorStore();
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
          const frameworkPath = getFullPathForJSFile('framework');
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
           *
           * You can manage, what should be preloaded via file name.
           * Checkout isNeededToBePreloaded function for more info
           */
          const pageDependencies = dependencyStats[`${state.appContext.page.name}Page`] || [];
          const pageDependenciesScriptTags = pageDependencies
            .map(
              /**
               * onerror is used to fix a bug with webpack and async preloading of dynamic JS-files
               * More info: https://github.com/webpack/webpack/issues/14874
               */
              (depPath) =>
                `<script src="${publicPath}${depPath}" async onerror="this.remove()"></script>`,
            )
            .join('');

          let renderTimeoutId: NodeJS.Timeout | undefined = undefined;

          const pipeableStream = renderToPipeableStream(
            <StrictMode>
              <PlatformAPIContext.Provider value={platformAPI}>
                <SessionContext.Provider value={session}>
                  <ReduxStoreProvider store={store} context={RouterReduxContext}>
                    <ConfigContext.Provider value={serverApplicationConfig}>
                      <QueryClientProvider client={queryClient}>
                        <CSSProvider cssProviderStore={cssProviderStore}>
                          <RaiseErrorContext.Provider value={errorRiseStore}>
                            <Shell
                              publicPath={publicPath}
                              assets={{
                                inlineContent: assetsInfo.inlineContent,
                                pathMapping: assetsInfo.pathMapping,
                              }}
                              state={store.getState()}
                              mainComp={MainComp}
                              session={session}
                              clientApplicationConfig={clientApplicationConfig}
                            />
                          </RaiseErrorContext.Provider>
                        </CSSProvider>
                      </QueryClientProvider>
                    </ConfigContext.Provider>
                  </ReduxStoreProvider>
                </SessionContext.Provider>
              </PlatformAPIContext.Provider>
            </StrictMode>,
            {
              bootstrapScripts: [reactPath, appPath, vendorPath, frameworkPath, libPath, rarelyPath],
              [reactSSRMethodName]() {
                /**
                 * raisedError can be set in `onAllReady` mode only
                 * In `onShellReady` raisedError is undefined,
                 * cause application is not started to render,
                 * when getRaisedError is called
                 */
                const raisedError = errorRiseStore.getRaisedError();

                /**
                 * If something errored before we started streaming,
                 * we set the error code appropriately.
                 */
                if (didError) {
                  res.status(500);
                  /**
                   * In other case we can try to read raisedError
                   */
                } else {
                  res.status(raisedError ? raisedError : 200);
                }

                res.setHeader('Content-type', 'text/html');
                /**
                 * We will send main shell like html>head+body before react starts to stream
                 * to allow adding styles and scripts to the existed dom
                 */
                res.write(
                  `<!DOCTYPE html><html lang="en" dir="ltr" style="height:100%">${generateHead()}<body style="position:relative">${pageDependenciesScriptTags}<div id="${ApplicationContainerId}">`,
                );

                /**
                 * onCompleteAll will be used for search bots only in the future
                 * They can not execute any JS, so, there is no any reason to send
                 * dehydrated data and critical css (which is in a JS wrapper)
                 */
                const stream: Writable =
                  reactSSRMethodName === 'onAllReady'
                    ? pipeableStream.pipe(res)
                    : pipeableStream.pipe(
                        new ReactStreamRenderEnhancer(res, queryClient, cssProviderStore),
                      );

                stream.once('finish', () => {
                  queryClient.clear();

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

                  /**
                   * In case you are creating the QueryClient for every request,
                   * React Query creates the isolated cache for this client,
                   * which is preserved in memory for the cacheTime period.
                   * That may lead to high memory consumption on server
                   * in case of high number of requests during that period.
                   *
                   * On the server, cacheTime defaults to Infinity
                   *  which disables manual garbage collection and will automatically clear
                   * memory once a request has finished.
                   * If you are explicitly setting a non-Infinity cacheTime
                   * then you will be responsible for clearing the cache early.
                   * https://tanstack.com/query/v4/docs/guides/ssr#high-memory-consumption-on-server
                   */
                  queryClient.clear();
                });
              },

              // @TODO looks quite silly, need to refactor it
              onShellError(error) {
                // Something errored before we could complete the shell so we emit an alternative shell.
                res.status(500);
                console.error('onErrorShell: ', error);

                if (renderTimeoutId) {
                  clearTimeout(renderTimeoutId);
                }

                /**
                 * @TODO switch to client render
                 */
                res.send(`<!doctype><p>onShellError<br/>${error}</p>`);
              },

              // @TODO looks quite silly, need to refactor it
              onError(error) {
                didError = true;
                console.error('onError: ', error);

                if (renderTimeoutId) {
                  clearTimeout(renderTimeoutId);
                }

                res.send(`<!doctype><p>onError<br/>${error}</p>`);
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
