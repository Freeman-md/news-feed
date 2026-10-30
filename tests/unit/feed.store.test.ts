import assert from "node:assert/strict";
import test from "node:test";
import { DEMO_USER_ID, HOME_FEED_ID } from "../../src/demo/config";
import { feedFixture } from "../../src/modules/feed/feed.fixtures";
import { normalizeFeed } from "../../src/modules/feed/feed.normalize";
import { createFeedStore } from "../../src/modules/feed/feed.store";
import type { NormalizedFeedData } from "../../src/modules/feed/feed.types";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

function sampleData() {
  return normalizeFeed(feedFixture);
}

test("starts with empty entities, an idle load and an empty idle draft", () => {
  const state = createFeedStore().getState();
  for (const collection of [state.feedsById, state.postsById, state.usersById, state.mediaById]) {
    assert.deepEqual(collection, {});
  }
  assert.equal(state.loadStatus, "idle");
  assert.equal(state.loadError, null);
  assert.deepEqual(state.composerDraft, {
    body: { text: "", entities: [] }, mediaIds: [], uploadState: "idle", submitState: "idle",
  });
});

test("successful loading applies the normalized feed and entities", async () => {
  const data = sampleData();
  const request = deferred<NormalizedFeedData>();
  const store = createFeedStore(() => request.promise);
  const loading = store.getState().loadFeed();
  assert.equal(store.getState().loadStatus, "loading");
  request.resolve(data);
  await loading;
  const state = store.getState();
  assert.equal(state.loadStatus, "success");
  assert.equal(state.loadError, null);
  assert.deepEqual(state.feedsById, { [data.feed.id]: data.feed });
  assert.deepEqual(state.postsById, data.postsById);
  assert.deepEqual(state.usersById, data.usersById);
  assert.deepEqual(state.mediaById, data.mediaById);
});

test("concurrent loads share a request, including a reentrant subscriber", async () => {
  const request = deferred<NormalizedFeedData>();
  let calls = 0;
  const store = createFeedStore(() => { calls++; return request.promise; });
  let reentrant: Promise<void> | undefined;
  store.subscribe((state) => {
    if (state.loadStatus === "loading") reentrant = state.loadFeed();
  });
  const first = store.getState().loadFeed();
  const second = store.getState().loadFeed();
  assert.equal(first, second);
  assert.equal(first, reentrant);
  await Promise.resolve();
  assert.equal(calls, 1);
  request.resolve(sampleData());
  await Promise.all([first, second, reentrant]);
  assert.equal(store.getState().loadStatus, "success");
});

test("loading after success reuses the loaded records", async () => {
  let calls = 0;
  const store = createFeedStore(async () => { calls++; return sampleData(); });
  await store.getState().loadFeed();
  const loaded = store.getState();
  await store.getState().loadFeed();
  assert.equal(calls, 1);
  assert.equal(store.getState(), loaded);
});

test("failure exposes a safe error and retry clears it while preserving the draft", async () => {
  const failed = deferred<NormalizedFeedData>();
  const retry = deferred<NormalizedFeedData>();
  let calls = 0;
  const store = createFeedStore(() => ++calls === 1 ? failed.promise : retry.promise);
  store.getState().setDraftText("Before loading 🌊\nKeep this exact text.");
  const firstDraft = store.getState().composerDraft;
  const first = store.getState().loadFeed();
  failed.reject(new Error("Internal loader details must not reach the UI"));
  await first;
  assert.equal(store.getState().loadStatus, "error");
  assert.equal(store.getState().loadError, "We couldn’t load your feed. Please try again.");
  assert.equal(store.getState().composerDraft, firstDraft);
  assert.deepEqual(store.getState().postsById, {});

  const second = store.getState().loadFeed();
  assert.equal(store.getState().loadStatus, "loading");
  assert.equal(store.getState().loadError, null);
  store.getState().setDraftText("Edited during retry");
  const retryDraft = store.getState().composerDraft;
  retry.resolve(sampleData());
  await second;
  assert.equal(calls, 2);
  assert.equal(store.getState().loadStatus, "success");
  assert.equal(store.getState().loadError, null);
  assert.equal(store.getState().composerDraft, retryDraft);
  assert.equal(store.getState().composerDraft.body.text, "Edited during retry");
});

