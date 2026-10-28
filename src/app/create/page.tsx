import type { Metadata } from "next";
import { ComposerForm } from "@/components/ComposerForm";
import { demoAuthor } from "@/demo/content";

export const metadata: Metadata = { title: "Create a post · NewsFeed" };

export default function CreatePage() {
  return (
    <>
      <div className="page-intro">
        <p className="eyebrow">A moment of your own</p>
        <h1>Create a post</h1>
        <p className="muted">Start with a thought, a place, a little inspiration.</p>
      </div>
      <ComposerForm author={demoAuthor} />
    </>
  );
}
