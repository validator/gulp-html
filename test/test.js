"use strict";

const expect = require("chai").expect,
      path = require("path"),
      vnu = require("../index");

describe("vnu", function() {
  this.timeout(10000);

  it("should return empty array if there is no error in the analyzed HTML", async function() {
    const result = await vnu(path.join(__dirname, "./valid.html"));

    expect(result).to.be.an("array").that.is.empty;
  });

  it("should return array of the error info object if there is errors or warnings in the analyzed HTML", async function() {
    const result = await vnu(path.join(__dirname, "./invalid.html"));

    expect(result)
      .to.be.an("array")
      .that.is.deep.equal([
        {
          type: "error",
          url: "file:" + path.join(__dirname, "./invalid.html"),
          lastLine: 8,
          lastColumn: 10,
          firstColumn: 3,
          message: "The \u201ccenter\u201d element is obsolete. Use CSS instead.",
          extract: "\n<body>\n  <center>This H",
          hiliteStart: 10,
          hiliteLength: 8,
        },
        {
          type: "error",
          url: "file:" + path.join(__dirname, "./invalid.html"),
          lastLine: 9,
          lastColumn: 101,
          firstColumn: 3,
          message: "An \u201cimg\u201d element must have an \u201calt\u201d attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.",
          extract: "center>\n  <img src=\"https://pbs.twimg.com/profile_images/820979755117789185/FtReP1a1_400x400.jpg\" border=\"0\">\n</bod",
          hiliteStart: 10,
          hiliteLength: 99,
        },
        {
          type: "info",
          url: "file:" + path.join(__dirname, "./invalid.html"),
          lastLine: 9,
          lastColumn: 101,
          firstColumn: 3,
          subType: "warning",
          message: "The \u201cborder\u201d attribute is obsolete. Consider specifying \u201cimg { border: 0; }\u201d in CSS instead.",
          extract: "center>\n  <img src=\"https://pbs.twimg.com/profile_images/820979755117789185/FtReP1a1_400x400.jpg\" border=\"0\">\n</bod",
          hiliteStart: 10,
          hiliteLength: 99,
        },
      ]);
  });

  it("should pass options to vnu.jar", async function() {
    const result = await vnu(path.join(__dirname, "./invalid.html"), {
      "errors-only": true,
    });

    expect(result)
      .to.be.an("array")
      .that.is.deep.equal([
        {
          type: "error",
          url: "file:" + path.join(__dirname, "./invalid.html"),
          lastLine: 8,
          lastColumn: 10,
          firstColumn: 3,
          message: "The \u201ccenter\u201d element is obsolete. Use CSS instead.",
          extract: "\n<body>\n  <center>This H",
          hiliteStart: 10,
          hiliteLength: 8,
        },
        {
          type: "error",
          url: "file:" + path.join(__dirname, "./invalid.html"),
          lastLine: 9,
          lastColumn: 101,
          firstColumn: 3,
          message: "An \u201cimg\u201d element must have an \u201calt\u201d attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.",
          extract: "center>\n  <img src=\"https://pbs.twimg.com/profile_images/820979755117789185/FtReP1a1_400x400.jpg\" border=\"0\">\n</bod",
          hiliteStart: 10,
          hiliteLength: 99,
        },
      ]);
  });
});
