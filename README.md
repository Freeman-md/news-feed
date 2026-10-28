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
npm test
npm run lint
npm run typecheck
npm run build
npm start
```

`typecheck` generates Next.js route types before running TypeScript, so it also
works on a fresh checkout. Run `build` before `start`.

TypeScript 5.9 and ESLint 9 match the Next.js lint plugins' declared compatibility.
npm marks ESLint 9 unsupported; upgrade it when those plugins support ESLint 10.

## Task verification evidence

Implementation tasks keep fresh browser screenshots and verification notes in
`docs/screenshots/task-XX/`, committed with the task. Each folder's `README.md`
records the verified revision, browser, mobile and desktop viewports, actual
check results and limitations. See the [Task 2 evidence](docs/screenshots/task-02/README.md)
for the visual shell and three routes.
The [Task 3 evidence](docs/screenshots/task-03/README.md) records data-preparation
checks and fresh captures confirming the UI remains unchanged.

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
- `src/models/`: shared client entity and draft types; no UI or service logic.
- `src/modules/feed/`: temporary nested fixtures, feed result types, normalization and service.
- `tests/unit/feed.normalize.test.ts`: Node unit tests, using `tsx` for TypeScript support.
- `public/samples/`: two locally bundled demo photos and their generation notes.

Routes use the App Router and ordinary Next.js links. Only the navigation needs
a Client Component, to read `usePathname` and expose the current route. The
composer uses a native uncontrolled textarea: typing needs no React state or
client boundary. Draft text is not persisted; browser or router restoration is
not a draft-saving feature. Upload, Publish and Like controls are disabled.

The target architecture remains View → Store → Data access → Server. Shared
models and a fixture-backed feed service now exist independently of the views.
No shared store, networking, API endpoints, database, authentication or persistence
is implemented. Zustand remains deferred.
Five Heroicons SVG paths are bundled under their MIT license, without adding a
package dependency. Glass styling is limited to the bottom navigation, with a
near-opaque fallback and safe-area padding.

## Feed data preparation (Task 3)

`src/models/` describes normalized client state, not database schemas or an
approved API contract. `feed.types.ts` combines those models into
`NormalizedFeedData` and defines temporary nested fixture input types.

`getFeed()` obtains the nested fixture → calls `normalizeFeed()` → returns a
normalized result. Each post references its author and media by ID. `Feed` owns
ordering, generation, cursors and fetch metadata; `NormalizedFeedData` also holds
the post, user and media collections needed to resolve those references.

Feed order follows each post ID's first appearance. The last encountered record
wins for duplicate post, user or media IDs. Ordered media references are retained.
The pure normalizer copies input data, so changing a result cannot mutate the
fixtures. It preserves rich-text content and offsets without parsing text.

When an API is introduced, the service's input acquisition can change to a
request, with its transport contract and adaptation defined then. The temporary
nested types do not pre-approve that contract. No request or transport abstraction
is implemented now.

The UI deliberately continues to use `src/demo/content.ts`; it does not import
the new models, fixtures or service. The two sample representations remain
separate until Task 4 connects the UI. Fields for reactions, uploads and submission
describe future state only; they do not enable those features.
