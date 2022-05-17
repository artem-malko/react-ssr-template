import { UserStatus } from 'core/services/fake/types';
import { memo, useEffect, useState } from 'react';

type Props = {
  onSubmit: (name: string, userStatus: UserStatus) => void;
  resetOnSubmit?: boolean;
  initialName?: string;
  initialStatus?: UserStatus;
};
export const UserForm = memo<Props>(
  ({ onSubmit, initialName = '', initialStatus = 'active', resetOnSubmit = false }) => {
    const [name, setName] = useState(initialName);
    const [status, setStatus] = useState<UserStatus>(initialStatus);

    useEffect(() => {
      setName(initialName);
    }, [initialName]);

    useEffect(() => {
      setStatus(initialStatus);
    }, [initialStatus]);

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(name, status);

          if (resetOnSubmit) {
            setName('');
            setStatus('active');
          }
        }}
      >
        <label>Input the name</label>
        <br />
        <input value={name} onChange={(e) => setName(e.target.value)} required />
        <br />
        <br />
        <label>Select the status</label>
        <br />
        <select value={status} onChange={(e) => setStatus(e.target.value as UserStatus)}>
          <option value="active">active</option>
          <option value="inactive">inactive</option>
          <option value="banned">banned</option>
        </select>
        <br />
        <br />
        <button type="submit">Submit!!!!</button>
      </form>
    );
  },
);
UserForm.displayName = 'UserForm';
