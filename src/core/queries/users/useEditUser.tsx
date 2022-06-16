import { UserStatus } from 'core/services/fake/types';
import { useServices } from 'core/services/shared/context';
import { useMutation } from 'react-query';
import { useToast } from 'ui/kit/toast/infrastructure/hook';
import { useUserListInvalidate } from './useUserList';

export const useEditUser = () => {
  const { showToast } = useToast();
  const services = useServices();
  const invalidateUserList = useUserListInvalidate();
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

        invalidateUserList({ page: 1 });
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
