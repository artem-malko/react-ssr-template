const mergeWith = require('lodash.mergewith');

function customizer(objValue: any, srcValue: any) {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

/**
 * Deep merge two objects.
 * @param mutableTarget
 * @param ...sources
 */
export function merge(mutableTarget: any, ...sources: any): any {
  return mergeWith(mutableTarget, ...sources, customizer);
}
