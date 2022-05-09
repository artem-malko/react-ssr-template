/* istanbul ignore next */
export function noopFunc() {
  /**
   * This is just noop function
   */
}

export function isObject(val: unknown) {
  return val !== null && typeof val === 'object' && Array.isArray(val) === false;
}

/**
 *
 * @param object
 * @param pathString only string with .
 * @param def
 */
export function get(object: { [i: string]: any }, pathString: string, def?: any) {
  const pathList = pathString.split('.');
  return (
    pathList.reduce<any>(
      (result, path) => (isObject(result) || Array.isArray(result) ? result[path] : undefined),
      object,
    ) || def
  );
}

/**
 * Returns typed Array of keys of received object
 * @param {T} obj
 * @returns {(keyof T)[]}
 */
export function keysOf<T extends Record<string, unknown>>(obj: T) {
  if (typeof obj !== 'object') {
    return [];
  }
  return Object.keys(obj) as Array<keyof typeof obj>;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function debounce<T extends Function>(func: T, timeout: number): T {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: any) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };

  return debounced as any;
}
