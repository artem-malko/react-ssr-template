import { Page } from 'application/main/types';
import { errorPageRoute } from 'application/ui/pages/error/routing';
import { newsPageRoute } from 'application/ui/pages/news/routing';
import { newsItemPageRoute } from 'application/ui/pages/newsItem/routing';
import { rootPageRoute } from 'application/ui/pages/root/routing';
import { usersPageRoute } from 'application/ui/pages/users/routing';
import { createURLCompiler } from 'framework/infrastructure/router/compileURL';
import { Routes } from 'framework/infrastructure/router/types';

export const routes: Routes<Page> = {
  root: rootPageRoute,
  error: errorPageRoute,
  news: newsPageRoute,
  newsItem: newsItemPageRoute,
  users: usersPageRoute,
};

// const r = {
//   '/news/:id': {
//     pageName: 'newsItem',
//     config: {},
//   },
// };

/**
 * createURLParser is used on the server side only
 * So, we do not need to create it here
 */
export const compileAppURL = createURLCompiler(routes);
