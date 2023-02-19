import { createApi } from 'application/shared/lib/api';

import { baseRequestParams } from './shared';
import { User } from '../types';

type ApiParams = { user: Partial<User> & { id: string } };

type ApiResponse = {
  data: {
    id: string;
  };
};

export const patchUserApi = createApi<ApiParams, ApiResponse>(({ user }, { config, request }) => {
  return request(`${config.fakeCrudApi}/users/${user.id}`, {
    method: 'patch',
    body: user,
    ...baseRequestParams,
  });
});
