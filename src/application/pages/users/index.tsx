import { lazy } from 'react';

import { UserStatus } from 'application/entities/user/types';
import { CommonPage } from 'application/pages/shared';

export interface UsersPage extends CommonPage {
  name: 'users';
  params: {
    page: number;
    filterStatus?: UserStatus[];
    activeUserId?: string;
  };
}

export const usersPageDefaultParams: UsersPage['params'] = {
  page: 1,
  filterStatus: undefined,
  activeUserId: undefined,
};

export const UsersPage = lazy(() => import(/* webpackChunkName: "usersPage" */ './ui'));
