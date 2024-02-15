export const stripQuotes = (
  value: string,
): string => ((value.startsWith('"') && value.endsWith('"'))
  || (value.startsWith('\'') && value.endsWith('\''))
  ? value.slice(1, -1)
  : value);
