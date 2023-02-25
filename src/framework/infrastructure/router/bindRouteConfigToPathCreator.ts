import { AnyPage, Route, RouteConfig } from './types';

/**
 * Exracts params from a path string like /slug/:param1/:param2/:param3
 * to a struct
 * {
 *   param1: string;
 *   param2: string;
 *   param3: srting;
 * }
 *
 * Only required params are supported
 *
 */
// prettier-ignore
type ExtractRouteParams<T extends string> = string extends T
  ? Record<string, string>
  : T extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? { [k in Param]: string } & ExtractRouteParams<Rest>
    : T extends `${infer _Start}:${infer Param}`
      ? { [k in Param]: string }
      : Record<string, never>;

/**
 * Creates a binded version (with a certain AppPage type) of any routeConfig to a path for that routeConfig
 */
export const bindRouteConfigToPathCreator = <AppPage extends AnyPage<string>>() => {
  /**
   * This function is used for an explicit connection between args in the route path
   * and args for a route config.
   * So, the route config could be like this:
   *
   * // This type can be described somewhere far away from the route config
   * type SpecificPage = {
   *   name: 'SpecificPage',
   *   params: {
   *     id: string;
   *     name: string;
   *   }
   * }
   *
   * const routeConfig = createRouterConfig<SpecificPage, 'id' | 'name'>({
   *   mapURLToPage: ({ id, name }) => { ... },
   *   mapPageToPathParams: (pageParams: Page['params']) => {
   *     return {
   *       name: 'SpecificPage',
   *       params: {
   *         name: pageParams.name,
   *         id: pageParams.id,
   *       }
   *     };
   *   }
   * });
   *
   * As you can see, there is no any explicit connection between SpecificPage and the path args.
   * So, if we just attach such config to a path like /page/:id/:age,
   * there will be a problem — we do not have an age param, but have others
   *
   * bindRouteConfigToPath is here to prevent such potential errors
   * and to make the explicit connection between path args and page params
   */
  return <RoutePath extends string, MatchedPage extends AppPage = AppPage>(
    path: RoutePath,
    config: RouteConfig<ExtractRouteParams<RoutePath>, AppPage, MatchedPage>,
  ): Route<ExtractRouteParams<RoutePath>, AppPage, MatchedPage> => {
    return {
      path,
      ...config,
    };
  };
};
