# vnu [![NPM Version](http://img.shields.io/npm/v/vnu.svg)](https://www.npmjs.org/package/vnu)

Unofficial Node.js wrapper for [Nu HTML Checker](https://validator.github.io/)

## Requirement

- Java
- Node.js & npm

## Install
Run

```sh
yarn add vnu
```

or

```sh
npm install vnu
```

## Usage

```js
(async () => {
  const { vnu } = require("vnu"); // Or import { vnu } from "vnu";

  const result1 = await vnu("https://example.com/", {
    "errors-only": true,
  });

  const result2 = await vnu("./example.html", {
    "asciiquotes": true,
  });

  const result3 = await vnu(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Invalid HTML</title>
      </head>
      <body>
        <center>This HTML is invalid</center>
        <img
          src="https://example.com/example.jpg"
          border="0">
      </body>
    </html>
  `, {
    "user-agent": "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Mobile Safari/537.36",
  });
})();
```

## Syntax

```js
const result = await vnu(target, options);
```

### Parameters

#### target: string

A URL or filepath (absolute or relative) to validate.

#### options: object

The options object supports most of the options supported in The Nu Markup Checker.
See also: http://validator.github.io/validator/#options

#### `options.asciiquotes`
Type: `Boolean`
Default: `false`

#### `options.errors-only`
Type: `Boolean`
Default: `false`

#### `options.filterfile`
Type: `String`
Default: `undefined`

#### `options.filterpattern`
Type: `String`
Default: `undefined`

#### `options.skip-non-css`
Type: `Boolean`
Default: `false`

#### `options.css`
Type: `Boolean`
Default: `false`

#### `options.skip-non-svg`
Type: `Boolean`
Default: `false`

#### `options.svg`
Type: `Boolean`
Default: `false`

#### `options.skip-non-html`
Type: `Boolean`
Default: `false`

#### `options.html`
Type: `Boolean`
Default: `false`

#### `options.no-stream`
Type: `Boolean`
Default: `false`

#### `options.also-check-css`
Type: `Boolean`
Default: `false`

#### `options.also-check-svg`
Type: `Boolean`
Default: `false`

#### `options.user-agent`
Type: `String`
Default: `"Validator.nu/LV"`

#### `options.no-langdetect`
Type: `Boolean`
Default: `false`

#### Unsupported options

- `exit-zero-always`
- `format`
- `help`
- `Werror`
- `verbose`
- `version`

### Return values

```js
[
  {
    type: "error",
    url: "https://amazon.co.jp",
    lastLine: 4,
    lastColumn: 55,
    firstColumn: 1,
    message: "Bad value “x-dns-prefetch-control” for attribute “http-equiv” on element “meta”.",
    extract: "ation -->\n<meta http-equiv='x-dns-prefetch-control' content='on'><link ",
    hiliteStart: 10,
    hiliteLength: 55
  },
  {
    type: "error",
    url: "https://amazon.co.jp",
    lastLine: 67,
    lastColumn: 108859,
    message: "CSS: “color”: Parse Error.",
    extract: "with_important()}.a-button-pri",
    hiliteStart: 15,
    hiliteLength: 1
  },
  // ...
]
```

## License
Copyright 2018 Jumpei Ogawa

This software is released under the MIT License. See [LICENSE](/LICENSE).

This software is fork of [gulp-html](https://github.com/watilde/gulp-html) by [Daijiro Wachi](https://github.com/watilde)
