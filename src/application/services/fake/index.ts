import { AppLogger } from 'framework/infrastructure/logger';
import { Requester } from 'framework/infrastructure/request/types';

import {
  FetchUserByIdResponse,
  FetchUsersResponse,
  ModifyUserResponse,
  User,
  UserStatus,
} from './types';

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
          withCredentials: false,
        },
      ).then((res) => res.data);
    },

    getUserById: async (params: { id: string }) => {
      return request<FetchUserByIdResponse>(`${baseURL}/${params.id}`, {
        withCredentials: false,
      }).then((res) => res.data);
    },

    addUser: async (params: { user: Omit<User, 'id'> }) => {
      return request<ModifyUserResponse>(`${baseURL}`, {
        method: 'POST',
        data: params.user,
        withCredentials: false,
      });
    },

    updateUserInfo: async (params: { user: Partial<User> & { id: string } }) => {
      return request<ModifyUserResponse>(`${baseURL}/${params.user.id}`, {
        method: 'PATCH',
        data: params.user,
        withCredentials: false,
      });
    },

    deleteUserById: async (params: { id: string }) => {
      return request<ModifyUserResponse>(`${baseURL}/${params.id}`, {
        method: 'DELETE',
        withCredentials: false,
      });
    },
  };
};
export type FakeAPIService = ReturnType<typeof createFakeAPIService>;
