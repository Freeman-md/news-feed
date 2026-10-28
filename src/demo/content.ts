import type { PostCardProps } from "@/components/PostCard";

// Presentation samples only; these are not canonical entities or a data layer.
export const demoAuthor = {
  name: "Maya Chen",
  initials: "MC",
  handle: "@mayachen",
  bio: "Collecting quiet corners, long walks, and good coffee. Finding a little inspiration in the everyday.",
};

export const samplePosts = [
  {
    key: "coastal-walk",
    author: demoAuthor,
    timestamp: { label: "Oct 28 · 9:30 am", dateTime: "2026-10-28T09:30:00Z" },
    caption: "Took the longer way home. Some views are worth getting a little lost for.",
    reactionSummary: "24 likes",
    image: {
      src: "/samples/coastal-cove.webp",
      loading: "eager",
      alt: "Clear turquoise water in a rocky cove, with a pine tree on the sunlit limestone shore.",
      width: 1200,
      height: 800,
    },
  },
  {
    key: "morning-coffee",
    author: { name: "Leo Park", initials: "LP" },
    timestamp: { label: "Oct 28 · 8:45 am", dateTime: "2026-10-28T08:45:00Z" },
    caption: "A slow start, a warm cup, and a page with no plans yet.",
    reactionSummary: "18 likes",
    image: {
      src: "/samples/morning-coffee.webp",
      alt: "A ceramic cup of coffee, an open blank notebook, and a leafy branch on a sunlit café table.",
      width: 1200,
      height: 800,
    },
  },
  {
    key: "small-reminder",
    author: demoAuthor,
    timestamp: { label: "Oct 27 · 5:15 pm", dateTime: "2026-10-27T17:15:00Z" },
    caption: "A small reminder to look up from your screen today. There’s usually something good happening just outside the frame.",
    reactionSummary: "12 likes",
  },
] satisfies (PostCardProps & { key: string })[];
