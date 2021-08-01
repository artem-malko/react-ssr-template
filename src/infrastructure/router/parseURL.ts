import { keysOf } from 'lib/lodash';
import { match, MatchFunction } from 'path-to-regexp';
import { Action } from 'redux';
import { AnyPage, Route, RouteParams, Routes, URLQueryParams } from './types';
import { patchLeadingSlashInPath } from './utils';

const rootPageIndexName = '/';

/**
 * Creates URLParser for passed routes
 *
 * The main idea is to transform any supported URL (which is listed in the routes arg)
 * to a signal, which will be dispatched in a redux-store.
 * After that signal an appContext from the redux-store
 * will contain a page from route with parsed params.
 *
 * @TODO add strict rule, that the routes arg has to have the root page config
 * May be add a flag to route config, that route is for root page. Need to think about it.
 */
export function createURLParser<PageName extends string>(
  routes: Routes<AnyPage<PageName>>,
  signals: {
    onError404Action: Action;
    setQueryStringParams: (params: { params: URLQueryParams }) => Action;
  },
) {
  const parsePath = createURLPathParser(routes, signals);

  return (URL: string): Action[] => {
    const URLParts = URL.split('?');
    const URLPath = URLParts[0] || '';
    const URLQuery = URLParts[1];
    const queryParams = getQueryStringParams(URLQuery);
    const pathAction = parsePath(URLPath, queryParams || {});
    const mutableActions = [];

    if (queryParams) {
      mutableActions.push(signals.setQueryStringParams({ params: queryParams }));
    }

    if (pathAction) {
      mutableActions.push(pathAction);
    }

    return mutableActions;
  };
}

function createURLPathParser<PageName extends string>(
  routes: Routes<AnyPage<PageName>>,
  signals: {
    onError404Action: Action;
  },
) {
  /**
   * routeIndices is used as a tiny performance improvement.
   * path-to-regexp lib is used for path parsing. It could take much time and resources
   * to match received URL to every route from the routes config.
   * We can create a map of the first slug from every route to its full config
   * and prepared match function.
   * This map can be used later as a fast filter to find possible route config
   */
  const routeIndices = keysOf(routes).reduce<
    Record<
      string,
      Route<RouteParams<any>, AnyPage<PageName>> & {
        match: MatchFunction;
      }
    >
  >((mutableRes, pageName) => {
    const routeConfig = patchLeadingSlashInPath<PageName, Route<RouteParams<any>, AnyPage<PageName>>>(
      routes[pageName],
    );

    const mainSlugName = routeConfig.path === '/' ? rootPageIndexName : routeConfig.path.split('/')[1];

    if (!mainSlugName) {
      // @TODO add more specific error
      throw new Error(`Path is empty for slugConfig: ${JSON.stringify(routeConfig)}`);
    }

    if (mutableRes[mainSlugName]) {
      // @TODO add more specific error
      throw new Error(
        `Current mainSlugName ${mainSlugName} is used for another slugConfig! Current slugConfig is: ${JSON.stringify(
          routeConfig,
        )}, a slugConfig with the conflicting mainSlugName is: ${JSON.stringify(
          mutableRes[mainSlugName],
        )} `,
      );
    }

    mutableRes[mainSlugName] = {
      ...routeConfig,
      match: match(routeConfig.path, { decode: decodeURIComponent }),
    };

    return mutableRes;
  }, {});

  /**
   * Parse URL path and return action with payload, which is relevant for the first matched page in URL
   */
  return (path: string, queryParams: URLQueryParams): Action | void => {
    const mutablePathParts = path
      // Split by slashes
      .split(/\/+/)
      .filter((x) => !!x);

    // If the path was just '/', we have to process such path as a root page
    if (!mutablePathParts.length) {
      mutablePathParts.push(rootPageIndexName);
    }

    for (let i = 0; i <= mutablePathParts.length; i++) {
      const possibleMatchedConfig = routeIndices[mutablePathParts[i] as string];

      if (possibleMatchedConfig) {
        const matchPathResult = possibleMatchedConfig.match(`/${mutablePathParts.join('/')}`);

        if (!matchPathResult) {
          continue;
        }

        return possibleMatchedConfig.signal(
          matchPathResult.params as Record<string, string>,
          queryParams,
        );
      }
    }

    return signals.onError404Action;
  };
}

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
