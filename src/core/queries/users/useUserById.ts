import { useAppQuery } from 'infrastructure/query/useAppQuery';

export const useUserById = (userId: string) => {
  return useAppQuery(
    ['userById', userId],
    async ({ services }) => {
      return services.fakeAPI.getUserById({ id: userId });
    },
    {
      staleTime: Infinity,
    },
  );
};
