import * as React from 'react';
import { prefix } from 'inline-style-prefixer';
import { Style } from '../provider/types';

/* istanbul ignore next */
const convert = require('bidi-css-js').default ? require('bidi-css-js').default : require('bidi-css-js');
const UPPERCASE_RE = /([A-Z])/g;
const UPPERCASE_RE_TO_KEBAB = (match: string) => `-${match.toLowerCase()}`;

function kebabifyStyleName(str: string) {
  const result = str.replace(UPPERCASE_RE, UPPERCASE_RE_TO_KEBAB);
  if (result[0] === 'm' && result[1] === 's' && result[2] === '-') {
    return `-${result}`;
  }

  return result;
}

/**
 * Polyfil styles with paddingStart and etc for old browsers
 * Add prefixes
 */
function modifyStyles(styleObject: React.CSSProperties, dir: 'ltr' | 'rtl') {
  const rtlifiedStyles = convert(styleObject, dir);
  const prefixedStyles = prefix(rtlifiedStyles);

  return prefixedStyles;
}

/**
 * Convert marginTop, '10px' to margin-top:10px
 */
function cssifyDeclaration(property: string, value: string | number): string {
  if (typeof value === 'number') {
    if (unitlessProperties[property]) {
      return `${kebabifyStyleName(property)}:${value}`;
    }

    return `${kebabifyStyleName(property)}:${value === 0 ? 0 : value + 'px'}`;
  }

  return `${kebabifyStyleName(property)}:${value}`;
}

// @TODO_someday margin: undefined —» в пустую строку
/**
 * Convert object React.CSSProperties to css-string
 * {
 *   marginStart: '10px',
 *   transform: 'translateX(10)',
 *   display: 'flex',
 * }
 *
 * modifyStyles ==> rtlify + prefix
 * rtlify (ltr) ==>
 * {
 *   marginLeft: '10px',
 *   transform: 'translateX(10)',
 *   display: 'flex',
 * }
 *
 * prefix ==>
 * {
 *   marginLeft: '10px',
 *   WebkitTransform: 'translateX(10)',
 *   transform: 'translateX(10)',
 *   display: [
 *     '-webkit-box',
 *     'flex',
 *   ]
 * }
 *
 * stringified ==>
 * -webkit-transform:translateX(10);margin-left:10px;transform:translateX(10);display:-webkit-box;display:flex;
 */
function cssifyObject(stylesObject: React.CSSProperties, dir: 'ltr' | 'rtl'): string {
  let mutableRules: string[] = [];
  let nextPrefixedValueIndex = 0;

  const enhancedStyles = modifyStyles(stylesObject, dir);

  // eslint-disable-next-line guard-for-in
  for (const property in enhancedStyles) {
    const value = enhancedStyles[property as keyof React.CSSProperties];

    if (Array.isArray(value)) {
      mutableRules.push(
        ...value.reduce<string[]>((mutableAcc, val) => {
          mutableAcc.push(cssifyDeclaration(property, val));
          return mutableAcc;
        }, []),
      );
      continue;
    }

    // animationName and prefixed WebkitAnimationName will have object as value after rtlify
    if (property.includes('nimationName') && typeof value === 'object') {
      mutableRules.push(
        cssifyDeclaration(
          property,
          Object.keys(value)
            .reduce<string[]>((mutableAcc, valueKey) => {
              mutableAcc.push(value[valueKey]);
              return mutableAcc;
            }, [])
            .join(','),
        ),
      );
      continue;
    }

    if (typeof value !== 'string' && typeof value !== 'number') {
      continue;
    }

    const stringifiedRule = cssifyDeclaration(property, value);

    // Move all vendor rules with prefix like -webkit or -ms to top in order
    // that they were appeared in original css-object
    if (stringifiedRule[0] === '-') {
      if (nextPrefixedValueIndex === 0) {
        mutableRules.unshift(stringifiedRule);
      } else {
        mutableRules = [
          ...mutableRules.slice(0, nextPrefixedValueIndex),
          stringifiedRule,
          ...mutableRules.slice(nextPrefixedValueIndex),
        ];
      }
      nextPrefixedValueIndex++;
    } else {
      mutableRules.push(stringifiedRule);
    }
  }

  if (mutableRules.length === 0) {
    return '';
  }

  return mutableRules.join(';');
}

