import { AnyPage, Route, RouteWithoutParams, RouteWithParams } from './types';

export function createRouteCreator<AppPage extends AnyPage<string>>() {
  return <
    Page extends AppPage,
    RoutePathParams extends { [key: string]: string } = Record<string, never>,
  >(
    route: Route<
      keyof RoutePathParams extends never ? RouteWithoutParams : RouteWithParams<RoutePathParams>,
      Page,
      AppPage
    >,
  ) => route;
}
