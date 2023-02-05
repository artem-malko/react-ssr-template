import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { useAppQuery } from 'application/shared/hooks/query';
import { FetchUsersResponse, User, UserStatus } from 'application/shared/services/fake/types';
import { useServices } from 'application/shared/services/shared/context';

import { userQueryKeys } from '../common';

export type UseUserListParams = {
  page: number;
  statusFilter?: UserStatus[];
};

const useUserListFetcher = () => {
  const services = useServices();

  return (params: UseUserListParams) =>
    services.fakeAPI.getUsers({ page: params.page, status: params.statusFilter });
};

export const useUserList = (params: UseUserListParams) => {
  const userListFetcher = useUserListFetcher();

  return useAppQuery(userQueryKeys.listByParams(params), () => userListFetcher(params));
};

export const useUserListOptimisticUpdater = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (userToUpdate: User) => {
      return queryClient.setQueriesData<FetchUsersResponse['data']>(
        userQueryKeys.allLists(),
        (previous) => {
          if (typeof previous === 'undefined') {
            return { total: 0, users: [] };
          }

          return {
            total: previous.total,
            users: previous.users.map((user) => (user.id === userToUpdate.id ? userToUpdate : user)),
          };
        },
      );
    },
    [queryClient],
  );
};
