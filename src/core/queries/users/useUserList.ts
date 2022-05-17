import { FetchUsersResponse, User, UserStatus } from 'core/services/fake/types';
import { useAppQuery } from 'infrastructure/query/useAppQuery';
import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

const userListQueryName = 'userList';
export const useUserList = (page = 1, statusFilter?: UserStatus[]) => {
  return useAppQuery([userListQueryName, page, statusFilter], async ({ services }) => {
    return services.fakeAPI.getUsers({ page, status: statusFilter });
  });
};

export const useUserListInvalidate = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (page?: number, statusFilter?: UserStatus[]) => {
      const mutableQueryKeyToInvalidate: Array<any> = [userListQueryName];

      if (page !== undefined) {
        mutableQueryKeyToInvalidate.push(page);
      }

      if (statusFilter !== undefined) {
        mutableQueryKeyToInvalidate.push(statusFilter);
      }

      return queryClient.invalidateQueries(mutableQueryKeyToInvalidate);
    },
    [queryClient],
  );
};

export const useUserListOptimisticUpdater = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (userToUpdate: User) => {
      return queryClient.setQueriesData<FetchUsersResponse['data']>([userListQueryName], (previous) => {
        if (typeof previous === 'undefined') {
          return { total: 0, users: [] };
        }

        return {
          total: previous.total,
          users: previous.users.map((user) => (user.id === userToUpdate.id ? userToUpdate : user)),
        };
      });
    },
    [queryClient],
  );
};
