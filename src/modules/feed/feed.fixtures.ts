import type { NestedFeedInput } from "./feed.types";

// Data-preparation samples, separate from the presentation samples until Task 4.
// Empty profilePhotoUrl explicitly means a demo profile image is unavailable.
export const feedFixture: NestedFeedInput = {
  feed: {
    id: "feed-home",
    generation: "demo-feed-v1",
    olderCursor: null,
    newerCursor: null,
    hasOlder: false,
    hasNewer: false,
    lastFetchedAt: 1793181600000,
  },
  posts: [
    {
      id: "post-coastal-walk",
      author: {
        id: "user-maya-chen",
        name: "Maya Chen",
        handle: "@mayachen",
        profilePhotoUrl: "",
        isVerified: false,
        relationshipToViewer: {
          isFriend: false,
          isFollowing: false,
          isMuted: false,
          isBlocked: false,
        },
      },
      body: {
        text: "Took the longer way home. Some views are worth getting a little lost for.",
        entities: [],
      },
      media: [{
        id: "media-coastal-cove",
        src: "/samples/coastal-cove.webp",
        alt: "Clear turquoise water in a rocky cove, with a pine tree on the sunlit limestone shore.",
        width: 1200,
        height: 800,
      }],
      engagementSummary: {
        reactions: { like: 24, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
        totalReactions: 24,
        commentCount: 3,
        shareCount: 2,
      },
      viewerReaction: "like",
      viewerHasShared: false,
      createdAt: "2026-10-28T09:30:00Z",
    },
    {
      id: "post-morning-coffee",
      author: {
        id: "user-leo-park",
        name: "Leo Park",
        handle: "@leopark",
        profilePhotoUrl: "",
        isVerified: false,
        relationshipToViewer: {
          isFriend: true,
          isFollowing: true,
          isMuted: false,
          isBlocked: false,
        },
      },
      body: {
        text: "A slow start, a warm cup, and a page with no plans yet.",
        entities: [],
      },
      media: [{
        id: "media-morning-coffee",
        src: "/samples/morning-coffee.webp",
        alt: "A ceramic cup of coffee, an open blank notebook, and a leafy branch on a sunlit café table.",
        width: 1200,
        height: 800,
      }],
      engagementSummary: {
        reactions: { like: 18, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
        totalReactions: 18,
        commentCount: 1,
        shareCount: 0,
      },
      viewerReaction: null,
      viewerHasShared: false,
      createdAt: "2026-10-28T08:45:00Z",
    },
    {
      id: "post-small-reminder",
      author: {
        id: "user-maya-chen",
        name: "Maya Chen",
        handle: "@mayachen",
        profilePhotoUrl: "",
        isVerified: false,
        relationshipToViewer: {
          isFriend: false,
          isFollowing: false,
          isMuted: false,
          isBlocked: false,
        },
      },
      body: {
        text: "A small reminder to look up from your screen today. There’s usually something good happening just outside the frame.",
        entities: [],
      },
      media: [],
      engagementSummary: {
        reactions: { like: 12, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
        totalReactions: 12,
        commentCount: 0,
        shareCount: 0,
      },
      viewerReaction: null,
      viewerHasShared: false,
      createdAt: "2026-10-27T17:15:00Z",
    },
  ],
};
