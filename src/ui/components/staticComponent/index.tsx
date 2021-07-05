import { memo } from 'react';

export const StaticComponent = memo(() => {
  return <div>This is an example static component without any data fetching.</div>;
});
