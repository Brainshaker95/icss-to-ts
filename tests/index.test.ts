/* eslint-disable @typescript-eslint/no-magic-numbers, max-len */

import { expect, test } from 'bun:test';

import {
  UnexpectedValueError,
  asBoolean,
  asDvh,
  asDvw,
  asEm,
  asHexNumber,
  asHexString,
  asHexaNumber,
  asHexaString,
  asNumber,
  asPercent,
  asPt,
  asPx,
  asRem,
  asRgb,
  asRgba,
  asString,
  asTuple,
  asVh,
  asVw,
  icssToTs,
} from '../src/index';
import { deepFreeze } from '../src/utils/object';

const expectObjectToStrictEqual = (actual: object, expected: object): void => {
  expect(JSON.stringify(actual)).toStrictEqual(JSON.stringify(expected));
};

test('parses a given icss variable object to a deeply nested and readonly one', () => {
  const css = icssToTs({
    a: '16px',
    'b-bA': '1rem',
    'b-bB': '\'1rem\'',
    'c-cA': '1',
    'c-cB': '255, 255, 255',
    'c-cC': '255 255 255 1',
    'c-cD-cDA': '"Lorem ipsum"',
    d: '1, 3, 3, 7',
    'e-eA': 'true',
    'e-eB': '"false"',
    'e-eC': '1',
    'e-eD': '\'0\'',
    'f-fA': '#E1E1E1',
    'f-fB': '#FFFFFF',
    'f-fC': '#00000000',
    'f-fD': '#E1E1E1E1',
    nonExistentInSchema: 'should not be parsed',
  }, {
    a: asPx,
    b: {
      bA: asString,
      bB: asString,
    },
    c: {
      cA: asNumber,
      cB: asRgb,
      cC: asRgba,
      cD: {
        cDA: asString,
      },
    },
    d: (value: string) => value
      .split(',')
      .map((innerValue) => innerValue.trim()),
    e: {
      eA: asBoolean,
      eB: asBoolean,
      eC: asBoolean,
      eD: asBoolean,
    },
    f: {
      fA: asHexString,
      fB: asHexNumber,
      fC: asHexaString,
      fD: asHexaNumber,
    },
  });

  expectObjectToStrictEqual(css, {
    a: 16,
    b: {
      bA: '1rem',
      bB: '1rem',
    },
    c: {
      cA: 1,
      cB: {
        red: 255,
        green: 255,
        blue: 255,
      },
      cC: {
        red: 255,
        green: 255,
        blue: 255,
        alpha: 1,
      },
      cD: {
        cDA: 'Lorem ipsum',
      },
    },
    d: ['1', '3', '3', '7'],
    e: {
      eA: true,
      eB: false,
      eC: true,
      eD: false,
    },
    f: {
      fA: '#E1E1E1',
      fB: 0xFF_FF_FF,
      fC: '#00000000',
      fD: 0xE1_E1_E1_E1,
    },
  });

  expect(() => {
    // @ts-expect-error - disabled for this test
    css.a = '1';
  }).toThrow(TypeError);

  expect(() => {
    // @ts-expect-error - disabled for this test
    css.b.bA = '1';
  }).toThrow(TypeError);

  expect(() => {
    // @ts-expect-error - disabled for this test
    css.c.cB.blue = 127;
  }).toThrow(TypeError);

  expect(() => {
    // @ts-expect-error - disabled for this test
    // disabled for this test
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    css.d.push(1);
  }).toThrow(TypeError);

  expectObjectToStrictEqual(deepFreeze({ foo: 'bar' }), { foo: 'bar' });
});

