# Task 02 — visual shell, three routes and shared navigation

Fresh backfill captured on **28 October 2026, 16:59–17:03 UTC (Europe/London)**.

- Original Task 2 implementation: `566d0ab1792fe30341586b895b35ce68b9ec8c0f`.
- Application revision actually verified: `5b54216bbbcf52f7f3863dc1b6803f99e6e798dc`.
  This includes the subsequent CSS comments/formatting commit. These captures
  verify the current application, rather than claiming to be historical images
  taken during the original Task 2 implementation.
- Browser: **ChatGPT in-app browser (IAB)**. Its engine/version is not exposed
  by the available browser inspection interface.
- Mobile viewport: **390 × 844 CSS pixels**. Desktop: **1440 × 900 CSS pixels**.
- Application: production build served at `http://127.0.0.1:3002` using
  `npm start -- --hostname 127.0.0.1 --port 3002`.

No application code, styles or behaviour were changed for this backfill.

## Screenshots

All six primary captures were taken at the top of their routes, with the home
feed explicitly checked at scroll position 0. They show the actual running app,
not mockups or reused images. The browser API supplies JPEG frames; these were
encoded as PNG without resizing, cropping or retouching. A decoded-pixel
comparison confirmed each saved PNG matches its fresh browser frame exactly.

| Route | Mobile — 390 × 844 | Desktop — 1440 × 900 |
| --- | --- | --- |
| `/` | [home-mobile.png](home-mobile.png) | [home-desktop.png](home-desktop.png) |
| `/create` | [create-mobile.png](create-mobile.png) | [create-desktop.png](create-desktop.png) |
| `/profile` | [profile-mobile.png](profile-mobile.png) | [profile-desktop.png](profile-desktop.png) |

Additional scrolled views show content beyond the first viewport:

- [home-mobile-bottom.png](home-mobile-bottom.png): the later sample posts and end-of-feed note above navigation.
- [create-mobile-bottom.png](create-mobile-bottom.png): disabled Publish and its explanatory text clear of navigation.
- [create-desktop-bottom.png](create-desktop-bottom.png): the same final controls at the desktop viewport.

## Browser checks and actual results

The following checks passed at **both** viewport sizes:

| Check | Actual result |
| --- | --- |
| Direct route access and refresh | `/`, `/create` and `/profile` each rendered their expected heading before and after a full reload. |
| Link navigation and Back/Forward | Followed Home → Create → Profile, Back → Create, Back → Home, Forward → Create, Forward → Profile. All destinations matched. |
| Active navigation | Exactly one navigation link had `aria-current="page"`, matching the URL, on direct visits, refresh and history traversal. |
| Textarea input and label | Caption accepted and retained two lines of typed text during editing; its associated label was `Caption` and field name was `caption`. |
| Keyboard access and focus | Tab order: Skip to content → NewsFeed home → Caption → Home → Create → Profile. Every stop had a visible 2px solid focus outline and was in the viewport. Disabled controls were skipped. |
| Keyboard activation | Enter on Profile opened `/profile`; Enter on Skip to content focused `main-content`. |
| Horizontal overflow | None on any of the six route/viewport combinations, including at the end of each page. |
| Responsive widths | Post/form/profile surfaces were 358px on mobile and 520px on desktop; navigation was 366px and 420px respectively. |
| Local feed images | Both loaded, had descriptive alt text, and reserved intrinsic dimensions of 1200 × 800. |
| Browser console | No warnings or errors were captured during the final browser checks. |

At the end of each page, the lowest relevant content was fully above the
topmost edge of navigation, including its raised Create circle:

| Route | Mobile clearance | Desktop clearance |
| --- | --- | --- |
| `/` — end-of-feed note | 55.6px | 56.4px |
| `/create` — Publish area including helper text | 76.5px | 80.5px |
| `/profile` — profile surface | 118.5px | 162.5px |

The fixed bar overlaps scrolling content at intermediate positions. The feed
and composer require vertical scrolling; the end-of-page checks and additional
screenshots confirm that final content and controls can be fully revealed.

## Validation commands and actual results

| Command/check | Result |
| --- | --- |
| `npm run lint` | Exit 0; no warnings or errors. |
| `npm run typecheck` | Exit 0; Next.js route types generated and TypeScript passed. |
| `npm run build` | Exit 0; `/`, `/create`, `/profile` and the framework not-found page prerendered successfully. |
| `npm start -- --hostname 127.0.0.1 --port 3002` | Server ready; used for all captures and browser checks above. |
| PNG format, dimensions and decoded-pixel comparison | All nine files are valid PNGs at their recorded viewport dimensions, matching the fresh browser frames. |
| `git diff --check` | Passed before committing this documentation and evidence. |

## Limitations

- In the initial composer view, fixed navigation overlaps the Publish area at
  both sizes. Scrolling reveals those controls completely, as shown in the
  supplemental screenshots and clearance measurements. The existing layout
  was documented, not changed, in this documentation task.
- Coverage is limited to the IAB at the two recorded viewport sizes. Other
  browsers, physical touch devices, notched-device safe areas, screen readers,
  reduced-transparency preferences and unavailable-backdrop-blur behaviour were
  not tested. Browser engine/version metadata was unavailable.
- These are viewport screenshots, not full-page captures. Additional scrolled
  screenshots supplement the required route-at-top captures.
- Like, upload and Publish remain disabled demo controls. No successful actions
  were simulated or asserted.
- Draft text has no persistence guarantee. Input was verified within the
  current page; browser/router restoration is not a draft-saving feature.
- No Task 3 work or deployment was performed.
