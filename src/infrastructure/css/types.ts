export type Styles<ClassNames extends string> = { [name in ClassNames]: Style };

/**
 * 1. Add all standarts css properties from React.CSSProperties but without ForbiddenProperties
 * Remove undefined from value
 *
 * 2. Styles from https://www.npmjs.com/package/bidi-css-js
 **/
type BaseStyle =
  // 1.
  | Omit<React.CSSProperties, ForbiddenCSSPropertyNames>
  // 2.
  | AdditionalBIDICSSProperties;

export type Style =
  /**
   * 1. Checkout BaseStyle description
   *
   * 2. For inner styles
   *
   * className: {
   *   ':last-child': {
   *     position: 'relative',
   *   }
   * }
   *
   * for custom-properties or modifiers:
   *
   * className: {
   *   '--carousel-padding': 20,
   * }
   *
   * Recursive styles for such places
   *
   * scroller: {
   *   height: '100%',
   *
   *   '@media (hover: hover)': {
   *     overflowY: 'hidden',
   *
   *     '&:hover, &:focus': {
   *       overflowY: 'auto',
   *     }
   *   }
   * }
   *
   * 3. Support for TS autocomplete for pseudo-classes
   *
   * 4. Support for TS autocomplete for pseudo-elements
   *
   * 5. Fix inccorect syntax in @keyframes
   *
   **/
  // 1.
  | BaseStyle
  // 2.
  | {
      [
        subSelectorOrCustomProperty:
          | `_${string}`
          | `@media${string}`
          | `@supports${string}`
          | `&${string}`
          | `[${string}`
      ]: string | number | Style;
    }
  // 3.
  | {
      [selector in PseudoClasses]: BaseStyle;
    }
  // 4.
  | {
      [selector in PseudoElements]: BaseStyle;
    }
  // 5.
  | {
      [key: `@keyframes${string}`]: {
        [key in `${number}%` | 'from' | 'to']?: BaseStyle;
      };
    };

type PseudoClasses =
  | ':active'
  | ':any (en-US)'
  | ':any-link'
  | ':checked'
  | ':default'
  | ':defined'
  | ':dir()'
  | ':disabled'
  | ':empty'
  | ':enabled'
  | ':first'
  | ':first-child'
  | ':first-of-type'
  | ':fullscreen'
  | ':focus'
  | ':hover'
  | ':indeterminate'
  | ':in-range'
  | ':invalid'
  | ':lang()'
  | ':last-child'
  | ':last-of-type'
  | ':left'
  | ':link'
  | ':not()'
  | ':nth-child()'
  | ':nth-last-child()'
  | ':nth-last-of-type()'
  | ':nth-of-type()'
  | ':only-child'
  | ':only-of-type'
  | ':optional'
  | ':out-of-range'
  | ':read-only'
  | ':read-write'
  | ':required'
  | ':right'
  | ':root'
  | ':scope (en-US)'
  | ':target'
  | ':valid'
  | ':visited';

type PseudoElements =
  | ':after'
  | ':before'
  | ':cue'
  | ':first-letter'
  | ':first-line'
  | ':selection'
  | ':slotted'
  | ':backdrop'
  | ':placeholder'
  | ':marker'
  | ':spelling-error (en-US)'
  | ':grammar-error';

type ForbiddenCSSPropertyNames =
  // Disable all margin* padding* from TS autocomplete
  `${string}${'Left' | 'Inline' | 'Block' | 'Right' | 'BlockStart' | 'BlockEnd'}`;

/**
 * Style description for https://www.npmjs.com/package/bidi-css-js
 */
