import { AnyConfig } from '../types';

export function removeUndefinedFields<T extends AnyConfig>(obj: Partial<T>): Required<T> {
  const mutableObjCopy = {
    ...obj,
  };

  for (const key in mutableObjCopy) {
    if (typeof mutableObjCopy[key] === 'undefined') {
      delete mutableObjCopy[key];
    }
  }

  return mutableObjCopy as Required<T>;
}
