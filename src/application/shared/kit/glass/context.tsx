import {
  createContext,
  memo,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { noopFunc } from 'lib/lodash';

import { DefaultGlassUI } from './components/glass';
import { RootGlassBoundaryName } from './constants';

type GlassContextParams = {
  name: string;
  showGlass: (glassName?: string) => () => void;
  hideGlass: (glassName: string) => void;
};
export const GlassContext = createContext<GlassContextParams>({
  name: RootGlassBoundaryName,
  showGlass: () => noopFunc,
  hideGlass: noopFunc,
});

type Props = {
  /**
   * A name for a glass boundary
   */
  name: string;
  /**
   * A custom Glass UI Component.
   */
  CustomGlassUI?: React.NamedExoticComponent<PropsWithChildren<{ isShown: boolean }>>;
};
export const GlassBoundary = memo<PropsWithChildren<Props>>(
  ({ name: currentGlassName, CustomGlassUI, children }) => {
    const { showGlass: showParentGlass, hideGlass: hideParentGlass } = useContext(GlassContext);
    const [isShown, setIsShown] = useState(false);

    const hideGlass = useCallback(
      (glassNameToHide: string) => {
        if (currentGlassName !== glassNameToHide) {
          hideParentGlass(glassNameToHide);
          return;
        }

        setIsShown(false);
      },
      [hideParentGlass, currentGlassName],
    );

    const showGlass = useCallback(
      (glassNameToShow?: string) => {
        /**
         * No glassNameToShow received
         * Or we found the target glass
         * Or we are on the top of the glasses — RootGlassBoundaryName
         *
         * Let's show the current glass
         */
        if (
          !glassNameToShow ||
          glassNameToShow === currentGlassName ||
          currentGlassName === RootGlassBoundaryName
        ) {
          setIsShown(true);

          /**
           * And we need to hide just the current glass
           */
          return () => {
            hideGlass(currentGlassName);
          };
        }

        /**
         * Otherwise, go to the parent
         */
        return showParentGlass(glassNameToShow);
      },
      [currentGlassName, showParentGlass, hideGlass],
    );

    const contextValue = useMemo(() => {
      return {
        name: currentGlassName,
        showGlass,
        hideGlass,
      };
    }, [currentGlassName, showGlass, hideGlass]);

    const GlassCompToRender = useMemo(() => {
      return CustomGlassUI ? CustomGlassUI : DefaultGlassUI;
    }, [CustomGlassUI]);

    return (
      <GlassContext.Provider value={contextValue}>
        <GlassCompToRender isShown={isShown}>{children}</GlassCompToRender>
      </GlassContext.Provider>
    );
  },
);
GlassBoundary.displayName = 'GlassBoundary';

export const useGlassContext = () => {
  return useContext(GlassContext);
};
