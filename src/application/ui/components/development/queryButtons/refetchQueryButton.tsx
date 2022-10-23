import { useQueryClient } from '@tanstack/react-query';
import { memo, useCallback } from 'react';

import { useNewsQueryMainKey } from 'application/queries/news/common';
import { useUsersQueryMainKey } from 'application/queries/users/common';

type Props = {
  queryKey: typeof useNewsQueryMainKey | typeof useUsersQueryMainKey;
};
export const RefetchQueryButton = memo<Props>(({ queryKey }) => {
  const queryClient = useQueryClient();
  const onClick = useCallback(() => {
    queryClient.refetchQueries([queryKey]);
  }, [queryClient, queryKey]);

  return (
    <div style={{ padding: 10 }}>
      <button onClick={onClick}>Refetch query {queryKey}</button>
    </div>
  );
});
RefetchQueryButton.displayName = 'RefetchQueryButton';
