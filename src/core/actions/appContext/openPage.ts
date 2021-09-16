import { Page } from 'core/store/types';
import { createActionConstructor } from '../createActionConstructor';

export const openPageAction = createActionConstructor<Page>('openPage')
  .attachReducer('appContext', (state, action) => ({
    ...state,
    page: {
      ...action.payload,
    },
  }))
  .createActionCreator();
