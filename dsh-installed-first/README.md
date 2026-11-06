# dsh-installed-first

**Your plugins, first.** A tiny DSH client plugin that moves the bundles *you* installed to the top of the **Plugins** panel, above the built-in groups that ship with DeepSeek Harness.

## The problem

The Plugins panel renders three groups in a fixed order:

| Order | Group | What it holds |
|---|---|---|
| 1 | **Basic** | Built-in plugin settings and toggles — the group most people visit once |
| 2 | **Extensions** | Official optional bundles |
| 3 | **Bundles** | The plugins you installed yourself |

If you install plugins regularly, the group you actually use several times a day sits at the very bottom, and every visit starts with scrolling past two groups you rarely touch.

## What this plugin does

It keeps the same three groups and the same cards, and changes only their stacking order:

| Order | Group |
|---|---|
| 1 | **Bundles** — your installed plugins |
| 2 | **Extensions** |
| 3 | **Basic** — the built-in plugin settings, now in the slot your bundles used to occupy |

Nothing is removed or replaced: every built-in toggle and setting stays available, one scroll further down than before.

## Screenshots

<!-- Replace with a real screenshot once GitHub hosting is ready. -->
Before / after: the **Bundles** heading moves from the bottom of the panel to the top, and **Basic** takes its place at the bottom.

## Install

### From the plugin market (recommended)

1. Open **Plugins → Discover**.
2. Add the index source
   `https://raw.githubusercontent.com/operatingtag/dsh-plugins/master/market-index.json`
   (or pick **My DSH plugins** if it is already listed).
3. Install **Installed plugins first**.

### From a checkout

```powershell
# in the Harness profile, from the package directory
dsh plugin install ./dsh-installed-first
```

## How it works

The plugin manager marks each group with a stable `data-plugin-group` attribute and lays the groups out in a flex column. This plugin contributes one scoped stylesheet:

```css
[data-plugin-panel] div:has(> [data-plugin-group="bundles"]) { display: flex; flex-direction: column }
[data-plugin-panel] [data-plugin-group="bundles"] { order: -1 }
[data-plugin-panel] [data-plugin-group="basic"]   { order: 1 }
```

`order` re-stacks the existing sections without touching the owning plugin's code, React tree, or data. The sheet is removed when the plugin is disposed, so disabling it restores the shipped order immediately.

## Compatibility

- Any DSH release whose Plugins panel exposes the `data-plugin-panel` / `data-plugin-group` markers listed above.
- Light and dark themes are unaffected: no colors are defined by this plugin.
- Sessions use the same panel, so the order applies everywhere.

## Caveats

- The ordering is a layout-level guarantee on those data attributes. If a future DSH release renames or removes them, the stylesheet becomes a no-op — the panel still works, it just reverts to the shipped order.
- Installing this bundle twice (once from a local checkout and once from the market) produces a duplicate entry; uninstall one.

## Files

| File | Purpose |
|---|---|
| `client.js` | Injects the scoped ordering stylesheet through `ctx.effect`. |
| `index.js` | Host half — intentionally empty; this is a client-only visual plugin. |
| `cordis.patch.yml` | Registers the `dsh-installed-first` row. |
| `locale/{en,zh}.json` | Title and description shown in the plugin inventory. |

## License

No license is declared in this repository; all rights reserved by the repository owner.
