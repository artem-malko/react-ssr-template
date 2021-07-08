import { memo, useState } from 'react';

export const Search = memo(() => {
  const [value, setValue] = useState('');

  return (
    <div style={{ padding: '10px 20px', outline: '1px solid violet', background: 'rgba(0,0,0,0.1)' }}>
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
