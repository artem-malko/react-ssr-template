import { useMutation } from '@tanstack/react-query';

import { useInvalidateQuery } from 'application/queries/common';
import { UserStatus } from 'application/services/fake/types';
import { useServices } from 'application/services/shared/context';
import { useToast } from 'application/ui/kit/toast/infrastructure/hook';

import { userQueryKeys } from '../common';
import { useUserListOptimisticUpdater } from '../fetch/useUserList';

type Params = {
  useOptimisticUpdate: boolean;
};
export const useEditUser = (params: Params) => {
  const { useOptimisticUpdate } = params;
  const { showToast } = useToast();
  const services = useServices();
  const invalidateQuery = useInvalidateQuery();
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
          invalidateQuery({
            queryKey: userQueryKeys.all(),
          });
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
