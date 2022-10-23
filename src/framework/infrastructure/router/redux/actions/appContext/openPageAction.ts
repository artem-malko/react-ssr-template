import { AnyPage } from 'framework/infrastructure/router/types';

export const openAnyPageAction = <Page extends AnyPage<string>>(payload: Page) => ({
  type: 'openPageAction' as const,
  payload,
});

export type OpenAnyPageActionType = ReturnType<typeof openAnyPageAction>;
