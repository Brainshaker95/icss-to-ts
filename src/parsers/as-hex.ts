import { UnexpectedValueError } from '../errors/UnexpectedValueError';
import { hexStringToHexNumber } from '../utils/number';

import { asString } from './as-string';

export const asHexString = (value: string): string => {
  const innerValue = asString(value);

  if (!/^#[\da-f]{6}$/i.test(innerValue)) {
    throw new UnexpectedValueError(innerValue, 'be a valid hex string');
  }

  return innerValue;
};

export const asHexNumber = (value: string): number => hexStringToHexNumber(asHexString(value));
