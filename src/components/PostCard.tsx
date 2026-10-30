"use client";

import Image from "next/image";
import { useFeedStore } from "@/modules/feed/FeedStoreProvider";
import { Avatar } from "./Avatar";
import { Icon } from "./Icon";

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const timeFormat = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" });

function PostImage({ mediaId, eager }: { mediaId: string; eager: boolean }) {
  const image = useFeedStore((state) => state.mediaById[mediaId]);
  if (!image) return <p role="alert">Post image is unavailable.</p>;

  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading={eager ? "eager" : "lazy"}
      sizes="(max-width: 552px) calc(100vw - 34px), 518px"
      className="post-image"
    />
  );
}

export function PostCard({ postId, first = false }: { postId: string; first?: boolean }) {
  const post = useFeedStore((state) => state.postsById[postId]);
  const author = useFeedStore((state) => post ? state.usersById[post.authorId] : undefined);
  if (!post || !author) return <p role="alert">Post is unavailable.</p>;

  const date = new Date(post.createdAt);
  const timestamp = `${dateFormat.format(date)} · ${timeFormat.format(date).toLowerCase()}`;
  const count = post.engagementSummary.totalReactions;
  const label = count === post.engagementSummary.reactions.like ? "like" : "reaction";
  const reactionSummary = `${count} ${label}${count === 1 ? "" : "s"}`;
  const hasImage = post.mediaIds.length > 0;
  return (
    <article className="surface post-card" aria-label={`Sample post by ${author.name}`}>
      <header className="post-author">
        <Avatar name={author.name} />
        <div className="author-details">
          <h3>{author.name}</h3>
          <p><time dateTime={post.createdAt}>{timestamp}</time></p>
        </div>
      </header>
      {post.mediaIds.map((id, index) => <PostImage key={`${id}-${index}`} mediaId={id} eager={first && index === 0} />)}
      <div className={`post-content${hasImage ? "" : " post-text-only"}`}>
        <p className="post-caption">{post.body.text}</p>
        <footer className="post-footer">
          <p className="reaction-summary">{reactionSummary}</p>
          <button type="button" className="like-button" disabled aria-describedby="reactions-note">
            <Icon name="heart" />Like
          </button>
        </footer>
      </div>
    </article>
  );
}
