import { Page } from 'core/store/types';
import { createURLCompiler } from 'infrastructure/router/compileURL';
import { Routes } from 'infrastructure/router/types';
import { errorPageRoute } from 'ui/pages/error/routing';
import { newsPageRoute } from 'ui/pages/news/routing';
import { newsItemPageRoute } from 'ui/pages/newsItem/routing';
import { rootPageRoute } from 'ui/pages/root/routing';

export type AppRoutes = Routes<Page>;

export const routes: AppRoutes = {
  root: rootPageRoute,
  error: errorPageRoute,
  news: newsPageRoute,
  newsItem: newsItemPageRoute,
};

/**
 * createURLParser is used on the server side only
 * So, we do not need to create it here
 */
export const compileAppURL = createURLCompiler(routes);
