# NewsFeed project rules

- Implement only the assigned task.
- Keep code and dependencies minimal.
- Use PascalCase for component filenames and component names (for example, `PostCard.tsx` and `PostCard`). Keep Next.js convention files such as `page.tsx` and `layout.tsx` named as required by the framework.
- Explain significant architectural choices.
- Target architecture: View → Store → Data access → Server.
- Views render state and trigger actions; data access owns networking and response normalization.
- Shared entity types belong outside data access.
- Do not introduce competing copies of shared entity state.
- Future feed work will use client rendering and SPA navigation; do not implement those behaviours in this setup task.
- Do not implement later milestones without instruction.
- Install Zustand when implementing the shared store, not during foundation setup.
- Do not create empty architecture folders or speculative abstractions.
- Run relevant lint, TypeScript and build checks before completing a change.
- Preserve existing work. Do not commit, push, merge or deploy without explicit instruction.
- Use Conventional Commits for authored commits: `type: description` or `type(scope): description`, with an optional `!` before `:` for breaking changes.
- Allowed commit types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`. Use a concise description, no trailing period, and a header of at most 100 characters.
- Validate commit messages with the configured commitlint rules. Do not bypass the commit-message hook.
- Never inspect secret files or expose credentials. Non-secret example configuration may be inspected.
- Keep `.agents/milestones/active.md` locally ignored. Use `milestone-workflow` only for “Run Active Milestone” and `milestone-authoring` when asked to create or revise a milestone.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
