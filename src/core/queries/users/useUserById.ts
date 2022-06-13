import { Services } from 'core/services';
import { FetchUserByIdResponse, User } from 'core/services/fake/types';
import { useServices } from 'core/services/shared/context';
import { useAppQuery } from 'infrastructure/query/useAppQuery';
import { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { useUsersQueryMainKey } from './common';

type UserByIdParams = {
  userId: string;
};

const userByIdFetcher = (services: Services, params: UserByIdParams) => {
  return services.fakeAPI.getUserById({ id: params.userId });
};

export const createUserByIdQueryKey = (params: UserByIdParams) => {
  return [useUsersQueryMainKey, 'userById', params.userId];
};
export const useUserById = (params: UserByIdParams) => {
  return useAppQuery(createUserByIdQueryKey(params), ({ services }) => {
    return userByIdFetcher(services, params);
  });
};

export const useUserByIdFetcher = () => {
  const queryClient = useQueryClient();
  const services = useServices();

  return useCallback(
    (params: UserByIdParams) => {
      return queryClient.fetchQuery(createUserByIdQueryKey(params), () =>
        userByIdFetcher(services, params),
      );
    },
    [queryClient, services],
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
