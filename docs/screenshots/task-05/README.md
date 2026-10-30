# Task 05 — integration verification and architecture review

Verified implementation: **this commit**; code, tests, walkthrough and fresh
evidence are committed together. Parent: `61f14ec2c86fc4f194f9dc35094f787aa656c5da`.
New checks and screenshots below were performed on **30 October 2026
(Europe/London)** against the final Task 5 production build.

## Newly performed browser verification

- Browser: ChatGPT in-app browser (IAB). Engine/version metadata is not exposed
  by the available inspection interface.
- Mobile: **390 × 844 CSS pixels**. Desktop: **1440 × 900 CSS pixels**.
- Actual running production app: `http://127.0.0.1:3002`, served with
  `npm start -- --hostname 127.0.0.1 --port 3002`. Server stopped afterward.
- The IAB supplies JPEG frames. Each fresh frame was encoded to PNG without
  resizing, cropping or retouching; all 16 PNGs passed decoded-pixel equality
  against their source frame and viewport dimension checks.
- No earlier screenshot was reused. Home captures explicitly had scrollTop 0.

| Route | Mobile | Desktop |
| --- | --- | --- |
| `/` | [home-mobile.png](home-mobile.png) | [home-desktop.png](home-desktop.png) |
| `/create` | [create-mobile.png](create-mobile.png) | [create-desktop.png](create-desktop.png) |
| `/profile` | [profile-mobile.png](profile-mobile.png) | [profile-desktop.png](profile-desktop.png) |

| Additional state | Mobile | Desktop |
| --- | --- | --- |
| Later posts/end of feed | [home-mobile-bottom.png](home-mobile-bottom.png) | [home-desktop-bottom.png](home-desktop-bottom.png) |
| Scrolled composer controls/helper text | [create-mobile-bottom.png](create-mobile-bottom.png) | [create-desktop-bottom.png](create-desktop-bottom.png) |
| Draft after link navigation | [create-draft-after-navigation-mobile.png](create-draft-after-navigation-mobile.png) | [create-draft-after-navigation-desktop.png](create-draft-after-navigation-desktop.png) |
| Draft after Back/Forward | [create-draft-after-history-mobile.png](create-draft-after-history-mobile.png) | [create-draft-after-history-desktop.png](create-draft-after-history-desktop.png) |
| Caption keyboard focus after refresh | [create-caption-focus-mobile.png](create-caption-focus-mobile.png) | [create-caption-focus-desktop.png](create-caption-focus-desktop.png) |

| Check | Actual result at both sizes |
| --- | --- |
| Direct routes and refresh | `/`, `/create`, `/profile` opened directly and reloaded with the expected headings and loaded content. |
| Ordinary links | Create → Home → Create → Profile → Create navigated using the existing Next.js links. |
| Active navigation | Exactly one `aria-current="page"` matched the URL on direct access, reload, link navigation and history traversal. |
| Draft after navigation | Full textarea value matched the distinctive three-line draft on both returns to Create. |
| Back/Forward | From final Create: Back to Profile → Back to Create → Back to Home → Forward to Create → Forward to Profile → Forward to Create. Full draft equality passed on every return. |
| Refresh and helper | Refreshing Create reset its textarea to empty. Helper text says drafts stay during navigation and refresh may clear them. |
| Feed order/content | Coastal Maya post → Leo coffee post → Maya text-only reminder; expected captions and 24 / 18 / 12 likes. |
| Identity | Both Maya post names, composer and profile showed Maya Chen. Internal canonical-record update propagation is tested separately by the rendered integration test. |
| Images | Both local post images reported complete with nonzero natural width and descriptive alt text, including at the feed bottom. |
| Disabled features | All three Like controls, Add an image and Publish were disabled. No successful action was simulated. |
| Keyboard and labels | Skip to content → NewsFeed home → Caption → Home → Create → Profile; all stops had a 2px solid focus outline and disabled buttons were skipped. Caption was targeted through its accessible label. Enter on Profile navigated correctly. |
| Layout | No horizontal overflow on the three route tops or Home/Create bottoms. Surfaces were 358px mobile / 520px desktop; navigation was 366px / 420px. Existing layout was preserved. |
| Runtime observations | Client content settled successfully; the tab's console interface returned no warnings or errors, and no hydration/subscription/application error surfaced during the checks. |

Exact draft (replace `mobile` with `desktop` for that run):

```text
Task 5 — mobile verification
  Keep two leading spaces, café & 🌊.
Final line: shared draft
```

