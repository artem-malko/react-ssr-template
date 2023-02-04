import type { ErrorPage } from 'application/ui/pages/error';
import type { NewsPage } from 'application/ui/pages/news';
import type { NewsItemPage } from 'application/ui/pages/newsItem';
import type { RootPage } from 'application/ui/pages/root';
import type { UsersPage } from 'application/ui/pages/users';
import type { AnyPage } from 'framework/public/types';
import type { MapDiscriminatedUnion } from 'lib/types';

export interface CommonPage extends AnyPage<string> {}

export type Page = RootPage | ErrorPage | NewsPage | NewsItemPage | UsersPage;
export type PageName = Page['name'];

export type PageNameToPageMapping = MapDiscriminatedUnion<Page, 'name'>;
