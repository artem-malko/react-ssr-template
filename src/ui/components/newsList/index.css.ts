import { createStyles } from 'infrastructure/css/hook';

export const styles = createStyles({
  root: {
    paddingTop: '32px',
    margin: 0,
    boxSizing: 'border-box',

    _big: {
      paddingTop: 50,
    },

    '@media screen and (max-width: 1024px)': {
      _tablet: {
        display: 'inline',
      },
    },
  },

  list: {
    padding: 10,
    outline: '1px solid blue',
  },
});
