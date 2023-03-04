import { lazy } from 'react';

import { CommonPage } from 'application/pages/shared';

export interface RootPage extends CommonPage {
  name: 'root';
}

export { getTitle, getMetaData } from './metadata';

export const RootPage = lazy(() => import(/* webpackChunkName: "rootPage" */ './ui'));
