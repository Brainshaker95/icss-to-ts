import { UnexpectedValueError } from './errors/UnexpectedValueError';
import { deepFreeze, emptyObject, object } from './utils/object';

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

const fillParsedIcssExports = (
  icssExports: IcssModuleExports,
  parser: Parser,
  parsedIcssExports: UnknownObject,
  propertyPath: string[],
): void => {
  const property = propertyPath.join('-');
  const rawValue = icssExports[property];

  if (rawValue === undefined) {
    throw new UnexpectedValueError('undefined', `be an ICSS export, tried to parse property "${property}"`);
  }

  let currentExports = parsedIcssExports;

  for (const [index, currentProperty] of propertyPath.entries()) {
    if (index === propertyPath.length - 1) {
      currentExports[currentProperty] = parser(rawValue);
    } else {
      currentExports[currentProperty] ??= emptyObject();
      currentExports = <UnknownObject>currentExports[currentProperty];
    }
  }
};

const iterateSchema = (
  icssExports: IcssModuleExports,
  schema: Schema,
  parsedIcssExports: UnknownObject,
  propertyPath: string[] = [],
): void => {
  for (const [key, value] of object.entries(schema)) {
    const functionToCall = typeof value === 'function'
      ? fillParsedIcssExports
      : iterateSchema;

    functionToCall(
      icssExports,
      <Parser & Schema>value,
      parsedIcssExports,
      [...propertyPath, key],
    );
  }
};

export const icssToTs = <T extends Schema>(
  icssExports: IcssModuleExports,
  schema: T,
): IcssExports<T> => {
  const parsedIcssExports = emptyObject();

  iterateSchema(icssExports, schema, parsedIcssExports);

  return deepFreeze(<ParsedSchema<T>>parsedIcssExports);
};

export { UnexpectedValueError } from './errors/UnexpectedValueError';

export * from './parsers';
export * as parsers from './parsers';

// Explicitly expose this module with a default export for those who prefer it
// eslint-disable-next-line import/no-default-export
export default icssToTs;
