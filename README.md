# dsh-plugins

Plugin bundles for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
(DSH), published as a plugin market index that the **Discover** tab can read.

## Install from Discover

1. Open **Plugins → Discover**.
2. Add the index source
   `https://raw.githubusercontent.com/operatingtag/dsh-plugins/master/market-index.json`.
3. Install any entry. Installs are pinned to the commit recorded in the index, so
   what you get is exactly what was published.

## Plugins

| Package | Directory | What it does |
|---|---|---|
| `dsh-installed-first` | [`dsh-installed-first/`](dsh-installed-first/) | Moves your installed bundles above the built-in groups in the Plugins panel. |
| `dsh-text-size-tuner` | [`dsh-text-size-tuner/`](dsh-text-size-tuner/) | Floating `Aa` panel that enlarges conversation, code, and terminal text from the session header. |

Each plugin directory has its own README with the problem it solves, how it works,
and its caveats.

## Naming convention

**Every plugin package is prefixed with `dsh-`.** The directory name matches the
package name exactly, so a GitHub URL under this repository always names the bundle
it documents:

```
dsh-<what-it-does>
```

Examples: `dsh-installed-first`, `dsh-text-size-tuner`, `dsh-session-export`.
The prefix keeps a plugin recognizable as DSH-specific in a profile's dependency
list, in the Plugins panel, and on npm.

## Repository layout

```
.
├── dsh-installed-first/     # one bundle: package.json + client.js + cordis.patch.yml
├── dsh-text-size-tuner/     # one bundle: header trigger + floating panel
├── market/
│   ├── build-index.mjs      # regenerates market-index.json from every bundle
│   ├── validate-index.mjs   # checks the format-1 rules locally
│   └── README.md            # publishing instructions
└── market-index.json        # what Discover reads (commit-pinned)
```

## Publishing a change

```powershell
# 1. bump the version in the plugin's package.json, commit the plugin
git add -A; git commit -m "dsh-installed-first 1.1.0"

# 2. re-pin the index to the new commit and validate it
node market/build-index.mjs https://github.com/operatingtag/dsh-plugins
node market/validate-index.mjs market-index.json

# 3. publish the index
git add market-index.json; git commit -m "Publish index"; git push
```

The index lists one version per plugin — the current `HEAD` of this repository.
Old versions stay installable from their own commit if you add them to
`versions[]` by hand.

## License

No license is declared in this repository; all rights reserved by the repository owner.
