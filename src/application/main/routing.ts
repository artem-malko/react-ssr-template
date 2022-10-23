import { Page } from 'application/main/types';
import { errorPageRoute } from 'application/ui/pages/error/routing';
import { newsPageRoute } from 'application/ui/pages/news/routing';
import { newsItemPageRoute } from 'application/ui/pages/newsItem/routing';
import { rootPageRoute } from 'application/ui/pages/root/routing';
import { usersPageRoute } from 'application/ui/pages/users/routing';
import { createURLCompiler } from 'framework/infrastructure/router/compileURL';
import {
  AnyPage,
  Route,
  RouteWithoutParams,
  RouteWithParams,
} from 'framework/infrastructure/router/types';
import { Routes } from 'framework/infrastructure/router/types';

export type AppRoute<
  RoutePathParams extends RouteWithoutParams | RouteWithParams<{ [key: string]: string }>,
  URLToPageResult extends AnyPage<string, { [key in keyof RoutePathParams]: any }>,
> = Route<RoutePathParams, URLToPageResult, Page>;

export type AppRoutes = Routes<Page>;

export const routes: AppRoutes = {
  root: rootPageRoute,
  error: errorPageRoute,
  news: newsPageRoute,
  newsItem: newsItemPageRoute,
  users: usersPageRoute,
};

/**
 * createURLParser is used on the server side only
 * So, we do not need to create it here
 */
export const compileAppURL = createURLCompiler(routes);
