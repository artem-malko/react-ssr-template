/**
 * IMPORTANT DISCLAIMER
 *
 * This file is out of any rules, I know)
 *
 * But, this is the most easy way to work with routing in the application
 *
 * So, you can export from shared.ts:
 *  * routes — a Routes<Page> map
 *  * default params for a page
 *  * A page type
 *
 * Other exports are forbidden!
 */

import type { Routes, AnyPage } from 'framework/public/types';

import type { ErrorPage } from 'application/pages/error';
import type { NewsPage } from 'application/pages/news';
import type { NewsItemPage } from 'application/pages/newsItem';
import type { RootPage } from 'application/pages/root';
import type { UsersPage } from 'application/pages/users';

import { bindRouteConfigToPath } from './_internals';
import { errorPageRouteConfig } from './error/routing';
import { newsPageRouteConfig } from './news/routing';
import { newsItemPageRouteConfig } from './newsItem/routing';
import { rootPageRouteConfig } from './root/routing';
import { usersPageRouteConfig } from './users/routing';

export interface CommonPage extends AnyPage<string> {}

export type Page = RootPage | ErrorPage | NewsPage | NewsItemPage | UsersPage;
export type PageName = Page['name'];

/**
 * Ignore prettier to have a clear view to all of your routes
 */
// prettier-ignore
export const routes: Routes<Page> = {
  root:     bindRouteConfigToPath('/', rootPageRouteConfig),
  error:    bindRouteConfigToPath('/error/:code', errorPageRouteConfig),
  news:     bindRouteConfigToPath('/news', newsPageRouteConfig),
  newsItem: bindRouteConfigToPath('/news/:id', newsItemPageRouteConfig),
  users:    bindRouteConfigToPath('/users', usersPageRouteConfig),
};

export { newsPageDefaultParams } from './news';
export { usersPageDefaultParams } from './users';
