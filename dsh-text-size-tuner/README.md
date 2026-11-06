# dsh-text-size-tuner

**Bigger text, without leaving the conversation.** A DSH client plugin that adds a
small floating panel with live sliders for the text you actually read all day:
conversation content, code blocks, and the embedded terminal.

## Where it lives in Harness

The plugin adds **one Aa button and one panel** — nothing else moves.

```
┌────────────────────────────────────────────── top of window ──┐
│                                        [Aa] [📁]  ← header row │
│  ┌──────────────────────────────────────────────┐              │
│  │ conversation                                   │             │
│  │                                                │             │
│  └──────────────────────────────────────────────┘              │
└────────────────────────────────────────────────────────────────┘
        panel opens here ──┐
        ┌──────────────────▼──┐
        │ Text size        ✕  │
        │ Aa                  │
        │ Conversation ──●──  │
        │ Code ──●──          │
        │ Terminal ──●──      │
        │ [Reset]    Saved    │
        └─────────────────────┘
```

- **The button** sits at the **top-right of the window**, in the session header's
  utilities row, immediately **left of the workspace folder icon**. It shows `Aa`
  and is highlighted while the panel is open.
- **The panel** drops down directly beneath that button: an `Aa` preview that grows
  with the conversation size, three sliders with live px readouts, **Reset**, and a
  **✕** to dismiss.
- It is **session-scoped**: the header only exists while a session is open, so the
  Aa button appears there and hides on the empty new-session screen.

## Controls

| Control | Range | Default | Affects |
|---|---|---|---|
| **Conversation** | 10–22 px | 14 | Chat messages, reasoning text, Markdown content |
| **Code** | 10–16 px | 11 | Fenced code blocks (inline code stays 1 px larger) |
| **Terminal** | 10–20 px | 13 | The sidebar terminal cell |
| **Reset** | — | — | Restores 14 / 11 / 13 |
| **✕** | — | — | Collapses to the button; reopen with `Aa` |

Drag **Conversation** to 18–20 px for a comfortable read; that is the setting most
people want from this plugin.

## It is the same setting as Settings → Appearance

The panel does not invent a new preference. It calls the Harness `theme` service's
`setFontSize(role, px)`, which persists the value and drives the existing CSS
variables:

```
--dsh-content-font-size   --dsh-code-font-size   --dsh-terminal-font-size
```

So **Settings → Appearance** and this panel always show the same numbers, values
survive restarts, and anything else that reads those variables (themes, future
views) follows along. Dragging is debounced (~140 ms) so a drag writes once, not
once per pixel.

**Keyboard alternative:** on desktop, `Ctrl` + `=` and `Ctrl` + `-` step all three
roles at once — that shortcut ships with the theme plugin, not with this one.

## Install

### From the plugin market (recommended)

1. Open **Plugins → Discover**.
2. Add the index source
   `https://raw.githubusercontent.com/operatingtag/dsh-plugins/master/market-index.json`
   (or select **My DSH plugins** if already listed).
3. Install **Text size tuner**.

### From a checkout

In the Harness Plugin Manager, use **Add plugin** and enter the absolute path of
this directory.

## Design notes

- Renders into the `shell.overlay` slot (a frame-wide, click-through layer), so the
  panel floats above every column and never steals clicks when collapsed.
- All chrome colors come from `--dsw-alias-*` theme tokens, so light and dark
  switch automatically; the only literals are translucent shadows.
- The panel anchors to the button's measured rectangle and re-measures on resize,
  so it stays attached at any window width.
- Labels are localized (English and Simplified Chinese) through the client locale
  service; the plugin also ships `meta.title` / `meta.description` for the plugin
  inventory and this repository's market index.

## Compatibility and caveats

- Requires a DSH build that provides the `theme` client service (any release with
  the Appearance font settings).
- Only the three content roles are exposed. Sidebar, settings, and chrome text
  intentionally stay at UI size; a global zoom would distort layout.
- The ranges are enforced by the service: values outside 10–22 / 10–16 / 10–20
  throw, so the sliders are clamped to what the Harness accepts.

## Files

| File | Purpose |
|---|---|
| `client.js` | Registers the `Aa` trigger in the session header and the panel in `shell.overlay`. |
| `index.js` | Host half — empty; the plugin is client-only. |
| `cordis.patch.yml` | Registers the `dsh-text-size-tuner` row. |
| `locale/{en,zh}.json` | Display metadata and panel copy. |

## License

No license is declared in this repository; all rights reserved by the repository owner.
