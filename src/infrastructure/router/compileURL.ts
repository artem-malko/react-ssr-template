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
  /**
   * routes is a map of pageName to a route config for that page,
   * but it does not have prepared [toPath function](https://github.com/pillarjs/path-to-regexp#compile-reverse-path-to-regexp)
   * So, we need to prepare such function
   */
  const routeConfigToPageNameMap = keysOf(routes).reduce<
    Record<
      string,
      Route<RouteParams<any>, AnyPage<PageName>> & {
        transformPageToPath: PathFunction;
      }
    >
  >((mutableResult, pageName) => {
    const routeConfig = routes[pageName];

    mutableResult[pageName] = {
      ...routeConfig,
      transformPageToPath: compile(routeConfig.path, { encode: encodeURIComponent }),
    };
    return mutableResult;
  }, {});

  return (appContext: AnyAppContext) => {
    const routeConfigForPage = routeConfigToPageNameMap[appContext.page.name];

    // It is not possible, actually
    // But we will check to prevent any runtime errors
    if (!routeConfigForPage) {
      // @TODO add default redirect to createCompile params
      return '/';
    }

    // If there is no matchPageToPathParams stringifyParams will be used
    // to transform page params to a string
    const paramsForPath = routeConfigForPage.matchPageToPathParams
      ? routeConfigForPage.matchPageToPathParams(appContext.page.params)
      : stringifyParams(appContext.page.params);
    // The same flow for a query string
    const paramsForQuery = routeConfigForPage.matchPageToQueryParams
      ? routeConfigForPage.matchPageToQueryParams(appContext.page.params)
      : {};

    const compiledPath = routeConfigForPage.transformPageToPath(paramsForPath);
    /**
     * Interesting moment, appContext.URLQueryParams collects all query params
     * from the current URL
     * But matchPageToQueryParams can override it with a new value
     * Its important, that matchPageToQueryParams has to override full URLQueryParam array from
     * the appContext
     * Let's imagine the simple situation:
     * appContext.URLQueryParams has { paramName: [value1, value2] }
     * paramsForQuery has { paramName: [value1] }, but does not have value2
     * If we will merge with arrays via deep merge, we will have { paramName: [value1, value2] }
     * But matchPageToQueryParams returns another result. So, we will have wrong result here
     */
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

/**
 * compile a raw query string from URLQueryParams
 * queryStringParams like:
 * {
 *   param_1: [value_1],
 *   param_2: [value_2, value_3],
 *   param_3: ['']
 * }
 * will be compiled to
 * param_1=value_1&param_2=value_2&param_2=value_3&param_3
 *
 * Every value will be encoded via encodeURIComponent
 */
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
