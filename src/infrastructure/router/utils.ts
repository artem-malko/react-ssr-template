import { keysOf } from 'lib/lodash';
import { AnyPage, Route, RouteParams } from './types';

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
