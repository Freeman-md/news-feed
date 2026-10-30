"use client";

import { useFeedStore } from "@/modules/feed/FeedStoreProvider";

export function FeedLoadState() {
  const status = useFeedStore((state) => state.loadStatus);
  const error = useFeedStore((state) => state.loadError);
  const loadFeed = useFeedStore((state) => state.loadFeed);

  if (status === "error") {
    return (
      <div className="load-feedback">
        <p role="alert">{error}</p>
        <button type="button" className="retry-button" onClick={() => void loadFeed()}>Try again</button>
      </div>
    );
  }

  if (status === "idle" || status === "loading") {
    return <p className="muted" role="status">Loading your feed…</p>;
  }

  return null;
}
