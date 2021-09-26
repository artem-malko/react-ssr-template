import { openPage } from 'core/signals/page';
import { HttpErrorCode } from 'core/types/http';
import { createSignal } from 'infrastructure/signal';

export const openErrorPage = createSignal('openErrorPage', (code: HttpErrorCode) =>
  openPage({
    name: 'error',
    params: {
      code,
    },
    errorCode: code,
  }),
);
