import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Preloader } from 'application/shared/kit/preloader';
import { ComponentType, PropsWithChildren, ReactNode, Suspense, memo, useState } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

type Props = {
  loadingFallback?: ReactNode;
  errorFallback?: ComponentType<FallbackProps>;
};
/**
 * Just Tring to handle loading/error state in a React-way
 * WIP
 */
export const ReactQueryBoundary = memo<PropsWithChildren<Props>>(
  ({ children, loadingFallback, errorFallback }) => {
    return (
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={errorFallback || DefaultError}>
            <Suspense fallback={loadingFallback || <DefaultLoading />}>{children}</Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    );
  },
);
ReactQueryBoundary.displayName = 'ReactQueryBoundary';

const DefaultLoading = memo(() => {
  const [n, setN] = useState(0);
  return (
    <div>
      <div>Interactive preloader! n is {n}</div>
      <button onClick={() => setN(n + 1)}>increase n</button>
      <Preloader />
    </div>
  );
});
DefaultLoading.displayName = 'DefaultLoading';

const DefaultError = memo<FallbackProps>(({ resetErrorBoundary }) => {
  return (
    <div>
      <button type="button" onClick={resetErrorBoundary}>
        🔄 Try to refetch data 🔄
      </button>
    </div>
  );
});
DefaultError.displayName = 'DefaultError';
