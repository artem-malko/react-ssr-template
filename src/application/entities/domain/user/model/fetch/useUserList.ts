import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { useAppSuspenseQuery } from 'application/shared/hooks/useAppSuspenseQuery';
import { useApi } from 'application/shared/lib/api';
import { UnwrapQueryData } from 'application/shared/lib/query';

import { getUserListApi } from '../../api/getUserList';
import { User, UserStatus } from '../../types';
import { userQueryKeys } from '../common';

export type UseUserListParams = {
  page: number;
  statusFilter?: UserStatus[];
};

const useUserListFetcher = () => {
  const getUserList = useApi(getUserListApi);

  return (params: UseUserListParams) =>
    getUserList({ page: params.page, status: params.statusFilter }).then((res) => res.data);
};

export const useUserList = (params: UseUserListParams) => {
  const userListFetcher = useUserListFetcher();

  return useAppSuspenseQuery({
    queryKey: userQueryKeys.listByParams(params),
    queryFn: () => userListFetcher(params),
  });
};

export const useUserListOptimisticUpdater = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (userToUpdate: User) => {
      return queryClient.setQueriesData<UnwrapQueryData<typeof useUserList>>(
        {
          queryKey: userQueryKeys.allLists(),
        },
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
