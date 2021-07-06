import { memo } from 'react';

export const StaticComponent = memo(() => {
  return (
    <div
      style={{
        padding: 10,
        outline: '1px solid green',
      }}
    >
      This is an example static component without any data fetching.
    </div>
  );
});
