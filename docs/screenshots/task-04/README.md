# Task 04 — Zustand state and view integration

Verified implementation: `0d4036fed790d8e95ba328c8a53e8fc417c7c8ab`
(`feat(feed): integrate Zustand state across feed and composer views`).

This evidence backfill was performed on **30 October 2026 (Europe/London, GMT)**.
It replaces the implementation-time browser-unavailable report. The running app
was built from that exact revision with a clean working tree. This backfill
changes only this folder's verification notes and screenshots.

## Environment and fresh evidence

- Browser: **Chromium 156.0.8078.79**, controlled through the Playwright browser connector.
- Mobile: **390 × 844 CSS pixels**. Desktop: **1440 × 900 CSS pixels**.
- Production server: `npm start -- --hostname 127.0.0.1 --port 3002`.
- Node.js **22.17.0**, npm **10.9.2**, Next.js **16.4.3**.
- All 16 images are fresh, unmodified PNG screenshots from the running app.
  PNG headers were checked against the corresponding viewport dimensions.
  No Task 2/3 captures were reused.

| Route | Mobile | Desktop |
| --- | --- | --- |
| `/` | [home-mobile.png](home-mobile.png) | [home-desktop.png](home-desktop.png) |
| `/create` | [create-mobile.png](create-mobile.png) | [create-desktop.png](create-desktop.png) |
| `/profile` | [profile-mobile.png](profile-mobile.png) | [profile-desktop.png](profile-desktop.png) |

The home captures show the loaded feed at scroll position **0**, explicitly
asserted in the browser. The primary Create captures show the empty composer.

| Additional state | Mobile | Desktop |
| --- | --- | --- |
| Later posts and end-of-feed note | [home-bottom-mobile.png](home-bottom-mobile.png) | [home-bottom-desktop.png](home-bottom-desktop.png) |
| Publish and helper text after scrolling | [create-bottom-mobile.png](create-bottom-mobile.png) | [create-bottom-desktop.png](create-bottom-desktop.png) |
| Draft after Home/Profile link navigation | [create-draft-after-navigation-mobile.png](create-draft-after-navigation-mobile.png) | [create-draft-after-navigation-desktop.png](create-draft-after-navigation-desktop.png) |
| Draft after Back/Forward | [create-draft-after-history-mobile.png](create-draft-after-history-mobile.png) | [create-draft-after-history-desktop.png](create-draft-after-history-desktop.png) |
| Caption keyboard focus after refresh | [create-caption-focus-mobile.png](create-caption-focus-mobile.png) | [create-caption-focus-desktop.png](create-caption-focus-desktop.png) |

## Browser checks and actual results

The final browser runs passed **65 assertions per viewport**, including repeated
active-navigation assertions. Checks used actual DOM values, Next.js links,
browser Back/Forward, reloads and keyboard input. Screenshots were also inspected.

| Check | Actual result at both viewports |
| --- | --- |
| Direct route access and refresh | All three routes returned HTTP 200 and rendered the expected h1 before and after reload: Your feed, Create a post, Your profile. |
| Client loading and subscriptions | Client-loaded feed, composer and profile appeared; no hydration, subscription or other JavaScript runtime errors were observed. |
| Link navigation and active navigation | Home → Create and Profile → Create worked. Exactly one `aria-current="page"` link matched the route throughout direct access, reloads and history traversal. |
| Draft retained after navigation | Exact textarea value survived Create → Home → Create → Profile → Create. Line breaks, two leading spaces, accented text and an emoji were preserved. |
| Draft retained through history | From the last Create above: Back → Profile → Back → Create → Back → Home → Forward → Create → Forward → Profile → Forward → Create. The exact draft matched on every return to Create. |
| Refresh behavior and helper text | Reloading Create cleared the draft. The helper says drafts stay during navigation and refresh may clear them. The subsequent focus captures show the empty field. |
| Feed order and content | Maya's coastal post, Leo's coffee post, then Maya's text-only reminder; expected captions and 24 / 18 / 12 likes rendered in order. |
| Shared demo identity | Both Maya feed posts, composer and profile displayed Maya Chen; profile displayed @mayachen. Canonical record identity/update propagation is covered separately by the passing store unit test. |
| Images | Both feed images decoded successfully with nonzero natural dimensions and descriptive alt text, including the lazy image after scrolling. |
| Disabled actions | All three Like buttons, Add an image and Publish remained disabled. No successful upload, reaction or submission was simulated. |
| Keyboard access and labels | Tab order: Skip to content → NewsFeed home → Caption → Home → Create → Profile. All six stops were within the viewport with a 2px solid focus outline; disabled buttons were skipped. Caption was found by its accessible label. |
| Keyboard activation | Enter on Profile opened /profile. Enter on Skip to content focused main-content. |
| Horizontal overflow and sizing | No horizontal overflow at tested route tops or Home/Create page ends. Surface widths were 358px mobile / 520px desktop; navigation widths were 366px / 420px. |
| Console and requests | Final runs recorded no warnings, console errors, page errors or failed requests. The initial exploratory navigation logged a separate /favicon.ico HTTP 404; it is recorded below and was not fixed. |

