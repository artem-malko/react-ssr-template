import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { openPageSignal as openPageSignal } from 'core/signals/page';
import { Page } from 'core/store/types';

/**
 * This hook can be used, where you need to open a new page in an event handler
 */
export const useOpenPage = () => {
  const dispatch = useDispatch();
  const openPage = useCallback(
    (page: Page, useReplace?: boolean) => {
      dispatch(openPageSignal(page, useReplace));
    },
    [dispatch],
  );

  return openPage;
};
