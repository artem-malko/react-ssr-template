import { useConfig } from 'config/react';
import { memo } from 'react';

export const StaticComponent = memo(() => {
  const config = useConfig();

  return (
    <div
      style={{
        padding: 10,
        outline: '1px solid green',
      }}
    >
      <h2>StaticComponent Component</h2>
      This is an example static component without any data fetching.
      <h4>A config usage example</h4>
      This is a field from the config hackerNewsAPIURL: {config.hackerNewsAPIURL}
    </div>
  );
});
