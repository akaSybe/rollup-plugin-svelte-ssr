import fs from "fs";
import del from "del";

import { bundleWithRollup, resolvePath, resolveExpectedFile } from "./helpers";

import plugin from "../src";

function readFile(fileName) {
  return fs.readFileSync(fileName, { encoding: "utf-8" });
}

function expectHtmlEqual(actual, expected) {
  expect(actual.trim()).toEqual(expected.trim());
}

describe("plugin tests", () => {
  it("should emit html file", async () => {
    const testName = "it-emits-html-file";
    const outputFileName = `dist/${testName}.html`;
    const ssrBundleFile = resolvePath(testName, "dist/ssr.js");
    const ssrOutputFile = resolvePath(testName, outputFileName);

    const pluginOptions = {
      fileName: ssrOutputFile,
    };

    await bundleWithRollup({ plugin, pluginOptions, testName, output: ssrBundleFile });

    expect(fs.existsSync(ssrBundleFile)).toBeTruthy();
    expect(fs.existsSync(ssrOutputFile)).toBeTruthy();

    const expected = readFile(resolveExpectedFile(testName));
    const actual = readFile(ssrOutputFile);

    expectHtmlEqual(actual, expected);

    // cleanup
    await del(resolvePath(testName, "dist"));
  });

  it("should respect props", async () => {
    const testName = "it-respects-props";
    const outputFileName = `dist/${testName}.html`;
    const ssrBundleFile = resolvePath(testName, "dist/ssr.js");
    const ssrOutputFile = resolvePath(testName, outputFileName);

    const pluginOptions = {
      fileName: ssrOutputFile,
      props: {
        name: "world",
      },
    };

    await bundleWithRollup({ plugin, pluginOptions, testName, output: ssrBundleFile });

    expect(fs.existsSync(ssrBundleFile)).toBeTruthy();
    expect(fs.existsSync(ssrOutputFile)).toBeTruthy();

    const expected = readFile(resolveExpectedFile(testName));
    const actual = readFile(ssrOutputFile);

    expectHtmlEqual(actual, expected);

    // cleanup
    await del(resolvePath(testName, "dist"));
  });

  it("should skip emit bundle if skipEmit=true", async () => {
    const testName = "it-skips-emit";
    const outputFileName = `dist/${testName}.html`;
    const ssrBundleFile = resolvePath(testName, "dist/ssr.js");
    const ssrOutputFile = resolvePath(testName, outputFileName);

    const pluginOptions = {
      fileName: ssrOutputFile,
      skipEmit: true,
    };

    await bundleWithRollup({ plugin, pluginOptions, testName, output: ssrBundleFile });

    expect(fs.existsSync(ssrBundleFile)).toBeFalsy();
    expect(fs.existsSync(ssrOutputFile)).toBeTruthy();

    // cleanup
    await del(resolvePath(testName, "dist"));
  });

  it("should use filename function option", async () => {
    const testName = "it-uses-filename-function";
    const outputFileName = `dist/test.html`;
    const ssrBundleFile = resolvePath(testName, "dist/ssr.js");
    const ssrOutputFile = resolvePath(testName, outputFileName);

    const pluginOptions = {
      fileName: function(file) {
        return ssrOutputFile;
      },
    };

    await bundleWithRollup({ plugin, pluginOptions, testName, output: ssrBundleFile });

    expect(fs.existsSync(ssrOutputFile)).toBeTruthy();

    // cleanup
    await del(resolvePath(testName, "dist"));
  });

  it("should place styles before markup by default", async () => {
    const testName = "it-puts-styles-before-html-by-default";
    const outputFileName = `dist/test.html`;
    const ssrBundleFile = resolvePath(testName, "dist/ssr.js");
    const ssrOutputFile = resolvePath(testName, outputFileName);

    const pluginOptions = {
      fileName: ssrOutputFile,
    };

    await bundleWithRollup({ plugin, pluginOptions, testName, output: ssrBundleFile });

    expect(fs.existsSync(ssrBundleFile)).toBeTruthy();
    expect(fs.existsSync(ssrOutputFile)).toBeTruthy();

    const expected = readFile(resolveExpectedFile(testName));
    const actual = readFile(ssrOutputFile);

    expectHtmlEqual(actual, expected);

    // cleanup
    await del(resolvePath(testName, "dist"));
  });

  it("should use configureExport option", async () => {
    const testName = "it-respects-configure-export-option";
    const outputFileName = `dist/test.html`;
    const ssrBundleFile = resolvePath(testName, "dist/ssr.js");
    const ssrOutputFile = resolvePath(testName, outputFileName);

    const pluginOptions = {
      fileName: ssrOutputFile,
      configureExport: function(html, css) {
        return `${html}<style>${css}</style>`;
      },
    };

    await bundleWithRollup({ plugin, pluginOptions, testName, output: ssrBundleFile });

    expect(fs.existsSync(ssrBundleFile)).toBeTruthy();
    expect(fs.existsSync(ssrOutputFile)).toBeTruthy();

    const expected = readFile(resolveExpectedFile(testName));
    const actual = readFile(ssrOutputFile);

    expectHtmlEqual(actual, expected);

    // cleanup
    await del(resolvePath(testName, "dist"));
  });

  it("should use preprocessHtml/preprocessCss options", async () => {
    const testName = "it-respects-preprocess-html-css-options";
    const outputFileName = `dist/test.html`;
    const ssrBundleFile = resolvePath(testName, "dist/ssr.js");
    const ssrOutputFile = resolvePath(testName, outputFileName);

    const pluginOptions = {
      fileName: ssrOutputFile,
      preprocessHtml: function(html) {
        return "<pre>replaced</pre>"
      },
      preprocessCss: function(css) {
        return "body { opacity: 0; }";
      }
    };

    await bundleWithRollup({ plugin, pluginOptions, testName, output: ssrBundleFile });

    expect(fs.existsSync(ssrBundleFile)).toBeTruthy();
    expect(fs.existsSync(ssrOutputFile)).toBeTruthy();

    const expected = readFile(resolveExpectedFile(testName));
    const actual = readFile(ssrOutputFile);

    expectHtmlEqual(actual, expected);

    // cleanup
    // await del(resolvePath(testName, "dist"));
  });
});
