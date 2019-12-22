"use strict";

import { expect } from "chai";
import * as express from "express";
import { readFileSync } from "fs";
import { join } from "path";
import { vnu } from "../";

describe("vnu", function() {
  this.timeout(30000);

  it("should return empty array if there is no error in the analyzed HTML", async function() {
    const result = await vnu(join(__dirname, "./valid.html"));

    expect(result).to.be.an("array").that.is.empty;
  });

  it("should return array of the error info object if there is errors or warnings in the analyzed HTML", async function() {
    const result = await vnu(join(__dirname, "./invalid.html"));

    expect(result)
      .to.be.an("array")
      .that.is.deep.equal([
        {
          type: "error",
          url: process.platform === "win32" ?
            "file:/" + join(__dirname, "./invalid.html").replace(/\\/g, "/") :
            "file:" + join(__dirname, "./invalid.html"),
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
          url: process.platform === "win32" ?
            "file:/" + join(__dirname, "./invalid.html").replace(/\\/g, "/") :
            "file:" + join(__dirname, "./invalid.html"),
          lastLine: 11,
          lastColumn: 15,
          firstLine: 9,
          firstColumn: 3,
          message: "An \u201cimg\u201d element must have an \u201calt\u201d attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.",
          extract: "center>\n  <img\n    src=\"https://pbs.twimg.com/profile_images/820979755117789185/FtReP1a1_400x400.jpg\"\n    border=\"0\">\n</bod",
          hiliteStart: 10,
          hiliteLength: 107,
        },
        {
          type: "info",
          url: process.platform === "win32" ?
            "file:/" + join(__dirname, "./invalid.html").replace(/\\/g, "/") :
            "file:" + join(__dirname, "./invalid.html"),
          lastLine: 11,
          lastColumn: 15,
          firstLine: 9,
          firstColumn: 3,
          subType: "warning",
          message: "The \u201cborder\u201d attribute is obsolete. Consider specifying \u201cimg { border: 0; }\u201d in CSS instead.",
          extract: "center>\n  <img\n    src=\"https://pbs.twimg.com/profile_images/820979755117789185/FtReP1a1_400x400.jpg\"\n    border=\"0\">\n</bod",
          hiliteStart: 10,
          hiliteLength: 107,
        },
      ]);
  });

  it("should be properly analyzed when HTML string is given", async function() {
    const result = await vnu(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>Invalid HTML</title>
        </head>
        <body>
          <center>This HTML is invalid</center>
          <img
            src="https://pbs.twimg.com/profile_images/820979755117789185/FtReP1a1_400x400.jpg"
            border="0">
        </body>
      </html>
    `);

    expect(result)
      .to.be.an("array")
      .that.is.deep.equal([
        {
          type: "error",
          lastLine: 9,
          lastColumn: 18,
          firstColumn: 11,
          message: "The \u201ccenter\u201d element is obsolete. Use CSS instead.",
          extract: "          <center>This H",
          hiliteStart: 10,
          hiliteLength: 8,
        },
        {
          type: "error",
          lastLine: 12,
          lastColumn: 23,
          firstLine: 10,
          firstColumn: 11,
          message: "An \u201cimg\u201d element must have an \u201calt\u201d attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.",
          extract: "          <img\n            src=\"https://pbs.twimg.com/profile_images/820979755117789185/FtReP1a1_400x400.jpg\"\n            border=\"0\">\n     ",
          hiliteStart: 10,
          hiliteLength: 123,
        },
        {
          type: "info",
          lastLine: 12,
          lastColumn: 23,
          firstLine: 10,
          firstColumn: 11,
          subType: "warning",
          message: "The \u201cborder\u201d attribute is obsolete. Consider specifying \u201cimg { border: 0; }\u201d in CSS instead.",
          extract: "          <img\n            src=\"https://pbs.twimg.com/profile_images/820979755117789185/FtReP1a1_400x400.jpg\"\n            border=\"0\">\n     ",
          hiliteStart: 10,
          hiliteLength: 123,
        },
      ]);
  });

  it("should pass boolean options to vnu.jar", async function() {
    const result = await vnu(join(__dirname, "./invalid.html"), {
      "errors-only": true,
    });

    expect(result)
      .to.be.an("array")
      .that.is.deep.equal([
        {
          type: "error",
          url: process.platform === "win32" ?
            "file:/" + join(__dirname, "./invalid.html").replace(/\\/g, "/") :
            "file:" + join(__dirname, "./invalid.html"),
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
          url: process.platform === "win32" ?
            "file:/" + join(__dirname, "./invalid.html").replace(/\\/g, "/") :
            "file:" + join(__dirname, "./invalid.html"),
          lastLine: 11,
          lastColumn: 15,
          firstLine: 9,
          firstColumn: 3,
          message: "An \u201cimg\u201d element must have an \u201calt\u201d attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.",
          extract: "center>\n  <img\n    src=\"https://pbs.twimg.com/profile_images/820979755117789185/FtReP1a1_400x400.jpg\"\n    border=\"0\">\n</bod",
          hiliteStart: 10,
          hiliteLength: 107,
        },
      ]);
  });

  it("should pass string options to vnu.jar", function(done) {
    const app = express();
    const server = app.listen(9876);
    app.get("/", (req, res) => {
      const userAgent = req.get("User-Agent");

      if (userAgent === "test-user-agent") {
        const html = readFileSync(join(__dirname, "valid.html")).toString();
        res.send(html);

        server.close();
        done();
      } else {
        const html = readFileSync(join(__dirname, "invalid.html")).toString();
        res.send(html);

        server.close();
        done(new Error("User agent string is not sent."));
      }
    });

    vnu("http://localhost:9876", {
      "user-agent": "test-user-agent",
    });
  });

  it("should return an error when you cannot connect to the URL", async function() {
    expect(await vnu("http://localhost:1673")).to.be.deep.equal([{
      type: "non-document-error",
      subType: "io",
      url: "http://localhost:1673",
      message: "Connect to localhost:1673 [localhost/127.0.0.1] failed: Connection refused (Connection refused)",
    }]);
  });
});
