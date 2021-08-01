import { AppState } from 'core/store/types';
import { CreateCommonActionConstructor } from 'infrastructure/actions';

export function createActionConstructor<
  // eslint-disable-next-line @typescript-eslint/ban-types
  Payload extends object | undefined = undefined,
>(type: string) {
  return new CreateCommonActionConstructor<AppState, Payload>(type);
}
