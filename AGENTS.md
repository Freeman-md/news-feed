# NewsFeed project rules

- Implement only the assigned task.
- Keep code and dependencies minimal.
- Use PascalCase for component filenames and component names (for example, `PostCard.tsx` and `PostCard`). Keep Next.js convention files such as `page.tsx` and `layout.tsx` named as required by the framework.
- Keep `src/app/globals.css` readable with section comments naming the owning component, file or shared purpose, blank lines between rules and one declaration per line; place component-specific updates in their labelled sections and general styling in shared sections.
- Explain significant architectural choices.
- Target architecture: View → Store → Data access → Server.
- Views render state and trigger actions; data access owns networking and response normalization.
- Shared entity types belong outside data access.
- Do not introduce competing copies of shared entity state.
- Use App Router routes and normal Next.js links for SPA navigation; use Client Components only where behaviour requires them.
- Do not implement later milestones without instruction.
- Install Zustand only when an assigned task implements the shared store.
- Do not create empty architecture folders or speculative abstractions.
- Run relevant lint, TypeScript and build checks before completing a change.
- Preserve existing work. Do not commit, push, merge or deploy without explicit instruction.
- Use Conventional Commits for authored commits: `type: description` or `type(scope): description`, with an optional `!` before `:` for breaking changes.
- Allowed commit types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`. Use a concise description, no trailing period, and a header of at most 100 characters.
- Validate commit messages with the configured commitlint rules. Do not bypass the commit-message hook.
- Never inspect secret files or expose credentials. Non-secret example configuration may be inspected.
- Keep `.agents/milestones/active.md` locally ignored. Use `milestone-workflow` only for “Run Active Milestone” and `milestone-authoring` when asked to create or revise a milestone.

## Visual verification for every implementation task

- After completing each implementation task, capture fresh screenshots from the actual running application for `/`, `/create` and `/profile` at approximately 390 × 844 (mobile) and 1440 × 900 (desktop).
- Save the evidence under `docs/screenshots/task-XX/`, using `home-mobile.png`, `home-desktop.png`, `create-mobile.png`, `create-desktop.png`, `profile-mobile.png` and `profile-desktop.png`.
- Capture the home feed at the top. Add clearly named screenshots when needed to show changed content, scrolled content or relevant interaction states.
- Include a `README.md` in the task's screenshot folder recording the task name, implementation commit being verified, browser and viewport dimensions, browser checks and actual results, validation commands and actual results, and known limitations or checks that could not be performed. For evidence included in the implementation commit itself, identify the revision as "this commit" and report its SHA after committing; backfills must record the verified implementation SHA.
- Include screenshots and verification notes in the task's commit. Commit and push only when authorised, as required above.
- If browser capture or any check is unavailable, document the limitation and do not claim visual verification or the unavailable check passed. Never fabricate screenshots or reuse older captures as fresh evidence.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
