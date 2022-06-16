import { memo, useCallback } from 'react';
import { useAppRouter } from 'hooks/useAppRouter';
import { UserForm } from '../form';
import { UsersPage } from 'ui/pages/users';
import { useUserById } from 'core/queries/users/useUserById';
import { useEditUser } from 'core/queries/users/useEditUser';

type Props = {
  userId: string;
};
/**
 * You can find two approaches to update data after any mutations
 * The first one — query invalidation (invalidateUserList)
 * The second one — query-cache update (userListOptimisticUpdate)
 */
export const UserEditor = memo<Props>(({ userId }) => {
  const { patchPage } = useAppRouter();

  const { queryResult: userByIdResult } = useUserById({ userId });
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
  const { mutate: editUser, isLoading: isMutationInProgress } = useEditUser();

  if (userByIdResult.data) {
    return (
      <div
        style={{
          position: 'relative',
          padding: 10,
          border: '2px solid #262626',
          backgroundColor: '#fefefe',
        }}
      >
        {isMutationInProgress && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255,255,255,.5)',
            }}
          ></div>
        )}
        <h1>Edit user: {userByIdResult.data.user.name}</h1>
        <h3>Current use status: {userByIdResult.data.user.status}</h3>
        <h4>Current fetchStatus: {userByIdResult.fetchStatus}</h4>
        <h4>Current query status: {userByIdResult.status}</h4>
        <h4>Current query isError: {userByIdResult.isError.toString()}</h4>
        <h4>Current query isSuccess: {userByIdResult.isSuccess.toString()}</h4>
        <br />
        <UserForm
          onSubmit={(name, status) => {
            editUser(
              { name, status, id: userId },
              {
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

  if (userByIdResult.error) {
    return <button onClick={disableActiveUser}>Cancel</button>;
  }

  return <></>;
});
UserEditor.displayName = 'UserEditor';

export default UserEditor;
