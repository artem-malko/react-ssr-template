import { memo } from 'react';

import { useInvalidateAllUserQueries, useAddUser } from 'application/entities/domain/user';
import { UserForm } from 'application/entities/ui/userForm';

import { useGlassEffect } from 'application/shared/kit/glass';

export const AddUser = memo(() => {
  const { mutate: addUser, isPending: isMutationInProgress } = useAddUser();

  const invalidateAllUserQueries = useInvalidateAllUserQueries();

  useGlassEffect(isMutationInProgress, 'not_existed_glass_boundary');

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
                invalidateAllUserQueries();
              },
            },
          );
        }}
      />
    </div>
  );
});
AddUser.displayName = 'AddUser';
