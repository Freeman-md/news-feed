import { PostCard } from "@/components/PostCard";
import { samplePosts } from "@/demo/content";

export default function Home() {
  return (
    <>
      <div className="page-intro">
        <p className="eyebrow">The everyday, shared</p>
        <h1>Your feed</h1>
        <p className="muted">Small moments. Fresh perspectives.</p>
      </div>
      <div className="feed-heading">
        <h2>Latest moments</h2>
        <p>3 sample posts</p>
      </div>
      <div className="feed">
        {samplePosts.map(({ key, ...post }) => <PostCard key={key} {...post} />)}
      </div>
      <p id="reactions-note" className="page-note">
        A static preview. Likes are unavailable in this demo.
      </p>
    </>
  );
}
