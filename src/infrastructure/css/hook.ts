import { useContext, useMemo } from 'react';
import { Styles } from './types';
import { CSSProviderContext } from './provider';
import { SSRGeneratedStyleTagIdsArrayName } from './constants';

// @TODO_AFTER_REACT_18_RELEASE remove my own type here
const {
  useInsertionEffect,
}: {
  useInsertionEffect: (f: () => void, deps?: Array<any>) => void;
} = require('react');

export const useStyles = <ClassNames extends string, StyleDescriptor extends Styles<ClassNames>>(
  styles: StyleDescriptor,
) => {
  const { css } = useContext(CSSProviderContext);

  /**
   * useInsertionEffect is new in React 18.
   * It works roughly like useLayoutEffect except you don't have access to refs
   * to DOM nodes at this time.
   * The use case is specifically for inserting global DOM nodes like <style> or SVG <defs>.
   * It's not really meant to be used by anything else other than these CSS libraries.
   *
   * This effect doesn't fire on the server (just like useLayoutEffect).
   * You may need to track the usage of a rule on the server.
   * React team recommends doing that with a separate map in render.
   * If you need to, you can also feature test if you're on the server.
   *
   * To get more info checkout https://github.com/reactwg/react-18/discussions/110
   * "When to Insert <style> on The Client"
   */
  useInsertionEffect(() => {
    /**
     * So, if there are some ids in SSRGeneratedStyleTagIdsArray
     * it means, we have to find all style tags with that ids
     * and update media attibute to apply css from that style tags
     */
    if ((window as any)[SSRGeneratedStyleTagIdsArrayName].length) {
      (window as any)[SSRGeneratedStyleTagIdsArrayName].forEach((styleId: string) => {
        document.getElementById(styleId)?.setAttribute('media', 'screen');
      });
      // All style tags from current chunk were processed, we can clean the array of ids
      // eslint-disable-next-line functional/immutable-data
      (window as any)[SSRGeneratedStyleTagIdsArrayName] = [];
    }
  }, [styles]);

  return useMemo(() => css(styles), [css, styles]);
};

export const createStyles = <ClassNames extends string, StyleDescriptor extends Styles<ClassNames>>(
  styles: StyleDescriptor,
): StyleDescriptor => styles;
