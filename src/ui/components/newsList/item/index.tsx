import { memo } from 'react';

const Item = memo<{ title: string; onHover: (title: string) => void }>(({ title, onHover }) => {
  console.log('render NewsList Item');
  return <div onMouseEnter={() => onHover(title)}>{title}</div>;
});

export default Item;
