import { Style } from '../types';

export interface CSSProviderStoreInterface {
  addStyles: (
    selector: string,
    style: Style,
    modifiers?: string[],
  ) => {
    hash: string;
    usedModifiers?: string[];
    allModifiers?: string[];
  };
}
