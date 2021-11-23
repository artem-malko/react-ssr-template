type FileList = string[];

/**
 * Each page has its own components, which can be loaded via dynamic import and React.lazy
 * These components can have its own children, which are loaded via dynamic import too.
 * So, you wait for the first import(), the next import() inside the first one will be delayed.
 * And so on.
 * The result will be like this:
 * comp loading ---- finished
 *                            childComp loading ----- finished
 *                                                             granChildComp loading ----- finished
 * As you can see, we had to wait to much time to load the last dynamic component.
 * So, to prevent this, all dependencies of the current page need be preloaded
 *
 * PageDependenciesManager is here to help.
 * We have to create an instance of the manager with bundle info about dependencies of every page.
 * You can get such info via PageDependenciesManagerPlugin webpack plugin.
 *
 * As soon, as setPageChunkName method is called, the manager is ready to return all deps for that page
 *
 * So, as a result you will see something like this:
 * comp loading ---- finished
 * childComp loading ----- finished
 * granChildComp loading ----- finished
 *
 * Much better!
 */
export class PageDependenciesManager {
  private pageChunkNameToDependenciesMap: { [pageChunkName: string]: FileList } = {};
  private publicPath: string;

  private pageChunkName: string;
  private isAssetsAppended = false;

  constructor(
    pageChunkNameToDependenciesMap: { [pageChunkName: string]: FileList },
    publicPath: string,
  ) {
    this.pageChunkNameToDependenciesMap = pageChunkNameToDependenciesMap;
    this.publicPath = publicPath;
  }

  public getPageDependencyAssets = () => {
    return (
      this.pageChunkNameToDependenciesMap[this.pageChunkName]?.map(
        (fileName) => `${this.publicPath}${fileName}`,
      ) || []
    );
  };

  public setPageChunkName = (pageChunkName: string) => {
    this.pageChunkName = pageChunkName;
  };

  public areAssetsReadyForAppend = () => {
    return this.pageChunkName && !this.isAssetsAppended;
  };

  public markAssetsAppended = () => {
    this.isAssetsAppended = true;
  };
}
