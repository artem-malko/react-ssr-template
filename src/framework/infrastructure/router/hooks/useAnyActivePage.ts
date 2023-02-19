import { useRouterReduxSelector } from '../redux/hooks';
import { AnyAppContext, AnyAppState, AnyPage } from '../types';

const selectAnyActivePage = <S extends AnyAppState>(state: S): S['appContext']['page'] =>
  state.appContext.page;

export const useAnyActivePage = <Page extends AnyPage<string>>() => {
  return useRouterReduxSelector<AnyAppState<AnyAppContext<Page>>, Page>(selectAnyActivePage);
};
