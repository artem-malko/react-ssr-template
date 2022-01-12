import { createStyles } from 'infrastructure/css/hook';

export const styles = createStyles({
  root: {
    paddingTop: 32,

    _big: {
      paddingTop: 50,
    },

    '@media screen and (max-width: 1024px)': {
      _tablet: {
        paddingTop: 40,
      },
    },
  },

  title: {
    _red: {
      color: 'red',
    },
  },

  list: {
    padding: 10,

    _red: {
      background: 'red',
    },
  },
});
