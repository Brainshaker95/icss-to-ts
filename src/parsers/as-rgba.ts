import { UnexpectedValueError } from '../errors/UnexpectedValueError';
import { alphaRange, rgbRange } from '../utils/assert';

import { asNumber } from './as-number';
import { asString } from './as-string';
import { asTuple } from './as-tuple';

import type { Rgb } from './as-rgb';

export interface Rgba extends Rgb {
  alpha: number;
}

export const asRgba = (value: string): Rgba => {
  const innerValue = asString(value);
  const [red, green, blue, alpha, shouldNotExist] = asTuple(innerValue);

  if (red === undefined
    || green === undefined
    || blue === undefined
    || alpha === undefined
    || !!shouldNotExist) {
    throw new UnexpectedValueError(innerValue, 'be an rgba tuple');
  }

  return <Rgba>Object.assign(Object.create(null), {
    red: rgbRange(asNumber(red)),
    green: rgbRange(asNumber(green)),
    blue: rgbRange(asNumber(blue)),
    alpha: alphaRange(asNumber(alpha)),
  });
};
