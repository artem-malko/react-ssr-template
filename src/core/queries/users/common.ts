import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

export const useUsersQueryMainKey = 'users';

export const useUserQueriesInvalidate = () => {
  const queryClient = useQueryClient();

  return useCallback(() => {
    return queryClient.invalidateQueries([useUsersQueryMainKey]);
  }, [queryClient]);
};
