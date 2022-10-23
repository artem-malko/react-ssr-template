import { useServices } from 'application/services/shared/context';
import { useMutation } from '@tanstack/react-query';
import { useToast } from 'application/ui/kit/toast/infrastructure/hook';
import { useUserQueriesInvalidate } from './common';

export const useDeleteUser = () => {
  const { showToast } = useToast();
  const services = useServices();
  const invalidateUsers = useUserQueriesInvalidate();

  return useMutation(
    (params: { userId: string; name: string }) => {
      return services.fakeAPI.deleteUserById({ id: params.userId });
    },
    {
      onSuccess(_, params) {
        invalidateUsers();
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
