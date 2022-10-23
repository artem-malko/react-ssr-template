import { CSSServerProviderStore } from '../provider/serverStore';

class CSSInJSStoreForWebpack extends CSSServerProviderStore {
  public clearStore() {
    this.mutableProccesedStyles = {};
  }
}

const storeInstance = new CSSInJSStoreForWebpack();

export { storeInstance };
