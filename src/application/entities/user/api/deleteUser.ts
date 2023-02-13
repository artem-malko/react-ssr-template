import { createApi } from 'application/shared/lib/api/createApi';

import { baseRequestParams } from './shared';

type ApiParams = { id: string };

type ApiResponse = {
  data: {
    id: string;
  };
};

export const deleteUserApi = createApi<ApiParams, ApiResponse>(({ id }, { config, request }) => {
  return request(`${config.fakeCrudApi}/users/${id}`, {
    method: 'delete',
    ...baseRequestParams,
  });
});
