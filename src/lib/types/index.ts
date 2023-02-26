/**
 * Unwrap type from Promise
 *
 * @example
 * const foo = Promise.resolve(1);
 * Unwrap<typeof foo> === number
 */
export type UnwrapPromise<T> = T extends Promise<infer Result> ? Result : never;

export type UnwrapReadonlyArrayElement<ArrType> = ArrType extends readonly (infer ElementType)[]
  ? ElementType
  : never;

/**
 * General union discriminator
 * Works with [Discriminated Union](https://basarat.gitbooks.io/typescript/docs/types/discriminated-unions.html) only
 */
export type DiscriminateUnion<T, K extends keyof T, V extends T[K]> = T extends Record<K, V> ? T : never;

/**
 * Returns a map of a discriminate from discriminateUnion to that discriminateUnion
 *
 * There is an example how you can use it:
 * https://stackoverflow.com/questions/50125893/typescript-derive-map-from-discriminated-union
 */
export type MapDiscriminatedUnion<T extends Record<K, string>, K extends keyof T> = {
  [V in T[K]]: DiscriminateUnion<T, K, V>;
};

/**
 * Validate, that StructToValidate satisfies the contract of SampleStruct
 *
 * @example
 *
 * type Person = {
 *   first: string, last: string
 * }
 *
 * declare function savePerson<T>(person: ValidateStructure<T, Person>): void;
 *
 * const tooFew = { first: 'Stefan' };
 * const exact = { first: 'Stefan', last: 'Baumgartner' }
 * const tooMany = { first: 'Stefan', last: 'Baumgartner', age: 37 }
 *
 * savePerson(tooFew); // 💥 doesn't work
 * savePerson(exact); // ✅ satisfies the contract
 * savePerson(tooMany); // 💥 doesn't work
 */
export type ValidateStructure<StructToValidate, SampleStruct> = StructToValidate extends SampleStruct
  ? Exclude<keyof StructToValidate, keyof SampleStruct> extends never
    ? StructToValidate
    : never
  : never;
