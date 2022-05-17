export type UserStatus = 'active' | 'banned' | 'inactive';

export type User = {
  id: string;
  name: string;
  status: UserStatus;
};

export type FetchUsersResponse = {
  data: {
    users: User[];
    total: number;
  };
};

export type FetchUserByIdResponse = {
  data: {
    user: User;
  };
};

export type ModifyUserResponse = {
  data: {
    id: string;
  };
};
