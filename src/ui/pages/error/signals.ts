import { HttpCode } from 'core/shared/httpCode';
import { openPage } from 'core/signals/page';
import { createSignal } from 'infrastructure/signal';

export const openErrorPage = createSignal('openErrorPage', (code: HttpCode) =>
  openPage({
    name: 'error',
    params: {
      code,
    },
    errorCode: code,
  }),
);
