import { memo } from 'react';

import { useInvalidateAllLists } from 'application/entities/user/model/invalidate/useInvalidateAllLists';
import { useAddUser } from 'application/entities/user/model/mutate/useAddUser';
import { useGlassEffect } from 'application/shared/kit/glass/hook';

import { UserForm } from '../form';

export const AddUser = memo(() => {
  const { mutate: addUser, isLoading: isMutationInProgress } = useAddUser();

  const invalidateAllLists = useInvalidateAllLists();

  useGlassEffect(isMutationInProgress, 'not_existed_galss_boundary');

  return (
    <div
      style={{
        position: 'relative',
        padding: 10,
        border: '2px solid #262626',
        backgroundColor: '#fefefe',
      }}
    >
      <h1>Add user</h1>
      <br />
      <UserForm
        resetOnSubmit
        onSubmit={(name, status) => {
          addUser(
            { name, status },
            {
              onSuccess() {
                invalidateAllLists();
              },
            },
          );
        }}
      />
    </div>
  );
});
AddUser.displayName = 'AddUser';
