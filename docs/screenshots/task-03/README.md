# Task 03 — client models, nested fixtures and normalized feed service

Implementation revision: **this commit** (implementation, tests and evidence are
committed together). Parent revision: `63a9d98ddee1ab61a47cf23905992c8db434725b`.
Fresh browser evidence was captured on **28 October 2026, 17:23–17:26 UTC
(Europe/London)**.

## Environment and scope

- Browser: ChatGPT in-app browser (IAB); engine/version metadata is not exposed
  by the available browser inspection interface.
- Mobile viewport: **390 × 844 CSS pixels**. Desktop: **1440 × 900 CSS pixels**.
- Production app served at `http://127.0.0.1:3002` with
  `npm start -- --hostname 127.0.0.1 --port 3002`.
- Task 3 adds shared model types and a fixture-backed feed module. Routes,
  components, styles, presentation samples and public assets are unchanged.
  The service is not connected to the UI or a store.

## Fresh screenshots and visual comparison

All primary screenshots were captured at the top of their routes, with scroll
position 0 explicitly verified for the home feed. These are fresh captures of
the running production app, not copies of Task 2 evidence.

The browser API supplies JPEG frames. They were encoded as PNG without resizing,
cropping or retouching; decoded-pixel checks confirm the PNGs match the fresh
frames. All nine PNGs have their recorded viewport dimensions.

| Route | Mobile capture | Desktop capture | Decoded pixels different from Task 2 baseline |
| --- | --- | --- | --- |
| `/` | [home-mobile.png](home-mobile.png) | [home-desktop.png](home-desktop.png) | 0 mobile; 0 desktop |
| `/create` | [create-mobile.png](create-mobile.png) | [create-desktop.png](create-desktop.png) | 0 mobile; 0 desktop |
| `/profile` | [profile-mobile.png](profile-mobile.png) | [profile-desktop.png](profile-desktop.png) | 0 mobile; 0 desktop |

The comparison used the corresponding six committed images in
`docs/screenshots/task-02/`. Appearance is unchanged at both tested sizes.

Additional fresh scrolled captures:

- [home-mobile-bottom.png](home-mobile-bottom.png): later posts and end-of-feed note.
- [create-mobile-bottom.png](create-mobile-bottom.png): Publish and helper text above navigation.
- [create-desktop-bottom.png](create-desktop-bottom.png): the same controls on desktop.

## Browser checks and actual results

All checks below passed at both viewport sizes:

| Check | Actual result |
| --- | --- |
| Direct access and refresh | `/`, `/create` and `/profile` rendered their expected headings before and after reload. |
| Link navigation and history | Home → Create → Profile → Back to Create → Back to Home → Forward to Create → Forward to Profile matched the expected URLs. |
| Active navigation | Exactly one `aria-current="page"` link matched each route on direct access, refresh and history traversal. |
| Textarea and label | Caption accepted two lines of input and retained them during editing; its accessible label was `Caption`. |
| Keyboard access | Tab order remained Skip to content → NewsFeed home → Caption → Home → Create → Profile. Each stop had a visible 2px solid focus outline and was in the viewport. Disabled controls were skipped. |
| Keyboard activation | Enter on Profile opened `/profile`; the skip link focused `main-content`. |
| Disabled actions | Three Like controls remained disabled on Home; Add an image and Publish remained disabled on Create. |
| Images | The existing local feed images loaded successfully. |
| Overflow and widths | No horizontal overflow on any route, including page ends. Content surfaces remained 358px mobile / 520px desktop; navigation remained 366px / 420px. |
| Console | No browser warnings or errors were captured. |

End-of-page clearance between the final relevant content and the highest edge
of navigation, including the raised Create circle:

| Route | Mobile clearance | Desktop clearance |
| --- | --- | --- |
| `/` — end-of-feed note | 55.6px | 56.4px |
| `/create` — Publish area and helper text | 76.5px | 80.5px |
| `/profile` — profile surface | 118.5px | 162.5px |

## Code validation and actual results

| Command/check | Actual result |
| --- | --- |
| `npm test` | Exit 0: 13 passed, 0 failed, 0 skipped. Uses Node's built-in runner and `tsx` 4.23.15; no browser test framework added. |
| `npm run lint` | Exit 0; no warnings or errors. |
| `npm run typecheck` | Exit 0; route type generation and strict TypeScript checking passed, including unit tests. |
| `npm run build` | Exit 0; `/`, `/create`, `/profile` and the framework not-found route prerendered. |
| `npm start -- --hostname 127.0.0.1 --port 3002` | Server ready; used for the browser checks and captures above. |
| Direct `getFeed()` smoke check via `node --import tsx` | Resolved 3 posts, 2 users and 2 media records. The coastal post referenced `user-maya-chen` and `media-coastal-cove`, with total reactions 24. |
| `git diff --exit-code -- src/app src/components src/demo public` | Exit 0; existing application and presentation files unchanged. |
| PNG dimensions and fresh-frame pixel checks | All nine files passed. All six primary images also matched the Task 2 baseline pixel-for-pixel. |
| `git diff --check` | Passed before committing. |

The 13 unit cases cover repeated authors, reference integrity, text-only posts,
first-appearance ordering, duplicate records, ordered media and optional previews,
content/engagement/metadata preservation, UTF-16 offsets, empty input, frozen-input
immutability, result isolation, prototype-like IDs and independent service calls.

## Limitations

- Browser coverage is limited to the IAB and the two recorded sizes. Other
  engines, physical devices, safe-area hardware, screen readers and blur-disabled
  or reduced-transparency environments were not tested. Engine/version metadata
  was unavailable.
- The pre-existing fixed navigation overlaps the initial composer Publish area.
  Scrolling reveals it fully, as documented in the supplemental captures. Task 3
  preserves this layout rather than changing UI behaviour.
- The feed service uses typed, trusted fixture input. Runtime schema validation,
  rich-text parsing, transport contracts, requests and live API behaviour are not
  implemented or claimed as tested.
- Draft text still has no persistence guarantee. Upload, Publish and reactions
  remain disabled, and no successful actions were simulated.
- No Zustand, UI/store integration, deployment or later-task work was performed.
