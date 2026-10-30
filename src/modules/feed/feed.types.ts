import type { Feed } from "@/models/feed";
import type { ComposerDraft } from "@/models/composer";
import type { Media } from "@/models/media";
import type { Post } from "@/models/post";
import type { User } from "@/models/user";

export type FeedState = {
  feedsById: Record<string, Feed>;
  postsById: Record<string, Post>;
  usersById: Record<string, User>;
  mediaById: Record<string, Media>;
  composerDraft: ComposerDraft;
  loadStatus: "idle" | "loading" | "success" | "error";
  loadError: string | null;
};

export type FeedActions = {
  loadFeed: () => Promise<void>;
  setDraftText: (text: string) => void;
};

export type FeedStore = FeedState & FeedActions;

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
