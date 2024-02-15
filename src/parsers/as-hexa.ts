import { UnexpectedValueError } from '../errors/UnexpectedValueError';
import { hexStringToHexNumber } from '../utils/number';

import { asString } from './as-string';

export const asHexaString = (value: string): string => {
  const innerValue = asString(value);

  if (!/^#[\da-f]{8}$/i.test(innerValue)) {
    throw new UnexpectedValueError(innerValue, 'be a valid hexa string');
  }

  return innerValue;
};

export const asHexaNumber = (value: string): number => hexStringToHexNumber(asHexaString(value));
