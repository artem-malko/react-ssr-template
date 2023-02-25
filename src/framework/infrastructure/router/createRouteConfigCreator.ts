import { AnyPage, RouteConfig, RouteWithoutParams, RouteWithParams } from './types';

/**
 * Original type "Route" has a lot of Generic params,
 * so it can be not  to friendly to use it in a real app.
 *
 * So, we have a fabric here to make it much easy to create a config for any route.
 * Just specify MatchedPage and RouteParams, if you have it
 */
export function createRouteConfigCreator<AppPage extends AnyPage<string>, ErrorPage extends AppPage>() {
  return <
    MatchedPage extends AppPage,
    RoutePathParams extends { [key: string]: string } = Record<string, never>,
  >(
    route: RouteConfig<
      keyof RoutePathParams extends never ? RouteWithoutParams : RouteWithParams<RoutePathParams>,
      AppPage,
      MatchedPage,
      ErrorPage
    >,
  ) => route;
}