type AdditionalBIDICSSProperties = {
  /**
   * marginLeft in ltr, marginRight in rtl
   */
  marginStart: React.CSSProperties['marginInlineStart'];
  /**
   * marginRight in ltr, marginLeft in rtl
   */
  marginEnd: React.CSSProperties['marginInlineEnd'];

  /**
   * paddingLeft in ltr, paddingRight in rtl
   */
  paddingStart: React.CSSProperties['paddingInlineStart'];
  /**
   * paddingRight in ltr, paddingLeft in rtl
   */
  paddingEnd: React.CSSProperties['paddingInlineEnd'];

  /**
   * left in ltr, right in rtl
   */
  insetInlineStart: React.CSSProperties['left'];
  /**
   * right in ltr, left in rtl
   */
  insetInlineEnd: React.CSSProperties['right'];
  /**
   * @depricated
   * This property is not part of the official spec and only included for convinience
   * because insetInlineStart is so cumbersome.
   * If you`d like to keep 100% compatibility with the spec, avoid usind this property
   *
   * left in ltr, right in rtl
   */
  start: React.CSSProperties['left'];
  /**
   * @depricated
   * This property is not part of the official spec and only included for convinience
   * because insetInlineEnd is so cumbersome.
   * If you`d like to keep 100% compatibility with the spec, avoid usind this property
   *
   * right in ltr, left in rtl
   */
  end: React.CSSProperties['right'];

  /**
   * borderLeft in ltr, borderRight in rtl
   */
  borderStart: React.CSSProperties['borderLeft'];
  /**
   * borderRight in ltr, borderLeft in rtl
   */
  borderEnd: React.CSSProperties['borderRight'];
  /**
   * borderLeft in ltr,	borderRight in rtl
   */
  borderInlineStart: React.CSSProperties['borderLeft'];
  /**
   * borderRight in ltr,	borderLeft in rtl
   */
  borderInlineEnd: React.CSSProperties['borderRight'];

  /**
   * borderLeftColor in ltr,	borderRightColor in rtl
   */
  borderStartColor: React.CSSProperties['borderLeftColor'];
  /**
   * borderRightColor in ltr,	borderLeftColor in rtl
   */
  borderEndColor: React.CSSProperties['borderRightColor'];
  /**
   * borderLeftColor in ltr,	borderRightColor in rtl
   */
  borderInlineStartColor: React.CSSProperties['borderLeftColor'];
  /**
   * borderRightColor in ltr,	borderLeftColor in rtl
   */
  borderInlineEndColor: React.CSSProperties['borderRightColor'];

  /**
   * borderLeftWidth in ltr,	borderRightWidth in rtl
   */
  borderStartWidth: React.CSSProperties['borderLeftWidth'];
  /**
   * borderRightWidth in ltr,	borderLeftWidth in rtl
   */
  borderEndWidth: React.CSSProperties['borderRightWidth'];
  /**
   * borderLeftWidth in ltr,	borderRightWidth in rtl
   */
  borderInlineStartWidth: React.CSSProperties['borderLeftWidth'];
  /**
   * borderRightWidth in ltr,	borderLeftWidth in rtl
   */
  borderInlineEndWidth: React.CSSProperties['borderRightWidth'];

  /**
   * borderLeftStyle in ltr,	borderRightStyle in rtl
   */
  borderInlineStartStyle: NonNullable<React.CSSProperties['borderLeftStyle']>;
  /**
   * borderRightStyle in ltr,	borderLeftStyle in rtl
   */
  borderInlineEndStyle: NonNullable<React.CSSProperties['borderRightStyle']>;
  /**
   * borderLeftStyle in ltr,	borderRightStyle in rtl
   */
  borderStartStyle: NonNullable<React.CSSProperties['borderLeftStyle']>;
  /**
   * borderRightStyle in ltr,	borderLeftStyle in rtl
   */
  borderEndStyle: NonNullable<React.CSSProperties['borderRightStyle']>;

  /**
   * borderTopLeftRadius in ltr, borderTopRightRadius in rtl
   */
  borderTopStartRadius: React.CSSProperties['borderTopLeftRadius'];
  /**
   * borderTopLeftRadius in ltr, borderTopRightRadius in rtl
   */
  borderStartStartRadius: React.CSSProperties['borderTopLeftRadius'];

  /**
   * borderTopRightRadius in ltr, borderTopLeftRadius in rtl
   */
  borderTopEndRadius: React.CSSProperties['borderTopRightRadius'];
  /**
   * borderTopRightRadius in ltr, borderTopLeftRadius in rtl
   */
  borderStartEndRadius: React.CSSProperties['borderTopRightRadius'];

  /**
   * borderBottomLeftRadius in ltr, borderBottomRightRadius in rtl
   */
  borderBottomStartRadius: React.CSSProperties['borderBottomLeftRadius'];
  /**
   * borderBottomLeftRadius in ltr, borderBottomRightRadius in rtl
   */
  borderEndStartRadius: React.CSSProperties['borderBottomLeftRadius'];

  /**
   * borderBottomRightRadius in ltr, borderBottomLeftRadius in rtl
   */
  borderBottomEndRadius: React.CSSProperties['borderBottomRightRadius'];
  /**
   * borderBottomRightRadius in ltr, borderBottomLeftRadius in rtl
   */
  borderEndEndRadius: React.CSSProperties['borderBottomRightRadius'];
};
