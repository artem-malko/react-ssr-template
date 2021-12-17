import { noop } from 'lib/lodash';
import { Component, ComponentType, lazy, LazyExoticComponent, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { dynamicImportRetryCreator } from './retry';

interface LazyComponentModule<Props> {
  ['default']: React.ComponentType<Props>;
}

interface LazyProps<Props> {
  loader: () => Promise<LazyComponentModule<Props>>;
  render: (component: LazyExoticComponent<ComponentType<Props>>) => JSX.Element | false;
  fallback?: (asyncStatus: AsyncStatus) => JSX.Element;
}

interface LazyState<Props> {
  Comp: LazyExoticComponent<ComponentType<Props>>;
}

type AsyncStatus = 'loading' | 'error';

/**
 * Every React.lazy call inside render has to be:
 * — wrapped with Suspense to show a preloader, while component's code is loading
 * — wrapped with ErrorBoundary to show a placeholder in a error case
 *
 * @TODO add more logic
 * — prevent fast switch from a loading preloader to a component
 * — more logic onErrorReset
 * — do not retry on offline mode
 */
export function createLazyComponentLoader(
  logError: (error: Error) => void = noop,
  defaultPlaceholder = <></>,
) {
  return class Lazy<Props> extends Component<LazyProps<Props>, LazyState<Props>> {
    public static displayName = 'LazyComponentLoader';

    constructor(props: LazyProps<Props>) {
      super(props);
      this.state = {
        Comp: lazy(this.importWithRetries),
      };
    }

    public render() {
      const loadingPlaceholder = this.props.fallback?.('loading') || defaultPlaceholder;
      const errorFallback = this.props.fallback?.('error') || defaultPlaceholder;

      return (
        <ErrorBoundary fallback={errorFallback}>
          <Suspense fallback={loadingPlaceholder}>{this.props.render(this.state.Comp)}</Suspense>
        </ErrorBoundary>
      );
    }

    /**
     * Start dynamic import with retries
     */
    private importWithRetries = dynamicImportRetryCreator(this.props.loader, {
      onError: logError,
    });
  };
}
