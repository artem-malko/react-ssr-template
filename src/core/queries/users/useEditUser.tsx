import { UserStatus } from 'core/services/fake/types';
import { useServices } from 'core/services/shared/context';
import { useMutation } from 'react-query';
import { useToast } from 'ui/kit/toast/infrastructure/hook';
import { useUserQueriesInvalidate } from './common';
import { useUserListOptimisticUpdater } from './useUserList';

type Params = {
  useOptimisticUpdate: boolean;
};
export const useEditUser = (params: Params) => {
  const { useOptimisticUpdate } = params;
  const { showToast } = useToast();
  const services = useServices();
  const invalidateUsers = useUserQueriesInvalidate();
  const userListOptimisticUpdate = useUserListOptimisticUpdater();

  return useMutation(
    (userToUpdate: { id: string; name: string; status: UserStatus }) => {
      return services.fakeAPI.updateUserInfo({
        user: userToUpdate,
      });
    },
    {
      onSuccess(_, userToUpdate) {
        showToast({
          body: () => (
            <>
              User with name {userToUpdate.name} has been updated.
              <br />
              The list has been updated via{' '}
              <strong>{useOptimisticUpdate ? 'optimistic update' : 'data invaliation'}</strong>
            </>
          ),
        });

        if (useOptimisticUpdate) {
          /**
           * This query data optimistic updater updates data in a query cache only
           * Uncomment it to see all problems with optimistic updates in action
           */
          userListOptimisticUpdate(userToUpdate);
        } else {
          /**
           * This query invalidetion updates all active queries
           * which are connected with users:
           * — list
           * — user by id
           */
          invalidateUsers();
        }
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
