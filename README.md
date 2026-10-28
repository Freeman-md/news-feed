# NewsFeed

An incremental front-end system design learning project. This foundation uses
Next.js App Router, React, strict TypeScript, Tailwind CSS and ESLint with npm.

## Setup

Use Node.js 22.13 or newer (Node.js 22 LTS recommended) and npm.
No environment variables or external services are required.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). Three routes share the same header
and bottom navigation: `/` (sample feed), `/create` (demo composer) and `/profile`
(demo profile).

## Checks and production

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

`typecheck` generates Next.js route types before running TypeScript, so it also
works on a fresh checkout. Run `build` before `start`.

TypeScript 5.9 and ESLint 9 match the Next.js lint plugins' declared compatibility.
npm marks ESLint 9 unsupported; upgrade it when those plugins support ESLint 10.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):
`type(optional-scope): description`. For example:

```text
chore: enforce conventional commit messages
docs(setup): clarify installation instructions
```

Allowed types are `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`,
`build`, `ci`, `chore` and `revert`. Keep the header within 100 characters,
start descriptions with a lowercase word, and omit the trailing period.
Scopes are optional; use `!` before `:` or a `BREAKING CHANGE:` footer for
breaking changes. Separate a body or footer from the header with a blank line.

`npm ci` installs the local Husky `commit-msg` hook through the `prepare` script.
The hook uses commitlint's conventional preset, including its standard exemptions
for generated merge and revert messages. To check a message manually:

```sh
printf '%s\n' 'chore: update project tooling' | npm run --silent commitlint
```

Enforcement applies to new local commits. GitHub web commits and bypassed hooks
require CI or repository rules for remote enforcement; those are not configured.

## Project structure and scope

- `src/app/layout.tsx`: shared root document, header, main region and navigation.
- `src/app/{page,create/page,profile/page}.tsx`: assemble the three route views.
- `src/app/globals.css`: Tailwind entry point, shared theme and responsive styles.
- `src/components/`: header, navigation, post card, composer, initials avatar and icons.
- `src/demo/content.ts`: fictional presentation samples, passed directly to views.
- `public/samples/`: two locally bundled demo photos and their generation notes.

Routes use the App Router and ordinary Next.js links. Only the navigation needs
a Client Component, to read `usePathname` and expose the current route. The
composer uses a native uncontrolled textarea: typing needs no React state or
client boundary. Draft text is not persisted; browser or router restoration is
not a draft-saving feature. Upload, Publish and Like controls are disabled.

The target architecture remains View → Store → Data access → Server. This task
adds views only; no entity models, shared store, networking, APIs, database,
authentication or persistence are implemented. Zustand remains deferred.
Five Heroicons SVG paths are bundled under their MIT license, without adding a
package dependency. Glass styling is limited to the bottom navigation, with a
near-opaque fallback and safe-area padding.
