import { UnexpectedValueError } from '../errors/UnexpectedValueError';

import { asNumber } from './as-number';
import { asString } from './as-string';

export const asUnit = (unit: string) => (value: string): number => {
  const innerValue = asString(value);

  if (!innerValue.endsWith(unit)) {
    throw new UnexpectedValueError(innerValue, `end with unit ${unit}`);
  }

  return asNumber(innerValue.slice(0, -unit.length));
};

export const asPx = asUnit('px');
export const asPt = asUnit('pt');
export const asRem = asUnit('rem');
export const asEm = asUnit('em');
export const asPercent = asUnit('%');
export const asVh = asUnit('vh');
export const asVw = asUnit('vw');
export const asDvh = asUnit('dvh');
export const asDvw = asUnit('dvw');
