import { useServices } from 'core/services/shared/context';
import { useMutation, useQueryClient } from 'react-query';
import { useToast } from 'ui/kit/toast/infrastructure/hook';
import { useUsersQueryMainKey } from './common';

export const useDeleteUser = () => {
  const { showToast } = useToast();
  const services = useServices();
  const queryClient = useQueryClient();

  return useMutation(
    (params: { userId: string; name: string }) => {
      return services.fakeAPI.deleteUserById({ id: params.userId });
    },
    {
      onSuccess(_, params) {
        queryClient.invalidateQueries([useUsersQueryMainKey]);
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
