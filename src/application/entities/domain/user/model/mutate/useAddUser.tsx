import { useMutation } from '@tanstack/react-query';

import { useApi } from 'application/shared/lib/api';

import { postUserApi } from '../../api/postUser';
import { UserStatus } from '../../types';

export const useAddUser = () => {
  const postUser = useApi(postUserApi);

  return useMutation((userToAdd: { name: string; status: UserStatus }) => {
    return postUser({
      user: userToAdd,
    });
  });
};