test('different parser cases', () => {
  expectObjectToStrictEqual(icssToTs({ a: '1rem' }, { a: asString }), { a: '1rem' });
  expectObjectToStrictEqual(icssToTs({ a: '\'1rem\'' }, { a: asString }), { a: '1rem' });
  expectObjectToStrictEqual(icssToTs({ a: '"1rem"' }, { a: asString }), { a: '1rem' });

  expectObjectToStrictEqual(icssToTs({ a: '1px' }, { a: asPx }), { a: 1 });
  expectObjectToStrictEqual(icssToTs({ a: '1pt' }, { a: asPt }), { a: 1 });
  expectObjectToStrictEqual(icssToTs({ a: '"1rem"' }, { a: asRem }), { a: 1 });
  expectObjectToStrictEqual(icssToTs({ a: '\'1em\'' }, { a: asEm }), { a: 1 });
  expectObjectToStrictEqual(icssToTs({ a: '1%' }, { a: asPercent }), { a: 1 });
  expectObjectToStrictEqual(icssToTs({ a: '1vh' }, { a: asVh }), { a: 1 });
  expectObjectToStrictEqual(icssToTs({ a: '1vw' }, { a: asVw }), { a: 1 });
  expectObjectToStrictEqual(icssToTs({ a: '1dvh' }, { a: asDvh }), { a: 1 });
  expectObjectToStrictEqual(icssToTs({ a: '1dvw' }, { a: asDvw }), { a: 1 });

  expectObjectToStrictEqual(icssToTs({ a: '0 1 2' }, { a: asTuple }), { a: ['0', '1', '2'] });
  expectObjectToStrictEqual(icssToTs({ a: '0, 1, 2' }, { a: asTuple }), { a: ['0', '1', '2'] });
  expectObjectToStrictEqual(icssToTs({ a: '0, 1 2' }, { a: asTuple }), { a: ['0', '1', '2'] });
  expectObjectToStrictEqual(icssToTs({ a: 'red green blue' }, { a: asTuple }), { a: ['red', 'green', 'blue'] });

  expect(() => icssToTs({ a: '' }, { a: asBoolean })).toThrow(UnexpectedValueError);
  expect(() => icssToTs({ a: 'red' }, { a: asBoolean })).toThrow(UnexpectedValueError);
  expect(() => icssToTs({ a: '2' }, { a: asBoolean })).toThrow(UnexpectedValueError);
  expect(() => icssToTs({ a: '-1' }, { a: asBoolean })).toThrow(UnexpectedValueError);

  expect(() => icssToTs({ a: '1pix' }, { a: asPx })).toThrow(UnexpectedValueError);

  expect(() => icssToTs({ a: '' }, { a: asHexString })).toThrow(UnexpectedValueError);
  expect(() => icssToTs({ a: '' }, { a: asHexNumber })).toThrow(UnexpectedValueError);
  expect(() => icssToTs({ a: '#FFFFF' }, { a: asHexString })).toThrow(UnexpectedValueError);
  expect(() => icssToTs({ a: '#FFFFFG' }, { a: asHexString })).toThrow(UnexpectedValueError);
  expect(() => icssToTs({ a: '#0000000' }, { a: asHexString })).toThrow(UnexpectedValueError);

  expect(() => icssToTs({ a: '' }, { a: asHexaString })).toThrow(UnexpectedValueError);
  expect(() => icssToTs({ a: '' }, { a: asHexaNumber })).toThrow(UnexpectedValueError);
  expect(() => icssToTs({ a: '#FFFFFFF' }, { a: asHexaString })).toThrow(UnexpectedValueError);
  expect(() => icssToTs({ a: '#FFFFFFFG' }, { a: asHexaString })).toThrow(UnexpectedValueError);
  expect(() => icssToTs({ a: '#000000000' }, { a: asHexaString })).toThrow(UnexpectedValueError);

  expect(() => icssToTs({ a: '' }, { a: asRgb })).toThrow(UnexpectedValueError);
  expect(() => icssToTs({ a: '255 255' }, { a: asRgb })).toThrow(UnexpectedValueError);
  expect(() => icssToTs({ a: '255 255 blue' }, { a: asRgb })).toThrow(UnexpectedValueError);
  expect(() => icssToTs({ a: '255 255 255 1' }, { a: asRgb })).toThrow(UnexpectedValueError);
  expect(() => icssToTs({ a: '-1 255 255' }, { a: asRgb })).toThrow(UnexpectedValueError);
  expect(() => icssToTs({ a: '255 255 256' }, { a: asRgb })).toThrow(UnexpectedValueError);

  expect(() => icssToTs({ a: '' }, { a: asRgba })).toThrow(UnexpectedValueError);
  expect(() => icssToTs({ a: '255 255 255' }, { a: asRgba })).toThrow(UnexpectedValueError);
  expect(() => icssToTs({ a: '255 255 255 alpha' }, { a: asRgba })).toThrow(UnexpectedValueError);
  expect(() => icssToTs({ a: '255 255 255 0 1' }, { a: asRgba })).toThrow(UnexpectedValueError);
  expect(() => icssToTs({ a: '255 255 255 -1' }, { a: asRgba })).toThrow(UnexpectedValueError);
  expect(() => icssToTs({ a: '255 255 255 2' }, { a: asRgba })).toThrow(UnexpectedValueError);
});
