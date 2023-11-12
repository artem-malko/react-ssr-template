import { ReactNode, useCallback } from 'react';

import { useToast } from '../kit/toast/infrastructure/hook';

export const useSomethingWentWrongToast = () => {
  const { showToast } = useToast();

  return useCallback(
    (params: { description?: ReactNode; error?: Error }) => {
      const { description = 'Something went wrong!', error } = params;
      showToast({
        body: () => (
          <>
            {description}
            {error && (
              <>
                <br />
                {JSON.stringify(error)}
              </>
            )}
          </>
        ),
      });
    },
    [showToast],
  );
};
