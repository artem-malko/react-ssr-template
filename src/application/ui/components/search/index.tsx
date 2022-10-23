import { useStyles } from 'framework/infrastructure/css/hook';
import { memo, useState } from 'react';
import { styles } from './index.css';

export const Search = memo(() => {
  const css = useStyles(styles);
  const [value, setValue] = useState('');

  return (
    <div className={css('root')}>
      <h2>Search Component</h2>
      Try to input something before NewList will be ready. As you can see, Search component is ready to
      work, even other components are still in loading stage
      <br />
      <br />
      <input type="text" onChange={(e) => setValue(e.target.value)} defaultValue={value} />
      <br />
      <br />
      Your input: <strong>{value}</strong>
    </div>
  );
});
