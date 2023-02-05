import { lazy } from 'react';

import { CommonPage } from '../shared';

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

export const NewsPage = lazy(() => import(/* webpackChunkName: "newsPage" */ './ui'));
