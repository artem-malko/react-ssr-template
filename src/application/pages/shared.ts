/**
 * IMPORTANT DISCLAIMER
 *
 * This file is out of any rules, I know)
 *
 * But, this is the most easy way to work with routing in the application
 *
 * So, you can export from shared.ts:
 *  * routes — a Routes<Page> map
 *  * compileAppURL function, cause it's effective to create that function just one time
 *  * default params for a page
 *  * A page types
 *
 * Other exports are forbidden!
 */

import { createURLCompiler } from 'framework/public/universal';

import { errorPageRoute } from './error/routing';
import { newsPageRoute } from './news/routing';
import { newsItemPageRoute } from './newsItem/routing';
import { rootPageRoute } from './root/routing';
import { usersPageRoute } from './users/routing';

import type { ErrorPage } from 'application/pages/error';
import type { NewsPage } from 'application/pages/news';
import type { NewsItemPage } from 'application/pages/newsItem';
import type { RootPage } from 'application/pages/root';
import type { UsersPage } from 'application/pages/users';
import type { Routes, AnyPage } from 'framework/public/types';

export interface CommonPage extends AnyPage<string> {}

export type Page = RootPage | ErrorPage | NewsPage | NewsItemPage | UsersPage;
export type PageName = Page['name'];

export const routes: Routes<Page> = {
  root: rootPageRoute,
  error: errorPageRoute,
  news: newsPageRoute,
  newsItem: newsItemPageRoute,
  users: usersPageRoute,
};

export { newsPageDefaultParams } from './news';
export { usersPageDefaultParams } from './users';

/**
 * createURLParser is used on the server side only
 * So, we do not need to create it here
 */
export const compileAppURL = createURLCompiler(routes);
