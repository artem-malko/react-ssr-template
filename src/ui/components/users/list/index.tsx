import { useUserList } from 'core/queries/users/useUserList';
import { UserStatus } from 'core/services/fake/types';
import { useAppRouter } from 'hooks/useAppRouter';
import { memo, useEffect, useId, useState } from 'react';
import { UsersPage } from 'ui/pages/users';
import { UserTableRow } from './row';

type Props = {
  page: number;
  filterStatus?: UserStatus[];
};
export const UserList = memo<Props>(({ page, filterStatus = [] }) => {
  const [filterStatusState, setFilterStatusState] = useState<UserStatus[]>(filterStatus);
  const { queryResult, invalidateQuery } = useUserList({
    page,
    statusFilter: filterStatusState,
  });
  const { patchPage } = useAppRouter();

  useEffect(() => {
    patchPage<UsersPage>((activePage) => ({
      name: 'users',
      params: {
        ...activePage.params,
        filterStatus: filterStatusState,
      },
    }));
  }, [patchPage, filterStatusState]);

  if (queryResult.error) {
    return (
      <>
        <UserListFilters
          disabled={queryResult.isFetching}
          filterStatus={filterStatusState}
          setFilterStatus={setFilterStatusState}
        />
        <h1>ERROR!</h1>
        <strong>{JSON.stringify(queryResult.error)}</strong>
        <button onClick={() => invalidateQuery()}>Retry</button>
      </>
    );
  }

  if (!queryResult.data) {
    return null;
  }

  return (
    <div style={{ position: 'relative' }}>
      <UserListFilters
        disabled={queryResult.isFetching}
        filterStatus={filterStatusState}
        setFilterStatus={setFilterStatusState}
      />
      {/*
        isFetching won't be processed in Suspense, cause it is not a state of a query
        So, we have to process this status by ourselves
      */}
      {queryResult.isFetching && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255,255,255,.5)',
          }}
        ></div>
      )}
      <table cellPadding={8} cellSpacing={4}>
        <tbody>
          <tr>
            {['#', 'ID', 'Name', 'Status', 'Edit', 'Delete'].map((l) => (
              <td key={l} style={{ borderBottom: '1px solid #999' }}>
                {l}
              </td>
            ))}
          </tr>
          {queryResult.data.users.map((user, i) => (
            <UserTableRow user={user} index={i} key={user.id} />
          ))}
        </tbody>
      </table>
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
