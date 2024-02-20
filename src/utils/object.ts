export type Simplify<T> = NonNullable<unknown> & {
  [Key in keyof T]: T[Key];
};

export type DeepReadonly<T extends object> = {
  readonly [Key in keyof T]: T[Key] extends object
    ? Simplify<DeepReadonly<T[Key]>>
    : T[Key];
};

export type UnknownObject = Record<string, unknown>;

export const object = Object;

export const emptyObject = (): UnknownObject => <UnknownObject>Object.create(null);

export const deepFreeze = <T extends UnknownObject>(objectToFreeze: T): DeepReadonly<T> => {
  for (const value of object.values(objectToFreeze)) {
    if (typeof value === 'object') {
      deepFreeze(<UnknownObject>value);
    }
  }

  return object.freeze(objectToFreeze);
};
