import { lazy } from 'react';

import { CommonPage } from 'application/pages/shared';

export interface RootPage extends CommonPage {
  name: 'root';
}

export const RootPage = lazy(() => import(/* webpackChunkName: "rootPage" */ './ui'));
