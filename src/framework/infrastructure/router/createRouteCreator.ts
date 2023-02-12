import { AnyPage, Route, RouteWithoutParams, RouteWithParams } from './types';

/**
 * Original type "Route" has a lot of Generic params,
 * so it can be not  to friendly to use it in a real app.
 *
 * So, we have a fabric here to make it much easy to create a new route.
 * Just specify MatchedPage and RouteParams, if you have it
 */
export function createRouteCreator<AppPage extends AnyPage<string>, ErrorPage extends AppPage>() {
  return <
    MatchedPage extends AppPage,
    RoutePathParams extends { [key: string]: string } = Record<string, never>,
  >(
    route: Route<
      keyof RoutePathParams extends never ? RouteWithoutParams : RouteWithParams<RoutePathParams>,
      AppPage,
      MatchedPage,
      ErrorPage
    >,
  ) => route;
}
