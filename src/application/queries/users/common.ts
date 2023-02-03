import { UserByIdParams } from './fetch/useUserById';
import { UseUserListParams } from './fetch/useUserList';

export const userQueryKeys = {
  all: () => ['users'] as const,
  byId: (params: UserByIdParams) => [...userQueryKeys.all(), 'byId', params] as const,
  allLists: () => [...userQueryKeys.all(), 'list'] as const,
  listByParams: (params: UseUserListParams) => [...userQueryKeys.allLists(), params] as const,
};
