import type { Feed } from "@/models/feed";
import type { Media } from "@/models/media";
import type { Post } from "@/models/post";
import type { User } from "@/models/user";

export type NormalizedFeedData = {
  feed: Feed;
  postsById: Record<string, Post>;
  usersById: Record<string, User>;
  mediaById: Record<string, Media>;
};

// Temporary nested fixture representation, not the final API contract.
export type NestedFeedPost = Omit<Post, "authorId" | "mediaIds"> & {
  author: User;
  media: Media[];
};

// Temporary fixture input; no HTTP request/response shape is approved yet.
export type NestedFeedInput = {
  feed: Omit<Feed, "postIds">;
  posts: NestedFeedPost[];
};
