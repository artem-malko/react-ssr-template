import { lazy } from 'react';

import { CommonPage } from 'application/pages/shared';

import { UserStatus } from 'application/entities/domain/user';

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