/**
 * Need to cssify keyframes in separate function, cause it has it's own special structure like:
 * @keyframes keyframesName {
 *   from: React.CSSProperties
 *   to: React.CSSProperties
 * }
 *
 * We need to rtlify and prefixify all keyframes stages
 */
function cssifyKeyFrames(keyframesStyles: { [key: string]: React.CSSProperties }, dir: 'ltr' | 'rtl') {
  const res = Object.entries(keyframesStyles).reduce<string>((result, [keyframeKey, keyframeValue]) => {
    result += `${keyframeKey}{${cssifyObject(keyframeValue, dir)}}`;
    return result;
  }, '');

  return res;
}

// @TODO sort media queries in result css
// combine similar mq
const mutableCssifyCache: { [key: string]: string } = {};
export function cssify(
  styleDescriptor: Style,
  hash: string,
  dir: 'ltr' | 'rtl',
  cacheModificator = '',
): string {
  const cacheKey = `${hash}_${dir}_${cacheModificator}`;

  if (mutableCssifyCache[cacheKey] !== undefined && process.env.NODE_ENV !== 'development') {
    // @ts-ignore
    return mutableCssifyCache[cacheKey];
  }

  const ownStylesProps: React.CSSProperties = {};
  const stringifiedChildren = Object.keys(styleDescriptor).reduce<string>(
    (result, stylePropertyOrSelector) => {
      const style = (styleDescriptor as any)[stylePropertyOrSelector];

      // Handle @media
      // @media selector can contain all types of selectors
      // so, just call cssify on all @media selector content
      if (stylePropertyOrSelector.includes('@media') || stylePropertyOrSelector.includes('@supports')) {
        result += `${stylePropertyOrSelector.replace(/:(\s)/g, ':')}{${cssify(
          style,
          hash,
          dir,
          cacheModificator + stylePropertyOrSelector,
        )}}`;
        return result;
      }

      // Handle @keyframes
      if (stylePropertyOrSelector.includes('@keyframes')) {
        result += `${stylePropertyOrSelector}{${cssifyKeyFrames(style, dir)}}`;
        return result;
      }

      // Handle nested selector
      // Only one level nesting is supported
      if (stylePropertyOrSelector.includes('&')) {
        result += `${stylePropertyOrSelector
          .replace('&', `.${hash}`)
          .replace(' > ', '>')}{${cssifyObject(style, dir)}}`;
        return result;
      }

      // Handle pseudo classes and pseudo selectors
      // Only one level nesting is supported
      if (stylePropertyOrSelector.startsWith(':')) {
        result += `.${hash}${stylePropertyOrSelector}{${cssifyObject(style, dir)}}`;
        return result;
      }

      // Handle modificators
      if (stylePropertyOrSelector[0] === '_') {
        // dot in prefix will be appended in stringifiedOwnStyles
        result += cssify(
          style,
          `${hash}.${stylePropertyOrSelector}`,
          dir,
          cacheModificator + stylePropertyOrSelector,
        );
        return result;
      }

      // Store all properties from high level
      // eslint-disable-next-line functional/immutable-data
      (ownStylesProps as any)[stylePropertyOrSelector] = style;
      return result;
    },
    '',
  );

  const stringifiedOwnStyles = cssifyObject(ownStylesProps, dir);
  const stringifiedStyles = stringifiedOwnStyles
    ? `.${hash}{${stringifiedOwnStyles}}${stringifiedChildren}`
    : stringifiedChildren;

  mutableCssifyCache[cacheKey] = stringifiedStyles;

  return stringifiedStyles;
}

export function isValidStyleObject(styleDescriptor: unknown) {
  if (typeof styleDescriptor !== 'object' || !styleDescriptor) {
    return false;
  }

  const keys = Object.keys(styleDescriptor);

  if (keys.length === 0) {
    return false;
  }

  let hasObjectsInside = true;

  keys.forEach((key) => {
    if (typeof (styleDescriptor as any)[key] !== 'object') {
      hasObjectsInside = false;
    }
  });

  return hasObjectsInside;
}

/**
 * CSS properties which accept numbers but are not in units of "px".
 * Taken from React's CSSProperty.js
 */
const unitlessProperties: { [key: string]: boolean } = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridColumn: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true,
};
