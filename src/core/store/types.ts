import { ErrorPage } from 'ui/pages/error/types';
import { RootPage } from 'ui/pages/root/types';
import { AnyPage, URLQueryParams } from 'infrastructure/router/types';
import { HttpCode } from 'core/shared/httpCode';

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

export type Page = RootPage | ErrorPage;
export type PageName = Page['name'];
