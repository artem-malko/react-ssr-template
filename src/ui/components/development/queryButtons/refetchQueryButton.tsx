import { useNewsQueryMainKey } from 'core/queries/news/common';
import { useUsersQueryMainKey } from 'core/queries/users/common';
import { memo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

type Props = {
  queryKey: typeof useNewsQueryMainKey | typeof useUsersQueryMainKey;
};
export const RefetchQueryButton = memo<Props>(({ queryKey }) => {
  const queryClient = useQueryClient();
  const onClick = useCallback(() => {
    console.log('qweqwe: ', queryKey);
    queryClient.refetchQueries([queryKey]);
  }, [queryClient, queryKey]);

  return (
    <div style={{ padding: 10 }}>
      <button onClick={onClick}>Refetch query {queryKey}</button>
    </div>
  );
});
RefetchQueryButton.displayName = 'RefetchQueryButton';
