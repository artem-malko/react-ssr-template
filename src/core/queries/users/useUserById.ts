import { FetchUserByIdResponse, User } from 'core/services/fake/types';
import { useAppQuery } from 'infrastructure/query/useAppQuery';
import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

type UserByIdParams = {
  userId: string;
};

export const createUserByIdQueryKey = (params: UserByIdParams) => {
  return ['userById', params.userId];
};
export const useUserById = (params: UserByIdParams) => {
  return useAppQuery(
    createUserByIdQueryKey(params),
    async ({ services }) => {
      return services.fakeAPI.getUserById({ id: params.userId });
    },
    {
      staleTime: Infinity,
    },
  );
};

export const useUserByIdInvalidate = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (userId: string) => {
      return queryClient.invalidateQueries(createUserByIdQueryKey({ userId }));
    },
    [queryClient],
  );
};

export const useUserByIdOptimisticUpdater = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (userToUpdate: User) => {
      return queryClient.setQueriesData<FetchUserByIdResponse['data']>(
        createUserByIdQueryKey({ userId: userToUpdate.id }),
        () => {
          return { user: userToUpdate };
        },
      );
    },
    [queryClient],
  );
};
