"use client";

import { HOME_FEED_ID } from "@/demo/config";
import { useFeedStore } from "@/modules/feed/FeedStoreProvider";
import { FeedLoadState } from "./FeedLoadState";
import { PostCard } from "./PostCard";

export function FeedPosts() {
  const postIds = useFeedStore((state) => state.feedsById[HOME_FEED_ID]?.postIds);
  const status = useFeedStore((state) => state.loadStatus);

  if (status !== "success") return <FeedLoadState />;
  const count = postIds?.length ?? 0;

  return (
    <>
      <div className="feed-heading">
        <h2>Latest moments</h2>
        <p>{count} sample {count === 1 ? "post" : "posts"}</p>
      </div>
      {count === 0 ? <p className="muted" role="status">No moments to show yet.</p> : (
        <div className="feed">
          {postIds?.map((id, index) => <PostCard key={id} postId={id} first={index === 0} />)}
        </div>
      )}
      <p id="reactions-note" className="page-note">
        A static preview. Likes are unavailable in this demo.
      </p>
    </>
  );
}
