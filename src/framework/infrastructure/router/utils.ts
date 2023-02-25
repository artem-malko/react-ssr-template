import { colorize } from 'lib/console/colorize';
import { keysOf } from 'lib/lodash';

import { AnyPage, Route, RouteParams, Routes } from './types';

export function stringifyParams<Key extends string>(params: Record<Key, any> | undefined) {
  if (!params) {
    return {} as Record<Key, string>;
  }

  return keysOf(params).reduce<Record<Key, string | undefined>>((mutableResult, paramKey) => {
    mutableResult[paramKey] = params[paramKey] ? params[paramKey].toString() : undefined;

    return mutableResult;
  }, {} as Record<Key, string | undefined>);
}

export function patchLeadingSlashInPath<
  PageName extends string,
  T extends Route<RouteParams<any>, AnyPage<PageName>>,
>(routeConfig: T): T {
  if (routeConfig.path[0] === '/') {
    return routeConfig;
  }

  return {
    ...routeConfig,
    path: `/${routeConfig.path}`,
  };
}

/**
 * Pathes /users/:name, /users/:id, /users/:id/:name?
 * is normalized to /users/:p
 *
 * Every required param is replaced with :p placeholder
 * Every optional param is filtered out
 */
export function normalizePath(routePath: string): string {
  return (
    routePath
      .split('/')
      // /users/:id and /users/:name has to be marked as similar,
      // so, let's replace real names with a placeholder
      .map((part) => {
        if (part[0] === ':') {
          return ':p';
        }

        return part;
      })
      .join('/')
  );
}

/**
 * Print beautified map of path to a page name, which is used for that page
 */
// istanbul ignore next
export function printRouterConfig<PageName extends string>(routes: Routes<AnyPage<PageName>>) {
  console.log('\nThese paths are used in the current router config:');
  console.log('-------------------------------------------------');

  // eslint-disable-next-line functional/immutable-data
  const sortedPageNames = keysOf(routes).sort((pageNameA, pageNameB) => {
    if (routes[pageNameA].path > routes[pageNameB].path) {
      return 1;
    } else if (routes[pageNameA].path < routes[pageNameB].path) {
      return -1;
    }

    return 0;
  });

  const theLongestPathLength = keysOf(routes).reduce((res, pageName) => {
    if (res < routes[pageName].path.length) {
      res = routes[pageName].path.length;
    }

    return res;
  }, 0);

  sortedPageNames.forEach((pageName) => {
    console.log(
      `Path: ${colorize(
        routes[pageName].path.padEnd(theLongestPathLength + 2),
        'cyan',
      )} is used for ${colorize(pageName, 'cyan')} page`,
    );
  });

  console.log('\n');
}
