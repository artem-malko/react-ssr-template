import { memo, useCallback, useEffect, useId, useState } from 'react';

import { useUserById } from 'application/entities/user/model/fetch/useUserById';
import { useUserListOptimisticUpdater } from 'application/entities/user/model/fetch/useUserList';
import { useInvalidateAllLists } from 'application/entities/user/model/invalidate/useInvalidateAllLists';
import { useEditUser } from 'application/entities/user/model/mutate/useEditUser';
import { UserStatus } from 'application/entities/user/types';
import { usersPageDefaultParams } from 'application/pages/shared';
import { useNavigate } from 'application/shared/hooks/useNavigate';
import { useToggleGlass } from 'application/shared/kit/glass/hook';
import { useToast } from 'application/shared/kit/toast/infrastructure/hook';

import { UserForm } from '../form';
import { renderStatus } from '../utils';

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
  const optimisticUpdateCheckboxId = useId();
  const [useOptimisticUpdate, setUseOptimisticUpdate] = useState(false);
  const { showToast } = useToast();

  const userByIdResult = useUserById({ userId });
  const invalidateAllLists = useInvalidateAllLists();
  const userListOptimisticUpdate = useUserListOptimisticUpdater();
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
              invalidateAllLists();
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
    },
    [showToast, editUser, invalidateAllLists, useOptimisticUpdate, userId, userListOptimisticUpdate],
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
          id: {userByIdResult.data.user.id}&nbsp;${renderStatus(userByIdResult.data.user.status)}
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
