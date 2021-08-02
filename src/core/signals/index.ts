import { AppState } from 'core/store/types';
import { commonWithSelectors } from 'infrastructure/signal';
import { AnyAction } from 'redux';

export const withSelectors = <S extends { [key: string]: (state: AppState) => any }>(
  selectors: S,
  payload: (params: { [key in keyof S]: ReturnType<S[key]> }) => AnyAction,
) => {
  return commonWithSelectors(selectors, payload);
};
