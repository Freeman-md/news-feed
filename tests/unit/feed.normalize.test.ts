import assert from "node:assert/strict";
import { test } from "node:test";
import { feedFixture } from "@/modules/feed/feed.fixtures";
import { normalizeFeed } from "@/modules/feed/feed.normalize";
import { getFeed } from "@/modules/feed/feed.service";

function deepFreeze(value: unknown): void {
  if (value !== null && typeof value === "object") {
    for (const child of Object.values(value)) deepFreeze(child);
    Object.freeze(value);
  }
}

test("separate nested copies of a repeated author become one user record", () => {
  assert.notStrictEqual(feedFixture.posts[0].author, feedFixture.posts[2].author);
  const result = normalizeFeed(feedFixture);

  assert.deepEqual(Object.keys(result.usersById).sort(), ["user-leo-park", "user-maya-chen"]);
  assert.equal(result.postsById["post-coastal-walk"].authorId, "user-maya-chen");
  assert.equal(result.postsById["post-small-reminder"].authorId, "user-maya-chen");
});

test("posts reference existing author and media records without nested entities", () => {
  const result = normalizeFeed(feedFixture);

  for (const source of feedFixture.posts) {
    const post = result.postsById[source.id];
    assert.deepEqual(result.usersById[post.authorId], source.author);
    assert.deepEqual(post.mediaIds, source.media.map((asset) => asset.id));
    for (const asset of source.media) {
      assert.deepEqual(result.mediaById[asset.id], asset);
    }
    assert.equal(Object.hasOwn(post, "author"), false);
    assert.equal(Object.hasOwn(post, "media"), false);
  }
});

test("the text-only post has no media references or placeholder media", () => {
  const result = normalizeFeed(feedFixture);

  assert.deepEqual(result.postsById["post-small-reminder"].mediaIds, []);
  assert.deepEqual(Object.keys(result.mediaById).sort(), ["media-coastal-cove", "media-morning-coffee"]);
});

test("feed order follows first appearance even for duplicate numeric-looking IDs", () => {
  const input = structuredClone(feedFixture);
  const first = { ...input.posts[0], id: "10" };
  const second = { ...input.posts[1], id: "2" };
  input.posts = [first, second, { ...first, body: { text: "Latest copy", entities: [] } }];
  const result = normalizeFeed(input);

  assert.deepEqual(result.feed.postIds, ["10", "2"]);
  assert.equal(Object.keys(result.postsById).length, 2);
  assert.equal(result.postsById["10"].body.text, "Latest copy");
});

test("the last encountered post, user and media records win for duplicate IDs", () => {
  const input = structuredClone(feedFixture);
  const first = input.posts[0];
  input.posts.push({
    ...first,
    author: { ...first.author, name: "Maya's latest name" },
    body: { text: "The latest caption", entities: [] },
    media: [{ ...first.media[0], alt: "The latest image description" }],
  });
  const result = normalizeFeed(input);

  assert.deepEqual(result.feed.postIds, ["post-coastal-walk", "post-morning-coffee", "post-small-reminder"]);
  assert.equal(result.postsById["post-coastal-walk"].body.text, "The latest caption");
  assert.equal(result.usersById["user-maya-chen"].name, "Maya's latest name");
  assert.equal(result.mediaById["media-coastal-cove"].alt, "The latest image description");
});

test("ordered media references, including repeated IDs, and optional previews are preserved", () => {
  const input = structuredClone(feedFixture);
  const coast = input.posts[0].media[0];
  const coffee = input.posts[1].media[0];
  input.posts[0].media = [
    coffee,
    { ...coast, previewSrc: coast.src },
    { ...coffee, alt: "Updated coffee description" },
  ];
  input.posts = [input.posts[0]];
  const result = normalizeFeed(input);

  assert.deepEqual(result.postsById["post-coastal-walk"].mediaIds, [
    "media-morning-coffee", "media-coastal-cove", "media-morning-coffee",
  ]);
  assert.equal(result.mediaById[coast.id].previewSrc, coast.src);
  assert.equal(result.mediaById[coffee.id].alt, "Updated coffee description");
});

