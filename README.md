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

Open [localhost:3000](http://localhost:3000). The page displays “NewsFeed” and
“Project foundation ready”.

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

- `src/app/layout.tsx`: root document and metadata.
- `src/app/page.tsx`: placeholder home page.
- `src/app/globals.css`: Tailwind CSS entry point.

The placeholder uses the default Server Component behavior. Future feed work
will introduce client rendering and SPA navigation when assigned. The target
architecture is View → Store → Data access → Server; no unused layers are created.
Zustand will be installed when the shared store is implemented. Feed features,
entity models, APIs, persistence and authentication are outside this task.
