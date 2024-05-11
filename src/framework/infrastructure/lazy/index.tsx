import { Component, ComponentType, lazy, LazyExoticComponent, Suspense, type JSX } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { noopFunc } from 'lib/lodash';

import { dynamicImportRetryCreator } from './retry';

interface LazyComponentModule<Props> {
  ['default']: React.ComponentType<Props>;
}

export type LazyComponentLoader<Props> = () => Promise<LazyComponentModule<Props>>;

export type LazyComponentLoaderFallback = (asyncStatus: LazyComponentLoaderAsyncStatus) => JSX.Element;

interface LazyProps<Props> {
  loader: () => Promise<LazyComponentModule<Props>>;
  render: (component: LazyExoticComponent<ComponentType<Props>>) => JSX.Element | false;
  fallback?: LazyComponentLoaderFallback;
}

interface LazyState<Props> {
  Comp: LazyExoticComponent<ComponentType<Props>>;
}

type LazyComponentLoaderAsyncStatus = 'loading' | 'error';

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
  logError: (error: Error) => void = process.env.NODE_ENV === 'development' ? console.error : noopFunc,
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
