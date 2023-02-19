import { memo, useMemo } from 'react';

import { UserStatus as UserStatusType } from '../../types';

type Props = {
  status: UserStatusType;
};

export const UserStatus = memo<Props>(({ status }) => {
  const statusIcon = useMemo(() => {
    switch (status) {
      case 'active':
        return '🟢';
      case 'inactive':
        return '🟠';
      case 'banned':
        return '🔴';
    }
  }, [status]);

  return <div>{statusIcon}</div>;
});
