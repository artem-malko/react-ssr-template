import { useSelector } from 'react-redux';
import { AppState } from './types';

export const useAppSelector = <T>(selector: (state: AppState) => T) => {
  return useSelector(selector);
};
