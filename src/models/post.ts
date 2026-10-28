export type PostBody = {
  text: string;
  // UTF-16 code-unit offsets into NFC-normalized text.
  entities: Array<{
    type: "mention" | "hashtag" | "link";
    start: number;
    end: number;
    userId?: string;
    url?: string;
  }>;
};

export type ReactionType = "like" | "love" | "haha" | "wow" | "sad" | "angry";

export type EngagementSummary = {
  reactions: Record<ReactionType, number>;
  totalReactions: number;
  commentCount: number;
  shareCount: number;
};

export type Post = {
  id: string;
  authorId: string;
  body: PostBody;
  mediaIds: string[];
  engagementSummary: EngagementSummary;
  viewerReaction: ReactionType | null;
  viewerHasShared: boolean;
  createdAt: string; // ISO 8601
};
