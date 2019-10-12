import path from "path";

import { rollup } from "rollup";
import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export function resolvePath(testName, fileName) {
  return path.resolve(__dirname, testName, fileName);
}

export function resolveExpectedFile(testName) {
  return resolvePath(testName, "expected.html");
}

export async function bundleWithRollup({ plugin, pluginOptions, testName, output }) {
  const bundle = await rollup({
    input: resolvePath(testName, "App.svelte"),
    plugins: [
      svelte({
        generate: "ssr",
      }),
      resolve({
        browser: true,
        dedupe: importee => importee === "svelte" || importee.startsWith("svelte/"),
      }),
      commonjs(),
      plugin(pluginOptions),
    ],
  });

  await bundle.write({
    format: "cjs",
    file: output,
  });
}
