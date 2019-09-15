"use strict";

const { join } = require("path");

module.exports = {
  env: {
    mocha: true
  },
  parserOptions: {
    project: join(__dirname, "tsconfig.json"),
  },
  plugins: [
    "chai-friendly"
  ],
  rules: {
    "prefer-arrow-callback": "off",

    "no-unused-expressions": "off",
    "chai-friendly/no-unused-expressions": "warn",
  },
};
