"use client";

import { DEMO_BIO, DEMO_USER_ID } from "@/demo/config";
import { useFeedStore } from "@/modules/feed/FeedStoreProvider";
import { Avatar } from "./Avatar";
import { FeedLoadState } from "./FeedLoadState";

export function ProfileDetails() {
  const author = useFeedStore((state) => state.usersById[DEMO_USER_ID]);
  const status = useFeedStore((state) => state.loadStatus);

  if (!author) return status === "success"
    ? <p role="status">Demo profile is unavailable.</p>
    : <FeedLoadState />;

  return (
    <section className="surface profile" aria-labelledby="profile-name">
      <Avatar name={author.name} large />
      <div className="profile-identity">
        <h2 id="profile-name">{author.name}</h2>
        <p className="muted">{author.handle}</p>
      </div>
      <p className="profile-bio">{DEMO_BIO}</p>
      <p className="demo-label">Demo profile</p>
    </section>
  );
}
