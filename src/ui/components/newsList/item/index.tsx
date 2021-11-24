import { memo } from 'react';

export const Item = memo<{ title: string; onHover: () => void }>(({ title, onHover }) => {
  return <div onMouseEnter={onHover}>{title}</div>;
});
