export const number = Number;

export const hexStringToHexNumber = (
  hexString: string,
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
): number => number.parseInt(hexString.replace(/^#/, ''), 16);
