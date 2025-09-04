---
title: Using React components in Phoenix LiveView
description: This example combines the use of react components in phoenix live views
category: web-development
date: 2025-08-05
draft: true
tools:
  - javascript
  - react
---
## Create a new Phoenix project

```bash
mix phx.new demo_react --no-ecto
cd demo_react
```

## Remove Esbuild to Mix deps

search `mix.exs` file and remove this line `{:esbuild, "~> 0.9", runtime: Mix.env() == :dev},`

In this project removed esbuild to mix deps, i am added esbuild to js dependency.

remove esbuild to `config/config.exs`

remove this line to `config/dev.exs`

```elixir
esbuild: {Esbuild, :install_and_run, [:demo_react, ~w(--sourcemap=inline --watch)]},
```

install depenpencies

```bash
mix deps.get
```

first added build.js file in assest folder.

[Check documentation](https://hexdocs.pm/phoenix/asset_management.html)

You can add to esbuild config in your phoenix project

`build.js`

```javascript
const esbuild = require("esbuild");

const args = process.argv.slice(2);
const watch = args.includes("--watch");
const deploy = args.includes("--deploy");

let opts = {
  entryPoints: [
    // your entry point app
    "src/app.ts",
    // your reacts component entry points
    "src/ReactComponent.tsx",
  ],
  bundle: true,
  entryNames: "[name]",
  logLevel: "info",
  target: "esnext",
  outdir: "../priv/static/assets",
  external: ["*.css", "fonts/*", "images/*"],
  nodePaths: ["../deps"],
  loader: {
    ".js": "jsx",
    ".jsx": "jsx",
    ".ts": "ts",
    ".tsx": "tsx",
  },
  plugins: [],
};

if (deploy) {
  opts = {
    ...opts,
    minify: true,
  };
}

if (watch) {
  opts = {
    ...opts,
    sourcemap: "inline",
  };
  esbuild
    .context(opts)
    .then((ctx) => {
      ctx.watch();
    })
    .catch((_error) => {
      process.exit(1);
    });
} else {
  esbuild.build(opts);
}
```

added new watcher for assets management

```elixir
watchers: [
    node: ["build.js", "--watch", cd: Path.expand("../assets", DIR)],
    tailwind: {Tailwind, :install_and_run, [:healtsupplies, ~w(--watch)]}
  ]
```

## Added package.json

Sample

```javascript
{
    "name": "assets",
    "version": "1.0.0",
    "scripts": {
        "dev": "node build.js --watch",
        "build": "node build.js --deploy"
    },
    "devDependencies": {
        "@types/react": "^19.1.9",
        "@types/react-dom": "^19.1.7",
        "esbuild": "^0.25.8"
    },
    "dependencies": {
        "phoenix": "file:../deps/phoenix",
        "phoenix_html": "file:../deps/phoenix_html",
        "phoenix_live_view": "file:../deps/phoenix_live_view",
        "react": "^19.1.1",
        "react-dom": "^19.1.1",
    }
}
```

## Create custom layout component

This component will allow you to inject the necessary js

```elixir
defmodule Demo.Layouts.Wrapper do
  use Phoenix.Component

  attr :scripts, :list, default: []
  slot :inner_block, required: true

  def wrapper(assigns) do
    ~H"""
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>React Demo App</title>

        <%!-- added js --%>

        <%= for script <- @scripts do %>
          <script defer phx-track-static type="text/javascript" src={script}>
          </script>
        <% end %>
      </head>
      <body>
        {render_slot(@inner_block)}
      </body>
    </html>
    """
  end
end
```