The second line starts with two spaces. Equality used the entire DOM textarea
value, not just what was visible in the screenshot. During desktop exploration,
an automation helper compared against a captured mobile expected string. Direct
inspection showed the correct desktop value; desktop navigation and history
comparisons were rerun with explicit expected values and passed. No application
change was needed.

## Newly performed DOM integration coverage

`tests/integration/feed.test.tsx` renders actual application components through
React DOM in jsdom, under Strict Mode, with fresh controlled stores. Six tests:

1. An unresolved promise shows loading; resolving it renders real post cards in
   deliberately reversed feed order, with expected captions, reaction labels
   and dynamic count.
2. Successful empty data shows the empty message/zero count, with no cards,
   error or retry button.
3. Rejection shows only the safe error and enabled retry; clicking retry invokes
   the loader again, shows loading and then feed content. Existing Unicode draft
   text survives and appears in the actual composer after recovery.
4. Updating Maya's one canonical user through `store.setState` updates both post
   author names, composer identity, profile name/handle and article labels.
5. A native textarea input event updates the store; unmounting/remounting the
   composer under the same provider restores the exact draft. This does not
   pretend to be a Next.js route/history test.
6. Composer and profile opened while loading show status and safe failure/retry,
   then recover their identity content.

Controlled promises are resolved/rejected inside React `act()`; assertions use
DOM content, labels and controls, without sleeps or snapshot-only comparisons.
Tests do not mock the rendered components or install a browser-test framework.
jsdom does not execute downloaded scripts or load images/styles for these tests.
Loading, empty and failure/retry alternate states were verified **only through
DOM integration tests**, not browser screenshots. No browser harness was added.

## Final command results

| Command/check | Actual result |
| --- | --- |
| `npm test` | Exit 0: **29 passed, 0 failed, 0 skipped** — 23 unit tests and 6 rendered integration tests. |
| `npm run lint` | Exit 0, no warnings/errors. |
| `npm run typecheck` | Exit 0, generated route types and strict checking including tests. |
| `npm run build` | Exit 0; all three routes and the framework not-found route prerendered. |
| `npm start -- --hostname 127.0.0.1 --port 3002` | Production server ready; used for the fresh browser checks above, then stopped. |
| PNG dimension/decoded-pixel verification via existing `sharp` | All 16 PNGs passed. |
| `git diff --exit-code -- src/app src/components src/models src/demo src/modules/feed/feed.store.ts src/modules/feed/feed.service.ts src/modules/feed/feed.normalize.ts src/modules/feed/feed.fixtures.ts` | Exit 0; route/view/layout styles, models, store behavior, service, normalizer and fixtures unchanged. |
| `git diff --check` | Passed before committing. |

Only jsdom **29.1.1** and `@types/jsdom` **27.0.0** were added as direct dev
dependencies; the runtime dependency set is unchanged. jsdom 29.1.1 supports
the declared Node 22.13 minimum; current jsdom 30 requires a newer Node release.

## Architecture audit and earlier context

The audit traced provider/effect initialization, service → normalizer → store,
feed ordering, record resolution, draft actions and recovery. It found no direct
data-access imports in views, duplicate canonical entity collections, broad
whole-store subscriptions, unstable composite selectors, shared application
singleton, obsolete sample objects or accidental persistence. The concrete gap
was rendered integration coverage. A small mount-time provider store prop enables
isolated tests while retaining the production default and lifetime. No product
or UI refactor was justified.

See [architecture.md](../../architecture.md) for concrete IDs/functions and
current boundaries. [Task 4 evidence](../task-04/README.md), verified against
`0d4036f` and committed as `61f14ec`, is earlier context only. Its Chromium
results and 16 captures are not presented as Task 5 checks.

## Remaining limitations and scope

- Browser coverage is limited to IAB at the two recorded viewports. Its engine
  version, other engines, physical devices/safe-area hardware, screen readers
  and alternate contrast/transparency preferences were not checked.
- The accepted navigation/composer layout remains unchanged. Scrolled captures
  show final controls; earlier documented initial overlap remains accepted.
- No network-request audit or performance/scalability benchmark was performed.
  Earlier Task 4 favicon observations were not separately retested here.
- Fixture loading resolves immediately. Alternate load/empty/error states have
  rendered DOM coverage only; no artificial browser captures are claimed.
- Draft persistence after refresh and all publishing, upload, reaction,
  authentication, server/API, database and infinite-scroll features remain absent.
  No debug route, query flag, fixture switch or later-stage functionality ships.

Task 5's agreed verification/documentation scope is complete within these limits.
