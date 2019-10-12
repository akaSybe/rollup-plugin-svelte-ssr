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

```
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

```
<style>div.svelte-6xs8g3{color:red}</style><div class="svelte-6xs8g3">Hello</div>
```