test("a synchronously throwing loader also becomes a safe retryable error", async () => {
  let calls = 0;
  const store = createFeedStore(() => {
    if (++calls === 1) throw new Error("Unexpected synchronous failure");
    return Promise.resolve(sampleData());
  });
  await store.getState().loadFeed();
  assert.equal(store.getState().loadStatus, "error");
  await store.getState().loadFeed();
  assert.equal(store.getState().loadStatus, "success");
});

test("draft edits clear rich-text entities and preserve all unrelated state", async () => {
  const store = createFeedStore(async () => sampleData());
  await store.getState().loadFeed();
  store.setState({ composerDraft: {
    body: { text: "#old", entities: [{ type: "hashtag", start: 0, end: 4 }] },
    mediaIds: ["media-test"], uploadState: "failed", submitState: "failed",
  } });
  const before = store.getState();
  store.getState().setDraftText("Plain text ✨\n#no-parsing");
  const after = store.getState();
  assert.deepEqual(after.composerDraft, {
    body: { text: "Plain text ✨\n#no-parsing", entities: [] },
    mediaIds: ["media-test"], uploadState: "failed", submitState: "failed",
  });
  assert.equal(after.composerDraft.mediaIds, before.composerDraft.mediaIds);
  assert.equal(after.feedsById, before.feedsById);
  assert.equal(after.postsById, before.postsById);
  assert.equal(after.usersById, before.usersById);
  assert.equal(after.mediaById, before.mediaById);
  assert.equal(after.loadStatus, before.loadStatus);
  assert.equal(after.loadError, before.loadError);
});

test("successful loading preserves edits made before and during the request", async () => {
  const request = deferred<NormalizedFeedData>();
  const store = createFeedStore(() => request.promise);
  store.getState().setDraftText("Before request");
  const loading = store.getState().loadFeed();
  assert.equal(store.getState().composerDraft.body.text, "Before request");
  store.getState().setDraftText("During request");
  const draft = store.getState().composerDraft;
  request.resolve(sampleData());
  await loading;
  assert.equal(store.getState().composerDraft, draft);
});

test("store instances have independent drafts, requests and canonical records", async () => {
  const one = deferred<NormalizedFeedData>();
  const two = deferred<NormalizedFeedData>();
  let calls = 0;
  const first = createFeedStore(() => { calls++; return one.promise; });
  const second = createFeedStore(() => { calls++; return two.promise; });
  first.getState().setDraftText("Only in store one");
  assert.equal(second.getState().composerDraft.body.text, "");
  const loadingOne = first.getState().loadFeed();
  const loadingTwo = second.getState().loadFeed();
  await Promise.resolve();
  assert.equal(calls, 2);
  one.resolve(sampleData());
  await loadingOne;
  assert.equal(second.getState().loadStatus, "loading");
  assert.deepEqual(second.getState().usersById, {});
  two.resolve(sampleData());
  await loadingTwo;
  const original = second.getState().usersById[DEMO_USER_ID];
  first.setState((state) => ({ usersById: {
    ...state.usersById, [DEMO_USER_ID]: { ...state.usersById[DEMO_USER_ID], name: "Updated Maya" },
  } }));
  assert.equal(second.getState().usersById[DEMO_USER_ID], original);
  assert.equal(original.name, "Maya Chen");
});

test("both Maya posts, composer and profile resolve one updated canonical user", async () => {
  const store = createFeedStore(async () => sampleData());
  await store.getState().loadFeed();
  const updated = { ...store.getState().usersById[DEMO_USER_ID], name: "Maya Updated" };
  store.setState((state) => ({ usersById: { ...state.usersById, [DEMO_USER_ID]: updated } }));
  const state = store.getState();
  const mayaPosts = state.feedsById[HOME_FEED_ID].postIds
    .map((id) => state.postsById[id]).filter((post) => post.authorId === DEMO_USER_ID);
  assert.equal(mayaPosts.length, 2);
  const profileAndComposerIdentity = state.usersById[DEMO_USER_ID];
  for (const post of mayaPosts) {
    assert.equal(state.usersById[post.authorId], profileAndComposerIdentity);
    assert.equal(state.usersById[post.authorId].name, "Maya Updated");
  }
  assert.equal(profileAndComposerIdentity, updated);
});
