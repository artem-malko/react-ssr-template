import { CSSProviderStoreInterface } from './types';
import { murmurhash2 } from '../stringHash';
import { Style, Styles } from '../types';

export class CSSServerProviderStore implements CSSProviderStoreInterface {
  private _hasStyles = false;
  private _mutableProccesedStylesCache: {
    [hash: string]: boolean;
  } = {};

  protected mutableProccesedStyles: Styles<string> = {};

  public generateHash(selector: string, style: Style): string {
    let hash = `_${murmurhash2(JSON.stringify(style))}`;

    if (process.env.NODE_ENV === 'development') {
      hash = `${selector}_${hash}`;
    }

    return hash;
  }

  public addStyles(selector: string, style: Style, usedModifiers?: string[]) {
    const hash = this.generateHash(selector, style);

    if (!this._mutableProccesedStylesCache[hash]) {
      this._mutableProccesedStylesCache[hash] = true;

      this.mutableProccesedStyles[hash] = style;

      this._hasStyles = true;
    }

    return {
      hash,
      usedModifiers,
    };
  }

  public getStyles() {
    return this.mutableProccesedStyles;
  }

  public clearStore() {
    this._hasStyles = false;
    this.mutableProccesedStyles = {};
  }

  public hasStyles() {
    return this._hasStyles;
  }
}
