import { lazy } from 'react';

import { CommonPage } from 'application/pages/shared';

export interface NewsItemPage extends CommonPage {
  name: 'newsItem';
  params: {
    id: number;
  };
}

export { getTitle, getMetaData } from './metadata';

export const NewsItemPage = lazy(() => import(/* webpackChunkName: "newsItemPage" */ './ui'));
