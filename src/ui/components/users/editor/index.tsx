import { memo, useCallback } from 'react';
import { useAppRouter } from 'hooks/useAppRouter';
import { useMutation } from 'react-query';
import { UserForm } from '../form';
import { UsersPage } from 'ui/pages/users';
import { UserStatus } from 'core/services/fake/types';
import { useServices } from 'core/services/shared/context';
import { useToast } from 'ui/kit/toast/infrastructure/hook';
import { useUserById } from 'core/queries/users/useUserById';
import { useUserListOptimisticUpdater } from 'core/queries/users/useUserList';

type Props = {
  userId: string;
};
/**
 * You can find two approaches to update data after any mutations
 * The first one — query invalidation (invalidateUserList)
 * The second one — query-cache update (userListUpdate)
 */
export const UserEditor = memo<Props>(({ userId }) => {
  const { showToast } = useToast();
  const { patchPage } = useAppRouter();
  // const invalidateUserList = useUserListInvalidate();
  const userListUpdate = useUserListOptimisticUpdater();
  const { queryResult: userByIdResult } = useUserById(userId);
  const disableActiveUser = useCallback(
    () =>
      patchPage<UsersPage>((activePage) => ({
        name: 'users',
        params: {
          ...activePage.params,
          activeUserId: undefined,
        },
      })),
    [patchPage],
  );

  const services = useServices();
  const { mutate: updateUser } = useMutation((userToUpdate: { name?: string; status?: UserStatus }) => {
    return services.fakeAPI.updateUserInfo({
      user: {
        ...userToUpdate,
        id: userId,
      },
    });
  });

  if (userByIdResult.data) {
    return (
      <div>
        <h1>Edit user: {userByIdResult.data.user.name}</h1>
        <h3>Current use status: {userByIdResult.data.user.status}</h3>
        <br />
        <UserForm
          onSubmit={(name, status) => {
            updateUser(
              { name, status },
              {
                onSuccess() {
                  showToast({
                    body: () => <>User with name {name} has been updated</>,
                  });
                  //
                  // invalidateUserList(1);
                  userListUpdate({
                    id: userId,
                    name,
                    status,
                  });
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
                onSettled() {
                  disableActiveUser();
                },
              },
            );
          }}
          initialName={userByIdResult.data.user.name}
          initialStatus={userByIdResult.data.user.status}
        />
        <br />
        <br />
        <button onClick={disableActiveUser}>Cancel</button>
      </div>
    );
  }

  return <></>;
});
UserEditor.displayName = 'UserEditor';

export default UserEditor;
