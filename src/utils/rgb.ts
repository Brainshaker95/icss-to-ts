import { range } from './assert';
import { emptyObject, object } from './object';

import type { Rgb } from '../parsers/as-rgb';

export const getRgbObject = (
  red: string,
  green: string,
  blue: string,
): Rgb => object.assign(emptyObject(), <Rgb>{
  red: range(0, red, 255),
  green: range(0, green, 255),
  blue: range(0, blue, 255),
});
