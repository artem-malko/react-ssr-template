export type UserStatus = 'acitve' | 'banned' | 'inactive';

export type User = {
  id: string;
  name: string;
  status: UserStatus;
};

export type FetchUsersResponse = {
  users: User[];
  total: number;
};

export type FetchUserByIdResponse = {
  user: User;
};

export type ModifyUserResponse = {
  id: string;
};
