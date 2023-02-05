import { memo } from 'react';

import { useAddUser } from 'application/entities/user/queries/mutate/useAddUser';
import { useGlassEffect } from 'application/shared/kit/glass/hook';

import { UserForm } from '../form';

export const AddUser = memo(() => {
  const { mutate: addUser, isLoading: isMutationInProgress } = useAddUser();

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
          addUser({ name, status });
        }}
      />
    </div>
  );
});
AddUser.displayName = 'AddUser';
