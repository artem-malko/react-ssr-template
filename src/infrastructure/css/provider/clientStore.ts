import { CSSProviderStoreInterface, Style } from './types';

export class CSSClientProviderStore implements CSSProviderStoreInterface {
  public addStyles(_selector: string, stylesDescriptor: Style, usedModifiers?: string[]) {
    return {
      hash: stylesDescriptor.toString(),
      usedModifiers,
    };
  }
}
