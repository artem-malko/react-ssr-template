import { memo, useCallback, useEffect, useId, useState } from 'react';

import { usersPageDefaultParams } from 'application/pages/shared';

import {
  type UserStatus,
  useEditUser,
  useUserById,
  useUserListOptimisticUpdater,
  useInvalidateAllUserQueries,
  UserStatusComponent,
} from 'application/entities/domain/user';
import { UserForm } from 'application/entities/ui/userForm';
import { useNavigate } from 'application/entities/ui/navigation';

import { useSomethingWentWrongToast } from 'application/shared/hooks/useSomethingWentWrongToast';
import { useToggleGlass } from 'application/shared/kit/glass';
import { useToast } from 'application/shared/kit/toast';

type Props = {
  userId: string;
};
/**
 * You can find two approaches to update data after any mutations
 * The first one — query invalidation (invalidateUserList)
 * The second one — query-cache update (userListOptimisticUpdate)
 */
export const UserEditor = memo<Props>(({ userId }) => {
  const toggleGlass = useToggleGlass();
  const { navigate } = useNavigate();
  const { showToast } = useToast();
  const showSomethingWentWrongToast = useSomethingWentWrongToast();

  const userByIdResult = useUserById({ userId });
  const invalidateAllUserQueries = useInvalidateAllUserQueries();
  const userListOptimisticUpdate = useUserListOptimisticUpdater();

  const optimisticUpdateCheckboxId = useId();
  const [useOptimisticUpdate, setUseOptimisticUpdate] = useState(false);

  const disableActiveUser = useCallback(
    () =>
      navigate((activePage) => ({
        name: 'users',
        params: {
          ...(activePage.name === 'users' ? activePage.params : usersPageDefaultParams),
          activeUserId: undefined,
        },
      })),
    [navigate],
  );

  const { mutate: editUser, isLoading: isMutationInProgress } = useEditUser();
  const onEditUserClick = useCallback(
    (params: { name: string; status: UserStatus }) => {
      editUser(
        { name: params.name, status: params.status, id: userId },
        {
          onSuccess(_, userToUpdate) {
            showToast({
              body: () => (
                <>
                  A user with name {userToUpdate.name} has been updated.
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
              invalidateAllUserQueries();
            }
          },
          onError() {
            showSomethingWentWrongToast({
              description: 'Something happen while user updating!',
            });
          },
        },
      );
    },
    [
      showToast,
      editUser,
      invalidateAllUserQueries,
      useOptimisticUpdate,
      userId,
      userListOptimisticUpdate,
      showSomethingWentWrongToast,
    ],
  );

  useEffect(() => {
    toggleGlass(isMutationInProgress);
  }, [isMutationInProgress, toggleGlass]);

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
        <h1>Edit user: {userByIdResult.data.user.name}</h1>
        <h3>Current use status: {userByIdResult.data.user.status}</h3>
        <h4>Current fetchStatus: {userByIdResult.fetchStatus}</h4>
        <h4>Current query status: {userByIdResult.status}</h4>
        <h4>Current query isError: {userByIdResult.isError.toString()}</h4>
        <h4>Current query isSuccess: {userByIdResult.isSuccess.toString()}</h4>
        <br />
        <h3>User data:</h3>
        <div>
          id: {userByIdResult.data.user.id}&nbsp;
          <UserStatusComponent status={userByIdResult.data.user.status} />
        </div>
        <hr />
        <br />
        <br />
        <label htmlFor={optimisticUpdateCheckboxId}>Use optimistic update&nbsp;</label>
        <input
          type="checkbox"
          id={optimisticUpdateCheckboxId}
          defaultChecked={useOptimisticUpdate}
          onChange={(e) => {
            setUseOptimisticUpdate(e.target.checked);
          }}
        />
        <br />
        <br />
        <UserForm
          onSubmit={(name, status) =>
            onEditUserClick({
              name,
              status,
            })
          }
          initialName={userByIdResult.data.user.name}
          initialStatus={userByIdResult.data.user.status}
        />
        <br />
        <br />

        <button onClick={disableActiveUser}>Close editor</button>
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
