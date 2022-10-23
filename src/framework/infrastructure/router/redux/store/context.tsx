import { createContext } from 'react';
import { ReactReduxContextValue } from 'react-redux';
import { AnyAction } from 'redux';

/**
 * This is a mocked store for a custom redux context
 * A real store will be added in Provider.
 * Such context allows to have several individual redux stores
 */
export const RouterReduxContext: React.Context<ReactReduxContextValue<any, AnyAction>> = createContext(
  {} as ReactReduxContextValue<any, AnyAction>,
);
