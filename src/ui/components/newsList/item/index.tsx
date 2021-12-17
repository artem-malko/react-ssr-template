import { memo } from 'react';

const Item = memo<{ title: string; onHover: () => void }>(({ title, onHover }) => {
  console.log('render NewsList Item');
  return <div onMouseEnter={onHover}>{title}</div>;
});

export default Item;
