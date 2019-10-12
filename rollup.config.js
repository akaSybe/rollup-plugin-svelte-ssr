import resolve from "rollup-plugin-node-resolve";
import filesize from "rollup-plugin-filesize";
import progress from "rollup-plugin-progress";
import commonjs from "rollup-plugin-commonjs";

export default {
  input: "src/index.js",
  output: {
    file: "dist/index.js",
    format: "cjs",
  },
  external: ["fs", "path", "vm"],
  plugins: [progress(), resolve(), commonjs(), filesize()],
};
