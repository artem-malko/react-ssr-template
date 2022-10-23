/**
 * Each app has its own version, based on git commit hash (recommended way)
 * This param can be used to understand, which version of the app is used on any user device
 */
export function addAppVersion() {
  return {
    appVersion: process.env.APP_VERSION || 'undefined_version',
  };
}

export function getMessageAndStackParamsFromError(
  error: Error,
  options?: {
    defaultMessage?: string;
    stackSize?: number;
  },
): {
  message: string;
  stack: string;
} {
  const opts = {
    defaultMessage: '',
    stackSize: 2048,
    ...options,
  };
  const message = (error && error.toString()) || opts.defaultMessage;
  const stack = (error && error.stack && error.stack.toString()) || 'empty stack';

  return { message, stack: stack.slice(0, opts.stackSize) };
}
