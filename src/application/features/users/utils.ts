import { UserStatus } from 'application/entities/user/types';

export function renderStatus(status: UserStatus) {
  switch (status) {
    case 'active':
      return '🟢';
    case 'inactive':
      return '🟠';
    case 'banned':
      return '🔴';
  }
}
