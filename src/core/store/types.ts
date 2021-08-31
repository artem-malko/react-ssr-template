import { ErrorPage } from 'ui/pages/error';
import { RootPage } from 'ui/pages/root';
import { AnyPage, URLQueryParams } from 'infrastructure/router/types';
import { HttpCode } from 'core/shared/httpCode';
import { NewsPage } from 'ui/pages/news';
import { NewsItemPage } from 'ui/pages/newsItem';

export type AppState = {
  appContext: AppContext;
};

export interface AppContext {
  page: Page;
  URLQueryParams: URLQueryParams | undefined;
}

export interface CommonPage extends AnyPage<string> {
  errorCode?: HttpCode;
}

export type Page = RootPage | ErrorPage | NewsPage | NewsItemPage;
export type PageName = Page['name'];