The distinctive draft used at each viewport was the following, with
`mobile` replaced by `desktop` for the desktop run. The second line begins
with exactly two spaces; equality checks used the full textarea value.

```text
Task 4 — mobile verification
  Keep two leading spaces, café & 🌊.
Final line: 0d4036f
```

Clearance was measured from the final relevant content's bottom to the highest
edge of navigation, including the raised Create circle. Home and Create were
scrolled to the page end; Profile fits without scrolling.

| Content | Mobile clearance | Desktop clearance |
| --- | --- | --- |
| Home end-of-feed note | 55.6px | 56.4px |
| Create Publish area, including helper text | 76.8px | 80.8px |
| Profile surface | 118.5px | 162.5px |

## Validation commands and actual results

These checks were rerun for this backfill against the verified implementation.

| Command/check | Actual result |
| --- | --- |
| `npm test` | Exit 0: **23 passed, 0 failed, 0 skipped**; 13 normalizer/service cases and 10 store cases. |
| `npm run lint` | Exit 0; no warnings or errors. |
| `npm run typecheck` | Exit 0; route generation and strict TypeScript checking passed. |
| `npm run build` | Exit 0; /, /create, /profile and framework not-found route prerendered. |
| `npm start -- --hostname 127.0.0.1 --port 3002` | Production server ready and used for the browser checks. Initial sandbox start could not bind the port (EPERM); the permitted retry succeeded. |
| Playwright browser checks | Passed at both viewports, including exact draft comparisons, history, refresh, keyboard, layout, images and error monitoring described above. |
| PNG signature/dimension check using Python struct | All 16 files are PNGs at their recorded viewport dimensions. |
| `git diff --exit-code 0d4036f -- . ':(exclude)docs/screenshots/task-04/**'` | Exit 0; no changes outside Task 4 evidence. |
| `git diff --check` | Passed before committing. |

The unit cases cover normalization/reference integrity, store initial state,
load success, concurrent/reentrant deduplication, successful-load reuse, failure
and retry, synchronous loader failure, plain-text edits, draft retention during
loading/retry, independent store instances, and one canonical user update shared
by both Maya posts and the configured composer/profile identity.

## Known limitations

- The previously documented fixed navigation still overlaps the initial
  composer Publish area at both sizes. Scrolling reveals Publish and all helper
  text with the clearance measured above. This is a preserved layout limitation,
  not a new pass for initial composer clearance.
- The first exploratory browser navigation requested /favicon.ico and received
  HTTP 404. No application JavaScript error accompanied it. Application files
  were left unchanged.
- Coverage is limited to this Chromium version and these two CSS viewports.
  Physical touch devices, other engines, safe-area hardware, screen readers,
  reduced transparency and increased contrast preferences were not exercised.
- The fixture service resolves immediately. Transient loading appearance,
  empty-data and load-failure/retry UI were not forced in the browser; failure,
  retry, empty state and draft preservation during loads have unit coverage.
- DOM identity labels do not independently prove internal object identity;
  the store unit test covers the canonical shared-record update.
- Draft persistence across refresh is not implemented. Uploads, publishing and
  reactions remain disabled. No application behavior, dependencies, deployment
  or later-task functionality changed.

Task 4's previously outstanding browser and draft-retention checks are now
verified within the scope above; the documented layout and favicon limitations
remain.
