import { memo } from 'react';

import { useAddUser } from 'application/queries/users/useAddUser';

import { UserForm } from '../form';

export const AddUser = memo(() => {
  const { mutate: addUser, isLoading: isMutationInProgress } = useAddUser();

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
