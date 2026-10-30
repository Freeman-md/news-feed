import { FeedPosts } from "@/components/FeedPosts";

export default function Home() {
  return (
    <>
      <div className="page-intro">
        <p className="eyebrow">The everyday, shared</p>
        <h1>Your feed</h1>
        <p className="muted">Small moments. Fresh perspectives.</p>
      </div>
      <FeedPosts />
    </>
  );
}
