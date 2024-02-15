import { UnexpectedValueError } from '../errors/UnexpectedValueError';

export const rgbRange = (value: number): number => {
  if (value < 0 || value > 255) {
    throw new UnexpectedValueError(value, 'be between 0 and 255');
  }

  return value;
};

export const alphaRange = (value: number): number => {
  if (value < 0 || value > 1) {
    throw new UnexpectedValueError(value, 'be between 0 and 1');
  }

  return value;
};
