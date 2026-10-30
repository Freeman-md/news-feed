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
See [Task 4 evidence](docs/screenshots/task-04/README.md) for store integration
checks and the available browser verification results or limitations.

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
- `src/demo/config.ts`: explicit demo user/feed IDs and presentation-only profile bio.
- `src/models/`: shared client entity and draft types; no UI or service logic.
- `src/modules/feed/`: nested fixtures, normalization, service, vanilla store and React provider/hook.
- `tests/unit/`: normalizer and store tests using Node's runner and `tsx`.
- `public/samples/`: two locally bundled demo photos and their generation notes.

Routes use the App Router and ordinary Next.js links. Route files and the root
layout remain Server Components. Navigation reads `usePathname`; feed, composer
and profile content use Client Components to subscribe to shared state.
Upload, Publish and Like controls remain disabled.

The target architecture remains View → Store → Data access → Server. Shared
models and a fixture-backed feed service are integrated through Zustand 5.0.16.
No networking, API endpoints, database, authentication or persistence is implemented.
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

## Shared state and view integration (Task 4)

`createFeedStore()` owns the canonical feed/entity collections, load status and
composer draft. `loadFeed()` → `getFeed()` → `normalizeFeed()` → one state update
→ subscribed views. The service owns fixture acquisition and normalization;
components import neither the service nor fixtures. The store deduplicates
concurrent loads, reuses a successful load, and exposes a safe error with manual
retry. Loading, failure and retry preserve the draft.

`FeedStoreProvider` creates a vanilla store once per mounted provider. It wraps
route content in the shared root layout, so the same instance survives normal
route navigation and Back/Forward. Server rendering and the first client render
both start empty; a client effect triggers loading. Server Components never
read or mutate the store, and there is no application-wide mutable singleton.
This follows the [official Zustand Next.js guidance](https://zustand.docs.pmnd.rs/learn/guides/nextjs).

`FeedPosts` subscribes to the configured feed's ordered `postIds`. Each `PostCard`
resolves its post and canonical author; image children resolve their own media
IDs. Selectors return existing records or primitives, not new arrays/objects.
Readable timestamps (in UTC), initials and reaction labels are derived in the
view. Composer and profile resolve the same explicit `DEMO_USER_ID`; there is
no inferred viewer or authentication.

`ComposerForm` controls its textarea with `composerDraft.body.text`.
`setDraftText()` resets rich-text entities to an empty array and preserves the
rest of the draft. Text stays during route navigation while the provider lives.
A full refresh creates a fresh store and an empty draft; there is no localStorage
or persistence middleware, and the UI offers no refresh-persistence guarantee.

The duplicated author/post presentation samples and `PostCardProps` were removed.
Only explicit demo IDs and the presentation-only bio remain in `src/demo/`;
shared entity models and the Task 3 service/normalizer are unchanged. Fields for
reactions, uploads and submission remain descriptive only: no action controls
were enabled, and no publishing, pagination or background refresh was added.
