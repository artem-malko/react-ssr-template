import { useQueryClient } from '@tanstack/react-query';
import { memo, useCallback } from 'react';

import { useNewsQueryMainKey } from 'application/queries/news/common';
import { useUsersQueryMainKey } from 'application/queries/users/common';

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
