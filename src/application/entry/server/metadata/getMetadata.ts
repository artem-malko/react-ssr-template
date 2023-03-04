import { QueryClient } from '@tanstack/react-query';

import { GetMetadata } from 'framework/public/server';
import { URLQueryParams } from 'framework/public/types';
import { Metadata } from 'framework/types/metadata';

import { getMetaData as getMetaDataForErrorPage } from 'application/pages/error';
import { getMetaData as getMetaDataForNewsPage } from 'application/pages/news';
import { getMetaData as getMetaDataForNewsItemPage } from 'application/pages/newsItem';
import { getMetaData as getMetaDataForRootPage } from 'application/pages/root';
import { Page } from 'application/pages/shared';
import { getMetaData as getMetaDataForUsersPage } from 'application/pages/users';

export const getMetadata: GetMetadata<Page> = async (params) => {
  const pageMetadata = await getPageMetadata(params);

  return {
    ...pageMetadata,
    viewport: {
      width: 'device-width',
      maximumScale: '1.0',
      initialScale: '1.0',
      userScalable: 'no',
    },
  };
};

const getPageMetadata = async (params: {
  queryClient: QueryClient;
  page: Page;
  URLQueryParams: URLQueryParams;
}): Promise<Pick<Metadata, 'title' | 'description' | 'OG' | 'alternates'>> => {
  const { page } = params;

  switch (page.name) {
    case 'root':
      return getMetaDataForRootPage({
        ...params,
        page,
      });
    case 'users':
      return getMetaDataForUsersPage({
        ...params,
        page,
      });
    case 'news':
      return getMetaDataForNewsPage({
        ...params,
        page,
      });
    case 'newsItem':
      return getMetaDataForNewsItemPage({
        ...params,
        page,
      });
    case 'error':
      return getMetaDataForErrorPage({
        ...params,
        page,
      });
  }
};
