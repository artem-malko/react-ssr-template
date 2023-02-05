import { UserStatus } from 'application/shared/services/fake/types';

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
