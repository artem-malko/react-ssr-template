import { useMutation } from '@tanstack/react-query';

import { useToast } from 'application/shared/kit/toast/infrastructure/hook';
import { useServices } from 'application/shared/services/shared/context';
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
