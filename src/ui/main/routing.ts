import { Page } from 'core/store/types';
import { createURLCompiler } from 'infrastructure/router/compileURL';
import { Routes } from 'infrastructure/router/types';
import { errorPageRoute } from 'ui/pages/error/routing';
import { newsPageRoute } from 'ui/pages/news/routing';
import { rootPageRoute } from 'ui/pages/root/routing';

export type AppRoutes = Routes<Page>;

export const routes: AppRoutes = {
  root: rootPageRoute,
  error: errorPageRoute,
  news: newsPageRoute,
};

/**
 * createURLParser is used on server side only
 */
export const compileAppURL = createURLCompiler(routes);
