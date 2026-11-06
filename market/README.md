# Discover: how these plugins become findable

Discover does not crawl anything. It reads **plugin indexes** — JSON documents you
host at an `http(s)` URL and add to the app. Each index lists plugins, their
versions, and a pinned install source. No index is configured by default, so the
tab is empty until one is added.

This folder is the publishing kit for the two bundles in this repository.

## What is already done

- Both bundles are committed to git (install sources are pinned to a commit SHA,
  which is what makes an install reproducible).
- [`market-index.json`](../market-index.json) is generated and passes format-1
  validation (`node market/validate-index.mjs market-index.json`).
- [`build-index.mjs`](build-index.mjs) regenerates the index from every bundle
  package in the repo, embedding each `icon.svg` as a `data:` URL and pinning the
  current `HEAD` commit.

## Publish it (git path, no npm account needed)

1. Create an empty repository on GitHub, for example `dsh-plugins`.
2. Push this folder from `plugins/`:

   ```powershell
   git remote add origin https://github.com/<you>/dsh-plugins.git
   git push -u origin master
   ```

3. Regenerate the index with the real URL, so every install target names that
   repository and the commit that now exists on it:

   ```powershell
   node market/build-index.mjs https://github.com/<you>/dsh-plugins
   node market/validate-index.mjs market-index.json
   git add market-index.json market
   git commit -m "Publish plugin market index"
   git push
   ```

4. The index URL is then:

   ```
   https://raw.githubusercontent.com/<you>/dsh-plugins/master/market-index.json
   ```

5. In Harness open **Plugins → Discover**. With no source yet, the empty state
   offers **Add index source**; paste the URL. The two plugins appear as cards
   with **Install**. The same dialog lists sources, their last read error, and a
   remove button; later, **Manage index sources…** in the index menu reopens it.

## npm alternative

If you prefer npm over git:

1. Rename the packages out of the `@local` scope into your own npm scope (or
   make them unscoped), and publish:

   ```powershell
   npm publish --access public
   ```

2. Make each version's source an npm one and drop the git pin:

   ```json
   "source": { "type": "npm" }
   ```

   `marketInstallTarget` then installs `name@version`, optionally from a
   `"registry"` you name. The generator only emits git sources, so edit
   `market-index.json` (or extend the generator) for this path.

A private registry also works: name it in the version's `registry`, but note the
public file CDNs cannot read its package files, so the entry page's long
description falls back to the repository README.

## Releasing a new version

1. Bump `version` in the package's `package.json` and commit the packages.
2. Run `node market/build-index.mjs <repo-url>` so the new `HEAD` becomes the pin.
3. Commit and push `market-index.json`.

The index lists one version per plugin (the generator writes the current one);
add older entries to `versions[]` by hand if you want them installable too.

## Limits worth knowing

- The index URL must be reachable without credentials, must be `http(s)`, and
  must not redirect (the Host refuses redirects).
- Icons are embedded as `data:` URLs, capped at 32 KiB decoded.
- An index body is capped at 128 MiB by default.
- The Git source must be a repository URL (not a tarball) with at least two path
  segments, and the commit must be a full 40-hex SHA reachable on the server.
- Installing from the market adds a second copy beside the folder-installed one;
  uninstall a bundle first if you switch it from the local link to the market.
