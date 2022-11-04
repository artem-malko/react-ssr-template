import { match, MatchFunction } from 'path-to-regexp';
import { AnyAction } from 'redux';

import { keysOf } from 'lib/lodash';

import { openAnyPageAction } from './redux/actions/appContext/openPageAction';
import { setQueryStringParamsAction } from './redux/actions/appContext/setQueryStringParams';
import { AnyPage, Route, RouteParams, Routes, URLQueryParams } from './types';
import { normalizePath, patchLeadingSlashInPath, printRouterConfig } from './utils';

const rootPageIndexName = '/';

type CreateURLParserParams<PageName extends string = 'root'> = {
  routes: Routes<AnyPage<PageName>>;
  handle404Error: () => AnyPage<PageName>;
};
/**
 * Creates URLParser for passed routes
 *
 * The main idea is to transform any supported URL (which is listed in the routes arg)
 * to a signal, which will be dispatched in a redux-store.
 * After that signal an appContext from the redux-store
 * will contain a page from the route with parsed params.
 */
export function createURLParser<PageName extends string = 'root'>({
  handle404Error,
  routes,
}: CreateURLParserParams<PageName>) {
  const parsePath = createURLPathParser(routes, handle404Error);

  return (URL: string): AnyAction[] => {
    const URLParts = URL.split('?');
    const URLPath = URLParts[0] || '';
    const URLQuery = URLParts[1];
    const queryParams = getQueryStringParams(URLQuery);
    const pathAction = parsePath(URLPath, queryParams || {});
    const mutableActions = [];

    if (queryParams) {
      mutableActions.push(setQueryStringParamsAction(queryParams));
    }

    if (pathAction) {
      mutableActions.push(pathAction);
    }

    return mutableActions;
  };
}

function createURLPathParser<PageName extends string>(
  routes: Routes<AnyPage<PageName>>,
  handle404Error: () => AnyPage<PageName>,
) {
  const mutableUniqNormalizedPathList: string[] = [];
  /**
   * routeIndices is used as a tiny performance improvement.
   * path-to-regexp lib is used for the path parsing. It could take much time and resources
   * to match received URL to every route from the routes config.
   * We can create a map of the first slug from every route to its full config
   * and prepared [match function](https://github.com/pillarjs/path-to-regexp#match).
   *
   * This map can be used later as a fast filter to find possible route config
   */
  const routeIndices = keysOf(routes).reduce<
    Record<
      string,
      /**
       * It is an array, cause there are can be such paths:
       * /items
       * /items/:id
       *
       * So, routeIndices will be look like this:
       * {
       *   items: [{...itemsConfig, match: () => {}}, {...itemsIdConfig, match: () => {}}]
       * }
       */
      Array<
        Route<RouteParams<any>, AnyPage<PageName>> & {
          match: MatchFunction;
        }
      >
    >
  >((mutableRes, pageName) => {
    // Every path needs to have leading slash for the correct processing
    const routeConfig = patchLeadingSlashInPath<PageName, Route<RouteParams<any>, AnyPage<PageName>>>(
      routes[pageName],
    );

    const mainSlugName = routeConfig.path === '/' ? rootPageIndexName : routeConfig.path.split('/')[1];

    if (!mainSlugName) {
      throw new Error(`Path is empty for slugConfig: ${JSON.stringify(routeConfig)}`);
    }

    /**
     * Every path has to be uniq in the router config
     * So, mutableNormalizedPathList is used as a store for all uniq paths
     *
     * Similar paths:
     * /users/:id
     * /users/:id?/:name
     * /users/:id/:name?
     * /users/:name
     * /users/:anyOtherParamName
     *
     * These paths are similar cause URL-path /users/123 will match to all of them
     * Paths /users/:name, /users/:id, /users/:id/:name? will be normalized to /users/:p
     */
    const normalizedPath = normalizePath(routeConfig.path);

    // So, if the similar path is found in mutableUniqNormalizedPathList
    // it is an error!
    if (mutableUniqNormalizedPathList.includes(normalizedPath)) {
      throw new Error(
        `Current path ${
          routeConfig.path
        } is used for another slugConfig! Current slugConfig is: ${JSON.stringify(
          routeConfig,
        )}, a slugConfig with the conflicting path is: ${JSON.stringify(mutableRes[mainSlugName])} `,
      );
    }

    mutableUniqNormalizedPathList.push(normalizedPath);

    if (!mutableRes[mainSlugName]) {
      mutableRes[mainSlugName] = [];
    }

    mutableRes[mainSlugName] = mutableRes[mainSlugName]!.concat({
      ...routeConfig,
      match: match(routeConfig.path, { decode: decodeURIComponent }),
    });

    return mutableRes;
  }, {});

  // istanbul ignore next
  if (process.env.NODE_ENV === 'development') {
    printRouterConfig(routes);
  }

  /**
   * Parse URL path and return action with payload,
   * which is relevant for the first matched page in URL
   */
  return (path: string, queryParams: URLQueryParams): AnyAction | void => {
    const pathParts = path
      // Split by slashes
      .split(/\/+/)
      // filter empty slugs like ///
      .filter((x) => !!x);

    // If the path was just '/', mutablePathParts became an empty array,
    // we have to process such path as a root page
    const mainSlug = pathParts[0] || rootPageIndexName;
    const possibleMatchedConfigs = routeIndices[mainSlug];

    // Unknown main slug — so, it is a 404 page
    if (!possibleMatchedConfigs) {
      return openAnyPageAction(handle404Error());
    }

    // If the main slug is in the routeIndices,
    // we can try to find a config, that will be matched to the full path
    for (const possibleMatchedConfig of possibleMatchedConfigs) {
      const matchPathResult = possibleMatchedConfig.match(`/${pathParts.join('/')}`);

      if (!matchPathResult) {
        continue;
      }

      return openAnyPageAction(
        possibleMatchedConfig.mapURLParamsToPage(matchPathResult.params, queryParams),
      );
    }

    // No matched config found
    return openAnyPageAction(handle404Error());
  };
}

/**
 * Parse a raw query string like param_1=value_1&param_2=value_2&param_2=value_3&param_3
 * This query string will be parsed to:
 * {
 *   param_1: [value_1],
 *   param_2: [value_2, value_3],
 *   param_3: ['']
 * }
 *
 * Every value will be decoded via decodeURIComponent
 */
function getQueryStringParams(URLQuery: string | undefined): URLQueryParams | undefined {
  if (!URLQuery) {
    return undefined;
  }

  const queryParts = URLQuery.split('&');

  return queryParts.reduce<{ [key: string]: string[] }>((mutableAcc, part: string) => {
    const [partLabel, partValue] = part.split('=') as [string, string | undefined];

    if (!mutableAcc[partLabel]) {
      mutableAcc[partLabel] = [];
    }

    mutableAcc[partLabel]?.push(decodeURIComponent(partValue || ''));

    return mutableAcc;
  }, {});
}
