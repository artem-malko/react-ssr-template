import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useUsersQueryMainKey = 'users';

export const useUserQueriesInvalidate = () => {
  const queryClient = useQueryClient();

  return useCallback(() => {
    return queryClient.invalidateQueries([useUsersQueryMainKey]);
  }, [queryClient]);
};
