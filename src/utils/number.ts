export const hexStringToHexNumber = (
  hexString: string,
): number => Number.parseInt(hexString.replace(/^#/, ''), 16);
