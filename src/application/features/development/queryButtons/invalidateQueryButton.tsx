import { QueryKey, useQueryClient } from '@tanstack/react-query';
import { memo, useCallback } from 'react';

type Props = {
  queryKey: QueryKey;
};
export const InvalidateQueryButton = memo<Props>(({ queryKey }) => {
  const queryClient = useQueryClient();
  const onClick = useCallback(() => {
    queryClient.invalidateQueries([queryKey]);
  }, [queryClient, queryKey]);

  return (
    <div style={{ padding: 10 }}>
      <button onClick={onClick}>Invalidate query {JSON.stringify(queryKey)}</button>
    </div>
  );
});
InvalidateQueryButton.displayName = 'InvalidateQueryButton';
