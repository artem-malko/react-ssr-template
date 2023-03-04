import { lazy } from 'react';

import { CommonPage } from 'application/pages/shared';

export interface NewsPage extends CommonPage {
  name: 'news';
  params: {
    page: number;
    useInfinity?: boolean;
  };
}

export const newsPageDefaultParams: NewsPage['params'] = {
  page: 1,
  useInfinity: false,
};

export { getTitle, getMetaData } from './metadata';

export const NewsPage = lazy(() => import(/* webpackChunkName: "newsPage" */ './ui'));
