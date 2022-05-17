import { useUserList } from 'core/queries/users/useUserList';
import { UserStatus } from 'core/services/fake/types';
import { useAppRouter } from 'hooks/useAppRouter';
import { memo, useEffect, useId, useMemo, useState } from 'react';
import { UsersPage } from 'ui/pages/users';
import { UserTableRow } from './row';

function setFilter(filter: UserStatus, curState: UserStatus[]) {
  if (curState.includes(filter)) {
    return curState.filter((c) => c !== filter);
  }

  return curState.concat(filter);
}

type Props = {
  page: number;
  filterStatus?: UserStatus[];
};
export const UserList = memo<Props>(({ page, filterStatus = [] }) => {
  const [statusFilter, setStatusFilter] = useState<UserStatus[]>(filterStatus);
  const { queryResult } = useUserList(page, statusFilter);
  const { patchPage } = useAppRouter();
  const activeCheckboxId = useId();
  const inactiveCheckboxId = useId();
  const bannedCheckboxId = useId();
  const renderFilters = useMemo(() => {
    const inputs: Array<{ label: UserStatus; id: string }> = [
      {
        label: 'active',
        id: activeCheckboxId,
      },
      {
        label: 'inactive',
        id: inactiveCheckboxId,
      },
      {
        label: 'banned',
        id: bannedCheckboxId,
      },
    ];

    return (
      <div style={{ display: 'flex', padding: '20px' }}>
        {inputs.map((inp) => (
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px' }} key={inp.id}>
            <input
              checked={statusFilter.includes(inp.label)}
              type="checkbox"
              onChange={() => {
                setStatusFilter((s) => setFilter(inp.label, s));
              }}
              id={inp.id}
            />
            &nbsp;
            <label htmlFor={inp.id}>{inp.label.toUpperCase()}</label>
          </div>
        ))}
      </div>
    );
  }, [activeCheckboxId, inactiveCheckboxId, bannedCheckboxId, statusFilter]);

  useEffect(() => {
    patchPage<UsersPage>((activePage) => ({
      name: 'users',
      params: {
        ...activePage.params,
        filterStatus: statusFilter,
      },
    }));
  }, [patchPage, statusFilter]);

  if (queryResult.data) {
    return (
      <>
        {renderFilters}
        <table cellPadding={8} cellSpacing={4}>
          <tbody>
            <tr>
              <td style={{ borderBottom: '1px solid #999' }}>#</td>
              <td style={{ borderBottom: '1px solid #999' }}>ID</td>
              <td style={{ borderBottom: '1px solid #999' }}>Name</td>
              <td style={{ borderBottom: '1px solid #999' }}>Status</td>
              <td style={{ borderBottom: '1px solid #999' }}></td>
              <td style={{ borderBottom: '1px solid #999' }}></td>
            </tr>
            {queryResult.data.users.map((user, i) => (
              <UserTableRow user={user} index={i} key={user.id} />
            ))}
          </tbody>
        </table>
      </>
    );
  }

  if (queryResult.isError) {
    return (
      <>
        {renderFilters}
        <h1>ERROR!</h1>
        <strong>{JSON.stringify(queryResult.error)}</strong>
      </>
    );
  }

  return <></>;
});
UserList.displayName = 'UserList';
