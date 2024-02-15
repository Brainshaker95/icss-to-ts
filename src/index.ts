import { deepFreeze } from './utils/object';

import type {
  DeepReadonly,
  Simplify,
  UnknownObject,
} from './utils/object';

export type IcssModuleExports = Readonly<Record<string, string>>;

export type Parser = (value: string) => unknown;

export interface Schema {
  [key: string]: Parser | Schema;
}

export type ParsedSchema<T extends Schema> = {
  [Key in keyof T]: T[Key] extends Parser
    ? ReturnType<T[Key]>
    : T[Key] extends Schema
      ? Simplify<ParsedSchema<T[Key]>>
      : never;
};

export type IcssExports<T extends Schema> = Simplify<DeepReadonly<ParsedSchema<T>>>;

export const icssToTs = <T extends Schema>(
  icssExports: IcssModuleExports,
  schema: T,
): IcssExports<T> => {
  const parsedIcssExports = <UnknownObject>Object.create(null);

  for (const [key, value] of Object.entries(icssExports)) {
    const propertyPath = String(key).split('-');
    let currentProperty = propertyPath.shift();
    let currentObject = parsedIcssExports;
    let currentSchema: Schema = schema;

    while (currentProperty !== undefined) {
      const schemaEntry = currentSchema[currentProperty];

      if (!schemaEntry) {
        break;
      }

      if (typeof schemaEntry === 'function') {
        currentObject[currentProperty] = schemaEntry(value);

        break;
      }

      const nextObject = <UnknownObject>(currentObject[currentProperty] ?? Object.create(null));
      const nextSchema = currentSchema[currentProperty];

      currentObject[currentProperty] = nextObject;
      currentObject = nextObject;

      if (typeof nextSchema === 'object') {
        currentSchema = nextSchema;
      }

      currentProperty = propertyPath.shift();
    }
  }

  return deepFreeze(<ParsedSchema<T>>parsedIcssExports);
};

export { UnexpectedValueError } from './errors/UnexpectedValueError';

export * from './parsers';
export * as parsers from './parsers';

// Explicitly expose this module with a default export for those who prefer it
// eslint-disable-next-line import/no-default-export
export default icssToTs;
