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
export type URLQueryParams = Record<string, QueryParamValue>;

/**
 * Every App, which uses this router has to extend this type in its own AppContext
 */
export interface AnyAppContext<Page extends AnyPage<string> = AnyPage<string>> {
  page: Page;
  URLQueryParams: URLQueryParams | undefined;
}
export interface AnyAppState<AppContext extends AnyAppContext = AnyAppContext> {
  appContext: AppContext;
}

export type RouteParams<T> = T;
export type RouteWithoutParams = RouteParams<Record<string, never>>;
export type RouteWithParams<T = { [key: string]: string }> = RouteParams<T>;

export type Route<
  /**
   * Actually, with type is not required,
   * cause every param for a route has to be described in params for page types.
   * This type is used just for an explicit connection between args in the route path
   * and args for the route signal.
   * So, Route type could be like this:
   *
   * @example
   * // This type can be described somewhere far away from the route config
   * type SpecificPage = {
   *   name: 'SpecificPage',
   *   params: {
   *     id: string;
   *     name?: string;
   *   }
   * }
   *
   * const route Route<SpecificPage> = {
   *   path: 'specific_page/:id/:name',
   *   mapURLToPage: ({ id, name }) => { ... },
   *   mapPageToPathParams: (pageParams: Page['params']) => {
   *     return {
   *       id: pageParams.id,
   *       // A potential error here, cause pageParams.name is not required in SpecificPage
   *       name: pageParams.name,
   *     };
   *   }
   * }
   *
   * As you can see, there is no any explicit connection between SpecificPage and the path args.
   * By the way, if the name param will be required in the page type, but not required in the path,
   * where will be an incorect type in the signal args.
   *
   * RoutePathParams is here to prevent such potential errors
   * and to make the explicit connection between path args and page params
   */
  RoutePathParams extends RouteWithoutParams | RouteWithParams<{ [key: string]: string }>,
  Page extends AnyPage<string, { [key in keyof RoutePathParams]: any }>,
  URLToPageResult extends AnyPage<string> = Page,
> = {
  path: string;
  mapURLToPage: (pathParams: RoutePathParams, queryParams: URLQueryParams) => URLToPageResult;
  mapPageToPathParams?: (pageParams: Page['params']) => RoutePathParams;
  // @TODO Array<string | true> true — for empty value
  mapPageToQueryParams?: (pageParams: Page['params']) => { [key: string]: QueryParamValue };
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
  [key in keyof PMap]: Route<RouteParams<any>, PMap[key], Page>;
};
