import { GetTitle } from 'framework/public/universal';

import { getTitle as getTitleForErrorPage } from 'application/pages/error';
import { getTitle as getTitleForNewsPage } from 'application/pages/news';
import { getTitle as getTitleForNewsItemPage } from 'application/pages/newsItem';
import { getTitle as getTitleForRootPage } from 'application/pages/root';
import { Page } from 'application/pages/shared';
import { getTitle as getTitleForUsersPage } from 'application/pages/users';

export const getTitle: GetTitle<Page> = (params) => {
  const { page } = params;

  switch (page.name) {
    case 'root':
      return getTitleForRootPage({
        ...params,
        page,
      });
    case 'news':
      return getTitleForNewsPage({
        ...params,
        page,
      });
    case 'newsItem':
      return getTitleForNewsItemPage({
        ...params,
        page,
      });
    case 'users':
      return getTitleForUsersPage({
        ...params,
        page,
      });
    case 'error':
      return getTitleForErrorPage({
        ...params,
        page,
      });
  }
};
