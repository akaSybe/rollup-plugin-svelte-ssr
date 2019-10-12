import vm from "vm";
import fs from "fs-extra";
import { resolve, relative, sep as pathSeperator } from "path";

const defaultOptions = {
  /** do not emit SSR bundle */
  skipEmit: false,
  props: {},
  includeStyles: true,
};

function wrapModuleExports(code) {
  return `
    function getModuleExports() {
      const module = {};

      ${code}

      return module.exports;
    }
  `;
}

/** */
export default function ssr(options = {}) {
  const pluginOptions = {
    ...defaultOptions,
    ...options,
  };

  if (!pluginOptions.fileName) {
    throw new Error("options.fileName should be string or function");
  }

  // console.log(pluginOptions);

  return {
    name: "svelte-ssr",
    async generateBundle(config, bundle, isWrite) {
      console.log("generateBundle");
      // console.log(config);
      const destPath = relative("./", config.file);
      const destDir = destPath.slice(0, destPath.indexOf(pathSeperator));

      Object.keys(bundle).forEach(async key => {
        const entry = bundle[key];

        const sandbox = {
          ssr: {
            html: "",
            css: "",
          },
        };

        try {
          const props = JSON.stringify(pluginOptions.props, null, 2);
          const generateSsrScript = `
            ${wrapModuleExports(entry.code)}
            const App = getModuleExports();
            const { html, css } = App.render(${props});
            ssr.html = html;
            ssr.css = css.code;
          `;
          const script = new vm.Script(generateSsrScript);
          script.runInNewContext(sandbox);
        } catch (e) {
          throw e;
        }

        const html =
          typeof pluginOptions.preprocessHtml === "function"
            ? pluginOptions.preprocessHtml(sandbox.ssr.html)
            : sandbox.ssr.html;

        const css =
          typeof pluginOptions.preprocessCss === "function"
            ? pluginOptions.preprocessCss(sandbox.ssr.css)
            : sandbox.ssr.css;

        const fileName =
          typeof pluginOptions.fileName === "function"
            ? pluginOptions.fileName(entry)
            : pluginOptions.fileName;

        await fs.outputFile(resolve(destDir, fileName), html);

        if (pluginOptions.skipEmit) {
          // You can prevent files from being emitted by deleting them from the bundle object.
          delete bundle[key];
        }
      });
    },
  };
}
