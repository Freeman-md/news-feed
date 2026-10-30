import { dom } from "./dom";
import assert from "node:assert/strict";
import { after, afterEach, beforeEach, test } from "node:test";
import { act, StrictMode, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { ComposerForm } from "../../src/components/ComposerForm";
import { FeedPosts } from "../../src/components/FeedPosts";
import { ProfileDetails } from "../../src/components/ProfileDetails";
import { DEMO_USER_ID } from "../../src/demo/config";
import { FeedStoreProvider } from "../../src/modules/feed/FeedStoreProvider";
import { feedFixture } from "../../src/modules/feed/feed.fixtures";
import { normalizeFeed } from "../../src/modules/feed/feed.normalize";
import { createFeedStore } from "../../src/modules/feed/feed.store";
import type { NormalizedFeedData } from "../../src/modules/feed/feed.types";

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

after(() => dom.window.close());

function deferred() {
  let resolve!: (data: NormalizedFeedData) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<NormalizedFeedData>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

function sampleData() {
  return normalizeFeed(feedFixture);
}

async function render(store: ReturnType<typeof createFeedStore>, children: ReactNode) {
  await act(async () => {
    root.render(<StrictMode><FeedStoreProvider store={store}>{children}</FeedStoreProvider></StrictMode>);
  });
}

function names(selector: string) {
  return Array.from(container.querySelectorAll(selector), (element) => element.textContent);
}

function caption() {
  const field = container.querySelector<HTMLTextAreaElement>("textarea");
  assert.ok(field);
  const label = container.querySelector(`label[for="${field.id}"]`);
  assert.equal(label?.textContent, "Caption");
  return field;
}

test("unresolved loading shows status, then renders actual post cards in feed order", async () => {
  const request = deferred();
  const store = createFeedStore(() => request.promise);
  await render(store, <FeedPosts />);
  assert.equal(container.querySelector('[role="status"]')?.textContent, "Loading your feed…");
  assert.equal(container.querySelectorAll("article").length, 0);

  const data = sampleData();
  // A distinct order catches views that accidentally use record insertion order.
  data.feed.postIds.reverse();
  await act(async () => { request.resolve(data); await store.getState().loadFeed(); });
  assert.deepEqual(names("article h3"), ["Maya Chen", "Leo Park", "Maya Chen"]);
  assert.deepEqual(names(".post-caption"), data.feed.postIds.map((id) => data.postsById[id].body.text));
  assert.deepEqual(names(".reaction-summary"), ["12 likes", "18 likes", "24 likes"]);
  assert.equal(container.querySelector(".feed-heading p")?.textContent, "3 sample posts");
  assert.equal(container.querySelector('[role="status"]'), null);
  assert.equal(container.querySelector('[role="alert"]'), null);
});

test("successful empty feed renders an empty message without post cards or errors", async () => {
  const request = deferred();
  const store = createFeedStore(() => request.promise);
  await render(store, <FeedPosts />);
  const data = sampleData();
  data.feed.postIds = [];
  data.postsById = {};
  data.usersById = {};
  data.mediaById = {};
  await act(async () => { request.resolve(data); await store.getState().loadFeed(); });
  assert.equal(container.querySelector('[role="status"]')?.textContent, "No moments to show yet.");
  assert.equal(container.querySelector(".feed-heading p")?.textContent, "0 sample posts");
  assert.equal(container.querySelector("article"), null);
  assert.equal(container.querySelector('[role="alert"]'), null);
  assert.equal(container.querySelector("button"), null);
});

test("rendered failure and retry recover feed content and preserve existing draft text", async () => {
  const failed = deferred();
  const retry = deferred();
  let calls = 0;
  const store = createFeedStore(() => ++calls === 1 ? failed.promise : retry.promise);
  const draft = "Keep this draft 🌊\n  café and two leading spaces";
  store.getState().setDraftText(draft);
  await render(store, <FeedPosts />);
  await act(async () => {
    failed.reject(new Error("Internal loader information"));
    await store.getState().loadFeed();
  });
  assert.equal(container.querySelector('[role="alert"]')?.textContent, "We couldn’t load your feed. Please try again.");
  assert.ok(!container.textContent?.includes("Internal loader information"));
  const button = container.querySelector<HTMLButtonElement>("button");
  assert.ok(button);
  assert.equal(button.textContent, "Try again");
  assert.equal(button.disabled, false);
  assert.equal(calls, 1);
  await act(async () => button.click());
  assert.equal(calls, 2);
  assert.equal(container.querySelector('[role="status"]')?.textContent, "Loading your feed…");
  assert.equal(container.querySelector('[role="alert"]'), null);
  await act(async () => { retry.resolve(sampleData()); await store.getState().loadFeed(); });
  assert.equal(container.querySelectorAll("article").length, 3);
  assert.equal(container.querySelector('[role="alert"]'), null);
  assert.equal(store.getState().composerDraft.body.text, draft);
  await render(store, <><FeedPosts /><ComposerForm /></>);
  assert.equal(caption().value, draft);
});

test("one canonical author update changes both posts, composer and profile in the DOM", async () => {
  const store = createFeedStore(async () => sampleData());
  await render(store, <><FeedPosts /><ComposerForm /><ProfileDetails /></>);
  const selector = "article h3, .composer .author-name, .profile h2";
  assert.deepEqual(names(selector), ["Maya Chen", "Leo Park", "Maya Chen", "Maya Chen", "Maya Chen"]);
  await act(async () => {
    store.setState((state) => ({ usersById: {
      ...state.usersById,
      [DEMO_USER_ID]: { ...state.usersById[DEMO_USER_ID], name: "Maya Renamed", handle: "@maya-renamed" },
    } }));
  });
  assert.deepEqual(names(selector), ["Maya Renamed", "Leo Park", "Maya Renamed", "Maya Renamed", "Maya Renamed"]);
  assert.equal(container.querySelector(".profile-identity p")?.textContent, "@maya-renamed");
  assert.equal(container.querySelectorAll('article[aria-label="Sample post by Maya Renamed"]').length, 2);
  assert.equal(container.querySelector('[role="alert"]'), null);
});

test("caption input updates the store and remounting under the same provider restores it", async () => {
  const store = createFeedStore(async () => sampleData());
  await render(store, <ComposerForm />);
  const field = caption();
  const draft = "Task 5 draft café 🌊\n  Line two\nFinal line";
  await act(async () => {
    // Native setter + bubbling input follows the DOM input path, not the store action.
    const setter = Object.getOwnPropertyDescriptor(dom.window.HTMLTextAreaElement.prototype, "value")?.set;
    assert.ok(setter);
    setter.call(field, draft);
    field.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  });
  assert.equal(store.getState().composerDraft.body.text, draft);
  assert.deepEqual(store.getState().composerDraft.body.entities, []);
  await render(store, <ProfileDetails />);
  assert.equal(container.querySelector("textarea"), null);
  await render(store, <ComposerForm />);
  assert.notEqual(caption(), field);
  assert.equal(caption().value, draft);
  assert.match(container.querySelector("#publish-help")?.textContent ?? "", /refresh may clear them/);
  assert.equal(container.querySelector<HTMLButtonElement>(".upload-placeholder")?.disabled, true);
  assert.equal(container.querySelector<HTMLButtonElement>(".publish-button")?.disabled, true);
});

test("direct composer and profile content handle pending loading and retry", async () => {
  const first = deferred();
  const retry = deferred();
  let calls = 0;
  const store = createFeedStore(() => ++calls === 1 ? first.promise : retry.promise);
  await render(store, <><ComposerForm /><ProfileDetails /></>);
  assert.deepEqual(names('[role="status"]'), ["Loading your feed…", "Loading your feed…"]);
  await act(async () => { first.reject(new Error("Unavailable")); await store.getState().loadFeed(); });
  assert.equal(container.querySelectorAll('[role="alert"]').length, 2);
  const button = container.querySelector<HTMLButtonElement>("button");
  assert.ok(button);
  await act(async () => button.click());
  await act(async () => { retry.resolve(sampleData()); await store.getState().loadFeed(); });
  assert.equal(caption().value, "");
  assert.equal(container.querySelector(".profile h2")?.textContent, "Maya Chen");
  assert.equal(container.querySelector('[role="alert"]'), null);
});
