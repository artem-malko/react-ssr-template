import { Style } from '../types';
import { CSSProviderStoreInterface } from './types';

export class CSSClientProviderStore implements CSSProviderStoreInterface {
  public addStyles(_selector: string, style: Style, usedModifiers?: string[]) {
    return {
      hash: style.toString(),
      usedModifiers,
    };
  }
}
