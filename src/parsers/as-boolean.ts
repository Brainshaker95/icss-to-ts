import { UnexpectedValueError } from '../errors/UnexpectedValueError';

import { asString } from './as-string';

export const asBoolean = (value: string): boolean => {
  const innerValue = asString(value);

  if (!new Set(['false', 'true', '0', '1']).has(innerValue)) {
    throw new UnexpectedValueError(innerValue, 'be a boolean representation');
  }

  return value === 'true' || value === '1';
};
