export class UnexpectedValueError extends TypeError {
  constructor(value: string | number, whatWasExpected: string) {
    super(`Expected value "${value}" to ${whatWasExpected}.`);

    this.name = 'UnexpectedValueError';
  }
}
