import { memo, useCallback, useEffect, useId, useState } from 'react';

import { useUserList } from 'application/entities/user/queries/fetch/useUserList';
import { usersPageDefaultParams } from 'application/pages/shared';
import { useNavigate } from 'application/shared/hooks/useNavigate';
import { useToggleGlass } from 'application/shared/kit/glass/hook';
import { UserStatus } from 'application/shared/services/fake/types';
import { RaiseError } from 'framework/public/universal';

import { UserTableRow } from './row';

type Props = {
  page: number;
  filterStatus?: UserStatus[];
};
export const UserList = memo<Props>(({ page, filterStatus = [] }) => {
  const toggleGlass = useToggleGlass();

  const [filterStatusState, setFilterStatusState] = useState<UserStatus[]>(filterStatus);
  const userListResult = useUserList({
    page,
    statusFilter: filterStatusState,
  });
  const { navigate } = useNavigate();
  const onPageChange = useCallback(
    (action: 'inc' | 'dec') => {
      const newPageNumber = action === 'inc' ? page + 1 : page - 1;

      navigate((activePage) => ({
        name: 'users',
        params: {
          ...(activePage.name === 'users' ? activePage.params : usersPageDefaultParams),
          page: newPageNumber,
        },
      }));
    },
    [page, navigate],
  );

  useEffect(() => {
    navigate((activePage) => ({
      name: 'users',
      params: {
        ...(activePage.name === 'users' ? activePage.params : usersPageDefaultParams),
        filterStatus: filterStatusState,
      },
    }));
  }, [navigate, filterStatusState]);

  /**
   * isFetching won't be processed in Suspense, cause it is not a state of a query
   * So, we have to process this status by ourselves
   */
  useEffect(() => {
    toggleGlass(userListResult.isFetching, 'list');
  }, [userListResult.isFetching, toggleGlass]);

  if (userListResult.error) {
    return (
      <>
        <UserListFilters
          disabled={userListResult.isFetching}
          filterStatus={filterStatusState}
          setFilterStatus={setFilterStatusState}
        />
        <h1>ERROR!</h1>
        <RaiseError code={userListResult.error.code} />
        <strong>{JSON.stringify(userListResult.error)}</strong>
        <button onClick={() => userListResult.refetch()}>Retry</button>
      </>
    );
  }

  if (!userListResult.data) {
    return null;
  }

  return (
    <div>
      <UserListFilters
        disabled={userListResult.isFetching}
        filterStatus={filterStatusState}
        setFilterStatus={setFilterStatusState}
      />
      <table cellPadding={8} cellSpacing={4}>
        <tbody>
          <tr>
            {['#', 'ID', 'Name', 'Status', 'Edit', 'Delete'].map((l) => (
              <td key={l} style={{ borderBottom: '1px solid #999' }}>
                {l}
              </td>
            ))}
          </tr>
          {userListResult.data.users.map((user, i) => (
            <UserTableRow user={user} index={i} key={user.id} page={page} />
          ))}
        </tbody>
      </table>
      <br />
      <button disabled={page === 1} onClick={() => onPageChange('dec')}>
        Prev page
      </button>
      <button
        disabled={page === Math.ceil(userListResult.data.total / 10)}
        onClick={() => onPageChange('inc')}
      >
        Next page
      </button>
      <br />
    </div>
  );
});
UserList.displayName = 'UserList';

function setFilter(filter: UserStatus, curState: UserStatus[]) {
  if (curState.includes(filter)) {
    return curState.filter((c) => c !== filter);
  }

  return curState.concat(filter);
}
const UserListFilters = memo<{
  disabled: boolean;
  filterStatus: UserStatus[];
  setFilterStatus: (p: (s: UserStatus[]) => UserStatus[]) => void;
}>(({ filterStatus, setFilterStatus, disabled }) => {
  const stableUniqId = useId();
  const inputs: Array<UserStatus> = ['active', 'inactive', 'banned'];
  return (
    <div style={{ display: 'flex', padding: '20px' }}>
      {inputs.map((label) => {
        const id = stableUniqId + label;

        return (
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px' }} key={id}>
            <input
              checked={filterStatus.includes(label)}
              type="checkbox"
              disabled={disabled}
              onChange={() => {
                setFilterStatus((s) => setFilter(label, s));
              }}
              id={id}
            />
            &nbsp;
            <label htmlFor={id} style={{ color: disabled ? '#bbb' : '#121212' }}>
              {label.toUpperCase()}
            </label>
          </div>
        );
      })}
    </div>
  );
});
UserListFilters.displayName = 'UserListFilters';
