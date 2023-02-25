import { AnyPage, RouteConfig, RouteWithoutParams, RouteWithParams } from './types';

/**
 * Original type "Route" has a lot of Generic params,
 * so it can be not  to friendly to use it in a real app.
 *
 * So, we have a fabric here to make it much easy to create a config for any route.
 * Just specify MatchedPage and RouteParams, if you have it
 *
 * AppPage — is a type for any page for the certain application
 * ErrorPage — is a type (can be union, if you need) for an error page for  the certain application
 */
export function createRouteConfigCreator<AppPage extends AnyPage<string>, ErrorPage extends AppPage>() {
  return <
    // A matched page, cause we create any route to open a certain page
    MatchedPage extends AppPage,
    // An union type to specify names for all used path params
    RoutePathParamNames extends string = never,
    // Just a service type for a developer
    // Allows to not specify names for path params, if the page does not have it
    RoutePathParams = Record<RoutePathParamNames, never>,
  >(
    route: RouteConfig<
      // We can infer here, if that config uses params from a path
      keyof RoutePathParams extends never
        ? RouteWithoutParams
        : RouteWithParams<Record<RoutePathParamNames, string>>,
      AppPage,
      MatchedPage,
      ErrorPage
    >,
  ) => route;
}
