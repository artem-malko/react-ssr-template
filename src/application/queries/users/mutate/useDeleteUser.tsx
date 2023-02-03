import { useMutation } from '@tanstack/react-query';

import { useServices } from 'application/services/shared/context';
import { useToast } from 'application/ui/kit/toast/infrastructure/hook';
import { useInvalidateQuery } from 'lib/hooks/useInvalidateQuery';

import { userQueryKeys } from '../common';

export const useDeleteUser = () => {
  const { showToast } = useToast();
  const services = useServices();
  const invalidateQuery = useInvalidateQuery();

  return useMutation(
    (params: { userId: string; name: string }) => {
      return services.fakeAPI.deleteUserById({ id: params.userId });
    },
    {
      onSuccess(_, params) {
        invalidateQuery({
          queryKey: userQueryKeys.all(),
        });
        showToast({
          body: () => <>User with name {params.name} has been deleted!</>,
        });
      },
      onError(error) {
        showToast({
          body: () => (
            <>
              Something happen while user deletion
              <br />
              {JSON.stringify(error)}
            </>
          ),
        });
      },
    },
  );
};
