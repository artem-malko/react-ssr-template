import { FetchUserByIdResponse, User } from 'core/services/fake/types';
import { useAppQuery } from 'infrastructure/query/useAppQuery';
import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

const userByIdQueryName = 'userById';
export const useUserById = (userId: string) => {
  return useAppQuery(
    [userByIdQueryName, userId],
    async ({ services }) => {
      return services.fakeAPI.getUserById({ id: userId });
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
      return queryClient.invalidateQueries([userByIdQueryName, userId]);
    },
    [queryClient],
  );
};

export const useUserByIdOptimisticUpdater = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (userToUpdate: User) => {
      return queryClient.setQueriesData<FetchUserByIdResponse['data']>(
        [userByIdQueryName, userToUpdate.id],
        () => {
          return { user: userToUpdate };
        },
      );
    },
    [queryClient],
  );
};
