import { UnexpectedValueError } from '../errors/UnexpectedValueError';
import { range } from '../utils/assert';
import { emptyObject, object } from '../utils/object';
import { getRgbObject } from '../utils/rgb';

import { asString } from './as-string';
import { asTuple } from './as-tuple';

import type { Rgb } from './as-rgb';

export interface Rgba extends Rgb {
  alpha: number;
}

export const asRgba = (value: string): Rgba => {
  const innerValue = asString(value);
  const [red, green, blue, alpha, shouldNotExist] = asTuple(innerValue);

  if (!red || !green || !blue || !alpha || !!shouldNotExist) {
    throw new UnexpectedValueError(innerValue, 'be an rgba tuple');
  }

  return object.assign(emptyObject(), <Rgba>{
    ...getRgbObject(red, green, blue),
    alpha: range(0, alpha, 1),
  });
};
