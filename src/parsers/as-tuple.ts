import { asString } from './as-string';

export const asTuple = (value: string): string[] => asString(value).split(/[ ,]/).filter(Boolean);
