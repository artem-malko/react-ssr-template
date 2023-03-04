import { QueryClient } from '@tanstack/react-query';
import { Middleware } from 'redux';

import { PlatformAPI } from 'framework/infrastructure/platform';
import { AnyAppState, AnyPage } from 'framework/infrastructure/router/types';

import { GetTitle } from '../../types';

type Params<Page extends AnyPage<string>> = {
  queryClient: QueryClient;
  windowApi: PlatformAPI['window'];
  getTitle: GetTitle<Page>;
};
export function createTitleMiddleware<Page extends AnyPage<string>>({
  queryClient,
  windowApi,
  getTitle,
}: Params<Page>): Middleware<Record<string, never>, AnyAppState> {
  let mutableLastTitle = '';

  return (store) => (next) => (action) => {
    next(action);

    const newTitle = getTitle({ queryClient, ...(store.getState().appContext as any) });

    if (mutableLastTitle !== newTitle) {
      mutableLastTitle = newTitle;
      windowApi.setTitle(newTitle);
    }
  };
}
