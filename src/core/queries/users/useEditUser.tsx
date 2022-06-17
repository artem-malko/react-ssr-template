import { UserStatus } from 'core/services/fake/types';
import { useServices } from 'core/services/shared/context';
import { useMutation, useQueryClient } from 'react-query';
import { useToast } from 'ui/kit/toast/infrastructure/hook';
import { useUsersQueryMainKey } from './common';

export const useEditUser = () => {
  const { showToast } = useToast();
  const services = useServices();
  const queryClient = useQueryClient();
  // const userListOptimisticUpdate = useUserListOptimisticUpdater();

  return useMutation(
    (userToUpdate: { id: string; name?: string; status?: UserStatus }) => {
      return services.fakeAPI.updateUserInfo({
        user: userToUpdate,
      });
    },
    {
      onSuccess() {
        showToast({
          body: () => <>User with name {name} has been updated</>,
        });

        /**
         * This query invalidetion updates all active queries
         * which are connected with users:
         * — list
         * — user by id
         */
        queryClient.invalidateQueries([useUsersQueryMainKey]);

        /**
         * This query data optimistic updater updates data in a query cache only
         * Uncomment it to see all problems with optimistic updates in action
         */
        // userListOptimisticUpdate({
        //   id: userId,
        //   name,
        //   status,
        // });
      },
      onError(error) {
        showToast({
          body: () => (
            <>
              Something happen while user updating
              <br />
              {JSON.stringify(error)}
            </>
          ),
        });
      },
    },
  );
};
