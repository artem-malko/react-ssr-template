import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { useAppQuery } from 'application/main/query';
import { FetchUserByIdResponse, User } from 'application/services/fake/types';
import { useServices } from 'application/services/shared/context';

import { userQueryKeys } from '../common';

export type UserByIdParams = {
  userId: string;
};

const useUserByIdFetcher = () => {
  const services = useServices();

  return (params: UserByIdParams) => services.fakeAPI.getUserById({ id: params.userId });
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
      return queryClient.setQueryData<FetchUserByIdResponse['data']>(
        userQueryKeys.byId({ userId: userToUpdate.id }),
        () => {
          return { user: userToUpdate };
        },
      );
    },
    [queryClient],
  );
};