test("content, numeric engagement, viewer state, timestamps and feed metadata survive", () => {
  const input = structuredClone(feedFixture);
  input.feed = {
    id: "feed-test",
    generation: "generation-test",
    olderCursor: "older-token",
    newerCursor: "newer-token",
    hasOlder: true,
    hasNewer: true,
    lastFetchedAt: null,
  };
  input.posts[0].engagementSummary.reactions = {
    like: 20, love: 3, haha: 0, wow: 1, sad: 0, angry: 0,
  };
  const result = normalizeFeed(input);

  assert.deepEqual(result.feed, {
    ...input.feed,
    postIds: ["post-coastal-walk", "post-morning-coffee", "post-small-reminder"],
  });
  for (const source of input.posts) {
    const post = result.postsById[source.id];
    assert.deepEqual(post.body, source.body);
    assert.deepEqual(post.engagementSummary, source.engagementSummary);
    assert.equal(post.viewerReaction, source.viewerReaction);
    assert.equal(post.viewerHasShared, source.viewerHasShared);
    assert.equal(post.createdAt, source.createdAt);
    const counts = Object.values(post.engagementSummary.reactions);
    assert.equal(counts.length, 6);
    assert.ok(counts.every((count) => Number.isInteger(count) && count >= 0));
    assert.equal(counts.reduce((sum, count) => sum + count, 0), post.engagementSummary.totalReactions);
  }
  assert.deepEqual(result.postsById["post-coastal-walk"].engagementSummary, {
    reactions: { like: 20, love: 3, haha: 0, wow: 1, sad: 0, angry: 0 },
    totalReactions: 24,
    commentCount: 3,
    shareCount: 2,
  });
});

test("rich-text entity values and UTF-16 offsets are copied without parsing or rewriting", () => {
  const input = structuredClone(feedFixture);
  input.posts[0].body = {
    text: "Café 🌊 @maya #coast https://example.test",
    entities: [
      { type: "mention", start: 8, end: 13, userId: "user-maya-chen" },
      { type: "hashtag", start: 14, end: 20 },
      { type: "link", start: 21, end: 41, url: "https://example.test" },
    ],
  };
  const body = normalizeFeed(input).postsById["post-coastal-walk"].body;

  assert.equal(body.text, body.text.normalize("NFC"));
  assert.deepEqual(body, input.posts[0].body);
  assert.deepEqual(body.entities.map(({ start, end }) => body.text.slice(start, end)), [
    "@maya", "#coast", "https://example.test",
  ]);
});

test("empty input yields empty records and ordering while preserving metadata", () => {
  const result = normalizeFeed({ feed: feedFixture.feed, posts: [] });

  assert.deepEqual(result, {
    feed: { ...feedFixture.feed, postIds: [] },
    postsById: {},
    usersById: {},
    mediaById: {},
  });
});

test("normalization accepts deeply frozen input and leaves every source value unchanged", () => {
  const input = structuredClone(feedFixture);
  const before = structuredClone(input);
  deepFreeze(input);

  normalizeFeed(input);

  assert.deepEqual(input, before);
});

test("mutating a normalized result does not change the input", () => {
  const input = structuredClone(feedFixture);
  input.posts[0].body = {
    text: "#coast",
    entities: [{ type: "hashtag", start: 0, end: 6 }],
  };
  const before = structuredClone(input);
  const result = normalizeFeed(input);
  result.feed.postIds.push("unrelated-post");
  result.feed.generation = "changed";
  result.postsById["post-coastal-walk"].body.entities[0].end = 99;
  result.postsById["post-coastal-walk"].engagementSummary.reactions.like = 0;
  result.usersById["user-maya-chen"].relationshipToViewer.isBlocked = true;
  result.mediaById["media-coastal-cove"].alt = "Changed";

  assert.deepEqual(input, before);
});

test("prototype-like IDs remain ordinary own records with valid references", () => {
  const input = structuredClone(feedFixture);
  const first = input.posts[0];
  first.id = "__proto__";
  first.author.id = "constructor";
  first.media[0].id = "__proto__";
  input.posts = [first];
  const result = normalizeFeed(input);

  assert.deepEqual(result.feed.postIds, ["__proto__"]);
  assert.ok(Object.hasOwn(result.postsById, "__proto__"));
  assert.ok(Object.hasOwn(result.usersById, "constructor"));
  assert.ok(Object.hasOwn(result.mediaById, "__proto__"));
  assert.equal(result.postsById["__proto__"].authorId, "constructor");
  assert.deepEqual(result.postsById["__proto__"].mediaIds, ["__proto__"]);
  assert.equal(Object.getPrototypeOf(result.postsById), Object.prototype);
});

test("getFeed resolves normalized fixture data independently on each call", async () => {
  const first = await getFeed();
  first.feed.postIds.length = 0;
  first.usersById["user-maya-chen"].name = "Changed";
  first.postsById["post-coastal-walk"].engagementSummary.reactions.like = 0;
  const second = await getFeed();

  assert.deepEqual(second.feed.postIds, ["post-coastal-walk", "post-morning-coffee", "post-small-reminder"]);
  assert.equal(second.usersById["user-maya-chen"].name, "Maya Chen");
  assert.equal(second.postsById["post-coastal-walk"].engagementSummary.reactions.like, 24);
  assert.equal(second.postsById["post-coastal-walk"].authorId, "user-maya-chen");
  assert.deepEqual(second.postsById["post-coastal-walk"].mediaIds, ["media-coastal-cove"]);
});
