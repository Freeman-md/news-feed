import { createStore } from "zustand/vanilla";
import { getFeed } from "./feed.service";
import type { FeedStore, NormalizedFeedData } from "./feed.types";

export function createFeedStore(loader: () => Promise<NormalizedFeedData> = getFeed) {
  let inFlight: Promise<void> | null = null;

  return createStore<FeedStore>()((set, get) => ({
    feedsById: {},
    postsById: {},
    usersById: {},
    mediaById: {},
    composerDraft: {
      body: { text: "", entities: [] },
      mediaIds: [],
      uploadState: "idle",
      submitState: "idle",
    },
    loadStatus: "idle",
    loadError: null,
    loadFeed: () => {
      if (get().loadStatus === "success") return Promise.resolve();
      if (inFlight) return inFlight;

      // Install the guard before notifying subscribers; defer even a throwing loader.
      inFlight = Promise.resolve().then(loader).then((data) => {
        set((state) => ({
          feedsById: { ...state.feedsById, [data.feed.id]: data.feed },
          postsById: data.postsById,
          usersById: data.usersById,
          mediaById: data.mediaById,
          loadStatus: "success",
          loadError: null,
        }));
      }).catch(() => {
        set({ loadStatus: "error", loadError: "We couldn’t load your feed. Please try again." });
      }).finally(() => {
        inFlight = null;
      });
      set({ loadStatus: "loading", loadError: null });
      return inFlight;
    },
    setDraftText: (text) => set((state) => ({
      composerDraft: {
        ...state.composerDraft,
        body: { text, entities: [] },
      },
    })),
  }));
}
