import { UserByIdParams } from './fetch/useUserById';
import { UseUserListParams } from './fetch/useUserList';

export const userQueryKeys = {
  all: () => ['users'],
  byId: (params: UserByIdParams) => [...userQueryKeys.all(), 'byId', params],
  allLists: () => [...userQueryKeys.all(), 'list'],
  listByParams: (params: UseUserListParams) => [...userQueryKeys.allLists(), params],
} as const;
