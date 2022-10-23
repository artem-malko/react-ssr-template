import { createDispatchHook, createSelectorHook } from 'react-redux';
import { RouterReduxContext } from '../store/context';

export const useRouterReduxDispatch = createDispatchHook(RouterReduxContext);
export const useRouterReduxSelector = createSelectorHook(RouterReduxContext);
