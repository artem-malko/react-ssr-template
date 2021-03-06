import { Services } from 'core/services';
import { FetchUsersResponse, User, UserStatus } from 'core/services/fake/types';
import { useAppQuery } from 'infrastructure/query/useAppQuery';
import { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { useUsersQueryMainKey } from './common';

type UseUserListParams = {
  page: number;
  statusFilter?: UserStatus[];
};

const userListFetcher = (services: Services, params: UseUserListParams) => {
  return services.fakeAPI.getUsers({ page: params.page, status: params.statusFilter });
};
const createUserListQueryKey = (params: UseUserListParams) => {
  return [useUsersQueryMainKey, 'userList', params];
};

export const useUserList = (params: UseUserListParams) => {
  return useAppQuery(createUserListQueryKey(params), async ({ services }) => {
    return userListFetcher(services, params);
  });
};

export const useUserListOptimisticUpdater = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (userToUpdate: User) => {
      return queryClient.setQueriesData<FetchUsersResponse['data']>(
        [useUsersQueryMainKey, 'userList'],
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
