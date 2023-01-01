import { v4 } from 'uuid';

/* istanbul ignore next */
export function generateRequestId(): string {
  return process.env.NODE_ENV === 'test' ? 'requestId' : v4();
}
