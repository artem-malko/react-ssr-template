import { ErrorPage } from 'application/ui/pages/error';
import { NewsPage } from 'application/ui/pages/news';
import { NewsItemPage } from 'application/ui/pages/newsItem';
import { RootPage } from 'application/ui/pages/root';
import { UsersPage } from 'application/ui/pages/users';
import { AnyPage } from 'framework/infrastructure/router/types';
import { HttpErrorCode } from 'framework/types/http';
import { MapDiscriminatedUnion } from 'lib/types';

export interface CommonPage extends AnyPage<string> {
  // @TODO maybe remove it?
  errorCode?: HttpErrorCode;
}

export type Page = RootPage | ErrorPage | NewsPage | NewsItemPage | UsersPage;
export type PageName = Page['name'];

export type PageNameToPageMapping = MapDiscriminatedUnion<Page, 'name'>;
