import { UnexpectedValueError } from '../errors/UnexpectedValueError';

import { asString } from './as-string';

const isNumberLike = (number: unknown): boolean => number !== null
  && String(number).length > 0
  && Number.isFinite(Number(number))
  && !Number.isNaN(Number(number));

export const asNumber = (value: string): number => {
  const innerValue = asString(value);

  if (!isNumberLike(innerValue)) {
    throw new UnexpectedValueError(innerValue, 'be number-like');
  }

  return Number.parseFloat(innerValue);
};
