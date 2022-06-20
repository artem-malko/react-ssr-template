import { ErrorPage } from 'ui/pages/error';
import { RootPage } from 'ui/pages/root';
import { AnyPage, URLQueryParams } from 'infrastructure/router/types';
import { NewsPage } from 'ui/pages/news';
import { NewsItemPage } from 'ui/pages/newsItem';
import { HttpErrorCode } from 'core/types/http';
import { UsersPage } from 'ui/pages/users';
import { MapDiscriminatedUnion } from 'lib/types';

export type AppState = {
  appContext: AppContext;
};

export interface AppContext {
  page: Page;
  URLQueryParams: URLQueryParams | undefined;
}

export interface CommonPage extends AnyPage<string> {
  // @TODO maybe remove it?
  errorCode?: HttpErrorCode;
}

export type Page = RootPage | ErrorPage | NewsPage | NewsItemPage | UsersPage;
export type PageName = Page['name'];

export type PageNameToPageMapping = MapDiscriminatedUnion<Page, 'name'>;
