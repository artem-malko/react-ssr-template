import { keysOf } from 'lib/lodash';
import { compile, PathFunction } from 'path-to-regexp';
import { AnyPage, AnyAppContext, URLQueryParams, Routes, Route, RouteParams } from './types';
import { stringifyParams } from './utils';

/**
 * Compile new url, which is based on the appContext
 * The main idea is to transform the AppContext version of a page to a path string
 * From
 * ```ts
 * {
 *   name: 'page',
 *   params: {
 *     id: 10,
 *   }
 * }
 * ```
 * To
 * /page/10
 *
 * If a route config does not have its own `matchPageToPathParams` function,
 * simple stringifyParams will be called
 *
 * @TODO default page path config
 */
export function createURLCompiler<PageName extends string>(routes: Routes<AnyPage<PageName>>) {
  const routeConfigToPageNameMap = keysOf(routes).reduce<
    Record<
      string,
      Route<RouteParams<any>, AnyPage<PageName>> & {
        compile: PathFunction;
      }
    >
  >((mutableResult, pageName) => {
    const routeConfig = routes[pageName];

    mutableResult[pageName] = {
      ...routeConfig,
      compile: compile(routeConfig.path, { encode: encodeURIComponent }),
    };
    return mutableResult;
  }, {});

  return (appContext: AnyAppContext) => {
    const routeConfigForPage = routeConfigToPageNameMap[appContext.page.name];

    if (!routeConfigForPage) {
      // @TODO add default redirect to createCompile params
      return '/';
    }

    const paramsForPath = routeConfigForPage.matchPageToPathParams
      ? routeConfigForPage.matchPageToPathParams(appContext.page.params)
      : stringifyParams(appContext.page.params);
    const paramsForQuery = routeConfigForPage.matchPageToQueryParams
      ? routeConfigForPage.matchPageToQueryParams(appContext.page.params)
      : {};

    const compiledPath = routeConfigForPage.compile(paramsForPath);
    const compiledQuery = compileQueryString({
      ...appContext.URLQueryParams,
      ...paramsForQuery,
    });
    const mutableParts = [compiledPath];

    if (compiledQuery) {
      mutableParts.push(`?${compiledQuery}`);
    }

    return mutableParts.join('');
  };
}
export type URLCompiler = ReturnType<typeof createURLCompiler>;

function compileQueryString(queryStringParams: URLQueryParams | undefined): string | undefined {
  if (!queryStringParams || Object.keys(queryStringParams).length === 0) {
    return undefined;
  }

  return Object.entries(queryStringParams)
    .reduce<string[]>((mutableAcc, [paramLabel, paramValue]) => {
      paramValue.forEach((v) => {
        mutableAcc.push(compileQueryParam(paramLabel, v));
      });

      return mutableAcc;
    }, [])
    .join('&');
}

function compileQueryParam(paramName: string, paramValue: string) {
  const trimmedValue = paramValue.trim();
  return trimmedValue ? `${paramName}=${encodeURIComponent(trimmedValue)}` : paramName;
}
