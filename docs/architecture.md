# NewsFeed architecture

NewsFeed currently renders three fixture posts. The implemented path is
View → Store → Data access; a real server is not implemented.

| Responsibility | Files | Ownership |
| --- | --- | --- |
| Routes and chrome | `src/app/`, `src/components/Header.tsx`, `BottomNavigation.tsx` | App Router routes, shared layout, normal Next.js links, active navigation and styles. |
| Subscribed views | `src/components/{FeedPosts,PostCard,ComposerForm,ProfileDetails,FeedLoadState}.tsx` | Render records, derive display labels and trigger actions. No direct service/fixture imports. |
| Store and React lifetime | `src/modules/feed/feed.store.ts`, `FeedStoreProvider.tsx` | Canonical records, ordered feeds, draft, load state, actions and subscriptions. |
| Data access | `src/modules/feed/{feed.service,feed.fixtures,feed.normalize}.ts` | Acquire temporary nested samples and normalize them. No networking yet. |
| Shared models | `src/models/` | `Post`, `User`, `Media`, `Feed`, `ComposerDraft` and related types, independent of React/Zustand. |
| Module types | `src/modules/feed/feed.types.ts` | Store state/actions, `NormalizedFeedData`, and temporary nested fixture input types. |
| Demo presentation | `src/demo/config.ts` | Explicit `HOME_FEED_ID`, `DEMO_USER_ID` and profile bio; no competing entity objects. |

## Initialization and ownership

`RootLayout` remains a Server Component. It places `FeedStoreProvider` around
route content inside the shared main region. The Client Component provider
creates a store with lazy `useState`; each mounted provider owns its instance.
There is no mutable module-wide application store. Server Components never
read or mutate it.

Both prerendering and the first client render start with empty collections,
an empty draft and `loadStatus: "idle"`. The provider's client effect calls
`store.getState().loadFeed()`. Client views show an accessible loading status
until the result arrives. The optional provider `store` prop is captured on
mount, allowing integration tests to supply a fresh `createFeedStore(loader)`;
production supplies no prop and keeps the same lifetime/initialization.

The provider belongs to the shared layout, so `/`, `/create` and `/profile`
use one instance during Next.js link navigation and Back/Forward. A full page
refresh starts a new instance. No persistence middleware or localStorage exists.

## A post through the system

`getFeed()` obtains `feedFixture` and calls the pure `normalizeFeed()`.
For example, the nested `post-coastal-walk` contains an author object with ID
`user-maya-chen` and a media object with ID `media-coastal-cove`. Normalization
produces:

```text
feed.postIds = [post-coastal-walk, post-morning-coffee, post-small-reminder]
postsById[post-coastal-walk].authorId = user-maya-chen
postsById[post-coastal-walk].mediaIds = [media-coastal-cove]
usersById[user-maya-chen] = Maya's user record
mediaById[media-coastal-cove] = local image source, alt text and dimensions
```

`Feed` describes order and metadata: ID, generation, post IDs, cursors,
availability flags and fetch time. `NormalizedFeedData` is the service result
containing that feed **and** the entity collections needed to resolve its IDs.
The store puts the feed under `feedsById[feed.id]` and applies those collections
in one successful-load update. Draft state is not part of that update.

Maps inside `normalizeFeed()` retain each post ID's first position; the last
encountered post/user/media record wins for a duplicate ID. Ordered media
references are retained. `structuredClone(input.posts)` detaches nested bodies,
engagement, relationships and media from shared fixtures. Mutating a result
cannot mutate fixture input or a later service result. Rich-text values and
UTF-16 offsets are preserved without parsing.

`FeedPosts` selects `feedsById[HOME_FEED_ID]?.postIds` and maps that order to
`PostCard`. Each card selects its own post and `usersById[post.authorId]`;
each image child selects `mediaById[mediaId]`. UTC timestamps, initials and
reaction labels are derived by views rather than added to entity models.
Selectors return existing arrays/records or primitive values, not fresh
composite objects on each read. They do not subscribe to the whole store.

Both Maya posts reference `user-maya-chen`. Composer and profile select that
same ID via `DEMO_USER_ID`, rather than guessing the viewer from feed order.
Replacing this canonical user record updates all four rendered identities;
there is no production user-editing action. The bio stays presentation-only
because `User` does not contain a bio field.

## Draft edits and recovery

`ComposerForm` reads `composerDraft.body.text` into the controlled Caption
textarea. Its `onChange` calls `setDraftText(text)`. That action replaces the
body with `{ text, entities: [] }` and preserves media IDs, upload/submit state
and unrelated feed state. This is a plain-text composer. The draft remains in
the provider-owned store while route components unmount/remount, but a refresh
creates an empty draft. Helper text makes no refresh-persistence promise.

`loadFeed()` keeps its in-flight promise inside the factory instance. Concurrent
calls share it, including repeated effects in development Strict Mode. Success
sets `loadStatus: "success"` and clears errors; later loads reuse the result.
Failure sets a safe message without leaking loader error details, clears the
in-flight guard when settled and permits an explicit retry. A retry shows
loading again and success replaces the error. These transitions preserve the
draft, including edits made during the request. There are no automatic retries
or refreshes.

`FeedLoadState` supplies status/error text and a retry button. Composer and
profile use it when opened before their user is available. A successful feed
with no post IDs renders `No moments to show yet.` and a zero count, without
cards or an error. A successful result missing the configured demo user shows
an unavailable-identity message. Missing referenced post/author/media records
have explicit unavailable messages rather than inventing placeholder entities.

## Audit and verification (Task 5)

The audit traced initialization, acquisition/normalization, store application,
ordered rendering, canonical identity, draft changes and recovery. No direct
data-access imports in views, duplicated entity state, singleton application
store, unstable selector result or accidental persistence was found. No product
or layout refactor was needed. The concrete gap was rendered integration
coverage; the provider seam and tests address it.

`npm test` runs both `tests/unit/` and `tests/integration/` through Node's runner
and `tsx`. Integration tests render the real components with React DOM, jsdom
and React's `act()`, using controlled promises and DOM assertions. They cover
loading/order, empty data, safe failure/retry with draft retention, canonical
user updates, textarea input/remounting, and pending/failing identity views.
They run in Strict Mode and do not mock the components, service records or
Next Image component. jsdom does not establish layout, image decoding,
hydration or Next.js navigation behavior. Component remounting under one
provider is explicitly separate from route/history tests.

Actual command results and fresh browser checks live in
[Task 5 evidence](screenshots/task-05/README.md). Earlier
[Task 4 evidence](screenshots/task-04/README.md) is historical context, not a
substitute for those new checks. No performance benchmark or scalability
conclusion follows from three fixture posts.

## Future contracts and current limits

When a real API is assigned, the service's acquisition will change to a request.
Its transport contract, runtime validation and adaptation to shared client
models must be defined then. `NestedFeedInput` and `NestedFeedPost` are temporary
fixture types, not an approved API schema. Views should continue consuming
normalized state; no speculative transport layer is implemented today.

The service currently trusts typed fixture data and resolves immediately.
Pagination metadata exists but pagination is not implemented. There is no
backend, authentication, database, upload, publishing, reaction mutation,
infinite scrolling or draft persistence. Upload, Publish and Like controls
stay disabled. The accepted navigation/composer layout is unchanged. Alternate
loading/empty/error states are exercised in DOM integration tests rather than
an artificial browser harness or shipped debug route.
