import {
  DefaultOptions as DefaultReactQueryOptions,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import express from 'express';
import { StrictMode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { Provider as ReduxStoreProvider } from 'react-redux';
import { Store } from 'redux';

import { Shell } from 'framework/applications/shell';
import { ConfigContext } from 'framework/config/react';
import { BaseApplicationConfig } from 'framework/config/types';
import { CSSProvider } from 'framework/infrastructure/css/provider';
import { CSSServerProviderStore } from 'framework/infrastructure/css/provider/serverStore';
import { AppLogger } from 'framework/infrastructure/logger';
import { AppLoggerContext } from 'framework/infrastructure/logger/react/context';
import { createPlatformAPI } from 'framework/infrastructure/platform';
import { createCookieAPI } from 'framework/infrastructure/platform/cookie/server';
import { PlatformAPIContext } from 'framework/infrastructure/platform/shared/context';
import { createWindowApi } from 'framework/infrastructure/platform/window/server';
import { defaultQueryOptions } from 'framework/infrastructure/query/defaultOptions';
import { RaiseErrorContext } from 'framework/infrastructure/raise/react/context';
import { createRaiseErrorStore } from 'framework/infrastructure/raise/store';
import { RouterReduxContext } from 'framework/infrastructure/router/redux/store/context';
import {
  AnyAppContext,
  AnyAppState,
  AnyPage,
  ServerRouter,
} from 'framework/infrastructure/router/types';
import { SessionContext } from 'framework/infrastructure/session/context';
import { createJSResourcePathGetter } from 'framework/infrastructure/webpack/getFullPathForStaticResource';

import { restoreStore } from './store';
import { GetMetadata } from './types';
import { AssetsData, readAssetsInfo, readPageDependenciesStats } from './utils/assets';
import { createOnFinishHadler } from './utils/createOnFinishHadler';
import { createServerSessionObject } from './utils/createServerSessionObject';
import { generateShell } from './utils/generateShell';
import { ReactStreamRenderEnhancer } from './utils/reactStreamRenderEnhancer';

const assetsInfoPromise = readAssetsInfo();
const pageDependenciesStatsPromise = readPageDependenciesStats();

const SERVER_RENDER_ABORT_TIMEOUT = 10000;

/**
 * All code is based on https://github.com/facebook/react/blob/master/packages/react-dom/src/server/ReactDOMFizzServerNode.js
 * And https://github.com/reactwg/react-18/discussions/37
 */
type Params<Page extends AnyPage<string>> = {
  /**
   * All methods and configs for a router on a server side
   */
  router: ServerRouter;
  /**
   * React entry point
   */
  MainComp: React.ReactNode;
  /**
   * This config is used during server side lifecycle of the application
   */
  serverApplicationConfig: BaseApplicationConfig;
  /**
   * This config is stored in output HTML
   */
  clientApplicationConfig: BaseApplicationConfig;
  /**
   * Just a logger, which follows AppLogger interface
   */
  appLogger: AppLogger;
  /**
   * An async function, which generates needed metadata
   */
  getMetadata: GetMetadata<Page>;
  /**
   * A sync function, which returns a static HTML for a error page for the case
   * when the problem occured outside of a React scope, or it is a shellError
   */
  onErrorFallbackHTML: (error?: Error) => string;
  /**
   * Default options for react-query
   */
  defaultReactQueryOptions?: DefaultReactQueryOptions;
};

/**
 * Creates an express handler, which serves an application
 */
export const createApplicationRouteHandler =
  <Page extends AnyPage<string>>({
    MainComp,
    router,
    serverApplicationConfig,
    clientApplicationConfig,
    appLogger,
    defaultReactQueryOptions,
    getMetadata,
    onErrorFallbackHTML,
  }: Params<Page>): express.Handler =>
  (req, res) => {
    const { parseURL, compileURL, allowedURLQueryKeys, initialAppContext } = router;
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-XSS-Protection', '1');
    res.set('X-Frame-Options', 'deny');

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

    const storePromise = restoreStore<Page>({
      req,
      res,
      compileAppURL: compileURL,
      parseURL,
      initialAppContext,
      createReducerOptions: {
        allowedURLQueryKeys,
      },
    });

    Promise.all<
      [
        Promise<Store<AnyAppState<AnyAppContext<Page>>>>,
        Promise<AssetsData>,
        Promise<{ [pageChunkName: string]: string[] }>,
      ]
    >([storePromise, assetsInfoPromise, pageDependenciesStatsPromise])
      .then(([store, assetsInfo, dependencyStats]) => {
        const state = store.getState();
        const compiledUrl = compileURL(state.appContext);

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
          const cssProviderStore = new CSSServerProviderStore();
          const session = createServerSessionObject(req, res);

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
              <AppLoggerContext.Provider value={appLogger}>
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
              </AppLoggerContext.Provider>
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

                const onFinishHandler = createOnFinishHadler({
                  res,
                  queryClient,
                  renderTimeoutId,
                });

                /*
                 * onShellReady do not need correct title and description
                 * Cause they will be replaced on a client side
                 * And the main aim here is to start streamming as soon as possible
                 */
                if (reactSSRMethodName === 'onShellReady') {
                  res.write(
                    generateShell({
                      metadata: {
                        title: 'Title',
                        description: 'Description',
                      },
                      dependencyScript: pageDependenciesScriptTags,
                    }),
                  );

                  pipeableStream
                    .pipe(new ReactStreamRenderEnhancer(res, queryClient, cssProviderStore))
                    .once('finish', onFinishHandler);
                  return;
                }

                const appContext = store.getState().appContext;

                /**
                 * onCompleteAll will be used for search bots only in the future
                 * They can not execute any JS, so, there is no any reason to send
                 * dehydrated data and critical css (which is in a JS wrapper)
                 */
                getMetadata({
                  queryClient,
                  page: appContext.page,
                  URLQueryParams: appContext.URLQueryParams,
                })
                  .then((metadata) => {
                    res.write(
                      generateShell({
                        metadata,
                        dependencyScript: pageDependenciesScriptTags,
                      }),
                    );

                    pipeableStream.pipe(res).once('finish', onFinishHandler);
                  })
                  .catch((error) => {
                    // @TODO log that error too
                    console.log('CATCH getMetadata');

                    res.send(onErrorFallbackHTML(error));
                  });
              },

              /**
               * If there is an error while generating the shell,
               * both onError and onShellError will fire.
               * onShellError is used to send the fallback HTML document
               *
               * Shell contains all compontens from the root to the closest <Suspense />
               * Everything inside that <Suspense /> is not a part of the shell.
               *
               * More info https://beta.reactjs.org/reference/react-dom/server/renderToPipeableStream#recovering-from-errors-outside-the-shell
               */
              onShellError(error) {
                /**
                 * Something errored before we could complete the shell,
                 * so we emit an alternative shell.
                 */
                res.status(500);
                console.error('onErrorShell: ', error);

                if (renderTimeoutId) {
                  clearTimeout(renderTimeoutId);
                }

                res.setHeader('content-type', 'text/html');
                res.send(onErrorFallbackHTML(error as Error));
              },

              /**
               * If there is an error while generating the shell,
               * both onError and onShellError will fire.
               * onError is used for error reporting only
               */
              onError(error) {
                didError = true;
                console.error('onError: ', error);

                if (renderTimeoutId) {
                  clearTimeout(renderTimeoutId);
                }

                // Need to log a error
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
      })
      .catch((error) => {
        res.status(500);
        res.setHeader('content-type', 'text/html');

        // Need to log a error
        res.send(onErrorFallbackHTML(error));
      });
  };
