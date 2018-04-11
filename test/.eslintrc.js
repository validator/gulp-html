"use strict";

module.exports = {
  env: {
    mocha: true
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
