import { memo } from 'react';

export const Preloader = memo<{ purpose?: string }>(({ purpose }) => {
  return <div>Loading ⏱ {purpose && `for ${purpose}`}</div>;
});
