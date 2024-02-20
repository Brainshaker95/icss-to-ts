import { UnexpectedValueError } from '../errors/UnexpectedValueError';
import { getRgbObject } from '../utils/rgb';

import { asString } from './as-string';
import { asTuple } from './as-tuple';

export interface Rgb {
  red: number;
  green: number;
  blue: number;
}

export const asRgb = (value: string): Rgb => {
  const innerValue = asString(value);
  const [red, green, blue, shouldNotExist] = asTuple(innerValue);

  if (!red || !green || !blue || !!shouldNotExist) {
    throw new UnexpectedValueError(innerValue, 'be an rgb tuple');
  }

  return getRgbObject(red, green, blue);
};
