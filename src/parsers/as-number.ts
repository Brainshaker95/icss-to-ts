import { UnexpectedValueError } from '../errors/UnexpectedValueError';
import { number } from '../utils/number';
import { string } from '../utils/string';

import { asString } from './as-string';

const isNumberLike = (numberLike: unknown): boolean => numberLike !== null
  && string(numberLike).length > 0
  && number.isFinite(number(numberLike))
  && !number.isNaN(number(numberLike));

export const asNumber = (value: string): number => {
  const innerValue = asString(value);

  if (!isNumberLike(innerValue)) {
    throw new UnexpectedValueError(innerValue, 'be number-like');
  }

  return number.parseFloat(innerValue);
};
