import { noop } from 'lib/lodash';

/**
 * Any dynamic import retry creator
 *
 * @example
 *
 * const anyDynamicImportRetry = dynamicImportRetryCreator();
 * const lodash = anyDynamicImportRetry(() => import('lodash'))
 *
 * function foo() {
 *   lodash.then((_) => _.join(['Hello', 'World'], '');
 * }
 */
export function dynamicImportRetryCreator<T>(
  loader: () => Promise<T>,
  options?: {
    retriesCount?: number;
    retriesInterval?: number;
    onError?: (error: Error) => void;
  },
): () => Promise<T> {
  const { retriesCount = 5, retriesInterval = 1000, onError = noop } = options || {};

  return function retry(retriesLeft = retriesCount, interval = retriesInterval) {
    return new Promise<T>((resolve, reject) => {
      loader()
        .then(resolve)
        .catch((error: Error) => {
          onError(error);

          if (retriesLeft === 0) {
            return reject(error);
          }

          setTimeout(() => {
            const nextTimeoutMs = interval + interval * (retriesCount - retriesLeft);

            retry(retriesLeft - 1, nextTimeoutMs).then(resolve, reject);
          }, interval);
        });
    });
  };
}
