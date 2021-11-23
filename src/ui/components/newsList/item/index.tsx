import { memo } from 'react';

export const Item = memo<{ title: string }>(({ title }) => {
  return <div>{title}</div>;
});
