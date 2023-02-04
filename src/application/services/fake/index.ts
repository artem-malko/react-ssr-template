import {
  FetchUserByIdResponse,
  FetchUsersResponse,
  ModifyUserResponse,
  User,
  UserStatus,
} from './types';

import type { AppLogger, Requester } from 'framework/public/types';

type Config = {
  apiURL: string;
};

type CreateFakeAPIServiceParams = {
  request: Requester;
  config: Config;
  appLogger: AppLogger;
};
/**
 * This service is made to demonstrate useMutation/invalidate queries with react-query
 * You can delete it at any time
 */
export const createFakeAPIService = ({ request, config }: CreateFakeAPIServiceParams) => {
  const baseURL = `${config.apiURL}/users`;
  const baseRequestParams: Record<'credentials', RequestCredentials> = {
    credentials: 'same-origin',
  };

  return {
    getUsers: async (params: { page: number; status?: UserStatus[] }) => {
      const { page, status } = params;
      const limit = 10;
      const offset = (page - 1) * limit;
      const URLWithoutStatus = `${baseURL}?limit=${limit}&offset=${offset}`;

      return request<FetchUsersResponse>(
        status?.length
          ? `${URLWithoutStatus}&${status.map((s) => `status=${s}`).join('&')}`
          : URLWithoutStatus,
        {
          method: 'get',
          ...baseRequestParams,
        },
      ).then((res) => res.data);
    },

    getUserById: async (params: { id: string }) => {
      return request<FetchUserByIdResponse>(`${baseURL}/${params.id}`, {
        method: 'get',
        ...baseRequestParams,
      }).then((res) => res.data);
    },

    addUser: async (params: { user: Omit<User, 'id'> }) => {
      return request<ModifyUserResponse>(`${baseURL}`, {
        method: 'post',
        body: params.user,
        ...baseRequestParams,
      });
    },

    updateUserInfo: async (params: { user: Partial<User> & { id: string } }) => {
      return request<ModifyUserResponse>(`${baseURL}/${params.user.id}`, {
        method: 'patch',
        body: params.user,
        ...baseRequestParams,
      });
    },

    deleteUserById: async (params: { id: string }) => {
      return request<ModifyUserResponse>(`${baseURL}/${params.id}`, {
        method: 'delete',
        ...baseRequestParams,
      });
    },
  };
};
export type FakeAPIService = ReturnType<typeof createFakeAPIService>;
