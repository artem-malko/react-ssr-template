import { Component, createContext } from 'react';
import { PageDependenciesManager } from './manager';

export const PageDependenciesManagerContext = createContext((_pageChunkName: string) => {
  /* */
});

interface DependencyManagerProviderProps {
  pageDependenciesManager: PageDependenciesManager;
}

/**
 * Just a provider to set up used pageChunkName
 */
export class PageDependenciesManagerProvider extends Component<DependencyManagerProviderProps> {
  public static displayName = 'PageDependenciesManagerProvider';

  public render() {
    const setPageChunkName = this.props.pageDependenciesManager.setPageChunkName;

    return (
      <PageDependenciesManagerContext.Provider value={setPageChunkName}>
        {this.props.children}
      </PageDependenciesManagerContext.Provider>
    );
  }
}
