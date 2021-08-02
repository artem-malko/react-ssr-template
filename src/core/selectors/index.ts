import { AppState } from 'core/store/types';

export const selectPage = (state: AppState) => state.appContext.page;
