import { AnyAppState } from '../../types';

export const selectAnyPage = <S extends AnyAppState>(state: S): S['appContext']['page'] =>
  state.appContext.page;
