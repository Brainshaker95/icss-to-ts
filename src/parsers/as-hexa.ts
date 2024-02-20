import { regex } from '../utils/assert';
import { hexStringToHexNumber } from '../utils/number';

export const asHexaString = (value: string): string => regex(/^#[\da-f]{8}$/i, value, 'be a valid hexa string');

export const asHexaNumber = (value: string): number => hexStringToHexNumber(asHexaString(value));
