# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This is a personal digital garden / blog built on **Quartz v5**, deployed to Cloudflare Pages at `yoonjilee-blog.pages.dev`. The site content (Korean-language notes from an "AI PM 과정" course and case studies) lives in `content/`; everything else is the Quartz static site generator itself, which this repo forks/vendors directly (`quartz/` is the generator source, not a dependency).

Most day-to-day work in this repo is one of two things:
1. **Authoring content** — adding/editing Markdown notes under `content/`.
2. **Working on Quartz internals** — plugins, components, or the config/layout system under `quartz/`.

## Commands

```bash
npm ci                        # install deps (use ci, not install, for reproducible builds)
npx quartz plugin install     # install/sync plugins declared in quartz.config.yaml into .quartz/plugins/
npx quartz build --serve      # local dev server with hot reload (implies --watch)
npx quartz build              # one-off build to public/
npm run check                 # tsc --noEmit + prettier --check
npm run format                # prettier --write
npm test                      # tsx --test (runs *.test.ts files, e.g. quartz/util/*.test.ts)
```

Run a single test file directly: `npx tsx --test quartz/util/path.test.ts`

There is no lint script beyond `npm run check` (typecheck + prettier). Prettier config: no semicolons, 100 print width, trailing commas (see `.prettierrc`).

Node >= 22 is required (enforced by `.npmrc` `engine-strict=true` and a runtime check in `quartz/bootstrap-cli.mjs`).

## Plugin architecture (the core thing to understand)

Quartz v5 here is **plugin-driven and mostly config-only** — almost none of the actual site behavior (markdown parsing, components, layout) lives in this repo as code. Instead:

- `quartz.config.yaml` is the single source of truth: global `configuration`, the list of `plugins` (each with a `source`, `enabled`, `options`, `order`, and optional `layout`), and structural `layout` settings.
- Plugin sources are git repos, almost all `github:quartz-community/<name>`. They get cloned/built into `.quartz/plugins/<name>/` (gitignored, not committed) and pinned in `quartz.lock.json` (committed — this is the lockfile for plugin versions).
- `npx quartz plugin install` syncs `.quartz/plugins/` to `quartz.lock.json`; pass `--from-config` to instead sync against `quartz.config.yaml` (installs new/removes orphaned entries). `npx quartz plugin add/remove/enable/disable/config` mutate `quartz.config.yaml` + the lockfile for you — prefer these over hand-editing when adding/removing a plugin.
- At build time, `quartz/plugins/loader/config-loader.ts` (`loadQuartzConfig` / `loadQuartzLayout`) reads `quartz.config.yaml`, installs/imports each enabled plugin from `.quartz/plugins/`, sorts by `order` within its category (`transformer` / `filter` / `emitter` / `pageType`, or `component`-only), and instantiates each via a discovered factory (`default` export → `plugin` export → sole exported function → category-probed). This runs on every build/dev-serve — plugin category and dependency validation happens here, not statically.
- Layout (which components render `left` / `right` / `beforeBody` / `afterBody`, and in what order/grouping) is likewise declared per-plugin in `quartz.config.yaml`'s `layout:` block on each plugin entry, not in `quartz.ts`/component code. `quartz.ts` itself just calls `loadQuartzConfig()` / `loadQuartzLayout()`.
- `quartz/` (this repo's own TS source) contains only the loader/runtime machinery and a handful of built-in pieces: `quartz/plugins/{loader,emitters,pageTypes,transformers,filters}` (loader + built-ins like `Assets`, `Static`, `ComponentResources`, 404 page type), `quartz/components/` (Head, Body, Header, registry/frame system that plugins hook into), `quartz/processors/` (parse/filter/emit pipeline), `quartz/util/`, and `quartz/cli/` (the `quartz` CLI itself: build/create/sync/restore/plugin subcommands).
- `quartz.config.default.yaml` is the upstream template default config, used as a fallback if `quartz.config.yaml` is absent — don't confuse the two when editing config.

When changing site behavior (adding a feature, tweaking layout, styling), first check whether it's actually a plugin-config change in `quartz.config.yaml` (options/order/layout) rather than a code change — most things are.

## Content

- All published content lives under `content/`. `content/index.md` is the home page.
- Frontmatter conventions (title, description, tags, aliases, draft, date, permalink) are handled by plugins (Frontmatter/obsidian-flavored-markdown, CreatedModifiedDate, Description) — see `docs/getting-started/authoring-content.md` for the full field list.
- `ignorePatterns` in `quartz.config.yaml` (`private`, `templates`, `.obsidian`) are excluded from the build.
- Content is authored in Obsidian-flavored Markdown (wikilinks, callouts, embeds supported via the `obsidian-flavored-markdown` plugin).

## Docs

`docs/` is itself a Quartz vault (built with `npm run docs`, which builds into `docs/` — this is the upstream Quartz documentation site, not this repo's own docs). Don't confuse it with project documentation; if you need to understand a CLI command or plugin concept, the relevant page is usually under `docs/cli/`, `docs/features/`, `docs/advanced/`, or `docs/plugins/`.
