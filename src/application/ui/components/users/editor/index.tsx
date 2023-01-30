import { memo, useCallback, useEffect, useId, useState } from 'react';

import { useNavigate } from 'application/main/hooks/useNavigate';
import { useUserById } from 'application/queries/users/fetch/useUserById';
import { useEditUser } from 'application/queries/users/mutate/useEditUser';
import { useToggleGlass } from 'application/ui/kit/glass/hook';
import { usersPageDefaultParams } from 'application/ui/pages/users';

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

  const userByIdResult = useUserById({ userId });
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
  const { mutate: editUser, isLoading: isMutationInProgress } = useEditUser({ useOptimisticUpdate });

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
          onSubmit={(name, status) => {
            editUser({ name, status, id: userId });
          }}
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
