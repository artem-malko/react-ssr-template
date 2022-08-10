import { useNewsQueryMainKey } from 'core/queries/news/common';
import { useUsersQueryMainKey } from 'core/queries/users/common';
import { memo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

type Props = {
  queryKey: typeof useNewsQueryMainKey | typeof useUsersQueryMainKey;
};
export const InvalidateQueryButton = memo<Props>(({ queryKey }) => {
  const queryClient = useQueryClient();
  const onClick = useCallback(() => {
    queryClient.invalidateQueries([queryKey]);
  }, [queryClient, queryKey]);

  return (
    <div style={{ padding: 10 }}>
      <button onClick={onClick}>Invalidate query {queryKey}</button>
    </div>
  );
});
InvalidateQueryButton.displayName = 'InvalidateQueryButton';
