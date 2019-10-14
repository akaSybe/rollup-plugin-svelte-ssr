# rollup-plugin-svelte-ssr

Server-side rendering of Svelte app at build-time using Rollup plugin

## Basic example

Let's assume that we have basic svelte component `src/App.svelte`:

```svelte
<script>
  export let name;
</script>

<div>{name}</div>

<style>
  div {
    color: red;
  }
</style>
```

Let's use `rollup-plugin-svelte-ssr` in `rollup.config.js`:

```js
// ... other imports

import ssr from "rollup-plugin-svelte-ssr";

export default {
  input: "src/App.svelte",
  output: {
    format: "cjs",
    file: "dist/ssr.js"
  },
  plugins: [
    svelte({
      generate: "ssr"
    }),

    // ... other plugins

    ssr({
      fileName: 'ssr.html',
      props: {
        name: 'Hello',
      }
    })
  ]
}
```

In `dist` directory we get `ssr.html` that contains SSR-ed app:

```html
<style>div.svelte-6xs8g3{color:red}</style><div class="svelte-6xs8g3">Hello</div>
```

## Options

```js
ssr({
  // allow to set output file name
  fileName: 'ssr.html',
  // or
  // where entry is Rollup entry
  fileName: function(entry) {
    return "ssr.html"
  }
  // root component props
  props: {
    name: 'Hello',
  },
  // allow to skip emit of js file
  skipEmit: false,
  // allow to preprocess html
  preprocessHtml: function(html) {
    return html;
  },
  // allow to preprocess css
  preprocessCss: function(css) {
    return css;
  },
  // customize output
  configureExport: function(html, css) {
    return `<style>${css}</style>${html}`;
  }
})
```
