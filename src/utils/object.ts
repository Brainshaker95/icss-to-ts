export type Simplify<T> = NonNullable<unknown> & {
  [Key in keyof T]: T[Key];
};

export type DeepReadonly<T extends object> = {
  readonly [Key in keyof T]: T[Key] extends object
    ? Simplify<DeepReadonly<T[Key]>>
    : T[Key];
};

export type UnknownObject = Record<string, unknown>;

export const deepFreeze = <T extends UnknownObject>(object: T): DeepReadonly<T> => {
  for (const value of Object.values(object)) {
    if (value && typeof value === 'object') {
      deepFreeze(<UnknownObject>value);
    }
  }

  return Object.freeze(object);
};
