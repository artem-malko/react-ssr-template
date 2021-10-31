import { createContext, Component } from 'react';
import { CSSProviderStoreInterface, Styles } from './types';

/* istanbul ignore next */
const cssStub =
  <ClassNames extends string>(_styleDescriptor: Styles<ClassNames>) =>
  (_selector: ClassNames, _modifiers?: Array<`_${string}`>) =>
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
            <ClassNames extends string>(styleDescriptor: Styles<ClassNames>) =>
            (selector: ClassNames, modifiers?: Array<`_${string}`>) => {
              const { hash, usedModifiers } = this.props.cssProviderStore.addStyles(
                selector,
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
