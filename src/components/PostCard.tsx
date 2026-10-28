import Image from "next/image";
import { Avatar } from "./Avatar";
import { Icon } from "./Icon";

export type PostCardProps = {
  author: { name: string; initials: string };
  timestamp: { label: string; dateTime: string };
  caption: string;
  reactionSummary: string;
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    loading?: "eager" | "lazy";
  };
};

export function PostCard({ author, timestamp, caption, reactionSummary, image }: PostCardProps) {
  return (
    <article className="surface post-card" aria-label={`Sample post by ${author.name}`}>
      <header className="post-author">
        <Avatar initials={author.initials} />
        <div className="author-details">
          <h3>{author.name}</h3>
          <p><time dateTime={timestamp.dateTime}>{timestamp.label}</time></p>
        </div>
      </header>
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading={image.loading}
          sizes="(max-width: 552px) calc(100vw - 34px), 518px"
          className="post-image"
        />
      ) : null}
      <div className={`post-content${image ? "" : " post-text-only"}`}>
        <p className="post-caption">{caption}</p>
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
