import { memo } from 'react';

import { useStyles } from 'framework/public/styles';

import { styles } from './styles.css';

const Item = memo<{ title: string; onHover: (title: string) => void }>(({ title, onHover }) => {
  const css = useStyles(styles);

  console.log('render NewsList Item');
  return (
    <div onMouseEnter={() => onHover(title)} className={css('item')}>
      {title}
    </div>
  );
});

export default Item;
