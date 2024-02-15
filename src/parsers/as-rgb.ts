import { UnexpectedValueError } from '../errors/UnexpectedValueError';
import { rgbRange } from '../utils/assert';

import { asNumber } from './as-number';
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

  if (red === undefined
    || green === undefined
    || blue === undefined
    || !!shouldNotExist) {
    throw new UnexpectedValueError(innerValue, 'be an rgb tuple');
  }

  return Object.assign(<Rgb>Object.create(null), <Rgb>{
    red: rgbRange(asNumber(red)),
    green: rgbRange(asNumber(green)),
    blue: rgbRange(asNumber(blue)),
  });
};
