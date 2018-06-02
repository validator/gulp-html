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
  const vnu = require("vnu");

  const result = await vnu("https://example.com/", { // Specify URL or filepath
    "errors-only": true,
  });
})();
```

## Options
The options object supports the same options as the standard The Nu Markup Checker.
`format`, `verbose`,

See also: http://validator.github.io/validator/#options

### errors-only
Type: `Boolean`

Default: `false`

### html
Type: `Boolean`

Default: `false`

### no-stream
Type: `Boolean`

Default: `false`

### verbose
Type: `Boolean`

Default: `false`

## Return

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
