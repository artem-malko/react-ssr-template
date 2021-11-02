import { createContext, Component } from 'react';
import { Styles } from '../types';
import { CSSProviderStoreInterface } from './types';

/* istanbul ignore next */
const cssStub =
  <ClassNames extends string, StyleDescriptor extends Styles<ClassNames>>(
    _styleDescriptor: StyleDescriptor,
  ) =>
  <K extends keyof StyleDescriptor>(
    _selector: K,
    _modifiers?: Array<IsModificator<StyleDescriptor[K], keyof StyleDescriptor[K]>>,
  ) =>
    '';
export const CSSProviderContext = createContext({ css: cssStub });

interface CSSProviderProps {
  cssProviderStore: CSSProviderStoreInterface;
}

/**
 * Universal provider for CSS in JS workflow
 */
export class CSSProvider extends Component<CSSProviderProps> {
  public static displayName = 'CSSProvider';

  public render() {
    return (
      <CSSProviderContext.Provider
        value={{
          css:
            <ClassNames extends string, StyleDescriptor extends Styles<ClassNames>>(
              styleDescriptor: StyleDescriptor,
            ) =>
            <K extends keyof StyleDescriptor>(
              selector: K,
              modifiers?: Array<IsModificator<StyleDescriptor[K], keyof StyleDescriptor[K]>>,
            ) => {
              const { hash, usedModifiers } = this.props.cssProviderStore.addStyles(
                selector as string,
                styleDescriptor[selector],
                modifiers,
              );

              return `${hash}${
                usedModifiers && usedModifiers.length ? ' ' + usedModifiers.join(' ') : ''
              }`;
            },
        }}
      >
        {this.props.children}
      </CSSProviderContext.Provider>
    );
  }
}

/**
 * Modificator can be on the first level of the style object
 * Or inside @media or @supports query
 *
 * So, lets check the first level
 */
type IsModificator<X, T extends keyof X> = T extends `_${string}`
  ? T
  : // Then we will go deeper, lets find any modificators inside @media
  T extends `@media${string}`
  ? IsModificator<X[T], keyof X[T]>
  : // At last we will try to find any modificators inside @supports
  T extends `@supports${string}`
  ? IsModificator<X[T], keyof X[T]>
  : never;
