import { AnyAction } from 'redux';

import { MapDiscriminatedUnion } from 'lib/types';

type QueryParamValue = Array<string | undefined>;

export interface AnyPage<
  PageName extends string,
  Params extends Record<string, any> = Record<string, any>,
> {
  name: PageName;
  params?: Params;
}
/**
 * It has such type cause query params can be:
 * - without any value: ?q or ?q=
 * - with one value: ?q=value
 * - or with several values: ?q=value_1&q=value_2
 *
 * So, string[] is a type to cover all situations above
 * - ?q or ?q= transforms to { q: [''] }
 * - ?q=value transforms to { q: ['value'] }
 * - ?q=value_1&q=value_2 transforms to { q: ['value1', 'value2'] }
 */
export type URLQueryParams<QueryKeys extends string = string> = Record<QueryKeys, QueryParamValue>;

/**
 * Every App, which uses this router has to extend this type in its own AppContext
 */
export interface AnyAppContext<Page extends AnyPage<string> = AnyPage<string>> {
  page: Page;
  URLQueryParams: URLQueryParams;
}
export interface AnyAppState<AppContext extends AnyAppContext = AnyAppContext> {
  appContext: AppContext;
}

export type RouteParams<T> = T;
export type RouteWithoutParams = RouteParams<Record<string, never>>;
export type RouteWithParams<T = { [key: string]: string }> = RouteParams<T>;

export type Route<
  // Params from a path
  RoutePathParams extends RouteWithoutParams | RouteWithParams<{ [key: string]: string }>,
  // Union type for all pages of an application
  AppPage extends AnyPage<string>,
  MatchedPage extends AppPage = AppPage,
  ErrorPage extends AppPage = AppPage,
  URLToPageResult extends AppPage = MatchedPage | ErrorPage,
  PageParams = keyof MatchedPage['params'] extends never ? never : MatchedPage['params'],
> = RouteConfig<RoutePathParams, AppPage, MatchedPage, ErrorPage, URLToPageResult, PageParams> & {
  path: string;
};

export type RouteConfig<
  RoutePathParams extends RouteWithoutParams | RouteWithParams<{ [key: string]: string }>,
  AppPage extends AnyPage<string>,
  MatchedPage extends AppPage = AppPage,
  ErrorPage extends AppPage = AppPage,
  URLToPageResult extends AppPage = MatchedPage | ErrorPage,
  PageParams = keyof MatchedPage['params'] extends never ? never : MatchedPage['params'],
> = {
  mapURLParamsToPage: (pathParams: RoutePathParams, queryParams: URLQueryParams) => URLToPageResult;
  // We do not need "path" in that object, if there is no any RoutePathParams
  // Or current page doesn't have any params
  mapPageToURLParams?: (pageParams: PageParams) => RoutePathParams extends RouteWithoutParams
    ? { query?: URLQueryParams }
    : RoutePathParams extends RouteWithParams
    ? PageParams extends never
      ? { query?: URLQueryParams }
      : {
          query?: URLQueryParams;
          path?: RoutePathParams;
        }
    : { query?: URLQueryParams };
};

/**
 * This type allows to be ensure, what all pages from Page type has its own route config
 * Checkout parseURL.spec.ts to know, how Routes type can be used in your App
 */
export type Routes<
  Page extends AnyPage<PageName>,
  PageName extends string = string,
  PMap extends MapDiscriminatedUnion<Page, 'name'> = MapDiscriminatedUnion<Page, 'name'>,
> = {
  [key in keyof PMap]: Route<RouteParams<any>, Page, PMap[key]>;
};

export type UniversalRouter = {
  /**
   * A function, which compiles an URL from an appContext
   */
  compileURL: (appContext: AnyAppContext) => string;
  /**
   * Allowed global URL Query keys, which are not associated with any page
   */
  allowedURLQueryKeys?: readonly string[];
};

export type ClientRouter = UniversalRouter;

export type ServerRouter = UniversalRouter & {
  /**
   * A function, which parses an URL to an array of actions for the router
   */
  parseURL: (URL: string) => AnyAction[];
  /**
   * An initial app context, which is a default for an application
   * You can treat it like a context for a root page
   */
  initialAppContext: AnyAppContext;
};
