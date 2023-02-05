import { QueryKey, useQueryClient } from '@tanstack/react-query';
import { memo, useCallback } from 'react';

type Props = {
  queryKey: QueryKey;
};
export const RefetchQueryButton = memo<Props>(({ queryKey }) => {
  const queryClient = useQueryClient();
  const onClick = useCallback(() => {
    queryClient.refetchQueries([queryKey]);
  }, [queryClient, queryKey]);

  return (
    <div style={{ padding: 10 }}>
      <button onClick={onClick}>Refetch query {JSON.stringify(queryKey)}</button>
    </div>
  );
});
RefetchQueryButton.displayName = 'RefetchQueryButton';
