import { UnexpectedValueError } from '../errors/UnexpectedValueError';
import { asNumber } from '../parsers/as-number';
import { asString } from '../parsers/as-string';

export const regex = (testRegex: RegExp, value: string, message: string): string => {
  const innerValue = asString(value);

  if (!testRegex.test(innerValue)) {
    throw new UnexpectedValueError(innerValue, message);
  }

  return innerValue;
};

export const range = (min: number, value: string, max: number): number => {
  const innerValue = asNumber(value);

  if (innerValue < min || innerValue > max) {
    throw new UnexpectedValueError(innerValue, `be between ${min} and ${max}`);
  }

  return innerValue;
};
