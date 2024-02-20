import { regex } from '../utils/assert';
import { hexStringToHexNumber } from '../utils/number';

export const asHexString = (value: string): string => regex(/^#[\da-f]{6}$/i, value, 'be a valid hex string');

export const asHexNumber = (value: string): number => hexStringToHexNumber(asHexString(value));
