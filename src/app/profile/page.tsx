import type { Metadata } from "next";
import { Avatar } from "@/components/Avatar";
import { demoAuthor } from "@/demo/content";

export const metadata: Metadata = { title: "Profile · NewsFeed" };

export default function ProfilePage() {
  return (
    <>
      <div className="page-intro">
        <p className="eyebrow">The person behind the moments</p>
        <h1>Your profile</h1>
        <p className="muted">A little introduction.</p>
      </div>
      <section className="surface profile" aria-labelledby="profile-name">
        <Avatar initials={demoAuthor.initials} large />
        <div className="profile-identity">
          <h2 id="profile-name">{demoAuthor.name}</h2>
          <p className="muted">{demoAuthor.handle}</p>
        </div>
        <p className="profile-bio">{demoAuthor.bio}</p>
        <p className="demo-label">Demo profile</p>
      </section>
    </>
  );
}
