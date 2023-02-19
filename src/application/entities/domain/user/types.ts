export type UserStatus = 'active' | 'banned' | 'inactive';

export type User = {
  id: string;
  name: string;
  status: UserStatus;
};
