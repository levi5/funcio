# Funcio documentation site

The site documents the library in this repository. Every example runs in the
browser and is checked against its documented output during the build.

## Development

Use Node.js 24, then run from the repository root:

```sh
npm --prefix web ci
npm --prefix web run dev
```

The site does not require the library to be published or built first. Vite bundles
the current library source into the playground worker, so newly documented APIs
work before an npm release.

## Checks

```sh
npm --prefix web run verify
npm --prefix web run typecheck
npm --prefix web run lint
npm --prefix web run build
npm --prefix web run preview
```

`build` checks every runnable example (including aliased, namespace and default
imports), TypeScript, lint and formatting. It then builds the site, generates the
sitemap and verifies the generated version metadata and worker bundles.

## Adding documentation

- Add API entries and JavaScript examples to `src/content/modules/`.
- Give each example a unique ID and an `expected` value matching the playground's
  formatter. The editor executes JavaScript; describe TypeScript signatures in
  the API entries rather than placing type annotations in runnable snippets.
- Register new modules in `src/content/index.ts` and page metadata in
  `src/hooks/usePageMeta.ts`. Sitemap sections come from the module list.
- Use `@/*` for site imports, `@funcio/*` for library source imports and `funcio`
  inside examples. Co-located imports can remain relative.

## Dynamic version and deployment

The **root `package.json` is the only source of the displayed library version**.
`src/version.ts` reads that JSON directly for the header, hero and structured
data. Vite also inserts it into the HTML `funcio-version` metadata.

Do not hardcode a library version or add an npm/CDN lookup. Every dev run or new
build reads the current root version, and the playground always uses the matching
checkout. Publishing to npm and deploying documentation remain independent.

GitHub Actions builds and validates the site on pull requests. The Pages workflow
deploys verified `web/dist` output on pushes to `main`. Set `BASE_PATH` to override
the default `/funcio/` deployment path.
