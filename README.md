<a id="top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

# IcssToTs

Convert ICSS module exports to strongly typed TypeScript objects

*[☄️ Bug reports / feature requests »][issues-url]*

<br>

## Table Of Contents

<!-- NOTICE: all anchors must not include the emoji to work on github, the ❤️ for some reason must be url encoded though -->
* [👋 About The Project](#-about-the-project)
* [🚀 Installation](#-installation)
* [👀 Usage](#-usage)
* [💻 API](#-api)
  * [🏠 Built-in Parsers](#-built-in-parsers)
  * [🌲 Custom Parsers](#-custom-parsers)
* [❤️ Contributing](#%EF%B8%8F-contributing)
* [⭐ License](#-license)
* [🌐 Acknowledgments](#-acknowledgments)

<p align="right"><a href="#top" title="Back to top">&nbsp;&nbsp;&nbsp;⬆&nbsp;&nbsp;&nbsp;</a></p>

## 👋 About The Project

This project aims to provide a simple way of working with strongly typed objects that were exported from [ICSS modules](https://github.com/css-modules/icss#export).  

Given an ICSS module like this:
```css
:export {
  foo: red;
  bar-baz: 255, 255, 255;
}
```

A TypeScript object conforming to this interface will be returned when using the string- and the RGB-[parser](#-built-in-parsers) respectively:
```ts
interface MyIcssVariables {
  readonly foo: string;
  readonly bar: {
    readonly baz: {
      readonly red: number;
      readonly green: number;
      readonly blue: number;
    },
  };
}
```

<p align="right"><a href="#top" title="Back to top">&nbsp;&nbsp;&nbsp;⬆&nbsp;&nbsp;&nbsp;</a></p>

## 🚀 Installation

**Bun**
```shell
bun add icss-to-ts
```

**Yarn**
```shell
yarn add icss-to-ts
```

**PNPM**
```shell
pnpm add icss-to-ts
```

**NPM**
```shell
npm i icss-to-ts
```

<p align="right"><a href="#top" title="Back to top">&nbsp;&nbsp;&nbsp;⬆&nbsp;&nbsp;&nbsp;</a></p>

## 👀 Usage

```ts
import icssToTs from 'icss-to-ts';
// or
import { icssToTs } from 'icss-to-ts';
```

```css
/* ./path/to/icss-file.module.css */
:export {
  foo: red;
  bar-baz: 255, 255, 255;
}

/* ./path/to/icss-file.module.scss */
:export {
  foo: red;
  bar: {
    baz: 255, 255, 255;
  };
} 
```

```ts
import { icssToTs, parsers } from 'icss-to-ts';
import icssExports from './path/to/icss-file.module.css';
// import icssExports from './path/to/icss-file.module.scss';

const css = icssToTs(icssExports, {
  foo: parsers.asString,
  bar: {
    baz: parsers.asRgb,
  },
});

console.log(css);
/*
  {
    foo: 'red',
    bar: {
      baz: {
        red: 255,
        green: 255,
        blue: 255
      }
    }
  }
*/
```

<p align="right"><a href="#top" title="Back to top">&nbsp;&nbsp;&nbsp;⬆&nbsp;&nbsp;&nbsp;</a></p>

## 💻 API

### 🏠 Built-in Parsers

**[asString](./src/parsers/as-string.ts)**

Strips surrounding single or double quotes from the value if present.

```ts
asString('foo');     // -> 'foo'
asString('\'foo\''); // -> 'foo'
asString('"foo"');   // -> 'foo'
```

> Note: All of the below parsers internally call to `asString` before further processing.

**[asNumber](./src/parsers/as-number.ts)**

Ensures that the given value is a finite number.

```ts
asNumber('0');        // -> 0
asNumber('"1"');      // -> 1
asNumber('\'1.21\''); // -> 1.21
asNumber('1px');      // -> throws
asNumber('Infinity'); // -> throws
asNumber('NaN');      // -> throws
```

**[asBoolean](./src/parsers/as-boolean.ts)**

Ensures that the given value is a representation of a boolean.

```ts
asBoolean('0');     // -> false
asBoolean('"1"');   // -> true
asBoolean('false'); // -> false
asBoolean('true');  // -> true
asBoolean('');      // -> throws
asBoolean('2');     // -> throws
asBoolean('foo');   // -> throws
```

**[asUnit](./src/parsers/as-unit.ts)**

Extracts numbers from values with a specific unit.  
Some unit parsers for the most common use cases are packaged with this library.

> Note: Uses `asNumber` internally.

```ts
asPx('10px');     // -> 10
asRem('10rem');   // -> 10
asEm('10em');     // -> 10
asPercent('10%'); // -> 10
asVh('10vh');     // -> 10
asVw('10vw');     // -> 10
asDvh('10dvh');   // -> 10
asDvw('10dvw');   // -> 10
asPx('10pix');    // -> throws
asRem('10');      // -> throws

// You can simply construct your own unit parser like this:
asUnit('vmax')('50vmax'); // -> 50
asUnit('vmin')('50vmin'); // -> 50
asUnit('vmin')('50vmax'); // -> throws
```

**[asTuple](./src/parsers/as-tuple.ts)**

Parses a one-dimensional array from a space- and/or comma-separated list.

```ts
asTuple('0 1 2');       // -> ['0', '1', '2']
asTuple('0, 1, 2');     // -> ['0', '1', '2']
asTuple('0, 1 2');      // -> ['0', '1', '2']
asTuple('"0, 1, 2"');   // -> ['0', '1', '2']
asTuple('foo bar baz'); // -> ['foo', 'bar', 'baz']
```

**[asHex](./src/parsers/as-hex.ts)**

Ensures that the given value is a valid hex color.  
Two separate parsers are available: One for a string and one for a number representation.

```ts
asHexString('#E1E1E1');   // -> '#E1E1E1'
asHexNumber('#E1E1E1');   // -> 0x_E1_E1_E1
asHexNumber('E1E1E1');    // -> throws
asHexNumber('#E1E1E1E1'); // -> throws
asHexNumber('#FFFFFG');   // -> throws
```

**[asHexa](./src/parsers/as-hexa.ts)**

Ensures that the given value is a valid hexa color.  
Two separate parsers are available: One for a string and one for a number representation.

```ts
asHexaString('#E1E1E1E1');   // -> '#E1E1E1E1'
asHexaNumber('#E1E1E1E1');   // -> 0x_E1_E1_E1_E1
asHexaNumber('E1E1E1E1');    // -> throws
asHexaNumber('#E1E1E1E1E1'); // -> throws
asHexaNumber('#FFFFFFFG');   // -> throws
```

**[asRgb](./src/parsers/as-rgb.ts)**

Parses an object confirming to the [Rgb interface](./src/parsers/as-rgb.ts#L8).

> Note: Uses `asNumber` and `asTuple` internally.

```ts
asRgb('0 127 255');      // -> { red: 0, green: 127, blue: 255 }
asRgb('0, 127, 255');    // -> { red: 0, green: 127, blue: 255 }
asRgb('0, 127 255');     // -> { red: 0, green: 127, blue: 255 }
asRgb('0 127');          // -> throws
asRgb('-1 256 42');      // -> throws
asRgb('red green blue'); // -> throws
```

**[asRgba](./src/parsers/as-rgba.ts)**

Parses an object confirming to the [Rgba interface](./src/parsers/as-rgba.ts#L10).

> Note: Uses `asNumber` and `asTuple` internally.

```ts
asRgba('0 127 255 1');          // -> { red: 0, green: 127, blue: 255, alpha: 1 }
asRgba('0, 127, 255 1');        // -> { red: 0, green: 127, blue: 255, alpha: 1 }
asRgba('0, 127 255 1');         // -> { red: 0, green: 127, blue: 255, alpha: 1 }
asRgba('0 127 255 2');          // -> throws
asRgba('0 127 255 -1');         // -> throws
asRgba('red green blue alpha'); // -> throws
```

### 🌲 Custom Parsers

If none of the built-in parsers satisfy your needs you can simply provide your own parser inside the schema.

Simple example of a parser for a tuple of numbers:
```ts
import { icssToTs, asNumber, asTuple } from 'icss-to-ts';
import icssExports from './path/to/icss-file.module.css';
/*
  :export {
    foo: 1 3.3 7;
  }
*/

const css = icssToTs(icssExports, {
  foo: (value: string): number[] => asTuple(value).map(asNumber),
});

console.log(css);
/*
  {
    foo: [1, 3.3, 7]
  }
*/
```

<p align="right"><a href="#top" title="Back to top">&nbsp;&nbsp;&nbsp;⬆&nbsp;&nbsp;&nbsp;</a></p>

## ❤️ Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch => `git checkout -b feature/my-new-feature`
3. Commit your Changes => `git commit -m 'feat(my-new-feature): add some awesome new feature'`
4. Push to the Branch => `git push origin feature/my-new-feature`
5. Open a Pull Request

<p align="right"><a href="#top" title="Back to top">&nbsp;&nbsp;&nbsp;⬆&nbsp;&nbsp;&nbsp;</a></p>

## ⭐ License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

<p align="right"><a href="#top" title="Back to top">&nbsp;&nbsp;&nbsp;⬆&nbsp;&nbsp;&nbsp;</a></p>

## 🌐 Acknowledgments

* [CSS Modules](https://github.com/css-modules/css-modules)
* [TypeScript](https://www.typescriptlang.org)
* [Vitest](https://vitest.dev)
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template) by [othneildrew](https://github.com/othneildrew)
* [Choose an Open Source License](https://choosealicense.com)
* [Img Shields](https://shields.io)

<p align="right"><a href="#top" title="Back to top">&nbsp;&nbsp;&nbsp;⬆&nbsp;&nbsp;&nbsp;</a></p>

<!-- END OF CONTENT -->

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-url]: https://github.com/Brainshaker95/icss-to-ts/graphs/contributors
[contributors-shield]: https://img.shields.io/github/contributors/Brainshaker95/icss-to-ts.svg?style=flat-square

[forks-url]: https://github.com/Brainshaker95/icss-to-ts/network/members
[forks-shield]: https://img.shields.io/github/forks/Brainshaker95/icss-to-ts.svg?style=flat-square

[stars-url]: https://github.com/Brainshaker95/icss-to-ts/stargazers
[stars-shield]: https://img.shields.io/github/stars/Brainshaker95/icss-to-ts.svg?style=flat-square

[issues-url]: https://github.com/Brainshaker95/icss-to-ts/issues
[issues-shield]: https://img.shields.io/github/issues/Brainshaker95/icss-to-ts.svg?style=flat-square

[license-url]: https://github.com/Brainshaker95/icss-to-ts/blob/master/LICENSE
[license-shield]: https://img.shields.io/github/license/Brainshaker95/icss-to-ts.svg?style=flat-square
