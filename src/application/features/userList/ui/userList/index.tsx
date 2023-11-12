import { memo, useCallback, useEffect, useId } from 'react';

import { usersPageDefaultParams } from 'application/pages/shared';

import { useUserList, type UserStatus } from 'application/entities/domain/user';
import { useNavigate } from 'application/entities/ui/navigation';

import { useToggleGlass } from 'application/shared/kit/glass';

import { UserTableRow } from '../row';

type Props = {
  page: number;
  filterStatus?: UserStatus[];
};
/**
 * @FSD_TODO split to two different features: filters and list. Merge in widgets
 */
export const UserList = memo<Props>(({ page, filterStatus = [] }) => {
  const toggleGlass = useToggleGlass();
  const { data, isFetching, isRefetchError, refetch } = useUserList({
    page,
    statusFilter: filterStatus,
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

  /**
   * isFetching won't be processed in Suspense, cause it is not a state of a query
   * So, we have to process this status by ourselves
   */
  useEffect(() => {
    toggleGlass(isFetching, 'list');
  }, [isFetching, toggleGlass]);

  return (
    <div>
      {isRefetchError && (
        <div>
          Data might be stale{' '}
          <button type="button" onClick={() => refetch()}>
            Update
          </button>
        </div>
      )}
      <UserListFilters disabled={false} filterStatus={filterStatus} />
      <table cellPadding={8} cellSpacing={4}>
        <tbody>
          <tr>
            {['#', 'ID', 'Name', 'Status', 'Edit', 'Delete'].map((l) => (
              <td key={l} style={{ borderBottom: '1px solid #999' }}>
                {l}
              </td>
            ))}
          </tr>
          {data.users.map((user, i) => (
            <UserTableRow user={user} index={i} key={user.id} page={page} />
          ))}
        </tbody>
      </table>
      <br />
      <button disabled={page === 1} onClick={() => onPageChange('dec')}>
        Prev page
      </button>
      <button disabled={page === Math.ceil(data.total / 10)} onClick={() => onPageChange('inc')}>
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
}>(({ filterStatus, disabled }) => {
  const stableUniqId = useId();
  const inputs: Array<UserStatus> = ['active', 'inactive', 'banned'];
  const { navigate } = useNavigate();
  const onFilterChange = useCallback(
    (status: UserStatus) => {
      const newFilters = setFilter(status, filterStatus);
      navigate((activePage) => ({
        name: 'users',
        params: {
          ...(activePage.name === 'users' ? activePage.params : usersPageDefaultParams),
          filterStatus: newFilters,
        },
      }));
    },
    [navigate, filterStatus],
  );

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
                onFilterChange(label);
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
