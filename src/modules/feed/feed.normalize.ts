import type { Media } from "@/models/media";
import type { Post } from "@/models/post";
import type { User } from "@/models/user";
import type { NestedFeedInput, NormalizedFeedData } from "./feed.types";

// The first appearance fixes feed order; the last record for each entity ID wins.
export function normalizeFeed(input: NestedFeedInput): NormalizedFeedData {
  const postsById = new Map<string, Post>();
  const usersById = new Map<string, User>();
  const mediaById = new Map<string, Media>();

  // Detach returned records so callers cannot mutate the input or shared fixtures.
  for (const { author, media, ...post } of structuredClone(input.posts)) {
    usersById.set(author.id, author);
    for (const asset of media) {
      mediaById.set(asset.id, asset);
    }
    postsById.set(post.id, {
      ...post,
      authorId: author.id,
      mediaIds: media.map((asset) => asset.id),
    });
  }

  return {
    feed: { ...input.feed, postIds: [...postsById.keys()] },
    postsById: Object.fromEntries(postsById),
    usersById: Object.fromEntries(usersById),
    mediaById: Object.fromEntries(mediaById),
  };
}
