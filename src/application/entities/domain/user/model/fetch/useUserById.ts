import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { useAppQuery } from 'application/shared/hooks/useAppQuery';
import { useApi } from 'application/shared/lib/api';
import { UnwrapQueryData } from 'application/shared/lib/query';

import { getUserByIdApi } from '../../api/getUserById';
import { User } from '../../types';
import { userQueryKeys } from '../common';

export type UserByIdParams = {
  userId: string;
};

const useUserByIdFetcher = () => {
  const getUserById = useApi(getUserByIdApi);

  return (params: UserByIdParams) => getUserById({ id: params.userId }).then((res) => res.data);
};

export const useUserById = (params: UserByIdParams) => {
  const userByIdFetcher = useUserByIdFetcher();

  return useAppQuery(userQueryKeys.byId(params), () => userByIdFetcher(params));
};

export const useUserByIdQueryFetcher = () => {
  const queryClient = useQueryClient();
  const userByIdFetcher = useUserByIdFetcher();

  return useCallback(
    (params: UserByIdParams) => {
      return queryClient.fetchQuery(userQueryKeys.byId(params), () => userByIdFetcher(params));
    },
    [queryClient, userByIdFetcher],
  );
};

export const useUserByIdOptimisticUpdater = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (userToUpdate: User) => {
      return queryClient.setQueryData<UnwrapQueryData<typeof useUserById>>(
        userQueryKeys.byId({ userId: userToUpdate.id }),
        () => {
          return { user: userToUpdate };
        },
      );
    },
    [queryClient],
  );
};
