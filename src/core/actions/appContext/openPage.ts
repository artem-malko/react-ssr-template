import { Page } from 'core/store/types';
import { createActionConstructor } from '../createActionConstructor';

export const openPage = createActionConstructor<Page>('openPage')
  .attachReducer('appContext', (state, action) => ({
    ...state,
    page: {
      ...action.payload,
    },
  }))
  .createActionCreator();
